// Generato da scripts/genera_tratte.py. Non modificare manualmente.
const NOME = "Foggia - Lecce";
const DIREZIONE_ANDATA = "foggia_lecce";
const DIREZIONE_RITORNO = "lecce_foggia";
const MASTER_LENGTH = 271773.53;
const MIN_PROGRESSIVA = 526027;
const MAX_PROGRESSIVA = 797903;
const RIFERIMENTI = [{"nome":"Foggia","tipo":"stazione","progressiva":526027,"lat":41.465938236,"lon":15.555910916},{"nome":"Incoronata","tipo":"stazione","progressiva":536309,"lat":41.408144105,"lon":15.650737313},{"nome":"Ortanova","tipo":"stazione","progressiva":545661,"lat":41.350393605,"lon":15.732136955},{"nome":"Cerignola","tipo":"stazione","progressiva":560292,"lat":41.315686743,"lon":15.897284827},{"nome":"Trinitapoli","tipo":"stazione","progressiva":577692,"lat":41.349656674,"lon":16.090838183},{"nome":"Barletta","tipo":"stazione","progressiva":593919,"lat":41.315216811,"lon":16.278515918},{"nome":"Trani","tipo":"stazione","progressiva":606513,"lat":41.272707028,"lon":16.417641093},{"nome":"Bisceglie","tipo":"stazione","progressiva":614534,"lat":41.235425289,"lon":16.49949121},{"nome":"Molfetta","tipo":"stazione","progressiva":623875,"lat":41.196000796,"lon":16.596860669},{"nome":"Giovinazzo","tipo":"stazione","progressiva":630190,"lat":41.180968135,"lon":16.669181224},{"nome":"Bari S. Spirito","tipo":"stazione","progressiva":637074,"lat":41.159666021,"lon":16.746312034},{"nome":"Bari Palese","tipo":"stazione","progressiva":639055,"lat":41.151448392,"lon":16.767342512},{"nome":"Bari Zona Industriale","tipo":"stazione","progressiva":644650,"lat":41.128075699,"lon":16.826513432},{"nome":"Bari Centrale","tipo":"stazione","progressiva":648594,"lat":41.117639625,"lon":16.869863224},{"nome":"Bari Parco Sud","tipo":"stazione","progressiva":651005,"lat":41.115122372,"lon":16.898051122},{"nome":"Bari Torre Quetta","tipo":"stazione","progressiva":652544,"lat":41.11155992,"lon":16.916092715},{"nome":"Bari Torre a Mare","tipo":"stazione","progressiva":660069,"lat":41.082983732,"lon":16.994679187},{"nome":"Mola di Bari","tipo":"stazione","progressiva":667771,"lat":41.057322697,"lon":17.080816917},{"nome":"Polignano a Mare","tipo":"stazione","progressiva":681575,"lat":40.990925084,"lon":17.218689991},{"nome":"Monopoli","tipo":"stazione","progressiva":689160,"lat":40.952027632,"lon":17.292537176},{"nome":"Fasano","tipo":"stazione","progressiva":702989,"lat":40.851687876,"lon":17.38592156},{"nome":"Cisternino","tipo":"stazione","progressiva":710146,"lat":40.816505644,"lon":17.457049181},{"nome":"Ostuni","tipo":"stazione","progressiva":722894,"lat":40.752363173,"lon":17.580835787},{"nome":"Carovigno","tipo":"stazione","progressiva":731875,"lat":40.737335892,"lon":17.683883764},{"nome":"San Vito","tipo":"stazione","progressiva":747836,"lat":40.649719443,"lon":17.819126459},{"nome":"Brindisi","tipo":"stazione","progressiva":759539,"lat":40.633646282,"lon":17.939265485},{"nome":"S. Pietro Vernotico","tipo":"stazione","progressiva":776562,"lat":40.489040248,"lon":18.00067757},{"nome":"Squinzano","tipo":"stazione","progressiva":783303,"lat":40.43926407,"lon":18.046076172},{"nome":"Trepuzzi","tipo":"stazione","progressiva":787504,"lat":40.409639568,"lon":18.076901063},{"nome":"Surbo","tipo":"stazione","progressiva":794332,"lat":40.36931412,"lon":18.129962638},{"nome":"Lecce","tipo":"stazione","progressiva":797903,"lat":40.345563714,"lon":18.16571434}];
const ANCORAGGI = [{"dMaster":0.0,"progressiva":526027},{"dMaster":10255.9,"progressiva":536309},{"dMaster":19607.81,"progressiva":545661},{"dMaster":34192.96,"progressiva":560292},{"dMaster":51583.95,"progressiva":577692},{"dMaster":67816.31,"progressiva":593919},{"dMaster":80391.15,"progressiva":606513},{"dMaster":88404.03,"progressiva":614534},{"dMaster":97745.03,"progressiva":623875},{"dMaster":104028.65,"progressiva":630190},{"dMaster":110916.82,"progressiva":637074},{"dMaster":112900.54,"progressiva":639055},{"dMaster":118496.21,"progressiva":644650},{"dMaster":122434.24,"progressiva":648594},{"dMaster":124845.94,"progressiva":651005},{"dMaster":126408.5,"progressiva":652544},{"dMaster":133797.93,"progressiva":660069},{"dMaster":141573.04,"progressiva":667771},{"dMaster":155376.84,"progressiva":681575},{"dMaster":162959.96,"progressiva":689160},{"dMaster":176804.41,"progressiva":702989},{"dMaster":183968.87,"progressiva":710146},{"dMaster":196695.33,"progressiva":722894},{"dMaster":205662.31,"progressiva":731875},{"dMaster":221713.2,"progressiva":747836},{"dMaster":233391.76,"progressiva":759539},{"dMaster":250378.08,"progressiva":776562},{"dMaster":257168.5,"progressiva":783303},{"dMaster":261371.21,"progressiva":787504},{"dMaster":268203.88,"progressiva":794332},{"dMaster":271762.85,"progressiva":797903}];

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
  return formatKm(metri);
}

export function getCalibrazioneLinea() {
  return {
    nome: NOME,
    direzione: DIREZIONE_ANDATA,
    stato: "Disponibile",
    salti: [],
    gallerie: [],
    ancoraggi: ANCORAGGI,
    totaleSalti: 0,
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
