import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PersonHint = z.object({
  id: z.string(),
  name: z.string(),
  relation: z.string(),
  iso2: z.string(),
});

const ParseInput = z.object({
  text: z.string().min(1).max(280),
  people: z.array(PersonHint).max(20),
  sendCurrency: z.enum(["GBP", "USD", "EUR"]),
});

export type ParsedIntent = {
  personId: string | null;
  personHint: string | null;
  iso2: string | null;
  amount: number | null;
  amountCurrency: string | null;
  mode: "they_receive" | "you_send";
  purpose: string | null;
  railHint: string | null;
  summary: string;
};

async function chatJson(system: string, user: string, maxTokens: number) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return { ok: false as const, error: "AI is not available" };

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(12000),
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.2,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: `xAI API error ${res.status}` };
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = body.choices?.[0]?.message?.content ?? "";
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      return { ok: true as const, json: JSON.parse(cleaned) as unknown };
    } catch {
      return { ok: false as const, error: "Could not read that" };
    }
  } catch {
    return { ok: false as const, error: "AI is not available" };
  }
}

export const parseSendIntent = createServerFn({ method: "POST" })
  .validator((input: unknown) => ParseInput.parse(input))
  .handler(async ({ data }): Promise<{ ok: true; intent: ParsedIntent } | { ok: false; error: string }> => {
    const result = await chatJson(
      `You parse remittance intents for Cush Payments, a licensed African money app.
Return JSON only with keys:
personId (string|null — must be one of the provided ids if you can match),
personHint (string|null),
iso2 (lowercase 2-letter African country code or null),
amount (number|null),
amountCurrency (ISO 4217 or null),
mode ("they_receive" if they spoke in the recipient currency or said "send them X", else "you_send"),
purpose (short noun: Rent, School, Family, Medical, Business, or null),
railHint (mtn|mpesa|orange|wave|airtel|bank|null),
summary (one calm sentence confirming what you understood).
If they name a person, match it. If they say cedis, use GHS and gh. Naira = NGN/ng. Bob/Kenyan shillings = KES/ke. CFA = XOF and guess sn or ci from context.`,
      `Send currency: ${data.sendCurrency}.
People: ${JSON.stringify(data.people)}.
Utterance: ${data.text}`,
      280,
    );
    if (!result.ok) return result;
    const j = result.json as Partial<ParsedIntent>;
    const intent: ParsedIntent = {
      personId: typeof j.personId === "string" ? j.personId : null,
      personHint: typeof j.personHint === "string" ? j.personHint : null,
      iso2: typeof j.iso2 === "string" ? j.iso2.toLowerCase() : null,
      amount: typeof j.amount === "number" ? j.amount : null,
      amountCurrency: typeof j.amountCurrency === "string" ? j.amountCurrency : null,
      mode: j.mode === "you_send" ? "you_send" : "they_receive",
      purpose: typeof j.purpose === "string" ? j.purpose : null,
      railHint: typeof j.railHint === "string" ? j.railHint : null,
      summary:
        typeof j.summary === "string"
          ? j.summary
          : "Ready when you are.",
    };
    if (intent.personId && !data.people.some((p) => p.id === intent.personId)) {
      intent.personId = null;
    }
    return { ok: true, intent };
  });

const AdviceInput = z.object({
  iso2: z.string().length(2),
  countryName: z.string(),
  currency: z.string(),
  sendCurrency: z.enum(["GBP", "USD", "EUR"]),
  rate: z.number(),
  vs7dPct: z.number(),
  vs30dPct: z.number(),
  purpose: z.string().optional(),
  usualDay: z.number().optional(),
  season: z.string().optional(),
});

export const adviseSendTiming = createServerFn({ method: "POST" })
  .validator((input: unknown) => AdviceInput.parse(input))
  .handler(async ({ data }): Promise<{ ok: true; headline: string; body: string; action: "send_now" | "wait" | "either" } | { ok: false; error: string }> => {
    const result = await chatJson(
      `You are Cush Pulse, a calm FX aide for the African diaspora sending money home.
Be concrete, never hype. No emojis. Cush has no FX markup and a 1.8% fee.
Return JSON: headline (max 80 chars), body (2 short sentences), action ("send_now"|"wait"|"either").
If the local currency is stronger vs 30d average, lean send_now. If it just jumped unusually, you may say wait a day. If the user has a usual send day today or a season note, mention it plainly.`,
      JSON.stringify(data),
      220,
    );
    if (!result.ok) return result;
    const j = result.json as {
      headline?: string;
      body?: string;
      action?: string;
    };
    const action =
      j.action === "wait" || j.action === "either" || j.action === "send_now"
        ? j.action
        : "either";
    return {
      ok: true,
      headline: j.headline || "Send when they need it.",
      body:
        j.body ||
        "The 1.8% fee does not change. Rate moves of a percent either way matter less than getting money there on time.",
      action,
    };
  });
