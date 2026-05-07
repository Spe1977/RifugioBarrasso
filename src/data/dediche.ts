export interface Dedica {
  /** Name or nickname of the author. */
  nome: string;
  /** Optional place of origin. */
  luogo: string;
  /** The dedication text. */
  testo: string;
  /** ISO date of the visit, e.g. "2026-02-14". */
  data: string;
  /** Post-it background colour keyword: "yellow" | "blue" | "green" | "pink". */
  colore: "yellow" | "blue" | "green" | "pink";
}

/**
 * Manually curated dedications approved for publication.
 * Add new entries here after reviewing submissions from Tally.
 */
export const dediche: Dedica[] = [
  {
    nome: "Marco e Luca",
    luogo: "",
    testo:
      "Salita dura sotto la tormenta, ma il calore di questo bivacco ci ha rimesso al mondo. Grazie Majella!",
    data: "2026-02-14",
    colore: "yellow",
  },
  {
    nome: "Sara",
    luogo: "Roma",
    testo:
      "Un pensiero speciale a Paolo Barrasso. Sentire l'ululato stanotte dalla finestra lassù è stata un'emozione indescrivibile.",
    data: "2026-03-08",
    colore: "blue",
  },
  {
    nome: "Famiglia Di Lizio",
    luogo: "",
    testo:
      "Abbiamo spazzato e lasciato un po' di legna secca vicino alla stufa per i prossimi che saliranno. Viva gli Amici del Barrasso!",
    data: "2026-04-21",
    colore: "green",
  },
];
