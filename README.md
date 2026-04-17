# MemeGuard AI

AI trust briefs for memecoin launches on BNB Chain.

MemeGuard AI is a production-style lookup dapp for the Four.meme AI Sprint. It helps users, moderators, and memecoin communities inspect a BNB Smart Chain token before they amplify it.

Paste a token contract address. MemeGuard AI reads public chain/explorer evidence, scores launch risk, and generates a plain-English trust brief plus X, Telegram, Discord, and meme-ready copy.

## What Are We Building?

MemeGuard AI is a read-only token intelligence dapp for BNB Chain memecoins.

It provides:

- Live BNB Smart Chain token lookup.
- BscScan contract enrichment.
- AI-generated trust briefs.
- Explainable 0-100 risk scoring.
- Shareable community posts and meme captions.
- Exportable report card.
- Telegram and Discord bot endpoints.
- Public API for other agents or community tools.

It does not connect wallets, sign transactions, issue tokens, or trade.

## What Does The AI Actually Do?

The AI does not guess whether a token will go up or down. It interprets evidence.

MemeGuard Analyst receives:

- Token metadata from BNB Chain RPC.
- Contract source status from BscScan.
- Creator and ownership signals.
- Transfer activity heuristics.
- Social/search context when configured.
- Deterministic risk signals.

Then it generates:

- Red flags.
- Positive signals.
- Missing data.
- Moderator note.
- Plain-English explanation.
- X/Telegram/Discord copy.
- Responsible meme captions.

The AI is instructed to use only supplied evidence, refuse financial advice, and never claim a token is safe.

## What Makes It Different?

Most token tools either show raw explorer data or opaque risk scores. MemeGuard AI connects the two.

What is different:

- It shows the raw evidence behind every score.
- It turns contract risk into language normal users can understand.
- It is built for memecoin communities, not only security researchers.
- It generates internet-native copy without fake hype or buy/sell advice.
- It is read-only, so it never asks users for a wallet or private key.
- It supports live production APIs while still having demo data for hackathon reliability.

## What Stage Are We At Right Now?

The current project includes:

- Working Next.js frontend.
- Working Fastify backend.
- Shared TypeScript schemas and scoring engine.
- BNB Chain RPC adapter.
- BscScan adapter.
- OpenAI analyst integration.
- Gemini fallback integration.
- Social/search provider placeholders.
- Telegram webhook endpoint.
- Discord interaction endpoint.
- Exportable share-card component.
- Render deployment config.
- Vercel deployment config.

The app is ready for production deployment once Vercel and Render environment variables are set.

## What Gap Does It Fill On BNB Chain?

BNB Chain has fast retail activity, active memecoin launches, and strong community culture. The gap is accessible pre-amplification due diligence.

MemeGuard AI gives BNB Chain communities a lightweight trust layer:

- Users can check a token before sharing it.
- Moderators can ask for evidence before pinning a launch.
- Launch teams can show transparency signals.
- Community voters can compare projects using readable evidence.
- Ecosystem partners get an AI tool that improves launch quality without blocking culture.

## Architecture

```text
apps/web      Vercel-hosted Next.js frontend
apps/api      Render-hosted Fastify backend
packages/shared
              Zod schemas, samples, scoring, generators
```

Flow:

```text
User -> Vercel site -> Render API -> BNB RPC
                             -> BscScan
                             -> OpenAI
                             -> Gemini fallback
                             -> Optional social/search providers
```

There is no database requirement. The product is a public lookup tool, not an authenticated app. Public report links are cached in memory while the backend process is running; the core product is the live lookup flow.

## Supported Providers

Configured:

- BNB Smart Chain RPC
- BscScan API
- OpenAI
- Gemini fallback
- Telegram bot token
- X bearer token

Supported but not configured unless keys are added:

- Exa/search provider for richer social context
- Discord bot credentials
- Custom BSC RPC provider
- Monitoring provider such as Sentry

When a provider is not configured, MemeGuard still works and returns a warning or fallback result where possible.

## API Key Policy

Never commit real secrets to the repo.

Use Vercel and Render environment variables for production secrets.

Required for best production behavior:

