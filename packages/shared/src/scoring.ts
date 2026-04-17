import type { AnalysisReport, RiskCategory, RiskSignal } from "./schemas.js";

type Evidence = Pick<
  AnalysisReport,
  "token" | "contract" | "marketActivity" | "socialContext"
>;

const DEAD_ADDRESSES = new Set([
  "0x0000000000000000000000000000000000000000",
  "0x000000000000000000000000000000000000dead"
]);

export function categoryForScore(value: number): RiskCategory {
  if (value >= 80) return "Low Risk";
  if (value >= 60) return "Watchlist";
  if (value >= 35) return "High Risk";
  return "Critical";
}

export function scoreSummary(category: RiskCategory): string {
  switch (category) {
    case "Low Risk":
      return "The available evidence is comparatively strong, but independent verification is still required.";
    case "Watchlist":
      return "Some transparency signals are present, but the community should review the highlighted gaps before amplifying.";
    case "High Risk":
      return "Multiple risk indicators are present. Treat this launch as high-risk until missing evidence is resolved.";
    case "Critical":
      return "The available evidence contains severe risk indicators or too many missing safety signals.";
  }
}

export function buildRiskSignals(evidence: Evidence): RiskSignal[] {
  const signals: RiskSignal[] = [];
  const add = (
    id: string,
    label: string,
    severity: RiskSignal["severity"],
    impact: number,
    explanation: string,
    source: string,
    raw: Record<string, unknown>
  ) => signals.push({ id, label, severity, impact, explanation, source, evidence: raw });

  if (evidence.contract.sourceVerified === true) {
    add("source_verified", "Contract source verified", "positive", 12, "BscScan reports verified source code for this contract.", "BscScan", { sourceVerified: true });
  } else if (evidence.contract.sourceVerified === false) {
    add("source_unverified", "Contract source not verified", "critical", -20, "The contract source is not verified, which limits independent review.", "BscScan", { sourceVerified: false });
  } else {
    add("source_unknown", "Source verification unknown", "warning", -6, "Source verification could not be confirmed.", "BscScan", { sourceVerified: null });
  }

  if (evidence.token.name && evidence.token.symbol && evidence.token.decimals !== null) {
    add("metadata_readable", "Token metadata readable", "positive", 8, "The token exposes standard ERC-20 metadata.", "BSC RPC", {
      name: evidence.token.name,
      symbol: evidence.token.symbol,
      decimals: evidence.token.decimals
    });
  } else {
    add("metadata_partial", "Token metadata incomplete", "danger", -8, "One or more standard ERC-20 metadata fields could not be read.", "BSC RPC", evidence.token);
  }

  if (evidence.token.totalSupplyRaw) {
    add("supply_readable", "Total supply readable", "positive", 5, "The total supply can be read through the token contract.", "BSC RPC", {
      totalSupplyRaw: evidence.token.totalSupplyRaw
    });
  } else {
    add("supply_unreadable", "Total supply unreadable", "danger", -8, "The total supply could not be read reliably.", "BSC RPC", {});
  }

  const ageHours = evidence.contract.creationTimestamp
    ? (Date.now() - Date.parse(evidence.contract.creationTimestamp)) / 36e5
    : null;
  if (ageHours === null || Number.isNaN(ageHours)) {
    add("age_unknown", "Contract age unknown", "warning", -4, "The creation timestamp could not be determined.", "BscScan", {
      creationTimestamp: evidence.contract.creationTimestamp
    });
  } else if (ageHours < 1) {
    add("age_under_hour", "Created less than one hour ago", "critical", -15, "The contract is extremely new, leaving little time for public review.", "BscScan", { ageHours });
  } else if (ageHours < 24) {
    add("age_under_day", "Created less than one day ago", "danger", -8, "The contract is new and should be treated cautiously.", "BscScan", { ageHours });
  } else if (ageHours > 24 * 30) {
    add("age_over_month", "Contract older than 30 days", "positive", 13, "The contract has existed long enough for broader review and activity signals.", "BscScan", { ageHours });
  } else if (ageHours > 24 * 7) {
    add("age_over_week", "Contract older than 7 days", "positive", 8, "The contract is not a same-day launch.", "BscScan", { ageHours });
  }

  if (evidence.contract.creatorAddress) {
    add("creator_available", "Creator address available", "positive", 5, "The creator address is known from explorer data.", "BscScan", { creatorAddress: evidence.contract.creatorAddress });
  } else {
    add("creator_missing", "Creator unavailable", "danger", -8, "The creator address could not be retrieved.", "BscScan", {});
  }

  if (evidence.contract.ownershipStatus === "renounced") {
    add("ownership_renounced", "Ownership appears renounced", "positive", 8, "The owner address appears to be zero or dead.", "BSC RPC", { ownerAddress: evidence.contract.ownerAddress });
  } else if (evidence.contract.ownershipStatus === "active-owner") {
    add("ownership_active", "Active owner detected", "danger", -10, "An active owner address can indicate privileged controls that require review.", "BSC RPC", { ownerAddress: evidence.contract.ownerAddress });
  } else {
    add("ownership_unknown", "Ownership status unknown", "warning", -3, "Ownership status could not be confirmed through common methods.", "BSC RPC", {});
  }

  if (evidence.marketActivity.transferCount === null) {
    add("transfers_unavailable", "Transfer data unavailable", "warning", -6, "Transfer history was unavailable or rate-limited.", "BscScan", evidence.marketActivity);
  } else if (evidence.marketActivity.transferCount < 5) {
    add("transfers_sparse", "Very low token activity", "danger", -6, "Very few transfers were found.", "BscScan", evidence.marketActivity);
  } else if (evidence.marketActivity.uniqueParticipants && evidence.marketActivity.uniqueParticipants >= 10) {
    add("transfers_organic", "Transfer activity has multiple participants", "positive", 8, "Recent activity includes multiple distinct participant addresses.", "BscScan", evidence.marketActivity);
  }

  if (evidence.marketActivity.concentrationFlag === true) {
    add("concentration_flag", "Concentration heuristic triggered", "danger", -12, "Recent transfer activity suggests a small set of addresses may dominate movement.", "BscScan", evidence.marketActivity);
  }

  const text = `${evidence.token.name ?? ""} ${evidence.token.symbol ?? ""}`.toLowerCase();
  if (/(official|binance|cz|four\.meme|pancake|airdrop|claim)/i.test(text)) {
    add("metadata_impersonation", "Metadata impersonation pattern", "danger", -10, "The token name or symbol uses terms often seen in impersonation or claim campaigns.", "Heuristic", { name: evidence.token.name, symbol: evidence.token.symbol });
  }

  if (evidence.socialContext.enabled && evidence.socialContext.spamFlag === true) {
    add("social_spam", "Social spam pattern", "danger", -10, "Social context indicates repeated or low-quality promotional patterns.", "Social/Search", evidence.socialContext);
  }

  if (evidence.socialContext.enabled && evidence.socialContext.contractMismatchFlag === true) {
    add("social_contract_mismatch", "Contract mismatch in social context", "critical", -12, "Social posts or pages appear to reference inconsistent contract addresses.", "Social/Search", evidence.socialContext);
  }

  if (evidence.socialContext.enabled && evidence.socialContext.evidence.length > 0 && !evidence.socialContext.spamFlag && !evidence.socialContext.contractMismatchFlag) {
    add("social_consistent", "Social context found", "positive", 5, "Search context exists and does not trigger spam or contract mismatch heuristics.", "Social/Search", evidence.socialContext);
  }

  return signals;
}

export function calculateRiskScore(signals: RiskSignal[]) {
  const raw = signals.reduce((score, signal) => score + signal.impact, 50);
  const value = Math.max(0, Math.min(100, Math.round(raw)));
  const category = categoryForScore(value);
  return {
    value,
    category,
    summary: scoreSummary(category)
  };
}

export function ownershipStatus(ownerAddress: string | null): "renounced" | "active-owner" | "unknown" {
  if (!ownerAddress) return "unknown";
  return DEAD_ADDRESSES.has(ownerAddress.toLowerCase()) ? "renounced" : "active-owner";
}
