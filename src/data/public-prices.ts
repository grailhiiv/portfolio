// Update public starting prices here; the pricing page and invoice catalogue share them.
export const publicPrices = {
  essentials: 650,
  growth: 1100,
  complete: 1750,
  websiteSetup: 1200,
  websiteCare: 250,
  seoAudit: 450,
  crmSetup: 600,
  automationBuild: 750,
} as const;

export function formatPublicPrice(price: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: Number.isInteger(price) ? 0 : 2, maximumFractionDigits: 2 }).format(price);
}
