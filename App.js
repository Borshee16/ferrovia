// App.js
// VERSIONE ASCII SAFE - Taranto Potenza sbloccata - niente caratteri speciali
// DoveSono? - Android
// UI Focus One: Mappa / Home / Resoconti-Giunti / Impostazioni

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as TaskManager from "expo-task-manager";
import * as DocumentPicker from "expo-document-picker";

import {
  descriviPosizioneSuMaster,
  creaTabellaRiferimentiCalibrati,
  creaTabellaGallerieCalibrate,
  getCalibrazioneLinea,
} from "./calibrazione_bari_taranto";

import {
  descriviPosizioneSuMaster as descriviPosizioneTarantoBrindisi,
  creaTabellaRiferimentiCalibrati as creaTabellaRiferimentiTarantoBrindisi,
  creaTabellaGallerieCalibrate as creaTabellaGallerieTarantoBrindisi,
  getCalibrazioneLinea as getCalibrazioneTarantoBrindisi,
  trovaProssimaLocalita as trovaProssimaLocalitaTarantoBrindisi,
} from "./calibrazione_taranto_brindisi";

import {
  descriviPosizioneSuMaster as descriviPosizioneTarantoPotenza,
  creaTabellaRiferimentiCalibrati as creaTabellaRiferimentiTarantoPotenza,
  creaTabellaGallerieCalibrate as creaTabellaGallerieTarantoPotenza,
  getCalibrazioneLinea as getCalibrazioneTarantoPotenza,
  trovaProssimaLocalita as trovaProssimaLocalitaTarantoPotenza,
} from "./calibrazione_taranto_potenza";

import {
  descriviPosizioneSuMaster as descriviPosizioneBariBitritto,
  trovaProssimaLocalita as trovaProssimaLocalitaBariBitritto,
} from "./calibrazione_bari_bitritto";

import {
  descriviPosizioneSuMaster as descriviPosizioneFoggiaLecce,
  trovaProssimaLocalita as trovaProssimaLocalitaFoggiaLecce,
} from "./calibrazione_foggia_lecce";

import { trovaPosizioneSuMasterDaGps } from "./master_bari_taranto";
import { trovaPosizioneSuMasterDaGps as trovaPosizioneTarantoBrindisiDaGps } from "./master_taranto_brindisi";
import { trovaPosizioneSuMasterDaGps as trovaPosizioneTarantoPotenzaDaGps } from "./master_taranto_potenza";
import { trovaPosizioneSuMasterDaGps as trovaPosizioneBariBitrittoDaGps } from "./master_bari_bitritto";
import { trovaPosizioneSuMasterDaGps as trovaPosizioneFoggiaLecceDaGps } from "./master_foggia_lecce";

import {
  LINEA_BARI_TARANTO,
  metriToProgressiva,
} from "./linea_bari_taranto";

const TRATTE_DOVESONO = [
  {
    id: "bari_taranto",
    nome: "Bari - Taranto",
    dettaglio: "Disponibile",
    disponibile: true,
    direzioni: [
      { id: "taranto_bari", nome: "Taranto -> Bari" },
      { id: "bari_taranto", nome: "Bari -> Taranto" },
    ],
  },
  {
    id: "taranto_brindisi",
    nome: "Taranto - Brindisi",
    dettaglio: "Disponibile",
    disponibile: true,
    direzioni: [
      { id: "taranto_brindisi", nome: "Taranto -> Brindisi" },
      { id: "brindisi_taranto", nome: "Brindisi -> Taranto" },
    ],
  },
  {
    id: "taranto_potenza",
    nome: "Taranto - Potenza",
    dettaglio: "Bozza disponibile",
    disponibile: true,
    direzioni: [
      { id: "taranto_potenza", nome: "Taranto -> Potenza" },
      { id: "potenza_taranto", nome: "Potenza -> Taranto" },
    ],
  },
  {
    id: "bari_bitritto",
    nome: "Bari - Bitritto",
    dettaglio: "Disponibile",
    disponibile: true,
    direzioni: [
      { id: "bari_bitritto", nome: "Bari -> Bitritto" },
      { id: "bitritto_bari", nome: "Bitritto -> Bari" },
    ],
  },
  {
    id: "foggia_lecce",
    nome: "Foggia - Lecce",
    dettaglio: "Disponibile",
    disponibile: true,
    direzioni: [
      { id: "foggia_lecce", nome: "Foggia -> Lecce" },
      { id: "lecce_foggia", nome: "Lecce -> Foggia" },
    ],
  },
];

function getTrattaSelezionata(trattaId) {
  return TRATTE_DOVESONO.find((tratta) => tratta.id === trattaId) || TRATTE_DOVESONO[0];
}

function getDirezioneLabel(direzioneMappa) {
  if (direzioneMappa === "bari_taranto") return "Bari -> Taranto";
  if (direzioneMappa === "taranto_bari") return "Taranto -> Bari";

  for (const tratta of TRATTE_DOVESONO) {
    const direzione = tratta.direzioni.find((item) => item.id === direzioneMappa);
    if (direzione) return direzione.nome;
  }

  return "Taranto -> Bari";
}

function getMotoreTratta(trattaId) {
  if (trattaId === "taranto_brindisi") {
    return {
      trovaDaGps: trovaPosizioneTarantoBrindisiDaGps,
      descrivi: descriviPosizioneTarantoBrindisi,
      prossimaLocalita: trovaProssimaLocalitaTarantoBrindisi,
    };
  }

  if (trattaId === "taranto_potenza") {
    return {
      trovaDaGps: trovaPosizioneTarantoPotenzaDaGps,
      descrivi: descriviPosizioneTarantoPotenza,
      prossimaLocalita: trovaProssimaLocalitaTarantoPotenza,
    };
  }

  if (trattaId === "bari_bitritto") {
    return {
      trovaDaGps: trovaPosizioneBariBitrittoDaGps,
      descrivi: descriviPosizioneBariBitritto,
      prossimaLocalita: trovaProssimaLocalitaBariBitritto,
    };
  }

  if (trattaId === "foggia_lecce") {
    return {
      trovaDaGps: trovaPosizioneFoggiaLecceDaGps,
      descrivi: descriviPosizioneFoggiaLecce,
      prossimaLocalita: trovaProssimaLocalitaFoggiaLecce,
    };
  }

  return {
    trovaDaGps: trovaPosizioneSuMasterDaGps,
    descrivi: descriviPosizioneSuMaster,
    prossimaLocalita: trovaProssimaLocalita,
  };
}

const TASK_NAME = "traccia-ferroviaria-background-location";

const MIN_DISTANCE_METERS = 10;
const MAX_ACCEPTED_ACCURACY_METERS = 80;
const MAX_REASONABLE_SPEED_KMH = 330;
const MAX_JUMP_DISTANCE_METERS = 1500;
const MIN_TIME_BETWEEN_POINTS_MS = 1000;

const STOPPED_SPEED_KMH = 8;
const STOPPED_DISTANCE_METERS = 45;
const GPX_AUTOSAVE_EVERY_POINTS = 50;
const GPS_STALE_MS = 120000;
const REANCHOR_AFTER_REJECTS = 8;
const REANCHOR_AFTER_STALE_MS = 120000;

const POINTS_FILE = FileSystem.documentDirectory + "active-track-points.json";
const META_FILE = FileSystem.documentDirectory + "active-track-meta.json";
const AUTOSAVE_GPX_FILE = FileSystem.documentDirectory + "autosave-current-track.gpx";
const TRACKS_INDEX_FILE = FileSystem.documentDirectory + "saved-tracks-index.json";
const TRACKS_DIR = FileSystem.documentDirectory + "tracks/";

function toRad(value) {
  return (value * Math.PI) / 180;
}

