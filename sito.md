# Documento Tecnico Definitivo

# Sito web ufficiale “Rifugio Paolo Barrasso”

**Versione:** 2.2  
**Data:** 6 maggio 2026  
**Obiettivo:** specifica tecnica definitiva per realizzare un sito statico, veloce, sicuro, robusto e facilmente modificabile, con codice generabile e mantenibile anche tramite LLM.

---

## 1. Sintesi decisionale

Il sito del **Rifugio Paolo Barrasso** deve essere realizzato come sito statico multipagina, pubblicato su **Cloudflare Pages**, con flussi esterni gratuiti per prenotazioni, calendario disponibilità e dediche.

La bozza HTML fornita è da considerare **riferimento grafico e cromatico**, non codice definitivo.  
Il documento tecnico precedente è una buona base, ma viene aggiornato in questa versione per migliorare:

- manutenibilità del codice;
- facilità di generazione tramite LLM;
- sicurezza;
- velocità;
- chiarezza dei flussi;
- separazione tra contenuti, grafica e logica.

### Scelta tecnica consigliata

| Area                           | Scelta definitiva                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| Hosting                        | Cloudflare Pages                                                                      |
| Deploy                         | GitHub + deploy automatico Cloudflare Pages                                           |
| Tipo sito                      | Static Site Generated, multipagina                                                    |
| Framework sorgente consigliato | Astro statico                                                                         |
| Output finale                  | HTML, CSS e JS statici                                                                |
| CSS                            | Tailwind compilato, non CDN                                                           |
| JavaScript                     | Vanilla JS minimo                                                                     |
| Prenotazioni                   | Form HTML custom + Google Apps Script + Google Sheets + email                         |
| Disponibilità                  | Google Calendar pubblico “solo disponibile/occupato”                                  |
| Dediche                        | Tally embed + moderazione manuale                                                     |
| Pubblicazione dediche          | Manuale, tramite file dati o blocco HTML/Markdown approvato                           |
| Lingue                         | Italiano principale, inglese in `/en/`                                                |
| Analytics                      | Nessuno, salvo scelta futura privacy-compliant                                        |
| Backend proprietario           | Non previsto                                                                          |
| Account tecnico                | Email tecnica dedicata per Google Apps Script, Google Sheets, Google Calendar e Tally |
| Email operativa rifugio        | `rifugio.barrasso@gmail.com` per ricevere e gestire notifiche                         |
| Testing                        | Prettier, ESLint, Astro Check, Vitest, Playwright, Lighthouse CI, checklist manuale   |

---

## 2. Obiettivi del sito

Il sito deve:

1. presentare il Rifugio Paolo Barrasso in modo autorevole, caldo e coerente con il luogo;
2. raccontare la storia del rifugio, del “casotto”, di Paolo Barrasso e della nuova gestione;
3. spiegare chiaramente regole, limiti e responsabilità degli utilizzatori;
4. permettere la richiesta di prenotazione del locale chiuso;
5. mostrare la disponibilità generale tramite calendario;
6. raccogliere dediche dei viandanti senza pubblicazione automatica;
7. offrire una base facilmente traducibile in inglese;
8. essere veloce anche con connessioni mobili deboli;
9. essere facile da modificare da un webmaster o da un LLM;
10. ridurre al minimo superfici di attacco, dipendenze esterne e costi.

---

## 3. Dati ufficiali da usare

### 3.1 Identità

- **Nome sito:** Rifugio Paolo Barrasso
- **Luogo:** Prato della Corte, pendici del Monte Rapina
- **Comune:** Caramanico Terme, provincia di Pescara
- **Area:** Parco Nazionale della Maiella
- **Quota:** 1.542 m s.l.m.
- **Gestione:** Associazione “Amici del Barrasso”
- **Dominio ufficiale previsto:** `www.rifugiobarrasso.com`
- **Email ufficiale operativa:** `rifugio.barrasso@gmail.com`
- **Email tecnica dedicata:** da creare/confermare, usata come proprietaria degli strumenti tecnici esterni

### 3.2 Dati storici essenziali

Da inserire nelle pagine “Storia” e “Info e Regole”:

- il rifugio fu costruito tra il 1935 e il 1940;
- nacque come stazzo pastorale su terreno comunale;
- era conosciuto come “il casotto”;
- rimase chiuso negli anni ’70 e ’80;
- nel 1992 fu ristrutturato e intitolato a Paolo Barrasso;
- Paolo Barrasso era biologo del Corpo Forestale dello Stato e morì sul Morrone nel 1991;
- fino al 2019 fu gestito dal CAI di Pescara come bivacco e Capanna Sociale;
- dal 2020 al 2024 rimase chiuso;
- nel settembre 2024 fu ristrutturato dal Comune;
- dal 21 febbraio 2025 la gestione è affidata all’Associazione “Amici del Barrasso” con concessione di 6 anni.

### 3.3 Account tecnico e email operative

Per separare la gestione tecnica dalla gestione quotidiana del rifugio, usare due livelli distinti di account/email.

| Funzione                    | Account/email consigliata                     | Scopo                                                                                                                                   |
| --------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Proprietà tecnica strumenti | Email tecnica dedicata                        | Creazione e gestione di Google Apps Script, Google Sheet prenotazioni, Google Calendar disponibilità e account Tally                    |
| Gestione operativa rifugio  | `rifugio.barrasso@gmail.com`                  | Ricezione e gestione delle notifiche di prenotazione, dediche e comunicazioni operative da parte dell’Associazione “Amici del Barrasso” |
| Webmaster                   | Email personale o professionale del webmaster | Accesso come editor/amministratore tecnico, non come unico proprietario dei dati                                                        |

La mail tecnica deve essere preferibilmente un account dedicato al progetto, non una casella personale privata. Può essere gestita dal webmaster, ma deve restare trasferibile all’Associazione in caso di cambio gestione tecnica.

Tutte le notifiche utili all’operatività devono arrivare a `rifugio.barrasso@gmail.com`, così l’Associazione “Amici del Barrasso” può gestire richieste e dediche senza accedere necessariamente agli account tecnici.

---

## 4. Principi tecnici

### 4.1 Statico prima di tutto

Il sito deve essere servito come file statici: HTML, CSS, JS, immagini e asset.  
Non devono essere presenti database proprietari, login amministrativi, CMS complessi o backend PHP.

Motivazioni:

- sicurezza più alta;
- manutenzione ridotta;
- costo hosting quasi nullo;
- performance elevate;
- facilità di backup;
- meno problemi in caso di aggiornamenti futuri.

### 4.2 Nessuna Single Page App

La bozza usa sezioni mostrate/nascoste via JavaScript.  
La versione definitiva deve invece essere **multipagina reale**.

Motivazioni:

- SEO migliore;
- URL leggibili e condivisibili;
- maggiore accessibilità;
- minore dipendenza da JavaScript;
- struttura più chiara per LLM e webmaster.

### 4.3 Codice generabile da LLM

