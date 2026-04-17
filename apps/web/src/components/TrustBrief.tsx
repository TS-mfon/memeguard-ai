import type { AnalysisReport } from "@memeguard/shared";

export function TrustBrief({ report }: { report: AnalysisReport }) {
  return (
    <section className="card" style={{ padding: 20 }}>
      <p className="eyebrow" style={{ margin: 0 }}>AI analyst</p>
      <h2 style={{ marginTop: 6 }}>{report.aiReport.title}</h2>
      <p style={{ color: "var(--muted)" }}>{report.aiReport.summary}</p>
      <div className="grid-auto">
        <div>
          <h3>Red flags</h3>
          <ul>{report.aiReport.redFlags.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>Positive signals</h3>
          <ul>{report.aiReport.positiveSignals.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>Recommended actions</h3>
          <ul>{report.aiReport.recommendedActions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
      <h3>Moderator note</h3>
      <p style={{ border: "1px solid var(--line)", borderRadius: 8, padding: 14, background: "rgba(243,186,47,0.08)" }}>{report.aiReport.moderatorNote}</p>
    </section>
  );
}
