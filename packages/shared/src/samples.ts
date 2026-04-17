import type { AnalysisReport } from "./schemas.js";
import { fallbackAiReport, fallbackMemePack, shareCardForReport } from "./generators.js";
import { buildRiskSignals, calculateRiskScore } from "./scoring.js";

type SampleInput = Pick<
  AnalysisReport,
  "id" | "shareSlug" | "generatedAt" | "network" | "token" | "contract" | "marketActivity" | "socialContext" | "warnings"
>;

function makeSample(input: SampleInput): AnalysisReport {
  const signals = buildRiskSignals(input);
  const score = calculateRiskScore(signals);
  const base = {
    ...input,
    publicUrl: null,
    score,
    signals
  };
  const aiReport = fallbackAiReport(base);
  const memePack = fallbackMemePack(base);
  return {
    ...base,
    aiReport,
    memePack,
    shareCard: shareCardForReport({ ...base, publicUrl: null })
  };
}

const network = { name: "BNB Smart Chain" as const, chainId: 56 as const };

export const SAMPLE_REPORTS: AnalysisReport[] = [
  makeSample({
    id: "sample-low-risk",
    shareSlug: "sample-low-risk",
    generatedAt: new Date("2026-04-17T10:00:00.000Z").toISOString(),
    network,
    token: {
      address: "0x1111111111111111111111111111111111111111",
      name: "Transparent Meme",
      symbol: "CLEAR",
      decimals: 18,
      totalSupplyRaw: "1000000000000000000000000000",
      totalSupplyFormatted: "1000000000",
      bytecodeFound: true
    },
    contract: {
      sourceVerified: true,
      creatorAddress: "0x2222222222222222222222222222222222222222",
      creationTxHash: "0xsamplelowrisk",
      creationTimestamp: new Date("2026-03-01T10:00:00.000Z").toISOString(),
      ownerAddress: "0x000000000000000000000000000000000000dEaD",
      ownershipStatus: "renounced"
    },
    marketActivity: {
      transferCount: 1800,
      recentTransferCount: 146,
      uniqueParticipants: 91,
      concentrationFlag: false
    },
    socialContext: {
      enabled: true,
      queries: ["Transparent Meme CLEAR", "CLEAR token BNB Chain"],
      summary: "Search context is consistent with the same token address in sample evidence.",
      spamFlag: false,
      contractMismatchFlag: false,
      evidence: ["Community posts repeat the same sample contract address."]
    },
    warnings: []
  }),
  makeSample({
    id: "sample-critical",
    shareSlug: "sample-critical",
    generatedAt: new Date("2026-04-17T10:05:00.000Z").toISOString(),
    network,
    token: {
      address: "0x3333333333333333333333333333333333333333",
      name: "High-Risk Launch Example",
      symbol: "RISK",
      decimals: 18,
      totalSupplyRaw: "999999999999999999999999999999",
      totalSupplyFormatted: "999999999999",
      bytecodeFound: true
    },
    contract: {
      sourceVerified: false,
      creatorAddress: null,
      creationTxHash: null,
      creationTimestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      ownerAddress: "0x4444444444444444444444444444444444444444",
      ownershipStatus: "active-owner"
    },
    marketActivity: {
      transferCount: 2,
      recentTransferCount: 2,
      uniqueParticipants: 2,
      concentrationFlag: true
    },
    socialContext: {
      enabled: true,
      queries: ["High-Risk Launch Example RISK", "RISK airdrop BNB"],
      summary: "Sample social evidence contains aggressive claim language and mismatched references.",
      spamFlag: true,
      contractMismatchFlag: true,
      evidence: ["Repeated claim posts mention different token addresses."]
    },
    warnings: ["Sample profile intentionally models a risky launch."]
  }),
  makeSample({
    id: "sample-watchlist",
    shareSlug: "sample-watchlist",
    generatedAt: new Date("2026-04-17T10:10:00.000Z").toISOString(),
    network,
    token: {
      address: "0x5555555555555555555555555555555555555555",
      name: "Watchlist Launch Example",
      symbol: "WATCH",
      decimals: 18,
      totalSupplyRaw: "500000000000000000000000000",
      totalSupplyFormatted: "500000000",
      bytecodeFound: true
    },
    contract: {
      sourceVerified: true,
      creatorAddress: "0x6666666666666666666666666666666666666666",
      creationTxHash: "0xsamplewatchlist",
      creationTimestamp: new Date("2026-04-10T10:00:00.000Z").toISOString(),
      ownerAddress: "0x6666666666666666666666666666666666666666",
      ownershipStatus: "active-owner"
    },
    marketActivity: {
      transferCount: 66,
      recentTransferCount: 18,
      uniqueParticipants: 12,
      concentrationFlag: false
    },
    socialContext: {
      enabled: true,
      queries: ["Watchlist Launch Example WATCH", "WATCH token BNB"],
      summary: "Some public discussion exists, but moderation should ask about owner permissions.",
      spamFlag: false,
      contractMismatchFlag: false,
      evidence: ["Several community posts reference the same sample address."]
    },
    warnings: []
  }),
  makeSample({
    id: "sample-high-risk",
    shareSlug: "sample-high-risk",
    generatedAt: new Date("2026-04-17T10:15:00.000Z").toISOString(),
    network,
    token: {
      address: "0x7777777777777777777777777777777777777777",
      name: null,
      symbol: "GAP",
      decimals: null,
      totalSupplyRaw: null,
      totalSupplyFormatted: null,
      bytecodeFound: true
    },
    contract: {
      sourceVerified: null,
      creatorAddress: "0x8888888888888888888888888888888888888888",
      creationTxHash: "0xsamplehighrisk",
      creationTimestamp: new Date("2026-04-17T09:55:00.000Z").toISOString(),
      ownerAddress: null,
      ownershipStatus: "unknown"
    },
    marketActivity: {
      transferCount: null,
      recentTransferCount: null,
      uniqueParticipants: null,
      concentrationFlag: null
    },
    socialContext: {
      enabled: false,
      queries: [],
      summary: "Social context disabled for this sample.",
      spamFlag: null,
      contractMismatchFlag: null,
      evidence: []
    },
    warnings: ["Metadata reads failed in sample profile.", "Transfer data unavailable in sample profile."]
  })
];

export function sampleByAddressOrSlug(value: string): AnalysisReport | undefined {
  const normalized = value.toLowerCase();
  return SAMPLE_REPORTS.find(
    (report) => report.token.address.toLowerCase() === normalized || report.shareSlug === normalized || report.id === normalized
  );
}