Il progetto deve essere organizzato in modo che un LLM possa intervenire senza rompere il sito:

- componenti riutilizzabili;
- file piccoli;
- nomi espliciti;
- dati separati dal markup;
- configurazioni centralizzate;
- niente logiche nascoste in file enormi;
- README operativo;
- checklist di test.

---

## 5. Scelta framework: Astro statico

### 5.1 Perché Astro

Astro è consigliato perché permette di sviluppare con componenti riutilizzabili e generare alla fine un sito statico. È più ordinato di una cartella di HTML duplicati, ma resta molto più semplice di React, Next.js o un CMS.

Vantaggi:

- genera HTML statico;
- non spedisce JavaScript al browser se non necessario;
- è adatto a siti editoriali e multipagina;
- consente Layout, Header, Footer e componenti riutilizzabili;
- consente contenuti in Markdown o file dati;
- è gestibile bene da LLM;
- si pubblica facilmente su Cloudflare Pages.

### 5.2 Alternative considerate

| Opzione               | Valutazione                                                          |
| --------------------- | -------------------------------------------------------------------- |
| HTML puro multipagina | Molto semplice, ma rischio duplicazione e manutenzione più difficile |
| Astro statico         | Scelta consigliata: buon equilibrio tra ordine e semplicità          |
| React/Vite SPA        | Sconsigliato: troppo JavaScript e SEO meno lineare                   |
| Next.js               | Sovradimensionato per questo progetto                                |
| WordPress             | Sconsigliato: più manutenzione, più superficie d’attacco             |
| CMS headless          | Non necessario nella fase iniziale                                   |

---

## 6. Struttura URL definitiva

### 6.1 Italiano

| Pagina               | URL                      | Scopo                                        |
| -------------------- | ------------------------ | -------------------------------------------- |
| Home                 | `/`                      | Presentazione emozionale e accessi rapidi    |
| Storia               | `/storia/`               | Storia del casotto e di Paolo Barrasso       |
| Galleria             | `/galleria/`             | Foto del rifugio e della Majella             |
| Prenotazioni         | `/prenotazioni/`         | Regole, calendario e richiesta locale chiuso |
| Quaderno del Rifugio | `/quaderno-del-rifugio/` | Dediche e form Tally                         |
| Eventi               | `/eventi/`               | Ciaspolate, escursioni, aperture speciali    |
| Info e Regole        | `/info-e-regole/`        | Regole complete, sicurezza, contatti         |
| Privacy              | `/privacy/`              | Informativa dati personali                   |
| Grazie prenotazione  | `/grazie-prenotazione/`  | Messaggio post-invio, se usato               |
| 404                  | `/404.html`              | Pagina errore personalizzata                 |

### 6.2 Inglese

| Pagina         | URL                   |
| -------------- | --------------------- |
| Home EN        | `/en/`                |
| History        | `/en/history/`        |
| Gallery        | `/en/gallery/`        |
| Booking        | `/en/booking/`        |
| Guestbook      | `/en/guestbook/`      |
| Events         | `/en/events/`         |
| Info and Rules | `/en/info-and-rules/` |
| Privacy        | `/en/privacy/`        |

---

## 7. Alberatura progetto consigliata

```txt
rifugio-barrasso/
  package.json
  astro.config.mjs
  tailwind.config.mjs
  tsconfig.json
  README.md
  public/
    favicon.ico
    robots.txt
    _headers
    _redirects
    assets/
      images/
      logo/
      icons/
  src/
    layouts/
      BaseLayout.astro
    components/
      Header.astro
      Footer.astro
      Hero.astro
      PageHeader.astro
      InfoCard.astro
      RuleCard.astro
      BookingForm.astro
      CalendarEmbed.astro
      TallyEmbed.astro
      PostIt.astro
      EventStatus.astro
      LanguageSwitcher.astro
    data/
      site.ts
      navigation.ts
      booking.ts
      events.ts
      dediche.ts
      gallery.ts
      rules.ts
    pages/
      index.astro
      storia.astro
      galleria.astro
      prenotazioni.astro
      quaderno-del-rifugio.astro
      eventi.astro
      info-e-regole.astro
      privacy.astro
      404.astro
      en/
        index.astro
        history.astro
        gallery.astro
        booking.astro
        guestbook.astro
        events.astro
        info-and-rules.astro
        privacy.astro
    styles/
      global.css
      tailwind.css
    scripts/
      booking-form.js
      mobile-menu.js
      embeds.js
  apps-script/
    booking-handler.gs
    README.md
```

---

## 8. Palette grafica definitiva

La palette deriva dalla bozza grafica.

| Nome           |       Hex | Uso                                            |
| -------------- | --------: | ---------------------------------------------- |
| Verde Majella  | `#1b3b22` | Header, footer, titoli, elementi istituzionali |
| Verde chiaro   | `#edf2ee` | Box informativi, sfondi leggeri                |
| Rosso Barrasso | `#b81d1d` | CTA, avvisi, dettagli forti, infissi           |
| Pietra         | `#f4f3f0` | Sfondo principale                              |
| Pietra scura   | `#3a3836` | Testi principali                               |
| Legno          | `#c29a6b` | Accenti secondari                              |
| Bianco         | `#ffffff` | Card e contenitori                             |
| Grigio testo   | `#4b5563` | Testi secondari                                |

### 8.1 Uso cromatico

- Il verde deve dominare l’identità.
- Il rosso deve essere usato solo per CTA, alert, bordi, dettagli e richiami importanti.
- Lo sfondo pietra deve evitare il bianco eccessivo.
- Il legno deve comparire in footer, separatori, dettagli caldi.
- Evitare colori aggiuntivi non necessari.

---

## 9. Tipografia

La bozza usa:

- Inter;
- Montserrat;
- Caveat.

Per la produzione sono possibili due strade.

### 9.1 Scelta consigliata: font self-hosted o system stack

Per ridurre dipendenze esterne e migliorare privacy/performance:

```css
--font-sans:
  Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", sans-serif;
--font-display: Montserrat, ui-sans-serif, system-ui, sans-serif;
--font-handwriting: Caveat, "Comic Sans MS", cursive;
```

Se non si vogliono gestire file font, usare system stack e mantenere Montserrat/Caveat come fallback opzionali.

### 9.2 Evitare

Evitare il caricamento runtime di Google Fonts nella versione definitiva se l’obiettivo è massima semplicità privacy/performance. Se si decide di usare Google Fonts, dichiararlo nella privacy policy.

---

## 10. Icone e asset esterni

La bozza usa Font Awesome via CDN.  
Nella versione definitiva è preferibile:

- usare SVG inline;
- usare una piccola cartella `public/assets/icons/`;
- evitare CDN per icone;
- non caricare librerie intere per poche icone.

Vantaggi:

- più veloce;
- più sicuro;
- meno richieste esterne;
- CSP più semplice;
- nessuna dipendenza da CDN.

---

## 11. Immagini

### 11.1 Requisiti

