// calibrazione_bari_taranto.js
// Calibrazione Bari → Taranto con ancoraggi FV/stazioni e gestione salti progressiva.
//
// Questa versione lavora così:
// 1. distanza master GPS → progressiva fisica continua
// 2. progressiva fisica continua → progressiva ufficiale con salti
//
// Serve per evitare valori falsi dentro i salti:
// - Bitetto-Palo del Colle: 14+455 → 14+932
// - Acquaviva delle Fonti: 37+399 → 40+309
// - Palagiano-Mottola: 85+693 → 92+923

export const MASTER_BARI_TARANTO = {
  nome: "MASTER Bari - Taranto",
  direzione: "Bari → Taranto",

  // Lunghezza della master GPS attualmente usata.
  // Se stai usando la MASTER Bari Taranto 003 completa, la lunghezza può essere circa 103983 m.
  // Questo valore resta usato solo come dato informativo/fallback.
  lunghezzaMasterMetri: 103934,

  progressivaFinaleMetri: 114529,
};

export const SALTI_PROGRESSIVA_BARI_TARANTO = [
  {
    nome: "Deviatoio estremo Bari",
    prima: 646,
    dopo: 530,
  },
  {
    nome: "GR scambi Parco Nord",
    prima: 1623,
    dopo: 2549,
  },
  {
    nome: "Bitetto-Palo del Colle",
    prima: 14455,
    dopo: 14932,
  },
  {
    nome: "Acquaviva delle Fonti",
    prima: 37399,
    dopo: 40309,
  },
  {
    nome: "Palagiano-Mottola",
    prima: 85693,
    dopo: 92923,
  },
];

// Ancoraggi calcolati da lat/lon reali dei fabbricati viaggiatori sulla master Bari-Taranto 003.
// Modugno esclusa per ora perché la coordinata era incoerente.
// Per località con doppia progressiva viene usata la progressiva dopo salto.
export const ANCORAGGI_STAZIONI_BARI_TARANTO = [
  {
    nome: "Bari Villaggio del Lavoratore",
    dMaster: 4675.33,
    progressivaReale: 4594,
  },
  {
    nome: "Bitetto-Palo del Colle",
    dMaster: 14544.49,
    progressivaReale: 14932,
  },
  {
    nome: "Grumo Appula",
    dMaster: 18646.67,
    progressivaReale: 19035,
  },
  {
    nome: "Sannicandro di Bari",
    dMaster: 25806.01,
    progressivaReale: 26176,
  },
  {
    nome: "Acquaviva delle Fonti",
    dMaster: 37016.84,
    progressivaReale: 40309,
  },
  {
    nome: "Gioia del Colle",
    dMaster: 49714.22,
    progressivaReale: 53000,
  },
  {
    nome: "PM Grottalupara",
    dMaster: 61188.19,
    progressivaReale: 64599,
  },
  {
    nome: "Castellaneta",
    dMaster: 70119.36,
    progressivaReale: 73529,
  },
  {
    nome: "Palagianello",
    dMaster: 75306.91,
    progressivaReale: 78725,
  },
  {
    nome: "Palagiano-Mottola",
    dMaster: 82258.38,
    progressivaReale: 92923,
  },
  {
    nome: "Massafra",
    dMaster: 86416.9,
    progressivaReale: 97090,
  },
];

