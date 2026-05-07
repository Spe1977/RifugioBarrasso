Fatto: commit e push completati su main.

Repository: https://github.com/Spe1977/RifugioBarrasso.git
Commit: a5e3546 (Prepare Rifugio Barrasso site for Cloudflare deploy)

Ho aggiunto/ottimizzato:

- documentazione principale in README.md
- guida Cloudflare in docs/cloudflare-pages.md
- checklist rilascio in docs/release-checklist.md
- wrangler.jsonc per Pages con output ./dist
- robots.txt
- header Cloudflare in public/\_headers con sicurezza + cache asset
- script preview:cloudflare e deploy:cloudflare
- .gitignore aggiornato per escludere .env, dist, node_modules, report e
  screenshot
- fix lint su test-h1.spec.ts

Verifiche passate:

- npm run build
- npm test
- npm run lint
- Prettier sui file modificati/supportati

Per Cloudflare Pages usa:

- Production branch: main
- Build command: npm run build
- Build output directory: dist

Da impostare su Cloudflare Pages come variabile ambiente:
PUBLIC_BOOKING_ENDPOINT = https://script.google.com/macros/s/AKfycbxCib48ZpIhhRXbUoQk6UEKd7f7UlZY_uSTGYbBckEZ9iDI6K1HI1kkhFVfZhcoTWzluQ/exec

Fonti Cloudflare usate: guida Astro Pages e configurazione build ufficiali:
https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
https://developers.cloudflare.com/pages/configuration/build-configuration/

## Raccomandazioni di sicurezza (audit 2026-05-07)

Nessuna vulnerabilità sfruttabile e nessun segreto trapelato. Punti aperti:

1. Aggiornare Astro a >= 6.1.6 (XSS in `define:vars`, GHSA-j687-52p2-xcff —
   attualmente 5.18.1, fix richiede `npm audit fix --force`, breaking).
2. Completare l'informativa privacy in `src/pages/privacy/index.astro`
   (oggi marcata come bozza) prima del go-live: titolare, base giuridica,
   tempi di conservazione, diritti GDPR artt. 15-22.
3. Aggiungere rate limiting in `apps-script/booking-handler.gs` (es. max N
   richieste per email/giorno leggendo le ultime righe del foglio).
4. (Opzionale) Rimuovere `'unsafe-inline'` dalla CSP in `public/_headers`
   rifattorizzando i `<script is:inline>` di CalendarEmbed/TallyEmbed.
5. Rebuild di `dist/` prima del deploy: l'endpoint Apps Script attuale in
   `.env` (`AKfycbxCib48...`) differisce da quello compilato in
   `dist/prenotazioni/index.html` (`AKfycbz3HbSR...`).
