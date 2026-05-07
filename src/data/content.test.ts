import { describe, expect, it } from "vitest";
import { bookingConfig, navigation, site } from "./site";
import { historyTimeline, rules } from "./content";
import { currentEvent } from "./events";
import { dediche } from "./dediche";

describe("site content", () => {
  it("keeps booking limits aligned with the technical specification", () => {
    expect(bookingConfig.maxNotti).toBe(2);
    expect(bookingConfig.maxPersone).toBe(8);
    expect(bookingConfig.contributoGiornalieroPersona).toBe(10);
  });

  it("uses the official operational email", () => {
    expect(site.operativeEmail).toBe("rifugio.barrasso@gmail.com");
  });

  it("has physical navigation entries for the Italian pages", () => {
    expect(navigation.map((item) => item.href)).toEqual([
      "/",
      "/storia/",
      "/galleria/",
      "/escursioni-e-sci/",
      "/prenotazioni/",
      "/quaderno-del-rifugio/",
      "/eventi/",
      "/info-e-regole/",
    ]);
  });

  it("includes the official history and rule anchors", () => {
    expect(historyTimeline.some((item) => item.date === "1992")).toBe(true);
    expect(rules.some((rule) => rule.includes("locale chiuso"))).toBe(true);
  });
});

describe("events data", () => {
  it("has the expected structure", () => {
    expect(currentEvent).toHaveProperty("active");
    expect(currentEvent).toHaveProperty("title");
    expect(currentEvent).toHaveProperty("date");
    expect(currentEvent).toHaveProperty("description");
    expect(currentEvent).toHaveProperty("image");
    expect(currentEvent).toHaveProperty("bookingEnabled");
    expect(currentEvent).toHaveProperty("eventName");
  });

  it("active is a boolean", () => {
    expect(typeof currentEvent.active).toBe("boolean");
  });
});

describe("dediche data", () => {
  it("is an array", () => {
    expect(Array.isArray(dediche)).toBe(true);
  });

  it("each entry has the required fields", () => {
    dediche.forEach((d) => {
      expect(d).toHaveProperty("nome");
      expect(d).toHaveProperty("testo");
      expect(d).toHaveProperty("colore");
      expect(["yellow", "blue", "green", "pink"]).toContain(d.colore);
    });
  });
});

describe("form version", () => {
  it("is updated to fase-2", () => {
    expect(bookingConfig.formVersion).toBe("fase-2");
  });
});