export const RIFERIMENTI_BARI_TARANTO = [
  {
    nome: "Bari",
    tipo: "stazione",
    progressiva: 0,
  },
  {
    nome: "Bari Villaggio del Lavoratore",
    tipo: "stazione",
    progressiva: 4594,
  },
  {
    nome: "Modugno",
    tipo: "stazione",
    progressiva: 9597,
  },
  {
    nome: "Bitetto-Palo del Colle",
    tipo: "stazione",
    progressiva: 14932,
  },
  {
    nome: "Grumo Appula",
    tipo: "stazione",
    progressiva: 19035,
  },
  {
    nome: "Sannicandro di Bari",
    tipo: "stazione",
    progressiva: 26176,
  },
  {
    nome: "Acquaviva delle Fonti",
    tipo: "stazione",
    progressiva: 40309,
  },
  {
    nome: "Gioia del Colle",
    tipo: "stazione",
    progressiva: 53000,
  },
  {
    nome: "PM Grottalupara",
    tipo: "posto_movimento",
    progressiva: 64599,
  },
  {
    nome: "Castellaneta",
    tipo: "stazione",
    progressiva: 73529,
  },
  {
    nome: "Palagianello",
    tipo: "stazione",
    progressiva: 78725,
  },
  {
    nome: "Palagiano-Mottola",
    tipo: "stazione",
    progressiva: 92923,
  },
  {
    nome: "Massafra",
    tipo: "stazione",
    progressiva: 97090,
  },
  {
    nome: "Bellavista",
    tipo: "localita_servizio",
    progressiva: 106487,
  },
  {
    nome: "Bivio Metaponto",
    tipo: "bivio",
    progressiva: 110613,
  },
  {
    nome: "Fine tratta Taranto",
    tipo: "fine_tratta",
    progressiva: 114529,
  },
];

export const GALLERIE_BARI_TARANTO = [
  {
    nome: "Galleria Madonna della Grotta",
    inizio: 5281,
    fine: 6402,
    lunghezza: 1121,
  },
  {
    nome: "Galleria Santa Croce",
    inizio: 60043,
    fine: 63467,
    lunghezza: 3424,
  },
  {
    nome: "Galleria Madonna del Carmine",
    inizio: 67237,
    fine: 71273,
    lunghezza: 4036,
  },
  {
    nome: "Galleria San Francesco",
    inizio: 72061,
    fine: 73129,
    lunghezza: 1068,
  },
];

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export function metriToProgressiva(metri) {
  if (!isFiniteNumber(metri)) return "--";

  const rounded = Math.round(metri);
  const km = Math.floor(rounded / 1000);
  const m = Math.abs(rounded % 1000);

  return `${km}+${String(m).padStart(3, "0")}`;
}

export function progressivaToMetri(progressiva) {
  if (typeof progressiva === "number" && Number.isFinite(progressiva)) {
    return progressiva;
  }

  if (!progressiva) return 0;

  const text = String(progressiva).trim().replace(",", ".");

  if (text.includes("+")) {
    const [kmRaw, mRaw] = text.split("+");
    const km = Number(kmRaw.replace(/[^\d.-]/g, ""));
    const metri = Number(mRaw.replace(/[^\d.-]/g, ""));

    if (Number.isFinite(km) && Number.isFinite(metri)) {
      return km * 1000 + metri;
    }
  }

  const numero = Number(text.replace(/[^\d.-]/g, ""));
  return Number.isFinite(numero) ? numero : 0;
}

function clampProgressiva(progressivaMetri) {
  if (!isFiniteNumber(progressivaMetri)) return progressivaMetri;

  return Math.max(
    0,
    Math.min(MASTER_BARI_TARANTO.progressivaFinaleMetri, progressivaMetri)
  );
}

function getSaltiConFisica() {
  let deltaCumulatoPrima = 0;

  return SALTI_PROGRESSIVA_BARI_TARANTO.map((salto) => {
    const delta = salto.dopo - salto.prima;

    const saltoConFisica = {
      ...salto,
      delta,
      fisicaSalto: salto.prima - deltaCumulatoPrima,
    };

    deltaCumulatoPrima += delta;

    return saltoConFisica;
  });
}

export function progressivaUfficialeToFisica(progressivaReale) {
  if (!isFiniteNumber(progressivaReale)) return progressivaReale;

  let fisica = progressivaReale;

  for (const salto of SALTI_PROGRESSIVA_BARI_TARANTO) {
    const delta = salto.dopo - salto.prima;

    // Se siamo dopo il valore "dopo salto", togliamo il salto dalla progressiva.
    // Così otteniamo una distanza fisica continua.
    if (progressivaReale >= salto.dopo) {
      fisica -= delta;
    }
  }

  return fisica;
}

