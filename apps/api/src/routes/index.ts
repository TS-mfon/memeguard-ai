import type { FastifyInstance } from "fastify";
import { EvmAddressSchema, SAMPLE_REPORTS } from "@memeguard/shared";
import { analyzeToken, getReportBySlug, listReports } from "../services/analyzer.js";

function compact(report: Awaited<ReturnType<typeof analyzeToken>>) {
  return {
    score: report.score,
    token: report.token,
    redFlags: report.aiReport.redFlags.slice(0, 3),
    positiveSignals: report.aiReport.positiveSignals.slice(0, 2),
    publicUrl: report.publicUrl,
    communityPost: report.memePack.xPost
  };
}

export async function registerRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({ ok: true, service: "memeguard-api", time: new Date().toISOString() }));

  app.post("/api/analyze", async (request, reply) => {
    try {
      const report = await analyzeToken(request.body);
      return { ok: true, report };
    } catch (error) {
      reply.code(400);
      return {
        ok: false,
        error: {
          code: "ANALYSIS_FAILED",
          message: error instanceof Error ? error.message : "Analysis failed"
        }
      };
    }
  });

  app.get("/api/reports", async () => ({ ok: true, reports: await listReports() }));

  app.get<{ Params: { slug: string } }>("/api/reports/slug/:slug", async (request, reply) => {
    const report = await getReportBySlug(request.params.slug);
    if (!report) {
      const sample = SAMPLE_REPORTS.find((item) => item.shareSlug === request.params.slug);
      if (sample) return { ok: true, report: sample };
      reply.code(404);
      return { ok: false, error: { code: "NOT_FOUND", message: "Report not found." } };
    }
    return { ok: true, report };
  });

  app.post("/api/share-card-data", async (request, reply) => {
    const body = request.body as { slug?: string };
    if (!body.slug) {
      reply.code(400);
      return { ok: false, error: { code: "MISSING_SLUG", message: "Report slug is required." } };
    }
    const report = await getReportBySlug(body.slug);
    if (!report) {
      reply.code(404);
      return { ok: false, error: { code: "NOT_FOUND", message: "Report not found." } };
    }
    return { ok: true, shareCard: report.shareCard };
  });

  app.post("/api/bot/analyze", async (request, reply) => {
    try {
      const report = await analyzeToken({ ...(request.body as object), save: true });
      return { ok: true, result: compact(report) };
    } catch (error) {
      reply.code(400);
      return { ok: false, error: { code: "BOT_ANALYSIS_FAILED", message: error instanceof Error ? error.message : "Bot analysis failed" } };
    }
  });

  app.post("/api/bot/telegram/webhook", async (request) => {
    const body = request.body as { message?: { text?: string; chat?: { id?: number }; from?: { id?: number } } };
    const text = body.message?.text ?? "";
    const tokenAddress = text.split(/\s+/).find((part) => EvmAddressSchema.safeParse(part).success);
    if (!tokenAddress) return { ok: true, message: "Send /analyze 0xTokenAddress" };
    const report = await analyzeToken({ tokenAddress, mode: "live", save: true });
    return { ok: true, result: compact(report) };
  });

  app.post("/api/bot/discord/interactions", async (request) => {
    const body = request.body as { type?: number; data?: { options?: Array<{ value?: string }> } };
    if (body.type === 1) return { type: 1 };
    const tokenAddress = body.data?.options?.map((option) => option.value).find((value): value is string => Boolean(value));
    if (!tokenAddress || !EvmAddressSchema.safeParse(tokenAddress).success) {
      return { type: 4, data: { content: "Enter a valid BNB Chain token address.", flags: 64 } };
    }
    const report = await analyzeToken({ tokenAddress, mode: "live", save: true });
    return { type: 4, data: { content: `${report.token.symbol ?? "Token"}: ${report.score.value}/100 (${report.score.category}) ${report.publicUrl}`, flags: 64 } };
  });

  app.get("/api/docs/openapi.json", async () => ({
    openapi: "3.1.0",
    info: { title: "MemeGuard AI API", version: "1.0.0" },
    paths: {
      "/api/analyze": { post: { summary: "Analyze a BNB Chain token and return a MemeGuard trust brief." } },
      "/api/bot/analyze": { post: { summary: "Return a compact bot-friendly analysis." } }
    }
  }));
}
