import type { OpenAIModel } from "../actions";

export function requestCompletion(
  activeKey: string,
  model: OpenAIModel,
  systemPrompt: string,
  userPrompt: string,
  signal: AbortSignal,
) {
  return fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${activeKey}`,
    },
    body: JSON.stringify({
      model,
      reasoning: { effort: "low" },
      input: [
        { role: "developer", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    signal,
  });
}