Tutte le immagini devono essere locali, ottimizzate e con `alt` descrittivo.

Formati consigliati:

- AVIF per immagini principali, se possibile;
- WebP come fallback;
- JPG ottimizzato solo se necessario.

### 11.2 Dimensioni indicative

| Uso               | Dimensione consigliata |
| ----------------- | ---------------------- |
| Hero desktop      | 1920 px larghezza      |
| Hero mobile       | 900 px larghezza       |
| Gallery thumbnail | 800-1200 px            |
| Logo              | SVG preferibile        |
| Open Graph image  | 1200x630 px            |

### 11.3 Performance

- usare `loading="lazy"` per immagini non above-the-fold;
- usare `width` e `height`;
- evitare immagini > 500 KB salvo hero;
- usare `srcset` dove utile;
- non usare immagini da URL esterni.

---

## 12. CSS e Tailwind

### 12.1 Decisione

Usare **Tailwind compilato** tramite build, non `https://cdn.tailwindcss.com`.

Motivazioni:

- il CDN Tailwind è comodo per prototipi, non ideale per produzione;
- il CSS compilato contiene solo le classi usate;
- migliora performance;
- riduce dipendenze runtime;
- permette CSP più stretta.

### 12.2 File CSS

- `src/styles/global.css`: variabili, base, piccoli componenti custom;
- Tailwind per utility e layout;
- evitare CSS sparso nei componenti salvo casi minimi.

### 12.3 Classi e componenti

Usare componenti Astro per evitare duplicazioni:

- `InfoCard`;
- `RuleCard`;
- `PostIt`;
- `PageHeader`;
- `BookingForm`;
- `CalendarEmbed`.

---

## 13. JavaScript

### 13.1 Principio

Il sito deve funzionare quasi tutto senza JavaScript.  
JavaScript serve solo per:

- menu mobile;
- invio form prenotazione;
- caricamento opzionale iframe esterni;
- piccoli stati UI;
- eventuale validazione client.

### 13.2 Evitare

- React;
- router client-side;
- animazioni pesanti;
- librerie slider;
- dipendenze non indispensabili;
- gestione stato complessa.

### 13.3 Animazioni

Ammesse solo micro-animazioni CSS leggere:

- hover card;
- fade-in semplice;
- transizioni bottoni.

Rispettare `prefers-reduced-motion`.

---

## 14. Prenotazioni

### 14.1 Decisione definitiva

Le prenotazioni usano:

1. modulo HTML custom nella pagina `/prenotazioni/`;
2. script JS leggero per invio e feedback;
3. Google Apps Script come endpoint;
4. Google Sheets come registro;
5. proprietà tecnica su email tecnica dedicata;
6. email automatica a `rifugio.barrasso@gmail.com`;
7. eventuale email in copia al webmaster o alla mail tecnica;
8. conferma manuale da parte del gestore.

La richiesta inviata dal sito **non equivale a prenotazione confermata**.

### 14.2 Stato prenotazione

Ogni richiesta deve avere uno stato:

- `nuova`;
- `in valutazione`;
- `confermata`;
- `rifiutata`;
- `annullata`.

Lo stato può essere gestito nel Google Sheet.

### 14.3 Campi modulo

Campi obbligatori:

- nome e cognome referente;
- email;
- telefono/WhatsApp;
- numero persone;
- data arrivo;
- numero notti;
- accettazione regole;
- accettazione privacy;
- consenso a essere ricontattati.

Campi facoltativi:

- tipologia gruppo;
- sezione/associazione di appartenenza;
- note;
- provenienza;
- esperienza in montagna;
- richiesta speciale.

Campi tecnici nascosti:

- `tipo_richiesta = pernottamento`;
- `lingua = it` o `en`;
- `form_version`;
- `page_url`;
- `submitted_at_client`;
- `honeypot`.

### 14.4 Limiti

Valori consigliati:

```ts
export const bookingConfig = {
  maxPersone: 4,
  maxNotti: 2,
  contributoGiornalieroPersona: 10,
  ritiroChiavi:
    "Gelateria Caffetteria del Corso, Caramanico Terme, entro le ore 20:00",
};
```

**Nota da confermare:** il documento tecnico precedente indica massimo 4 persone, mentre la bozza grafica conteneva `max=8`. La specifica definitiva imposta 4 come valore prudenziale e centralizzato, ma va confermato dai gestori.

### 14.5 Validazione

La validazione deve essere doppia:

1. client-side, per aiutare l’utente;
2. server-side in Apps Script, per sicurezza.

Validazioni minime:

- email valida;
- telefono non vuoto;
- persone tra 1 e `maxPersone`;
- notti 1 o 2;
- data arrivo non nel passato;
- checkbox regole obbligatoria;
- checkbox privacy obbligatoria;
- honeypot vuoto.

### 14.6 Invio tecnico

Per semplicità e robustezza, usare un invio compatibile con Google Apps Script.

Opzioni:

#### Opzione A - fetch con richiesta semplice

- `POST`;
- payload `FormData` o `application/x-www-form-urlencoded`;
- evitare header custom;
- evitare preflight CORS.

Se la lettura della risposta è bloccata da CORS, mostrare un messaggio “Richiesta inviata” solo dopo aver gestito correttamente il comportamento in test.

#### Opzione B - form POST verso iframe nascosto

Soluzione più compatibile con siti statici:

- form HTML standard;
- `target` verso iframe nascosto;
- Apps Script riceve il POST;
- il sito resta sulla pagina;
- feedback gestito lato client.

È meno elegante, ma molto robusta.

### 14.7 Google Apps Script

Lo script deve:

1. ricevere `doPost(e)`;
2. validare i campi;
3. generare un `booking_id`;
4. salvare la richiesta nel foglio;
5. inviare email al rifugio;
6. inviare email di ricevuta all’utente;
7. restituire output testuale/JSON minimale;
8. usare `LockService` per evitare scritture concorrenti;
9. non esporre dati personali al pubblico.

### 14.8 Google Sheet

Colonne consigliate:

```txt
booking_id
timestamp_server
lingua
tipo_richiesta
stato
nome
email
telefono
persone
data_arrivo
notti
data_partenza
tipologia_gruppo
note
accettazione_regole
accettazione_privacy
page_url
user_agent
form_version
email_notifica_inviata
email_utente_inviata
note_gestore
```

### 14.9 Email al rifugio

Oggetto:

```txt
Nuova richiesta prenotazione Rifugio Barrasso - [data arrivo] - [nome]
```

Corpo:

```txt
È arrivata una nuova richiesta di prenotazione.

ID richiesta: ...
Nome: ...
Email: ...
Telefono: ...
Data arrivo: ...
Notti: ...
Persone: ...
Tipologia gruppo: ...
Note: ...

Attenzione: questa richiesta NON è ancora confermata.
Verificare disponibilità e aggiornare manualmente Google Calendar se accettata.
```

### 14.10 Email all’utente

Oggetto:

```txt
Richiesta ricevuta - Rifugio Paolo Barrasso
```

