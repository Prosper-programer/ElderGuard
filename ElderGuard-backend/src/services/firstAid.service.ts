/**
 * FIRST AID SERVICE
 *
 * Business logic layer for first-aid protocol delivery.
 *
 * Flow:
 *  1. Load the fixed, predefined protocol from firstAidProtocols.ts
 *  2. If GEMINI_API_KEY is configured and the request opts in,
 *     call Gemini for an optional contextual tip ONLY.
 *     The AI tip never replaces or modifies the protocol steps.
 *  3. Return the merged response.
 *
 * The fixed protocol always wins. This is non-negotiable for safety.
 */

import { getProtocol, FirstAidProtocol } from '../data/firstAidProtocols';

export interface FirstAidResponse {
  emergencyType: string;
  title: string;
  severity: 'high' | 'critical';
  disclaimer: string;
  steps: FirstAidProtocol['steps'];
  contextualTip?: string;
  source: 'offline' | 'ai-enhanced';
  lastUpdated: string;
}

const GEMINI_TIMEOUT_MS = 5000; // 5 seconds — don't make emergencies wait for AI

/**
 * Fetch an optional contextual tip from Gemini.
 * This is a best-effort call — any failure silently returns undefined.
 * The AI tip is clearly separated from the core protocol steps.
 */
async function fetchGeminiContextualTip(emergencyType: string): Promise<string | undefined> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  if (!apiKey) return undefined;

  const prompt =
    `You are an assistant helping caregivers of elderly people during a "${emergencyType}" emergency. ` +
    `In 1–2 sentences, provide a single calm, reassuring contextual tip for a caregiver who is ` +
    `already following the standard first-aid protocol. ` +
    `Do NOT provide medical instructions — those are already covered. ` +
    `Focus on a supportive, practical reminder (e.g. emotional support, staying calm, what to tell the dispatcher). ` +
    `Reply with ONLY the tip text, no preamble.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 80,
          },
        }),
      }
    );

    if (!response.ok) return undefined;

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const tip = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return tip || undefined;
  } catch {
    // Timeout, network error, or invalid response — silently fail
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Get the first-aid protocol for a given emergency type.
 *
 * @param type - Emergency type: fall | cardiac | stroke | choking | breathing
 * @param useAiTip - Whether to attempt an AI contextual tip (default: true)
 */
export async function getFirstAidResponse(
  type: string,
  useAiTip = true
): Promise<FirstAidResponse | null> {
  const protocol = getProtocol(type);
  if (!protocol) return null;

  let contextualTip: string | undefined;
  let source: 'offline' | 'ai-enhanced' = 'offline';

  if (useAiTip) {
    contextualTip = await fetchGeminiContextualTip(type);
    if (contextualTip) {
      source = 'ai-enhanced';
    }
  }

  return {
    emergencyType: protocol.emergencyType,
    title: protocol.title,
    severity: protocol.severity,
    disclaimer: protocol.disclaimer,
    steps: protocol.steps,      // Fixed protocol — never modified by AI
    contextualTip,              // Optional AI enhancement — clearly separate
    source,
    lastUpdated: protocol.lastUpdated,
  };
}
