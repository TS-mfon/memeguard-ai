import type { AiReport, AnalysisReport, MemePack } from "./schemas.js";

export function fallbackAiReport(report: Pick<AnalysisReport, "score" | "signals" | "warnings">): AiReport {
  const negative = report.signals.filter((signal) => signal.impact < 0);
  const positive = report.signals.filter((signal) => signal.impact > 0);
  const missingData = report.signals
    .filter((signal) => /unknown|unavailable|missing|unreadable|partial/i.test(signal.id + signal.explanation))
    .map((signal) => signal.label);

  return {
    title: "MemeGuard Trust Brief",
    verdict: report.score.category,
    confidence: report.warnings.length > 1 || missingData.length > 2 ? "low" : negative.length > 0 ? "medium" : "high",
    summary: report.score.summary,
    redFlags: negative.slice(0, 6).map((signal) => `${signal.label}: ${signal.explanation}`),
    positiveSignals: positive.slice(0, 6).map((signal) => `${signal.label}: ${signal.explanation}`),
    missingData: [...new Set([...missingData, ...report.warnings])].slice(0, 6),
    recommendedActions: [
      "Review the contract source and owner permissions before amplifying this launch.",
      "Compare the token address against official community posts.",
      "Treat the score as a due-diligence summary, not financial advice.",
      "Ask the launch team to explain any missing or high-risk evidence."
    ],
    moderatorNote: `MemeGuard marks this token as ${report.score.category}. Share the report only with the risk context attached.`,
    plainEnglishExplanation:
      "This brief summarizes public evidence from chain, explorer, and optional social sources. It cannot prove a token is safe, but it can make missing transparency and obvious launch risks easier to discuss."
  };
}

export function fallbackMemePack(report: Pick<AnalysisReport, "token" | "score" | "shareSlug">): MemePack {
  const symbol = report.token.symbol ?? "TOKEN";
  const name = report.token.name ?? "this launch";
  const verdict = report.score.category;
  return {
    xPost: `MemeGuard AI checked ${symbol}: ${report.score.value}/100 (${verdict}). Read the evidence before the timeline turns into exit liquidity. Not financial advice.`,
    telegramPost: `MemeGuard AI brief for ${name}: ${verdict} at ${report.score.value}/100. Check contract transparency, owner status, and activity before amplifying.`,
    discordModNote: `Moderator note: ${symbol} is categorized as ${verdict}. Ask members to review the MemeGuard evidence table and avoid buy/sell advice.`,
    shortMemeCaptions: [
      `${symbol} got sent to due diligence court.`,
      "Trust brief first, rocket emojis later.",
      "The chain remembers what the hype forgets."
    ],
    cautiousBullishCaptions: [
      "Green candles are louder with receipts.",
      "Community energy is better when the evidence is clean.",
      "If it is real, transparency should not be hard."
    ],
    redFlagCaptions: [
      "Anon launch, missing source, loud shill: the trilogy.",
      "When the contract is quieter than the meme, slow down.",
      "FOMO is not a security audit."
    ],
    reportTitleVariants: [
      `${symbol} Trust Brief`,
      `${name} Launch Risk Snapshot`,
      `MemeGuard AI Report: ${symbol}`
    ]
  };
}

export function shareCardForReport(report: Pick<AnalysisReport, "token" | "score" | "signals" | "generatedAt" | "publicUrl">) {
  return {
    title: `${report.token.symbol ?? "TOKEN"} MemeGuard Brief`,
    subtitle: report.token.name ?? "BNB Chain token",
    score: report.score.value,
    verdict: report.score.category,
    topSignals: report.signals
      .filter((signal) => signal.impact < 0)
      .slice(0, 3)
      .map((signal) => signal.label),
    generatedAt: report.generatedAt,
    publicUrl: report.publicUrl
  };
}
