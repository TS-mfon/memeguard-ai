import OpenAI from "openai";
import { AiReportSchema, fallbackAiReport, type AnalysisReport } from "@memeguard/shared";
import { config } from "../config.js";

export async function generateAiReport(report: Pick<AnalysisReport, "score" | "signals" | "warnings" | "token" | "contract" | "marketActivity" | "socialContext">) {
  if (!config.openAiApiKey) {
    return generateGeminiReport(report);
  }

  const client = new OpenAI({ apiKey: config.openAiApiKey });
  try {
    const response = await client.responses.create({
      model: config.openAiModel,
      input: [
        {
          role: "system",
          content:
            "You are MemeGuard Analyst, an AI due-diligence assistant for memecoin communities. Use only supplied evidence. Never give financial advice. Never claim a token is safe. Return strict JSON."
        },
        {
          role: "user",
          content: `Analyze this evidence and return JSON with fields title, verdict, confidence, summary, redFlags, positiveSignals, missingData, recommendedActions, moderatorNote, plainEnglishExplanation:\n${JSON.stringify(report)}`
        }
      ]
    });
    const text = response.output_text;
    const parsed = AiReportSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : fallbackAiReport(report);
  } catch {
    return generateGeminiReport(report);
  }
}

async function generateGeminiReport(report: Pick<AnalysisReport, "score" | "signals" | "warnings" | "token" | "contract" | "marketActivity" | "socialContext">) {
  if (!config.geminiApiKey) {
    return fallbackAiReport(report);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "You are MemeGuard Analyst. Use only supplied evidence. Never give financial advice. Never claim a token is safe. Return strict JSON with fields title, verdict, confidence, summary, redFlags, positiveSignals, missingData, recommendedActions, moderatorNote, plainEnglishExplanation.\n\nEvidence:\n" +
                    JSON.stringify(report)
                }
              ]
            }
          ],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );
    const json = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return fallbackAiReport(report);
    const parsed = AiReportSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : fallbackAiReport(report);
  } catch {
    return fallbackAiReport(report);
  }
}