function haversineMeters(a, b) {
  if (!a || !b) return 0;

  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeLocation(location) {
  const c = location.coords;
  return {
    latitude: c.latitude,
    longitude: c.longitude,
    altitude: c.altitude,
    accuracy: c.accuracy,
    gpsSpeed: c.speed,
    heading: c.heading,
    timestamp: location.timestamp || Date.now(),
  };
}

function isPointStructurallyValid(point) {
  return (
    isFiniteNumber(point.latitude) &&
    isFiniteNumber(point.longitude) &&
    Math.abs(point.latitude) <= 90 &&
    Math.abs(point.longitude) <= 180
  );
}

function enrichPoint(point, previous, forcedState = null) {
  if (!previous) {
    return {
      ...point,
      segmentDistance: 0,
      rawSegmentDistance: 0,
      calculatedSpeedKmh: 0,
      movementState: forcedState || "inizio",
      rejectedReason: null,
    };
  }

  const distance = haversineMeters(previous, point);
  const dtMs = Math.max(1, point.timestamp - previous.timestamp);
  let speedKmh = (distance / (dtMs / 1000)) * 3.6;
  let movementState = forcedState || "movimento";
  let segmentDistance = distance;

  if (forcedState === "riaggancio GPS") {
    segmentDistance = 0;
    speedKmh = 0;
  } else if (distance < STOPPED_DISTANCE_METERS && speedKmh < STOPPED_SPEED_KMH) {
    segmentDistance = 0;
    speedKmh = 0;
    movementState = "fermo";
  }

  return {
    ...point,
    segmentDistance,
    rawSegmentDistance: distance,
    calculatedSpeedKmh: speedKmh,
    movementState,
    rejectedReason: null,
  };
}

function shouldAcceptPoint(point, previous) {
  if (!isPointStructurallyValid(point)) {
    return { ok: false, reason: "coordinate non valide" };
  }

  if (isFiniteNumber(point.accuracy) && point.accuracy > MAX_ACCEPTED_ACCURACY_METERS) {
    return { ok: false, reason: `precisione scarsa +/-${point.accuracy.toFixed(0)} m` };
  }

  if (!previous) return { ok: true, reason: null };

  const dtMs = point.timestamp - previous.timestamp;
  if (dtMs < MIN_TIME_BETWEEN_POINTS_MS) {
    return { ok: false, reason: "tempo troppo breve" };
  }

  const distance = haversineMeters(previous, point);

  if (distance < MIN_DISTANCE_METERS) {
    return { ok: false, reason: "movimento minimo" };
  }

  if (distance > MAX_JUMP_DISTANCE_METERS) {
    return { ok: false, reason: `salto GPS ${distance.toFixed(0)} m` };
  }

  const speedKmh = (distance / (dtMs / 1000)) * 3.6;
  if (speedKmh > MAX_REASONABLE_SPEED_KMH) {
    return { ok: false, reason: `velocita impossibile ${speedKmh.toFixed(0)} km/h` };
  }

  return { ok: true, reason: null };
}

async function ensureTracksDir() {
  if (Platform.OS === "web") return;
  const info = await FileSystem.getInfoAsync(TRACKS_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(TRACKS_DIR, { intermediates: true });
  }
}

async function loadJsonFile(path, fallback) {
  try {
    if (Platform.OS === "web") {
      const raw = window.localStorage.getItem(path);
      return raw ? JSON.parse(raw) : fallback;
    }
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return fallback;
    const raw = await FileSystem.readAsStringAsync(path);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

async function saveJsonFile(path, data) {
  if (Platform.OS === "web") {
    window.localStorage.setItem(path, JSON.stringify(data));
    return;
  }
  await FileSystem.writeAsStringAsync(path, JSON.stringify(data));
}

async function loadPointsFromFile() {
  return loadJsonFile(POINTS_FILE, []);
}

async function savePointsToFile(points) {
  await saveJsonFile(POINTS_FILE, points);
}

async function loadMetaFromFile() {
  return loadJsonFile(META_FILE, {
    trackName: "Tratta ferroviaria",
    baseTrackName: "Tratta ferroviaria",
    startedAt: null,
    lastRejectedReason: null,
    rejectedCount: 0,
    consecutiveRejected: 0,
    lastAutosaveAt: null,
    lastPointAt: null,
  });
}

async function saveMetaToFile(meta) {
  await saveJsonFile(META_FILE, meta);
}

async function loadTracksIndex() {
  return loadJsonFile(TRACKS_INDEX_FILE, []);
}

async function saveTracksIndex(index) {
  await saveJsonFile(TRACKS_INDEX_FILE, index);
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function makeGpx(trackName, points) {
  const safeName = escapeXml(trackName || "Traccia ferroviaria");

  const trkpts = points
    .map((p) => {
      const ele = Number.isFinite(p.altitude) ? `<ele>${p.altitude}</ele>` : "";
      const time = p.timestamp ? `<time>${new Date(p.timestamp).toISOString()}</time>` : "";
      const acc = Number.isFinite(p.accuracy)
        ? `<extensions><accuracy>${p.accuracy}</accuracy><speedKmh>${p.calculatedSpeedKmh || 0}</speedKmh><movementState>${escapeXml(p.movementState || "")}</movementState></extensions>`
        : "";

      return `      <trkpt lat="${p.latitude}" lon="${p.longitude}">${ele}${time}${acc}</trkpt>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Traccia Ferroviaria MVP" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>${safeName}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`;
}

function getTagValue(xml, tagName) {
  const match = xml.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? match[1].trim() : null;
}

function parseGpx(gpxText, fallbackName = "Traccia importata") {
  const name = getTagValue(gpxText, "name") || fallbackName;
  const points = [];
  const trkptRegex = /<trkpt[^>]*lat=["']([^"']+)["'][^>]*lon=["']([^"']+)["'][^>]*>([\s\S]*?)<\/trkpt>/gi;

  let match;
  let previous = null;

  while ((match = trkptRegex.exec(gpxText)) !== null) {
    const latitude = Number(match[1]);
    const longitude = Number(match[2]);
    const body = match[3] || "";

    const eleRaw = getTagValue(body, "ele");
    const timeRaw = getTagValue(body, "time");
    const accRaw = getTagValue(body, "accuracy");
    const speedRaw = getTagValue(body, "speedKmh");
    const movementRaw = getTagValue(body, "movementState");

    const rawPoint = {
      latitude,
      longitude,
      altitude: eleRaw == null ? null : Number(eleRaw),
      accuracy: accRaw == null ? null : Number(accRaw),
      gpsSpeed: null,
      heading: null,
      timestamp: timeRaw ? new Date(timeRaw).getTime() : Date.now() + points.length * 1000,
    };

    if (!isPointStructurallyValid(rawPoint)) continue;

    let point = enrichPoint(rawPoint, previous);

    if (speedRaw != null && Number.isFinite(Number(speedRaw))) {
      point.calculatedSpeedKmh = Number(speedRaw);
    }

    if (movementRaw) {
      point.movementState = movementRaw;
    }

    points.push(point);
    previous = point;
  }

  return { name, points };
}

function safeSlug(name) {
  return (
    (name || "traccia-ferroviaria")
      .toLowerCase()
      .replace(/[^a-z0-9aeeiou_-]+/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "traccia"
  );
}

function buildFileName(name, extension = "gpx") {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${safeSlug(name)}-${stamp}.${extension}`;
}

function formatDateForName(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}_${hh}-${min}`;
}

function makeAutomaticTrackName(baseName) {
  const clean = (baseName || "Tratta ferroviaria").trim() || "Tratta ferroviaria";
  return `${clean}_${formatDateForName()}`;
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) return "0 m";
  if (meters < 1000) return `${meters.toFixed(0)} m`;
  return `${(meters / 1000).toFixed(3)} km`;
}

function formatSpeedKmh(kmh) {
  if (!Number.isFinite(kmh)) return "--";
  return `${kmh.toFixed(1)} km/h`;
}

function formatCoord(value) {
  if (!Number.isFinite(value)) return "--";
  return value.toFixed(6);
}

function formatTime(timestamp) {
  if (!timestamp) return "--";
  return new Date(timestamp).toLocaleTimeString();
}

function getGpsQuality({ lastLocation, averageAccuracy, rejectedCount, points }) {
  if (!lastLocation) {
    return { label: "In attesa", detail: "nessun punto valido", level: "medium" };
  }

  const age = Date.now() - lastLocation.timestamp;
  if (age > GPS_STALE_MS) {
    return { label: "Debole", detail: "pochi punti validi", level: "medium" };
  }

  const rejectedRatio = points.length > 0 ? rejectedCount / Math.max(1, points.length + rejectedCount) : 0;
  const acc = averageAccuracy ?? lastLocation.accuracy ?? 999;

  if (acc <= 25 && rejectedRatio < 0.2) {
    return { label: "Buono", detail: `+/-${acc.toFixed(0)} m`, level: "good" };
  }

  if (acc <= 60 && rejectedRatio < 0.45) {
    return { label: "Medio", detail: `+/-${acc.toFixed(0)} m`, level: "medium" };
  }

  return { label: "Debole", detail: `+/-${acc.toFixed(0)} m`, level: "bad" };
}

async function addPointToFile(rawPoint) {
  const points = await loadPointsFromFile();
  const previous = points[points.length - 1];
  const meta = await loadMetaFromFile();

  const verdict = shouldAcceptPoint(rawPoint, previous);

  if (!verdict.ok) {
    const nextConsecutive = (meta.consecutiveRejected || 0) + 1;
    const lastPointAge = meta.lastPointAt ? rawPoint.timestamp - meta.lastPointAt : 0;
    const canReanchor =
      previous &&
      nextConsecutive >= REANCHOR_AFTER_REJECTS &&
      lastPointAge >= REANCHOR_AFTER_STALE_MS;

    if (!canReanchor) {
      await saveMetaToFile({
        ...meta,
        lastRejectedReason: verdict.reason,
        rejectedCount: (meta.rejectedCount || 0) + 1,
        consecutiveRejected: nextConsecutive,
      });
      return;
    }

    const reanchorPoint = enrichPoint(rawPoint, previous, "riaggancio GPS");
    const nextPoints = [...points, reanchorPoint];
    await savePointsToFile(nextPoints);

    await saveMetaToFile({
      ...meta,
      lastRejectedReason: `riaggancio dopo ${nextConsecutive} scarti`,
      rejectedCount: (meta.rejectedCount || 0) + 1,
      consecutiveRejected: 0,
      lastPointAt: reanchorPoint.timestamp,
      lastAutosaveAt: Date.now(),
    });
    return;
  }

  const point = enrichPoint(rawPoint, previous);
  const nextPoints = [...points, point];
  await savePointsToFile(nextPoints);

  await saveMetaToFile({
    ...meta,
    lastRejectedReason: null,
    rejectedCount: meta.rejectedCount || 0,
    consecutiveRejected: 0,
    lastPointAt: point.timestamp,
    lastAutosaveAt: Date.now(),
  });

  if (nextPoints.length % GPX_AUTOSAVE_EVERY_POINTS === 0) {
    const gpx = makeGpx(meta.trackName || "Traccia ferroviaria", nextPoints);
    if (Platform.OS === "web") {
      window.localStorage.setItem(AUTOSAVE_GPX_FILE, gpx);
    } else {
      await FileSystem.writeAsStringAsync(AUTOSAVE_GPX_FILE, gpx, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    }
  }
}

if (Platform.OS !== "web") {
  TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.warn("Errore GPS background:", error.message);
      return;
    }

    if (!data?.locations?.length) return;

    for (const location of data.locations) {
      await addPointToFile(normalizeLocation(location));
    }
  });
}

function trovaProssimaLocalita(progressivaMetri, direzioneMappa) {
  if (!Number.isFinite(progressivaMetri)) return null;

  const localita = LINEA_BARI_TARANTO.riferimenti
    .filter((r) => {
      return (
        ["stazione", "posto_movimento", "bivio"].includes(r.tipo) &&
        Number.isFinite(r.km)
      );
    })
    .sort((a, b) => a.km - b.km);

  if (direzioneMappa === "bari_taranto") {
    const prossima = localita.find((r) => r.km > progressivaMetri + 30);

    if (!prossima) {
      return {
        nome: "Fine tratta Taranto",
        progressiva: metriToProgressiva(LINEA_BARI_TARANTO.fine.km),
        distanzaMetri: Math.max(0, LINEA_BARI_TARANTO.fine.km - progressivaMetri),
      };
    }

    return {
      nome: prossima.nome,
      progressiva: metriToProgressiva(prossima.km),
      distanzaMetri: prossima.km - progressivaMetri,
    };
  }

  const precedenti = localita
    .filter((r) => r.km < progressivaMetri - 30)
    .sort((a, b) => b.km - a.km);

  const prossima = precedenti[0];

  if (!prossima) {
    return {
      nome: "Fine tratta Bari",
      progressiva: metriToProgressiva(LINEA_BARI_TARANTO.inizio.km),
      distanzaMetri: Math.max(0, progressivaMetri - LINEA_BARI_TARANTO.inizio.km),
    };
  }

  return {
    nome: prossima.nome,
    progressiva: metriToProgressiva(prossima.km),
    distanzaMetri: progressivaMetri - prossima.km,
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState("map");
  const [trattaSelezionataId, setTrattaSelezionataId] = useState("bari_taranto");
  const [permissionStatus, setPermissionStatus] = useState("unknown");
  const [backgroundStatus, setBackgroundStatus] = useState("unknown");
  const [isRecording, setIsRecording] = useState(false);
  const [baseTrackName, setBaseTrackName] = useState("DoveSono");
  const [trackName, setTrackName] = useState("DoveSono");
  const [points, setPoints] = useState([]);
  const [meta, setMeta] = useState({ lastRejectedReason: null, rejectedCount: 0 });
  const [savedTracks, setSavedTracks] = useState([]);
  const [lastSavedFile, setLastSavedFile] = useState(null);
  const [renamingTrackId, setRenamingTrackId] = useState(null);
  const [renameText, setRenameText] = useState("");
  const [distanzaMasterInput, setDistanzaMasterInput] = useState("60000");
const [direzioneMappa, setDirezioneMappa] = useState("bari_taranto");
const [posizioneDoveSono, setPosizioneDoveSono] = useState(null);
const [isDoveSonoLoading, setIsDoveSonoLoading] = useState(false);
const [now, setNow] = useState(Date.now());

const refreshTimer = useRef(null);
const clockTimer = useRef(null);
const recordingPollTimer = useRef(null);
const isSavingPoint = useRef(false);

  const lastLocation = points[points.length - 1] || null;

  const totalDistance = useMemo(() => {
    return points.reduce((sum, p) => sum + (Number.isFinite(p.segmentDistance) ? p.segmentDistance : 0), 0);
  }, [points]);

  const averageAccuracy = useMemo(() => {
    const valid = points.filter((p) => Number.isFinite(p.accuracy));
    if (!valid.length) return null;
    return valid.reduce((sum, p) => sum + p.accuracy, 0) / valid.length;
  }, [points]);

  const currentSpeedKmh = useMemo(() => {
    if (points.length < 2) return 0;

    const lastFew = points.slice(-6).filter((p) => Number.isFinite(p.calculatedSpeedKmh));
    if (lastFew.length < 2) return 0;

    const first = lastFew[0];
    const last = lastFew[lastFew.length - 1];
    const recentRadius = haversineMeters(first, last);
    const avg = lastFew.reduce((sum, p) => sum + p.calculatedSpeedKmh, 0) / lastFew.length;

    if (last.movementState === "fermo") return 0;
    if (recentRadius < STOPPED_DISTANCE_METERS && avg < 25) return 0;
    if (avg < STOPPED_SPEED_KMH) return 0;

    return avg;
  }, [points]);

  const gpsQuality = useMemo(() => {
    return getGpsQuality({
      lastLocation,
      averageAccuracy,
      rejectedCount: meta.rejectedCount || 0,
      points,
    });
  }, [lastLocation, averageAccuracy, meta.rejectedCount, points, now]);

  const durationText = useMemo(() => {
    if (!meta.startedAt) return "--";

    const sec = Math.max(0, Math.floor((now - meta.startedAt) / 1000));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [meta.startedAt, now]);

  const distanzaMasterNumerica = useMemo(() => {
    const pulito = String(distanzaMasterInput).replace(",", ".").replace(/[^\d.]/g, "");
    const numero = Number(pulito);
    return Number.isFinite(numero) ? numero : 0;
  }, [distanzaMasterInput]);

  const calibrazioneLinea = useMemo(() => {
    try {
      return getCalibrazioneLinea();
    } catch (error) {
      console.warn("Errore calibrazioneLinea:", error?.message || error);
      return {
        salti: [],
        totaleSalti: 11427,
        lunghezzaProgressivaUfficiale: 114529,
        lunghezzaFisicaStimata: 103102,
        lunghezzaMasterMetri: 103934,
        fattoreMasterSuFisica: 1,
        fattoreFisicaSuMaster: 1,
      };
    }
  }, []);

  const infoMappa = useMemo(() => {
    try {
      return descriviPosizioneSuMaster(distanzaMasterNumerica);
    } catch (error) {
      console.warn("Errore infoMappa:", error?.message || error);
      return {
        distanzaMasterMetri: distanzaMasterNumerica,
        distanzaMaster: `${Math.round(distanzaMasterNumerica)} m`,
        progressivaRealeMetri: 0,
        progressivaReale: "--",
        riferimentoPiuVicino: null,
        galleria: null,
        saltoVicino: null,
        calibrazione: calibrazioneLinea,
      };
    }
  }, [distanzaMasterNumerica, calibrazioneLinea]);

 const posizioneGpsSuMaster = useMemo(() => {
  try {
    return trovaPosizioneSuMasterDaGps(lastLocation);
  } catch (error) {
    console.warn("Errore posizioneGpsSuMaster:", error?.message || error);
    return null;
  }
}, [lastLocation]);

const infoGpsSuMaster = useMemo(() => {
  try {
    if (!posizioneGpsSuMaster) return null;

    return descriviPosizioneSuMaster(posizioneGpsSuMaster.distanzaMasterMetri);
  } catch (error) {
    console.warn("Errore infoGpsSuMaster:", error?.message || error);
    return null;
  }
}, [posizioneGpsSuMaster]);

const posizioneDoveSonoSuMaster = useMemo(() => {
  try {
    if (!posizioneDoveSono) return null;

    const motore = getMotoreTratta(trattaSelezionataId);
    return motore.trovaDaGps(posizioneDoveSono);
  } catch (error) {
    console.warn("Errore posizioneDoveSonoSuMaster:", error?.message || error);
    return null;
  }
}, [posizioneDoveSono, trattaSelezionataId]);

const infoDoveSono = useMemo(() => {
  try {
    if (!posizioneDoveSonoSuMaster) return null;

    const motore = getMotoreTratta(trattaSelezionataId);
    return motore.descrivi(posizioneDoveSonoSuMaster.distanzaMasterMetri);
  } catch (error) {
    console.warn("Errore infoDoveSono:", error?.message || error);
    return null;
  }
}, [posizioneDoveSonoSuMaster, trattaSelezionataId]);

const prossimaLocalitaDoveSono = useMemo(() => {
  if (!infoDoveSono) return null;

  const motore = getMotoreTratta(trattaSelezionataId);

  return motore.prossimaLocalita(
    infoDoveSono.progressivaRealeMetri,
    direzioneMappa
  );
}, [infoDoveSono, direzioneMappa, trattaSelezionataId]);

  const tabellaGallerie = useMemo(() => {
    try {
      return creaTabellaGallerieCalibrate();
    } catch (error) {
      console.warn("Errore tabellaGallerie:", error?.message || error);
      return [];
    }
  }, []);

  const tabellaRiferimenti = useMemo(() => {
    try {
      return creaTabellaRiferimentiCalibrati();
    } catch (error) {
      console.warn("Errore tabellaRiferimenti:", error?.message || error);
      return [];
    }
  }, []);

  useEffect(() => {
    initialize().catch((error) => {
      console.warn("Errore initialize:", error?.message || error);
    });

    const sub = AppState.addEventListener("change", async () => {
      try {
        await refreshAll();
      } catch (error) {
        console.warn("Errore refreshAll:", error?.message || error);
      }
    });

    clockTimer.current = setInterval(() => setNow(Date.now()), 1000);

return () => {
  sub.remove();
  stopRefreshTimer();

if (recordingPollTimer.current) {
  clearInterval(recordingPollTimer.current);
  recordingPollTimer.current = null;
}

  if (clockTimer.current) {
    clearInterval(clockTimer.current);
    clockTimer.current = null;
  }
};
  }, []);

  async function initialize() {
    await ensureTracksDir();
    await refreshPermissionStatus();

    const running =
      Platform.OS === "web"
        ? false
        : await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
    setIsRecording(running);

    await refreshAll();

    const activePoints = await loadPointsFromFile();
    const activeMeta = await loadMetaFromFile();

    if (!running && activePoints.length > 0) {
      Alert.alert(
        "Registrazione recuperabile",
        `Ho trovato una traccia non cancellata con ${activePoints.length} punti validi.`,
        [
          { text: "Cancella", style: "destructive", onPress: clearRecoveredTrack },
          { text: "Recupera", onPress: recoverTrack },
        ]
      );
    }

    if (activeMeta.trackName) setTrackName(activeMeta.trackName);
    if (running) startRefreshTimer();
  }

  async function refreshPermissionStatus() {
    try {
      const fg = await Location.getForegroundPermissionsAsync();
      const bg = await Location.getBackgroundPermissionsAsync();
      setPermissionStatus(fg?.status || "unknown");
      setBackgroundStatus(bg?.status || "unknown");
    } catch {
      setPermissionStatus("unknown");
      setBackgroundStatus("unknown");
    }
  }

  async function requestPermissions(showAlerts = true) {
    try {
      const fg = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(fg?.status || "unknown");

      if (fg.status !== "granted") {
        if (showAlerts) Alert.alert("Permesso GPS negato", "Concedi il permesso posizione mentre usi l'app.");
        return false;
      }

      const bg = await Location.requestBackgroundPermissionsAsync();
      setBackgroundStatus(bg?.status || "unknown");

      if (bg.status !== "granted") {
        if (showAlerts) {
          Alert.alert(
            "Permesso background negato",
            "Per registrare con schermo bloccato devi concedere la posizione sempre/in background nelle impostazioni Android."
          );
        }
        return false;
      }

      return true;
    } catch (error) {
      if (showAlerts) Alert.alert("Errore permessi", error.message);
      return false;
    }
  }

  async function requestForegroundRecordingPermission(showAlerts = true) {
  try {
    const fg = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(fg?.status || "unknown");

    if (fg.status !== "granted") {
      if (showAlerts) {
        Alert.alert(
          "Permesso GPS negato",
          "Concedi il permesso posizione mentre usi l'app."
        );
      }

      return false;
    }

    return true;
  } catch (error) {
    if (showAlerts) {
      Alert.alert("Errore permessi", error.message);
    }

    return false;
  }
}
  
async function registraPuntoSingolo() {
  if (isSavingPoint.current) return;

  try {
    isSavingPoint.current = true;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      mayShowUserSettingsDialog: true,
    });

    await addPointToFile(normalizeLocation(location));
    await refreshAll();
  } catch (error) {
    console.warn("Errore punto singolo registrazione:", error?.message || error);
  } finally {
    isSavingPoint.current = false;
  }
}

async function startRecording() {
  const ok = await requestForegroundRecordingPermission(true);
  if (!ok) return;

  try {
    if (recordingPollTimer.current) {
      clearInterval(recordingPollTimer.current);
      recordingPollTimer.current = null;
    }

    const automaticName = makeAutomaticTrackName(baseTrackName);
    setTrackName(automaticName);

    await savePointsToFile([]);

    const newMeta = {
      trackName: automaticName,
      baseTrackName,
      startedAt: Date.now(),
      lastRejectedReason: null,
      rejectedCount: 0,
      consecutiveRejected: 0,
      lastAutosaveAt: null,
      lastPointAt: null,
      foregroundOnly: true,
      pollRecording: true,
    };

    await saveMetaToFile(newMeta);

    setMeta(newMeta);
    setPoints([]);
    setLastSavedFile(null);
    setIsRecording(true);

    await registraPuntoSingolo();

    recordingPollTimer.current = setInterval(() => {
      registraPuntoSingolo();
    }, 5000);

    startRefreshTimer();

    Alert.alert(
      "Registrazione avviata",
      "Registrazione stabile attiva. Tieni l'app aperta e lo schermo acceso."
    );
  } catch (error) {
    Alert.alert("Errore", `Registrazione non avviata: ${error.message}`);
  }
}

async function stopRecording() {
  try {
    if (recordingPollTimer.current) {
      clearInterval(recordingPollTimer.current);
      recordingPollTimer.current = null;
    }

    try {
      const runningBackground = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);

      if (runningBackground) {
        await Location.stopLocationUpdatesAsync(TASK_NAME);
      }
    } catch (error) {
      console.warn("Nessuna registrazione background da fermare:", error?.message || error);
    }

    setIsRecording(false);
    stopRefreshTimer();
    await refreshAll();
  } catch (error) {
    Alert.alert("Errore", `Impossibile fermare la registrazione: ${error.message}`);
  }
}

  function startRefreshTimer() {
    stopRefreshTimer();
    refreshTimer.current = setInterval(refreshAll, 2000);
  }

  function stopRefreshTimer() {
    if (refreshTimer.current) {
      clearInterval(refreshTimer.current);
      refreshTimer.current = null;
    }
  }

  async function refreshAll() {
    const loadedPoints = await loadPointsFromFile();
    const loadedMeta = await loadMetaFromFile();
    const index = await loadTracksIndex();

    setPoints(loadedPoints);
    setMeta(loadedMeta);
    setSavedTracks(index);

    if (loadedMeta.trackName) setTrackName(loadedMeta.trackName);
  }

  async function recoverTrack() {
    await refreshAll();
    const loaded = await loadPointsFromFile();
    if (!loaded.length) {
      Alert.alert("Nessuna traccia", "Non ho trovato punti salvati da recuperare.");
      return;
    }
    Alert.alert("Traccia recuperata", `Ho ricaricato ${loaded.length} punti dalla memoria locale.`);
  }

  async function clearRecoveredTrack() {
    await savePointsToFile([]);
    await saveMetaToFile({
      trackName: baseTrackName,
      baseTrackName,
      startedAt: null,
      lastRejectedReason: null,
      rejectedCount: 0,
      consecutiveRejected: 0,
      lastAutosaveAt: null,
      lastPointAt: null,
    });

    setPoints([]);
    setMeta({ lastRejectedReason: null, rejectedCount: 0, consecutiveRejected: 0 });
  }

  function clearTrack() {
    if (isRecording) {
      Alert.alert("Registrazione attiva", "Ferma prima la registrazione.");
      return;
    }

    Alert.alert(
      "Eliminare la traccia attiva?",
      "I punti della traccia attiva verranno cancellati. Le tracce gia archiviate restano salvate.",
      [
        { text: "Annulla", style: "cancel" },
        { text: "Elimina", style: "destructive", onPress: clearRecoveredTrack },
      ]
    );
  }

  async function archiveCurrentTrack() {
    await ensureTracksDir();

    const freshPoints = await loadPointsFromFile();
    const freshMeta = await loadMetaFromFile();

    if (!freshPoints.length) {
      Alert.alert("Nessun punto", "Registra almeno un punto GPS prima di archiviare.");
      return null;
    }

    const name = freshMeta.trackName || trackName || makeAutomaticTrackName(baseTrackName);
    const gpx = makeGpx(name, freshPoints);
    const jsonUri = TRACKS_DIR + buildFileName(name, "json");
    const gpxUri = TRACKS_DIR + buildFileName(name, "gpx");

    await FileSystem.writeAsStringAsync(jsonUri, JSON.stringify({ meta: freshMeta, points: freshPoints }));
    await FileSystem.writeAsStringAsync(gpxUri, gpx, { encoding: FileSystem.EncodingType.UTF8 });

    const entry = {
      id: `${Date.now()}`,
      name,
      createdAt: Date.now(),
      startedAt: freshMeta.startedAt,
      pointsCount: freshPoints.length,
      distanceMeters: freshPoints.reduce((sum, p) => sum + (Number.isFinite(p.segmentDistance) ? p.segmentDistance : 0), 0),
      gpxUri,
      jsonUri,
    };

    const index = await loadTracksIndex();
    const nextIndex = [entry, ...index];
    await saveTracksIndex(nextIndex);
    setSavedTracks(nextIndex);
    setLastSavedFile(gpxUri);
    return entry;
  }

  async function saveGpx() {
    if (isRecording) {
      Alert.alert("Registrazione attiva", "Ferma la registrazione prima di salvare definitivamente.");
      return;
    }

    try {
      const entry = await archiveCurrentTrack();
      if (entry) {
        Alert.alert("Traccia archiviata", `${entry.name}\n${entry.pointsCount} punti validi\n${formatDistance(entry.distanceMeters)}`);
      }
    } catch (error) {
      Alert.alert("Errore", `Impossibile salvare il GPX: ${error.message}`);
    }
  }

  async function shareGpx() {
    let uri = lastSavedFile;
    if (!uri) {
      const entry = await archiveCurrentTrack();
      if (!entry) return;
      uri = entry.gpxUri;
    }

    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert("Condivisione non disponibile", `File salvato qui:\n${uri}`);
      return;
    }

    await Sharing.shareAsync(uri, {
      mimeType: "application/gpx+xml",
      dialogTitle: "Esporta traccia GPX",
      UTI: "public.xml",
    });
  }

  async function shareAutosave() {
    const info = await FileSystem.getInfoAsync(AUTOSAVE_GPX_FILE);
    if (!info.exists) {
      Alert.alert("Nessun autosalvataggio", "La copia automatica GPX non e ancora stata creata. Serve arrivare almeno a 50 punti validi.");
      return;
    }

    await Sharing.shareAsync(AUTOSAVE_GPX_FILE, {
      mimeType: "application/gpx+xml",
      dialogTitle: "Esporta autosalvataggio GPX",
      UTI: "public.xml",
    });
  }

  async function shareSavedTrack(track) {
    await Sharing.shareAsync(track.gpxUri, {
      mimeType: "application/gpx+xml",
      dialogTitle: `Esporta ${track.name}`,
      UTI: "public.xml",
    });
  }

  async function deleteSavedTrack(track) {
    Alert.alert("Eliminare traccia salvata?", track.name, [
      { text: "Annulla", style: "cancel" },
      {
        text: "Elimina",
        style: "destructive",
        onPress: async () => {
          try {
            const gpxInfo = await FileSystem.getInfoAsync(track.gpxUri);
            if (gpxInfo.exists) await FileSystem.deleteAsync(track.gpxUri);

            const jsonInfo = await FileSystem.getInfoAsync(track.jsonUri);
            if (jsonInfo.exists) await FileSystem.deleteAsync(track.jsonUri);

            const index = await loadTracksIndex();
            const next = index.filter((x) => x.id !== track.id);
            await saveTracksIndex(next);
            setSavedTracks(next);
          } catch (error) {
            Alert.alert("Errore", error.message);
          }
        },
      },
    ]);
  }

  async function renameSavedTrack(track) {
    const newName = renameText.trim();
    if (!newName) {
      Alert.alert("Nome non valido", "Inserisci un nome per la traccia.");
      return;
    }

    try {
      const index = await loadTracksIndex();
      const target = index.find((x) => x.id === track.id);
      if (!target) {
        Alert.alert("Errore", "Traccia non trovata nell'archivio.");
        return;
      }

      let trackPoints = [];
      let oldMeta = {};
      const jsonInfo = await FileSystem.getInfoAsync(track.jsonUri);

      if (jsonInfo.exists) {
        const rawJson = await FileSystem.readAsStringAsync(track.jsonUri);
        const parsedJson = JSON.parse(rawJson);
        trackPoints = parsedJson.points || [];
        oldMeta = parsedJson.meta || {};
      } else {
        const gpxInfo = await FileSystem.getInfoAsync(track.gpxUri);
        if (!gpxInfo.exists) {
          Alert.alert("Errore", "File traccia non trovato.");
          return;
        }
        const gpxText = await FileSystem.readAsStringAsync(track.gpxUri);
        const imported = parseGpx(gpxText, track.name);
        trackPoints = imported.points || [];
      }

      const updatedMeta = { ...oldMeta, trackName: newName, renamedAt: Date.now() };
      const updatedGpx = makeGpx(newName, trackPoints);

      await FileSystem.writeAsStringAsync(track.jsonUri, JSON.stringify({ meta: updatedMeta, points: trackPoints }));
      await FileSystem.writeAsStringAsync(track.gpxUri, updatedGpx, { encoding: FileSystem.EncodingType.UTF8 });

      const nextIndex = index.map((x) => (x.id === track.id ? { ...x, name: newName } : x));
      await saveTracksIndex(nextIndex);
      setSavedTracks(nextIndex);
      setRenamingTrackId(null);
      setRenameText("");
      Alert.alert("Traccia rinominata", newName);
    } catch (error) {
      Alert.alert("Errore rinomina", error.message);
    }
  }

async function aggiornaDoveSono() {
  try {
    setIsDoveSonoLoading(true);

    const fg = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(fg?.status || "unknown");

    if (fg.status !== "granted") {
      Alert.alert(
        "Permesso GPS negato",
        "Per usare Dove sono? devi consentire la posizione."
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
      mayShowUserSettingsDialog: true,
    });

    setPosizioneDoveSono(normalizeLocation(location));
  } catch (error) {
    Alert.alert("Errore GPS", error.message);
  } finally {
    setIsDoveSonoLoading(false);
  }
}

  async function importGpxToArchive() {
    try {
      await ensureTracksDir();

      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/gpx+xml", "application/xml", "text/xml", "*/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const gpxText = await FileSystem.readAsStringAsync(file.uri);
      const imported = parseGpx(gpxText, file.name ? file.name.replace(".gpx", "") : "Traccia importata");

      if (!imported.points.length) {
        Alert.alert("Importazione fallita", "Il file GPX non contiene punti validi.");
        return;
      }

      const name = imported.name || "Traccia importata";
      const jsonUri = TRACKS_DIR + buildFileName(name, "json");
      const gpxUri = TRACKS_DIR + buildFileName(name, "gpx");
      const distanceMeters = imported.points.reduce((sum, p) => sum + (Number.isFinite(p.segmentDistance) ? p.segmentDistance : 0), 0);

      await FileSystem.writeAsStringAsync(
        jsonUri,
        JSON.stringify({
          meta: { trackName: name, startedAt: imported.points[0]?.timestamp || Date.now(), imported: true },
          points: imported.points,
        })
      );

      await FileSystem.writeAsStringAsync(gpxUri, gpxText, { encoding: FileSystem.EncodingType.UTF8 });

      const entry = {
        id: `${Date.now()}`,
        name,
        createdAt: Date.now(),
        startedAt: imported.points[0]?.timestamp || Date.now(),
        pointsCount: imported.points.length,
        distanceMeters,
        gpxUri,
        jsonUri,
      };

      const index = await loadTracksIndex();
      const nextIndex = [entry, ...index];
      await saveTracksIndex(nextIndex);
      setSavedTracks(nextIndex);
      Alert.alert("Importazione completata", `${name}\n${imported.points.length} punti importati`);
    } catch (error) {
      Alert.alert("Errore importazione", error.message);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {activeTab === "map" ? (
          <MapView
            trattaSelezionataId={trattaSelezionataId}
            setTrattaSelezionataId={setTrattaSelezionataId}
            direzioneMappa={direzioneMappa}
            setDirezioneMappa={setDirezioneMappa}
            aggiornaDoveSono={aggiornaDoveSono}
            isDoveSonoLoading={isDoveSonoLoading}
            posizioneDoveSonoSuMaster={posizioneDoveSonoSuMaster}
            infoDoveSono={infoDoveSono}
            prossimaLocalitaDoveSono={prossimaLocalitaDoveSono}
          />
        ) : activeTab === "home" ? (
          <HomeView
            baseTrackName={baseTrackName}
            setBaseTrackName={setBaseTrackName}
            isRecording={isRecording}
            gpsQuality={gpsQuality}
            points={points}
            totalDistance={totalDistance}
            currentSpeedKmh={currentSpeedKmh}
            meta={meta}
            trackName={trackName}
            durationText={durationText}
            lastLocation={lastLocation}
            permissionStatus={permissionStatus}
            backgroundStatus={backgroundStatus}
            startRecording={startRecording}
            stopRecording={stopRecording}
            saveGpx={saveGpx}
            shareGpx={shareGpx}
            savedTracks={savedTracks}
            setActiveTab={setActiveTab}
          />
        ) : activeTab === "archive" ? (
          <ArchiveView
            savedTracks={savedTracks}
            points={points}
            isRecording={isRecording}
            recoverTrack={recoverTrack}
            importGpxToArchive={importGpxToArchive}
            shareAutosave={shareAutosave}
            clearTrack={clearTrack}
            renamingTrackId={renamingTrackId}
            renameText={renameText}
            setRenameText={setRenameText}
            setRenamingTrackId={setRenamingTrackId}
            renameSavedTrack={renameSavedTrack}
            shareSavedTrack={shareSavedTrack}
            deleteSavedTrack={deleteSavedTrack}
          />
        ) : activeTab === "reports" ? (
          <ReportsView />
        ) : (
          <SettingsView
            trattaSelezionataId={trattaSelezionataId}
            direzioneMappa={direzioneMappa}
            permissionStatus={permissionStatus}
            backgroundStatus={backgroundStatus}
          />
        )}

        <Text style={styles.disclaimer}>
          App personale non certificata. Non usare per decisioni operative o di sicurezza ferroviaria.
        </Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavButton label="Mappa" icon="MAP" active={activeTab === "map"} onPress={() => setActiveTab("map")} />
        <NavButton label="Home" icon="HOME" active={activeTab === "home"} onPress={() => setActiveTab("home")} />
        <NavButton label="Resoconti" icon="REP" active={activeTab === "reports"} onPress={() => setActiveTab("reports")} />
        <NavButton label="Impostazioni" icon="SET" active={activeTab === "settings"} onPress={() => setActiveTab("settings")} />
      </View>
    </SafeAreaView>
  );
}

function HomeView({
  baseTrackName,
  setBaseTrackName,
  isRecording,
  gpsQuality,
  points,
  totalDistance,
  currentSpeedKmh,
  meta,
  trackName,
  durationText,
  lastLocation,
  permissionStatus,
  backgroundStatus,
  startRecording,
  stopRecording,
  saveGpx,
  shareGpx,
  savedTracks,
  setActiveTab,
}) {
  return (
    <>
      <View style={styles.heroHeader}>
        <Text style={styles.appName}>DoveSono?</Text>
        <Text style={styles.appSubtitle}>Sistema attivo</Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusPulse}>
          <Text style={styles.statusPulseText}>MAP</Text>
        </View>
        <View style={styles.statusTextBox}>
          <Text style={styles.statusTitle}>{isRecording ? "Registrazione attiva" : "Pronto"}</Text>
          <Text style={styles.statusSubtitle}>Posizionamento in tempo reale</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <Metric label="GPS" value={gpsQuality.label} detail={gpsQuality.detail} quality={gpsQuality.level} />
        <Metric label="Punti" value={String(points.length)} />
        <Metric label="Distanza" value={formatDistance(totalDistance)} />
        <Metric label="Velocita" value={formatSpeedKmh(currentSpeedKmh)} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Registrazione</Text>
        <Text style={styles.label}>Nome base tratta</Text>
        <TextInput
          style={styles.input}
          value={baseTrackName}
          onChangeText={setBaseTrackName}
          placeholder="Es. Taranto - Bari"
          placeholderTextColor="#7b8495"
          editable={!isRecording}
        />
        <Row label="Traccia" value={trackName || "--"} />
        <Row label="Durata" value={durationText} />
        <Row label="Ultimo punto" value={formatTime(meta.lastPointAt || lastLocation?.timestamp)} />
        <Row label="Ultimo scarto" value={meta.lastRejectedReason || "--"} />

        <View style={styles.buttonRow}>
          {!isRecording ? <Button label="Avvia registrazione" onPress={startRecording} primary /> : <Button label="Ferma" onPress={stopRecording} danger />}
        </View>

        <View style={styles.buttonRow}>
          <Button label="Salva" onPress={saveGpx} disabled={isRecording || points.length === 0} />
          <Button label="Esporta GPX" onPress={shareGpx} disabled={points.length === 0} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Archivio rapido</Text>
        <Row label="Tracce salvate" value={String(savedTracks.length)} />
        <TouchableOpacity style={styles.mainActionButton} onPress={() => setActiveTab("archive")}>
          <Text style={styles.mainActionButtonText}>ARCHIVIO</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardSoft}>
        <Text style={styles.noteTitle}>Permessi</Text>
        <Row label="Posizione app" value={permissionStatus} />
        <Row label="Background" value={backgroundStatus} />
      </View>
    </>
  );
}

function ArchiveView({
  savedTracks,
  points,
  isRecording,
  recoverTrack,
  importGpxToArchive,
  shareAutosave,
  clearTrack,
  renamingTrackId,
  renameText,
  setRenameText,
  setRenamingTrackId,
  renameSavedTrack,
  shareSavedTrack,
  deleteSavedTrack,
}) {
  return (
    <>
      <Text style={styles.subtitle}>Archivio tracce</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Azioni archivio</Text>
        <View style={styles.buttonRow}>
          <Button label="Recupera traccia" onPress={recoverTrack} muted />
          <Button label="Importa GPX" onPress={importGpxToArchive} muted />
        </View>
        <View style={styles.buttonRow}>
          <Button label="Esporta autosave" onPress={shareAutosave} muted />
          <Button label="Cancella traccia attiva" onPress={clearTrack} disabled={isRecording || points.length === 0} muted />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Archivio tracce</Text>
        {savedTracks.length === 0 ? (
          <Text style={styles.smallText}>Nessuna traccia archiviata.</Text>
        ) : (
          savedTracks.map((track) => {
            const isRenaming = renamingTrackId === track.id;
            return (
              <View key={track.id} style={styles.trackItem}>
                <View style={styles.trackInfo}>
                  {isRenaming ? (
                    <>
                      <TextInput
                        style={styles.renameInput}
                        value={renameText}
                        onChangeText={setRenameText}
                        placeholder="Nuovo nome traccia"
                        placeholderTextColor="#7b8495"
                        autoFocus
                      />
                      <View style={styles.renameRow}>
                        <TouchableOpacity style={[styles.smallButton, styles.smallButtonSave]} onPress={() => renameSavedTrack(track)}>
                          <Text style={styles.smallButtonText}>Salva</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.smallButton, styles.smallButtonMuted]}
                          onPress={() => {
                            setRenamingTrackId(null);
                            setRenameText("");
                          }}
                        >
                          <Text style={styles.smallButtonText}>Annulla</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={styles.trackName}>{track.name}</Text>
                      <Text style={styles.trackMeta}>{track.pointsCount} punti - {formatDistance(track.distanceMeters)}</Text>
                    </>
                  )}
                </View>

                {!isRenaming ? (
                  <View style={styles.trackActions}>
                    <TouchableOpacity
                      style={[styles.smallButton, styles.smallButtonMuted]}
                      onPress={() => {
                        setRenamingTrackId(track.id);
                        setRenameText(track.name);
                      }}
                    >
                      <Text style={styles.smallButtonText}>Rinomina</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.smallButton} onPress={() => shareSavedTrack(track)}>
                      <Text style={styles.smallButtonText}>Esporta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.smallButton, styles.smallButtonDanger]} onPress={() => deleteSavedTrack(track)}>
                      <Text style={styles.smallButtonText}>Elimina</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            );
          })
        )}
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Archivio</Text>
        <Text style={styles.noteText}>Qui puoi importare GPX, recuperare la traccia attiva, esportare autosalvataggi, rinominare e gestire tutte le tracce archiviate.</Text>
      </View>
    </>
  );
}

