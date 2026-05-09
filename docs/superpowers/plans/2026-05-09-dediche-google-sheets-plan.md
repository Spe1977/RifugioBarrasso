# Dediche Google Sheets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sostituire Tally con un form integrato in Astro e un backend Google Apps Script per la gestione, moderazione e pubblicazione dinamica delle dediche.
**Architecture:** Creeremo un componente form in Astro, un Apps Script per gestire POST/GET su Google Sheets, e aggiorneremo la pagina Quaderno per caricare le dediche via API e renderizzarle a client.
**Tech Stack:** Astro, Google Apps Script, Vanilla JS, Tailwind CSS.

---

### Task 1: Configurazione Backend Apps Script

**Files:**

- Create: `apps-script/dediche-handler.gs`
- Modify: `.env.example:10-15`

- [ ] **Step 1: Creare il file dello script backend**
      Creiamo lo script base che gestirà POST (inserimento) e GET (lettura).

```javascript
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
    sheet.appendRow([
      "ID",
      "Timestamp",
      "Nome",
      "Email",
      "Luogo",
      "Testo",
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
    var p = e.parameter;
    if (p.honeypot && p.honeypot.length > 0) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Spam." }),
      ).setMimeType(ContentService.MimeType.JSON);
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
      "", // Approvata
    ]);

    try {
      var subject = "Nuova Dedica Rifugio Barrasso da " + p.nome;
      var body =
        "Nuova dedica ricevuta:\n\nNome: " +
        p.nome +
        "\nEmail: " +
        email +
        "\nLuogo: " +
        (p.luogo || "-") +
        "\nTesto: " +
        p.testo +
        "\n\nVai sul Foglio Google per approvarla (scrivendo SI nella colonna Approvata).";
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    } catch (err) {}

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Dedica inviata" }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() }),
    ).setMimeType(ContentService.MimeType.JSON);
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
          testo: row[5],
        });
      }
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: "success", data: dediche.reverse() }),
  ).setMimeType(ContentService.MimeType.JSON);
}
```

- [ ] **Step 2: Aggiornare .env.example**
      Aggiungiamo la variabile per l'endpoint API.

```bash
echo -e "\n# Endpoint per le dediche (Apps Script)\nPUBLIC_DEDICHE_ENDPOINT=\n" >> .env.example
```

- [ ] **Step 3: Commit**

```bash
git add apps-script/dediche-handler.gs .env.example
git commit -m "feat: add Google Apps Script backend for dediche"
```

---

### Task 2: Creazione del Componente DedicaForm in Astro

**Files:**

- Create: `src/components/DedicaForm.astro`

- [ ] **Step 1: Scrivere il componente Astro**
      Creiamo il form. L'email è normalizzata via JS sul submit (lower case e trim).

