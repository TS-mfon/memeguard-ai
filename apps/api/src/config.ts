export const config = {
  port: Number(process.env.PORT ?? 4000),
  apiBaseUrl: process.env.API_BASE_URL ?? `http://localhost:${process.env.PORT ?? 4000}`,
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  bscRpcUrl: process.env.BSC_RPC_URL ?? "https://bsc-dataseed.bnbchain.org",
  bscScanApiKey: process.env.BSCSCAN_API_KEY ?? "",
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
  exaApiKey: process.env.EXA_API_KEY ?? "",
  xBearerToken: process.env.X_BEARER_TOKEN ?? "",
  useSampleData: process.env.USE_SAMPLE_DATA === "true",
  enableSocialContext: process.env.ENABLE_SOCIAL_CONTEXT !== "false"
};
