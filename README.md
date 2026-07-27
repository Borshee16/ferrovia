# DoveSono?

Applicazione Expo per visualizzare posizione, progressiva chilometrica e prossima localita sulle tratte ferroviarie configurate.

## Tratte disponibili

- Bari - Taranto
- Taranto - Brindisi
- Taranto - Potenza
- Bari - Bitritto
- Foggia - Lecce

## Avvio locale

```bash
npm ci
npm start
```

Per provare la versione web:

```bash
npm run web
```

## Build PWA

```bash
npm run build:web
```

Il sito pronto viene creato nella cartella `dist`.

## Pubblicazione GitHub Pages

1. Crea un repository GitHub e copia qui tutti i file.
2. Usa `main` come branch principale.
3. In GitHub apri `Settings > Pages`.
4. In `Build and deployment`, seleziona `GitHub Actions`.
5. Esegui il workflow `Pubblica PWA su GitHub Pages`, oppure fai un nuovo push su `main`.

Il workflow calcola automaticamente il percorso del repository, genera la PWA e la pubblica. Per installarla su Android, apri l'indirizzo Pages in Chrome e scegli `Aggiungi a schermata Home` o `Installa app`.

## Rigenerazione delle tratte

I file `master_bari_bitritto.js`, `calibrazione_bari_bitritto.js`, `master_foggia_lecce.js` e `calibrazione_foggia_lecce.js` sono generati dai KMZ:

```bash
python scripts/genera_tratte.py
```

Il file `progressive-tratte.txt` documenta le progressive fornite per le due linee.
