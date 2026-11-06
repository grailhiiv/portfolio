export const MAX_AUDIT_IMAGE_BYTES = 25_000_000;
export const MAX_AUDIT_TOTAL_BYTES = 50_000_000;
export const MAX_AUDIT_IMAGES = 12;

export function auditImageDataSize(dataUrl: string): number | null {
  const match = /^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/]*={0,2})$/.exec(dataUrl);
  if (!match || match[1].length % 4 !== 0) return null;
  const padding = match[1].endsWith("==") ? 2 : match[1].endsWith("=") ? 1 : 0;
  return match[1].length / 4 * 3 - padding;
}
