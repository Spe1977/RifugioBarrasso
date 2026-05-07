# Deploy su Cloudflare Pages

Questa guida descrive il deploy del sito statico Astro del Rifugio Paolo Barrasso su Cloudflare Pages.

## Configurazione consigliata

In Cloudflare Pages, collegare la repository GitHub e usare questi valori:

- Framework preset: `Astro`
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: vuota, perché il progetto è nella root della repository
- Node.js version: usare una versione LTS recente, compatibile con `package-lock.json`

Cloudflare Pages eseguirà automaticamente il build e pubblicherà una nuova versione a ogni push su `main`.

## Variabili d'ambiente

Impostare in Cloudflare Pages, sezione Settings > Environment variables:

```bash
PUBLIC_BOOKING_ENDPOINT=https://script.google.com/macros/s/AKfycbxCib48ZpIhhRXbUoQk6UEKd7f7UlZY_uSTGYbBckEZ9iDI6K1HI1kkhFVfZhcoTWzluQ/exec
PUBLIC_GOOGLE_CALENDAR_EMBED_URL=<url embed Google Calendar>
PUBLIC_TALLY_FORM_ID=<id modulo Tally>
```

Le variabili `PUBLIC_` sono incorporate nel frontend. Non inserire segreti in queste variabili.

## Deploy diretto con Wrangler

Per un deploy manuale senza collegamento GitHub:

```bash
npm install
npm run build
npx wrangler pages deploy dist --project-name rifugio-barrasso
```

Lo script equivalente è:

```bash
npm run deploy:cloudflare
```

## Ottimizzazioni già incluse

- Output statico Astro in `dist`.
- `wrangler.jsonc` con `pages_build_output_dir` per deploy diretto e configurazione Pages esplicita.
- Sitemap generata da `@astrojs/sitemap`.
- `robots.txt` con riferimento alla sitemap.
- `public/_headers` con header di sicurezza compatibili con Cloudflare Pages.
- Cache lunga e immutable per `/assets/*`.
- Cache breve per `robots.txt` e sitemap.
- Form prenotazioni inviato a Google Apps Script via `PUBLIC_BOOKING_ENDPOINT`.

## Verifica pre-pubblicazione

Prima del push o del deploy:

```bash
npm run test
npm run build
```

Per un controllo più ampio:

```bash
npm run lint
npm run test:e2e:server
```

## Note operative

- Dopo ogni nuovo deploy Apps Script, aggiornare `PUBLIC_BOOKING_ENDPOINT` in Cloudflare Pages e rilanciare il deploy del sito.
- Il file locale `.env` è escluso dal repository; usare `.env.example` come template.
- La cartella `dist` è un artefatto generato e non va committata.
