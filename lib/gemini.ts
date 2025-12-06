"use client";

type GeminiPart = { text?: string };
type GeminiContent = { parts?: GeminiPart[] };
type GeminiCandidate = { content?: GeminiContent };
interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: { message?: string };
}

export async function callGemini(
  prompt: string,
  systemInstruction: string = "",
  useSearch: boolean = false
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return "Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.";
  }

  // Base payload
  const payload: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  // ✅ Correct field name is `system_instruction` (snake_case)
  if (systemInstruction.trim().length > 0) {
    (payload as any).system_instruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  // ✅ Only attach tools when search is enabled
  if (useSearch) {
    (payload as any).tools = [{ google_search: {} }];
  }

  try {
    const response = await fetch(
      // You can change the model here if needed
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" +
        `?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("Gemini API HTTP Error:", response.status, text);
      return "Gemini API returned an error. Please try again.";
    }

    const data = (await response.json()) as GeminiResponse;

    if (data.error?.message) {
      return `Gemini API error: ${data.error.message}`;
    }

    const generated =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

    if (typeof generated === "string" && generated.trim().length > 0) {
      return generated;
    }

    return "Could not generate content. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error. Please check your internet.";
  }
}
