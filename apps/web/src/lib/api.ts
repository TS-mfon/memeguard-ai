import type { AnalysisReport } from "@memeguard/shared";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function analyzeToken(tokenAddress: string, mode: "live" | "sample" = "live") {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ tokenAddress, mode, save: true, includeSocial: true, includeMemePack: true })
  });
  const data = await response.json();
  if (!data.ok) throw new Error(data.error?.message ?? "Analysis failed");
  return data.report as AnalysisReport;
}

export async function getReport(slug: string) {
  const response = await fetch(`${API_BASE_URL}/api/reports/slug/${slug}`, { next: { revalidate: 60 } });
  const data = await response.json();
  if (!data.ok) return null;
  return data.report as AnalysisReport;
}
