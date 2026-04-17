import type { AnalysisReport } from "@memeguard/shared";

function colorFor(value: number) {
  if (value >= 80) return "var(--green)";
  if (value >= 60) return "var(--amber)";
  return "var(--red)";
}

export function RiskScore({ report }: { report: AnalysisReport }) {
  return (
    <section className="card" style={{ padding: 20 }}>
      <p className="eyebrow" style={{ margin: 0 }}>MemeGuard score</p>
      <div style={{ display: "flex", alignItems: "end", gap: 12, marginTop: 8 }}>
        <strong style={{ fontSize: 58, lineHeight: 1, color: colorFor(report.score.value) }}>{report.score.value}</strong>
        <span style={{ paddingBottom: 8 }}>/100</span>
      </div>
      <div style={{ marginTop: 12, height: 10, borderRadius: 8, background: "#ececea", overflow: "hidden" }}>
        <div style={{ width: `${report.score.value}%`, height: "100%", background: colorFor(report.score.value) }} />
      </div>
      <h2 style={{ margin: "16px 0 8px" }}>{report.score.category}</h2>
      <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55 }}>{report.score.summary}</p>
      <p style={{ margin: "14px 0 0", color: "var(--muted)", fontSize: 13 }}>
        Higher is better. The score summarizes public evidence; it is not financial advice.
      </p>
    </section>
  );
}
