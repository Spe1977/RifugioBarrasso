/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Google Apps Script Web App URL for booking form submissions. */
  readonly PUBLIC_BOOKING_ENDPOINT: string;
  /** Google Calendar embed iframe URL (free/busy view). */
  readonly PUBLIC_GOOGLE_CALENDAR_EMBED_URL: string;
  /** Tally form ID for the guestbook / dedications form. */
  readonly PUBLIC_TALLY_FORM_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
