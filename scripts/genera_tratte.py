#!/usr/bin/env python3
"""Genera i motori GPS e di calibrazione dai KMZ esportati da Google Earth."""

from __future__ import annotations

import json
import math
import re
import unicodedata
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KML_NS = {"k": "http://www.opengis.net/kml/2.2"}


def haversine(a: tuple[float, float], b: tuple[float, float]) -> float:
    radius = 6_371_008.8
    lat1, lon1 = map(math.radians, a)
    lat2, lon2 = map(math.radians, b)
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    value = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    )
    return 2 * radius * math.asin(math.sqrt(value))


def normalize_name(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def read_kmz(path: Path) -> tuple[list[dict], dict[str, tuple[float, float]]]:
    with zipfile.ZipFile(path) as archive:
        kml_name = next(name for name in archive.namelist() if name.lower().endswith(".kml"))
        root = ET.fromstring(archive.read(kml_name))

    coordinate_text = root.find(".//k:LineString/k:coordinates", KML_NS).text or ""
    raw_points = []
    for item in coordinate_text.split():
        lon, lat, *_ = item.split(",")
        raw_points.append((float(lat), float(lon)))

    cumulative = 0.0
    points = []
    for index, (lat, lon) in enumerate(raw_points):
        if index:
            cumulative += haversine(raw_points[index - 1], raw_points[index])
        points.append({"lat": round(lat, 9), "lon": round(lon, 9), "d": round(cumulative, 2)})

    placemarks: dict[str, tuple[float, float]] = {}
    for placemark in root.findall(".//k:Placemark", KML_NS):
        name_node = placemark.find("k:name", KML_NS)
        point_node = placemark.find(".//k:Point/k:coordinates", KML_NS)
        if name_node is None or point_node is None or not point_node.text:
            continue
        lon, lat, *_ = point_node.text.strip().split(",")
        placemarks[normalize_name(name_node.text or "")] = (float(lat), float(lon))

    return points, placemarks


def nearest_distance(points: list[dict], coordinate: tuple[float, float]) -> float:
    gps_lat, gps_lon = coordinate
    best_distance = float("inf")
    best_master = 0.0
    for a, b in zip(points, points[1:]):
        lat0 = math.radians((a["lat"] + b["lat"] + gps_lat) / 3)
        mx = 111_320 * math.cos(lat0)
        my = 110_540
        ax, ay = a["lon"] * mx, a["lat"] * my
        bx, by = b["lon"] * mx, b["lat"] * my
        px, py = gps_lon * mx, gps_lat * my
        dx, dy = bx - ax, by - ay
        length_squared = dx * dx + dy * dy
        t = 0 if length_squared == 0 else max(
            0, min(1, ((px - ax) * dx + (py - ay) * dy) / length_squared)
        )
        distance = math.hypot(px - (ax + t * dx), py - (ay + t * dy))
        if distance < best_distance:
            best_distance = distance
            best_master = a["d"] + (b["d"] - a["d"]) * t
    return best_master


MASTER_TEMPLATE = """// Generato da scripts/genera_tratte.py. Non modificare manualmente.
export const {constant_name} = {points};

function toRad(value) {{
  return (value * Math.PI) / 180;
}}

function projectPointToSegmentMeters(gps, a, b) {{
  const lat0 = toRad((a.lat + b.lat + gps.lat) / 3);
  const mx = 111320 * Math.cos(lat0);
  const my = 110540;
  const ax = a.lon * mx;
  const ay = a.lat * my;
  const bx = b.lon * mx;
  const by = b.lat * my;
  const px = gps.lon * mx;
  const py = gps.lat * my;
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;

  if (len2 === 0) {{
    return {{ t: 0, distanceMeters: Math.hypot(px - ax, py - ay), lat: a.lat, lon: a.lon }};
  }}

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return {{
    t,
    distanceMeters: Math.hypot(px - cx, py - cy),
    lat: a.lat + (b.lat - a.lat) * t,
    lon: a.lon + (b.lon - a.lon) * t,
  }};
}}

export function trovaPosizioneSuMasterDaGps(location) {{
  if (!location || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) return null;
  const gps = {{ lat: location.latitude, lon: location.longitude }};
  let best = null;

  for (let i = 0; i < {constant_name}.length - 1; i += 1) {{
    const a = {constant_name}[i];
    const b = {constant_name}[i + 1];
    const projected = projectPointToSegmentMeters(gps, a, b);
    const distanzaMasterMetri = a.d + (b.d - a.d) * projected.t;
    if (!best || projected.distanceMeters < best.distanzaDaLineaMetri) {{
      best = {{
        distanzaMasterMetri,
        distanzaDaLineaMetri: projected.distanceMeters,
        puntoMaster: {{ latitude: projected.lat, longitude: projected.lon }},
        segmentoIndex: i,
      }};
    }}
  }}

  if (!best) return null;
  return {{
    ...best,
    qualitaAggancio:
      best.distanzaDaLineaMetri <= 40 ? "alta" :
      best.distanzaDaLineaMetri <= 120 ? "media" : "bassa",
  }};
}}

export function getMasterLengthMeters() {{
  const last = {constant_name}[{constant_name}.length - 1];
  return last ? last.d : 0;
}}
"""


CALIBRATION_TEMPLATE = """// Generato da scripts/genera_tratte.py. Non modificare manualmente.
const NOME = {name};
const DIREZIONE_ANDATA = {forward};
const DIREZIONE_RITORNO = {reverse};
const MASTER_LENGTH = {master_length};
const MIN_PROGRESSIVA = {min_progress};
const MAX_PROGRESSIVA = {max_progress};
const RIFERIMENTI = {references};
const ANCORAGGI = {anchors};

function isFiniteNumber(value) {{
  return typeof value === "number" && Number.isFinite(value);
}}

function formatKm(metri) {{
  if (!isFiniteNumber(metri)) return "--";
  const rounded = Math.round(Math.abs(metri));
  return `${{Math.floor(rounded / 1000)}}+${{String(rounded % 1000).padStart(3, "0")}}`;
}}

function interpola(x, punti, campoX, campoY) {{
  if (!isFiniteNumber(x) || punti.length < 2) return x;
  const ordinati = [...punti].sort((a, b) => a[campoX] - b[campoX]);
  if (x <= ordinati[0][campoX]) {{
    const a = ordinati[0];
    const b = ordinati[1];
    return a[campoY] + ((x - a[campoX]) / (b[campoX] - a[campoX])) * (b[campoY] - a[campoY]);
  }}
  for (let i = 0; i < ordinati.length - 1; i += 1) {{
    const a = ordinati[i];
    const b = ordinati[i + 1];
    if (x >= a[campoX] && x <= b[campoX]) {{
      return a[campoY] + ((x - a[campoX]) / (b[campoX] - a[campoX])) * (b[campoY] - a[campoY]);
    }}
  }}
  const a = ordinati[ordinati.length - 2];
  const b = ordinati[ordinati.length - 1];
  return a[campoY] + ((x - a[campoX]) / (b[campoX] - a[campoX])) * (b[campoY] - a[campoY]);
}}

export function distanzaMasterToProgressivaReale(distanzaMasterMetri) {{
  return Math.max(MIN_PROGRESSIVA, Math.min(MAX_PROGRESSIVA, interpola(
    distanzaMasterMetri, ANCORAGGI, "dMaster", "progressiva"
  )));
}}

export function progressivaRealeToDistanzaMaster(progressivaMetri) {{
  return interpola(progressivaMetri, ANCORAGGI, "progressiva", "dMaster");
}}

{display_function}

export function getCalibrazioneLinea() {{
  return {{
    nome: NOME,
    direzione: DIREZIONE_ANDATA,
    stato: "Disponibile",
    salti: {jumps},
    gallerie: [],
    ancoraggi: ANCORAGGI,
    totaleSalti: {jump_total},
    lunghezzaProgressivaUfficiale: MAX_PROGRESSIVA - MIN_PROGRESSIVA,
    lunghezzaFisicaStimata: MAX_PROGRESSIVA - MIN_PROGRESSIVA,
    lunghezzaMasterMetri: MASTER_LENGTH,
    fattoreMasterSuFisica: MASTER_LENGTH / (MAX_PROGRESSIVA - MIN_PROGRESSIVA),
    fattoreFisicaSuMaster: (MAX_PROGRESSIVA - MIN_PROGRESSIVA) / MASTER_LENGTH,
  }};
}}

function trovaRiferimentoPiuVicino(progressivaMetri) {{
  let best = null;
  for (const riferimento of RIFERIMENTI) {{
    const distanza = Math.abs(progressivaMetri - riferimento.progressiva);
    if (!best || distanza < best.distanza) best = {{ ...riferimento, distanza }};
  }}
  return best ? {{
    nome: best.nome,
    tipo: best.tipo,
    progressivaMetri: best.progressiva,
    progressiva: metriToProgressiva(best.progressiva),
    distanza: best.distanza,
  }} : null;
}}

export function descriviPosizioneSuMaster(distanzaMasterMetri) {{
  const distanzaMasterPulita = Math.max(0, Number(distanzaMasterMetri) || 0);
  const progressivaRealeMetri = distanzaMasterToProgressivaReale(distanzaMasterPulita);
  return {{
    distanzaMasterMetri: distanzaMasterPulita,
    distanzaMaster: `${{Math.round(distanzaMasterPulita)}} m`,
    progressivaRealeMetri,
    progressivaReale: metriToProgressiva(progressivaRealeMetri),
    riferimentoPiuVicino: trovaRiferimentoPiuVicino(progressivaRealeMetri),
    galleria: null,
    saltoVicino: null,
    calibrazione: getCalibrazioneLinea(),
  }};
}}

export function creaTabellaRiferimentiCalibrati() {{
  return RIFERIMENTI.map((riferimento) => ({{
    ...riferimento,
    progressivaMetri: riferimento.progressiva,
    progressiva: metriToProgressiva(riferimento.progressiva),
    distanzaMasterMetri: progressivaRealeToDistanzaMaster(riferimento.progressiva),
  }}));
}}

export function creaTabellaGallerieCalibrate() {{
  return [];
}}

export function trovaProssimaLocalita(progressivaMetri, direzioneMappa = DIREZIONE_ANDATA) {{
  if (!isFiniteNumber(progressivaMetri)) return null;
  const ordinati = [...RIFERIMENTI].sort((a, b) => a.progressiva - b.progressiva);
  const avanti = direzioneMappa === DIREZIONE_ANDATA;
  const candidati = avanti
    ? ordinati.filter((r) => r.progressiva > progressivaMetri + 30)
    : ordinati.filter((r) => r.progressiva < progressivaMetri - 30).reverse();
  const prossima = candidati[0];
  if (!prossima) return null;
  return {{
    nome: prossima.nome,
    tipo: prossima.tipo,
    progressivaMetri: prossima.progressiva,
    progressiva: metriToProgressiva(prossima.progressiva),
    distanzaMetri: Math.abs(prossima.progressiva - progressivaMetri),
  }};
}}
"""


FOGGIA_REFS = [
    ("Foggia", 526027),
    ("Incoronata", 536309),
    ("Ortanova", 545661),
    ("Cerignola", 560292),
    ("Trinitapoli", 577692),
    ("Barletta", 593919),
    ("Trani", 606513),
    ("Bisceglie", 614534),
    ("Molfetta", 623875),
    ("Giovinazzo", 630190),
    ("Bari S. Spirito", 637074),
    ("Bari Palese", 639055),
    ("Bari Zona Industriale", 644650),
    ("Bari Centrale", 648594),
    ("Bari Parco Sud", 651005),
    ("Bari Torre Quetta", 652544),
    ("Bari Torre a Mare", 660069),
    ("Mola di Bari", 667771),
    ("Polignano a Mare", 681575),
    ("Monopoli", 689160),
    ("Fasano", 702989),
    ("Cisternino", 710146),
    ("Ostuni", 722894),
    ("Carovigno", 731875),
    ("San Vito", 747836),
    ("Brindisi", 759539),
    ("S. Pietro Vernotico", 776562),
    ("Squinzano", 783303),
    ("Trepuzzi", 787504),
    ("Surbo", 794332),
    ("Lecce", 797903),
]

BARI_REFS = [
    ("Bari Centrale", 0),
    ("Bari Parco Nord", 2549),
    ("Bari S. Rita", 7286),
    ("Bari Loseto", 10654),
    ("Bitritto", 11949),
]


def write_route(
    *,
    kmz: str,
    stem: str,
    constant_name: str,
    display_name: str,
    forward: str,
    reverse: str,
    ref_specs: list[tuple[str, int]],
    special_bari: bool = False,
) -> None:
    points, placemarks = read_kmz(ROOT / kmz)
    references = []
    anchors = []
    total_master = points[-1]["d"]

    for name, progressiva in ref_specs:
        coordinate = placemarks.get(normalize_name(name))
        if coordinate:
            d_master = nearest_distance(points, coordinate)
            lat, lon = coordinate
        elif special_bari and name == "Bari Parco Nord":
            d_master = progressiva
            nearest = min(points, key=lambda p: abs(p["d"] - d_master))
            lat, lon = nearest["lat"], nearest["lon"]
        elif not coordinate:
            min_progress = ref_specs[0][1]
            max_progress = ref_specs[-1][1]
            d_master = total_master * (progressiva - min_progress) / (max_progress - min_progress)
            nearest = min(points, key=lambda p: abs(p["d"] - d_master))
            lat, lon = nearest["lat"], nearest["lon"]
        references.append({
            "nome": name,
            "tipo": "stazione",
            "progressiva": progressiva,
            "lat": round(lat, 9),
            "lon": round(lon, 9),
        })
        anchors.append({"dMaster": round(d_master, 2), "progressiva": progressiva})

    master_text = MASTER_TEMPLATE.format(
        constant_name=constant_name,
        points=json.dumps(points, ensure_ascii=True, separators=(",", ":")),
    )
    (ROOT / f"master_{stem}.js").write_text(master_text, encoding="utf-8")

    if special_bari:
        display_function = """export function metriToProgressiva(metri) {
  if (!isFiniteNumber(metri)) return "--";
  const p = Math.max(MIN_PROGRESSIVA, Math.min(MAX_PROGRESSIVA, metri));
  if (p <= 2549) return formatKm(p);
  const progressivaDopoParcoNord = p - 2549;
  if (progressivaDopoParcoNord <= 646) return formatKm(progressivaDopoParcoNord);
  return formatKm(progressivaDopoParcoNord - 116);
}"""
        jumps = json.dumps([
            {"prima": 2549, "dopo": 0, "nota": "Cambio progressiva Bari Parco Nord"},
            {"prima": 646, "dopo": 530, "nota": "Salto progressiva segnalato"},
        ])
        jump_total = 2665
    else:
        display_function = """export function metriToProgressiva(metri) {
  return formatKm(metri);
}"""
        jumps = "[]"
        jump_total = 0

    calibration_text = CALIBRATION_TEMPLATE.format(
        name=json.dumps(display_name),
        forward=json.dumps(forward),
        reverse=json.dumps(reverse),
        master_length=total_master,
        min_progress=ref_specs[0][1],
        max_progress=ref_specs[-1][1],
        references=json.dumps(references, ensure_ascii=True, separators=(",", ":")),
        anchors=json.dumps(anchors, ensure_ascii=True, separators=(",", ":")),
        display_function=display_function,
        jumps=jumps,
        jump_total=jump_total,
    )
    (ROOT / f"calibrazione_{stem}.js").write_text(calibration_text, encoding="utf-8")


write_route(
    kmz="Foggia-Lecce.kmz",
    stem="foggia_lecce",
    constant_name="MASTER_FOGGIA_LECCE_POINTS",
    display_name="Foggia - Lecce",
    forward="foggia_lecce",
    reverse="lecce_foggia",
    ref_specs=FOGGIA_REFS,
)

write_route(
    kmz="Bari-Bitritto.kmz",
    stem="bari_bitritto",
    constant_name="MASTER_BARI_BITRITTO_POINTS",
    display_name="Bari - Bitritto",
    forward="bari_bitritto",
    reverse="bitritto_bari",
    ref_specs=BARI_REFS,
    special_bari=True,
)

print("Tratte generate: Foggia-Lecce, Bari-Bitritto")