export function fisicaToProgressivaUfficiale(progressivaFisica) {
  if (!isFiniteNumber(progressivaFisica)) return progressivaFisica;

  let progressiva = progressivaFisica;

  for (const salto of getSaltiConFisica()) {
    // Appena superiamo fisicamente il punto di salto,
    // la progressiva ufficiale salta direttamente al valore "dopo".
    if (progressivaFisica >= salto.fisicaSalto) {
      progressiva += salto.delta;
    }
  }

  return clampProgressiva(progressiva);
}

function creaAncoraggiFisici() {
  return ANCORAGGI_STAZIONI_BARI_TARANTO.map((ancora) => ({
    ...ancora,
    progressivaFisica: progressivaUfficialeToFisica(ancora.progressivaReale),
  })).sort((a, b) => a.dMaster - b.dMaster);
}

function interpolaAncoraggi(x, punti, campoX, campoY) {
  if (!isFiniteNumber(x)) return x;

  const ordinati = [...punti].sort((a, b) => a[campoX] - b[campoX]);

  if (ordinati.length < 2) return x;

  if (x <= ordinati[0][campoX]) {
    const a = ordinati[0];
    const b = ordinati[1];

    const t = (x - a[campoX]) / (b[campoX] - a[campoX]);
    return a[campoY] + (b[campoY] - a[campoY]) * t;
  }

  for (let i = 0; i < ordinati.length - 1; i += 1) {
    const a = ordinati[i];
    const b = ordinati[i + 1];

    if (x >= a[campoX] && x <= b[campoX]) {
      const t = (x - a[campoX]) / (b[campoX] - a[campoX]);
      return a[campoY] + (b[campoY] - a[campoY]) * t;
    }
  }

  const penultimo = ordinati[ordinati.length - 2];
  const ultimo = ordinati[ordinati.length - 1];

  const t = (x - penultimo[campoX]) / (ultimo[campoX] - penultimo[campoX]);
  return penultimo[campoY] + (ultimo[campoY] - penultimo[campoY]) * t;
}

function progressivaDaDistanzaMasterConAncoraggi(distanzaMasterMetri) {
  const ancoraggiFisici = creaAncoraggiFisici();

  const progressivaFisica = interpolaAncoraggi(
    distanzaMasterMetri,
    ancoraggiFisici,
    "dMaster",
    "progressivaFisica"
  );

  return fisicaToProgressivaUfficiale(progressivaFisica);
}

function distanzaMasterDaProgressivaConAncoraggi(progressivaMetri) {
  const ancoraggiFisici = creaAncoraggiFisici();
  const progressivaFisica = progressivaUfficialeToFisica(progressivaMetri);

  return interpolaAncoraggi(
    progressivaFisica,
    ancoraggiFisici,
    "progressivaFisica",
    "dMaster"
  );
}

export function distanzaMasterToProgressivaReale(distanzaMasterMetri) {
  return progressivaDaDistanzaMasterConAncoraggi(distanzaMasterMetri);
}

export function progressivaRealeToDistanzaMaster(progressivaMetri) {
  return distanzaMasterDaProgressivaConAncoraggi(progressivaMetri);
}

