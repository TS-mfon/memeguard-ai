import type { AnalysisReport } from "@memeguard/shared";

export function EvidenceTable({ report }: { report: AnalysisReport }) {
  const rows = [
    ["Address", report.token.address],
    ["Name", report.token.name ?? "Unknown"],
    ["Symbol", report.token.symbol ?? "Unknown"],
    ["Decimals", report.token.decimals ?? "Unknown"],
    ["Total supply", report.token.totalSupplyFormatted ?? "Unknown"],
    ["Source verified", String(report.contract.sourceVerified ?? "Unknown")],
    ["Creator", report.contract.creatorAddress ?? "Unknown"],
    ["Owner", report.contract.ownerAddress ?? "Unknown"],
    ["Ownership", report.contract.ownershipStatus],
    ["Transfers checked", report.marketActivity.transferCount ?? "Unknown"],
    ["Social summary", report.socialContext.summary]
  ];
  return (
    <section className="card" style={{ padding: 20 }}>
      <p className="eyebrow" style={{ margin: 0 }}>Raw inputs</p>
      <h2 style={{ marginTop: 6 }}>Evidence table</h2>
      <p style={{ color: "var(--muted)", lineHeight: 1.55 }}>
        These are the public data points the AI analyst is allowed to use. The report does not invent facts outside this evidence.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {rows.map(([key, value]) => (
              <tr key={key}>
                <th style={{ textAlign: "left", borderTop: "1px solid var(--line)", padding: 10, width: 180, color: "var(--amber-2)" }}>{key}</th>
                <td style={{ borderTop: "1px solid var(--line)", padding: 10, wordBreak: "break-word", color: "var(--muted)" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
