/**
 * Rifugio Paolo Barrasso – Booking Handler
 * Google Apps Script – da incollare nell'editor Apps Script.
 *
 * Prerequisiti:
 *   1. Creare un Google Sheet con la mail tecnica dedicata.
 *   2. Copiare lo SHEET_ID qui sotto.
 *   3. Configurare il nome del foglio (default: "Prenotazioni").
 *   4. Fare Deploy → New deployment → Web App → Anyone can access.
 *   5. Copiare l'URL e inserirlo in PUBLIC_BOOKING_ENDPOINT.
 */

/* ── configurazione ──────────────────────────────────────── */

/** ID del Google Sheet (dalla URL del foglio). */
var SHEET_ID = "1pXlY8x5srC2Oxz7FKC4lr9yjBdrAUbOyMCXs3SG4eyE";

/** Nome del foglio dentro il Google Sheet. */
var SHEET_NAME = "Prenotazioni";

/** Email operativa a cui inviare le notifiche. */
var NOTIFY_EMAIL = "rifugio.barrasso@gmail.com";

/** Email opzionale in copia (webmaster o mail tecnica). Lasciare vuota se non serve. */
var CC_EMAIL = "";

/** Massimo richieste accettate per stessa email nelle ultime 24 ore. */
var RATE_LIMIT_EMAIL_24H = 3;

/** Massimo richieste accettate per stesso telefono nelle ultime 24 ore. */
var RATE_LIMIT_PHONE_24H = 3;

/** Massimo richieste accettate complessive nell'ultima ora. */
var RATE_LIMIT_GLOBAL_HOUR = 30;

/* ── handler principale ──────────────────────────────────── */

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return buildResponse(
      "error",
      "Server occupato, riprova tra qualche secondo.",
    );
  }

  try {
    var p = e.parameter;

    /* ── honeypot ── */
    if (p.honeypot && p.honeypot.length > 0) {
      return buildResponse("error", "Invio rifiutato.");
    }

    /* ── validazione ── */
    var errors = validate(p);
    if (errors.length > 0) {
      return buildResponse("error", errors.join(" | "));
    }

    /* ── sheet e rate limiting ── */
    var now = new Date();
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = getOrCreateBookingSheet(ss);
    var rateLimitError = checkRateLimit(sheet, p, now);
    if (rateLimitError) {
      return buildResponse("error", rateLimitError);
    }

    /* ── booking id ── */
    var bookingId = generateBookingId();

    var emailNotificaOk = false;
    var emailUtenteOk = false;

    sheet.appendRow([
      bookingId,
      Utilities.formatDate(now, "Europe/Rome", "dd/MM/yyyy HH:mm:ss"),
      p.lingua || "it",
      p.tipo_richiesta || "pernottamento",
      "nuova",
      toSheetText(p.nome),
      toSheetText(p.data_nascita),
      toSheetText(p.luogo_nascita),
      toSheetText(p.numero_documento),
      toSheetText(p.email),
      toSheetText(p.telefono),
      parseInt(p.persone, 10),
      toSheetText(p.elenco_partecipanti),
      toSheetText(p.data_arrivo),
      parseInt(p.notti, 10),
      toSheetText(p.data_partenza),
      toSheetText(p.attivita_prevista),
      toSheetText(p.note || ""),
      toSheetText(p.accettazione_regole || ""),
      toSheetText(p.accettazione_contributo || ""),
      toSheetText(p.presa_visione_responsabilita || ""),
      toSheetText(p.accettazione_privacy || ""),
      toSheetText(p.consenso_ricontatto || ""),
      toSheetText(p.page_url || ""),
      toSheetText((e && e.parameter && e.parameter.user_agent) || ""),
      toSheetText(p.form_version || ""),
      "", // email_notifica_inviata
      "", // email_utente_inviata
      "", // note_gestore
    ]);

    var lastRow = sheet.getLastRow();

    /* ── email al rifugio ── */
    try {
      var subjectRifugio =
        "Nuova richiesta prenotazione Rifugio Barrasso - " +
        p.data_arrivo +
        " - " +
        p.nome;

      var bodyRifugio = [
        "È arrivata una nuova richiesta di prenotazione.",
        "",
        "ID richiesta: " + bookingId,
        "Nome: " + p.nome,
        "Data di nascita: " + p.data_nascita,
        "Luogo di nascita: " + p.luogo_nascita,
        "Numero documento: " + p.numero_documento,
        "Email: " + p.email,
        "Telefono: " + p.telefono,
        "Data arrivo: " + p.data_arrivo,
        "Notti: " + p.notti,
        "Data partenza: " + p.data_partenza,
        "Persone: " + p.persone,
        "Elenco partecipanti: " + p.elenco_partecipanti,
        "Attività prevista: " + p.attivita_prevista,
        "Note: " + (p.note || "-"),
        "",
        "Attenzione: questa richiesta NON è ancora confermata.",
        "Verificare disponibilità e aggiornare manualmente Google Calendar se accettata.",
      ].join("\n");

      var mailOptions = { name: "Rifugio Paolo Barrasso" };
      if (CC_EMAIL) mailOptions.cc = CC_EMAIL;

      MailApp.sendEmail(NOTIFY_EMAIL, subjectRifugio, bodyRifugio, mailOptions);
      emailNotificaOk = true;
    } catch (mailErr) {
      /* log but don't fail */
    }

    /* ── email all'utente ── */
    try {
      var subjectUtente = "Richiesta ricevuta - Rifugio Paolo Barrasso";

      var bodyUtente = [
        "Grazie, abbiamo ricevuto la tua richiesta.",
        "",
        "La prenotazione non è ancora confermata.",
        "Riceverai una risposta dal gestore dopo la verifica della disponibilità.",
        "",
        "Ricorda:",
        "- il locale bivacco resta sempre aperto e non è prenotabile in esclusiva;",
        "- il locale chiuso è utilizzabile solo dopo conferma;",
        "- il contributo è di 10 euro al giorno per persona;",
        "- le chiavi si ritirano presso la Gelateria Caffetteria del Corso (Corso Gaetano Bernardini n. 6, Caramanico Terme) entro le ore 20:00;",
        "- nel rifugio non sono presenti acqua potabile né servizi igienici;",
        "- l'accesso con cani non è consentito perché il rifugio si trova in Zona A del Parco.",
        "",
        "ID richiesta: " + bookingId,
        "Data arrivo: " + p.data_arrivo,
        "Notti: " + p.notti,
        "Persone: " + p.persone,
        "",
        "A presto sui sentieri della Maiella!",
        "Associazione Amici del Barrasso",
      ].join("\n");

      MailApp.sendEmail(p.email, subjectUtente, bodyUtente, {
        name: "Rifugio Paolo Barrasso",
        replyTo: NOTIFY_EMAIL,
      });
      emailUtenteOk = true;
    } catch (mailErr) {
      /* log but don't fail */
    }

    /* ── aggiorna colonne email ── */
    sheet.getRange(lastRow, 27).setValue(emailNotificaOk ? "sì" : "errore");
    sheet.getRange(lastRow, 28).setValue(emailUtenteOk ? "sì" : "errore");

    return buildResponse("ok", bookingId);
  } catch (err) {
    return buildResponse("error", "Errore interno: " + err.message);
  } finally {
    lock.releaseLock();
  }
}

