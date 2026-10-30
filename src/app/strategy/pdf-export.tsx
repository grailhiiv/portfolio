import React from "react";
import { Document, Font, Page, StyleSheet, Svg, Line, Path, Text, View, pdf } from "@react-pdf/renderer";
import { getActiveBusinessFields, type Draft } from "./schema";

// Disable mid-word hyphenation so headings and body copy wrap cleanly at word boundaries
Font.registerHyphenationCallback(word => [word]);

export type PdfEdition = "client" | "playbook";

type ParsedSection = {
  id: string;
  key:
    | "title"
    | "objective"
    | "audience"
    | "niche"
    | "opportunities"
    | "diagnostics"
    | "execution"
    | "soar"
    | "services"
    | "roadmap"
    | "measurement"
    | "custom";
  title: string;
  rawBody: string;
  lines: string[];
};

type SubBlock = {
  heading: string;
  items: string[];
};

// Exact palette from the reference presentation deck
const C = {
  WHITE: "#FFFFFF",
  INK: "#111111",
  MUTED: "#4A4A4A",
  BLUE: "#2B479B",
  BLUE_DEEP: "#20377C",
  BLUE_SOFT: "#3755B0",
  LIME: "#B3CC57",
  LIME_CHECK: "#A6BF4B",
  PERIWINKLE: "#C8D0EC",
  GRAY_CHECK: "#F2F2F2",
  GRAY_PANEL: "#F5F6FA",
};

const SLIDE_SIZE: [number, number] = [960, 540]; // 16:9 widescreen presentation

const styles = StyleSheet.create({
  slideWhite: {
    width: 960,
    height: 540,
    backgroundColor: C.WHITE,
    color: C.INK,
    fontFamily: "Helvetica",
    position: "relative",
    overflow: "hidden",
  },
  slideBlue: {
    width: 960,
    height: 540,
    backgroundColor: C.BLUE,
    color: C.WHITE,
    fontFamily: "Helvetica",
    position: "relative",
    overflow: "hidden",
  },
  slideLime: {
    width: 960,
    height: 540,
    backgroundColor: C.LIME,
    color: C.INK,
    fontFamily: "Helvetica",
    position: "relative",
    overflow: "hidden",
  },
  // Cover & Closing 4-corner metadata
  cornerTopRow: {
    position: "absolute",
    top: 48,
    left: 54,
    right: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cornerBottomRow: {
    position: "absolute",
    bottom: 42,
    left: 54,
    right: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cornerMetaText: {
    fontSize: 11.5,
    color: C.INK,
    letterSpacing: 0.4,
    lineHeight: 1.35,
    textTransform: "uppercase",
  },
  coverCenterWrap: {
    position: "absolute",
    top: 138,
    left: 48,
    right: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  coverEyebrow: {
    fontSize: 18,
    color: C.INK,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 24,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  highlightBox: {
    backgroundColor: C.PERIWINKLE,
    paddingHorizontal: 14,
    paddingVertical: 6,
    position: "relative",
  },
  plainTitleBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  coverGiantText: {
    fontSize: 68,
    color: C.INK,
    letterSpacing: -2.2,
    lineHeight: 1.02,
    textTransform: "uppercase",
  },
  cursorBarLeft: {
    position: "absolute",
    left: -2,
    top: -8,
    bottom: 0,
    width: 3.5,
    backgroundColor: C.BLUE,
  },
  cursorDotTop: {
    position: "absolute",
    left: -6.25,
    top: -13,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.BLUE,
  },
  cursorBarRight: {
    position: "absolute",
    right: -2,
    top: 0,
    bottom: -8,
    width: 3.5,
    backgroundColor: C.BLUE,
  },
  cursorDotBottom: {
    position: "absolute",
    right: -6.25,
    bottom: -13,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.BLUE,
  },
  // Display headings matching sample
  displayBlueLeft: {
    fontSize: 58,
    color: C.BLUE,
    letterSpacing: -2.2,
    lineHeight: 0.94,
    textTransform: "uppercase",
  },
  displayBlueRight: {
    fontSize: 58,
    color: C.BLUE,
    letterSpacing: -2.2,
    lineHeight: 0.94,
    textTransform: "uppercase",
    textAlign: "right",
  },
  displayBlueCenter: {
    fontSize: 60,
    color: C.BLUE,
    letterSpacing: -2.2,
    lineHeight: 0.94,
    textTransform: "uppercase",
    textAlign: "center",
  },
  displayLimeLeft: {
    fontSize: 60,
    color: C.LIME,
    letterSpacing: -2.2,
    lineHeight: 0.94,
    textTransform: "uppercase",
  },
  // Number markers (001), (002), (003)
  numTagDark: {
    fontSize: 13.5,
    fontFamily: "Helvetica-Bold",
    color: C.INK,
    marginBottom: 10,
  },
  numTagDarkRight: {
    fontSize: 13.5,
    fontFamily: "Helvetica-Bold",
    color: C.INK,
    textAlign: "right",
    marginBottom: 10,
  },
  numTagDarkCenter: {
    fontSize: 13.5,
    fontFamily: "Helvetica-Bold",
    color: C.INK,
    textAlign: "center",
    marginBottom: 12,
  },
  numTagWhite: {
    fontSize: 13.5,
    fontFamily: "Helvetica-Bold",
    color: C.WHITE,
    marginBottom: 10,
  },
  // Two-column editorial body text
  twoColRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  twoColCell: {
    width: "48.2%",
  },
  bodyDark: {
    fontSize: 9.2,
    lineHeight: 1.38,
    color: C.INK,
  },
  bodyDarkSpan: {
    fontSize: 9.2,
    lineHeight: 1.38,
    color: C.INK,
    marginTop: 6,
  },
  bodyWhite: {
    fontSize: 9.2,
    lineHeight: 1.38,
    color: C.WHITE,
  },
  bodyWhiteSpan: {
    fontSize: 9.2,
    lineHeight: 1.38,
    color: C.WHITE,
    marginTop: 6,
  },
  // Slide 2 TOC styles
  tocRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9.5,
    borderBottomWidth: 1.2,
    borderBottomColor: C.WHITE,
  },
  tocLabel: {
    fontSize: 21,
    fontFamily: "Helvetica-Bold",
    color: C.WHITE,
    letterSpacing: -0.4,
    textTransform: "uppercase",
  },
  tocNum: {
    fontSize: 21,
    fontFamily: "Helvetica",
    color: C.WHITE,
  },
});

function cleanLine(line: string): string {
  return line
    .replace(/^#{1,6}\s*/, "")
    .replace(/^\*\*(.+?)\*\*$/, "$1")
    .trim();
}

function stripBulletPrefix(line: string): string {
  return line.replace(/^[-*•]\s+/, "").replace(/^\d+\.\s+/, "").trim();
}

function classifyHeading(rawHeading: string): {
  key: ParsedSection["key"];
  cleanTitle: string;
} | null {
  const trimmed = cleanLine(rawHeading);
  if (!trimmed) return null;

  if (/^[-*•]\s/.test(rawHeading.trim()) || trimmed.length > 95) {
    return null;
  }

  const withoutNum = trimmed.replace(/^\d+[\.\)]\s*/, "").trim();
  const lower = withoutNum.toLowerCase();

  if (
    /^(lead proposal|client strategy)\s*[—–-]/i.test(withoutNum) ||
    lower.startsWith("title line")
  ) {
    return { key: "title", cleanTitle: withoutNum.replace(/^title line[:\s-]*/i, "").trim() };
  }
  if (/^objective\b/i.test(lower) || /^primary objective\b/i.test(lower)) {
    return { key: "objective", cleanTitle: "Objective" };
  }
  if (/^target audience\b/i.test(lower) || /^audience\b/i.test(lower)) {
    return { key: "audience", cleanTitle: "Target Audience" };
  }
  if (/^industry\s*&\s*niche context\b/i.test(lower) || /^niche context\b/i.test(lower)) {
    return { key: "niche", cleanTitle: "Industry & Niche Context" };
  }
  if (/^opportunities\b/i.test(lower) || /^key opportunities\b/i.test(lower)) {
    return { key: "opportunities", cleanTitle: "Opportunities & Research Insights" };
  }
  if (
    /^internal diagnostic frameworks\b/i.test(lower) ||
    /^diagnostic frameworks\b/i.test(lower)
  ) {
    return { key: "diagnostics", cleanTitle: "Internal Diagnostic Frameworks" };
  }
  if (
    /^strategy to apply\b/i.test(lower) ||
    /^internal execution playbook\b/i.test(lower)
  ) {
    return { key: "execution", cleanTitle: "Strategy to Apply" };
  }
  if (
    /^what to tell the client\b/i.test(lower) ||
    /^client-facing narrative\b/i.test(lower) ||
    /^soar\b/i.test(lower)
  ) {
    return { key: "soar", cleanTitle: "Strategic Narrative (SOAR)" };
  }
  if (/^recommended services\b/i.test(lower) || /^service recommendations\b/i.test(lower)) {
    return { key: "services", cleanTitle: "Recommended Services" };
  }
  if (
    /^30\s*\/\s*60\s*\/\s*90\s*day roadmap\b/i.test(lower) ||
    /^roadmap\b/i.test(lower) ||
    /^30\/60\/90\b/i.test(lower)
  ) {
    return { key: "roadmap", cleanTitle: "30 / 60 / 90 Day Roadmap" };
  }
  if (/^measurement\b/i.test(lower) || /^kpis?\s*(&|and)\s*measurement\b/i.test(lower)) {
    return { key: "measurement", cleanTitle: "Measurement & KPIs" };
  }

  if (/^(?:[1-9]|10)[\.\)]\s+[A-Z]/.test(trimmed) && !trimmed.includes(": ")) {
    return { key: "custom", cleanTitle: withoutNum };
  }

  return null;
}

export function parseStrategySections(strategyText: string): ParsedSection[] {
  const rawLines = strategyText.replace(/\r\n/g, "\n").split("\n");
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    const match = classifyHeading(trimmed);

    if (match) {
      if (match.key === "title" && sections.length === 0 && !current) {
        current = {
          id: "title-0",
          key: "title",
          title: match.cleanTitle,
          rawBody: "",
          lines: [],
        };
        sections.push(current);
        continue;
      }

      current = {
        id: `${match.key}-${sections.length}`,
        key: match.key,
        title: match.cleanTitle,
        rawBody: "",
        lines: [],
      };
      sections.push(current);
      continue;
    }

    if (!current) {
      if (!trimmed) continue;
      current = {
        id: "overview-0",
        key: "custom",
        title: "Executive Summary",
        rawBody: "",
        lines: [],
      };
      sections.push(current);
    }

    if (trimmed) {
      current.lines.push(trimmed);
      current.rawBody += (current.rawBody ? "\n" : "") + trimmed;
    }
  }

  return sections.filter(sec => sec.key !== "title" || sec.lines.length > 0);
}

function parseSubBlocks(lines: string[], defaultHeading = "Overview"): SubBlock[] {
  const blocks: SubBlock[] = [];
  let current: SubBlock | null = null;

  for (const raw of lines) {
    const line = cleanLine(raw);
    if (!line) continue;

    const isBullet = /^[-*•]\s+/.test(raw.trim());
    const colonIdx = line.indexOf(":");

    if (!isBullet && colonIdx === -1 && line.length < 75 && /^[A-Z0-9]/.test(line)) {
      current = { heading: line, items: [] };
      blocks.push(current);
      continue;
    }

    if (!isBullet && colonIdx > 0 && colonIdx < 48) {
      const label = line.slice(0, colonIdx).trim();
      const rest = line.slice(colonIdx + 1).trim();
      if (!rest) {
        current = { heading: label, items: [] };
        blocks.push(current);
        continue;
      }
    }

    if (!current) {
      current = { heading: defaultHeading, items: [] };
      blocks.push(current);
    }
    current.items.push(stripBulletPrefix(line));
  }

  return blocks
    .filter(block => block.heading.trim().length > 0)
    .map(block => ({
      ...block,
      items: block.items.length > 0 ? block.items : ["Details to be refined during strategy review."],
    }));
}

function parseSoarCards(lines: string[]): SubBlock[] {
  const buckets: Record<"strengths" | "opportunities" | "aspirations" | "results", SubBlock> = {
    strengths: { heading: "Strengths", items: [] },
    opportunities: { heading: "Opportunities", items: [] },
    aspirations: { heading: "Aspirations", items: [] },
    results: { heading: "Results", items: [] },
  };

  let activeKey: keyof typeof buckets | null = null;
  let matchedSoarHeading = false;

  for (const raw of lines) {
    const cleaned = stripBulletPrefix(cleanLine(raw));
    if (!cleaned) continue;

    const match = cleaned.match(
      /^(strengths|opportunities|aspirations|results)(?:\s*\([^)]*\))?\s*[:—–-]\s*(.*)$/i,
    );
    if (match) {
      const k = match[1].toLowerCase() as keyof typeof buckets;
      activeKey = k;
      matchedSoarHeading = true;
      if (match[2].trim()) {
        buckets[k].items.push(match[2].trim());
      }
      continue;
    }

    const headerOnly = cleaned.match(/^(strengths|opportunities|aspirations|results)(?:\s*\([^)]*\))?$/i);
    if (headerOnly) {
      activeKey = headerOnly[1].toLowerCase() as keyof typeof buckets;
      matchedSoarHeading = true;
      continue;
    }

    if (activeKey) {
      buckets[activeKey].items.push(cleaned);
    }
  }

  if (matchedSoarHeading) {
    return Object.values(buckets);
  }
  return parseSubBlocks(lines, "Strategic Narrative");
}

