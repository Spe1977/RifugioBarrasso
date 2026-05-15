# Analisi sicurezza 2026-05-11

Analisi repository-wide eseguita con Codex Security sul codice del sito Rifugio Paolo Barrasso.

## Esito

- Nessun finding `critical`, `high` o `medium` validato.
- 1 finding `low` di hardening/availability.
- 1 nota di hardening su messaggi di errore Apps Script.
- `npm test`: 44 test passati.
- `npm audit`: 0 vulnerabilità.

## Finding low

### Lettura pubblica dediche senza cache/rate limit

File: `apps-script/dediche-handler.gs`

Il metodo `doGet` pubblico legge l'intero Google Sheet a ogni richiesta anonima per restituire le dediche approvate. Il codice non espone email o righe non approvate, ma richieste ripetute possono consumare quota Apps Script/Google Sheets e degradare la disponibilità del quaderno pubblico.

Mitigazioni consigliate:

- usare `CacheService` per memorizzare per pochi minuti il JSON delle dediche approvate;
- limitare il numero di righe approvate restituite, ad esempio le ultime 50;
- valutare un rate limit anche su `doGet` se il traffico aumenta;
- in alternativa, pubblicare le dediche approvate come artefatto statico quando gli aggiornamenti sono rari.

## Note hardening

- `apps-script/booking-handler.gs` restituisce il messaggio dell'eccezione in caso di errore inatteso. Preferire una risposta pubblica generica e logging privato.
- `public/_headers` consente script inline nella CSP. Non e' stata trovata una catena XSS raggiungibile, ma una CSP con nonce/hash o script bundle esterni sarebbe piu' restrittiva.
- Gli ID dei Google Sheet presenti negli script non sono credenziali. La protezione reale dipende dagli ACL dei fogli e dall'esecuzione controllata degli Apps Script.
- Gli override npm bloccano `tmp` a `0.2.5` e `yaml` a `2.9.0` per chiudere vulnerabilità transitivamente introdotte dal tooling di sviluppo.

## Copertura

Sono state controllate le superfici runtime:

- pagine e componenti Astro;
- form prenotazioni e dediche;
- rendering client delle dediche approvate;
- handler Google Apps Script;
- header Cloudflare Pages;
- configurazione pubblica `PUBLIC_*`;
- dipendenze production.

Classi chiuse come non applicabili o soppresse: XSS template, stored XSS dediche, formula injection su Sheets, SSRF, path traversal, code execution, deserializzazione insicura, auth/session bypass e tenant isolation.