/* ── validazione server-side ─────────────────────────────── */

function validate(p) {
  var errors = [];
  if (!p.nome || p.nome.trim().length === 0) errors.push("Nome obbligatorio");
  if (!p.data_nascita || p.data_nascita.trim().length === 0)
    errors.push("Data nascita obbligatoria");
  if (!p.luogo_nascita || p.luogo_nascita.trim().length === 0)
    errors.push("Luogo di nascita obbligatorio");
  if (!p.numero_documento || p.numero_documento.trim().length === 0)
    errors.push("Numero documento obbligatorio");
  if (!p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))
    errors.push("Email non valida");
  if (!p.telefono || p.telefono.trim().length === 0)
    errors.push("Telefono obbligatorio");

  var persone = parseInt(p.persone, 10);
  if (isNaN(persone) || persone < 1 || persone > 8)
    errors.push("Persone tra 1 e 8");

  if (!p.elenco_partecipanti || p.elenco_partecipanti.trim().length === 0)
    errors.push("Elenco partecipanti obbligatorio");
  if (!p.attivita_prevista || p.attivita_prevista.trim().length === 0)
    errors.push("Attività prevista obbligatoria");

  var notti = parseInt(p.notti, 10);
  if (isNaN(notti) || notti < 1 || notti > 2) errors.push("Notti tra 1 e 2");

  if (!p.data_arrivo) {
    errors.push("Data arrivo obbligatoria");
  } else {
    var dA = new Date(p.data_arrivo + "T00:00:00");
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(dA.getTime()) || dA < today)
      errors.push("Data arrivo non valida o nel passato");
  }

  if (!p.data_partenza) {
    errors.push("Data partenza obbligatoria");
  } else {
    var dA2 = new Date(p.data_arrivo + "T00:00:00");
    var dP = new Date(p.data_partenza + "T00:00:00");
    if (isNaN(dP.getTime()) || dP <= dA2)
      errors.push("Data partenza non valida o precedente all'arrivo");
  }

  if (p.accettazione_regole !== "sì") errors.push("Regole non accettate");
  if (p.accettazione_contributo !== "sì")
    errors.push("Contributo e chiavi non accettati");
  if (p.presa_visione_responsabilita !== "sì")
    errors.push("Responsabilità non accettata");
  if (p.accettazione_privacy !== "sì") errors.push("Privacy non accettata");
  if (p.consenso_ricontatto !== "sì")
    errors.push("Consenso ricontatto non accettato");

  return errors;
}

