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
  { src: "025.jpg", width: 1200, height: 1600, orientation: "portrait" },
  { src: "017.jpg", width: 1200, height: 1600, orientation: "portrait" },
  { src: "016.jpg", width: 902, height: 1600, orientation: "portrait" },
  { src: "042.jpg", width: 3072, height: 4096, orientation: "portrait" },
  { src: "714.jpg", width: 4096, height: 3072, orientation: "landscape" },
];

export const excursionsAndSkiSections = [
  {
    season: "Estate",
    title: "Monte Rapina e Pescofalcone",
    imageBase: "36",
    imageFallback: "36-1200.jpg",
    imageAlt:
      "Escursionisti sui prati della Majella al tramonto vicino al Rifugio Paolo Barrasso",
    paragraphs: [
      "Il sentiero porta inizialmente in località Prato della Corte per poi inoltrarsi nel bosco.",
      "Successivamente si sbuca sulla cresta da dove sono visibili la Valle dell'Orfento, il Monte Cavallo e il Monte Focalone. Il tracciato continua salendo fino a scorgere all'orizzonte il limite della Piana della Rapina. L’escursione è in costante salita terminando sulla vetta del Monte Rapina da cui si può godere di ampi panorami.",
    ],
    moreInfoUrl:
      "https://www.caramanicotermenatura.it/it/vivi/gli-itinerari/i-sentieri-principali/Monte-Rapina-e-Pescofalcone-i76",
    moreInfoLabel: "Monte Rapina e Pescofalcone",
  },
  {
    season: "Inverno",
    title: "PESCO FALCONE 2657 MT. PER IL MONTE RAPINA",
    imageBase: "72",
    imageFallback: "72-1200.jpg",
    imageAlt: "Sci alpinisti sulla neve con vista sulle montagne della Majella",
    sections: [
      {
        title: "Salita",
        text: "Si inizia la salita dal bivio con la strada forestale per Guado S. Antonio, normalmente innevata e percorribile in auto solo a primavera inoltrata. Trascurando il suo tracciato, si aggira un colle sul lato nord, fino ad intercettare in una selletta la stessa strada forestale e raggiungere da qui la cresta nord ovest del M. Rapina. Arrivato sulla cresta, risalire fino all’altezza di una faggeta, alla cui base si trova il rifugio “Paolo Barrasso”. Dal rifugio, salire traversando in direzione est, per raggiungere la cresta nord ovest del M. Rapina che si affaccia sulla Valle dell’Orfento. Seguire quasi integralmente la cresta nord ovest, prestando attenzione alla possibilità di cornici, fino alla vetta del M. Rapina a 2273m. Dal lato nord della vetta, avanzare fino a raggiungere la cresta del M. Pesco Falcone. Dopo un primo tratto ripido, la pendenza della cresta diminuisce per aumentare di nuovo in prossimità di un roccione che si aggira sul lato destro. La salita termina presso alcune roccette dove la cresta nord ovest del Pesco Falcone si biforca attorno alla depressione di Rava Cupa, detta “Il Cucchiaio”.",
      },
      {
        title: "Discesa",
        text: "Dalle roccette scendere per qualche decina di metri, traversare verso destra fino ad entrare nella depressione. Percorrere il grande canale nel fondo seguendone l’ampia curva fino a quando si restringe in una gola fra due paretine rocciose dove termina il tratto sciabile. Rimettere le pelli e prendere appena dopo la gola, a sinistra, un sentiero che traversa a mezza costa, salendo in direzione ovest prestando attenzione alle possibili slavine, fino a sbucare dal bosco che ricopre la cresta nord ovest del M. Rapina all’altezza dell’intaglio di mezzo. Scendere infine fino a raggiungere la carrozzabile che porta a Guado S. Antonio.",
      },
    ],
    moreInfoUrl:
      "https://www.caramanicotermenatura.it/it/vivi/in-inverno/scialpinismo/Pesco-Falcone-m-2657-per-il-Monte-Rapina-sk102",
    moreInfoLabel: "Pesco Falcone m 2657 per il Monte Rapina",
    extraRoutes: [
      {
        title: "MONTE RAPINA 2027 MT.",
        sections: [
          {
            title: "Salita",
            text: "La salita inizia dal bivio con la strada forestale per Guado S. Antonio, normalmente innevata e percorribile in auto solo a primavera inoltrata. La strada forestale sale a mezza costa il versante ovest del rilievo, quindi piega decisamente a nord, tagliando per intero il versante occidentale del M.Rapina fino a Guado S. Antonio, dove è chiusa da una sbarra. Trascurando il suo tracciato, si aggira un colle sul lato nord, fino ad intercettare la stessa strada forestale in una selletta, e raggiungere da qui la cresta del M. Rapina. Arrivato sulla cresta, dovrai risalire fino all’altezza di una faggeta di forma circolare alla cui base si trova il rifugio “Paolo Barrasso”. Dal rifugio salire traversando in direzione est, per raggiungere la cresta nord ovest del M. Rapina che si affaccia sulla Valle dell’Orfento. Seguire quasi integralmente la cresta nord ovest e prestare attenzione alle possibili cornici fino alla vetta, simile ad un catino, del M. Rapina a 2027m.",
          },
          {
            title: "Discesa",
            text: "Dalla vetta del M. Rapina la prima parte della discesa può avvenire per un canale che scende direttamente verso il rifugio “Paolo Barrasso”, costeggiando la faggeta circolare sul lato nord, oppure per l’ampio Prato della Corte. Variante alla discesa dalla vetta, con direzione ovest, dalla cresta che guarda il versante del Morrone: scendere per 50m in un ripido canale e traversa verso destra sotto una prima fascia rocciosa. Continuare traversando, per costeggiare una seconda fascia di rocce e raggiungere un ampio costone che finisce sulla strada a sud del Colle della Tenda. Scendere infine lungo il costone prestando attenzione all’ultimo tratto della discesa che si svolge fra i pini di una zona di rimboschimento.",
          },
        ],
        moreInfoUrl:
          "https://www.caramanicotermenatura.it/it/vivi/in-inverno/scialpinismo/Monte-Rapina-m-2027-sk101",
        moreInfoLabel: "Monte Rapina m 2027",
      },
    ],
  },
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
  escursioniSci: {
    title: `Escursioni e Sci | ${site.name}`,
    description:
      "Proposte estive e invernali per vivere i sentieri e la neve intorno al Rifugio Paolo Barrasso.",
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
