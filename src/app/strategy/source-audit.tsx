"use client";
import { useEffect, useRef, useState } from "react";
import CustomSelect from "./custom-select";
import { businessTypes } from "./schema";
import type { Draft, Finding, AuditEvidence } from "./schema";
import { uploadAttachment, deleteAttachmentPaths, readAttachment } from "./cloud";
import { scoreChecks } from "./audit/scoring";
import type { PageSpeedResult } from "./audit/pagespeed";
import { buildExistingContextSummary } from "./autofill/evidence";
import { sourcePlatform, sourceKey, auditPlatforms, parseAuditSources, serializeAuditSources, type AuditPlatform } from "./source-links";
import { rankOpportunities, matchesAuditFilters } from "./audit/opportunities";
import { formatAuditSections, reportSections, type AuditReport } from "./audit/report";
import { screenshotSourceMatches } from "./audit/manual-evidence";

type Audit = {
  business: string; about: string; businessType: string; audience: string; offerings: string; differentiator: string;
  findings: { source: string; observation: string; recommendation: string; kind: string; impact: string; effort: string; benefit: string; service?: string; serviceRelevance?: string; outreachAngle?: string; evidencePoint?: { x: number; y: number; kind?: string }; confidence?: string; severity?: string; outreachSuitability?: string; relevance?: string; communicationEase?: string; verification?: string; approved?: boolean; reviewId?: string }[];
  checks: { id: string; status: string; evidence: string; source: string }[];
  report: AuditReport;
  performance: PageSpeedResult | null;
  sources: { imageKinds?: string[]; images?: { kind: string; name: string; dataUrl: string }[]; url: string; status: string; message: string; checkedAt: string; text?: string; metadata?: string; screenshot?: string | null; mobileScreenshot?: string | null }[];
};
export default function SourceAudit({ ownerId, currentRecordId, currentRecordVersion, draft, ready, onApply, update, onSyncSources, onDocumentCreated, onClear }: { ownerId: string; currentRecordId: () => string | null; currentRecordVersion: () => string | null; draft: Draft; ready: boolean; onApply: (patch: Partial<Draft>) => boolean; update: <K extends keyof Draft>(field: K, value: Draft[K]) => void; onSyncSources: (sources: string, otherSources: string[]) => void; onDocumentCreated: (output: "proposal" | "strategy") => void; onClear: () => void }) {
  const auditedRecord = useRef<string | null>(null);
  const auditedVersion = useRef<string | null>(null);
  const savedEvidence = useRef<AuditEvidence[] | null>(null);
  const findingIds = useRef<string[]>([]);
  const priorAuditReport = useRef("");
  const [sourceFields, setSourceFields] = useState(() => parseAuditSources(draft.auditSources, draft.auditOtherSources));
  const [selectedPlatforms, setSelectedPlatforms] = useState<AuditPlatform[]>(() => { const fields = parseAuditSources(draft.auditSources, draft.auditOtherSources); return auditPlatforms.filter(platform => Boolean(fields.profiles[platform])); });
  const selectedSources = (fields: typeof sourceFields, selected: readonly AuditPlatform[]) => serializeAuditSources({ ...fields, profiles: Object.fromEntries(auditPlatforms.map(platform => [platform, selected.includes(platform) ? fields.profiles[platform] : ""])) as typeof fields.profiles });
  const [otherSelected, setOtherSelected] = useState(() => parseAuditSources(draft.auditSources, draft.auditOtherSources).extra.length > 0);
  const sources = selectedSources({ ...sourceFields, extra: otherSelected ? sourceFields.extra : [] }, selectedPlatforms);
  const [uploads, setUploads] = useState<Record<string, { url: string; files: File[] }>>({});
  const [context, setContext] = useState(() => draft.auditContext);
  const [busy, setBusy] = useState(false);
  const [reviewDirty, setReviewDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [audit, setAudit] = useState<Audit | null>(null);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [channel, setChannel] = useState("email");
  const [tone, setTone] = useState("friendly");
  const [approach, setApproach] = useState("introduction");
  const imagesForSource = (entries: AuditEvidence[]) => entries.filter(item => item.kind.startsWith("manual:"));
  function attachScreenshots(slot: string, url: string, files: FileList | null) {
    const incoming = Array.from(files || []);
    if (!incoming.length) return;
    const bound = uploads[slot];
    if (bound?.files.length && !screenshotSourceMatches(bound.url, url)) { setMessage("The link has changed. Remove its screenshots and upload them again for the new link."); return; }
    if (incoming.some(file => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024)) { setMessage("Use PNG, JPEG or WebP images up to 5 MB each."); return; }
    const all = [...Object.values(uploads).flatMap(item => item.files), ...incoming];
    if (all.length > 12 || all.reduce((sum, file) => sum + file.size, 0) > 12_000_000) { setMessage("Attach up to 12 screenshots, with a combined size under 12 MB."); return; }
    setUploads(current => ({ ...current, [slot]: { url: current[slot]?.url || url.trim(), files: [...(current[slot]?.files || []), ...incoming] } })); setMessage("");
  }
  function screenshotInput(slot: string, url: string) {
    return <div className="audit-attachments"><label className="audit-attach-button">Upload Screenshot<input type="file" accept="image/png,image/jpeg,image/webp" multiple disabled={busy} onChange={event => { attachScreenshots(slot, url, event.target.files); event.target.value = ""; }} /></label>{(uploads[slot]?.files || []).map((file, index) => <div className="audit-attachment" key={`${file.name}-${index}`}><span>{file.name}</span><button type="button" disabled={busy} aria-label={`Remove ${file.name}`} onClick={() => setUploads(current => { const files = current[slot].files.filter((_, i) => i !== index); return { ...current, [slot]: { url: files.length ? current[slot].url : "", files } }; })}>Remove</button></div>)}</div>;
  }
  const [outreachSelection, setOutreachSelection] = useState<number[]>([]);
  async function generateOutreach() {
    const record = currentRecordId();
    const version = currentRecordVersion();
    const chosen = outreachSelection.map(index => draft.approvedAuditFindings[index]).filter(Boolean);
    if (!record || reviewDirty || chosen.length < 1 || chosen.length > 2) { setMessage("Save the audit and select one or two approved findings first."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/strategy/audit/outreach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel, tone, approach, business: draft.business, findings: chosen }) });
      const result = await response.json();
      if (!response.ok || typeof result.message !== "string") throw new Error(result.error || "Could not generate outreach.");
      if (record !== currentRecordId() || version !== currentRecordVersion()) throw new Error("The record changed while the message was generated. Please try again.");
      update("outreachMessage", result.message);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not generate outreach."); }
    finally { setBusy(false); }
  }
  useEffect(() => { if (ready) { const fields = parseAuditSources(draft.auditSources, draft.auditOtherSources); setSourceFields(fields); setSelectedPlatforms(auditPlatforms.filter(platform => Boolean(fields.profiles[platform]))); setOtherSelected(fields.extra.length > 0); setContext(draft.auditContext); } }, [ready]);
  useEffect(() => { setOutreachSelection([]); }, [draft.approvedAuditFindings]);
  useEffect(() => {
    if (!ready || !draft.auditSnapshot || audit) return;
    const snapshot = draft.auditSnapshot as unknown as Audit;
    if (!Array.isArray(snapshot.findings) || !Array.isArray(snapshot.sources) || !Array.isArray(snapshot.checks) || !snapshot.report) return;
    auditedRecord.current = currentRecordId(); auditedVersion.current = currentRecordVersion();
    savedEvidence.current = draft.auditEvidence;
    priorAuditReport.current = draft.auditReport.includes("\n\n--- New audit ---\n\n") ? draft.auditReport.split("\n\n--- New audit ---\n\n").slice(0, -1).join("\n\n--- New audit ---\n\n") : "";
    findingIds.current = snapshot.findings.map(finding => finding.reviewId || crypto.randomUUID());
    setSelected(snapshot.findings.map(finding => finding.approved === true));
    setAudit({ ...snapshot, performance: null });
    let active = true; const urls: string[] = [];
    void Promise.all(snapshot.sources.map(async source => {
      const savedImages = draft.auditEvidence.filter(item => item.url === source.url);
      const load = async (kind: string) => { const entry = savedImages.filter(item => item.kind === kind).at(-1); if (!entry) return null; try { const blob = await readAttachment(entry.path); if (!active) return null; const url = URL.createObjectURL(blob); urls.push(url); return url; } catch { return null; } };
      const images = await Promise.all(imagesForSource(savedImages).filter(item => source.imageKinds?.includes(item.kind)).map(async entry => { try { const blob = await readAttachment(entry.path); if (!active) return null; const dataUrl = URL.createObjectURL(blob); urls.push(dataUrl); return { kind: entry.kind, name: "Screenshot", dataUrl }; } catch { return null; } }));
      return { ...source, images: images.filter((item): item is NonNullable<typeof item> => item !== null), screenshot: await load("desktop"), mobileScreenshot: await load("mobile") };
    })).then(restored => { if (active) setAudit(current => current && current.findings === snapshot.findings ? { ...current, sources: restored } : current); });
    return () => { active = false; urls.forEach(url => URL.revokeObjectURL(url)); };
  }, [ready]);
  async function run() {
    const urls = sources.split(/\s+/).map(value => value.trim()).filter(Boolean);
    if (!urls.length || urls.length > 12) { setMessage("Enter at least one link and no more than twelve links."); return; }
    if (urls.some(url => !sourceKey(url))) { setMessage("Enter valid links starting with http:// or https://."); return; }
    if (sourceFields.website && sourcePlatform(sourceFields.website)) { setMessage("Enter a business website in the website field and social links under their matching platforms."); return; }
    const mismatch = auditPlatforms.find(platform => selectedPlatforms.includes(platform) && sourceFields.profiles[platform] && sourcePlatform(sourceFields.profiles[platform]) !== platform);
    if (mismatch) { setSelectedPlatforms(current => current.includes(mismatch) ? current : [...current, mismatch]); setMessage(`Enter a valid ${mismatch === "Amazon Author Central" ? "Amazon" : mismatch} link.`); return; }
    const slots = [{ key: "website", url: sourceFields.website }, ...selectedPlatforms.map(platform => ({ key: platform, url: sourceFields.profiles[platform] })), ...(otherSelected ? sourceFields.extra.map((url, index) => ({ key: `other:${index}`, url })) : [])];
    if (slots.some(slot => uploads[slot.key]?.files.length && !slot.url.trim())) { setMessage("Add a link for each source with screenshots."); return; }
    if (slots.some(slot => uploads[slot.key]?.files.length && !screenshotSourceMatches(uploads[slot.key].url, slot.url))) { setMessage("A link has changed since screenshots were uploaded. Restore the link or remove its screenshots and upload them again."); return; }
    const chosen = slots.flatMap(slot => (uploads[slot.key]?.files || []).map(file => ({ url: slot.url.trim(), file })));
    if (!chosen.length) { setMessage("Attach at least one screenshot to analyze."); return; }
    onSyncSources(sources, otherSelected ? sourceFields.extra.map(value => value.trim()).filter(Boolean) : []);
    if (context !== draft.auditContext) update("auditContext", context);
    auditedRecord.current = currentRecordId();
    auditedVersion.current = currentRecordVersion();
    setOutreachSelection([]);
    savedEvidence.current = null; findingIds.current = []; priorAuditReport.current = draft.auditReport;
    setBusy(true); setMessage(""); setAudit(null);
    try {
      const attachments = await Promise.all(chosen.map(async ({ url, file }) => ({ url, name: file.name, dataUrl: await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error(`Could not read ${file.name}.`)); reader.readAsDataURL(file); }) })));
      const response = await fetch("/strategy/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urls, attachments, context, businessType: draft.businessType, businessTypeOther: draft.businessTypeOther }) });
      const result = await response.json();
      if (!response.ok) { setMessage([result.error, ...(result.sources ?? []).map((source: { url: string; message: string }) => `${source.url}: ${source.message}`)].join("\n")); return; }
      setReviewDirty(true); setAudit(result as Audit); findingIds.current = result.findings.map(() => crypto.randomUUID()); setSelected(result.findings.map(() => false));
    } catch (error) { setMessage(error instanceof Error ? error.message : "The audit request failed. Please try again."); }
    finally { setBusy(false); }
  }
  async function apply(output: "audit" | "proposal" | "strategy") {
    if (!audit) return;
    if (!auditedRecord.current || currentRecordId() !== auditedRecord.current || currentRecordVersion() !== auditedVersion.current) { setMessage("The strategy details or audit type changed. Run the audit again before creating the strategy."); return; }
    const startingVersion = currentRecordVersion();
    const approved = audit.findings.filter((_, index) => selected[index]);
    if (!approved.length && output !== "audit") { setMessage("Select at least one finding to create a document."); return; }
    setBusy(true); setMessage("");
    const uploaded: string[] = [];
    try {
      let outline = "";
      if (output !== "audit") {
        const response = await fetch("/strategy/audit/outline", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ output, findings: approved, sources: audit.sources.map(({ url, status, message: sourceMessage, checkedAt }) => ({ url, status, message: sourceMessage, checkedAt })), context: [context, `Reviewed business details (source-derived suggestions, subject to confirmation): ${JSON.stringify({ business: audit.business, about: audit.about, audience: audit.audience, offerings: audit.offerings, differentiator: audit.differentiator })}`, ""].filter(Boolean).join("\n") }) });
        const result = await response.json();
        if (!response.ok || typeof result.outline !== "string") throw new Error(result.error || `Could not generate the ${output}.`);
        outline = result.outline;
      }
      const evidence: AuditEvidence[] = [];
      const folder = crypto.randomUUID();
      if (!savedEvidence.current) for (const source of audit.sources) for (const [kind, image, name] of [...(source.images || []).map(item => [item.kind, item.dataUrl, item.name] as const), ["desktop", source.screenshot, "desktop.jpg"], ["mobile", source.mobileScreenshot, "mobile.jpg"]] as const) {
        if (!image) continue;
        const blob = await (await fetch(image)).blob();
        const id = crypto.randomUUID();
        const path = await uploadAttachment(ownerId, folder, id, new File([blob], name, { type: blob.type || "image/jpeg" }));
        uploaded.push(path); evidence.push({ path, url: source.url, checkedAt: source.checkedAt, kind });
      }
      if (currentRecordId() !== auditedRecord.current || currentRecordVersion() !== startingVersion) throw new Error("The strategy changed while the audit was saving; audit evidence was not added. Run the audit again.");
      const findings: Finding[] = audit.findings.flatMap((finding, index) => selected[index] ? [{ id: findingIds.current[index], source: finding.source, date: new Date().toISOString().slice(0, 10), observation: `${finding.observation}\nRecommendation: ${finding.recommendation}`, status: finding.kind, category: "" }] : []);
      const scoring = scoreChecks(audit.checks);
      const scorecard = scoring.rows.map(row => `${row.category}: ${row.score === null ? "not scored" : `${row.score}/100`} (${row.assessed}/${row.total} checks assessed)\n${row.items.map(item => `  ${item.label}: ${item.status.replaceAll("_", " ")} — ${item.evidence}${item.source ? ` [${item.source}]` : ""}`).join("\n")}`).join("\n");
      const sourceSummary = audit.sources.map(source => `${source.url}: ${source.status} (${source.message}; ${source.checkedAt})`).join("\n");
      const scoreText = `Preliminary weighted audit rubric (20/20/20/25/15): ${scoring.coverage}% evidence coverage; ${scoring.score === null ? "overall score unavailable" : `overall ${scoring.score}/100`}. Coverage-based confidence: ${scoring.coverage >= 80 ? "moderate" : "low"}. The score describes all analyzed source evidence, including findings not selected for the strategy; it is not a performance measurement or a guarantee of accuracy.`;
      if (output === "strategy") outline = outline.replace("3. Audit findings\n", `3. Audit findings\n${scoreText}\n\n`);
      const performanceSummary = audit.performance ? `${audit.performance.url || "No website"}: ${audit.performance.score === null ? "Unavailable" : `${audit.performance.score}/100`} — ${audit.performance.message} (${audit.performance.checkedAt})` : "Not requested.";
      const report = `PRELIMINARY AUDIT REPORT\nRecommendations are subject to review and are not an approved proposal or strategy.\n\n${formatAuditSections(audit.report)}\n\nAUDIT SUMMARY\n${scoreText}\n\nSOURCE STATUS\n${sourceSummary}\n\nAUDIT CHECKS\n${scorecard}\n\nPAGESPEED MOBILE LAB CHECK\n${performanceSummary}\n\nAPPROVED FINDINGS\n${approved.length ? approved.map(f => `${f.kind.toUpperCase()}: ${f.observation}\nRecommendation: ${f.recommendation}\nPotential benefit: ${f.benefit || "Not assessed"}\nImpact: ${f.impact || "unknown"}; effort: ${f.effort || "unknown"}\nSource: ${f.source}`).join("\n\n") : "No findings approved."}\n\nALL GENERATED FINDINGS (UNREVIEWED RESEARCH)\n${audit.findings.map(f => `${f.kind}: ${f.observation}\nOpportunity: ${f.recommendation}\nSource: ${f.source}`).join("\n\n")}`;
      const priorEvidence = savedEvidence.current ?? evidence;
      const updatedFindings = [...draft.findings.filter(f => !findingIds.current.includes(f.id)), ...findings];
      if (!onApply({ auditSnapshot: { ...audit, performance: null, sources: audit.sources.map(({ screenshot, mobileScreenshot, images, ...source }) => ({ ...source, imageKinds: images?.map(image => image.kind) || source.imageKinds })), findings: audit.findings.map((finding, index) => ({ ...finding, approved: selected[index], reviewId: findingIds.current[index] })) }, approvedAuditFindings: approved, auditSourceStatus: audit.sources.map(({ url, status, message, checkedAt }) => ({ url, status, message, checkedAt })), businessType: draft.businessType || audit.businessType || "", business: draft.business || audit.business, about: draft.about || audit.about, audience: draft.audience || audit.audience || "", offerings: draft.offerings || audit.offerings || "", differentiator: draft.differentiator || audit.differentiator || "", findings: updatedFindings, auditEvidence: savedEvidence.current ? draft.auditEvidence : [...draft.auditEvidence, ...priorEvidence], auditBased: output === "strategy" || draft.auditBased, auditReport: priorAuditReport.current ? `${priorAuditReport.current}\n\n--- New audit ---\n\n${report}` : report, research: [draft.research, savedEvidence.current ? "" : `Audit sources:\n${sourceSummary}\n\nAudit checks:\n${scorecard}`].filter(Boolean).join("\n\n"), ...(output === "proposal" ? { proposal: draft.proposal ? `${draft.proposal}\n\n--- New proposal ---\n\n${outline}` : outline } : output === "strategy" ? { strategy: draft.strategy ? `${draft.strategy}\n\n--- New audit outline ---\n\n${outline}` : outline } : {}) })) throw new Error("Could not save the browser backup; the audit was not added.");
      savedEvidence.current = priorEvidence; auditedVersion.current = currentRecordVersion(); setReviewDirty(false);
      setMessage(output === "audit" ? (approved.length ? "Audit saved. You can now use the approved findings for outreach or a document." : "Audit saved. Approve findings when you are ready to use them for outreach or a document.") : `Audit and ${output} saved. You can also create the other document from these findings.`);
    } catch (error) {
      if (uploaded.length) await deleteAttachmentPaths(uploaded).catch(() => {});
      setMessage(error instanceof Error ? error.message : "Could not save audit evidence. Please try again.");
    } finally { setBusy(false); }
  }
  async function createDocument(output: "proposal" | "strategy") {
    const record = currentRecordId();
    const version = currentRecordVersion();
    if (!record || !draft.approvedAuditFindings.length || reviewDirty) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/strategy/audit/outline", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ output, findings: draft.approvedAuditFindings, sources: draft.auditSourceStatus, context: [buildExistingContextSummary({ ...draft, findings: [], research: "", strategy: "", proposal: "", auditReport: "" }, draft.auditContext), `Saved audit scorecard (reflects all assessed evidence, including findings not selected; preliminary and subject to review): ${(draft.auditReport.split("\n\n--- New audit ---\n\n").at(-1)?.split("AUDIT SUMMARY\n").at(-1) || "").split("\n\nAPPROVED FINDINGS\n")[0].slice(0, 6000)}`].join("\n") }) });
      const result = await response.json();
      if (!response.ok || typeof result.outline !== "string") throw new Error(result.error || `Could not create the ${output}.`);
      if (currentRecordId() !== record || currentRecordVersion() !== version) throw new Error("The record changed while the document was being created. Please try again.");
      const existing = draft[output];
      if (!onApply({ [output]: existing ? `${existing}\n\n--- New ${output} ---\n\n${result.outline}` : result.outline, ...(output === "strategy" ? { auditBased: true } : {}) })) throw new Error("Could not save the document.");
      auditedVersion.current = currentRecordVersion();
      onDocumentCreated(output);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not create the document."); }
    finally { setBusy(false); }
  }
  const score = audit ? scoreChecks(audit.checks) : null;
  return <section className="source-audit"><div className="strategy-heading"><h2>Client Audit<span>.</span></h2></div>
    <div className="strategy-fields audit-intake"><div className="audit-source-input"><label>Website<input type="url" value={sourceFields.website} disabled={busy} onChange={event => setSourceFields(current => ({ ...current, website: event.target.value }))} onBlur={() => { if (sources !== draft.auditSources) onSyncSources(sources, otherSelected ? sourceFields.extra.map(value => value.trim()).filter(Boolean) : []); }} placeholder="https://example.com" /></label>{screenshotInput("website", sourceFields.website)}</div>
    <fieldset className="audit-choice audit-platforms"><legend>Social profiles</legend><div className="audit-platform-options">{auditPlatforms.map(platform => <label key={platform}><input type="checkbox" checked={selectedPlatforms.includes(platform)} disabled={busy} onChange={event => { const next = event.target.checked ? [...selectedPlatforms, platform] : selectedPlatforms.filter(item => item !== platform); setSelectedPlatforms(next); const value = selectedSources({ ...sourceFields, extra: otherSelected ? sourceFields.extra : [] }, next); if (value !== draft.auditSources) onSyncSources(value, otherSelected ? sourceFields.extra.map(item => item.trim()).filter(Boolean) : []); }} />{platform === "Amazon Author Central" ? "Amazon" : platform}</label>)}<label><input type="checkbox" checked={otherSelected} disabled={busy} onChange={event => { const selected = event.target.checked; setOtherSelected(selected); if (selected && !sourceFields.extra.length) setSourceFields(current => ({ ...current, extra: [""] })); if (!selected) { const value = selectedSources({ ...sourceFields, extra: [] }, selectedPlatforms); if (value !== draft.auditSources) onSyncSources(value, []); } }} />Other</label></div>{auditPlatforms.filter(platform => selectedPlatforms.includes(platform)).map(platform => <div className="audit-source-input" key={platform}><label className="audit-platform-link">{platform === "Amazon Author Central" ? "Amazon" : platform} link<input type="url" value={sourceFields.profiles[platform]} disabled={busy} onChange={event => { const value = event.target.value; setSourceFields(current => ({ ...current, profiles: { ...current.profiles, [platform]: value } })); }} onBlur={() => { if (sources !== draft.auditSources) onSyncSources(sources, otherSelected ? sourceFields.extra.map(value => value.trim()).filter(Boolean) : []); }} placeholder="https://" /></label>{screenshotInput(platform, sourceFields.profiles[platform])}</div>)}{otherSelected && <div className="audit-other-links">{sourceFields.extra.map((url, index) => <div className="audit-source-input" key={index}><label className="audit-platform-link">Other link<input type="url" value={url} disabled={busy} onChange={event => { const value = event.target.value; setSourceFields(current => ({ ...current, extra: current.extra.map((item, i) => i === index ? value : item) })); }} onBlur={() => { if (sources !== draft.auditSources) onSyncSources(sources, otherSelected ? sourceFields.extra.map(value => value.trim()).filter(Boolean) : []); }} placeholder="https://" /></label>{screenshotInput(`other:${index}`, url)}</div>)}<button type="button" disabled={busy} onClick={() => setSourceFields(current => ({ ...current, extra: [...current.extra, ""] }))}>Add link</button></div>}</fieldset>

    <CustomSelect label="Business type" value={draft.businessType} disabled={!ready || busy} onChange={value => update("businessType", value)} options={[{ value: "", label: "Automatic detection" }, ...(draft.businessType && !(businessTypes as readonly string[]).includes(draft.businessType) ? [{ value: draft.businessType, label: draft.businessType }] : []), ...businessTypes.map(value => ({ value, label: value }))]} />
    {draft.businessType === "Other" && <label>Specify business type<input value={draft.businessTypeOther} disabled={!ready || busy} onChange={event => update("businessTypeOther", event.target.value)} /></label>}
    <label>Additional context (optional)<textarea rows={2} value={context} disabled={busy} onChange={event => setContext(event.target.value)} onBlur={() => { if (context !== draft.auditContext) update("auditContext", context); }} placeholder="Known objectives, concerns, budget or special instructions…" /></label>
    </div>
    <p className="source-audit-note">Attach up to 12 images (PNG, JPEG or WebP; 5 MB each, 12 MB total). Save the audit to keep them.</p>
    <div className="strategy-actions"><button type="button" className="strategy-button" disabled={!ready || busy} onClick={() => void run()}>{busy ? "Analyzing sources…" : "Analyze Sources"}</button></div>

    {message && <p role="status" className="source-audit-note" style={{ whiteSpace: "pre-line" }}>{message}</p>}
    {audit && <div className="source-audit-results">
      <div><h3>Audit results</h3><p>{audit.business || "Business not identified"} · {audit.businessType || draft.businessType || "Business type unconfirmed"}</p></div>
      <div className="audit-metrics"><div><strong>{audit.sources.filter(source => source.status === "accessible").length}/{audit.sources.length}</strong><span>Sources with screenshots</span></div><div><strong>{audit.findings.length}</strong><span>Findings</span></div><div><strong>{Math.min(3, audit.findings.filter(finding => finding.verification !== "rejected").length)}</strong><span>Opportunities to review</span></div></div>
      <section><h3>Prospect overview</h3><p>{audit.about || "Business overview unavailable."}</p><p><strong>Audience:</strong> {audit.audience || "Not established"} · <strong>Offering:</strong> {audit.offerings || "Not established"}</p><p>Source-derived suggestions require review.</p></section>
      <section><h3>Digital presence</h3>{audit.sources.map(source => <details key={source.url}><summary>{sourceFields.extra.includes(source.url) ? "Other" : sourcePlatform(source.url) || "Website"} — {source.status === "accessible" ? "Evidence available" : "No screenshot"} · {source.url}</summary>{audit.findings.find(finding => finding.source === source.url && finding.verification !== "rejected") && <p>{audit.findings.find(finding => finding.source === source.url && finding.verification !== "rejected")?.observation}</p>}<p>{source.message} Checked {new Date(source.checkedAt).toLocaleString()}</p><a href={source.url} target="_blank" rel="noreferrer">Open source</a>{source.text && <details><summary>Extracted text</summary><p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{source.text}</p></details>}{source.metadata && <details><summary>Page details</summary><pre>{source.metadata}</pre></details>}{source.images?.map(image => <img key={image.kind} src={image.dataUrl} alt={image.name} />)}{source.screenshot && <div><img src={source.screenshot} alt={`Desktop capture of ${source.url}`} />{source.mobileScreenshot && <img src={source.mobileScreenshot} alt={`Mobile capture of ${source.url}`} />}</div>}</details>)}</section>
      <section><h3>Top opportunities</h3><p>Ranked by evidence confidence, relevance, potential impact, service fit, outreach suitability and ease of explaining the opportunity. Estimates require review.</p>{rankOpportunities(audit.findings.map((finding, index) => ({ ...finding, index }))).slice(0, 3).map(finding => <div className="audit-opportunity" key={finding.index}><strong>{finding.recommendation}</strong><p>{finding.impact || "unknown"} impact · {finding.kind === "observed" ? "Observation to review" : "Inference — needs verification"}</p><p>{finding.observation}</p><p>{finding.benefit}</p><p>Service: {finding.service || "Not assessed"} · Service relevance: {finding.serviceRelevance || "unknown"}</p>{finding.outreachAngle && <p>Possible outreach angle: {finding.outreachAngle}</p>}<a href={finding.source} target="_blank" rel="noreferrer">View source</a></div>)}</section>
      <section><h3>Review findings by source</h3><p>Approve only findings you have checked. Verification is your assessment, not an automated guarantee.</p><div className="audit-filters"><label>Platform<select value={platformFilter} onChange={event => setPlatformFilter(event.target.value)}><option value="all">All platforms</option>{[...new Set(audit.sources.map(source => sourceFields.extra.includes(source.url) ? "Other" : sourcePlatform(source.url) || "Website"))].map(platform => <option key={platform} value={platform}>{platform}</option>)}</select></label><label>Impact<select value={priorityFilter} onChange={event => setPriorityFilter(event.target.value)}><option value="all">All levels</option>{["high", "medium", "low", "unknown"].map(level => <option key={level}>{level}</option>)}</select></label><label>Verification<select value={verificationFilter} onChange={event => setVerificationFilter(event.target.value)}><option value="all">All statuses</option><option value="needs_review">Needs review</option><option value="verified">Verified by me</option><option value="rejected">Rejected</option></select></label></div>{audit.sources.map(source => { const entries = audit.findings.map((finding, index) => ({ finding, index })).filter(item => item.finding.source === source.url && matchesAuditFilters(item.finding, sourceFields.extra.includes(source.url) ? "Other" : sourcePlatform(source.url) || "Website", { platform: platformFilter, impact: priorityFilter, verification: verificationFilter })); return entries.length ? <details key={source.url}><summary>{source.url} · {entries.length} findings</summary>{entries.map(({ finding, index }) => <div className="source-audit-finding" id={`audit-finding-${index}`} key={index}><input aria-label={`Approve finding ${index + 1}`} type="checkbox" checked={selected[index]} disabled={finding.verification === "rejected"} onChange={event => { setReviewDirty(true); setSelected(current => current.map((value, i) => i === index ? event.target.checked : value)); }} /><span><strong>{finding.kind === "observed" ? "Observation — review evidence" : "Inference — needs verification"}</strong><textarea aria-label={`Finding ${index + 1}`} value={finding.observation} onChange={event => { setReviewDirty(true); setAudit(current => current ? { ...current, findings: current.findings.map((item, i) => i === index ? { ...item, observation: event.target.value } : item) } : current); }} /><label>Verification<select value={finding.verification || "needs_review"} onChange={event => { const verification = event.target.value; setReviewDirty(true); setAudit(current => current ? { ...current, findings: current.findings.map((item, i) => i === index ? { ...item, verification } : item) } : current); if (verification === "rejected") setSelected(current => current.map((value, i) => i === index ? false : value)); }}><option value="needs_review">Needs review</option><option value="verified">Verified by me</option><option value="rejected">Rejected</option></select></label><label>Opportunity<textarea value={finding.recommendation} onChange={event => { setReviewDirty(true); setAudit(current => current ? { ...current, findings: current.findings.map((item, i) => i === index ? { ...item, recommendation: event.target.value } : item) } : current); }} /></label><span>Severity: {finding.severity || "unknown"} · Potential impact: {finding.impact || "unknown"} · Effort: {finding.effort || "unknown"}<br />Evidence confidence: {finding.confidence || "unknown"} · Relevance: {finding.relevance || "unknown"} · Ease of communication: {finding.communicationEase || "unknown"}<br />Outreach suitability: {finding.outreachSuitability || "unknown"} · Service relevance: {finding.serviceRelevance || "unknown"}<br />Suggested service: {finding.service || "Not assessed"}<br />Why it matters: {finding.benefit || "Not assessed"}</span><a href={finding.source} target="_blank" rel="noreferrer">View source evidence</a>{(source.screenshot || source.mobileScreenshot || source.images?.length) && <details><summary>Screenshot evidence</summary><p>Select a point on a screenshot to mark it for your review. This marker is added by you.</p>{([...([ ["desktop", source.screenshot], ["mobile", source.mobileScreenshot] ] as const), ...(source.images || []).map(item => [item.kind, item.dataUrl] as const)]).map(([kind, image]) => image && <div key={kind}><p>{kind === "desktop" ? "Desktop" : kind === "mobile" ? "Mobile" : "Attached screenshot"}</p><button type="button" className="audit-evidence-image" aria-label={`Mark ${kind} screenshot evidence`} onClick={event => { const bounds = event.currentTarget.getBoundingClientRect(); const point = event.detail ? { x: Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)), y: Math.max(0, Math.min(100, (event.clientY - bounds.top) / bounds.height * 100)) } : { x: 50, y: 50 }; const evidencePoint = { ...point, kind }; setReviewDirty(true); setAudit(current => current ? { ...current, findings: current.findings.map((item, i) => i === index ? { ...item, evidencePoint } : item) } : current); }}><img src={image} alt={`${kind} screenshot of ${source.url}`} />{finding.evidencePoint && (finding.evidencePoint.kind || "desktop") === kind && <span className="audit-evidence-marker" style={{ left: `${finding.evidencePoint.x}%`, top: `${finding.evidencePoint.y}%` }} />}</button></div>)}{finding.evidencePoint && <button type="button" onClick={() => { setReviewDirty(true); setAudit(current => current ? { ...current, findings: current.findings.map((item, i) => i === index ? { ...item, evidencePoint: undefined } : item) } : current); }}>Clear marker</button>}</details>}</span></div>)}</details> : null; })}</section>
      <details><summary>Business details and full research</summary><p>Review or correct source-derived suggestions.</p>{([["business", "Business name"], ["about", "Business overview"], ["audience", "Audience"], ["offerings", "Products or services"], ["differentiator", "What makes them different"]] as const).map(([field, label]) => <label key={field}>{label}<textarea rows={2} value={audit[field] || ""} onChange={event => { setReviewDirty(true); setAudit(current => current ? { ...current, [field]: event.target.value } : current); }} /></label>)}{reportSections.map(section => <section className="audit-opportunity" key={section.key}><h4>{section.label}</h4><p style={{whiteSpace:"pre-line"}}>{audit.report[section.key] || "Not available."}</p></section>)}</details>
      <details><summary>Evidence and audit scorecard</summary><p>Overall: {score?.score === null ? "Not enough evidence" : `${score?.score}/100`} · Evidence coverage: {score?.coverage}%. Scores are preliminary.</p>{score?.rows.map(row => <section className="audit-scorecard" key={row.category}><h4>{row.category}: {row.score === null ? "Not assessed" : `${row.score}/100`}</h4><ul>{row.items.map(item => <li key={item.id}><strong>{item.label} — {item.status.replaceAll("_", " ")}</strong><p>{item.evidence} {item.source && <a href={item.source} target="_blank" rel="noreferrer">View source</a>}</p></li>)}</ul></section>)}</details>
      <div className="strategy-actions"><button type="button" disabled={busy} onClick={() => void apply("audit")}>Save reviewed audit</button></div>
    </div>}
    {!audit && draft.auditReport && <div className="source-audit-results"><h3>Saved audit findings</h3><details><summary>View saved audit report</summary><pre>{draft.auditReport}</pre></details>{draft.approvedAuditFindings.length ? <ul>{draft.approvedAuditFindings.map((finding, index) => <li key={index}><strong>{finding.kind === "observed" ? "Observation" : "Inference"}:</strong> {finding.observation}<br />Recommendation: {finding.recommendation}<br />Source: {finding.source}</li>)}</ul> : <p>No approved findings are available for this saved audit.</p>}</div>}
    {draft.auditReport && <div className="source-audit-next audit-outreach"><h3>Generate outreach</h3><p>Choose one or two saved, approved findings. Review the message before using it.</p><label>Prospect status<select value={draft.prospectStatus} onChange={event => update("prospectStatus", event.target.value)}>{["Not contacted", "Contacted", "Replied", "Interested"].map(status => <option key={status}>{status}</option>)}</select></label><label>Channel<select value={channel} onChange={event => setChannel(event.target.value)}><option value="email">Cold email</option><option value="facebook">Facebook message</option><option value="linkedin">LinkedIn message</option></select></label><label>Approach<select value={approach} onChange={event => setApproach(event.target.value)}><option value="introduction">Soft introduction</option><option value="observation">Lead with an observation</option><option value="question">Start with a question</option></select></label><label>Tone<select value={tone} onChange={event => setTone(event.target.value)}><option value="friendly">Friendly and professional</option><option value="direct">Direct</option><option value="warm">Warm</option></select></label>{draft.approvedAuditFindings.map((finding, index) => <label className="audit-outreach-choice" key={`${finding.source}-${index}`}><input type="checkbox" checked={outreachSelection.includes(index)} onChange={event => setOutreachSelection(current => event.target.checked ? [...current, index] : current.filter(value => value !== index))} />{finding.observation} <small>({finding.kind === "observed" ? "observation" : "inference"})</small></label>)}<button type="button" disabled={busy || reviewDirty || outreachSelection.length < 1 || outreachSelection.length > 2} onClick={() => void generateOutreach()}>Generate outreach</button><label>Message<textarea rows={8} value={draft.outreachMessage} onChange={event => update("outreachMessage", event.target.value)} /></label><button type="button" disabled={!draft.outreachMessage} onClick={() => void navigator.clipboard.writeText(draft.outreachMessage).then(() => setMessage("Message copied.")).catch(() => setMessage("Could not copy message."))}>Copy message</button></div>}
    {draft.auditReport && <div className="source-audit-next"><h3>Continue from your saved audit</h3><p>{reviewDirty ? "Save your reviewed findings before continuing." : draft.approvedAuditFindings.length ? "Choose a document to create from the saved findings. You can return to create the other later." : "No approved findings are saved for document creation. Run an audit and approve findings to continue."}</p><div className="strategy-actions"><button type="button" disabled={!ready || busy} onClick={onClear}>Clear Data</button><button type="button" disabled={busy || reviewDirty || !draft.approvedAuditFindings.length} onClick={() => void createDocument("proposal")}>Create Proposal</button><button type="button" disabled={busy || reviewDirty || !draft.approvedAuditFindings.length} onClick={() => void createDocument("strategy")}>Create Strategy</button></div></div>}
  </section>;
}
