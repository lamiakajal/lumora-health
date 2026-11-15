import { describe, expect, it } from "vitest";
import { about, howItWorks, quickActions } from "./home-sections";

describe("home sections content", () => {
  it("gives every quick action a destination and label", () => {
    for (const action of quickActions) {
      expect(action.href.length).toBeGreaterThan(0);
      expect(action.cta.length).toBeGreaterThan(0);
    }
  });

  it("links the nurse line with a tel: URL", () => {
    const nurse = quickActions.find((action) => action.id === "nurse");
    expect(nurse?.href).toMatch(/^tel:\+1\d{10}$/);
  });

  it("describes the booking journey in three steps", () => {
    expect(howItWorks.steps).toHaveLength(3);
  });

  it("lists highlights for the about section", () => {
    expect(about.highlights.length).toBeGreaterThanOrEqual(3);
  });
});
