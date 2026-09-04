// calibrazione_taranto_potenza.js
// Calibrazione BOZZA Taranto -> Potenza per DoveSono?.
// Usa progressive/stazioni fornite e master provvisoria con raccordi automatici.
// La tratta include cambi di sistema progressiva:
// - Taranto 114+529 -> Bivio Metaponto 110+613 / 3+916
// - Bivio Metaponto 3+916 -> Metaponto 43+217
// - Metaponto 271+166 -> Potenza Centrale 164+058, progressiva decrescente verso Potenza.

export const MASTER_TARANTO_POTENZA = {
  nome: "MASTER BOZZA Taranto - Potenza",
  direzione: "Taranto -> Potenza",
  lunghezzaMasterMetri: 150779.0,
  progressivaFinaleMetri: 150325,
  stato: "bozza",
};

export const SALTI_PROGRESSIVA_TARANTO_POTENZA = [];

export const GALLERIE_TARANTO_POTENZA = [
  {
    "nome": "Galleria Carvotto",
    "inizio": 115688,
    "fine": 117710,
    "lunghezza": 2022,
    "progressivaUfficialeDa": "196+673",
    "progressivaUfficialeA": "198+695"
  },
  {
    "nome": "Galleria Albano",
    "inizio": 124064,
    "fine": 125089,
    "lunghezza": 1025,
    "progressivaUfficialeDa": "189+294",
    "progressivaUfficialeA": "190+319"
  }
];

export const ANCORAGGI_STAZIONI_TARANTO_POTENZA = [
  {
    "nome": "Taranto",
    "dMaster": 0.0,
    "progressivaReale": 0
  },
  {
    "nome": "Bivio Metaponto",
    "dMaster": 4134.2,
    "progressivaReale": 3916
  },
  {
    "nome": "Palagiano Chiatona",
    "dMaster": 16721.2,
    "progressivaReale": 16386
  },
  {
    "nome": "Castellaneta Marina",
    "dMaster": 25676.6,
    "progressivaReale": 25341
  },
  {
    "nome": "Ginosa",
    "dMaster": 34236.6,
    "progressivaReale": 33895
  },
  {
    "nome": "Metaponto",
    "dMaster": 43550.6,
    "progressivaReale": 43217
  },
  {
    "nome": "Bernalda",
    "dMaster": 56040.6,
    "progressivaReale": 55661
  },
  {
    "nome": "Pisticci",
    "dMaster": 68177.7,
    "progressivaReale": 67858
  },
  {
    "nome": "Ferrandina Matera",
    "dMaster": 81038.4,
    "progressivaReale": 80718
  },
  {
    "nome": "Salandra",
    "dMaster": 94232.0,
    "progressivaReale": 93855
  },
  {
    "nome": "Grassano",
    "dMaster": 103898.6,
    "progressivaReale": 103496
  },
  {
    "nome": "Calciano",
    "dMaster": 107209.9,
    "progressivaReale": 106844
  },
  {
    "nome": "Campomaggiore",
    "dMaster": 119184.8,
    "progressivaReale": 118764
  },
  {
    "nome": "Albano Lucania",
    "dMaster": 126166.8,
    "progressivaReale": 125775
  },
  {
    "nome": "Trivigno",
    "dMaster": 128698.8,
    "progressivaReale": 128306
  },
  {
    "nome": "Brindisi di Montagna",
    "dMaster": 133449.6,
    "progressivaReale": 133079
  },
  {
    "nome": "Vaglio Basilicata",
    "dMaster": 143317.2,
    "progressivaReale": 142878
  },
  {
    "nome": "Potenza Centrale",
    "dMaster": 150779.0,
    "progressivaReale": 150325
  }
];

