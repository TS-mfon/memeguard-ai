import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      <section className="hero">
        <div className="shell" style={{ padding: "28px 0 48px" }}>
          <Link className="btn secondary" href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>Back to lookup</Link>
          <p className="eyebrow" style={{ marginTop: 28 }}>About MemeGuard AI</p>
          <h1 className="hero-title">A memecoin trust layer for BNB Chain communities.</h1>
          <p className="hero-copy">
            MemeGuard AI helps people slow down long enough to read the evidence. It is built for launchpads,
            moderators, communities, and everyday users who need a plain-English risk brief before a token goes viral.
          </p>
        </div>
      </section>

      <section className="shell" style={{ padding: "24px 0 44px", display: "grid", gap: 16 }}>
        <div className="grid-auto">
          <article className="card" style={{ padding: 22 }}>
            <p className="eyebrow" style={{ margin: 0 }}>What are you building?</p>
            <h2>MemeGuard AI</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
              A production-style token lookup dapp that analyzes BNB Smart Chain memecoin contracts and creates
              shareable trust briefs for communities.
            </p>
          </article>
          <article className="card" style={{ padding: 22 }}>
            <p className="eyebrow" style={{ margin: 0 }}>What does the AI do?</p>
            <h2>It explains evidence</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
              The AI reads structured evidence from BSC RPC, BscScan, scoring signals, and optional social context,
              then writes red flags, positive signals, moderation notes, and meme-native share copy.
            </p>
          </article>
          <article className="card" style={{ padding: 22 }}>
            <p className="eyebrow" style={{ margin: 0 }}>What makes it different?</p>
            <h2>Responsible meme culture</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
              It does not just output a score. It shows the raw evidence, explains missing data, refuses financial
              advice, and generates community copy without fake hype.
            </p>
          </article>
        </div>

        <section className="card" style={{ padding: 24 }}>
          <p className="eyebrow" style={{ margin: 0 }}>How it works</p>
          <h2>Read-only analysis pipeline</h2>
          <div className="grid-auto">
            <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>1. User pastes a token contract address.</p>
            <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>2. Backend reads public BNB Chain and BscScan evidence.</p>
            <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>3. Risk signals produce an explainable 0-100 score.</p>
            <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>4. AI turns the evidence into a trust brief and share copy.</p>
          </div>
        </section>

        <section className="card" style={{ padding: 24 }}>
          <p className="eyebrow" style={{ margin: 0 }}>Safety</p>
          <h2>No wallet. No private key. No trading.</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>
            MemeGuard AI is informational only. It does not authenticate users, does not connect wallets, does not issue
            tokens, and does not sign transactions. A database is not required because the product is a public lookup tool.
          </p>
        </section>
      </section>
    </main>
  );
}