export function getCalibrazioneLinea() {
  const totaleSalti = SALTI_PROGRESSIVA_BARI_TARANTO.reduce(
    (sum, salto) => sum + (salto.dopo - salto.prima),
    0
  );

  const lunghezzaProgressivaUfficiale = MASTER_BARI_TARANTO.progressivaFinaleMetri;
  const lunghezzaFisicaStimata = lunghezzaProgressivaUfficiale - totaleSalti;
  const lunghezzaMasterMetri = MASTER_BARI_TARANTO.lunghezzaMasterMetri;

  return {
    nome: MASTER_BARI_TARANTO.nome,
    direzione: MASTER_BARI_TARANTO.direzione,
    salti: SALTI_PROGRESSIVA_BARI_TARANTO,
    ancoraggi: ANCORAGGI_STAZIONI_BARI_TARANTO,
    totaleSalti,
    lunghezzaProgressivaUfficiale,
    lunghezzaFisicaStimata,
    lunghezzaMasterMetri,
    fattoreMasterSuFisica:
      lunghezzaFisicaStimata > 0 ? lunghezzaMasterMetri / lunghezzaFisicaStimata : 1,
    fattoreFisicaSuMaster:
      lunghezzaMasterMetri > 0 ? lunghezzaFisicaStimata / lunghezzaMasterMetri : 1,
  };
}

function trovaRiferimentoPiuVicino(progressivaRealeMetri) {
  if (!isFiniteNumber(progressivaRealeMetri)) return null;

  let best = null;

  for (const riferimento of RIFERIMENTI_BARI_TARANTO) {
    const distanza = Math.abs(progressivaRealeMetri - riferimento.progressiva);

    if (!best || distanza < best.distanza) {
      best = {
        ...riferimento,
        distanza,
      };
    }
  }

  if (!best) return null;

  return {
    nome: best.nome,
    tipo: best.tipo,
    progressivaMetri: best.progressiva,
    progressiva: metriToProgressiva(best.progressiva),
    distanza: best.distanza,
  };
}

function trovaGalleria(progressivaRealeMetri) {
  if (!isFiniteNumber(progressivaRealeMetri)) return null;

  const galleria = GALLERIE_BARI_TARANTO.find(
    (g) => progressivaRealeMetri >= g.inizio && progressivaRealeMetri <= g.fine
  );

  if (!galleria) return null;

  return {
    nome: galleria.nome,
    inizioMetri: galleria.inizio,
    fineMetri: galleria.fine,
    inizio: metriToProgressiva(galleria.inizio),
    fine: metriToProgressiva(galleria.fine),
    lunghezza: galleria.lunghezza,
  };
}

function trovaSaltoVicino(progressivaRealeMetri) {
  if (!isFiniteNumber(progressivaRealeMetri)) return null;

  let best = null;

  for (const salto of SALTI_PROGRESSIVA_BARI_TARANTO) {
    const distanzaPrima = Math.abs(progressivaRealeMetri - salto.prima);
    const distanzaDopo = Math.abs(progressivaRealeMetri - salto.dopo);
    const distanza = Math.min(distanzaPrima, distanzaDopo);

    if (!best || distanza < best.distanza) {
      best = {
        ...salto,
        distanza,
      };
    }
  }

  if (!best || best.distanza > 500) return null;

  return {
    nome: best.nome,
    primaMetri: best.prima,
    dopoMetri: best.dopo,
    prima: metriToProgressiva(best.prima),
    dopo: metriToProgressiva(best.dopo),
    salto: best.dopo - best.prima,
    distanza: best.distanza,
  };
}

export function descriviPosizioneSuMaster(distanzaMasterMetri) {
  const distanzaMasterPulita = Math.max(0, Number(distanzaMasterMetri) || 0);
  const progressivaRealeMetri = distanzaMasterToProgressivaReale(distanzaMasterPulita);

  return {
    distanzaMasterMetri: distanzaMasterPulita,
    distanzaMaster: `${Math.round(distanzaMasterPulita)} m`,
    progressivaRealeMetri,
    progressivaReale: metriToProgressiva(progressivaRealeMetri),
    progressivaFisicaMetri: progressivaUfficialeToFisica(progressivaRealeMetri),
    riferimentoPiuVicino: trovaRiferimentoPiuVicino(progressivaRealeMetri),
    galleria: trovaGalleria(progressivaRealeMetri),
    saltoVicino: trovaSaltoVicino(progressivaRealeMetri),
    calibrazione: getCalibrazioneLinea(),
  };
}

