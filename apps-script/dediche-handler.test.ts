import { readFileSync } from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

type DedicheRow = [
  timestamp: Date | string,
  nome: string,
  email: string,
  luogo: string,
  testo: string,
  consenso: string,
];

type DedicheHandlerContext = {
  doPost: (event: { parameter: Record<string, string> }) => unknown;
  validateDedica: (payload: Record<string, string>) => string[];
  checkDedicheRateLimit: (
    sheet: FakeDedicheSheet,
    payload: { email: string },
    now: Date,
  ) => string;
  normalizeEmail: (value: string) => string;
  toSheetText: (value: unknown) => string;
};

class FakeDedicheSheet {
  constructor(private readonly rows: DedicheRow[]) {}

  getLastRow() {
    return this.rows.length + 1;
  }

  getRange() {
    return {
      getValues: () => this.rows,
    };
  }
}

const loadDedicheHandler = () => {
  const source = readFileSync(
    new URL("./dediche-handler.gs", import.meta.url),
    "utf8",
  );
  const context = vm.createContext({});

  vm.runInContext(source, context);

  return context as unknown as DedicheHandlerContext;
};

const loadDedicheHandlerWithGoogleFakes = (sheet: {
  appendRow: (row: unknown[]) => void;
  getLastRow: () => number;
  getRange: (...args: unknown[]) => unknown;
}) => {
  const source = readFileSync(
    new URL("./dediche-handler.gs", import.meta.url),
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

  return context as unknown as DedicheHandlerContext;
};

const makeRow = ({
  timestamp = "08/05/2026 10:00:00",
  email = "ospite@example.com",
}: {
  timestamp?: Date | string;
  email?: string;
} = {}): DedicheRow => [
  timestamp,
  "Mario",
  email,
  "Roma",
  "Bella salita",
  "SI",
];

describe("Apps Script dediche validation", () => {
  const handler = loadDedicheHandler();

  it("requires name, valid email, text, and publication consent", () => {
    expect(handler.validateDedica({})).toEqual([
      "Nome obbligatorio",
      "Email non valida",
      "Dedica obbligatoria",
      "Consenso pubblicazione obbligatorio",
    ]);
  });

  it("accepts a valid dedication payload", () => {
    expect(
      handler.validateDedica({
        nome: "Mario",
        email: "mario@example.com",
        testo: "Grazie per il rifugio",
        consenso: "on",
      }),
    ).toEqual([]);
  });
});

describe("Apps Script dediche sheet safety", () => {
  const handler = loadDedicheHandler();

  it("neutralizes formula-leading values before writing to Sheets", () => {
    expect(handler.toSheetText("=HYPERLINK('https://example.invalid')")).toBe(
      "'=HYPERLINK('https://example.invalid')",
    );
    expect(handler.toSheetText(" @cmd")).toBe("' @cmd");
  });

  it("writes formula-leading dedication fields as inert sheet text", () => {
    const rows: unknown[][] = [];
    const sheet = {
      appendRow: (row: unknown[]) => rows.push(row),
      getLastRow: () => rows.length + 1,
      getRange: () => ({
        getValues: () => [],
      }),
    };
    const googleHandler = loadDedicheHandlerWithGoogleFakes(sheet);

    googleHandler.doPost({
      parameter: {
        nome: "=HYPERLINK('https://example.invalid')",
        email: "ospite@example.com",
        luogo: "@formula",
        testo: "+testo",
        consenso: "on",
      },
    });

    expect(rows[0][2]).toBe("'=HYPERLINK('https://example.invalid')");
    expect(rows[0][4]).toBe("'@formula");
    expect(rows[0][5]).toBe("'+testo");
  });
});

describe("Apps Script dediche rate limiting", () => {
  const handler = loadDedicheHandler();
  const now = new Date("2026-05-08T12:00:00");

  it("blocks the fourth request from the same normalized email in 24 hours", () => {
    const sheet = new FakeDedicheSheet([
      makeRow({ email: "ospite@example.com" }),
      makeRow({ email: " OSPITE@example.com " }),
      makeRow({ email: "ospite@example.com" }),
    ]);

    expect(
      handler.checkDedicheRateLimit(
        sheet,
        { email: "ospite@example.com" },
        now,
      ),
    ).toContain("questa email");
  });

  it("blocks the thirty-first global request in one hour", () => {
    const rows = Array.from({ length: 30 }, (_, index) =>
      makeRow({
        timestamp: "08/05/2026 11:30:00",
        email: `ospite-${index}@example.com`,
      }),
    );

    expect(
      handler.checkDedicheRateLimit(
        new FakeDedicheSheet(rows),
        { email: "nuovo@example.com" },
        now,
      ),
    ).toContain("ultima ora");
  });
});