- `BSCSCAN_API_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `CORS_ORIGINS`

Recommended:

- `GEMINI_API_KEY`
- `BSC_RPC_URL`
- `X_BEARER_TOKEN`
- `TELEGRAM_BOT_TOKEN`

Placeholders for supported but not configured functionality:

- `EXA_API_KEY`
- `DISCORD_BOT_TOKEN`
- `DISCORD_PUBLIC_KEY`
- `DISCORD_APPLICATION_ID`

Not required:

- Wallet private key
- Seed phrase
- Exchange API key
- Trading credentials
- Database URL

## Environment Variables

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

PORT=4000
API_BASE_URL=http://localhost:4000
CORS_ORIGINS=http://localhost:3000

BSC_CHAIN_ID=56
BSC_RPC_URL=https://bsc-dataseed.bnbchain.org
BSCSCAN_API_KEY=

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

EXA_API_KEY=
X_BEARER_TOKEN=
TELEGRAM_BOT_TOKEN=
DISCORD_BOT_TOKEN=
DISCORD_PUBLIC_KEY=
DISCORD_APPLICATION_ID=

USE_SAMPLE_DATA=false
ENABLE_SOCIAL_CONTEXT=true
ENABLE_BOTS=true
ENABLE_RATE_LIMIT=true
ADMIN_API_TOKEN=
```

## Local Development

```bash
cd /home/sudodave/memeguard-ai
npm install
npm run dev
```

Web:

```bash
npm run dev --workspace @memeguard/web
```

API:

```bash
npm run dev --workspace @memeguard/api
```

## Production Build

```bash
npm test
npm run lint
npm run build
```

## Vercel Deployment

Deploy `apps/web` to Vercel.

Set these Vercel environment variables:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_APP_URL`

Commands:

```bash
cd apps/web
vercel link
vercel deploy --prod
```

## Render Deployment

Deploy the backend from this repo with `render.yaml`.

Render service:

- Runtime: Node
- Build command: `npm install --include=dev && npm run build --workspace @memeguard/shared && npm run build --workspace @memeguard/api`
- Start command: `npm run start --workspace @memeguard/api`
- Health check: `/health`

Set these Render environment variables:

- `NODE_ENV=production`
- `CORS_ORIGINS=<Vercel production URL>`
- `NEXT_PUBLIC_APP_URL=<Vercel production URL>`
- `BSCSCAN_API_KEY`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `X_BEARER_TOKEN`
- `TELEGRAM_BOT_TOKEN`

Optional placeholders:

- `EXA_API_KEY`
- `DISCORD_BOT_TOKEN`
- `DISCORD_PUBLIC_KEY`
- `DISCORD_APPLICATION_ID`

## API Reference

### `POST /api/analyze`

```json
{
  "tokenAddress": "0x0000000000000000000000000000000000000000",
  "chainId": 56,
  "mode": "live",
  "save": true,
  "includeSocial": true,
  "includeMemePack": true
}
```

### `GET /api/reports/slug/:slug`

Returns an in-memory report or bundled demo report.

### `POST /api/bot/analyze`

Returns compact bot-friendly analysis.

### `POST /api/bot/telegram/webhook`

Telegram webhook for `/analyze 0xTokenAddress`.

### `POST /api/bot/discord/interactions`

Discord slash-command interaction endpoint.

### `GET /api/docs/openapi.json`

OpenAPI metadata for agents and builders.

## What Are The Demo Cards?

The dashboard includes guided demo examples. They are sample reports for explaining how MemeGuard scores different risk patterns when API keys or live network access are unavailable.

They are not real token endorsements and not investment examples.

## Why No Database?

There is no user authentication, no saved user profile, and no trading activity. Users come to the site, paste a token, and receive a report.

Because of that, a database would add deployment complexity without improving the core lookup experience. The app keeps generated reports in memory during runtime and always supports live re-analysis.

## 2-Minute Demo Script

1. Open the Vercel site.
2. Paste a BNB Chain token contract address.
3. Run analysis.
4. Show BNB RPC and BscScan evidence.
5. Show score and signal breakdown.
6. Show the AI trust brief.
7. Show community copy for X, Telegram, and Discord.
8. Export the share card.
9. Explain that demo cards exist only for no-key hackathon reliability.
10. Explain that MemeGuard is read-only and requires no private key.

## Safety Disclaimer

MemeGuard AI is informational only. It is not financial advice, legal advice, trading advice, or a security audit. It cannot guarantee that a token is safe. Users should verify independently before making decisions.

## License

MIT
