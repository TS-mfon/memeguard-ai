import { z } from "zod";

export const EvmAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Enter a valid EVM contract address.");

export const RiskCategorySchema = z.enum([
  "Low Risk",
  "Watchlist",
  "High Risk",
  "Critical"
]);

export const SignalSeveritySchema = z.enum([
  "positive",
  "info",
  "warning",
  "danger",
  "critical"
]);

export const AnalyzeRequestSchema = z.object({
  tokenAddress: EvmAddressSchema,
  chainId: z.number().int().default(56),
  mode: z.enum(["live", "sample"]).default("live"),
  save: z.boolean().default(true),
  includeSocial: z.boolean().default(true),
  includeMemePack: z.boolean().default(true)
});

export const TokenMetadataSchema = z.object({
  address: EvmAddressSchema,
  name: z.string().nullable(),
  symbol: z.string().nullable(),
  decimals: z.number().int().nullable(),
  totalSupplyRaw: z.string().nullable(),
  totalSupplyFormatted: z.string().nullable(),
  bytecodeFound: z.boolean()
});

export const ContractEvidenceSchema = z.object({
  sourceVerified: z.boolean().nullable(),
  creatorAddress: EvmAddressSchema.nullable(),
  creationTxHash: z.string().nullable(),
  creationTimestamp: z.string().nullable(),
  ownerAddress: EvmAddressSchema.nullable(),
  ownershipStatus: z.enum(["renounced", "active-owner", "unknown"])
});

export const MarketActivitySchema = z.object({
  transferCount: z.number().int().nullable(),
  recentTransferCount: z.number().int().nullable(),
  uniqueParticipants: z.number().int().nullable(),
  concentrationFlag: z.boolean().nullable()
});

export const SocialContextSchema = z.object({
  enabled: z.boolean(),
  queries: z.array(z.string()),
  summary: z.string(),
  spamFlag: z.boolean().nullable(),
  contractMismatchFlag: z.boolean().nullable(),
  evidence: z.array(z.string())
});

export const RiskSignalSchema = z.object({
  id: z.string(),
  label: z.string(),
  severity: SignalSeveritySchema,
  impact: z.number(),
  explanation: z.string(),
  source: z.string(),
  evidence: z.record(z.string(), z.unknown())
});

export const RiskScoreSchema = z.object({
  value: z.number().int().min(0).max(100),
  category: RiskCategorySchema,
  summary: z.string()
});

export const AiReportSchema = z.object({
  title: z.string(),
  verdict: RiskCategorySchema,
  confidence: z.enum(["low", "medium", "high"]),
  summary: z.string(),
  redFlags: z.array(z.string()),
  positiveSignals: z.array(z.string()),
  missingData: z.array(z.string()),
  recommendedActions: z.array(z.string()),
  moderatorNote: z.string(),
  plainEnglishExplanation: z.string()
});

export const MemePackSchema = z.object({
  xPost: z.string(),
  telegramPost: z.string(),
  discordModNote: z.string(),
  shortMemeCaptions: z.array(z.string()),
  cautiousBullishCaptions: z.array(z.string()),
  redFlagCaptions: z.array(z.string()),
  reportTitleVariants: z.array(z.string())
});

export const ShareCardSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  score: z.number().int(),
  verdict: RiskCategorySchema,
  topSignals: z.array(z.string()),
  generatedAt: z.string(),
  publicUrl: z.string().nullable()
});

export const AnalysisReportSchema = z.object({
  id: z.string(),
  shareSlug: z.string(),
  publicUrl: z.string().nullable(),
  generatedAt: z.string(),
  network: z.object({
    name: z.literal("BNB Smart Chain"),
    chainId: z.literal(56)
  }),
  token: TokenMetadataSchema,
  contract: ContractEvidenceSchema,
  marketActivity: MarketActivitySchema,
  socialContext: SocialContextSchema,
  score: RiskScoreSchema,
  signals: z.array(RiskSignalSchema),
  aiReport: AiReportSchema,
  memePack: MemePackSchema,
  shareCard: ShareCardSchema,
  warnings: z.array(z.string())
});

export const AnalyzeResponseSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    report: AnalysisReportSchema
  }),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string()
    })
  })
]);

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type AnalysisReport = z.infer<typeof AnalysisReportSchema>;
export type RiskSignal = z.infer<typeof RiskSignalSchema>;
export type RiskScore = z.infer<typeof RiskScoreSchema>;
export type RiskCategory = z.infer<typeof RiskCategorySchema>;
export type AiReport = z.infer<typeof AiReportSchema>;
export type MemePack = z.infer<typeof MemePackSchema>;
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