Corpo:

```txt
Grazie, abbiamo ricevuto la tua richiesta.

La prenotazione non è ancora confermata.
Riceverai una risposta dal gestore dopo la verifica della disponibilità.

Ricorda:
- il locale bivacco resta sempre aperto e non è prenotabile in esclusiva;
- il locale chiuso è utilizzabile solo dopo conferma;
- il contributo è di 10 euro al giorno per persona;
- le chiavi si ritirano presso la Gelateria Caffetteria del Corso entro le ore 20:00;
- nel rifugio non sono presenti acqua potabile né servizi igienici;
- l’accesso con cani non è consentito perché il rifugio si trova in Zona A del Parco.
```

### 14.11 Proprietà account

Scelta definitiva consigliata:

- Google Apps Script e Google Sheet delle prenotazioni devono essere creati con una **email tecnica dedicata al progetto**;
- `rifugio.barrasso@gmail.com` deve essere il destinatario principale delle notifiche operative;
- il webmaster può avere accesso come editor/amministratore tecnico;
- l’Associazione “Amici del Barrasso” deve poter accedere o recuperare la mail tecnica in caso di necessità.

Motivazione:

- continuità nel tempo;
- nessuna necessità di usare direttamente le credenziali della mail del rifugio per configurazioni tecniche;
- minore rischio se cambia webmaster;
- maggiore controllo sui dati;
- gestione privacy più chiara;
- possibilità per l’Associazione di ricevere e gestire tutte le richieste dalla casella ufficiale.

Soluzione pratica:

- account tecnico proprietario: email tecnica dedicata, da creare/confermare;
- destinatario notifiche prenotazioni: `rifugio.barrasso@gmail.com`;
- eventuale copia notifiche: webmaster o mail tecnica;
- Google Sheet condiviso con gli incaricati dell’Associazione, se necessario;
- backup periodici del foglio.

---

## 15. Calendario disponibilità

### 15.1 Decisione definitiva

Usare Google Calendar incorporato nella pagina `/prenotazioni/`.

Il calendario deve essere creato e configurato tramite la **email tecnica dedicata**, oppure tramite un calendario condiviso di cui la mail tecnica sia proprietaria/amministratrice. L’Associazione gestisce operativamente le conferme dalla mail del rifugio e aggiorna il calendario secondo le autorizzazioni assegnate.

Il calendario deve mostrare solo:

- giorni liberi/occupati;
- nessun dettaglio personale;
- nessun nome dei prenotanti.

### 15.2 Flusso

1. utente consulta calendario;
2. utente invia richiesta;
3. notifica arriva a `rifugio.barrasso@gmail.com`;
4. gestore valuta;
5. se accetta, inserisce manualmente evento “Occupato” nel calendario condiviso;
6. il calendario incorporato si aggiorna.

### 15.3 Motivazione

Non automatizzare il calendario all’invio del modulo.

Motivi:

- evita overbooking dovuti a richieste non verificate;
- mantiene controllo umano;
- permette valutazione del gruppo;
- riduce complessità tecnica.

### 15.4 Embed privacy-friendly

Il calendario deve essere caricato solo nella pagina prenotazioni.  
Opzionalmente, usare un blocco “Carica calendario disponibilità” per evitare caricamento automatico di iframe Google prima dell’interazione dell’utente.

---

## 16. Dediche e Quaderno del Rifugio

### 16.1 Decisione definitiva

Usare **Tally** per raccogliere dediche, con moderazione manuale.

L’account Tally deve essere creato o gestito tramite la **email tecnica dedicata**. Le notifiche delle nuove dediche devono essere inviate a `rifugio.barrasso@gmail.com`, così l’Associazione “Amici del Barrasso” può leggerle, selezionarle e richiederne la pubblicazione senza dover gestire direttamente l’account tecnico.

### 16.2 Flusso

1. utente apre la pagina `/quaderno-del-rifugio/`;
2. legge dediche già approvate;
3. clicca “Lascia una dedica”;
4. compila Tally;
5. Tally, configurato dalla mail tecnica, invia notifica email a `rifugio.barrasso@gmail.com`;
6. webmaster/gestore valuta;
7. le dediche più belle vengono pubblicate manualmente.

### 16.3 Perché non pubblicare automaticamente

La pubblicazione automatica è sconsigliata perché può generare:

- spam;
- contenuti offensivi;
- dati personali indesiderati;
- problemi di privacy;
- necessità di moderazione urgente.

### 16.4 Campi Tally

Campi consigliati:

- nome o soprannome;
- provenienza facoltativa;
- dedica;
- data visita facoltativa;
- consenso alla pubblicazione;
- consenso privacy;
- honeypot/antispam se disponibile;
- lingua.

### 16.5 Pubblicazione dediche

Scelta consigliata: file dati.

```ts
export const dediche = [
  {
    nome: "Marco e Luca",
    luogo: "",
    testo: "Salita dura sotto la tormenta...",
    data: "2026-02-14",
    colore: "yellow",
  },
];
```

Il componente `PostIt.astro` renderizza le dediche approvate.

Vantaggi:

- nessun database pubblico;
- niente contenuti non moderati;
- aggiornamento facile;
- stile coerente.

### 16.6 Variante più semplice

Se si preferisce massima semplicità, le dediche approvate possono essere inserite direttamente in `quaderno-del-rifugio.astro` come componenti `PostIt`.

---

## 17. Eventi speciali

### 17.1 Miglioramento rispetto allo switch JS

Il documento precedente prevedeva una variabile JavaScript:

```js
const C_E_UN_EVENTO_ATTIVO = false;
```

La soluzione è funzionale, ma migliorabile.

Scelta definitiva: usare un file dati `src/data/events.ts`.

Esempio:

```ts
export const currentEvent = {
  active: false,
  title: "",
  date: "",
  description: "",
  image: "",
  bookingEnabled: false,
  eventName: "",
};
```

### 17.2 Comportamento pagina eventi

Se `active: false`:

- mostrare messaggio di riposo;
- evitare form;
- mostrare eventuale testo “Stiamo tracciando nuovi sentieri”.

Se `active: true`:

- mostrare locandina;
- mostrare dettagli;
- mostrare eventuale form di richiesta;
- inviare ad Apps Script con `tipo_richiesta = evento`;
- inviare `nome_evento`.

### 17.3 Vantaggi

- più chiaro per LLM;
- meno rischio di rompere HTML;
- tutti i dati evento stanno in un solo file;
- possibile avere archivio eventi futuri.

---

## 18. Multilingua

### 18.1 Decisione

Italiano principale.  
Inglese in `/en/`.

Non usare traduttori automatici runtime.

### 18.2 Implementazione

Ogni pagina italiana ha equivalente inglese.  
I testi devono essere tradotti manualmente o generati da LLM e poi revisionati.

### 18.3 SEO multilingua

Ogni pagina deve avere:

- `lang="it"` o `lang="en"`;
- `hreflang`;
- canonical;
- titolo e meta description nella lingua corretta.

