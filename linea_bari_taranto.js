// linea_bari_taranto.js
// Database preliminare linea Bari - Taranto
// Unità: metri. Esempio: km 14+455 = 14455

export const LINEA_BARI_TARANTO = {
  id: "bari_taranto",
  nome: "Bari - Taranto",
  direzioneMaster: "Bari → Taranto",

  inizio: {
    nome: "Bari",
    km: 0,
  },

  fine: {
    nome: "Taranto",
    km: 114529,
  },

  riferimenti: [
    { tipo: "stazione", nome: "Bari", km: 0, note: "Inizio tratta" },
    { tipo: "stazione", nome: "Bari Villaggio del Lavoratore", km: 4594 },
    { tipo: "stazione", nome: "Modugno", km: 9597 },

    {
      tipo: "salto_progressiva",
      nome: "Bitetto - Palo del Colle",
      kmPrima: 14455,
      kmDopo: 14932,
      salto: 477,
      note: "Salto di tracciato",
    },

    { tipo: "stazione", nome: "Grumo Appula", km: 19035 },
    { tipo: "stazione", nome: "Sannicandro di Bari", km: 26176 },

    {
      tipo: "salto_progressiva",
      nome: "Acquaviva delle Fonti",
      kmPrima: 37399,
      kmDopo: 40309,
      salto: 2910,
      note: "Salto di tracciato",
    },

    { tipo: "stazione", nome: "Gioia del Colle", km: 53000 },
    { tipo: "posto_movimento", nome: "PM Grottalupara", km: 64599 },
    { tipo: "stazione", nome: "Palagianello", km: 78725 },

    {
      tipo: "salto_progressiva",
      nome: "Palagiano - Mottola",
      kmPrima: 85693,
      kmDopo: 92923,
      salto: 7230,
      note: "Salto di tracciato",
    },

    { tipo: "stazione", nome: "Massafra", km: 97090 },
    { tipo: "stazione", nome: "Bellavista", km: 106487 },
    { tipo: "bivio", nome: "Bivio Metaponto", km: 110613 },
    { tipo: "stazione", nome: "Taranto", km: 114529, note: "Fine tratta" },
  ],

  saltiSecondari: [
    {
      nome: "Deviatoio estremo di Bari",
      daKm: 646,
      aKm: 530,
      salto: -116,
      note: "Salto secondario",
    },
    {
      nome: "GR Scambi Parco Nord",
      daKm: 1623,
      aKm: 2549,
      salto: 926,
      note: "Salto secondario",
    },
  ],

  gallerie: [
    {
      nome: "Madonna della Grotta",
      inizioKm: 5281,
      fineKm: 6402,
      lunghezza: 1121,
    },
    {
      nome: "Santa Croce",
      inizioKm: 60043,
      fineKm: 63467,
      lunghezza: 3424,
    },
    {
      nome: "Madonna del Carmine",
      inizioKm: 67237,
      fineKm: 71273,
      lunghezza: 4036,
    },
    {
      nome: "San Francesco",
      inizioKm: 72061,
      fineKm: 73129,
      lunghezza: 1068,
    },
  ],
};

export function metriToProgressiva(metri) {
  if (!Number.isFinite(metri)) return "--";

  const km = Math.floor(metri / 1000);
  const m = Math.round(metri % 1000);

  return `${km}+${String(m).padStart(3, "0")}`;
}

export function progressivaToMetri(progressiva) {
  if (typeof progressiva === "number") return progressiva;

  const testo = String(progressiva).trim();
  const match = testo.match(/^(\d+)\+(\d{1,3})$/);

  if (!match) {
    throw new Error(`Progressiva non valida: ${progressiva}`);
  }

  const km = Number(match[1]);
  const metri = Number(match[2]);

  return km * 1000 + metri;
}

export function trovaRiferimentoPiuVicino(kmMetri) {
  const riferimentiConKm = LINEA_BARI_TARANTO.riferimenti
    .flatMap((r) => {
      if (r.tipo === "salto_progressiva") {
        return [
          {
            tipo: r.tipo,
            nome: `${r.nome} - prima salto`,
            km: r.kmPrima,
            originale: r,
          },
          {
            tipo: r.tipo,
            nome: `${r.nome} - dopo salto`,
            km: r.kmDopo,
            originale: r,
          },
        ];
      }

      return [
        {
          tipo: r.tipo,
          nome: r.nome,
          km: r.km,
          originale: r,
        },
      ];
    })
    .filter((r) => Number.isFinite(r.km));

  let migliore = null;

  for (const r of riferimentiConKm) {
    const distanza = Math.abs(kmMetri - r.km);

    if (!migliore || distanza < migliore.distanza) {
      migliore = {
        ...r,
        distanza,
      };
    }
  }

  return migliore;
}

export function trovaGalleria(kmMetri) {
  return (
    LINEA_BARI_TARANTO.gallerie.find(
      (g) => kmMetri >= g.inizioKm && kmMetri <= g.fineKm
    ) || null
  );
}

export function trovaSaltoVicino(kmMetri, tolleranzaMetri = 300) {
  const salti = [
    ...LINEA_BARI_TARANTO.riferimenti.filter(
      (r) => r.tipo === "salto_progressiva"
    ),
    ...LINEA_BARI_TARANTO.saltiSecondari.map((s) => ({
      tipo: "salto_progressiva_secondario",
      nome: s.nome,
      kmPrima: s.daKm,
      kmDopo: s.aKm,
      salto: s.salto,
      note: s.note,
    })),
  ];

  return (
    salti.find((s) => {
      const distanzaPrima = Math.abs(kmMetri - s.kmPrima);
      const distanzaDopo = Math.abs(kmMetri - s.kmDopo);

      return distanzaPrima <= tolleranzaMetri || distanzaDopo <= tolleranzaMetri;
    }) || null
  );
}

export function descriviProgressiva(kmMetri) {
  const riferimento = trovaRiferimentoPiuVicino(kmMetri);
  const galleria = trovaGalleria(kmMetri);
  const salto = trovaSaltoVicino(kmMetri);

  return {
    progressiva: metriToProgressiva(kmMetri),
    metri: kmMetri,

    riferimentoPiuVicino: riferimento
      ? {
          nome: riferimento.nome,
          tipo: riferimento.tipo,
          km: riferimento.km,
          progressiva: metriToProgressiva(riferimento.km),
          distanza: riferimento.distanza,
        }
      : null,

    galleria: galleria
      ? {
          nome: galleria.nome,
          inizio: metriToProgressiva(galleria.inizioKm),
          fine: metriToProgressiva(galleria.fineKm),
          lunghezza: galleria.lunghezza,
        }
      : null,

    saltoVicino: salto
      ? {
          nome: salto.nome,
          prima: metriToProgressiva(salto.kmPrima),
          dopo: metriToProgressiva(salto.kmDopo),
          salto: salto.salto,
          note: salto.note,
        }
      : null,
  };
}