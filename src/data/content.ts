import { bookingConfig, site } from "./site";

export const homeHighlights = [
  {
    title: "Locale bivacco sempre aperto",
    text: "Tavolo, panche e camino restano a disposizione di chi cerca riparo, senza prenotazione.",
  },
  {
    title: "Locale chiuso su richiesta",
    text: `Prenotabile per massimo ${bookingConfig.maxNotti} notti, dopo conferma da parte del gestore.`,
  },
  {
    title: "Cura condivisa",
    text: "Chi sale al Barrasso lascia il rifugio pulito, chiuso e pronto per chi arriverà dopo.",
  },
];

export const historyTimeline = [
  {
    date: "1935-1940",
    title: "Le origini del casotto",
    text: "Il rifugio viene costruito dal Comune di Caramanico Terme su terreno comunale come stazzo pastorale per le greggi al Prato della Corte.",
  },
  {
    date: "Anni 70-80",
    title: "La lunga chiusura",
    text: "La struttura, conosciuta dai caramanichesi come il casotto, resta chiusa per un lungo periodo.",
  },
  {
    date: "1992",
    title: "Il nome di Paolo Barrasso",
    text: "Dopo la ristrutturazione comunale, il rifugio viene intitolato a Paolo Barrasso, biologo del Corpo Forestale dello Stato scomparso sul Morrone nel 1991.",
  },
  {
    date: "Fino al 2019",
    title: "Gli anni del CAI",
    text: "Il CAI di Pescara gestisce il rifugio come bivacco e Capanna Sociale: locale aperto per tutti, locale chiuso accessibile con chiave ai soci CAI.",
  },
  {
    date: "2020-2024",
    title: "Chiusura e attesa",
    text: "Il rifugio resta chiuso fino alla nuova ristrutturazione del Comune di Caramanico Terme.",
  },
  {
    date: "Settembre 2024",
    title: "La ristrutturazione",
    text: "Vengono sistemati esterni, panche, staccionate, infissi rossi, interni, mobilia, guaina del tetto, camino e canna fumaria.",
  },
  {
    date: "21 febbraio 2025",
    title: "La nuova gestione",
    text: "La gestione passa all'Associazione Amici del Barrasso con concessione di 6 anni; il locale chiuso diventa richiedibile online da tutti.",
  },
];

export const bookingSteps = [
  "Compila il modulo di richiesta online.",
  "Attendi la conferma di disponibilità dal soggetto gestore.",
  `Versa il contributo di ${bookingConfig.contributoGiornalieroPersona} euro al giorno per persona al ritiro della chiave.`,
  `Ritira la chiave presso ${bookingConfig.ritiroChiavi.nome} in ${bookingConfig.ritiroChiavi.indirizzo}.`,
];

export const rules = [
  "Il locale bivacco con tavolo, panche e camino è sempre aperto e non richiede prenotazione.",
  "Il locale chiuso è utilizzabile solo dopo conferma della richiesta.",
  `Il locale chiuso può essere richiesto per massimo ${bookingConfig.maxNotti} notti.`,
  "Chi usa il locale chiuso non può riservare in esclusiva il locale bivacco.",
];

export const responsibilities = [
  "Mantenere buone condizioni igienico-sanitarie del rifugio e delle sue pertinenze.",
  "Usare rifugio e attrezzature con diligenza e cura.",
  "Gestire correttamente la legna da ardere.",
  "Lasciare il rifugio ordinato, pulito e pronto per altri escursionisti.",
];

export const galleryImages = [
  "Foto da Leonardo.jpg",
  "Foto da Leonardo(1).jpg",
  "Foto da Leonardo(2).jpg",
  "Foto da Leonardo(3).jpg",
  "Foto da Leonardo(4).jpg",
  "Foto da Leonardo(5).jpg",
  "Foto da Leonardo(6).jpg",
  "Foto da Leonardo(7).jpg",
  "Foto da Leonardo(8).jpg",
  "Foto da Leonardo(9).jpg",
  "Foto da Leonardo(10).jpg",
  "Foto da Leonardo(11).jpg",
  "Foto da Leonardo(12).jpg",
  "Foto da Leonardo(13).jpg",
  "Foto da Leonardo(14).jpg",
  "Foto da Leonardo(15).jpg",
  "Foto da Leonardo(16).jpg",
];

/** Re-exported from the canonical dediche data file. */
export { dediche } from "./dediche";

export const pageMeta = {
  home: {
    title: `${site.name} | Maiella`,
    description:
      "Sito ufficiale del Rifugio Paolo Barrasso, sulle pendici del Monte Rapina nel Parco Nazionale della Maiella.",
  },
  storia: {
    title: `Storia | ${site.name}`,
    description:
      "La storia del casotto, di Paolo Barrasso e della nuova gestione del rifugio.",
  },
  galleria: {
    title: `Galleria | ${site.name}`,
    description: "Foto e immagini del Rifugio Paolo Barrasso e della Maiella.",
  },
  prenotazioni: {
    title: `Prenotazioni | ${site.name}`,
    description:
      "Regole, disponibilità e richiesta di utilizzo del locale chiuso del rifugio.",
  },
  quaderno: {
    title: `Quaderno del Rifugio | ${site.name}`,
    description:
      "Dediche e pensieri dei viandanti, pubblicati dopo moderazione.",
  },
  eventi: {
    title: `Eventi | ${site.name}`,
    description:
      "Ciaspolate, escursioni, aperture speciali e appuntamenti del rifugio.",
  },
  info: {
    title: `Info e Regole | ${site.name}`,
    description:
      "Informazioni ufficiali, regole di utilizzo e contatti del Rifugio Paolo Barrasso.",
  },
  privacy: {
    title: `Privacy | ${site.name}`,
    description:
      "Informativa privacy per richieste di prenotazione e dediche del rifugio.",
  },
};
