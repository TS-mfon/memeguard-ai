"use client";

import { toPng } from "html-to-image";
import type { AnalysisReport } from "@memeguard/shared";
import { useRef } from "react";

export function ShareCard({ report }: { report: AnalysisReport }) {
  const ref = useRef<HTMLDivElement>(null);
  async function exportCard() {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current);
    const link = document.createElement("a");
    link.download = `${report.shareSlug}.png`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <section className="card" style={{ padding: 20 }}>
      <p className="eyebrow" style={{ margin: 0 }}>Shareable output</p>
      <h2 style={{ marginTop: 6 }}>Report card</h2>
      <p style={{ color: "var(--muted)", lineHeight: 1.55 }}>
        Export a post-ready PNG for community channels after reviewing the evidence.
      </p>
      <div ref={ref} style={{ border: "1px solid #f3ba2f", borderRadius: 8, padding: 24, background: "linear-gradient(135deg,#080704,#231b06)", width: "min(100%, 560px)", color: "#fff8d9" }}>
        <p style={{ margin: 0, color: "#ffd95a", fontWeight: 800 }}>MemeGuard AI x BNB Chain</p>
        <h3 style={{ fontSize: 28, margin: "8px 0" }}>{report.shareCard.title}</h3>
        <strong style={{ fontSize: 48, color: "#f3ba2f" }}>{report.shareCard.score}/100</strong>
        <p style={{ color: "#fff8d9" }}>{report.shareCard.verdict}</p>
        <ul>{report.shareCard.topSignals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
        <small style={{ color: "#b9aa78" }}>{report.publicUrl}</small>
      </div>
      <button className="btn secondary" style={{ marginTop: 12 }} onClick={exportCard}>Export PNG</button>
    </section>
  );
}
