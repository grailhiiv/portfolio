export function extractResponseText(payload: {
  output_text?: string;
  output?: { content?: { type?: string; text?: string }[] }[];
}): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }
  return (payload.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter(
      (part) =>
        (part.type === "output_text" || part.type === "text") &&
        typeof part.text === "string",
    )
    .map((part) => part.text!.trim())
    .filter(Boolean)
    .join("\n\n");
}