export const RIFERIMENTI_TARANTO_POTENZA = [
  {
    "nome": "Taranto",
    "tipo": "stazione",
    "progressiva": 0,
    "lat": 40.483678375,
    "lon": 17.223792276
  },
  {
    "nome": "Bivio Metaponto",
    "tipo": "bivio",
    "progressiva": 3916,
    "lat": 40.488090759,
    "lon": 17.184402876
  },
  {
    "nome": "PM Cagioni",
    "tipo": "posto_movimento",
    "progressiva": 8244,
    "lat": 40.509638536,
    "lon": 17.156261271
  },
  {
    "nome": "Palagiano Chiatona",
    "tipo": "stazione",
    "progressiva": 16386,
    "lat": 40.517034692,
    "lon": 17.05922216
  },
  {
    "nome": "Castellaneta Marina",
    "tipo": "stazione",
    "progressiva": 25341,
    "lat": 40.481138632,
    "lon": 16.965463496
  },
  {
    "nome": "Ginosa",
    "tipo": "stazione",
    "progressiva": 33895,
    "lat": 40.429196147,
    "lon": 16.891008254
  },
  {
    "nome": "Metaponto",
    "tipo": "stazione",
    "progressiva": 43217,
    "lat": 40.368443706,
    "lon": 16.815355204
  },
  {
    "nome": "Bernalda",
    "tipo": "stazione",
    "progressiva": 55661,
    "lat": 40.397588009,
    "lon": 16.68226555
  },
  {
    "nome": "Pisticci",
    "tipo": "stazione",
    "progressiva": 67858,
    "lat": 40.420862258,
    "lon": 16.552198498
  },
  {
    "nome": "Ferrandina Matera",
    "tipo": "stazione",
    "progressiva": 80718,
    "lat": 40.516448402,
    "lon": 16.475491731
  },
  {
    "nome": "Salandra",
    "tipo": "stazione",
    "progressiva": 93855,
    "lat": 40.583504167,
    "lon": 16.351590967
  },
  {
    "nome": "Grassano",
    "tipo": "stazione",
    "progressiva": 103496,
    "lat": 40.593289071,
    "lon": 16.241109083
  },
  {
    "nome": "Calciano",
    "tipo": "stazione",
    "progressiva": 106844,
    "lat": 40.5951259,
    "lon": 16.202521929
  },
  {
    "nome": "Campomaggiore",
    "tipo": "stazione",
    "progressiva": 118764,
    "lat": 40.550811022,
    "lon": 16.086805316
  },
  {
    "nome": "Albano Lucania",
    "tipo": "stazione",
    "progressiva": 125775,
    "lat": 40.574696241,
    "lon": 16.021306745
  },
  {
    "nome": "Trivigno",
    "tipo": "stazione",
    "progressiva": 128306,
    "lat": 40.588565311,
    "lon": 15.99787216
  },
  {
    "nome": "Brindisi di Montagna",
    "tipo": "stazione",
    "progressiva": 133079,
    "lat": 40.611984692,
    "lon": 15.955878214
  },
  {
    "nome": "Vaglio Basilicata",
    "tipo": "stazione",
    "progressiva": 142878,
    "lat": 40.656323618,
    "lon": 15.880126112
  },
  {
    "nome": "Potenza Centrale",
    "tipo": "stazione",
    "progressiva": 150325,
    "lat": 40.629462164,
    "lon": 15.806820943
  }
];

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function formatKm(metri) {
  if (!isFiniteNumber(metri)) return "--";
  const rounded = Math.round(Math.abs(metri));
  const km = Math.floor(rounded / 1000);
  const m = rounded % 1000;
  return `${km}+${String(m).padStart(3, "0")}`;
}

export function metriToProgressiva(metri) {
  if (!isFiniteNumber(metri)) return "--";
  const p = Math.max(0, Math.min(MASTER_TARANTO_POTENZA.progressivaFinaleMetri, metri));

  if (p <= 3916) {
    return formatKm(114529 - p);
  }

  if (p <= 43217) {
    return formatKm(p);
  }

  const progressivaMetapontoPotenza = 271166 - (p - 43217);
  return formatKm(progressivaMetapontoPotenza);
}

export function progressivaToMetri(progressiva) {
  if (typeof progressiva === "number" && Number.isFinite(progressiva)) return progressiva;
  if (!progressiva) return 0;

  const text = String(progressiva).trim().replace(",", ".");
  if (!text.includes("+")) {
    const numero = Number(text.replace(/[^\d.-]/g, ""));
    return Number.isFinite(numero) ? numero : 0;
  }

  const [kmRaw, mRaw] = text.split("+");
  const km = Number(kmRaw.replace(/[^\d.-]/g, ""));
  const metri = Number(mRaw.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(km) || !Number.isFinite(metri)) return 0;
  return km * 1000 + metri;
}

