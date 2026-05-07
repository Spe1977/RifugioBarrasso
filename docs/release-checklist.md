# Checklist di rilascio

Usare questa checklist prima di pubblicare una nuova versione del sito.

## Contenuti

- Verificare testi, date, regolamenti e contributi nella pagina Prenotazioni.
- Verificare che la galleria usi solo immagini autorizzate.
- Verificare che il calendario mostri correttamente le disponibilità.
- Verificare che l'informativa privacy nel form sia coerente con la pagina Privacy.
- Verificare che le immagini hero e il logo abbiano tutte le varianti responsive
  (`/assets/brand/logo2-96|384.{png,webp}`, `/assets/brand/favicon-64.png`,
  `/assets/images/foto-leonardo-{2,9}-{400,800,1600}.{jpg,webp}`).

## Configurazione

- Aggiornare `.env` in locale con i valori reali.
- Aggiornare le variabili d'ambiente su Cloudflare Pages.
- Se cambia Google Apps Script, ridistribuire lo script e aggiornare `PUBLIC_BOOKING_ENDPOINT`.
- Non committare `.env`, `dist`, `node_modules`, screenshot o report generati.

## Validazione

```bash
npm run test
npm run build
```

Controlli opzionali:

```bash
npm run lint
npm run test:e2e:server
npm run test:lighthouse
```

## Deploy

- Push su `main` per attivare il deploy automatico Cloudflare Pages.
- In alternativa usare `npm run deploy:cloudflare`.
- Dopo il deploy, provare almeno:
  - home
  - galleria
  - prenotazioni
  - popup dichiarazioni e privacy
  - calendario
  - invio test del modulo, se appropriato
