# Design Doc: Sistema Dediche con Google Sheets

## 1. Obiettivo

Sostituire l'attuale iframe di Tally nella pagina "Quaderno del Rifugio" con un modulo personalizzato integrato nello stile del sito (Astro). I dati verranno salvati su un Foglio Google privato. Il sistema dovrà permettere la moderazione tramite il Foglio Google stesso e la visualizzazione dinamica delle dediche approvate senza necessità di aggiornare o ricaricare il codice del sito.

## 2. Gestione Account e Permessi

Per ragioni di sicurezza e organizzazione logica, verranno utilizzati due account Google distinti:

- **`sito.barrasso@gmail.com` (Proprietario/Backend)**: Questo account ospiterà il Foglio Google (Google Sheets) e lo script (Google Apps Script). Lo script girerà sotto le autorizzazioni di questo account.
- **`rifugio.barrasso@gmail.com` (Moderatore/Gestore)**: Questo account riceverà le email di notifica per ogni nuova dedica. Il Foglio Google creato dall'account proprietario sarà condiviso con permessi di "Editor" a questo indirizzo, permettendo al gestore di approvare le dediche senza dover accedere all'account tecnico del sito.

## 3. Architettura

Il sistema si divide in 3 componenti principali:

### 3.1. Il Modulo di Invio (Frontend - Astro)

- **Componente**: `src/components/DedicaForm.astro`
- **Design**: Utilizzerà le stesse classi CSS (Tailwind) e lo stesso layout del form delle prenotazioni (`BookingForm.astro`) per garantire coerenza visiva.
- **Campi**: Nome, Luogo (opzionale), Testo della dedica. (La data verrà registrata automaticamente al momento dell'invio; il "colore" del post-it verrà assegnato dinamicamente in fase di rendering).
- **Comportamento**: L'invio avverrà in background (tramite AJAX/Fetch API) per non far ricaricare la pagina all'utente, mostrando un messaggio di feedback (es. "Dedica inviata! Verrà pubblicata dopo la moderazione").

### 3.2. Il Database e l'API (Backend - Google Apps Script)

- **Database**: Un file Google Sheets (di proprietà di `sito.barrasso@gmail.com`) con le colonne: Timestamp, Nome, Luogo, Testo, Approvata.
- **Endpoint API**: Verrà creato un Google Apps Script (pubblicato come Web App in esecuzione come utente `sito.barrasso@gmail.com` accessibile a "Tutti") che avrà due funzioni:
  1. `doPost(e)`: Riceve i dati dal form, inserisce una nuova riga nel foglio con "Approvata" lasciato vuoto, e invia un'email di notifica a `rifugio.barrasso@gmail.com`.
  2. `doGet(e)`: Legge il foglio, filtra solo le righe dove la colonna "Approvata" contiene "SI" (o una spunta), e restituisce un array in formato JSON contenente i dati pubblici delle dediche.

### 3.3. Il Rendering delle Dediche (Frontend - Vanilla JS)

- Poiché il sito Astro è generato staticamente (`output: "static"`), nella pagina `src/pages/quaderno-del-rifugio/index.astro`, uno script client-side (Vanilla JS) leggerà (Fetch API) l'endpoint GET del Google Apps Script ad ogni caricamento della pagina.
- Durante il caricamento verrà mostrato uno stato di attesa (skeleton o spinner).
- Una volta ottenuti i dati JSON delle dediche approvate, lo script inietterà dinamicamente nel DOM l'HTML dei post-it colorati.

## 4. Flusso di Lavoro della Moderazione

1. Il visitatore compila e invia il modulo sul sito.
2. L'Apps Script (eseguito da `sito.barrasso@gmail.com`) salva la riga sul Foglio Google e manda un'email automatica a `rifugio.barrasso@gmail.com`.
3. Il gestore, leggendo l'email da `rifugio.barrasso@gmail.com`, apre il Foglio Google tramite il link (avendo i permessi di Editor).
4. Se accetta la dedica, scrive "SI" nella colonna "Approvata".
5. Da quel momento, chiunque ricarica la pagina "Quaderno" vedrà comparire la dedica approvata.

## 5. Gestione degli Errori e Sicurezza

- **Validazione Frontend**: Campi obbligatori impostati in HTML (Nome, Testo).
- **Honeypot/Spam**: Aggiunta di un campo nascosto invisibile all'utente; se compilato da un bot, la richiesta viene bloccata.
- **CORS**: L'Apps Script dovrà restituire gli header CORS corretti per permettere le chiamate dal dominio `www.rifugiobarrasso.com`.