Esempio:

```html
<link
  rel="alternate"
  hreflang="it"
  href="https://www.rifugiobarrasso.com/prenotazioni/"
/>
<link
  rel="alternate"
  hreflang="en"
  href="https://www.rifugiobarrasso.com/en/booking/"
/>
```

---

## 19. Privacy, dati personali e GDPR

### 19.1 Dati raccolti

Prenotazioni:

- nome;
- email;
- telefono;
- numero persone;
- date;
- eventuali note.

Dediche:

- nome/soprannome;
- provenienza opzionale;
- testo dedica;
- eventuale consenso pubblicazione.

### 19.2 Pagine necessarie

Creare almeno:

- `/privacy/`;
- informativa breve sotto ogni form;
- checkbox accettazione privacy per prenotazioni;
- checkbox consenso pubblicazione per dediche.

### 19.3 Raccomandazioni

- raccogliere solo dati necessari;
- non chiedere documenti;
- non pubblicare email o telefono;
- non pubblicare dediche senza consenso;
- limitare accesso al Google Sheet;
- usare una mail tecnica dedicata per la proprietà degli strumenti esterni;
- inviare le notifiche operative alla mail ufficiale del rifugio;
- backup periodici;
- cancellazione dati su richiesta;
- definire tempo di conservazione.

### 19.4 Nota

Questa specifica non sostituisce una consulenza legale. Prima della pubblicazione definitiva, la privacy policy dovrebbe essere validata dal gestore o da un consulente.

---

## 20. Sicurezza

### 20.1 Superficie d’attacco

Il sito statico riduce molto i rischi, ma restano:

- form pubblico prenotazioni;
- iframe Tally;
- iframe Google Calendar;
- possibili script esterni;
- dati personali in Google Sheets.

### 20.2 Misure consigliate

- niente CMS;
- niente login sul sito;
- niente database pubblico;
- form validato lato server;
- honeypot antispam;
- `LockService` su Apps Script;
- backup Google Sheet;
- accesso limitato ai dati;
- CSP tramite `_headers`;
- nessun CDN non necessario;
- immagini locali;
- niente chiavi segrete nel frontend.

### 20.3 File `_headers`

Esempio iniziale da adattare:

```txt
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-src https://tally.so https://calendar.google.com https://www.google.com; connect-src 'self' https://script.google.com https://script.googleusercontent.com; form-action 'self' https://script.google.com https://script.googleusercontent.com;
```

Nota: la CSP va testata realmente perché Tally, Google Calendar e Apps Script possono richiedere domini aggiuntivi.

### 20.4 Apps Script

Non considerare l’URL Apps Script un segreto.  
Tutto ciò che sta nel frontend è pubblico.

Mitigazioni:

- validazione;
- honeypot;
- campi obbligatori;
- limiti;
- log;
- eventuale campo `form_version`;
- blocco invii duplicati ravvicinati per stessa email/data se implementabile.

---

## 21. SEO

### 21.1 Requisiti tecnici

Ogni pagina deve avere:

- title univoco;
- meta description;
- URL pulito;
- heading `h1` unico;
- contenuto testuale reale;
- immagini con alt;
- canonical;
- Open Graph;
- sitemap;
- robots.txt.

### 21.2 Esempi title

| Pagina       | Title                                |
| ------------ | ------------------------------------ | ------------------------- |
| Home         | Rifugio Paolo Barrasso               | Majella, Caramanico Terme |
| Storia       | La storia del Rifugio Paolo Barrasso |
| Prenotazioni | Prenotazioni Rifugio Paolo Barrasso  |
| Quaderno     | Quaderno del Rifugio Paolo Barrasso  |
| Regole       | Info e Regole                        | Rifugio Paolo Barrasso    |

### 21.3 Keyword naturali

Da usare senza forzature:

- Rifugio Paolo Barrasso;
- Rifugio Barrasso;
- Majella;
- Maiella;
- Monte Rapina;
- Prato della Corte;
- Caramanico Terme;
- rifugio in Majella;
- bivacco Majella;
- Amici del Barrasso.

---

## 22. Accessibilità

### 22.1 Requisiti

- contrasto adeguato;
- navigazione da tastiera;
- focus visibile;
- `alt` immagini;
- label esplicite per form;
- errori form leggibili;
- testo non troppo piccolo;
- menu mobile accessibile;
- `aria-expanded` per hamburger;
- `prefers-reduced-motion`;
- no testi importanti solo dentro immagini.

### 22.2 CTA

Evitare testi generici tipo “clicca qui”.  
Usare:

- “Richiedi prenotazione”;
- “Leggi le regole”;
- “Lascia una dedica”;
- “Apri la mappa”.

---

## 23. Contenuti obbligatori da comunicare chiaramente

Nella pagina prenotazioni e nelle regole deve essere sempre evidente che:

- il locale bivacco è sempre aperto e non si prenota;
- il locale chiuso richiede prenotazione e conferma;
- il locale chiuso contiene tavolo con panche, fornello con bombola a gas,
  armadietto chiuso con attrezzatura da cucina, legna per il camino e soppalco
  con tavolato utilizzabile come zona notte;
- per il pernottamento è necessario portare sacco a pelo e
  stuoino/materassino;
- il locale aperto contiene tavolo con panche, camino, stufa e legna da ardere;
- la richiesta online non equivale a conferma;
- massimo 2 notti;
- contributo di 10 euro al giorno per persona;
- chiavi presso Gelateria Caffetteria del Corso entro le 20:00;
- non ci sono bagni;
- non c’è acqua potabile;
- i rifiuti vanno riportati a valle;
- non si lascia cibo aperto;
- non si abbandona cenere all’esterno;
- finestre e porta vanno chiuse;
- non sono ammessi cani perché il rifugio si trova in Zona A del Parco.

---

## 24. Pagine: contenuto e struttura

### 24.1 Home

Sezioni:

1. hero fotografica;
2. payoff;
3. CTA prenotazione;
4. CTA storia;
5. racconto emozionale;
6. tre card: storia, prenotazioni, quaderno;
7. richiamo regole essenziali;
8. footer.

### 24.2 Storia

Sezioni:

1. origini del casotto;
2. funzione pastorale;
3. intitolazione a Paolo Barrasso;
4. gestione CAI;
5. chiusura 2020-2024;
6. ristrutturazione settembre 2024;
7. gestione Amici del Barrasso dal 2025.

### 24.3 Galleria

Sezioni:

1. intro;
2. griglia immagini;
3. eventuale invito hashtag;
4. nota su invio foto.

Non caricare gallery pesantissime nella prima versione.

### 24.4 Prenotazioni

Sezioni:

1. riepilogo rapido;
2. regole essenziali;
3. calendario disponibilità;
4. form richiesta;
5. messaggio “non è conferma”;
6. link privacy.

### 24.5 Quaderno del Rifugio

Sezioni:

1. intro poetica;
2. dediche approvate;
3. pulsante/form Tally;
4. nota moderazione.

