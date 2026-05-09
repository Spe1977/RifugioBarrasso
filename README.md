# Rifugio Paolo Barrasso

Sito statico multipagina del Rifugio Paolo Barrasso, realizzato con Astro e Tailwind CSS.

## Struttura

- `src/pages`: pagine del sito.
- `src/components`: componenti condivisi, inclusi modulo prenotazioni, modulo dediche e embed privacy-friendly.
- `src/data`: contenuti e configurazione del rifugio.
- `public/assets`: logo e immagini pubbliche.
- `apps-script`: handler Google Apps Script per prenotazioni e dediche.
- `docs`: documentazione di deploy e rilascio.

## Funzionalità

- Pagine statiche: home, storia, galleria, escursioni e sci, prenotazioni, quaderno del rifugio, eventi, info e regole, privacy, 404.
- Galleria fotografica locale senza dipendenze esterne.
- Modulo prenotazioni con validazione lato client, dichiarazioni obbligatorie (incluso luogo di nascita e numero documento), rate limiting lato Apps Script e invio a Google Apps Script.
- Quaderno del rifugio con modulo dediche integrato, moderazione su Google Sheets e caricamento dinamico delle dediche approvate.
- Calendario disponibilità caricato solo dopo consenso dell'utente.
- Immagini hero e logo responsive con `<picture>`, varianti WebP/JPEG/PNG e `srcset` multi-dimensione (400/800/1600 px per le foto, 96/384 px per il logo).
- CSS critico inline nel build Astro (`inlineStylesheets: "always"`) per ridurre i round-trip di rete.
- Sitemap, robots.txt, header di sicurezza e cache ottimizzata per Cloudflare Pages.

## Comandi locali

```bash
npm install
npm run dev
npm run check
npm run lint
npm run test
npm run build
```

Per gli E2E locali:

```bash
npm run dev
npm run test:e2e
```

`npm run test:e2e:server` usa invece il webserver automatico di Playwright.

## Variabili d'ambiente

Copiare `.env.example` in `.env` e compilare i valori reali:

```bash
PUBLIC_BOOKING_ENDPOINT=
PUBLIC_GOOGLE_CALENDAR_EMBED_URL=
PUBLIC_DEDICHE_ENDPOINT=
```

Le variabili `PUBLIC_` sono visibili nel frontend: non inserirvi segreti.

## Deploy

Il target principale è Cloudflare Pages:

- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

Guida completa: [docs/cloudflare-pages.md](docs/cloudflare-pages.md).

Deploy manuale con Wrangler:

```bash
npm run deploy:cloudflare
```

Checklist di rilascio: [docs/release-checklist.md](docs/release-checklist.md).

## Note operative

- `dist`, `.env`, `node_modules`, report e screenshot generati sono esclusi dal repository.
- Dopo ogni modifica ad Apps Script, aggiornare il deployment Web App esistente. Aggiornare `PUBLIC_BOOKING_ENDPOINT` o `PUBLIC_DEDICHE_ENDPOINT` su Cloudflare Pages solo se cambia l'URL `/exec`.
- `sito.md`, `stile.html` e i documenti sorgente restano riferimenti di progetto.
