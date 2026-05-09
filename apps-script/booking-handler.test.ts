import { readFileSync } from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

type SheetRow = [
  timestampServer: Date | string,
  lingua: string,
  tipoRichiesta: string,
  stato: string,
  nome: string,
  dataNascita: string,
  luogoNascita: string,
  numeroDocumento: string,
  email: string,
  telefono: string,
];

type BookingHandlerContext = {
  doPost: (event: { parameter: Record<string, string> }) => unknown;
  checkRateLimit: (
    sheet: FakeSheet,
    payload: { email: string; telefono: string },
    now: Date,
  ) => string;
  normalizeEmail: (value: string) => string;
  normalizePhone: (value: string) => string;
  toSheetText: (value: unknown) => string;
};

class FakeSheet {
  constructor(private readonly rows: SheetRow[]) {}

  getLastRow() {
    return this.rows.length + 1;
  }

  getRange() {
    return {
      getValues: () => this.rows,
    };
  }
}

const loadBookingHandler = () => {
  const source = readFileSync(
    new URL("./booking-handler.gs", import.meta.url),
    "utf8",
  );
  const context = vm.createContext({});

  vm.runInContext(source, context);

  return context as unknown as BookingHandlerContext;
};

const loadBookingHandlerWithGoogleFakes = (sheet: {
  appendRow: (row: unknown[]) => void;
  getLastRow: () => number;
  getRange: (...args: unknown[]) => unknown;
}) => {
  const source = readFileSync(
    new URL("./booking-handler.gs", import.meta.url),
    "utf8",
  );
  const context = vm.createContext({
    LockService: {
      getScriptLock: () => ({
        waitLock: () => undefined,
        releaseLock: () => undefined,
      }),
    },
    SpreadsheetApp: {
      openById: () => ({
        getSheetByName: () => sheet,
        insertSheet: () => sheet,
      }),
    },
    Utilities: {
      formatDate: () => "09/05/2026 12:00:00",
    },
    MailApp: {
      sendEmail: () => undefined,
    },
    ContentService: {
      MimeType: { JSON: "application/json" },
      createTextOutput: (body: string) => ({
        body,
        setMimeType() {
          return this;
        },
      }),
    },
  });

  vm.runInContext(source, context);

  return context as unknown as BookingHandlerContext;
};

const makeRow = ({
  timestamp = "08/05/2026 10:00:00",
  email = "ospite@example.com",
  telefono = "3401234567",
}: {
  timestamp?: Date | string;
  email?: string;
  telefono?: string;
} = {}): SheetRow => [
  timestamp,
  "it",
  "pernottamento",
  "nuova",
  "Mario Rossi",
  "1980-01-01",
  "Roma",
  "AX1234567",
  email,
  telefono,
];

describe("Apps Script booking rate limiting", () => {
  const handler = loadBookingHandler();
  const now = new Date("2026-05-08T12:00:00");

  it("normalizes email case and surrounding spaces", () => {
    expect(handler.normalizeEmail("  Mario.Rossi@Email.it ")).toBe(
      "mario.rossi@email.it",
    );
  });

  it("normalizes phone formatting and Italian prefixes", () => {
    expect(handler.normalizePhone("340.1234567")).toBe("3401234567");
    expect(handler.normalizePhone("340 123 4567")).toBe("3401234567");
    expect(handler.normalizePhone("+39 340-123-4567")).toBe("3401234567");
    expect(handler.normalizePhone("0039 340 1234567")).toBe("3401234567");
  });

  it("blocks the fourth request from the same normalized email in 24 hours", () => {
    const sheet = new FakeSheet([
      makeRow({ email: "ospite@example.com" }),
      makeRow({ email: " OSPITE@example.com " }),
      makeRow({ email: "ospite@example.com" }),
    ]);

    expect(
      handler.checkRateLimit(
        sheet,
        { email: "ospite@example.com", telefono: "3490000000" },
        now,
      ),
    ).toContain("questa email");
  });

  it("blocks the fourth request from the same normalized phone in 24 hours", () => {
    const sheet = new FakeSheet([
      makeRow({ telefono: "340.1234567" }),
      makeRow({ telefono: "+39 340 1234567" }),
      makeRow({ telefono: "0039-340-1234567" }),
    ]);

    expect(
      handler.checkRateLimit(
        sheet,
        { email: "altro@example.com", telefono: "3401234567" },
        now,
      ),
    ).toContain("questo numero di telefono");
  });

  it("blocks the thirty-first global request in one hour", () => {
    const rows = Array.from({ length: 30 }, (_, index) =>
      makeRow({
        timestamp: "08/05/2026 11:30:00",
        email: `ospite-${index}@example.com`,
        telefono: `34000000${String(index).padStart(2, "0")}`,
      }),
    );

    expect(
      handler.checkRateLimit(
        new FakeSheet(rows),
        { email: "nuovo@example.com", telefono: "3490000000" },
        now,
      ),
    ).toContain("ultima ora");
  });

  it("ignores matching email and phone rows older than 24 hours", () => {
    const oldTimestamp = "07/05/2026 10:00:00";
    const sheet = new FakeSheet([
      makeRow({ timestamp: oldTimestamp }),
      makeRow({ timestamp: oldTimestamp }),
      makeRow({ timestamp: oldTimestamp }),
    ]);

    expect(
      handler.checkRateLimit(
        sheet,
        { email: "ospite@example.com", telefono: "3401234567" },
        now,
      ),
    ).toBe("");
  });
});

describe("Apps Script booking sheet safety", () => {
  const handler = loadBookingHandler();

  it("neutralizes formula-leading values before writing to Sheets", () => {
    expect(handler.toSheetText("=HYPERLINK('https://example.invalid')")).toBe(
      "'=HYPERLINK('https://example.invalid')",
    );
    expect(handler.toSheetText(" +SUM(1,2)")).toBe("' +SUM(1,2)");
    expect(handler.toSheetText("-10+20")).toBe("'-10+20");
    expect(handler.toSheetText("@cmd")).toBe("'@cmd");
  });

  it("leaves ordinary text unchanged", () => {
    expect(handler.toSheetText("Mario Rossi")).toBe("Mario Rossi");
    expect(handler.toSheetText("")).toBe("");
    expect(handler.toSheetText(null)).toBe("");
  });

  it("writes formula-leading booking fields as inert sheet text", () => {
    const rows: unknown[][] = [];
    const sheet = {
      appendRow: (row: unknown[]) => rows.push(row),
      getLastRow: () => rows.length + 1,
      getRange: () => ({
        getValues: () => [],
        setValue: () => undefined,
      }),
    };
    const googleHandler = loadBookingHandlerWithGoogleFakes(sheet);

    googleHandler.doPost({
      parameter: {
        nome: "=HYPERLINK('https://example.invalid')",
        data_nascita: "1980-01-01",
        luogo_nascita: "Roma",
        numero_documento: "AX1234567",
        email: "ospite@example.com",
        telefono: "3401234567",
        persone: "1",
        elenco_partecipanti: "+Mario Rossi",
        data_arrivo: "2026-06-01",
        notti: "1",
        data_partenza: "2026-06-02",
        attivita_prevista: "Solo escursione",
        accettazione_regole: "sì",
        accettazione_contributo: "sì",
        presa_visione_responsabilita: "sì",
        accettazione_privacy: "sì",
        consenso_ricontatto: "sì",
      },
    });

    expect(rows[0][5]).toBe("'=HYPERLINK('https://example.invalid')");
    expect(rows[0][12]).toBe("'+Mario Rossi");
  });
});
