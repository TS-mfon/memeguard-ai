"use client";

import type { AnalysisReport } from "@memeguard/shared";
import { SAMPLE_REPORTS } from "@memeguard/shared";
import { useState } from "react";
import { analyzeToken } from "@/lib/api";
import { EvidenceTable } from "./EvidenceTable";
import { MemePackPanel } from "./MemePackPanel";
import { RiskScore } from "./RiskScore";
import { ShareCard } from "./ShareCard";
import { SignalList } from "./SignalList";
import { TrustBrief } from "./TrustBrief";

export function Dashboard() {
  const [address, setAddress] = useState("");
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(mode: "live" | "sample") {
    setLoading(true);
    setError(null);
    try {
      setReport(await analyzeToken(address, mode));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  async function runDemo(sampleAddress: string) {
    setAddress(sampleAddress);
    setLoading(true);
    setError(null);
    try {
      setReport(await analyzeToken(sampleAddress, "sample"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="shell" style={{ padding: "28px 0 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div className="brand-row">
              <img className="brand-logo" src="https://cryptologos.cc/logos/bnb-bnb-logo.png" alt="BNB Chain logo" />
              <img className="brand-logo" src="https://four.meme/favicon.ico" alt="Four.meme icon" />
              <span className="eyebrow">BNB Chain x Four.meme launch intelligence</span>
            </div>
            <a className="btn secondary" href="/about" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>About</a>
          </div>
          <h1 className="hero-title">AI risk briefs before the meme gets amplified.</h1>
          <p className="hero-copy">
            Paste a BNB Smart Chain token contract. MemeGuard AI checks live contract evidence, explorer data,
            ownership signals, transfer behavior, and optional social context, then writes a plain-English trust brief
            for holders, moderators, and launch communities.
          </p>
          <div className="stat-strip">
            <div className="stat"><strong>Live BSC</strong><span>RPC and BscScan evidence</span></div>
            <div className="stat"><strong>AI Analyst</strong><span>OpenAI with Gemini fallback</span></div>
            <div className="stat"><strong>No wallet</strong><span>Read-only lookup, no private keys</span></div>
            <div className="stat"><strong>Meme-ready</strong><span>Posts, captions, share card</span></div>
          </div>
        </div>
      </section>

      <section className="shell" style={{ padding: "24px 0" }}>
        <div className="lookup-grid">
          <section className="card" style={{ padding: 22 }}>
            <p className="eyebrow" style={{ margin: 0 }}>Token lookup</p>
            <h2 className="section-title">Check a BNB Chain token</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
              Enter the contract address for any BEP-20 style token. The live scan reads public chain data only:
              no wallet connect, no signing, no trading, and no token approval.
            </p>
            <label htmlFor="token">Token contract address</label>
            <div className="input-row" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginTop: 8 }}>
              <input id="token" className="input" placeholder="0x..." value={address} onChange={(event) => setAddress(event.target.value)} />
              <button className="btn" onClick={() => run("live")} disabled={loading || !address.trim()}>
                {loading ? "Analyzing..." : "Analyze token"}
              </button>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>
              Live analysis uses BNB Chain RPC, BscScan, OpenAI, Gemini fallback, and optional social providers when configured.
              If a provider is unavailable, MemeGuard still returns a partial report with warnings.
            </p>
            {error ? <p style={{ color: "var(--red)" }}>{error}</p> : null}
          </section>

          <section className="card" style={{ padding: 22 }}>
            <p className="eyebrow" style={{ margin: 0 }}>Demo data</p>
            <h2 className="section-title">Try guided examples</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
              Demo reports are built-in examples that explain how the scoring works when live API keys or network access
              are unavailable. They are not real token endorsements.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {SAMPLE_REPORTS.map((sample) => (
                <button className="demo-card" key={sample.id} onClick={() => runDemo(sample.token.address)} disabled={loading}>
                  <strong>{sample.token.name ?? "Unknown token"}</strong>
                  <span style={{ display: "block", color: "var(--muted)", marginTop: 4 }}>
                    {sample.score.category} example: {sample.score.summary}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>

      {report ? (
        <section className="shell" style={{ display: "grid", gap: 16, padding: "18px 0 40px" }}>
          <div className="grid-auto">
            <RiskScore report={report} />
            <section className="card" style={{ padding: 20 }}>
              <h2 style={{ marginTop: 0 }}>{report.token.symbol ?? "Token"}</h2>
              <p>{report.token.name ?? "Unknown token"} on BNB Smart Chain</p>
              <p style={{ wordBreak: "break-word", color: "var(--muted)" }}>{report.token.address}</p>
              {report.publicUrl ? <a href={report.publicUrl}>Open public report</a> : null}
              <p style={{ color: "var(--muted)" }}>Informational only. Not financial advice.</p>
            </section>
          </div>
          {report.warnings.length ? (
            <section className="card" style={{ padding: 20 }}>
              <h2 style={{ marginTop: 0 }}>Warnings</h2>
              <ul>{report.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
            </section>
          ) : null}
          <TrustBrief report={report} />
          <SignalList signals={report.signals} />
          <EvidenceTable report={report} />
          <MemePackPanel report={report} />
          <ShareCard report={report} />
        </section>
      ) : null}
    </main>
  );
}