export function creaTabellaRiferimentiCalibrati() {
  const righe = [];

  for (const riferimento of RIFERIMENTI_BARI_TARANTO) {
    righe.push({
      tipo: riferimento.tipo,
      nome: riferimento.nome,
      progressivaMetri: riferimento.progressiva,
      progressiva: metriToProgressiva(riferimento.progressiva),
      distanzaMasterMetri: progressivaRealeToDistanzaMaster(riferimento.progressiva),
      distanzaMaster: `${Math.round(progressivaRealeToDistanzaMaster(riferimento.progressiva))} m`,
    });
  }

  for (const salto of SALTI_PROGRESSIVA_BARI_TARANTO) {
    righe.push({
      tipo: "salto_progressiva",
      nome: salto.nome,
      prima: {
        progressivaMetri: salto.prima,
        progressiva: metriToProgressiva(salto.prima),
        distanzaMasterMetri: progressivaRealeToDistanzaMaster(salto.prima),
        distanzaMaster: `${Math.round(progressivaRealeToDistanzaMaster(salto.prima))} m`,
      },
      dopo: {
        progressivaMetri: salto.dopo,
        progressiva: metriToProgressiva(salto.dopo),
        distanzaMasterMetri: progressivaRealeToDistanzaMaster(salto.dopo),
        distanzaMaster: `${Math.round(progressivaRealeToDistanzaMaster(salto.dopo))} m`,
      },
      salto: salto.dopo - salto.prima,
    });
  }

  return righe.sort((a, b) => {
    const ax = a.progressivaMetri ?? a.prima?.progressivaMetri ?? 0;
    const bx = b.progressivaMetri ?? b.prima?.progressivaMetri ?? 0;
    return ax - bx;
  });
}

export function creaTabellaGallerieCalibrate() {
  return GALLERIE_BARI_TARANTO.map((galleria) => ({
    nome: galleria.nome,
    progressivaInizioMetri: galleria.inizio,
    progressivaFineMetri: galleria.fine,
    progressivaInizio: metriToProgressiva(galleria.inizio),
    progressivaFine: metriToProgressiva(galleria.fine),
    distanzaMasterInizioMetri: progressivaRealeToDistanzaMaster(galleria.inizio),
    distanzaMasterFineMetri: progressivaRealeToDistanzaMaster(galleria.fine),
    distanzaMasterInizio: `${Math.round(progressivaRealeToDistanzaMaster(galleria.inizio))} m`,
    distanzaMasterFine: `${Math.round(progressivaRealeToDistanzaMaster(galleria.fine))} m`,
    lunghezza: galleria.lunghezza,
  }));
}

export function trovaProssimaLocalita(progressivaMetri, direzioneMappa = "bari_taranto") {
  if (!isFiniteNumber(progressivaMetri)) return null;

  const localita = RIFERIMENTI_BARI_TARANTO.filter((r) =>
    ["stazione", "posto_movimento", "bivio", "localita_servizio", "fine_tratta"].includes(
      r.tipo
    )
  ).sort((a, b) => a.progressiva - b.progressiva);

  if (direzioneMappa === "bari_taranto") {
    const prossima = localita.find((r) => r.progressiva > progressivaMetri + 30);

    if (!prossima) return null;

    return {
      nome: prossima.nome,
      tipo: prossima.tipo,
      progressivaMetri: prossima.progressiva,
      progressiva: metriToProgressiva(prossima.progressiva),
      distanzaMetri: prossima.progressiva - progressivaMetri,
    };
  }

  const precedenti = localita
    .filter((r) => r.progressiva < progressivaMetri - 30)
    .sort((a, b) => b.progressiva - a.progressiva);

  const prossima = precedenti[0];

  if (!prossima) return null;

  return {
    nome: prossima.nome,
    tipo: prossima.tipo,
    progressivaMetri: prossima.progressiva,
    progressiva: metriToProgressiva(prossima.progressiva),
    distanzaMetri: progressivaMetri - prossima.progressiva,
  };
}