function MapView({
  trattaSelezionataId,
  setTrattaSelezionataId,
  direzioneMappa,
  setDirezioneMappa,
  aggiornaDoveSono,
  isDoveSonoLoading,
  posizioneDoveSonoSuMaster,
  infoDoveSono,
  prossimaLocalitaDoveSono,
}) {
  const trattaSelezionata = getTrattaSelezionata(trattaSelezionataId);
  const direzioniDisponibili = trattaSelezionata.direzioni || [];
  const hasPosition = posizioneDoveSonoSuMaster && infoDoveSono;

  return (
    <>
      <View style={styles.heroHeader}>
        <Text style={styles.appName}>DoveSono?</Text>
        <Text style={styles.appSubtitle}>La tua posizione sulla ferrovia</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Seleziona tratta</Text>

        {TRATTE_DOVESONO.map((tratta) => {
          const attiva = trattaSelezionataId === tratta.id;

          return (
            <TouchableOpacity
              key={tratta.id}
              disabled={!tratta.disponibile}
              style={[
                styles.routeOption,
                attiva && styles.routeOptionActive,
                !tratta.disponibile && styles.routeOptionDisabled,
              ]}
              onPress={() => {
                if (!tratta.disponibile) {
                  Alert.alert("Tratta non disponibile", "Questa tratta non e disponibile ancora.");
                  return;
                }

                setTrattaSelezionataId(tratta.id);

                if (tratta.direzioni?.[0]?.id) {
                  setDirezioneMappa(tratta.direzioni[0].id);
                }
              }}
            >
              <View style={[styles.routeDot, attiva && styles.routeDotActive, !tratta.disponibile && styles.routeDotDisabled]} />

              <View style={styles.routeTextBox}>
                <Text style={[styles.routeTitle, !tratta.disponibile && styles.routeTitleDisabled]}>{tratta.nome}</Text>
                <Text style={[styles.routeDetail, !tratta.disponibile && styles.routeDetailDisabled]}>{tratta.dettaglio}</Text>
              </View>

              {!tratta.disponibile ? <Text style={styles.lockText}>Bloccata</Text> : <Text style={styles.chevronText}>></Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {trattaSelezionata.disponibile ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Scegli direzione</Text>
          <View style={styles.directionRow}>
            {direzioniDisponibili.map((direzione) => {
              const attiva = direzioneMappa === direzione.id;

              return (
                <TouchableOpacity
                  key={direzione.id}
                  style={[styles.directionButton, attiva && styles.directionButtonActive]}
                  onPress={() => setDirezioneMappa(direzione.id)}
                >
                  <Text style={[styles.directionButtonText, attiva && styles.directionButtonTextActive]}>{direzione.nome}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}

      <View style={styles.focusCard}>
        <Text style={styles.bigKmLabel}>Cippo attuale</Text>

        {hasPosition ? (
          <>
            <Text style={styles.focusKmValue}>{infoDoveSono.progressivaReale}</Text>
            <Text style={styles.focusLocation}>{infoDoveSono.riferimentoPiuVicino?.nome || "Localita non disponibile"}</Text>
            <View style={styles.focusDivider} />
            <Row label="Tratta" value={trattaSelezionata.nome} />
            <Row label="Direzione" value={getDirezioneLabel(direzioneMappa)} />
            <Row label="Distanza dalla linea" value={`${Math.round(posizioneDoveSonoSuMaster.distanzaDaLineaMetri)} m`} />
            <Row label="Qualita GPS" value={posizioneDoveSonoSuMaster.qualitaAggancio || "--"} />

            {prossimaLocalitaDoveSono ? (
              <>
                <Row label="Prossima localita" value={prossimaLocalitaDoveSono.nome} />
                <Row label="Distanza" value={`${Math.round(prossimaLocalitaDoveSono.distanzaMetri)} m`} />
              </>
            ) : null}

            {infoDoveSono.galleria ? (
              <View style={styles.warningBox}>
                <Text style={styles.warningTitle}>Galleria</Text>
                <Text style={styles.warningText}>{infoDoveSono.galleria.nome}</Text>
                <Text style={styles.warningText}>Da {infoDoveSono.galleria.inizio} a {infoDoveSono.galleria.fine}</Text>
              </View>
            ) : null}
          </>
        ) : (
          <Text style={styles.emptyFocusText}>Scegli tratta e direzione, poi premi "Dove sono?" per calcolare il cippo attuale.</Text>
        )}

        <TouchableOpacity
          style={[styles.mainActionButton, isDoveSonoLoading && styles.buttonDisabled]}
          onPress={aggiornaDoveSono}
          disabled={isDoveSonoLoading || !trattaSelezionata.disponibile}
        >
          <Text style={styles.mainActionButtonText}>{isDoveSonoLoading ? "CALCOLO..." : "DOVE SONO?"}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}


function ReportsView() {
  return (
    <>
      <View style={styles.heroHeader}>
        <Text style={styles.appName}>Resoconti/Giunti</Text>
        <Text style={styles.appSubtitle}>Sezione in preparazione</Text>
      </View>

      <View style={styles.focusCard}>
        <Text style={styles.bigKmLabel}>Prossimamente</Text>
        <Text style={styles.emptyFocusText}>
          Qui inseriremo resoconti, giunti, note e riferimenti utili per le tratte.
        </Text>

        <View style={styles.focusDivider} />

        <Row label="Stato sezione" value="non disponibile ancora" />
        <Row label="Prima versione" value="da definire" />
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Idea futura</Text>
        <Text style={styles.noteText}>
          Questa sezione potra contenere resoconti di viaggio, punti rilevati, giunti, note tecniche
          e controlli sulle progressive delle varie linee.
        </Text>
      </View>
    </>
  );
}

function SettingsView({ trattaSelezionataId, direzioneMappa, permissionStatus, backgroundStatus }) {
  const tratta = getTrattaSelezionata(trattaSelezionataId);

  return (
    <>
      <View style={styles.heroHeader}>
        <Text style={styles.appName}>Impostazioni</Text>
        <Text style={styles.appSubtitle}>DoveSono? - Focus One</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>App</Text>
        <Row label="Nome" value="DoveSono?" />
        <Row label="Interfaccia" value="Focus One" />
        <Row label="Tratta" value={tratta.nome} />
        <Row label="Direzione" value={getDirezioneLabel(direzioneMappa)} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Permessi</Text>
        <Row label="Posizione app" value={permissionStatus} />
        <Row label="Background" value={backgroundStatus} />
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>Tratte future</Text>
        <Text style={styles.noteText}>Taranto-Brindisi e disponibile. Taranto-Potenza e disponibile in bozza: controllare i raccordi stimati prima di considerarla definitiva. Bari-Bitritto sara abilitata dopo la creazione della master.</Text>
      </View>
    </>
  );
}

function NavButton({ label, icon, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.navButton, active && styles.navButtonActive]} onPress={onPress}>
      <Text style={[styles.navIcon, active && styles.navButtonTextActive]}>{icon}</Text>
      <Text style={[styles.navButtonText, active && styles.navButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Metric({ label, value, detail, highlight, quality }) {
  return (
    <View
      style={[
        styles.metric,
        highlight && styles.metricHighlight,
        quality === "good" && styles.metricGood,
        quality === "medium" && styles.metricMedium,
        quality === "bad" && styles.metricBad,
      ]}
    >
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      {detail ? <Text style={styles.metricDetail}>{detail}</Text> : null}
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function Button({ label, onPress, primary, danger, muted, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        primary && styles.buttonPrimary,
        danger && styles.buttonDanger,
        muted && styles.buttonMuted,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#050b12" },
  container: { padding: 18, paddingBottom: 116 },
  title: { color: "#ffffff", fontSize: 30, fontWeight: "900", marginTop: Platform.OS === "android" ? 20 : 4 },
  subtitle: { color: "#9fb0c1", fontSize: 15, marginTop: 6, marginBottom: 18 },
  heroHeader: { marginTop: Platform.OS === "android" ? 20 : 4, marginBottom: 18 },
  appName: { color: "#ffffff", fontSize: 38, fontWeight: "900", letterSpacing: -0.5 },
  appSubtitle: { color: "#9fb0c1", fontSize: 15, marginTop: 4 },
  card: { backgroundColor: "#0c141f", borderRadius: 22, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "#213040" },
  cardSoft: { backgroundColor: "#09111a", borderRadius: 20, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "#182635" },
  focusCard: { backgroundColor: "#0b131d", borderRadius: 26, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: "#203445" },
  label: { color: "#9fb0c1", marginBottom: 8, fontSize: 12, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  input: { color: "#ffffff", backgroundColor: "#050b12", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, borderWidth: 1, borderColor: "#223246" },
  smallText: { color: "#9fb0c1", fontSize: 12, marginTop: 8, lineHeight: 18 },
  emptyFocusText: { color: "#b7c4d3", fontSize: 15, lineHeight: 23, textAlign: "center", marginVertical: 22 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  metric: { width: "48%", backgroundColor: "#0c141f", borderRadius: 20, padding: 15, borderWidth: 1, borderColor: "#213040" },
  metricHighlight: { borderColor: "#68e241" },
  metricGood: { borderColor: "#68e241" },
  metricMedium: { borderColor: "#e6b800" },
  metricBad: { borderColor: "#e5484d" },
  metricLabel: { color: "#9fb0c1", fontSize: 11, textTransform: "uppercase", fontWeight: "800" },
  metricValue: { color: "#ffffff", fontSize: 22, fontWeight: "900", marginTop: 6 },
  metricDetail: { color: "#b7c4d3", fontSize: 12, marginTop: 3 },
  sectionTitle: { color: "#ffffff", fontSize: 18, fontWeight: "900", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: "#1a2838" },
  rowLabel: { color: "#9fb0c1", fontSize: 14, flex: 1 },
  rowValue: { color: "#ffffff", fontSize: 14, fontWeight: "800", flex: 1, textAlign: "right" },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 12, marginBottom: 0 },
  button: { flex: 1, backgroundColor: "#1c2b3b", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 12, alignItems: "center" },
  buttonPrimary: { backgroundColor: "#68e241" },
  buttonDanger: { backgroundColor: "#e5484d" },
  buttonMuted: { backgroundColor: "#111c29" },
  buttonDisabled: { opacity: 0.42 },
  buttonText: { color: "#ffffff", fontSize: 14, fontWeight: "900" },
  mainActionButton: { backgroundColor: "#68e241", borderRadius: 18, paddingVertical: 16, alignItems: "center", marginTop: 18 },
  mainActionButtonText: { color: "#061207", fontSize: 16, fontWeight: "900" },
  statusCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#0c141f", borderRadius: 22, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "#213040" },
  statusPulse: { width: 72, height: 72, borderRadius: 36, borderWidth: 1, borderColor: "#68e241", alignItems: "center", justifyContent: "center", marginRight: 15, backgroundColor: "#10251a" },
  statusPulseText: { color: "#68e241", fontSize: 34, fontWeight: "900" },
  statusTextBox: { flex: 1 },
  statusTitle: { color: "#ffffff", fontSize: 22, fontWeight: "900" },
  statusSubtitle: { color: "#9fb0c1", fontSize: 13, marginTop: 4 },
  focusKmValue: { color: "#68e241", fontSize: 56, fontWeight: "900", textAlign: "center", marginTop: 8 },
  focusLocation: { color: "#ffffff", fontSize: 21, fontWeight: "900", textAlign: "center", marginTop: 2, marginBottom: 12 },
  focusDivider: { height: 1, backgroundColor: "#1a2838", marginVertical: 14 },
  trackItem: { flexDirection: "column", gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#1a2838" },
  trackInfo: { flex: 1 },
  trackName: { color: "#ffffff", fontSize: 14, fontWeight: "900" },
  trackMeta: { color: "#9fb0c1", fontSize: 12, marginTop: 3 },
  trackActions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  smallButton: { backgroundColor: "#1f7a48", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10 },
  smallButtonDanger: { backgroundColor: "#7d2b32" },
  smallButtonSave: { backgroundColor: "#2fc46d" },
  smallButtonMuted: { backgroundColor: "#1c2b3b" },
  smallButtonText: { color: "#ffffff", fontSize: 12, fontWeight: "900" },
  renameInput: { color: "#ffffff", backgroundColor: "#050b12", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: "#223246", marginBottom: 8 },
  renameRow: { flexDirection: "row", gap: 8 },
  bigKmBox: { backgroundColor: "#050b12", borderRadius: 18, padding: 18, marginTop: 14, marginBottom: 12, borderWidth: 1, borderColor: "#68e241", alignItems: "center" },
  bigKmLabel: { color: "#9fb0c1", fontSize: 13, fontWeight: "900", textTransform: "uppercase" },
  bigKmValue: { color: "#68e241", fontSize: 44, fontWeight: "900", marginTop: 6 },
  warningBox: { backgroundColor: "#241f11", borderColor: "#e6b800", borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 12 },
  warningTitle: { color: "#ffffff", fontSize: 15, fontWeight: "900", marginBottom: 4 },
  warningText: { color: "#f1d98b", fontSize: 14, lineHeight: 20 },
  lineItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#1a2838" },
  lineItemTitle: { color: "#ffffff", fontSize: 15, fontWeight: "900", marginBottom: 4 },
  lineItemText: { color: "#9fb0c1", fontSize: 13, lineHeight: 19 },
  noteBox: { backgroundColor: "#09111a", borderRadius: 18, padding: 14, marginTop: 6, borderWidth: 1, borderColor: "#203445" },
  noteTitle: { color: "#ffffff", fontSize: 15, fontWeight: "900", marginBottom: 6 },
  noteText: { color: "#b7c4d3", fontSize: 14, lineHeight: 20 },
  disclaimer: { color: "#68788a", fontSize: 11, marginTop: 16, lineHeight: 18, textAlign: "center" },
  routeOption: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#050b12", borderRadius: 18, paddingVertical: 15, paddingHorizontal: 14, marginBottom: 10, borderWidth: 1, borderColor: "#213040" },
  routeOptionActive: { borderColor: "#68e241", backgroundColor: "#10251a" },
  routeOptionDisabled: { opacity: 0.45 },
  routeDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: "#7b8495" },
  routeDotActive: { borderColor: "#68e241", backgroundColor: "#68e241" },
  routeDotDisabled: { borderColor: "#596273" },
  routeTextBox: { flex: 1 },
  routeTitle: { color: "#ffffff", fontSize: 16, fontWeight: "900" },
  routeTitleDisabled: { color: "#a0a8b8" },
  routeDetail: { color: "#9fb0c1", fontSize: 13, marginTop: 3 },
  routeDetailDisabled: { color: "#7b8495" },
  lockText: { color: "#7b8495", fontSize: 12, fontWeight: "800" },
  chevronText: { color: "#68e241", fontSize: 28, fontWeight: "400" },
  directionRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  directionButton: { flex: 1, backgroundColor: "#050b12", borderRadius: 16, paddingVertical: 13, paddingHorizontal: 10, alignItems: "center", borderWidth: 1, borderColor: "#223246" },
  directionButtonActive: { backgroundColor: "#10251a", borderColor: "#68e241" },
  directionButtonText: { color: "#9fb0c1", fontSize: 13, fontWeight: "900" },
  directionButtonTextActive: { color: "#68e241" },
  bottomNav: { position: "absolute", left: 18, right: 18, bottom: 18, backgroundColor: "#0c141f", borderRadius: 22, padding: 8, flexDirection: "row", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#213040" },
  navButton: { flex: 1, paddingVertical: 10, borderRadius: 16, alignItems: "center" },
  navButtonActive: { backgroundColor: "#10251a" },
  navIcon: { color: "#9fb0c1", fontSize: 18, fontWeight: "900", marginBottom: 2 },
  navButtonText: { color: "#9fb0c1", fontSize: 11, fontWeight: "900" },
  navButtonTextActive: { color: "#68e241" },
});