function parseRoadmapPhases(lines: string[]): SubBlock[] {
  const phases: SubBlock[] = [
    { heading: "Days 1–30 · Foundation", items: [] },
    { heading: "Days 31–60 · Launch & Execution", items: [] },
    { heading: "Days 61–90 · Review & Scale", items: [] },
  ];
  let activeIdx = -1;

  for (const raw of lines) {
    const cleaned = stripBulletPrefix(cleanLine(raw));
    if (!cleaned) continue;

    const m30 = cleaned.match(/^(?:days?\s*1\s*[–-]\s*30|month\s*1|phase\s*1)(?:\s*\([^)]*\))?\s*[:—–-]?\s*(.*)$/i);
    if (m30) {
      activeIdx = 0;
      if (m30[1].trim()) phases[0].items.push(m30[1].trim());
      continue;
    }
    const m60 = cleaned.match(/^(?:days?\s*31\s*[–-]\s*60|month\s*2|phase\s*2)(?:\s*\([^)]*\))?\s*[:—–-]?\s*(.*)$/i);
    if (m60) {
      activeIdx = 1;
      if (m60[1].trim()) phases[1].items.push(m60[1].trim());
      continue;
    }
    const m90 = cleaned.match(/^(?:days?\s*61\s*[–-]\s*90|month\s*3|phase\s*3)(?:\s*\([^)]*\))?\s*[:—–-]?\s*(.*)$/i);
    if (m90) {
      activeIdx = 2;
      if (m90[1].trim()) phases[2].items.push(m90[1].trim());
      continue;
    }

    if (activeIdx >= 0) {
      phases[activeIdx].items.push(cleaned);
    } else {
      phases[0].items.push(cleaned);
    }
  }

  return phases;
}

function clampText(text: string, maxChars = 280): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxChars) return clean;
  return `${clean.slice(0, maxChars - 1).trim()}…`;
}

