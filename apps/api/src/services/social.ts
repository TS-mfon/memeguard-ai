import { config } from "../config.js";

export async function fetchSocialContext(token: { name: string | null; symbol: string | null; address: string }, warnings: string[]) {
  const queries = [
    token.name ? `${token.name} BNB Chain token` : "",
    token.symbol ? `${token.symbol} token Four.meme` : "",
    token.address
  ].filter(Boolean);

  if (!config.enableSocialContext) {
    return { enabled: false, queries, summary: "Social context disabled.", spamFlag: null, contractMismatchFlag: null, evidence: [] };
  }

  if (!config.exaApiKey && !config.xBearerToken) {
    warnings.push("Social/search API keys are not configured; using heuristic social context only.");
    return {
      enabled: true,
      queries,
      summary: "No external social provider configured. MemeGuard used token metadata heuristics only.",
      spamFlag: false,
      contractMismatchFlag: false,
      evidence: []
    };
  }

  return {
    enabled: true,
    queries,
    summary: "External social provider hooks are configured. Current implementation records provider availability and safe heuristics.",
    spamFlag: false,
    contractMismatchFlag: false,
    evidence: ["Social/search provider configured for extended context."]
  };
}