```astro
---
const endpoint = import.meta.env.PUBLIC_DEDICHE_ENDPOINT || "";
---

<div id="dedica-form-container">
  {
    endpoint ? (
      <form class="grid gap-6" id="dedica-form" novalidate>
        <input
          class="hidden"
          type="text"
          name="honeypot"
          tabindex="-1"
          autocomplete="off"
        />
        <div class="grid gap-5 md:grid-cols-2">
          <label class="grid gap-2 text-sm font-bold text-majella-green">
            Nome (o Nickname) *
            <input
              class="rounded-md border border-majella-green/18 bg-white px-4 py-3 font-normal text-majella-darkstone"
              name="nome"
              required
            />
            <span
              class="hidden text-xs font-normal text-majella-red"
              data-error="nome"
            >
              Campo obbligatorio
            </span>
          </label>

          <label class="grid gap-2 text-sm font-bold text-majella-green">
            Indirizzo Email * (solo per comunicazioni, non pubblicato)
            <input
              class="rounded-md border border-majella-green/18 bg-white px-4 py-3 font-normal text-majella-darkstone"
              type="email"
              name="email"
              required
            />
            <span
              class="hidden text-xs font-normal text-majella-red"
              data-error="email"
            >
              Email non valida
            </span>
          </label>

          <label class="grid gap-2 text-sm font-bold text-majella-green md:col-span-2">
            Città / Luogo (opzionale)
            <input
              class="rounded-md border border-majella-green/18 bg-white px-4 py-3 font-normal text-majella-darkstone"
              name="luogo"
            />
          </label>

          <label class="grid gap-2 text-sm font-bold text-majella-green md:col-span-2">
            La tua Dedica *
            <textarea
              class="rounded-md border border-majella-green/18 bg-white px-4 py-3 font-normal text-majella-darkstone min-h-[120px]"
              name="testo"
              required
            />
            <span
              class="hidden text-xs font-normal text-majella-red"
              data-error="testo"
            >
              Campo obbligatorio
            </span>
          </label>
        </div>

        <div class="mt-4">
          <button
            type="submit"
            class="inline-flex items-center gap-3 rounded-full bg-majella-red px-7 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-red-800 disabled:opacity-50"
          >
            Invia Dedica
          </button>
        </div>
        <div
          id="form-feedback"
          class="hidden rounded-md p-4 text-sm font-bold"
        />
      </form>
    ) : (
      <div class="border-l-4 border-majella-red bg-white p-6 leading-8 text-gray-700 shadow-soft">
        Il modulo sarà disponibile a breve.
      </div>
    )
  }
</div>

<script define:vars={{ endpoint }}>
  const form = document.getElementById("dedica-form");
  const feedback = document.getElementById("form-feedback");
  const btn = form?.querySelector('button[type="submit"]');

  if (form && endpoint) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      // Normalizzazione email
      const emailInput = formData.get("email");
      if (emailInput) {
        formData.set("email", emailInput.toString().trim().toLowerCase());
      }

      // Validazione basica
      let hasErrors = false;
      ["nome", "email", "testo"].forEach((field) => {
        const val = formData.get(field);
        const errSpan = form.querySelector(`[data-error="${field}"]`);
        if (!val || (field === "email" && !val.includes("@"))) {
          errSpan.classList.remove("hidden");
          hasErrors = true;
        } else {
          errSpan.classList.add("hidden");
        }
      });

      if (hasErrors) return;

      btn.disabled = true;
      btn.textContent = "Invio in corso...";

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.status === "success") {
          form.reset();
          feedback.textContent =
            "Grazie! La tua dedica è stata inviata e sarà pubblicata dopo la revisione.";
          feedback.className =
            "mt-4 rounded-md p-4 text-sm font-bold bg-green-100 text-green-800 block";
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        feedback.textContent = "Si è verificato un errore. Riprova più tardi.";
        feedback.className =
          "mt-4 rounded-md p-4 text-sm font-bold bg-red-100 text-red-800 block";
      } finally {
        btn.disabled = false;
        btn.textContent = "Invia Dedica";
      }
    });
  }
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DedicaForm.astro
git commit -m "feat: create DedicaForm component with API submission"
```

---

### Task 3: Modifica Pagina Quaderno e Rendering Dinamico

**Files:**

- Modify: `src/pages/quaderno-del-rifugio/index.astro:2-60`

- [ ] **Step 1: Aggiornare layout pagina**
      Sostituire TallyEmbed con DedicaForm e predisporre un container vuoto per l'iniezione JS dei post-it al posto della griglia generata a build time.

Sostituire nel file `src/pages/quaderno-del-rifugio/index.astro`:

```astro
---
import PageHero from "@components/PageHero.astro";
import SectionHeading from "@components/SectionHeading.astro";
import DedicaForm from "@components/DedicaForm.astro";
import BaseLayout from "@layouts/BaseLayout.astro";
import { pageMeta } from "@data/content";
import { site } from "@data/site";

const endpoint = import.meta.env.PUBLIC_DEDICHE_ENDPOINT || "";
---

<BaseLayout
  title={pageMeta.quaderno.title}
  description={pageMeta.quaderno.description}
>
  <PageHero
    eyebrow="Quaderno del Rifugio"
    title="Tracce dei viandanti"
    lead="Pensieri, ricordi e dediche di chi è passato dal Barrasso. Pubblicate solo dopo consenso e moderazione."
  />

  <section class="paper-surface py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Messaggi approvati"
        title="Voci dalla montagna"
        lead={`Le notifiche delle nuove dediche arrivano a ${site.operativeEmail}. Solo quelle approvate compaiono qui.`}
      />

      <div id="dediche-grid" class="grid gap-6 md:grid-cols-3">
        <!-- Spinner di caricamento -->
        <p
          class="col-span-full text-lg leading-8 text-gray-600"
          id="dediche-loading"
        >
          Caricamento dediche in corso...
        </p>
      </div>
    </div>
  </section>

  <section class="bg-white py-20">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Scrivi"
        title="Lascia la tua dedica"
        lead="Il tuo messaggio sarà letto dal gestore e, se approvato, pubblicato su questa bacheca."
      />
      <DedicaForm />
    </div>
  </section>
</BaseLayout>

<script define:vars={{ endpoint }}>
  const grid = document.getElementById("dediche-grid");
  const loading = document.getElementById("dediche-loading");
  const colors = [
    "bg-[#fff8b8] border-yellow-200",
    "bg-[#eef7fa] border-blue-200",
    "bg-[#f2f8ec] border-green-200",
    "bg-[#fce4ec] border-pink-200",
  ];
  const rotations = ["-rotate-2", "rotate-3", "-rotate-1", "rotate-2"];

  async function loadDediche() {
    if (!endpoint) {
      loading.textContent = "Configurazione API mancante.";
      return;
    }

    try {
      const res = await fetch(endpoint);
      const result = await res.json();

      if (result.status === "success" && result.data.length > 0) {
        grid.innerHTML = ""; // Rimuove loading

        result.data.forEach((item, index) => {
          const colorClass = colors[index % colors.length];
          const rotationClass = rotations[index % rotations.length];
          const translationClass = index % 3 === 1 ? "md:translate-y-6" : "";

          const article = document.createElement("article");
          article.className = `${colorClass} border p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1 ${rotationClass} ${translationClass}`;

          const text = document.createElement("p");
          text.className =
            "font-handwriting text-xl leading-snug text-majella-green md:text-2xl md:leading-relaxed";
          text.textContent = `"${item.testo}"`;

          const meta = document.createElement("p");
          meta.className =
            "mt-6 flex flex-col justify-between sm:flex-row sm:items-end";

          const author = document.createElement("span");
          author.className =
            "text-sm font-black uppercase tracking-widest text-majella-red";
          author.textContent = item.luogo
            ? `${item.nome} (${item.luogo})`
            : item.nome;

          const date = document.createElement("span");
          date.className = "mt-2 text-xs font-bold text-majella-green sm:mt-0";
          // L'Apps script invia la data come dd/MM/yyyy HH:mm:ss o simile. Qui semplifichiamo stampandola.
          date.textContent = item.data.split(" ")[0] || item.data;

          meta.appendChild(author);
          meta.appendChild(date);
          article.appendChild(text);
          article.appendChild(meta);
          grid.appendChild(article);
        });
      } else {
        loading.textContent = "Nessuna dedica pubblicata ancora. Sii il primo!";
      }
    } catch (e) {
      loading.textContent = "Errore nel caricamento delle dediche.";
    }
  }

  loadDediche();
</script>
```

- [ ] **Step 2: Cleanup componenti deprecati**
      Eliminiamo TallyEmbed.

```bash
rm src/components/TallyEmbed.astro
git add src/pages/quaderno-del-rifugio/index.astro src/components/TallyEmbed.astro
git commit -m "feat: render dediche from API and replace Tally with custom form"
```