### 24.6 Eventi

Sezioni:

1. stato riposo o evento attivo;
2. dettagli evento;
3. eventuale modulo evento;
4. archivio opzionale.

### 24.7 Info e Regole

Sezioni:

1. patto del buon viandante;
2. riquadro informativo "COSA TROVI ALL'INTERNO DEL BARRASSO";
3. dotazioni del locale chiuso, con parola "PRENOTAZIONE" linkata a
   `/prenotazioni/`;
4. dotazioni del locale aperto sempre liberamente accessibile;
5. divieto cani;
6. acqua e servizi;
7. rifiuti;
8. camino e cenere;
9. chiusura rifugio;
10. contatti;
11. regolamento tecnico.

---

## 25. Gestione contenuti

### 25.1 File dati centrali

`src/data/site.ts`

```ts
export const site = {
  name: "Rifugio Paolo Barrasso",
  domain: "https://www.rifugiobarrasso.com",
  email: "rifugio.barrasso@gmail.com",
  technicalEmailLabel: "email tecnica dedicata, non pubblicata sul sito",
  altitude: "1.542 m",
  location: "Prato della Corte, Caramanico Terme (PE)",
  manager: "Associazione Amici del Barrasso",
};
```

`src/data/booking.ts`

```ts
export const booking = {
  maxPersone: 4,
  maxNotti: 2,
  contributo: 10,
  chiavi: "Gelateria Caffetteria del Corso, entro le ore 20:00",
};
```

`src/data/events.ts`

```ts
export const currentEvent = {
  active: false,
  title: "",
  description: "",
  date: "",
  image: "",
  bookingEnabled: false,
  eventName: "",
};
```

`src/data/dediche.ts`

```ts
export const dediche = [];
```

### 25.2 Vantaggio

Il webmaster o un LLM può modificare dati e testi senza cercare valori sparsi nel codice.

---

## 26. Deploy

### 26.1 Repository

Usare GitHub.

Branch:

- `main`: produzione;
- eventuale `develop`: sviluppo;
- Pull Request per modifiche importanti.

### 26.2 Cloudflare Pages

Configurazione:

```txt
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Production branch: main
```

### 26.3 Ambient variables

Se usate:

```txt
PUBLIC_BOOKING_ENDPOINT=https://script.google.com/macros/s/...
PUBLIC_TALLY_GUESTBOOK_IT=...
PUBLIC_TALLY_GUESTBOOK_EN=...
PUBLIC_GOOGLE_CALENDAR_EMBED_IT=...
PUBLIC_GOOGLE_CALENDAR_EMBED_EN=...
```

Gli endpoint e gli embed devono essere configurati tramite la mail tecnica dedicata. La mail del rifugio non deve comparire come segreto tecnico: deve essere usata come destinatario operativo delle notifiche.

Nota: le variabili `PUBLIC_` sono pubbliche nel frontend. Non inserirvi segreti.

---

## 27. Backup e manutenzione

### 27.1 Backup

- GitHub contiene il codice;
- Google Sheet prenotazioni esportato periodicamente;
- Tally esportabile o collegato a Google Sheets;
- immagini salvate in cartella condivisa;
- mail tecnica con recupero sicuro e accesso documentato per l’Associazione;
- mail del rifugio usata come casella operativa per notifiche e gestione richieste.

### 27.2 Manutenzione ordinaria

| Frequenza      | Azione                                                                          |
| -------------- | ------------------------------------------------------------------------------- |
| Ogni richiesta | Gestore valuta la notifica arrivata alla mail del rifugio e aggiorna calendario |
| Mensile        | Backup Google Sheet                                                             |
| Mensile        | Controllo dediche da pubblicare                                                 |
| Trimestrale    | Verifica link, form, calendario                                                 |
| Annuale        | Revisione privacy e contenuti                                                   |
| A ogni evento  | Aggiornare `events.ts`                                                          |

---

## 28. Testing e controllo qualità

Il sito deve includere una suite di test leggera ma completa.  
L’obiettivo non è creare un’infrastruttura complessa, ma proteggere il progetto da errori frequenti durante lo sviluppo, soprattutto perché il codice potrà essere generato o modificato da un LLM.

La strategia consigliata è:

- controlli statici prima della build;
- test unitari per logiche e validazioni;
- test end-to-end per le pagine reali;
- test di accessibilità, SEO e performance;
- checklist manuale finale per servizi esterni e dispositivi reali.

### 28.1 Stack di test consigliato

| Livello                    | Strumento                  | Scopo                                                                 | Priorità                       |
| -------------------------- | -------------------------- | --------------------------------------------------------------------- | ------------------------------ |
| Formattazione              | Prettier                   | Codice coerente, leggibile e stabile nei commit                       | Obbligatorio                   |
| Lint                       | ESLint                     | Errori JavaScript/TypeScript, variabili inutilizzate, pattern fragili | Obbligatorio                   |
| Controllo Astro/TypeScript | `astro check`              | Verifica file `.astro`, TypeScript e componenti                       | Obbligatorio                   |
| Unit test                  | Vitest                     | Funzioni pure, validazioni, utility, configurazioni                   | Obbligatorio                   |
| Integration test           | Vitest                     | Coerenza tra dati, pagine, contenuti e payload form                   | Obbligatorio                   |
| End-to-end                 | Playwright                 | Navigazione reale, moduli, layout mobile, link interni                | Obbligatorio                   |
| Accessibilità              | Playwright + Lighthouse CI | Label, heading, alt text, navigazione e qualità generale              | Obbligatorio                   |
| Performance e SEO          | Lighthouse CI              | Performance, SEO, best practices, accessibilità                       | Obbligatorio                   |
| Visual regression          | Screenshot Playwright      | Controllo cambiamenti grafici indesiderati                            | Consigliato                    |
| Test manuali               | Browser reali e smartphone | Verifica finale di servizi esterni e comportamento reale              | Obbligatorio prima del go-live |

Strumenti non necessari nella fase iniziale:

- Cypress;
- Jest;
- Storybook;
- test backend complessi;
- database di test;
- piattaforme esterne di visual testing a pagamento.

Playwright è sufficiente per i test E2E e per eventuali screenshot di regressione visiva. Vitest è sufficiente per test unitari e integrazione.

### 28.2 Script consigliati in `package.json`

Il progetto dovrebbe includere script standardizzati, così il webmaster o un LLM possono eseguire sempre gli stessi controlli.

```json
{
  "scripts": {
    "dev": "astro dev",
    "check": "astro check",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "lint": "eslint .",
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:lighthouse": "lhci autorun",
    "test:all": "npm run format:check && npm run lint && npm run check && npm run test:run && npm run build && npm run test:e2e"
  }
}
```

Il comando minimo da eseguire prima di ogni pubblicazione è:

```bash
npm run test:all
```

Prima del go-live deve essere eseguito anche Lighthouse CI:

```bash
npm run test:lighthouse
```

### 28.3 Struttura consigliata dei test

