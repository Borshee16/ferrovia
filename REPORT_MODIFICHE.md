# Report modifiche

## Integrazione tratte

- Bari - Bitritto: 147 punti master, 11,912 km di tracciato.
- Foggia - Lecce: 812 punti master, 271,774 km di tracciato.
- Entrambe le tratte sono disponibili nelle due direzioni.
- Le progressive e le stazioni sono calibrate sul tracciato Google Earth.

## Progressive particolari

- Bari Parco Nord mantiene il cambio da `2+549` a `0+000`.
- Il salto segnalato `0+646 -> 0+530` e applicato alla visualizzazione tra Bari Parco Nord e Bari S. Rita.
- Per Foggia - Lecce viene mostrata la progressiva ufficiale da `526+027` a `797+903`.
- Per Taranto - Potenza la scheda verde mostra esclusivamente la progressiva, senza i suffissi `Taranto-Bivio`, `Bivio-Metaponto` e `Metaponto-Potenza`.

## Punti ricostruiti

Nel KMZ Bari - Bitritto non era presente un segnaposto per Bari Parco Nord. Nel KMZ Foggia - Lecce non era presente un segnaposto per Surbo. Entrambi sono stati ancorati al percorso usando la progressiva fornita; non sono stati spostati gli altri punti disegnati manualmente.

## PWA

- Manifest installabile.
- Icone PWA da 192 e 512 pixel.
- Service worker con supporto offline e aggiornamento della cache a ogni build.
- Percorso GitHub Pages calcolato automaticamente dal nome del repository.
- Workflow GitHub Actions pronto in `.github/workflows/deploy-pages.yml`.

## Verifiche

- Sintassi JavaScript/JSX analizzata su tutti i moduli.
- Testati gli estremi Bari Centrale, Bitritto, Foggia e Lecce.
- Verificati i cambi progressiva di Bari Parco Nord e Taranto - Potenza.
- La build Expo completa non e stata eseguita nel runtime di preparazione per un errore temporaneo di download dei pacchetti npm. Il workflow incluso esegue `npm ci` e `npm run build:web` su GitHub prima di pubblicare.
