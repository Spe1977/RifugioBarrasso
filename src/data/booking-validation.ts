import { bookingConfig } from "./site";

export interface BookingFormData {
  tipo_richiesta: string;
  form_version: string;
  page_url: string;
  submitted_at_client: string;
  lingua: string;
  nome: string;
  data_nascita: string;
  luogo_nascita: string;
  numero_documento: string;
  email: string;
  telefono: string;
  data_arrivo: string;
  data_partenza: string;
  notti: number;
  persone: number;
  elenco_partecipanti: string;
  attivita_prevista: string;
  note: string;
  accettazione_regole: string;
  accettazione_contributo: string;
  presa_visione_responsabilita: string;
  accettazione_privacy: string;
  consenso_ricontatto: string;
  honeypot: string;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePersone(
  n: number,
  max = bookingConfig.maxPersone,
): boolean {
  return !isNaN(n) && n >= 1 && n <= max;
}

export function validateNotti(
  n: number,
  max = bookingConfig.maxNotti,
): boolean {
  return !isNaN(n) && n >= 1 && n <= max;
}

export function validateDataArrivo(dataIso: string): boolean {
  if (!dataIso) return false;
  const d = new Date(dataIso + "T00:00:00");
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

export function validateDataPartenza(
  dataArrivoIso: string,
  dataPartenzaIso: string,
): boolean {
  if (!dataArrivoIso || !dataPartenzaIso) return false;
  const dA = new Date(dataArrivoIso + "T00:00:00");
  const dP = new Date(dataPartenzaIso + "T00:00:00");
  if (isNaN(dA.getTime()) || isNaN(dP.getTime())) return false;
  return dP > dA;
}

export function validateBookingPayload(
  data: Partial<BookingFormData>,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.nome?.trim()) {
    errors.nome = "Nome e cognome obbligatorio.";
  }

  if (!data.data_nascita?.trim()) {
    errors.data_nascita = "Data di nascita obbligatoria.";
  }

  if (!data.luogo_nascita?.trim()) {
    errors.luogo_nascita = "Luogo di nascita obbligatorio.";
  }

  if (!data.numero_documento?.trim()) {
    errors.numero_documento = "Numero documento obbligatorio.";
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = "Email non valida.";
  }

  if (!data.telefono?.trim()) {
    errors.telefono = "Telefono obbligatorio.";
  }

  if (!data.data_arrivo || !validateDataArrivo(data.data_arrivo)) {
    errors.data_arrivo = "Data arrivo non valida o nel passato.";
  }

  if (
    !data.data_partenza ||
    !validateDataPartenza(data.data_arrivo || "", data.data_partenza)
  ) {
    errors.data_partenza = "Data partenza non valida o precedente all'arrivo.";
  }

  const notti = Number(data.notti);
  if (!validateNotti(notti)) {
    errors.notti = `Numero notti tra 1 e ${bookingConfig.maxNotti}.`;
  }

  const persone = Number(data.persone);
  if (!validatePersone(persone)) {
    errors.persone = `Numero persone tra 1 e ${bookingConfig.maxPersone}.`;
  }

  if (!data.elenco_partecipanti?.trim()) {
    errors.elenco_partecipanti = "Elenco partecipanti obbligatorio.";
  }

  if (!data.attivita_prevista?.trim()) {
    errors.attivita_prevista = "Attività prevista obbligatoria.";
  }

  if (data.accettazione_regole !== "sì") {
    errors.accettazione_regole = "Devi accettare le regole.";
  }
  if (data.accettazione_contributo !== "sì") {
    errors.accettazione_contributo = "Devi prendere visione del contributo.";
  }
  if (data.presa_visione_responsabilita !== "sì") {
    errors.presa_visione_responsabilita =
      "Devi prendere visione delle responsabilità.";
  }
  if (data.accettazione_privacy !== "sì") {
    errors.accettazione_privacy = "Devi accettare la privacy.";
  }
  if (data.consenso_ricontatto !== "sì") {
    errors.consenso_ricontatto = "Devi acconsentire al ricontatto.";
  }

  if (data.honeypot && data.honeypot.trim() !== "") {
    errors.honeypot = "Invio rifiutato.";
  }

  return errors;
}

export function buildBookingPayload(
  formData: FormData,
): Partial<BookingFormData> {
  return {
    tipo_richiesta: (formData.get("tipo_richiesta") as string) || "",
    form_version: (formData.get("form_version") as string) || "",
    page_url: (formData.get("page_url") as string) || "",
    submitted_at_client: (formData.get("submitted_at_client") as string) || "",
    lingua: (formData.get("lingua") as string) || "it",
    nome: (formData.get("nome") as string) || "",
    data_nascita: (formData.get("data_nascita") as string) || "",
    luogo_nascita: (formData.get("luogo_nascita") as string) || "",
    numero_documento: (formData.get("numero_documento") as string) || "",
    email: (formData.get("email") as string) || "",
    telefono: (formData.get("telefono") as string) || "",
    data_arrivo: (formData.get("data_arrivo") as string) || "",
    data_partenza: (formData.get("data_partenza") as string) || "",
    notti: parseInt((formData.get("notti") as string) || "0", 10),
    persone: parseInt((formData.get("persone") as string) || "0", 10),
    elenco_partecipanti: (formData.get("elenco_partecipanti") as string) || "",
    attivita_prevista: (formData.get("attivita_prevista") as string) || "",
    note: (formData.get("note") as string) || "",
    accettazione_regole: (formData.get("accettazione_regole") as string) || "",
    accettazione_contributo:
      (formData.get("accettazione_contributo") as string) || "",
    presa_visione_responsabilita:
      (formData.get("presa_visione_responsabilita") as string) || "",
    accettazione_privacy:
      (formData.get("accettazione_privacy") as string) || "",
    consenso_ricontatto: (formData.get("consenso_ricontatto") as string) || "",
    honeypot: (formData.get("honeypot") as string) || "",
  };
}
