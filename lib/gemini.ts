"use client";

export const callGemini = async (
  prompt: string,
  systemInstruction: string = "",
  useSearch: boolean = false
): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  if (!apiKey) {
    return "Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.";
  }

  const payload: any = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
  };

  if (useSearch) {
    payload.tools = [{ google_search: {} }];
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Could not generate content. Please try again."
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error. Please check your internet.";
  }
};