function splitIntoTwoColumns(items: string[], fallbackLeft: string, fallbackRight: string): {
  left: string;
  right: string;
  bottom?: string;
} {
  const cleaned = items.map(stripBulletPrefix).filter(Boolean);
  if (cleaned.length === 0) {
    return { left: fallbackLeft, right: fallbackRight };
  }
  if (cleaned.length === 1) {
    const sentences = cleaned[0].split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length >= 2) {
      const mid = Math.ceil(sentences.length / 2);
      return {
        left: clampText(sentences.slice(0, mid).join(" "), 260),
        right: clampText(sentences.slice(mid).join(" "), 260),
      };
    }
    return { left: clampText(cleaned[0], 260), right: fallbackRight };
  }
  if (cleaned.length === 2) {
    return {
      left: clampText(cleaned[0], 260),
      right: clampText(cleaned[1], 260),
    };
  }
  const left = clampText(cleaned[0], 240);
  const right = clampText(cleaned[1], 240);
  const bottom = clampText(cleaned.slice(2, 4).join(" · "), 260);
  return { left, right, bottom };
}

// Subtle checkerboard corner pattern from Slides 1, 7, and 10
function CheckerboardCorner({
  top,
  bottom,
  left,
  right,
  color,
  cellSize = 54,
  rows = 4,
  cols = 4,
}: {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  color: string;
  cellSize?: number;
  rows?: number;
  cols?: number;
}) {
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r + c) % 2 === 0) {
        cells.push(
          <View
            key={`${r}-${c}`}
            style={{
              position: "absolute",
              top: r * cellSize,
              left: c * cellSize,
              width: cellSize,
              height: cellSize,
              backgroundColor: color,
            }}
          />,
        );
      }
    }
  }
  return (
    <View
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        width: cols * cellSize,
        height: rows * cellSize,
      }}
    >
      {cells}
    </View>
  );
}

// Numbered Two-Column Editorial Block matching (001) / (002) in sample
function NumberedEditorialBlock({
  num,
  leftText,
  rightText,
  bottomText,
  theme = "dark",
  alignNum = "left",
}: {
  num: string;
  leftText: string;
  rightText: string;
  bottomText?: string;
  theme?: "dark" | "white";
  alignNum?: "left" | "right" | "center";
}) {
  const numStyle =
    theme === "white"
      ? styles.numTagWhite
      : alignNum === "right"
        ? styles.numTagDarkRight
        : alignNum === "center"
          ? styles.numTagDarkCenter
          : styles.numTagDark;
  const textStyle = theme === "white" ? styles.bodyWhite : styles.bodyDark;
  const spanStyle = theme === "white" ? styles.bodyWhiteSpan : styles.bodyDarkSpan;

  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={numStyle}>({num})</Text>
      <View style={styles.twoColRow}>
        <View style={styles.twoColCell}>
          <Text style={textStyle}>{leftText}</Text>
        </View>
        <View style={styles.twoColCell}>
          <Text style={textStyle}>{rightText}</Text>
        </View>
      </View>
      {bottomText ? <Text style={spanStyle}>{bottomText}</Text> : null}
    </View>
  );
}