function clampProgressiva(progressivaMetri) {
  if (!isFiniteNumber(progressivaMetri)) return progressivaMetri;
  return Math.max(0, Math.min(MASTER_TARANTO_POTENZA.progressivaFinaleMetri, progressivaMetri));
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
    ANCORAGGI_STAZIONI_TARANTO_POTENZA,
    "dMaster",
    "progressivaReale"
  );
  return clampProgressiva(progressiva);
}

export function progressivaRealeToDistanzaMaster(progressivaMetri) {
  return interpolaAncoraggi(
    progressivaMetri,
    ANCORAGGI_STAZIONI_TARANTO_POTENZA,
    "progressivaReale",
    "dMaster"
  );
}

export function getCalibrazioneLinea() {
  const totaleSalti = SALTI_PROGRESSIVA_TARANTO_POTENZA.reduce(
    (sum, salto) => sum + Math.abs((salto.dopo || 0) - (salto.prima || 0)),
    0
  );

  const lunghezzaProgressivaUfficiale = MASTER_TARANTO_POTENZA.progressivaFinaleMetri;
  const lunghezzaFisicaStimata = lunghezzaProgressivaUfficiale;
  const lunghezzaMasterMetri = MASTER_TARANTO_POTENZA.lunghezzaMasterMetri;

  return {
    nome: MASTER_TARANTO_POTENZA.nome,
    direzione: MASTER_TARANTO_POTENZA.direzione,
    stato: MASTER_TARANTO_POTENZA.stato,
    salti: SALTI_PROGRESSIVA_TARANTO_POTENZA,
    gallerie: GALLERIE_TARANTO_POTENZA,
    ancoraggi: ANCORAGGI_STAZIONI_TARANTO_POTENZA,
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

  for (const riferimento of RIFERIMENTI_TARANTO_POTENZA) {
    const distanza = Math.abs(progressivaRealeMetri - riferimento.progressiva);
    if (!best || distanza < best.distanza) {
      best = { ...riferimento, distanza };
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

  const galleria = GALLERIE_TARANTO_POTENZA.find((g) => {
    const inizio = Math.min(g.inizio, g.fine);
    const fine = Math.max(g.inizio, g.fine);
    return progressivaRealeMetri >= inizio && progressivaRealeMetri <= fine;
  });

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
  return null;
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
  return RIFERIMENTI_TARANTO_POTENZA.map((riferimento) => {
    const distanzaMaster = progressivaRealeToDistanzaMaster(riferimento.progressiva);
    return {
      tipo: riferimento.tipo,
      nome: riferimento.nome,
      progressivaMetri: riferimento.progressiva,
      progressiva: metriToProgressiva(riferimento.progressiva),
      distanzaMasterMetri: distanzaMaster,
      distanzaMaster: `${Math.round(distanzaMaster)} m`,
      lat: riferimento.lat,
      lon: riferimento.lon,
    };
  });
}

export function creaTabellaGallerieCalibrate() {
  return GALLERIE_TARANTO_POTENZA.map((galleria) => {
    const inizio = Math.min(galleria.inizio, galleria.fine);
    const fine = Math.max(galleria.inizio, galleria.fine);
    const dInizio = progressivaRealeToDistanzaMaster(inizio);
    const dFine = progressivaRealeToDistanzaMaster(fine);

    return {
      nome: galleria.nome,
      progressivaInizioMetri: inizio,
      progressivaFineMetri: fine,
      progressivaInizio: metriToProgressiva(inizio),
      progressivaFine: metriToProgressiva(fine),
      distanzaMasterInizioMetri: dInizio,
      distanzaMasterFineMetri: dFine,
      distanzaMasterInizio: `${Math.round(dInizio)} m`,
      distanzaMasterFine: `${Math.round(dFine)} m`,
      lunghezza: galleria.lunghezza,
    };
  });
}

export function trovaProssimaLocalita(progressivaMetri, direzioneMappa = "taranto_potenza") {
  if (!isFiniteNumber(progressivaMetri)) return null;

  const localita = RIFERIMENTI_TARANTO_POTENZA.filter((r) =>
    ["stazione", "posto_movimento", "bivio", "localita_servizio", "fine_tratta"].includes(r.tipo)
  ).sort((a, b) => a.progressiva - b.progressiva);

  if (direzioneMappa === "taranto_potenza") {
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


