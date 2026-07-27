// calibrazione_taranto_brindisi.js
// Calibrazione preliminare Taranto -> Brindisi per DoveSono?
// Master geometrica definitiva + ancoraggi da lat/lon reali delle stazioni.
// Per ora non sono inseriti salti progressiva o gallerie: aggiungili quando avrai dati certi.

export const MASTER_TARANTO_BRINDISI = {
  nome: "MASTER Taranto - Brindisi",
  direzione: "Taranto -> Brindisi",
  lunghezzaMasterMetri: 69182.47,
  progressivaFinaleMetri: 69169,
};

export const SALTI_PROGRESSIVA_TARANTO_BRINDISI = [];

export const GALLERIE_TARANTO_BRINDISI = [];

export const ANCORAGGI_STAZIONI_TARANTO_BRINDISI = [
  {
    nome: "Taranto",
    dMaster: 0.0,
    progressivaReale: 0,
  },
  {
    nome: "Nasisi",
    dMaster: 3985.9,
    progressivaReale: 3999,
  },
  {
    nome: "Monteiasi",
    dMaster: 12960.8,
    progressivaReale: 12977,
  },
  {
    nome: "Grottaglie",
    dMaster: 18465.3,
    progressivaReale: 18483,
  },
  {
    nome: "Villa Castelli",
    dMaster: 24240.0,
    progressivaReale: 24265,
  },
  {
    nome: "Francavilla Fontana",
    dMaster: 33413.7,
    progressivaReale: 33464,
  },
  {
    nome: "Oria",
    dMaster: 38938.5,
    progressivaReale: 38989,
  },
  {
    nome: "Latiano",
    dMaster: 47358.5,
    progressivaReale: 47409,
  },
  {
    nome: "Mesagne",
    dMaster: 54589.4,
    progressivaReale: 54652,
  },
  {
    nome: "Brindisi Cittadella",
    dMaster: 59429.1,
    progressivaReale: 59506,
  },
  {
    nome: "Brindisi Perrino",
    dMaster: 66508.0,
    progressivaReale: 66632,
  },
  {
    nome: "Brindisi",
    dMaster: 69182.47,
    progressivaReale: 69169,
  }
];

export const RIFERIMENTI_TARANTO_BRINDISI = [
  {
    nome: "Taranto",
    tipo: "stazione",
    progressiva: 0,
  },
  {
    nome: "Nasisi",
    tipo: "localita_servizio",
    progressiva: 3999,
  },
  {
    nome: "Monteiasi",
    tipo: "stazione",
    progressiva: 12977,
  },
  {
    nome: "Grottaglie",
    tipo: "stazione",
    progressiva: 18483,
  },
  {
    nome: "Villa Castelli",
    tipo: "stazione",
    progressiva: 24265,
  },
  {
    nome: "Francavilla Fontana",
    tipo: "stazione",
    progressiva: 33464,
  },
  {
    nome: "Oria",
    tipo: "stazione",
    progressiva: 38989,
  },
  {
    nome: "Latiano",
    tipo: "stazione",
    progressiva: 47409,
  },
  {
    nome: "Mesagne",
    tipo: "stazione",
    progressiva: 54652,
  },
  {
    nome: "Brindisi Cittadella",
    tipo: "stazione",
    progressiva: 59506,
  },
  {
    nome: "Brindisi Perrino",
    tipo: "stazione",
    progressiva: 66632,
  },
  {
    nome: "Brindisi",
    tipo: "stazione",
    progressiva: 69169,
  }
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
    Math.min(MASTER_TARANTO_BRINDISI.progressivaFinaleMetri, progressivaMetri)
  );
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

export function distanzaMasterToProgressivaReale(distanzaMasterMetri) {
  const progressiva = interpolaAncoraggi(
    distanzaMasterMetri,
    ANCORAGGI_STAZIONI_TARANTO_BRINDISI,
    "dMaster",
    "progressivaReale"
  );

  return clampProgressiva(progressiva);
}

export function progressivaRealeToDistanzaMaster(progressivaMetri) {
  return interpolaAncoraggi(
    progressivaMetri,
    ANCORAGGI_STAZIONI_TARANTO_BRINDISI,
    "progressivaReale",
    "dMaster"
  );
}

export function getCalibrazioneLinea() {
  const totaleSalti = SALTI_PROGRESSIVA_TARANTO_BRINDISI.reduce(
    (sum, salto) => sum + (salto.dopo - salto.prima),
    0
  );

  const lunghezzaProgressivaUfficiale = MASTER_TARANTO_BRINDISI.progressivaFinaleMetri;
  const lunghezzaFisicaStimata = lunghezzaProgressivaUfficiale - totaleSalti;
  const lunghezzaMasterMetri = MASTER_TARANTO_BRINDISI.lunghezzaMasterMetri;

  return {
    nome: MASTER_TARANTO_BRINDISI.nome,
    direzione: MASTER_TARANTO_BRINDISI.direzione,
    salti: SALTI_PROGRESSIVA_TARANTO_BRINDISI,
    ancoraggi: ANCORAGGI_STAZIONI_TARANTO_BRINDISI,
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

  for (const riferimento of RIFERIMENTI_TARANTO_BRINDISI) {
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

  const galleria = GALLERIE_TARANTO_BRINDISI.find(
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

  for (const salto of SALTI_PROGRESSIVA_TARANTO_BRINDISI) {
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
    riferimentoPiuVicino: trovaRiferimentoPiuVicino(progressivaRealeMetri),
    galleria: trovaGalleria(progressivaRealeMetri),
    saltoVicino: trovaSaltoVicino(progressivaRealeMetri),
    calibrazione: getCalibrazioneLinea(),
  };
}

export function creaTabellaRiferimentiCalibrati() {
  return RIFERIMENTI_TARANTO_BRINDISI.map((riferimento) => ({
    tipo: riferimento.tipo,
    nome: riferimento.nome,
    progressivaMetri: riferimento.progressiva,
    progressiva: metriToProgressiva(riferimento.progressiva),
    distanzaMasterMetri: progressivaRealeToDistanzaMaster(riferimento.progressiva),
    distanzaMaster: `${Math.round(progressivaRealeToDistanzaMaster(riferimento.progressiva))} m`,
  }));
}

export function creaTabellaGallerieCalibrate() {
  return GALLERIE_TARANTO_BRINDISI.map((galleria) => ({
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

export function trovaProssimaLocalita(progressivaMetri, direzioneMappa = "taranto_brindisi") {
  if (!isFiniteNumber(progressivaMetri)) return null;

  const localita = RIFERIMENTI_TARANTO_BRINDISI.filter((r) =>
    ["stazione", "posto_movimento", "bivio", "localita_servizio", "fine_tratta"].includes(
      r.tipo
    )
  ).sort((a, b) => a.progressiva - b.progressiva);

  if (direzioneMappa === "taranto_brindisi") {
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
