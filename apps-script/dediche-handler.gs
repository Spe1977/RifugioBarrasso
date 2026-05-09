/**
 * Rifugio Paolo Barrasso – Dediche Handler
 * Google Apps Script
 */

var SHEET_ID = "INSERIRE_ID_FOGLIO";
var SHEET_NAME = "Dediche";
var NOTIFY_EMAIL = "rifugio.barrasso@gmail.com";
var CC_EMAIL = "";

function getOrCreateSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["ID", "Timestamp", "Nome", "Email", "Luogo", "Testo", "Approvata"]);
  }
  return sheet;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(10000); } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Server occupato."})).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var p = e.parameter;
    if (p.honeypot && p.honeypot.length > 0) {
      return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Spam."})).setMimeType(ContentService.MimeType.JSON);
    }
    
    var email = p.email ? p.email.toLowerCase().trim() : "";
    var now = new Date();
    var id = "D-" + now.getTime();
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = getOrCreateSheet(ss);
    
    sheet.appendRow([
      id,
      Utilities.formatDate(now, "Europe/Rome", "dd/MM/yyyy HH:mm:ss"),
      p.nome,
      email,
      p.luogo || "",
      p.testo,
      "" // Approvata
    ]);
    
    try {
      var subject = "Nuova Dedica Rifugio Barrasso da " + p.nome;
      var body = "Nuova dedica ricevuta:\n\nNome: " + p.nome + "\nEmail: " + email + "\nLuogo: " + (p.luogo || "-") + "\nTesto: " + p.testo + "\n\nVai sul Foglio Google per approvarla (scrivendo SI nella colonna Approvata).";
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    } catch(err) {}

    return ContentService.createTextOutput(JSON.stringify({status: "success", message: "Dedica inviata"})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
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
      if (row[6] && row[6].toString().toUpperCase().trim() === "SI") {
        dediche.push({
          id: row[0],
          data: row[1],
          nome: row[2],
          luogo: row[4],
          testo: row[5]
        });
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: "success", data: dediche.reverse()})).setMimeType(ContentService.MimeType.JSON);
}