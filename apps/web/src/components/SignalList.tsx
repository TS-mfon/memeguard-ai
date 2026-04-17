import type { RiskSignal } from "@memeguard/shared";

const colors: Record<RiskSignal["severity"], string> = {
  positive: "var(--green)",
  info: "var(--muted)",
  warning: "var(--amber)",
  danger: "var(--red)",
  critical: "var(--red)"
};

export function SignalList({ signals }: { signals: RiskSignal[] }) {
  return (
    <section className="card" style={{ padding: 20 }}>
      <p className="eyebrow" style={{ margin: 0 }}>Evidence scoring</p>
      <h2 style={{ marginTop: 6 }}>Signal breakdown</h2>
      <p style={{ color: "var(--muted)", lineHeight: 1.55 }}>
        Each signal shows how public evidence moved the score. Positive values improve confidence; negative values
        indicate risk or missing transparency.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {signals.map((signal) => (
          <article key={signal.id} style={{ border: "1px solid var(--line)", borderRadius: 8, padding: 14, background: "rgba(255,255,255,0.035)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <strong>{signal.label}</strong>
              <span style={{ color: colors[signal.severity], whiteSpace: "nowrap" }}>{signal.impact > 0 ? "+" : ""}{signal.impact}</span>
            </div>
            <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{signal.explanation}</p>
            <small style={{ color: "var(--muted)" }}>Source: {signal.source}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
