import { describe, expect, it } from "vitest";
import { SAMPLE_REPORTS } from "../src/samples.js";
import { categoryForScore } from "../src/scoring.js";

describe("scoring", () => {
  it("maps categories", () => {
    expect(categoryForScore(90)).toBe("Low Risk");
    expect(categoryForScore(70)).toBe("Watchlist");
    expect(categoryForScore(50)).toBe("High Risk");
    expect(categoryForScore(20)).toBe("Critical");
  });

  it("scores samples with expected ordering", () => {
    const low = SAMPLE_REPORTS.find((report) => report.id === "sample-low-risk");
    const critical = SAMPLE_REPORTS.find((report) => report.id === "sample-critical");
    expect(low?.score.value).toBeGreaterThan(critical?.score.value ?? 100);
    expect(critical?.score.category).toBe("Critical");
  });
});
