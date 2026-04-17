import { describe, expect, it } from "vitest";
import { analyzeToken } from "../services/analyzer.js";

describe("analyzeToken", () => {
  it("returns sample analysis", async () => {
    const report = await analyzeToken({
      tokenAddress: "0x1111111111111111111111111111111111111111",
      mode: "sample",
      save: false
    });
    expect(report.score.value).toBeGreaterThan(50);
    expect(report.aiReport.title).toContain("MemeGuard");
  });
});
