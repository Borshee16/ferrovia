export const MEZZI_DATA = [
  {
    id: "etr-104-pop",
    nome: "ETR 104 POP",
    sigla: "POP",
    descrizione: "Tabelle tecniche e procedure di avaria",
    tabelle: [
      {
        id: "pop-freno",
        titolo: "Tabella %MF Isolamento Freno",
        intestazioni: ["N° CARRELLI", "SINGOLO POP", "DOPPIO POP"],
        righe: [
          ["0", "135%", "135%"],
          ["1", "105%", "120%"],
          ["2", "75%", "105%"],
          ["3", "50%", "90%"],
          ["4", "0%", "75%"],
          ["5", "0%", "60%"],
          ["6", "0%", "0%"],
        ],
      },
      {
        id: "pop-motori",
        titolo: "Tabella N° Motori Esclusi",
        intestazioni: ["N° MOTORI", "0", "1", "2", "3", "4", "5", "6"],
        righe: [
          ["SINGOLO", "31", "30", "22", "10", "0", "0", "0"],
          ["DOPPIO", "31", "31", "30", "27", "22", "17", "10"],
        ],
      },
    ],
    avarie: [
      {
        id: "pop-antincendio",
        titolo: "Avaria antincendio",
        paragrafi: [
          "Messa in servizio: Il convoglio non potrà più essere utilizzato per servizio commerciale",
          "Durante la marcia: Può proseguire non oltre il termine della giornata di turno, se nella zona AT escludere la zona interessata, se comparto viaggiatori verificare che non ci siano principi d’incendio o incendi.",
        ],
      },
      {
        id: "pop-riduttori",
        titolo: "Avaria riduttori",
        paragrafi: [
          "Prima soglia 125 °C : escludere motore interessato",
          "Seconda soglia 150 °C : verificare se le condizioni lo permettono, escludere il motore e proseguire a max 60 km/h per 300 km.",
        ],
      },
      {
        id: "pop-sospensioni",
        titolo: "Avaria sospensioni",
        paragrafi: [
          "In caso di avaria sospensioni si limita il mezzo a 140 km/h e rango A, ricalcolare %MF prendendo come valore MASSA FRENATA A VUOTO (pag 9 DPC)",
        ],
      },
      {
        id: "pop-traino",
        titolo: "Traino inattivo",
        paragrafi: [
          "Utilizzare pag 9 delle DPC per trovare valore MF a convoglio inattivo",
          "Disattivare SIFA nelle due cabine",
          "Isola e sblocca FAM",
          "Isola EP su tutti i carrelli",
        ],
      },
    ],
  },
  {
    id: "etr-jazz",
    nome: "ETR 324/425/526 JAZZ",
    sigla: "JAZZ",
    descrizione: "Tabelle tecniche e procedure di avaria",
    tabelle: [
      {
        id: "jazz-motori",
        titolo: "Tabella N° Motori Esclusi",
        intestazioni: ["N° MOTORI", "0", "1", "2", "3", "4", "5", "6"],
        righe: [
          ["SINGOLO", "31", "31", "30", "16", "0", "0", "0"],
          ["DOPPIO", "31", "31", "31", "31", "30", "25", "16"],
        ],
      },
      {
        id: "jazz-freno",
        titolo: "Tabella %MF Isolamento Freno",
        intestazioni: ["N° CARRELLI", "SINGOLO JAZZ", "DOPPIO JAZZ"],
        righe: [
          ["0", "140%", "140%"],
          ["1", "110%", "125%"],
          ["2", "85%", "110%"],
          ["3", "55%", "100%"],
          ["4", "0%", "85%"],
          ["5", "0%", "70%"],
          ["6", "0%", "55%"],
        ],
      },
    ],
    avarie: [
      {
        id: "jazz-rca",
        titolo: "Guasto RCA",
        paragrafi: [
          "Nel caso di dovesse guastare RCA, proseguire fino a termine corsa e poi dovrà essere inviato inattivo in impianto di manutenzione",
        ],
      },
      {
        id: "jazz-antincendio",
        titolo: "Avaria antincendio",
        paragrafi: [
          "Messa in servizio: veicolo inutilizzabile",
          "Durante il servizio: proseguire fino a termine giornata di turno, se interessa zona AT escludere quella zona.",
        ],
      },
      {
        id: "jazz-sospensioni",
        titolo: "Avaria sospensioni",
        paragrafi: [
          "Nel caso di avaria sospensioni materiale limitato a 60 km/h.",
        ],
      },
      {
        id: "jazz-riduttori",
        titolo: "Avaria riduttori",
        paragrafi: [
          "Messa in servizio : veicolo inutilizzabile",
          "In marcia: Escludere il motore interessato, se le condizioni lo permettono non superare 60 km/h per 300 km",
        ],
      },
      {
        id: "jazz-traino",
        titolo: "Traino inattivo/Soccorso",
        paragrafi: [
          "Isolare e sbloccare tutti i FAM",
          "Mezzo soccoritore escludere FE",
          "Non usare freno diretto",
        ],
      },
    ],
  },
  {
    id: "swing",
    nome: "SWING",
    sigla: "SWING",
    descrizione: "Tabella tecnica e procedure di avaria",
    tabelle: [
      {
        id: "swing-motori",
        titolo: "Tabella N° Motori Esclusi",
        intestazioni: ["N° MOTORI", "0", "1", "2", "3"],
        righe: [
          ["SINGOLO", "31", "25", "0", "0"],
          ["DOPPIO", "31", "29", "25", "9"],
        ],
      },
    ],
    avarie: [
      {
        id: "swing-fam",
        titolo: "Isolare FAM",
        paragrafi: [
          "Chiudere rubinetto PN+EP",
          "Verificare finestrella bianco crociato",
          "Esternamente tirare meccanicamente FAM",
          "Ricalcolo %MF senza carrello",
        ],
      },
      {
        id: "swing-antincendio",
        titolo: "Avaria antincendio",
        paragrafi: [
          "Messa in servizio: veicolo inutilizzabile.",
          "Durante il servizio: proseguire fino a termine giornata di turno.",
        ],
      },
      {
        id: "swing-sospensioni",
        titolo: "Avaria sospensioni",
        paragrafi: [
          "Nel caso di avaria sospensioni materiale limitato a 50 km/h.",
        ],
      },
      {
        id: "swing-boccole",
        titolo: "Impianto boccole calde",
        paragrafi: [
          "Limitare velocità a 40 km/h per massimo 300 km",
        ],
      },
      {
        id: "swing-abilitazione-materiale",
        titolo: "Abilitazione Materiale",
        paragrafi: [
          "Inserire batterie esternamente e sbloccare porta",
          "Abilitare Banco",
          "Accendere motori",
          "Aspettare CP a regime",
          "Aprire rubinetto CP nel package",
          "Inserire SSB",
          "Controllare pagina STATO-MOTORE i livelli (bianco = regolare, H = alto, L = basso, crociato = sotto il minimo)",
          "Prova Freno",
        ],
      },
      {
        id: "swing-cambio-banco",
        titolo: "Cambio Banco",
        paragrafi: [
          "LINV al centro",
          "Disabilitare BM",
          "Prendere chiavi e libri",
          "Leve a zero",
          "Chiudere rubinetto CP e togli SSB",
          "Abiliti altro lato",
          "Apri rubinetto CP e inserisci SSB",
        ],
      },
      {
        id: "swing-prova-freno",
        titolo: "Prova Freno ",
        paragrafi: [
          "FAM inserito",
          "Chiudere CG e CP in ordine",
          "Selettore PF su 1",
          "Prova di tenuta",
          "Aprire CP e CG",
          "Alimentare a 5 Bar e sfrenare i CF",
          "Frenare con il continuo CF > 1.5 bar",
          "Controllo finestrelle o monitor",
          "Prova WSP da monitor",
          "Sfrenare e frenare con indiretto depressione di 1.2 bar",
          "Controllo finestrelle o monitor",
          "Sfrenare completamente",
          "Verifica finestrelle o monitor",
        ],
      },
      {
        id: "swing-prova-efficacia-fam",
        titolo: "Prova di efficacia FAM",
        paragrafi: [
          "Inserire FAM",
          "LINV avanti",
          "Togliere holding brake",
          "Togliere marcia automatica",
          "Creare sforzo di trazione non superiore a 2%",
          "Quando esce KN sbarrato la prova è finita",
        ],
      },
      {
        id: "swing-disabilitazione-completa",
        titolo: " Disabilitazione completa",
        paragrafi: [
          "Chiudere porte",
          "Inserire FAM e provarlo",
          "Leve al centro",
          "Chiudere CP",
          "Disinserire SSB",
          "Togliere patente",
          "Spegni motori",
          "Disabiliti banco",
          "Esci e stacchi le batterie da fuori",
        ],
      },
      {
        id: "swing-reset-wc",
        titolo: "Reset WC",
        paragrafi: [
          "Sta un selettore in cabina chiamato SB28/RESET WC",
        ],
      },
      {
        id: "swing-trazione-porte-aperte",
        titolo: "Selettore Trazione Porte Aperte",
        paragrafi: [
          "Se sta IPA acceso per qualsiasi motivo o altri motivi che non ti facciano trazione usare selettore SA16, il quarto da sinistra prima riga. Velocità max 50 km/h",
        ],
      },
      {
        id: "swing-reset-dis",
        titolo: "Reset DIS",
        paragrafi: [
          "Solo in cabina A pannello stotz sotto quello dei selettori n°FA97 / DIS",
        ],
      },
    ],
  },
];

