import { nanoid } from "nanoid";
import {
  AnalyzeRequestSchema,
  SAMPLE_REPORTS,
  buildRiskSignals,
  calculateRiskScore,
  fallbackMemePack,
  sampleByAddressOrSlug,
  shareCardForReport,
  type AnalysisReport
} from "@memeguard/shared";
import { config } from "../config.js";
import { generateAiReport } from "./ai.js";
import { fetchBscScanEvidence } from "./bscscan.js";
import { fetchRpcEvidence } from "./bsc-rpc.js";
import { fetchSocialContext } from "./social.js";

function publicUrlForSlug(slug: string) {
  return `${config.appUrl.replace(/\/$/, "")}/report/${slug}`;
}

const reportStore = new Map<string, AnalysisReport>();

export async function analyzeToken(input: unknown): Promise<AnalysisReport> {
  const request = AnalyzeRequestSchema.parse(input);
  const sample = sampleByAddressOrSlug(request.tokenAddress) ?? SAMPLE_REPORTS[0];
  if (!sample) {
    throw new Error("Sample data is not available.");
  }
  if (request.mode === "sample" || config.useSampleData) {
    const report: AnalysisReport = { ...sample, publicUrl: publicUrlForSlug(sample.shareSlug) };
    if (request.save) await saveReport(report);
    return report;
  }

  const warnings: string[] = [];
  const rpc = await fetchRpcEvidence(request.tokenAddress, warnings);
  const explorer = await fetchBscScanEvidence(request.tokenAddress, warnings);
  const socialContext = await fetchSocialContext(rpc.token, warnings);
  const generatedAt = new Date().toISOString();
  const id = `mg_${nanoid(12)}`;
  const shareSlug = `${(rpc.token.symbol ?? "token").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${nanoid(6)}`;

  const base = {
    id,
    shareSlug,
    publicUrl: publicUrlForSlug(shareSlug),
    generatedAt,
    network: { name: "BNB Smart Chain" as const, chainId: 56 as const },
    token: rpc.token,
    contract: {
      sourceVerified: explorer.sourceVerified,
      creatorAddress: explorer.creatorAddress,
      creationTxHash: explorer.creationTxHash,
      creationTimestamp: explorer.creationTimestamp,
      ownerAddress: rpc.ownerAddress,
      ownershipStatus: rpc.ownershipStatus
    },
    marketActivity: explorer.marketActivity,
    socialContext,
    warnings
  };

  const signals = buildRiskSignals(base);
  const score = calculateRiskScore(signals);
  const partial = { ...base, score, signals };
  const aiReport = await generateAiReport(partial);
  const report: AnalysisReport = {
    ...partial,
    aiReport,
    memePack: fallbackMemePack(partial),
    shareCard: shareCardForReport(partial)
  };

  if (request.save) await saveReport(report);
  return report;
}

export async function saveReport(report: AnalysisReport) {
  reportStore.set(report.shareSlug, report);
}

export async function getReportBySlug(slug: string) {
  return reportStore.get(slug) ?? sampleByAddressOrSlug(slug);
}

export async function listReports() {
  return [...reportStore.values()].slice(-25).reverse();
}
