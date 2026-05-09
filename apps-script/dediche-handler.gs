/**
 * Rifugio Paolo Barrasso – Dediche Handler
 * Google Apps Script
 */

var SHEET_ID = "1DwmC_CdWGYLltHxAlt16DspnJ58sl8OXTRQopJy1d9o";
var SHEET_NAME = "Dediche";
var NOTIFY_EMAIL = "rifugio.barrasso@gmail.com";
var CC_EMAIL = "";
var RATE_LIMIT_DEDICHE_EMAIL_24H = 3;
var RATE_LIMIT_DEDICHE_GLOBAL_HOUR = 30;
var MAX_NOME_LENGTH = 80;
var MAX_EMAIL_LENGTH = 120;
var MAX_LUOGO_LENGTH = 80;
var MAX_TESTO_LENGTH = 1200;

function getOrCreateSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "ID",
      "Timestamp",
      "Nome",
      "Email",
      "Luogo",
      "Testo",
      "Consenso",
      "Approvata",
    ]);
  }
  return sheet;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "Server occupato." }),
    ).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var p = (e && e.parameter) || {};
    if (p.honeypot && p.honeypot.length > 0) {
      return buildResponse("error", "Spam.");
    }

    var errors = validateDedica(p);
    if (errors.length > 0) {
      return buildResponse("error", errors.join(" | "));
    }

    var nome = normalizeText(p.nome, MAX_NOME_LENGTH);
    var email = normalizeEmail(p.email);
    var luogo = normalizeText(p.luogo || "", MAX_LUOGO_LENGTH);
    var testo = normalizeText(p.testo, MAX_TESTO_LENGTH);
    var now = new Date();
    var id = "D-" + now.getTime();
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = getOrCreateSheet(ss);
    var rateLimitError = checkDedicheRateLimit(sheet, { email: email }, now);
    if (rateLimitError) {
      return buildResponse("error", rateLimitError);
    }

    sheet.appendRow([
      id,
      Utilities.formatDate(now, "Europe/Rome", "dd/MM/yyyy HH:mm:ss"),
      toSheetText(nome),
      toSheetText(email),
      toSheetText(luogo),
      toSheetText(testo),
      "SI",
      "", // Approvata
    ]);

    try {
      var subject = "Nuova Dedica Rifugio Barrasso da " + nome;
      var body =
        "Nuova dedica ricevuta:\n\nNome: " +
        nome +
        "\nEmail: " +
        email +
        "\nLuogo: " +
        (luogo || "-") +
        "\nTesto: " +
        testo +
        "\n\nVai sul Foglio Google per approvarla (scrivendo SI nella colonna Approvata).";
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    } catch (err) {}

    return buildResponse("success", "Dedica inviata");
  } catch (err) {
    return buildResponse("error", err.toString());
  } finally {
    lock.releaseLock();
  }
}

function validateDedica(p) {
  var errors = [];
  if (!p.nome || normalizeText(p.nome, MAX_NOME_LENGTH).length === 0) {
    errors.push("Nome obbligatorio");
  }

  var email = normalizeEmail(p.email);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Email non valida");
  }

  if (!p.testo || normalizeText(p.testo, MAX_TESTO_LENGTH).length === 0) {
    errors.push("Dedica obbligatoria");
  }

  if (p.consenso !== "on") {
    errors.push("Consenso pubblicazione obbligatorio");
  }

  return errors;
}

function checkDedicheRateLimit(sheet, p, now) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return "";

  var nowTime = now.getTime();
  var oneHourAgo = nowTime - 60 * 60 * 1000;
  var oneDayAgo = nowTime - 24 * 60 * 60 * 1000;
  var emailKey = normalizeEmail(p.email);
  var emailCount = 0;
  var globalCount = 0;

  // Colonne B:G: timestamp, nome, email, luogo, testo, consenso.
  var rows = sheet.getRange(2, 2, lastRow - 1, 6).getValues();
  for (var i = rows.length - 1; i >= 0; i--) {
    var submittedAt = parseServerTimestamp(rows[i][0]);
    if (!submittedAt) continue;

    var submittedTime = submittedAt.getTime();
    if (submittedTime >= oneHourAgo) {
      globalCount++;
    }

    if (
      submittedTime >= oneDayAgo &&
      emailKey &&
      normalizeEmail(rows[i][2]) === emailKey
    ) {
      emailCount++;
    }
  }

  if (globalCount >= RATE_LIMIT_DEDICHE_GLOBAL_HOUR) {
    return "Troppe dediche ricevute nell'ultima ora. Riprova più tardi.";
  }

  if (emailCount >= RATE_LIMIT_DEDICHE_EMAIL_24H) {
    return "Troppe dediche con questa email nelle ultime 24 ore. Riprova domani.";
  }

  return "";
}

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .slice(0, MAX_EMAIL_LENGTH);
}

function normalizeText(value, maxLength) {
  return String(value || "")
    .trim()
    .slice(0, maxLength);
}

function toSheetText(value) {
  var text = String(value || "");
  return /^[\s]*[=+\-@]/.test(text) ? "'" + text : text;
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

function doGet(e) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = getOrCreateSheet(ss);
  var data = sheet.getDataRange().getValues();
  var dediche = [];

  if (data.length > 1) {
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      // Check if "Approvata" contains "SI" (case insensitive)
      if (row[7] && row[7].toString().toUpperCase().trim() === "SI") {
        dediche.push({
          id: row[0],
          data: row[1],
          nome: row[2],
          luogo: row[4],
          testo: row[5],
        });
      }
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: "success", data: dediche.reverse() }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function buildResponse(status, message) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: status, message: message }),
  ).setMimeType(ContentService.MimeType.JSON);
}
