import { EvidenceTable } from "@/components/EvidenceTable";
import { MemePackPanel } from "@/components/MemePackPanel";
import { RiskScore } from "@/components/RiskScore";
import { ShareCard } from "@/components/ShareCard";
import { SignalList } from "@/components/SignalList";
import { TrustBrief } from "@/components/TrustBrief";
import { getReport } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = await getReport(slug);
  if (!report) notFound();

  return (
    <main className="shell" style={{ padding: "28px 0 40px", display: "grid", gap: 16 }}>
      <Link href="/">Back to dashboard</Link>
      <section className="card" style={{ padding: 20 }}>
        <p style={{ margin: 0, color: "var(--muted)" }}>Public MemeGuard report</p>
        <h1 style={{ margin: "8px 0" }}>{report.token.symbol ?? "Token"} Trust Brief</h1>
        <p style={{ color: "var(--muted)" }}>{report.generatedAt}</p>
      </section>
      <RiskScore report={report} />
      <TrustBrief report={report} />
      <SignalList signals={report.signals} />
      <EvidenceTable report={report} />
      <MemePackPanel report={report} />
      <ShareCard report={report} />
    </main>
  );
}
