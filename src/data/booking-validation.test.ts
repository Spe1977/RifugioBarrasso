import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePersone,
  validateNotti,
  validateDataArrivo,
  validateDataPartenza,
  validateBookingPayload,
  buildBookingPayload,
} from "./booking-validation";

describe("booking validation", () => {
  describe("validateEmail", () => {
    it("accepts valid emails", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("name.surname@domain.co.uk")).toBe(true);
    });
    it("rejects invalid emails", () => {
      expect(validateEmail("test@example")).toBe(false);
      expect(validateEmail("not-an-email")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });
  });

  describe("validatePersone", () => {
    it("accepts values between 1 and 8", () => {
      expect(validatePersone(1)).toBe(true);
      expect(validatePersone(4)).toBe(true);
      expect(validatePersone(8)).toBe(true);
    });
    it("rejects out of bounds", () => {
      expect(validatePersone(0)).toBe(false);
      expect(validatePersone(9)).toBe(false);
    });
    it("rejects NaN", () => {
      expect(validatePersone(NaN)).toBe(false);
    });
  });

  describe("validateNotti", () => {
    it("accepts values between 1 and 2", () => {
      expect(validateNotti(1)).toBe(true);
      expect(validateNotti(2)).toBe(true);
    });
    it("rejects out of bounds", () => {
      expect(validateNotti(0)).toBe(false);
      expect(validateNotti(3)).toBe(false);
    });
  });

  describe("validateDataArrivo", () => {
    it("accepts today", () => {
      const today = new Date().toISOString().split("T")[0];
      expect(validateDataArrivo(today)).toBe(true);
    });
    it("accepts a future date", () => {
      expect(validateDataArrivo("2099-12-31")).toBe(true);
    });
    it("rejects a past date", () => {
      expect(validateDataArrivo("2020-01-01")).toBe(false);
    });
    it("rejects an invalid string", () => {
      expect(validateDataArrivo("not-a-date")).toBe(false);
    });
  });

  describe("validateDataPartenza", () => {
    it("accepts departure after arrival", () => {
      expect(validateDataPartenza("2099-12-01", "2099-12-02")).toBe(true);
    });
    it("rejects departure before arrival", () => {
      expect(validateDataPartenza("2099-12-02", "2099-12-01")).toBe(false);
    });
    it("rejects departure same as arrival", () => {
      expect(validateDataPartenza("2099-12-01", "2099-12-01")).toBe(false);
    });
  });

  describe("validateBookingPayload", () => {
    const validData = {
      nome: "Mario Rossi",
      data_nascita: "1980-01-01",
      email: "mario@example.com",
      telefono: "3331234567",
      data_arrivo: "2099-12-01",
      data_partenza: "2099-12-03",
      notti: 2,
      persone: 4,
      elenco_partecipanti: "Mario Rossi, Luigi Bianchi",
      attivita_prevista: "Solo escursione",
      note: "",
      accettazione_regole: "sì",
      accettazione_contributo: "sì",
      presa_visione_responsabilita: "sì",
      accettazione_privacy: "sì",
      consenso_ricontatto: "sì",
      honeypot: "",
    };

    it("validates a correct form", () => {
      const errors = validateBookingPayload(validData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("rejects when nome is empty", () => {
      const errors = validateBookingPayload({ ...validData, nome: "" });
      expect(errors.nome).toBeDefined();
    });

    it("rejects when email is invalid", () => {
      const errors = validateBookingPayload({ ...validData, email: "bad" });
      expect(errors.email).toBeDefined();
    });

    it("rejects when honeypot is filled", () => {
      const errors = validateBookingPayload({ ...validData, honeypot: "spam" });
      expect(errors.honeypot).toBeDefined();
    });

    it("collects multiple errors at once", () => {
      const errors = validateBookingPayload({
        ...validData,
        nome: "",
        email: "bad",
        notti: 5,
        persone: 10,
        elenco_partecipanti: "",
      });
      expect(Object.keys(errors)).toHaveLength(5);
      expect(errors.nome).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.notti).toBeDefined();
      expect(errors.persone).toBeDefined();
      expect(errors.elenco_partecipanti).toBeDefined();
    });
  });

  describe("buildBookingPayload", () => {
    it("produces the expected payload shape", () => {
      // Mock FormData
      const formData = new Map();
      formData.set("nome", "Mario Rossi");
      formData.set("data_nascita", "1980-01-01");
      formData.set("email", "mario@example.com");
      formData.set("notti", "2");
      formData.set("persone", "4");

      const mockFormData = {
        get: (key: string) => formData.get(key) || null,
        has: (key: string) => formData.has(key),
      } as unknown as FormData;

      const payload = buildBookingPayload(mockFormData);

      expect(payload.nome).toBe("Mario Rossi");
      expect(payload.notti).toBe(2);
      expect(payload.persone).toBe(4);
      expect(payload.data_nascita).toBe("1980-01-01");
    });
  });
});
