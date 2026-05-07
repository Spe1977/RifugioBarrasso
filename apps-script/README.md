# Google Apps Script – Guida al deploy

## Prerequisiti

- Un account Google (la **mail tecnica dedicata** del progetto).
- Accesso a [Google Apps Script](https://script.google.com).

## Passaggi

### 1. Creare il Google Sheet

1. Accedere a Google Sheets con la mail tecnica.
2. Creare un nuovo foglio denominato **"Prenotazioni Rifugio Barrasso"**.
3. Copiare l'**ID del foglio** dalla URL:
   ```
   https://docs.google.com/spreadsheets/d/QUESTO_E_LO_SHEET_ID/edit
   ```
4. Condividere il foglio in modifica con chi deve gestire le prenotazioni.

### 2. Creare il progetto Apps Script

1. Andare su [script.google.com](https://script.google.com) → **Nuovo progetto**.
2. Rinominare il progetto: **"Rifugio Barrasso – Prenotazioni"**.
3. Cancellare il contenuto predefinito di `Code.gs`.
4. Incollare il contenuto di `booking-handler.gs`.
5. Sostituire `INSERIRE_SHEET_ID_QUI` con l'ID del foglio creato al punto 1.
6. Se necessario, modificare `CC_EMAIL` con l'email del webmaster.
7. Salvare (Ctrl+S).

### 3. Deploy come Web App

1. Fare clic su **Deploy** → **New deployment**.
2. Tipo: **Web App**.
3. Descrizione: `v1 – Fase 2`.
4. Esegui come: **Me** (la mail tecnica).
5. Chi può accedere: **Anyone** (chiunque, anche senza login Google).
6. Fare clic su **Deploy**.
7. Autorizzare l'accesso quando richiesto.
8. Copiare l'**URL della Web App**.

### 4. Configurare il sito

Inserire l'URL copiato come variabile d'ambiente:

```env
PUBLIC_BOOKING_ENDPOINT=https://script.google.com/macros/s/.../exec
```

### 5. Test

1. Aprire `/prenotazioni/` sul sito.
2. Compilare il form con dati di prova.
3. Verificare:
   - La riga appare nel Google Sheet.
   - L'email arriva a `rifugio.barrasso@gmail.com`.
   - L'email di ricevuta arriva all'indirizzo inserito nel form.

## Note

- L'URL dell'Apps Script è **pubblico** (sta nel frontend). Non è un segreto.
- Il rate limit di `MailApp.sendEmail` è ~100 email/giorno per account gratuito.
- `LockService` previene scritture concorrenti.
- Per aggiornare lo script: **Deploy** → **Manage deployments** → **Edit** → incrementare versione.
