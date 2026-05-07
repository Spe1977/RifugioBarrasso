export interface SiteEvent {
  /** When true the event details are shown; when false a rest message appears. */
  active: boolean;
  title: string;
  date: string;
  description: string;
  /** Path relative to /assets/images/ or empty string. */
  image: string;
  /** If true, the event page shows a booking CTA. */
  bookingEnabled: boolean;
  /** Sent as `nome_evento` in the booking payload when bookingEnabled is true. */
  eventName: string;
}

/**
 * Current or next event. Set `active: true` and fill in the details
 * when an event is scheduled.  Set `active: false` during rest periods.
 */
export const currentEvent: SiteEvent = {
  active: false,
  title: "",
  date: "",
  description: "",
  image: "",
  bookingEnabled: false,
  eventName: "",
};