```txt
tests/
  unit/
    booking-validation.test.ts
    dates.test.ts
    contacts.test.ts
    content-schema.test.ts
  integration/
    pages-content.test.ts
    navigation-config.test.ts
    booking-payload.test.ts
    events-data.test.ts
  e2e/
    home.spec.ts
    navigation.spec.ts
    booking.spec.ts
    guestbook.spec.ts
    calendar.spec.ts
    accessibility.spec.ts
    mobile.spec.ts
    seo.spec.ts
```

Questa struttura mantiene separati:

- test di logica;
- test di coerenza contenuti/dati;
- test browser reali.

### 28.4 Test unitari con Vitest

Vitest deve verificare le parti logiche e i dati centralizzati.

Test obbligatori:

- validazione email;
- validazione telefono obbligatorio;
- validazione nome referente obbligatorio;
- validazione data arrivo obbligatoria;
- validazione numero notti massimo 2;
- validazione numero massimo persone, dopo conferma del valore definitivo;
- generazione corretta del payload da inviare a Google Apps Script;
- presenza della mail operativa `rifugio.barrasso@gmail.com` nelle configurazioni di notifica lato script/documentazione;
- presenza dei dati obbligatori del rifugio: quota, località, gestione, ritiro chiavi, contributo;
- coerenza delle voci di menu con le pagine generate;
- coerenza futura tra pagine italiane e inglesi.

I test unitari non devono inviare email reali e non devono chiamare Google Apps Script, Tally o Google Calendar.

### 28.5 Test di integrazione con Vitest

I test di integrazione devono controllare la coerenza tra contenuti, componenti e dati.

Verifiche consigliate:

- ogni pagina principale ha un titolo SEO;
- ogni pagina principale ha una meta description;
- ogni pagina principale ha un solo `h1`;
- ogni pagina prevista nella sitemap esiste;
- ogni voce di navigazione punta a una pagina esistente;
- le pagine in `/en/`, quando attivate, hanno `hreflang`;
- i dati del rifugio vengono letti da un file centrale e non duplicati inutilmente;
- il form prenotazioni produce il payload previsto da Apps Script;
- la pagina eventi legge correttamente `events.ts`;
- dediche pubblicate manualmente leggono un file dati approvato, se si userà questa modalità.

### 28.6 Test end-to-end con Playwright

Playwright deve verificare il sito come lo vede un visitatore reale.

Test obbligatori:

- la home si carica correttamente;
- la navigazione desktop funziona;
- il menu mobile si apre, si chiude e consente di raggiungere le pagine;
- tutte le pagine principali rispondono;
- i link interni non sono rotti;
- le immagini principali hanno testo alternativo;
- la pagina prenotazioni mostra regole, contributo, massimo notti e ritiro chiavi;
- il checkbox di accettazione regole è obbligatorio;
- il form non parte con campi obbligatori mancanti;
- il form mostra successo solo quando l’endpoint risponde correttamente;
- il form mostra errore se l’endpoint non risponde o restituisce errore;
- calendario disponibilità visibile o fallback presente;
- Tally embed visibile o fallback/link alternativo presente;
- layout corretto su mobile, tablet e desktop;
- pagina 404 personalizzata visibile.

### 28.7 Test del form prenotazioni

Il form prenotazioni è la parte più delicata del sito. Deve essere testato senza inviare email reali durante i test automatici.

Usare endpoint separati per ambiente:

```txt
Produzione:
PUBLIC_BOOKING_ENDPOINT=https://script.google.com/macros/s/.../exec

Sviluppo/test:
PUBLIC_BOOKING_ENDPOINT=/mock-booking-success
```

Verifiche obbligatorie:

- invio valido con dati completi;
- blocco senza consenso alle regole;
- blocco senza email;
- blocco senza telefono;
- blocco senza data arrivo;
- blocco se numero persone supera il valore massimo confermato;
- blocco se numero notti supera 2;
- messaggio chiaro in caso di errore;
- nessun redirect fuori dal sito;
- nessuna esposizione di segreti nel frontend;
- salvataggio corretto su Google Sheet nella prova manuale finale;
- email reale ricevuta su `rifugio.barrasso@gmail.com` nella prova manuale finale.

### 28.8 Test dediche e Tally

Per Tally non bisogna testare la logica interna della piattaforma esterna. Bisogna testare l’integrazione sul sito.

Verifiche automatiche:

- pagina “Quaderno del Rifugio” raggiungibile;
- iframe Tally presente;
- titolo e testo introduttivo visibili;
- link alternativo “Apri il modulo dediche” presente;
- fallback visibile se l’embed non carica;
- dediche pubblicate manualmente visibili e prive di dati personali non necessari.

Verifiche manuali prima del go-live:

- invio dedica di prova;
- notifica ricevuta su `rifugio.barrasso@gmail.com`;
- eventuale copia al webmaster ricevuta;
- moderazione manuale funzionante;
- pubblicazione solo delle dediche approvate.

### 28.9 Test calendario disponibilità

Verifiche automatiche:

- iframe calendario presente nella pagina prenotazioni;
- testo di fallback presente;
- link alternativo “Apri calendario” presente;
- nessun dato personale visibile nell’embed pubblico;
- layout corretto su mobile.

Verifiche manuali:

- il calendario è creato/configurato con la mail tecnica;
- il calendario mostra solo disponibile/occupato;
- inserendo un evento “Occupato” il sito lo mostra correttamente;
- i gestori dell’Associazione sanno aggiornarlo;
- la mail del rifugio riceve le notifiche operative previste, se configurate.

### 28.10 Test accessibilità

Obiettivi minimi:

- ogni pagina ha un solo `h1`;
- heading ordinati in modo logico;
- testi alternativi significativi per le immagini informative;
- pulsanti e link con nome accessibile;
- campi form con label esplicite;
- messaggi di errore del form leggibili;
- contrasto sufficiente tra testo e sfondo;
- navigazione possibile da tastiera;
- focus visibile su link, pulsanti e campi;
- nessuna informazione affidata solo al colore.

### 28.11 Test performance e Lighthouse CI

Pagine minime da verificare con Lighthouse CI:

```txt
/
/storia/
/prenotazioni/
/quaderno-del-rifugio/
/info-e-regole/
```

Soglie consigliate:

| Categoria      | Soglia minima | Obiettivo ideale |
| -------------- | ------------: | ---------------: |
| Performance    |            85 |              90+ |
| Accessibility  |            90 |              95+ |
| Best Practices |            90 |              95+ |
| SEO            |            90 |              95+ |

Se gli iframe esterni di Google Calendar o Tally abbassano il punteggio, valutare fallback leggeri, caricamento lazy e testi alternativi.

### 28.12 Visual regression

Le regressioni visive sono consigliate dopo aver stabilizzato grafica, font e immagini.

Screenshot consigliati:

- home desktop;
- home mobile;
- prenotazioni desktop;
- prenotazioni mobile;
- quaderno del rifugio;
- pagina info e regole;
- header e footer.

