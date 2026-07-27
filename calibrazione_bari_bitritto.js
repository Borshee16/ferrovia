// Generato da scripts/genera_tratte.py. Non modificare manualmente.
const NOME = "Bari - Bitritto";
const DIREZIONE_ANDATA = "bari_bitritto";
const DIREZIONE_RITORNO = "bitritto_bari";
const MASTER_LENGTH = 11911.73;
const MIN_PROGRESSIVA = 0;
const MAX_PROGRESSIVA = 11949;
const RIFERIMENTI = [{"nome":"Bari Centrale","tipo":"stazione","progressiva":0,"lat":41.117311151,"lon":16.868849001},{"nome":"Bari Parco Nord","tipo":"stazione","progressiva":2549,"lat":41.111501784,"lon":16.842114488},{"nome":"Bari S. Rita","tipo":"stazione","progressiva":7286,"lat":41.073133781,"lon":16.851555408},{"nome":"Bari Loseto","tipo":"stazione","progressiva":10654,"lat":41.043880405,"lon":16.847156292},{"nome":"Bitritto","tipo":"stazione","progressiva":11949,"lat":41.043896958,"lon":16.833177677}];
const ANCORAGGI = [{"dMaster":0.0,"progressiva":0},{"dMaster":2549,"progressiva":2549},{"dMaster":7271.58,"progressiva":7286},{"dMaster":10652.95,"progressiva":10654},{"dMaster":11911.73,"progressiva":11949}];

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function formatKm(metri) {
  if (!isFiniteNumber(metri)) return "--";
  const rounded = Math.round(Math.abs(metri));
  return `${Math.floor(rounded / 1000)}+${String(rounded % 1000).padStart(3, "0")}`;
}

function interpola(x, punti, campoX, campoY) {
  if (!isFiniteNumber(x) || punti.length < 2) return x;
  const ordinati = [...punti].sort((a, b) => a[campoX] - b[campoX]);
  if (x <= ordinati[0][campoX]) {
    const a = ordinati[0];
    const b = ordinati[1];
    return a[campoY] + ((x - a[campoX]) / (b[campoX] - a[campoX])) * (b[campoY] - a[campoY]);
  }
  for (let i = 0; i < ordinati.length - 1; i += 1) {
    const a = ordinati[i];
    const b = ordinati[i + 1];
    if (x >= a[campoX] && x <= b[campoX]) {
      return a[campoY] + ((x - a[campoX]) / (b[campoX] - a[campoX])) * (b[campoY] - a[campoY]);
    }
  }
  const a = ordinati[ordinati.length - 2];
  const b = ordinati[ordinati.length - 1];
  return a[campoY] + ((x - a[campoX]) / (b[campoX] - a[campoX])) * (b[campoY] - a[campoY]);
}

export function distanzaMasterToProgressivaReale(distanzaMasterMetri) {
  return Math.max(MIN_PROGRESSIVA, Math.min(MAX_PROGRESSIVA, interpola(
    distanzaMasterMetri, ANCORAGGI, "dMaster", "progressiva"
  )));
}

export function progressivaRealeToDistanzaMaster(progressivaMetri) {
  return interpola(progressivaMetri, ANCORAGGI, "progressiva", "dMaster");
}

export function metriToProgressiva(metri) {
  if (!isFiniteNumber(metri)) return "--";
  const p = Math.max(MIN_PROGRESSIVA, Math.min(MAX_PROGRESSIVA, metri));
  if (p <= 2549) return formatKm(p);
  const progressivaDopoParcoNord = p - 2549;
  if (progressivaDopoParcoNord <= 646) return formatKm(progressivaDopoParcoNord);
  return formatKm(progressivaDopoParcoNord - 116);
}

export function getCalibrazioneLinea() {
  return {
    nome: NOME,
    direzione: DIREZIONE_ANDATA,
    stato: "Disponibile",
    salti: [{"prima": 2549, "dopo": 0, "nota": "Cambio progressiva Bari Parco Nord"}, {"prima": 646, "dopo": 530, "nota": "Salto progressiva segnalato"}],
    gallerie: [],
    ancoraggi: ANCORAGGI,
    totaleSalti: 2665,
    lunghezzaProgressivaUfficiale: MAX_PROGRESSIVA - MIN_PROGRESSIVA,
    lunghezzaFisicaStimata: MAX_PROGRESSIVA - MIN_PROGRESSIVA,
    lunghezzaMasterMetri: MASTER_LENGTH,
    fattoreMasterSuFisica: MASTER_LENGTH / (MAX_PROGRESSIVA - MIN_PROGRESSIVA),
    fattoreFisicaSuMaster: (MAX_PROGRESSIVA - MIN_PROGRESSIVA) / MASTER_LENGTH,
  };
}

function trovaRiferimentoPiuVicino(progressivaMetri) {
  let best = null;
  for (const riferimento of RIFERIMENTI) {
    const distanza = Math.abs(progressivaMetri - riferimento.progressiva);
    if (!best || distanza < best.distanza) best = { ...riferimento, distanza };
  }
  return best ? {
    nome: best.nome,
    tipo: best.tipo,
    progressivaMetri: best.progressiva,
    progressiva: metriToProgressiva(best.progressiva),
    distanza: best.distanza,
  } : null;
}

export function descriviPosizioneSuMaster(distanzaMasterMetri) {
  const distanzaMasterPulita = Math.max(0, Number(distanzaMasterMetri) || 0);
  const progressivaRealeMetri = distanzaMasterToProgressivaReale(distanzaMasterPulita);
  return {
    distanzaMasterMetri: distanzaMasterPulita,
    distanzaMaster: `${Math.round(distanzaMasterPulita)} m`,
    progressivaRealeMetri,
    progressivaReale: metriToProgressiva(progressivaRealeMetri),
    riferimentoPiuVicino: trovaRiferimentoPiuVicino(progressivaRealeMetri),
    galleria: null,
    saltoVicino: null,
    calibrazione: getCalibrazioneLinea(),
  };
}

export function creaTabellaRiferimentiCalibrati() {
  return RIFERIMENTI.map((riferimento) => ({
    ...riferimento,
    progressivaMetri: riferimento.progressiva,
    progressiva: metriToProgressiva(riferimento.progressiva),
    distanzaMasterMetri: progressivaRealeToDistanzaMaster(riferimento.progressiva),
  }));
}

export function creaTabellaGallerieCalibrate() {
  return [];
}

export function trovaProssimaLocalita(progressivaMetri, direzioneMappa = DIREZIONE_ANDATA) {
  if (!isFiniteNumber(progressivaMetri)) return null;
  const ordinati = [...RIFERIMENTI].sort((a, b) => a.progressiva - b.progressiva);
  const avanti = direzioneMappa === DIREZIONE_ANDATA;
  const candidati = avanti
    ? ordinati.filter((r) => r.progressiva > progressivaMetri + 30)
    : ordinati.filter((r) => r.progressiva < progressivaMetri - 30).reverse();
  const prossima = candidati[0];
  if (!prossima) return null;
  return {
    nome: prossima.nome,
    tipo: prossima.tipo,
    progressivaMetri: prossima.progressiva,
    progressiva: metriToProgressiva(prossima.progressiva),
    distanzaMetri: Math.abs(prossima.progressiva - progressivaMetri),
  };
}
