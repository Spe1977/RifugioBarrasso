# Checklist di rilascio

Usare questa checklist prima di pubblicare una nuova versione del sito.

## Contenuti

- Verificare testi, date, regolamenti e contributi nella pagina Prenotazioni.
- Verificare che la galleria usi solo immagini autorizzate.
- Verificare che eventuali nuove immagini in galleria dichiarino dimensioni e orientamento corretti in `src/data/content.ts`.
- Verificare che il calendario mostri correttamente le disponibilità.
- Verificare nella home la CTA "Vivi l'esperienza" verso `/prenotazioni/`.
- Verificare nella pagina Info e Regole il percorso di accesso al rifugio, la CTA Google Maps, il riquadro "COSA TROVI ALL'INTERNO DEL BARRASSO": dotazioni del locale chiuso, dotazioni del locale aperto e link "PRENOTAZIONE" verso `/prenotazioni/`.
- Verificare che footer e pagina Info e Regole mostrino sia `rifugio.barrasso@gmail.com` sia `info@rifugiobarrasso.com` dove previsto.
- Verificare che il Quaderno carichi le dediche approvate e che l'invio di una dedica mostri il feedback corretto.
- Verificare che l'informativa privacy nel form sia coerente con la pagina Privacy.
- Verificare che le immagini hero e il logo abbiano tutte le varianti responsive
  (`/assets/brand/logo2-96|384.{png,webp}`, `/assets/brand/favicon-64.png`,
  `/assets/images/foto-leonardo-{2,9}-{400,800,1600}.{jpg,webp}`).

## Configurazione

- Aggiornare `.env` in locale con i valori reali.
- Aggiornare le variabili d'ambiente su Cloudflare Pages.
- Se cambia Google Apps Script, ridistribuire il deployment Web App esistente. Aggiornare `PUBLIC_BOOKING_ENDPOINT` o `PUBLIC_DEDICHE_ENDPOINT` solo se cambia l'URL `/exec`.
- Non committare `.env`, `dist`, `node_modules`, screenshot o report generati.

## Validazione

```bash
npm run test
npm run build
npm run test:e2e:server
npm audit
```

Controlli opzionali:

```bash
npm run lint
npm run test:lighthouse
```

Per modifiche al rate limiting Apps Script, verificare almeno che i test unitari
coprano normalizzazione email/telefono, limite per email, limite per telefono e
limite globale orario.
Per modifiche al sistema dediche, verificare anche validazione, consenso,
neutralizzazione formule e rate limiting email/globale.
Per modifiche alla lettura pubblica delle dediche, verificare eventuali cache,
limiti di righe o controlli anti-abuso su `doGet`.

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
  - quaderno del rifugio e invio dedica, se appropriato