/* ── utilità ──────────────────────────────────────────────── */

function getOrCreateBookingSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) return sheet;

  sheet = ss.insertSheet(SHEET_NAME);
  sheet.appendRow([
    "booking_id",
    "timestamp_server",
    "lingua",
    "tipo_richiesta",
    "stato",
    "nome",
    "data_nascita",
    "luogo_nascita",
    "numero_documento",
    "email",
    "telefono",
    "persone",
    "elenco_partecipanti",
    "data_arrivo",
    "notti",
    "data_partenza",
    "attivita_prevista",
    "note",
    "accettazione_regole",
    "accettazione_contributo",
    "presa_visione_responsabilita",
    "accettazione_privacy",
    "consenso_ricontatto",
    "page_url",
    "user_agent",
    "form_version",
    "email_notifica_inviata",
    "email_utente_inviata",
    "note_gestore",
  ]);

  return sheet;
}

function checkRateLimit(sheet, p, now) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return "";

  var nowTime = now.getTime();
  var oneHourAgo = nowTime - 60 * 60 * 1000;
  var oneDayAgo = nowTime - 24 * 60 * 60 * 1000;
  var emailKey = normalizeEmail(p.email);
  var phoneKey = normalizePhone(p.telefono);
  var emailCount = 0;
  var phoneCount = 0;
  var globalCount = 0;

  // Colonne B:K: timestamp_server ... email, telefono.
  var rows = sheet.getRange(2, 2, lastRow - 1, 10).getValues();
  for (var i = rows.length - 1; i >= 0; i--) {
    var submittedAt = parseServerTimestamp(rows[i][0]);
    if (!submittedAt) continue;

    var submittedTime = submittedAt.getTime();
    if (submittedTime >= oneHourAgo) {
      globalCount++;
    }

    if (submittedTime >= oneDayAgo) {
      if (emailKey && normalizeEmail(rows[i][8]) === emailKey) {
        emailCount++;
      }

      if (phoneKey && normalizePhone(rows[i][9]) === phoneKey) {
        phoneCount++;
      }
    }
  }

  if (globalCount >= RATE_LIMIT_GLOBAL_HOUR) {
    return "Troppe richieste ricevute nell'ultima ora. Riprova più tardi o contatta direttamente il rifugio.";
  }

  if (emailCount >= RATE_LIMIT_EMAIL_24H) {
    return "Troppe richieste con questa email nelle ultime 24 ore. Riprova domani o contatta direttamente il rifugio.";
  }

  if (phoneCount >= RATE_LIMIT_PHONE_24H) {
    return "Troppe richieste con questo numero di telefono nelle ultime 24 ore. Riprova domani o contatta direttamente il rifugio.";
  }

  return "";
}

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function toSheetText(value) {
  var text = String(value || "");
  return /^[\s]*[=+\-@]/.test(text) ? "'" + text : text;
}

function normalizePhone(value) {
  var raw = String(value || "").trim();
  var normalized = raw.replace(/[^\d+]/g, "");
  var hasInternationalPrefix = normalized.charAt(0) === "+";

  if (normalized.indexOf("00") === 0) {
    normalized = "+" + normalized.slice(2);
    hasInternationalPrefix = true;
  }

  if (normalized.charAt(0) === "+") {
    normalized = "+" + normalized.slice(1).replace(/\D/g, "");
  } else {
    normalized = normalized.replace(/\D/g, "");
  }

  var digits = normalized.replace(/^\+/, "");
  if (
    hasInternationalPrefix &&
    digits.indexOf("39") === 0 &&
    digits.length >= 10 &&
    digits.length <= 13
  ) {
    digits = digits.slice(2);
  }

  return digits;
}

function parseServerTimestamp(value) {
  if (value instanceof Date && !isNaN(value.getTime())) return value;

  var text = String(value || "").trim();
  var match = text.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/,
  );
  if (!match) return null;

  var day = parseInt(match[1], 10);
  var month = parseInt(match[2], 10) - 1;
  var year = parseInt(match[3], 10);
  var hour = parseInt(match[4], 10);
  var minute = parseInt(match[5], 10);
  var second = parseInt(match[6] || "0", 10);
  var parsed = new Date(year, month, day, hour, minute, second);

  return isNaN(parsed.getTime()) ? null : parsed;
}

function generateBookingId() {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var id = "RB-";
  for (var i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function buildResponse(status, message) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: status, message: message }),
  ).setMimeType(ContentService.MimeType.JSON);
}