export function StrategyPdfDocument({ draft, edition }: { draft: Draft; edition: PdfEdition }) {
  const isClientEdition = edition === "client";
  const subjectName = (draft.business.trim() || draft.name.trim() || "NORTHLINE GROUP").toUpperCase();
  const presenterName = "GRAILORD ANTONIO";
  const resolvedBusinessType =
    draft.businessType === "Other"
      ? draft.businessTypeOther.trim() || "Brand & Digital"
      : draft.businessType || "Social Media & Brand";

  const dateLabel = new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  const websiteLabel = (draft.website.trim() || "WWW.GRAILHIIV.COM")
    .replace(/^https?:\/\//i, "")
    .replace(/\/$/, "")
    .toUpperCase();

  const handleLabel = draft.profiles.find(p => p.platform.trim() || p.url.trim())?.platform
    ? `@${(draft.business.trim() || draft.name.trim() || "CLIENT").replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}`
    : "@GRAILHIIV";

  const activeFields = getActiveBusinessFields(draft.businessType)
    .map(f => ({ label: f.label, value: draft.details[f.key]?.trim() || "" }))
    .filter(f => Boolean(f.value));

  const parsedSections = parseStrategySections(draft.strategy);
  const objectiveSection = parsedSections.find(s => s.key === "objective");
  const audienceSection = parsedSections.find(s => s.key === "audience");
  const opportunitiesSection = parsedSections.find(s => s.key === "opportunities");
  const diagnosticsSection = parsedSections.find(s => s.key === "diagnostics");
  const executionSection = parsedSections.find(s => s.key === "execution");
  const soarSection = parsedSections.find(s => s.key === "soar");
  const servicesSection = parsedSections.find(s => s.key === "services");
  const roadmapSection = parsedSections.find(s => s.key === "roadmap");
  const measurementSection = parsedSections.find(s => s.key === "measurement");

  // Prepare content blocks for each slide
  const briefBlock1 = splitIntoTwoColumns(
    [
      draft.about.trim(),
      draft.differentiator.trim(),
      ...activeFields.map(f => `${f.label}: ${f.value}`),
    ].filter(Boolean),
    draft.about.trim() ||
      "Establishing a cohesive, high-converting digital presence grounded in the brand's core market positioning and category strengths.",
    draft.differentiator.trim() ||
      "Differentiating the brand from category competitors through intentional storytelling, clear value framing, and repeatable content series.",
  );

  const briefBlock2 = splitIntoTwoColumns(
    [
      draft.challenges.trim(),
      draft.mode === "lead" ? draft.leadTrigger.trim() : draft.campaignHistory.trim(),
      draft.constraints.trim(),
    ].filter(Boolean),
    draft.challenges.trim() ||
      "Overcoming inconsistent publishing cadence, fragmented channel messaging, and friction between social engagement and conversion.",
    (draft.mode === "lead" ? draft.leadTrigger : draft.campaignHistory).trim() ||
      "Capturing immediate market momentum with a structured rollout designed for measurable 30/60/90-day commercial outcomes.",
  );

  const aimsBlock1 = splitIntoTwoColumns(
    objectiveSection?.lines.length ? objectiveSection.lines : [draft.goals.trim()].filter(Boolean),
    draft.goals.trim() ||
      "Drive qualified pipeline growth, elevate brand authority across priority social channels, and build a predictable conversion path.",
    `Primary Conversion Goal: ${
      draft.conversionGoal.trim() || "Consistent inbound enquiries, qualified leads, and repeat audience engagement."
    }`,
  );

  const aimsBlock2 = splitIntoTwoColumns(
    opportunitiesSection?.lines.length
      ? opportunitiesSection.lines
      : draft.findings.map(f => f.observation.trim()).filter(Boolean),
    draft.quickWin.trim() ||
      "High-leverage quick win: optimize profile conversion architecture, pinned educational assets, and direct call-to-action funnels.",
    draft.baselineKpis.trim() ||
      "Compound organic reach and save rates by replacing static announcements with hook-driven, audience-first formats.",
  );

  const audienceBlock1 = splitIntoTwoColumns(
    audienceSection?.lines.length ? audienceSection.lines : [draft.audience.trim()].filter(Boolean),
    draft.audience.trim() ||
      "Core decision-makers and engaged community members actively seeking trusted expertise, clear outcomes, and authentic brand proof.",
    `Market & Voice: ${draft.location.trim() || "Primary target market"} · Tone: ${
      draft.brandVoice.trim() || "Editorial, authoritative, and approachable"
    }.`,
  );

  const audienceBlock2 = splitIntoTwoColumns(
    [draft.competitors.trim(), draft.offerings.trim(), draft.currentAssets.trim()].filter(Boolean),
    draft.competitors.trim() ||
      "Positioned in contrast to generic category templates by emphasizing real proof, clear transformation, and direct community trust.",
    draft.offerings.trim() ||
      "Structured offer ecosystem linking top-of-funnel discovery directly into flagship products, services, and lead capture.",
  );

  const populatedProfiles = draft.profiles.filter(
    p => p.platform.trim() || p.url.trim() || p.notes.trim() || p.followers?.trim(),
  );

  const platformBlock = splitIntoTwoColumns(
    populatedProfiles.length > 0
      ? populatedProfiles.map(
          p =>
            `${p.platform || "Channel"}${p.status ? ` (${p.status})` : ""}${
              p.followers ? ` — ${p.followers}` : ""
            }${p.cadence ? ` · ${p.cadence}` : ""}: ${p.notes.trim() || "Priority channel for audience growth and conversion."}`,
        )
      : opportunitiesSection?.lines ?? [],
    `Video & Content Capacity: ${
      draft.videoCapacity.trim() || "Tailored mix of short-form video, editorial carousels, and community touchpoints."
    }`,
    `Active Stack & Funnel: ${
      draft.techStack.trim() || "Streamlined profile-to-website conversion path with clear attribution."
    }`,
  );

  const soarCards = soarSection?.lines.length
    ? parseSoarCards(soarSection.lines)
    : [
        {
          heading: "Strengths",
          items: [
            draft.differentiator.trim() || "Strong foundational expertise and clear product/service value.",
            draft.currentAssets.trim() || "Existing brand assets ready to be repackaged into high-performing series.",
          ],
        },
        {
          heading: "Opportunities",
          items: [
            draft.quickWin.trim() || "Untapped organic reach through hook-first educational and proof-driven content.",
            "Streamlined conversion bridge from social discovery to direct action.",
          ],
        },
        {
          heading: "Aspirations & Results",
          items: [
            draft.goals.trim() || "Establish category-leading authority and predictable monthly conversion volume.",
            draft.conversionGoal.trim() || "Measurable growth in qualified leads, saves, and direct conversions.",
          ],
        },
      ];

  const soarCol1 = {
    ...splitIntoTwoColumns(
      soarCards[0]?.items ?? [],
      "Validating existing brand strengths and foundational authority so every channel builds on proven trust.",
      "Leveraging core differentiators and existing proof points to stand out immediately in the feed.",
    ),
    bottom:
      soarCards[0]?.items[2] ||
      `Core Strength Anchor: ${
        draft.differentiator.trim() ||
        "Translating proven real-world expertise into an unmistakable, repeatable visual and editorial identity."
      }`,
  };
  const soarCol2 = {
    ...splitIntoTwoColumns(
      soarCards[1]?.items ?? [],
      "Capturing untapped audience demand through repeatable content pillars and high-retention visual hooks.",
      "Turning passive viewers into active prospects by closing competitor content and funnel gaps.",
    ),
    bottom:
      soarCards[1]?.items[2] ||
      `Priority Growth Lever: ${
        draft.quickWin.trim() ||
        "Pairing high-discovery short-form hooks with saveable educational carousels and direct profile conversion bridges."
      }`,
  };
  const soarCol3 = {
    ...splitIntoTwoColumns(
      [...(soarCards[2]?.items ?? []), ...(soarCards[3]?.items ?? [])],
      "Building a durable community and recognizable brand voice that compounds value month over month.",
      "Tracking concrete 30/60/90-day conversion indicators, engagement velocity, and pipeline contribution.",
    ),
    bottom:
      soarCards[3]?.items[1] ||
      `Target Outcome: ${
        draft.conversionGoal.trim() ||
        "Sustained growth in qualified enquiries, audience retention, and measurable commercial return."
      }`,
  };

  const roadmapPhases = parseRoadmapPhases(roadmapSection?.lines ?? []);
  const phase1Cols = splitIntoTwoColumns(
    roadmapPhases[0]?.items ?? [],
    "Days 1–30 (Foundation): Audit channel bios, finalize content pillars, establish visual templates, and align tracking.",
    `Timeline Alignment: ${draft.timeline.trim() || "Immediate onboarding, asset organization, and first content batch production."}`,
  );
  const phase2Cols = splitIntoTwoColumns(
    roadmapPhases[1]?.items ?? [],
    "Days 31–60 (Launch & Execution): Roll out core weekly publishing cadence, short-form video hooks, and active community management.",
    "Deploy conversion pathways, pinned profile funnels, and mid-campaign engagement optimizations.",
  );

  const servicesBlock = splitIntoTwoColumns(
    servicesSection?.lines.length
      ? servicesSection.lines
      : [
          `Target Package: ${(draft.mode === "client" ? draft.activePackage : draft.budgetTier).trim() || "Growth Package ($1,100 USD / month)"}`,
          ...measurementSection?.lines ?? [],
        ],
    `Recommended Tier: ${
      (draft.mode === "client" ? draft.activePackage : draft.budgetTier).trim() ||
      "Matched to your video capacity, profile count, and monthly growth targets."
    }`,
    "Includes structured monthly content planning, original creative production, scheduling, community management, and performance reporting.",
  );

  const tocItems = isClientEdition
    ? [
        ["STRATEGIC BRIEF", "(01)"],
        ["CAMPAIGN AIMS", "(02)"],
        ["AUDIENCE PROFILE", "(03)"],
        ["PLATFORM APPROACH", "(04)"],
        ["CONTENT FRAMEWORK", "(05)"],
        ["ROLLOUT SCHEDULE", "(06)"],
        ["SERVICES & BUDGET", "(07)"],
        ["PATH FORWARD", "(08)"],
      ]
    : [
        ["STRATEGIC BRIEF", "(01)"],
        ["CAMPAIGN AIMS", "(02)"],
        ["AUDIENCE PROFILE", "(03)"],
        ["PLATFORM APPROACH", "(04)"],
        ["CONTENT FRAMEWORK", "(05)"],
        ["DIAGNOSTIC FRAMEWORKS", "(06)"],
        ["EXECUTION PLAYBOOK", "(07)"],
        ["ROLLOUT & BUDGET", "(08)"],
      ];

  const coverLine2Left = draft.mode === "client" ? "CLIENT" : "CAMPAIGN";
  const coverLine2Right = isClientEdition
    ? draft.mode === "client"
      ? "STRATEGY"
      : "PROPOSAL"
    : "PLAYBOOK";

  return (
    <Document
      title={`${subjectName} — ${isClientEdition ? "Client Presentation" : "Internal Playbook"}`}
      author="GrailHiiv Strategy Workspace"
      subject={`${subjectName} Strategy Presentation`}
    >
      {/* =====================================================================
          SLIDE 1: COVER SLIDE (Matches Page 1 of Sample PDF)
      ===================================================================== */}
      <Page size={SLIDE_SIZE} style={styles.slideWhite}>
        <CheckerboardCorner top={98} right={0} color={C.GRAY_CHECK} cellSize={58} rows={4} cols={4} />
        <CheckerboardCorner bottom={92} left={0} color={C.GRAY_CHECK} cellSize={58} rows={4} cols={4} />

        <View style={styles.cornerTopRow}>
          <Text style={styles.cornerMetaText}>PRESENTED BY {presenterName}</Text>
          <Text style={styles.cornerMetaText}>{dateLabel}</Text>
        </View>

        <View style={styles.coverCenterWrap}>
          <Text style={styles.coverEyebrow}>{subjectName}</Text>

          {/* Line 1: Highlighted with Left Blue Cursor Pin */}
          <View style={styles.highlightRow}>
            <View style={styles.highlightBox}>
              <View style={styles.cursorBarLeft} />
              <View style={styles.cursorDotTop} />
              <Text style={styles.coverGiantText}>SOCIAL MEDIA</Text>
            </View>
          </View>

          {/* Line 2: Plain word + Highlighted word with Right Blue Cursor Pin */}
          <View style={styles.highlightRow}>
            <View style={styles.plainTitleBox}>
              <Text style={styles.coverGiantText}>{coverLine2Left}</Text>
            </View>
            <View style={styles.highlightBox}>
              <Text style={styles.coverGiantText}>{coverLine2Right}</Text>
              <View style={styles.cursorBarRight} />
              <View style={styles.cursorDotBottom} />
            </View>
          </View>
        </View>

        <View style={styles.cornerBottomRow}>
          <View>
            <Text style={styles.cornerMetaText}>{handleLabel}</Text>
            <Text style={styles.cornerMetaText}>{websiteLabel}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.cornerMetaText}>
              {isClientEdition ? "CLIENT PRESENTATION" : "INTERNAL PLAYBOOK"}
            </Text>
            <Text style={styles.cornerMetaText}>SOCIAL@GRAILHIIV.COM</Text>
          </View>
        </View>
      </Page>

      {/* =====================================================================
          SLIDE 2: TABLE OF CONTENTS (Matches Page 2 of Sample PDF)
      ===================================================================== */}
      <Page size={SLIDE_SIZE} style={styles.slideBlue}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 54,
            paddingVertical: 66,
            height: "100%",
          }}
        >
          {/* Left Architectural Brief Panel (replaces stock photo) */}
          <View
            style={{
              width: "43%",
              backgroundColor: C.BLUE_DEEP,
              padding: 28,
              justifyContent: "space-between",
              borderWidth: 1.5,
              borderColor: C.BLUE_SOFT,
            }}
          >
            <View>
              <View
                style={{
                  backgroundColor: C.LIME,
                  alignSelf: "flex-start",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginBottom: 18,
                }}
              >
                <Text
                  style={{
                    fontSize: 9.5,
                    fontFamily: "Helvetica-Bold",
                    color: C.INK,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {draft.mode === "client" ? "ACTIVE CLIENT STRATEGY" : "LEAD PROPOSAL BRIEF"}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: "Helvetica-Bold",
                  color: C.WHITE,
                  lineHeight: 1.08,
                  letterSpacing: -0.8,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                {subjectName}
              </Text>
              <Text style={{ fontSize: 10.5, color: "#D6E0FF", lineHeight: 1.45 }}>
                {clampText(
                  draft.about.trim() ||
                    draft.goals.trim() ||
                    "Structured social media & digital growth strategy tailored to your market, audience, and conversion goals.",
                  220,
                )}
              </Text>
            </View>

            <View style={{ borderTopWidth: 1, borderTopColor: C.BLUE_SOFT, paddingTop: 14 }}>
              <Text
                style={{
                  fontSize: 8.5,
                  fontFamily: "Helvetica-Bold",
                  color: C.LIME,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                CATEGORY & MARKET
              </Text>
              <Text style={{ fontSize: 10.5, color: C.WHITE, marginBottom: 10 }}>
                {resolvedBusinessType} · {draft.location.trim() || "Global"}
              </Text>

              <Text
                style={{
                  fontSize: 8.5,
                  fontFamily: "Helvetica-Bold",
                  color: C.LIME,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                PRIMARY CONVERSION GOAL
              </Text>
              <Text style={{ fontSize: 10.5, color: C.WHITE }}>
                {clampText(draft.conversionGoal.trim() || "Qualified Leads & Brand Authority", 90)}
              </Text>
            </View>
          </View>

          {/* Right Numbered Table of Contents (01)-(08) */}
          <View style={{ width: "51%", justifyContent: "center" }}>
            {tocItems.map(([label, num], idx) => (
              <View
                key={num}
                style={[
                  styles.tocRow,
                  idx === tocItems.length - 1 ? { borderBottomWidth: 0 } : {},
                ]}
              >
                <Text style={styles.tocLabel}>{label}</Text>
                <Text style={styles.tocNum}>{num}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* =====================================================================
          SLIDE 3: WHY WE'RE RUNNING THIS (Matches Page 3 of Sample PDF)
      ===================================================================== */}
      <Page size={SLIDE_SIZE} style={styles.slideWhite}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 54,
            paddingVertical: 50,
            height: "100%",
          }}
        >
          {/* Left Column: (001), (002), and bottom giant title */}
          <View style={{ width: "49%", justifyContent: "space-between" }}>
            <View>
              <NumberedEditorialBlock
                num="001"
                leftText={briefBlock1.left}
                rightText={briefBlock1.right}
                bottomText={briefBlock1.bottom}
                theme="dark"
              />
              <NumberedEditorialBlock
                num="002"
                leftText={briefBlock2.left}
                rightText={briefBlock2.right}
                bottomText={briefBlock2.bottom}
                theme="dark"
              />
            </View>

            <View>
              <Text style={styles.displayBlueLeft}>WHY WE’RE</Text>
              <Text style={styles.displayBlueLeft}>RUNNING THIS</Text>
            </View>
          </View>

          {/* Right Architectural Context Panel (replaces stock photo) */}
          <View
            style={{
              width: "44%",
              backgroundColor: C.GRAY_PANEL,
              borderWidth: 1,
              borderColor: "#E1E5F2",
              padding: 28,
              justifyContent: "space-between",
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottomWidth: 1.5,
                  borderBottomColor: C.BLUE,
                  paddingBottom: 10,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Helvetica-Bold",
                    color: C.BLUE,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  STRATEGIC CONTEXT SNAPSHOT
                </Text>
                <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: C.BLUE }}>(01)</Text>
              </View>

              {(activeFields.length > 0
                ? activeFields.slice(0, 4)
                : [
                    { label: "Business Type", value: resolvedBusinessType },
                    { label: "Brand Voice", value: draft.brandVoice.trim() || "Editorial & Clear" },
                    { label: "Content Capacity", value: draft.videoCapacity.trim() || "Flexible Multi-Format" },
                    { label: "Key Window", value: draft.timeline.trim() || "Immediate 90-Day Cycle" },
                  ]
              ).map((item, i) => (
                <View
                  key={i}
                  style={{
                    marginBottom: 12,
                    paddingBottom: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#E4E7F0",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 8.5,
                      fontFamily: "Helvetica-Bold",
                      color: C.BLUE,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      marginBottom: 3,
                    }}
                  >
                    {item.label}
                  </Text>
                  <Text style={{ fontSize: 9.8, color: C.INK, lineHeight: 1.38 }}>
                    {clampText(item.value, 140)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={{ backgroundColor: C.BLUE, padding: 14 }}>
              <Text
                style={{
                  fontSize: 8.5,
                  fontFamily: "Helvetica-Bold",
                  color: C.LIME,
                  letterSpacing: 0.9,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                KEY DIFFERENTIATOR
              </Text>
              <Text style={{ fontSize: 9.5, color: C.WHITE, lineHeight: 1.4 }}>
                {clampText(
                  draft.differentiator.trim() ||
                    "Purpose-built positioning that connects authentic expertise directly to measurable client outcomes.",
                  170,
                )}
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* =====================================================================
          SLIDE 4: CAMPAIGN AIMS (Matches Page 4 of Sample PDF)
      ===================================================================== */}
      <Page size={SLIDE_SIZE} style={styles.slideBlue}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 54,
            paddingVertical: 50,
            height: "100%",
          }}
        >
          {/* Left Column: Chartreuse Title + (001) & (002) in white */}
          <View style={{ width: "47%", justifyContent: "space-between" }}>
            <View>
              <Text style={styles.displayLimeLeft}>CAMPAIGN</Text>
              <Text style={styles.displayLimeLeft}>AIMS</Text>
            </View>

            <View>
              <NumberedEditorialBlock
                num="001"
                leftText={aimsBlock1.left}
                rightText={aimsBlock1.right}
                bottomText={aimsBlock1.bottom}
                theme="white"
              />
              <NumberedEditorialBlock
                num="002"
                leftText={aimsBlock2.left}
                rightText={aimsBlock2.right}
                theme="white"
              />
            </View>
          </View>

          {/* Right Column: Chartreuse Feature Box + Diagonal Arrow + Bottom Columns */}
          <View style={{ width: "46%", justifyContent: "space-between" }}>
            <View
              style={{
                backgroundColor: C.LIME,
                padding: 22,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: "#95AE3B",
                  paddingBottom: 10,
                }}
              >
                <View style={{ width: "48%" }}>
                  <Text
                    style={{
                      fontSize: 8.5,
                      fontFamily: "Helvetica-Bold",
                      color: C.BLUE,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    PRIORITY QUICK WIN
                  </Text>
                  <Text style={{ fontSize: 9.5, color: C.INK, lineHeight: 1.38 }}>
                    {clampText(
                      draft.quickWin.trim() ||
                        "Optimize profile conversion paths and deploy high-retention educational hooks.",
                      145,
                    )}
                  </Text>
                </View>
                <View style={{ width: "48%" }}>
                  <Text
                    style={{
                      fontSize: 8.5,
                      fontFamily: "Helvetica-Bold",
                      color: C.BLUE,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    CONVERSION TARGET
                  </Text>
                  <Text style={{ fontSize: 9.5, color: C.INK, lineHeight: 1.38 }}>
                    {clampText(
                      draft.conversionGoal.trim() ||
                        "Turn engaged social viewers into qualified leads, enquiries, and customers.",
                      145,
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.twoColRow}>
                <View style={styles.twoColCell}>
                  <Text style={styles.bodyDark}>{aimsBlock2.left}</Text>
                </View>
                <View style={styles.twoColCell}>
                  <Text style={styles.bodyDark}>{aimsBlock2.right}</Text>
                </View>
              </View>
            </View>

            {/* Signature White Diagonal Arrow (↘) from Page 4 */}
            <View style={{ marginVertical: 6 }}>
              <Svg width="32" height="32" viewBox="0 0 32 32">
                <Line x1="4" y1="4" x2="26" y2="26" stroke="#FFFFFF" strokeWidth="3.2" />
                <Path d="M 10 26 L 26 26 L 26 10" fill="none" stroke="#FFFFFF" strokeWidth="3.2" />
              </Svg>
            </View>

            <View style={styles.twoColRow}>
              <View style={styles.twoColCell}>
                <Text style={styles.bodyWhite}>
                  {clampText(
                    draft.currentAssets.trim()
                      ? `Existing Assets: ${draft.currentAssets.trim()}`
                      : "Every piece of content is mapped to a clear stage of awareness, consideration, or direct conversion.",
                    220,
                  )}
                </Text>
              </View>
              <View style={styles.twoColCell}>
                <Text style={styles.bodyWhite}>
                  {clampText(
                    draft.timeline.trim()
                      ? `Key Window: ${draft.timeline.trim()}`
                      : "Designed to compound audience trust while generating near-term commercial momentum.",
                    220,
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* =====================================================================
          SLIDE 5: AUDIENCE PROFILE (Matches Page 5 of Sample PDF)
      ===================================================================== */}
      <Page size={SLIDE_SIZE} style={styles.slideWhite}>
        <View style={{ flexDirection: "row", height: "100%" }}>
          {/* Left Half: Cobalt Blue with Double-Pill Clover Architectural Graphic */}
          <View
            style={{
              width: "50%",
              backgroundColor: C.BLUE,
              padding: 46,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Top Pill */}
            <View
              style={{
                width: "100%",
                height: 175,
                borderRadius: 88,
                backgroundColor: C.BLUE_DEEP,
                borderWidth: 1.5,
                borderColor: C.LIME,
                paddingHorizontal: 38,
                justifyContent: "center",
                marginBottom: -14,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Helvetica-Bold",
                  color: C.LIME,
                  letterSpacing: 1.1,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                CORE AUDIENCE SEGMENT
              </Text>
              <Text style={{ fontSize: 10.5, color: C.WHITE, lineHeight: 1.42 }}>
                {clampText(
                  draft.audience.trim() ||
                    (audienceSection?.lines[0] ? stripBulletPrefix(audienceSection.lines[0]) : "") ||
                    "High-intent buyers and community members seeking proven expertise and relatable brand authority.",
                  190,
                )}
              </Text>
            </View>

            {/* Bottom Pill */}
            <View
              style={{
                width: "100%",
                height: 175,
                borderRadius: 88,
                backgroundColor: C.LIME,
                paddingHorizontal: 38,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: "Helvetica-Bold",
                  color: C.BLUE,
                  letterSpacing: 1.1,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                BRAND VOICE & POSITIONING
              </Text>
              <Text style={{ fontSize: 10.5, color: C.INK, lineHeight: 1.42 }}>
                {clampText(
                  `Voice: ${draft.brandVoice.trim() || "Clear, authoritative, and human"}. Market: ${
                    draft.location.trim() || "Target Regional & Digital Market"
                  }.`,
                  190,
                )}
              </Text>
            </View>
          </View>

          {/* Right Half: White Canvas with Right-Aligned Giant Title & (001)/(002) */}
          <View
            style={{
              width: "50%",
              paddingHorizontal: 48,
              paddingVertical: 50,
              justifyContent: "space-between",
            }}
          >
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.displayBlueRight}>AUDIENCE</Text>
              <Text style={styles.displayBlueRight}>PROFILE</Text>
            </View>

            <View>
              <NumberedEditorialBlock
                num="001"
                leftText={audienceBlock1.left}
                rightText={audienceBlock1.right}
                theme="dark"
                alignNum="right"
              />
              <NumberedEditorialBlock
                num="002"
                leftText={audienceBlock2.left}
                rightText={audienceBlock2.right}
                theme="dark"
                alignNum="right"
              />
            </View>
          </View>
        </View>
      </Page>

      {/* =====================================================================
          SLIDE 6: PLATFORM APPROACH (Matches Page 6 of Sample PDF)
      ===================================================================== */}
      <Page size={SLIDE_SIZE} style={styles.slideWhite}>
        <View style={{ height: "100%", justifyContent: "space-between" }}>
          {/* Top Half: Channel Baseline Grid Band (58% height) */}
          <View
            style={{
              height: "57%",
              backgroundColor: C.BLUE,
              paddingHorizontal: 54,
              paddingVertical: 34,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: C.BLUE_SOFT,
                paddingBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Helvetica-Bold",
                  color: C.LIME,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                SOCIAL CHANNEL BASELINE & ECOSYSTEM AUDIT
              </Text>
              <Text style={{ fontSize: 10, color: C.WHITE }}>
                {populatedProfiles.length > 0
                  ? `${populatedProfiles.length} ACTIVE/AUDITED CHANNELS`
                  : "MULTI-CHANNEL ECOSYSTEM"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 14 }}>
              {(populatedProfiles.length > 0
                ? populatedProfiles.slice(0, 3)
                : [
                    {
                      id: "p1",
                      platform: "Primary Social Channel",
                      status: "Priority Focus",
                      followers: draft.baselineKpis.trim() || "Baseline Audit",
                      cadence: "3–4x / week",
                      url: "",
                      notes:
                        "Anchor platform for short-form discovery, educational carousels, and direct profile-to-funnel conversion.",
                    },
                    {
                      id: "p2",
                      platform: "Secondary Authority Channel",
                      status: "Growth Lever",
                      followers: "Cross-Platform",
                      cadence: "2–3x / week",
                      url: "",
                      notes:
                        "Adapted high-performing assets and community proof tailored to decision-makers and repeat buyers.",
                    },
                    {
                      id: "p3",
                      platform: "Owned Conversion Hub",
                      status: "Funnel Destination",
                      followers: websiteLabel,
                      cadence: "Always-On",
                      url: "",
                      notes:
                        draft.conversionGoal.trim() ||
                        "Optimized landing experience to capture leads, bookings, and direct sales from social traffic.",
                    },
                  ]
              ).map((prof, idx) => (
                <View
                  key={prof.id || idx}
                  style={{
                    width: populatedProfiles.length === 1 ? "100%" : populatedProfiles.length === 2 ? "48.5%" : "31.5%",
                    backgroundColor: idx === 0 ? C.LIME : C.BLUE_DEEP,
                    padding: 18,
                    height: 195,
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 8.5,
                        fontFamily: "Helvetica-Bold",
                        color: idx === 0 ? C.BLUE : C.LIME,
                        textTransform: "uppercase",
                        letterSpacing: 0.9,
                        marginBottom: 4,
                      }}
                    >
                      {prof.status || `CHANNEL 0${idx + 1}`}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Helvetica-Bold",
                        color: idx === 0 ? C.INK : C.WHITE,
                        marginBottom: 8,
                        textTransform: "uppercase",
                      }}
                    >
                      {prof.platform || `Profile ${idx + 1}`}
                    </Text>
                    <Text
                      style={{
                        fontSize: 9.2,
                        color: idx === 0 ? C.INK : "#E2E8FF",
                        lineHeight: 1.38,
                      }}
                    >
                      {clampText(
                        prof.notes.trim() ||
                          "Audit bio clarity, pinned posts, visual cohesion, and direct link conversion.",
                        155,
                      )}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 8.5,
                      fontFamily: "Helvetica-Bold",
                      color: idx === 0 ? C.INK : C.LIME,
                    }}
                  >
                    {[prof.followers, prof.cadence].filter(Boolean).join(" · ") || "Active Channel"}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom Half: White with Giant Left Title & Right (001) Columns */}
          <View
            style={{
              height: "43%",
              paddingHorizontal: 54,
              paddingVertical: 28,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ width: "44%" }}>
              <Text style={styles.displayBlueLeft}>PLATFORM</Text>
              <Text style={styles.displayBlueLeft}>APPROACH</Text>
            </View>

            <View style={{ width: "52%" }}>
              <NumberedEditorialBlock
                num="001"
                leftText={platformBlock.left}
                rightText={platformBlock.right}
                bottomText={platformBlock.bottom}
                theme="dark"
                alignNum="right"
              />
            </View>
          </View>
        </View>
      </Page>

      {/* =====================================================================
          SLIDE 7: CONTENT FRAMEWORK / SOAR (Matches Page 7 of Sample PDF)
      ===================================================================== */}
      <Page size={SLIDE_SIZE} style={styles.slideLime}>
        <CheckerboardCorner top={0} left={0} color={C.LIME_CHECK} cellSize={58} rows={4} cols={4} />
        <CheckerboardCorner top={0} right={0} color={C.LIME_CHECK} cellSize={58} rows={4} cols={4} />

        <View
          style={{
            paddingHorizontal: 54,
            paddingTop: 58,
            paddingBottom: 52,
            height: "100%",
          }}
        >
          <View style={{ alignItems: "center", marginTop: 4, marginBottom: 46 }}>
            <Text style={styles.displayBlueCenter}>CONTENT</Text>
            <Text style={styles.displayBlueCenter}>FRAMEWORK</Text>
          </View>

          {/* 3 Columns at Bottom with Centered (001), (002), (003) */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ width: "31%" }}>
              <NumberedEditorialBlock
                num="001"
                leftText={soarCol1.left}
                rightText={soarCol1.right}
                bottomText={soarCol1.bottom}
                theme="dark"
                alignNum="center"
              />
            </View>
            <View style={{ width: "31%" }}>
              <NumberedEditorialBlock
                num="002"
                leftText={soarCol2.left}
                rightText={soarCol2.right}
                bottomText={soarCol2.bottom}
                theme="dark"
                alignNum="center"
              />
            </View>
            <View style={{ width: "31%" }}>
              <NumberedEditorialBlock
                num="003"
                leftText={soarCol3.left}
                rightText={soarCol3.right}
                bottomText={soarCol3.bottom}
                theme="dark"
                alignNum="center"
              />
            </View>
          </View>
        </View>
      </Page>

      {/* =====================================================================
          SLIDE 8: OUR 90-DAY GAME PLAN (Matches Page 8 of Sample PDF)
      ===================================================================== */}
      <Page size={SLIDE_SIZE} style={styles.slideWhite}>
        <View style={{ flexDirection: "row", height: "100%" }}>
          {/* Left Half: White Canvas with Giant Title + (001) & (002) */}
          <View
            style={{
              width: "48%",
              paddingHorizontal: 50,
              paddingVertical: 50,
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={styles.displayBlueLeft}>OUR 90-DAY</Text>
              <Text style={styles.displayBlueLeft}>GAME PLAN</Text>
            </View>

            <View>
              <NumberedEditorialBlock
                num="001"
                leftText={phase1Cols.left}
                rightText={phase1Cols.right}
                bottomText={phase1Cols.bottom}
                theme="dark"
              />
              <NumberedEditorialBlock
                num="002"
                leftText={phase2Cols.left}
                rightText={phase2Cols.right}
                theme="dark"
              />
            </View>
          </View>

          {/* Right Half: Cobalt Blue with 2 Tall Architectural Phase Columns */}
          <View
            style={{
              width: "52%",
              backgroundColor: C.BLUE,
              paddingHorizontal: 38,
              paddingVertical: 50,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {[
              {
                badge: "PHASE 02 · DAYS 31–60",
                title: "LAUNCH & CADENCE",
                accent: C.LIME,
                textColor: C.INK,
                items: roadmapPhases[1]?.items.length
                  ? roadmapPhases[1].items
                  : [
                      "Execute full weekly publishing schedule across priority social profiles.",
                      "Roll out short-form video hooks, educational carousels, and community replies.",
                    ],
              },
              {
                badge: "PHASE 03 · DAYS 61–90",
                title: "OPTIMIZE & SCALE",
                accent: C.BLUE_DEEP,
                textColor: C.WHITE,
                items: roadmapPhases[2]?.items.length
                  ? roadmapPhases[2].items
                  : [
                      "Review 60-day performance analytics and double down on top-converting formats.",
                      "Refine conversion funnels, retargeting touchpoints, and next-quarter growth targets.",
                    ],
              },
            ].map((col, idx) => (
              <View key={idx} style={{ width: "47.5%", justifyContent: "space-between" }}>
                <View
                  style={{
                    height: 315,
                    backgroundColor: col.accent,
                    padding: 20,
                    justifyContent: "space-between",
                    borderWidth: idx === 1 ? 1.5 : 0,
                    borderColor: C.LIME,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 8.5,
                        fontFamily: "Helvetica-Bold",
                        color: idx === 0 ? C.BLUE : C.LIME,
                        letterSpacing: 1,
                        marginBottom: 8,
                      }}
                    >
                      {col.badge}
                    </Text>
                    <Text
                      style={{
                        fontSize: 22,
                        fontFamily: "Helvetica-Bold",
                        color: col.textColor,
                        lineHeight: 1.08,
                        marginBottom: 14,
                      }}
                    >
                      {col.title}
                    </Text>
                    {col.items.slice(0, 3).map((it, i) => (
                      <Text
                        key={i}
                        style={{
                          fontSize: 9.5,
                          color: col.textColor,
                          lineHeight: 1.4,
                          marginBottom: 8,
                        }}
                      >
                        • {clampText(stripBulletPrefix(it), 140)}
                      </Text>
                    ))}
                  </View>
                  <Text
                    style={{
                      fontSize: 8.5,
                      fontFamily: "Helvetica-Bold",
                      color: idx === 0 ? C.INK : C.LIME,
                    }}
                  >
                    30 / 60 / 90 EXECUTION ROADMAP
                  </Text>
                </View>

                <Text style={styles.bodyWhite}>
                  {clampText(
                    col.items.map(stripBulletPrefix).join(" "),
                    195,
                  )}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* =====================================================================
          SLIDE 9: HOW WE'RE SPENDING THE BUDGET (Matches Page 9 of Sample PDF)
      ===================================================================== */}
      <Page size={SLIDE_SIZE} style={styles.slideLime}>
        <View style={{ height: "100%", justifyContent: "space-between" }}>
          {/* Top Half: Chartreuse with Giant 3-Line Left Title & Right (001) */}
          <View
            style={{
              height: "50%",
              paddingHorizontal: 54,
              paddingTop: 42,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ width: "50%" }}>
              <Text style={styles.displayBlueLeft}>HOW WE’RE</Text>
              <Text style={styles.displayBlueLeft}>SPENDING THE</Text>
              <Text style={styles.displayBlueLeft}>BUDGET</Text>
            </View>

            <View style={{ width: "46%", paddingTop: 10 }}>
              <NumberedEditorialBlock
                num="001"
                leftText={servicesBlock.left}
                rightText={servicesBlock.right}
                bottomText={servicesBlock.bottom}
                theme="dark"
                alignNum="right"
              />
            </View>
          </View>

          {/* Bottom Half: Architectural Package & Measurement Band */}
          <View
            style={{
              height: "50%",
              backgroundColor: C.BLUE,
              paddingHorizontal: 54,
              paddingVertical: 32,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {(servicesSection?.lines.length
              ? parseSubBlocks(servicesSection.lines, "Recommended Scope").slice(0, 2)
              : [
                  {
                    heading: "Recommended Monthly Retainer",
                    items: [
                      (draft.mode === "client" ? draft.activePackage : draft.budgetTier).trim() ||
                        "Growth Package (From $1,100 USD / month): 20 original content pieces/mo, up to 3 social profiles, monthly strategy call & report.",
                    ],
                  },
                  {
                    heading: "Measurement & KPI Scorecard",
                    items: measurementSection?.lines.length
                      ? measurementSection.lines
                      : [
                          draft.baselineKpis.trim() ||
                            "Track monthly reach, engagement velocity, profile visits, website clicks, and direct conversion inquiries.",
                        ],
                  },
                ]
            ).map((block, idx) => (
              <View
                key={idx}
                style={{
                  width: "48%",
                  backgroundColor: C.BLUE_DEEP,
                  padding: 22,
                  borderWidth: 1,
                  borderColor: C.BLUE_SOFT,
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 9,
                      fontFamily: "Helvetica-Bold",
                      color: C.LIME,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    (00{idx + 2}) · {idx === 0 ? "RECOMMENDED SCOPE" : "SUCCESS METRICS & KPIS"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "Helvetica-Bold",
                      color: C.WHITE,
                      marginBottom: 10,
                    }}
                  >
                    {block.heading}
                  </Text>
                  {block.items.slice(0, 4).map((item, i) => (
                    <Text
                      key={i}
                      style={{
                        fontSize: 9.4,
                        color: "#E5EBFF",
                        lineHeight: 1.4,
                        marginBottom: 6,
                      }}
                    >
                      • {clampText(stripBulletPrefix(item), 185)}
                    </Text>
                  ))}
                </View>
                <Text style={{ fontSize: 8.5, color: C.LIME }}>
                  {idx === 0
                    ? "Ad spend, software subscriptions & hosting billed separately."
                    : `Primary Goal: ${clampText(draft.conversionGoal.trim() || "Qualified Conversions", 70)}`}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      {/* =====================================================================
          INTERNAL PLAYBOOK EDITION ONLY: DIAGNOSTICS & EXECUTION SLIDE
      ===================================================================== */}
      {!isClientEdition && (
        <Page size={SLIDE_SIZE} style={styles.slideBlue}>
          <View
            style={{
              paddingHorizontal: 54,
              paddingVertical: 46,
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
              <View>
                <Text style={styles.displayLimeLeft}>INTERNAL</Text>
                <Text style={styles.displayLimeLeft}>PLAYBOOK</Text>
              </View>
              <View
                style={{
                  backgroundColor: C.LIME,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 9.5,
                    fontFamily: "Helvetica-Bold",
                    color: C.INK,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  FOR STRATEGIST USE ONLY · NOISE / PESTLE / SWOT / TOWS
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 18 }}>
              <View
                style={{
                  width: "48.5%",
                  backgroundColor: C.BLUE_DEEP,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: C.BLUE_SOFT,
                }}
              >
                <Text style={styles.numTagWhite}>(001) DIAGNOSTIC FRAMEWORKS</Text>
                {(diagnosticsSection?.lines.length
                  ? diagnosticsSection.lines.slice(0, 10)
                  : [
                      "NOISE & SWOT / TOWS baseline diagnostics grounded in client brief, constraints, and competitive positioning.",
                    ]
                ).map((line, idx) => (
                  <Text key={idx} style={{ fontSize: 8.8, color: C.WHITE, lineHeight: 1.36, marginBottom: 4 }}>
                    {clampText(stripBulletPrefix(line), 130)}
                  </Text>
                ))}
              </View>

              <View
                style={{
                  width: "48.5%",
                  backgroundColor: C.LIME,
                  padding: 20,
                }}
              >
                <Text style={styles.numTagDark}>(002) STRATEGY TO APPLY (EXECUTION)</Text>
                {(executionSection?.lines.length
                  ? executionSection.lines.slice(0, 10)
                  : [
                      "Core positioning angle, channel-by-channel execution mechanics, content pillars, and conversion triggers.",
                    ]
                ).map((line, idx) => (
                  <Text key={idx} style={{ fontSize: 8.8, color: C.INK, lineHeight: 1.36, marginBottom: 4 }}>
                    {clampText(stripBulletPrefix(line), 130)}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </Page>
      )}

      {/* =====================================================================
          SLIDE 10: THANK YOU SO MUCH (Matches Page 10 of Sample PDF)
      ===================================================================== */}
      <Page size={SLIDE_SIZE} style={styles.slideWhite}>
        <CheckerboardCorner top={98} right={0} color={C.GRAY_CHECK} cellSize={58} rows={4} cols={4} />
        <CheckerboardCorner bottom={92} left={0} color={C.GRAY_CHECK} cellSize={58} rows={4} cols={4} />

        <View style={styles.cornerTopRow}>
          <Text style={styles.cornerMetaText}>PRESENTED BY {presenterName}</Text>
          <Text style={styles.cornerMetaText}>{dateLabel}</Text>
        </View>

        <View style={[styles.coverCenterWrap, { top: 176 }]}>
          <View style={styles.highlightRow}>
            <View style={styles.highlightBox}>
              <View style={styles.cursorBarLeft} />
              <View style={styles.cursorDotTop} />
              <Text style={styles.coverGiantText}>THANK YOU</Text>
            </View>
          </View>

          <View style={styles.highlightRow}>
            <View style={styles.highlightBox}>
              <Text style={styles.coverGiantText}>SO MUCH</Text>
              <View style={styles.cursorBarRight} />
              <View style={styles.cursorDotBottom} />
            </View>
          </View>
        </View>

        <View style={styles.cornerBottomRow}>
          <View>
            <Text style={styles.cornerMetaText}>{handleLabel}</Text>
            <Text style={styles.cornerMetaText}>{websiteLabel}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.cornerMetaText}>
              {isClientEdition ? "CLIENT PRESENTATION" : "INTERNAL PLAYBOOK"}
            </Text>
            <Text style={styles.cornerMetaText}>SOCIAL@GRAILHIIV.COM</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function slugifyFilename(value: string): string {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "strategy";
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function downloadStrategyPdfs(draft: Draft): Promise<void> {
  const baseSlug = slugifyFilename(draft.business.trim() || draft.name.trim() || "strategy");

  const [clientBlob, playbookBlob] = await Promise.all([
    pdf(<StrategyPdfDocument draft={draft} edition="client" />).toBlob(),
    pdf(<StrategyPdfDocument draft={draft} edition="playbook" />).toBlob(),
  ]);

  triggerBlobDownload(clientBlob, `${baseSlug}-client-presentation.pdf`);
  await new Promise(resolve => setTimeout(resolve, 350));
  triggerBlobDownload(playbookBlob, `${baseSlug}-internal-playbook.pdf`);
}
