import { test } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// Node's TypeScript support does not resolve extensionless imports like Next.js does.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try { return nextResolve(specifier, context); } catch (error) {
      if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) return nextResolve(specifier + ".ts", context);
      throw error;
    }
  },
});
const { publicPrices, formatPublicPrice } = await import("../src/data/public-prices.ts");
const { catalogue } = await import("../src/app/invoice/catalogue.ts");

test("every public starting price is used by its corresponding invoice item", () => {
  const mappings = {
    essentials: ["Social Media Management", "Essentials"],
    growth: ["Social Media Management", "Growth"],
    complete: ["Social Media Management", "Complete"],
    websiteSetup: ["Website Setup", "Website Setup"],
    websiteCare: ["Website Care", "Website Care"],
    seoAudit: ["SEO Audit", "SEO Audit"],
    crmSetup: ["CRM Setup", "CRM Setup"],
    automationBuild: ["Automation Build", "Automation Build"],
  };
  assert.deepEqual(Object.keys(mappings).sort(), Object.keys(publicPrices).sort());
  for (const [key, [category, name]] of Object.entries(mappings)) {
    const matches = catalogue.filter(item => item.category === category && item.name === name);
    assert.equal(matches.length, 1, name);
    assert.equal(matches[0].price, publicPrices[key], name);
    assert.equal(matches[0].starting, true, name);
  }
});

test("public prices retain dollar formatting including fractional amounts", () => {
  assert.equal(formatPublicPrice(1100), "$1,100");
  assert.equal(formatPublicPrice(1250.5), "$1,250.50");
});
