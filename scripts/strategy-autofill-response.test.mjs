import { test } from "node:test";
import assert from "node:assert/strict";
import { extractResponseText } from "../src/app/strategy/autofill/response.ts";

test("prefers a nonempty top-level response", () => {
  assert.equal(
    extractResponseText({
      output_text: "  Answer  ",
      output: [{ content: [{ type: "output_text", text: "Other" }] }],
    }),
    "Answer",
  );
});

test("joins text content while ignoring non-text parts", () => {
  assert.equal(
    extractResponseText({
      output_text: " ",
      output: [
        {
          content: [
            { type: "reasoning", text: "hidden" },
            { type: "output_text", text: " First " },
          ],
        },
        { content: [{ type: "text", text: "Second" }] },
      ],
    }),
    "First\n\nSecond",
  );
  assert.equal(extractResponseText({}), "");
});