Usare Playwright screenshot assertions solo sulle parti realmente stabili. Evitare test visivi troppo rigidi su immagini, font caricati da CDN o embed esterni.

### 28.13 Checklist manuale finale

Prima della pubblicazione definitiva verificare manualmente:

- apertura sito da smartphone reale;
- apertura sito da desktop;
- navigazione completa;
- form prenotazione con richiesta di prova;
- ricezione email su `rifugio.barrasso@gmail.com`;
- salvataggio richiesta su Google Sheet;
- eventuale risposta automatica al richiedente;
- aggiornamento evento occupato nel calendario;
- visualizzazione calendario sul sito;
- invio dedica Tally di prova;
- ricezione notifica dedica su `rifugio.barrasso@gmail.com`;
- pubblicazione manuale di una dedica approvata;
- test su Chrome, Safari e Firefox;
- test su iPhone e Android;
- test con connessione mobile debole;
- verifica dominio definitivo e HTTPS;
- verifica favicon;
- verifica pagina 404;
- verifica privacy e consenso trattamento dati.

### 28.14 CI/CD

In GitHub Actions o equivalente, eseguire almeno:

```txt
npm ci
npm run format:check
npm run lint
npm run check
npm run test:run
npm run build
npm run test:e2e
```

Lighthouse CI può essere eseguito:

- a ogni pull request importante;
- prima del go-live;
- periodicamente dopo modifiche a immagini, font o embed esterni.

Regola consigliata: nessun deploy di produzione deve essere effettuato se `npm run build` o `npm run test:e2e` falliscono.

---

## 29. Miglioramenti rispetto al documento precedente

| Tema                 | Documento precedente     | Specifica aggiornata                                                                    |
| -------------------- | ------------------------ | --------------------------------------------------------------------------------------- |
| Struttura            | HTML statico multipagina | Astro statico multipagina                                                               |
| CSS                  | Tailwind generico        | Tailwind compilato, no CDN                                                              |
| Bozza HTML           | possibile base codice    | solo riferimento grafico                                                                |
| Header/footer        | duplicabili in ogni file | componenti riutilizzabili                                                               |
| Eventi               | switch JS dentro pagina  | file dati `events.ts`                                                                   |
| Dediche              | Tally + copia HTML       | Tally + pubblicazione da file dati                                                      |
| Account Google/Tally | account webmaster        | mail tecnica dedicata proprietaria, notifiche operative alla mail del rifugio           |
| Sicurezza            | generale                 | CSP, honeypot, validazione server, backup                                               |
| SEO                  | pagine fisiche           | pagine statiche + meta + hreflang + sitemap                                             |
| Testing              | checklist generica       | suite strutturata con Prettier, ESLint, Astro Check, Vitest, Playwright e Lighthouse CI |
| Manutenzione         | manuale                  | dati centralizzati + README                                                             |

---

## 30. Prompt operativo per LLM sviluppatore

Quando si chiederà a un LLM di generare il codice, usare una richiesta simile:

```txt
Realizza il sito statico multipagina del Rifugio Paolo Barrasso seguendo il documento tecnico allegato.

Vincoli:
- usare Astro in modalità statica;
- non usare React;
- non usare Tailwind CDN;
- usare Tailwind compilato;
- usare componenti Astro riutilizzabili;
- usare contenuti e dati centralizzati in src/data;
- mantenere JavaScript minimo e vanilla;
- non creare backend proprietario;
- form prenotazioni verso Google Apps Script;
- dediche tramite Tally embed;
- calendario tramite Google Calendar embed;
- lingua italiana principale e inglese in /en/;
- output finale deployabile su Cloudflare Pages;
- includere Prettier, ESLint, Astro Check, Vitest, Playwright e Lighthouse CI;
- aggiungere test per validazioni form, navigazione, mobile, accessibilità e fallback degli embed;
- codice leggibile, commentato solo dove serve, con README.
```

---

## 31. Punti da confermare prima dello sviluppo

1. **Numero massimo persone nel locale chiuso:** confermato a 8.
2. **Email definitiva:** confermare `rifugio.barrasso@gmail.com`.
3. **Dominio definitivo:** confermare `www.rifugiobarrasso.com`.
4. **Mail tecnica dedicata:** creare/confermare l’account proprietario di Google Sheet, Apps Script, Google Calendar e Tally.
5. **Accessi Associazione:** definire chi degli “Amici del Barrasso” può accedere o recuperare la mail tecnica.
6. **Telefono/WhatsApp pubblico:** decidere se mostrarlo o usare solo email.
7. **Coordinate ufficiali:** confermare latitudine/longitudine.
8. **Testo privacy:** da validare.
9. **Versione inglese:** confermare se realizzarla subito o in fase 2.
10. **Eventi:** confermare se pagina attiva subito o predisposta ma senza eventi.
11. **Foto:** selezionare set definitivo e autorizzazioni.

---

## 32. Roadmap consigliata

### Fase 1 - Fondamenta - COMPLETATA

- creare repository;
- configurare Astro;
- configurare Tailwind;
- configurare Prettier, ESLint, Astro Check, Vitest e Playwright;
- creare layout e componenti;
- creare pagine italiane;
- inserire contenuti;
- ottimizzare immagini.

### Fase 2 - Funzioni - COMPLETATA

- creare/confermare mail tecnica dedicata;
- creare Google Sheet con mail tecnica;
- creare Apps Script con mail tecnica;
- configurare notifiche verso `rifugio.barrasso@gmail.com`;
- collegare form;
- testare email;
- creare calendario con mail tecnica o calendario condiviso;
- incorporare calendario;
- creare Tally dediche con mail tecnica;
- configurare notifiche dediche verso `rifugio.barrasso@gmail.com`;
- incorporare Tally.

### Fase 3 - Produzione

- configurare Cloudflare Pages;
- configurare dominio;
- aggiungere `_headers`;
- aggiungere `_redirects`;
- generare sitemap;
- eseguire `npm run test:all`;
- eseguire Lighthouse CI;
- testare performance;
- testare mobile;
- revisionare privacy;
- pubblicare.

### Fase 4 - Evoluzioni

- versione inglese;
- archivio eventi;
- dediche aggiornabili da JSON;
- eventuale pagina “come contribuire”;
- eventuale guida escursionistica più dettagliata.

---

## 33. Conclusione tecnica

La soluzione più solida è:

**Astro statico + Cloudflare Pages + CSS compilato + JavaScript minimo + Google Apps Script per prenotazioni + Google Calendar per disponibilità + Tally per dediche.**

Questa architettura mantiene il sito:

- veloce;
- economico;
- sicuro;
- semplice da pubblicare;
- facile da aggiornare;
- adatto a essere generato e mantenuto con l’aiuto di un LLM;
- controllato da una suite di test automatizzati e da una checklist manuale finale;
- coerente con la natura del rifugio: essenziale, affidabile, senza sovrastrutture inutili.
utture inutili.
