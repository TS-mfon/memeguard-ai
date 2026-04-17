import type { AnalysisReport } from "@memeguard/shared";

export function MemePackPanel({ report }: { report: AnalysisReport }) {
  return (
    <section className="card" style={{ padding: 20 }}>
      <p className="eyebrow" style={{ margin: 0 }}>Internet culture layer</p>
      <h2 style={{ marginTop: 6 }}>Community copy pack</h2>
      <p style={{ color: "var(--muted)", lineHeight: 1.55 }}>
        MemeGuard turns technical evidence into shareable copy for X, Telegram, and Discord without adding price hype
        or buy/sell advice.
      </p>
      <div className="grid-auto">
        <div>
          <h3>X post</h3>
          <p>{report.memePack.xPost}</p>
        </div>
        <div>
          <h3>Telegram</h3>
          <p>{report.memePack.telegramPost}</p>
        </div>
        <div>
          <h3>Discord mod note</h3>
          <p>{report.memePack.discordModNote}</p>
        </div>
      </div>
      <h3>Meme captions</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[...report.memePack.shortMemeCaptions, ...report.memePack.redFlagCaptions].map((caption) => (
          <span key={caption} style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "8px 10px", background: "rgba(255,255,255,0.035)" }}>{caption}</span>
        ))}
      </div>
    </section>
  );
}
