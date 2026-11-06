"use client";
import { useEffect, useRef, useState } from "react";
import CustomSelect from "./custom-select";
import AuditDashboard, { cleanOutreachDraft } from "./audit-dashboard";
import { formatDashboard, type Dashboard, type LedgerEntry } from "./audit/dashboard";
import { businessTypes } from "./schema";
import type { Draft, Finding, AuditEvidence } from "./schema";
import { uploadAttachment, deleteAttachmentPaths, readAttachment } from "./cloud";
import { scoreChecks } from "./audit/scoring";
import type { PageSpeedResult } from "./audit/pagespeed";
import { sourcePlatform, sourceKey, auditPlatforms, parseAuditSources, serializeAuditSources, type AuditPlatform } from "./source-links";
import { rankOpportunities } from "./audit/opportunities";
import { formatAuditSections, type AuditReport } from "./audit/report";
import { screenshotSourceMatches } from "./audit/manual-evidence";
import { MAX_AUDIT_IMAGE_BYTES, MAX_AUDIT_IMAGES, MAX_AUDIT_TOTAL_BYTES } from "./audit/upload-limits";

type Audit = {
  business: string; about: string; businessType: string; audience: string; offerings: string; differentiator: string;
  findings: { source: string; evidenceId?: string; observation: string; recommendation: string; kind: string; impact: string; effort: string; benefit: string; service?: string; serviceRelevance?: string; outreachAngle?: string; evidencePoint?: { x: number; y: number; kind?: string }; confidence?: string; severity?: string; outreachSuitability?: string; relevance?: string; communicationEase?: string; verification?: string; approved?: boolean; reviewId?: string }[];
  checks: { id: string; status: string; evidence: string; source: string }[];
  report: AuditReport;
  dashboard?: Dashboard; ledger?: LedgerEntry[];
  performance: PageSpeedResult | null;
  sources: { imageKinds?: string[]; images?: { kind: string; name: string; dataUrl: string }[]; url: string; status: string; message: string; checkedAt: string; text?: string; metadata?: string; screenshot?: string | null; mobileScreenshot?: string | null }[];
};
export default function SourceAudit({ ownerId, currentRecordId, currentRecordVersion, draft, ready, openResults, onApply, update, onSyncSources }: { ownerId: string; currentRecordId: () => string | null; currentRecordVersion: () => string | null; draft: Draft; ready: boolean; openResults: boolean; onApply: (patch: Partial<Draft>) => boolean; update: <K extends keyof Draft>(field: K, value: Draft[K]) => void; onSyncSources: (sources: string, otherSources: string[]) => void }) {
  const auditedRecord = useRef<string | null>(null);
  const auditedVersion = useRef<string | null>(null);
  const savedEvidence = useRef<AuditEvidence[] | null>(null);
  const findingIds = useRef<string[]>([]);
  const priorAuditReport = useRef("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const openedResults = useRef(false);
  const [sourceFields, setSourceFields] = useState(() => parseAuditSources(draft.auditSources, draft.auditOtherSources));
  const [selectedPlatforms, setSelectedPlatforms] = useState<AuditPlatform[]>(() => { const fields = parseAuditSources(draft.auditSources, draft.auditOtherSources); return auditPlatforms.filter(platform => Boolean(fields.profiles[platform])); });
  const selectedSources = (fields: typeof sourceFields, selected: readonly AuditPlatform[]) => serializeAuditSources({ ...fields, profiles: Object.fromEntries(auditPlatforms.map(platform => [platform, selected.includes(platform) ? fields.profiles[platform] : ""])) as typeof fields.profiles });
  const [otherSelected, setOtherSelected] = useState(() => parseAuditSources(draft.auditSources, draft.auditOtherSources).extra.length > 0);
  const sources = selectedSources({ ...sourceFields, extra: otherSelected ? sourceFields.extra : [] }, selectedPlatforms);
  const [uploads, setUploads] = useState<Record<string, { url: string; files: File[] }>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [context, setContext] = useState(() => draft.auditContext);
  const [busy, setBusy] = useState(false);
  const [generatingOutreach, setGeneratingOutreach] = useState(false);
  const [outreachError, setOutreachError] = useState("");
  const [message, setMessage] = useState("");
  const [audit, setAudit] = useState<Audit | null>(null);
  useEffect(() => {
    if (!openResults || openedResults.current || !resultsRef.current) return;
    if (!audit && draft.auditSnapshot && Array.isArray(draft.auditSnapshot.findings) && Array.isArray(draft.auditSnapshot.sources) && Array.isArray(draft.auditSnapshot.checks) && draft.auditSnapshot.report) return;
    openedResults.current = true;
    resultsRef.current.scrollIntoView({ block: "start" });
    resultsRef.current.focus({ preventScroll: true });
  }, [openResults, audit, draft.auditReport, draft.auditSnapshot]);
  const [selected, setSelected] = useState<boolean[]>([]);
  async function generateOutreach() {
    if (!audit?.dashboard || !audit.ledger || generatingOutreach) return;
    const dashboard = audit.dashboard;
    const reviewed = new Set(audit.ledger.filter(item => ["reviewed", "partially reviewed"].includes(item.status)).map(item => item.id));
    const observations = [...dashboard.opportunities, ...dashboard.strengths].filter(item => reviewed.has(item.sourceId)).map(item => item.observation).filter(Boolean).slice(0, 3);
    if (!observations.length) { setOutreachError("Review source evidence before generating outreach."); return; }
    setGeneratingOutreach(true); setOutreachError("");
    try {
      const response = await fetch("/strategy/audit/dashboard-outreach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ business: audit.business, observations, angle: dashboard.outreachAngle, previous: cleanOutreachDraft(dashboard.outreachDraft) }) });
      const result = await response.json();
      if (!response.ok || typeof result.message !== "string") throw new Error(result.error || "Could not generate outreach.");
      setAudit(current => current?.dashboard === dashboard ? { ...current, dashboard: { ...dashboard, outreachDraft: cleanOutreachDraft(result.message) } } : current);
    } catch (error) { setOutreachError(error instanceof Error ? error.message : "Could not generate outreach. Please try again."); }
    finally { setGeneratingOutreach(false); }
  }
  const imagesForSource = (entries: AuditEvidence[]) => entries.filter(item => item.kind.startsWith("manual:"));
  function bindPendingScreenshot(slot: string, url: string) {
    const value = url.trim();
    if (!sourceKey(value) || (slot !== "website" && !slot.startsWith("other:") && sourcePlatform(value) !== slot)) return;
    setUploads(current => {
      const existing = current[slot];
      return existing?.files.length && !existing.url ? { ...current, [slot]: { ...existing, url: value } } : current;
    });
  }
  function attachScreenshots(slot: string, url: string, files: FileList | null) {
    const incoming = Array.from(files || []);
    if (!incoming.length) return;
    const fail = (reason: string) => setUploadErrors(current => ({ ...current, [slot]: reason }));
    if (url.trim() && !sourceKey(url.trim())) { fail("Enter a valid source URL, or leave it blank until after selecting your screenshots."); return; }
    if (url.trim() && slot !== "website" && !slot.startsWith("other:") && sourcePlatform(url.trim()) !== slot) { fail(`Enter a valid ${slot === "Amazon Author Central" ? "Amazon" : slot} URL.`); return; }
    const bound = uploads[slot];
    if (bound?.files.length && bound.url && !screenshotSourceMatches(bound.url, url)) { fail("The link has changed. Remove its screenshots and upload them again for the new link."); return; }
    if (incoming.some(file => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > MAX_AUDIT_IMAGE_BYTES)) { fail("Use PNG, JPEG or WebP images up to 25 MB each."); return; }
    const all = [...Object.values(uploads).flatMap(item => item.files), ...incoming];
    if (all.length > MAX_AUDIT_IMAGES || all.reduce((sum, file) => sum + file.size, 0) > MAX_AUDIT_TOTAL_BYTES) { fail("Use up to 12 images, 50 MB total."); return; }
    setUploads(current => ({ ...current, [slot]: { url: current[slot]?.url || url.trim(), files: [...(current[slot]?.files || []), ...incoming] } })); setMessage("");
    setUploadErrors(current => ({ ...current, [slot]: "" }));
  }
  function removeOtherUrl(index: number) {
    const extra = sourceFields.extra.filter((_, i) => i !== index);
    setSourceFields(current => ({ ...current, extra }));
    setUploads(current => {
      const next: typeof current = {};
      for (const [key, value] of Object.entries(current)) {
        if (!key.startsWith("other:")) { next[key] = value; continue; }
        const slotIndex = Number(key.slice(6));
        if (slotIndex < index) next[key] = value;
        else if (slotIndex > index) next[`other:${slotIndex - 1}`] = value;
      }
      return next;
    });
    if (!extra.length) setOtherSelected(false);
    onSyncSources(selectedSources({ ...sourceFields, extra }, selectedPlatforms), extra.map(value => value.trim()).filter(Boolean));
  }
  function screenshotInput(slot: string, url: string) {
    const files = uploads[slot]?.files || [];
    const changed = files.length > 0 && Boolean(uploads[slot].url) && !screenshotSourceMatches(uploads[slot].url, url);
    return <div className="audit-attachments">
      <div className="audit-attachment-controls"><label className="audit-attach-button">Upload File<input type="file" accept="image/png,image/jpeg,image/webp" multiple disabled={busy} onChange={event => { attachScreenshots(slot, url, event.target.files); event.target.value = ""; }} /></label><span aria-live="polite">{files.length > 0 ? `${files.length} attached` : ""}</span></div>
      {uploadErrors[slot] && <p className="audit-field-error" role="alert">{uploadErrors[slot]}</p>}
      {files.length > 0 && !uploads[slot].url && <p className="audit-source-hint">Add the matching source URL before analyzing.</p>}
      {changed && <p className="audit-field-error" role="status">This link changed. Restore it or remove and re-upload its screenshots.</p>}
      {files.map((file, index) => <div className="audit-attachment" key={`${file.name}-${index}`}><span>{file.name}</span><button type="button" disabled={busy} aria-label={`Remove ${file.name}`} onClick={() => setUploads(current => { const remaining = current[slot].files.filter((_, i) => i !== index); return { ...current, [slot]: { url: remaining.length ? current[slot].url : "", files: remaining } }; })}>Remove</button></div>)}
    </div>;
  }
  useEffect(() => { if (ready) { const fields = parseAuditSources(draft.auditSources, draft.auditOtherSources); setSourceFields(fields); setSelectedPlatforms(auditPlatforms.filter(platform => Boolean(fields.profiles[platform]))); setOtherSelected(fields.extra.length > 0); setContext(draft.auditContext); } }, [ready]);
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
    if (slots.some(slot => uploads[slot.key]?.files.length && uploads[slot.key].url && !screenshotSourceMatches(uploads[slot.key].url, slot.url))) { setMessage("A link has changed since screenshots were uploaded. Restore the link or remove its screenshots and upload them again."); return; }
    const chosen = slots.flatMap(slot => (uploads[slot.key]?.files || []).map(file => ({ url: slot.url.trim(), sourceType: slot.key === "website" ? "Website" : slot.key.startsWith("other:") ? "Other" : slot.key, file })));
    onSyncSources(sources, otherSelected ? sourceFields.extra.map(value => value.trim()).filter(Boolean) : []);
    if (context !== draft.auditContext) update("auditContext", context);
    auditedRecord.current = currentRecordId();
    auditedVersion.current = currentRecordVersion();
    savedEvidence.current = null; findingIds.current = []; priorAuditReport.current = draft.auditReport;
    setBusy(true); setMessage(""); setAudit(null);
    try {
      const attachments = await Promise.all(chosen.map(async ({ url, sourceType, file }) => ({ url, sourceType, name: file.name, dataUrl: await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error(`Could not read ${file.name}.`)); reader.readAsDataURL(file); }) })));
      const response = await fetch("/strategy/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urls, attachments, sourceTypes: Object.fromEntries(slots.filter(slot => slot.url.trim()).map(slot => [slot.url.trim(), slot.key === "website" ? "Website" : slot.key.startsWith("other:") ? "Other" : slot.key])), context, businessType: draft.businessType, businessTypeOther: draft.businessTypeOther }) });
      const result = await response.json();
      if (!response.ok) { setMessage([result.error, ...(result.sources ?? []).map((source: { url: string; message: string }) => `${source.url}: ${source.message}`)].join("\n")); return; }
      const completedAudit = result as Audit;
      const unapproved = completedAudit.findings.map(() => false);
      setAudit(completedAudit); findingIds.current = completedAudit.findings.map(() => crypto.randomUUID()); setSelected(unapproved);
      await apply("audit", completedAudit, unapproved);
    } catch (error) { setMessage(error instanceof Error ? error.message : "The audit request failed. Please try again."); }
    finally { setBusy(false); }
  }
  async function apply(output: "audit" | "proposal" | "strategy", audit: Audit | null, selected: boolean[]) {
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
      const report = `PRELIMINARY AUDIT REPORT\nRecommendations are subject to review and are not an approved proposal or strategy.\n\n${audit.dashboard && audit.ledger ? formatDashboard(audit.dashboard, audit.ledger, audit.business, draft.businessType === "Other" ? draft.businessTypeOther || "Other" : draft.businessType || audit.businessType) : formatAuditSections(audit.report)}\n\nAUDIT SUMMARY\n${scoreText}\n\nSOURCE STATUS\n${sourceSummary}\n\nAUDIT CHECKS\n${scorecard}\n\nPAGESPEED MOBILE LAB CHECK\n${performanceSummary}\n\nAPPROVED FINDINGS\n${approved.length ? approved.map(f => `${f.kind.toUpperCase()}: ${f.observation}\nRecommendation: ${f.recommendation}\nPotential benefit: ${f.benefit || "Not assessed"}\nImpact: ${f.impact || "unknown"}; effort: ${f.effort || "unknown"}\nSource: ${f.source}${f.evidenceId ? ` [${f.evidenceId}]` : ""}`).join("\n\n") : "No findings approved."}\n\nALL GENERATED FINDINGS (UNREVIEWED RESEARCH)\n${audit.findings.map(f => `${f.kind}: ${f.observation}\nOpportunity: ${f.recommendation}\nSource: ${f.source}${f.evidenceId ? ` [${f.evidenceId}]` : ""}`).join("\n\n")}`;
      const priorEvidence = savedEvidence.current ?? evidence;
      const updatedFindings = [...draft.findings.filter(f => !findingIds.current.includes(f.id)), ...findings];
      if (!onApply({ auditSnapshot: { ...audit, performance: null, sources: audit.sources.map(({ screenshot, mobileScreenshot, images, ...source }) => ({ ...source, imageKinds: images?.map(image => image.kind) || source.imageKinds })), findings: audit.findings.map((finding, index) => ({ ...finding, approved: selected[index], reviewId: findingIds.current[index] })) }, approvedAuditFindings: approved, auditSourceStatus: audit.sources.map(({ url, status, message, checkedAt }) => ({ url, status, message, checkedAt })), businessType: draft.businessType || audit.businessType || "", business: draft.business || audit.business, about: draft.about || audit.about, audience: draft.audience || audit.audience || "", offerings: draft.offerings || audit.offerings || "", differentiator: draft.differentiator || audit.differentiator || "", findings: updatedFindings, auditEvidence: savedEvidence.current ? draft.auditEvidence : [...draft.auditEvidence, ...priorEvidence], auditBased: output === "strategy" || draft.auditBased, auditReport: priorAuditReport.current ? `${priorAuditReport.current}\n\n--- New audit ---\n\n${report}` : report, research: [draft.research, savedEvidence.current ? "" : `Audit sources:\n${sourceSummary}\n\nAudit checks:\n${scorecard}`].filter(Boolean).join("\n\n"), ...(output === "proposal" ? { proposal: draft.proposal ? `${draft.proposal}\n\n--- New proposal ---\n\n${outline}` : outline } : output === "strategy" ? { strategy: draft.strategy ? `${draft.strategy}\n\n--- New audit outline ---\n\n${outline}` : outline } : {}) })) throw new Error("Could not save the browser backup; the audit was not added.");
      savedEvidence.current = priorEvidence; auditedVersion.current = currentRecordVersion();
      setMessage(output === "audit" ? (approved.length ? "Audit saved. You can now use the approved findings for outreach or a document." : "Audit saved.") : `Audit and ${output} saved. You can also create the other document from these findings.`);
    } catch (error) {
      if (uploaded.length) await deleteAttachmentPaths(uploaded).catch(() => {});
      setMessage(error instanceof Error ? error.message : "Could not save audit evidence. Please try again.");
    } finally { setBusy(false); }
  }
  return <section className="source-audit"><div className="strategy-heading"><h2>Client Audit<span>.</span></h2></div>
    <div className="strategy-fields audit-intake"><div className="audit-source-input"><label>Website<input type="url" value={sourceFields.website} disabled={busy} aria-invalid={Boolean(sourceFields.website.trim()) && (!sourceKey(sourceFields.website.trim()) || Boolean(sourcePlatform(sourceFields.website.trim()))) || undefined} aria-describedby={sourceFields.website.trim() && (!sourceKey(sourceFields.website.trim()) || sourcePlatform(sourceFields.website.trim())) ? "audit-website-error" : undefined} onChange={event => setSourceFields(current => ({ ...current, website: event.target.value }))} onBlur={() => { bindPendingScreenshot("website", sourceFields.website); if (sources !== draft.auditSources) onSyncSources(sources, otherSelected ? sourceFields.extra.map(value => value.trim()).filter(Boolean) : []); }} placeholder="https://example.com" /></label>{sourceFields.website.trim() && (!sourceKey(sourceFields.website.trim()) || sourcePlatform(sourceFields.website.trim())) && <p id="audit-website-error" className="audit-field-error">{!sourceKey(sourceFields.website.trim()) ? "Enter a valid URL starting with http:// or https://." : "Enter a business website URL. Add social profiles under their matching platforms."}</p>}{screenshotInput("website", sourceFields.website)}</div>
    <fieldset className="audit-choice audit-platforms"><legend>Social Profiles</legend><div className="audit-platform-options">{auditPlatforms.map(platform => <label key={platform}><input type="checkbox" checked={selectedPlatforms.includes(platform)} disabled={busy} onChange={event => { const next = event.target.checked ? [...selectedPlatforms, platform] : selectedPlatforms.filter(item => item !== platform); setSelectedPlatforms(next); const value = selectedSources({ ...sourceFields, extra: otherSelected ? sourceFields.extra : [] }, next); if (value !== draft.auditSources) onSyncSources(value, otherSelected ? sourceFields.extra.map(item => item.trim()).filter(Boolean) : []); }} />{platform === "Amazon Author Central" ? "Amazon" : platform}</label>)}<label><input type="checkbox" checked={otherSelected} disabled={busy} onChange={event => { const selected = event.target.checked; setOtherSelected(selected); if (selected && !sourceFields.extra.length) setSourceFields(current => ({ ...current, extra: [""] })); if (!selected) { const value = selectedSources({ ...sourceFields, extra: [] }, selectedPlatforms); if (value !== draft.auditSources) onSyncSources(value, []); } }} />Other</label></div>{auditPlatforms.filter(platform => selectedPlatforms.includes(platform)).map(platform => <div className="audit-source-input audit-profile-group" key={platform}><label className="audit-platform-link">{platform === "Amazon Author Central" ? "Amazon" : platform} URL<input type="url" value={sourceFields.profiles[platform]} disabled={busy} aria-invalid={Boolean(sourceFields.profiles[platform].trim()) && (!sourceKey(sourceFields.profiles[platform].trim()) || sourcePlatform(sourceFields.profiles[platform].trim()) !== platform) || undefined} aria-describedby={sourceFields.profiles[platform].trim() && (!sourceKey(sourceFields.profiles[platform].trim()) || sourcePlatform(sourceFields.profiles[platform].trim()) !== platform) ? `audit-profile-error-${auditPlatforms.indexOf(platform)}` : undefined} onChange={event => { const value = event.target.value; setSourceFields(current => ({ ...current, profiles: { ...current.profiles, [platform]: value } })); }} onBlur={() => { bindPendingScreenshot(platform, sourceFields.profiles[platform]); if (sources !== draft.auditSources) onSyncSources(sources, otherSelected ? sourceFields.extra.map(value => value.trim()).filter(Boolean) : []); }} placeholder="https://" /></label>{sourceFields.profiles[platform].trim() && (!sourceKey(sourceFields.profiles[platform].trim()) || sourcePlatform(sourceFields.profiles[platform].trim()) !== platform) && <p id={`audit-profile-error-${auditPlatforms.indexOf(platform)}`} className="audit-field-error">{!sourceKey(sourceFields.profiles[platform].trim()) ? "Enter a valid URL starting with http:// or https://." : `Enter a valid ${platform === "Amazon Author Central" ? "Amazon" : platform} URL.`}</p>}{screenshotInput(platform, sourceFields.profiles[platform])}</div>)}{otherSelected && <div className="audit-other-links"><span className="audit-other-title">Other Sources</span>{sourceFields.extra.map((url, index) => {
      const invalid = Boolean(url.trim()) && !sourceKey(url.trim());
      const hasFiles = (uploads[`other:${index}`]?.files.length || 0) > 0;
      const errorId = `audit-other-error-${index}`;
      return <div className="audit-source-input audit-other-row" key={index}><div className="audit-other-heading"><label htmlFor={`audit-other-url-${index}`}>URL {index + 1}</label><button type="button" className="audit-remove-url" disabled={busy} aria-label={`Remove source ${index + 1}${hasFiles ? " and its screenshots" : ""}`} onClick={() => removeOtherUrl(index)}>Remove source</button></div><input id={`audit-other-url-${index}`} type="url" value={url} disabled={busy} aria-invalid={invalid || undefined} aria-describedby={invalid ? errorId : undefined} onChange={event => { const value = event.target.value; setSourceFields(current => ({ ...current, extra: current.extra.map((item, i) => i === index ? value : item) })); }} onBlur={() => { bindPendingScreenshot(`other:${index}`, url); if (sources !== draft.auditSources) onSyncSources(sources, otherSelected ? sourceFields.extra.map(value => value.trim()).filter(Boolean) : []); }} placeholder="https://example.com" />{invalid && <p id={errorId} className="audit-field-error">Enter a valid URL starting with http:// or https://.</p>}{screenshotInput(`other:${index}`, url)}{hasFiles && <p className="audit-source-hint">Removing this source also removes its screenshots.</p>}</div>;
    })}<button type="button" className="audit-add-url" disabled={busy} onClick={() => setSourceFields(current => ({ ...current, extra: [...current.extra, ""] }))}>Add URL</button></div>}</fieldset>

    <CustomSelect label="Business Type" value={draft.businessType} disabled={!ready || busy} onChange={value => update("businessType", value)} options={[{ value: "", label: "Automatic Detection" }, ...(draft.businessType && !(businessTypes as readonly string[]).includes(draft.businessType) ? [{ value: draft.businessType, label: draft.businessType }] : []), ...businessTypes.map(value => ({ value, label: value.replace(/\b\w/g, letter => letter.toUpperCase()).replace(/\bOr\b/g, "or") }))]} />
    {draft.businessType === "Other" && <label>Specify Business Type<input value={draft.businessTypeOther} disabled={!ready || busy} onChange={event => update("businessTypeOther", event.target.value)} /></label>}
    <label>Additional Context (optional)<textarea rows={2} value={context} disabled={busy} onChange={event => setContext(event.target.value)} onBlur={() => { if (context !== draft.auditContext) update("auditContext", context); }} placeholder="Known objectives, concerns, budget or special instructions…" /></label>
    </div>
    <div className="strategy-actions"><button type="button" className="strategy-button" disabled={!ready || busy} onClick={() => void run()}>{busy ? "Analyzing sources…" : "Analyze Sources"}</button></div>

    {message && <p role="status" className="source-audit-note" style={{ whiteSpace: "pre-line" }}>{message}</p>}
    {audit && <div ref={resultsRef} tabIndex={-1} className="source-audit-results">
      <div><h3>Audit results</h3><p>{audit.business || "Business not identified"} · {audit.businessType || draft.businessType || "Business type unconfirmed"}</p></div>
      {audit.dashboard && audit.ledger && <AuditDashboard dashboard={audit.dashboard} ledger={audit.ledger} onDraft={value => { setAudit(current => current?.dashboard ? { ...current, dashboard: { ...current.dashboard, outreachDraft: value } } : current); }} onGenerate={() => void generateOutreach()} generating={generatingOutreach} generationError={outreachError} />}
      {!audit.dashboard && <><p>This saved audit uses the earlier report format. Run a new audit for the updated layout.</p>
      <div className="audit-metrics"><div><strong>{audit.sources.filter(source => source.status === "accessible").length}/{audit.sources.length}</strong><span>Sources with screenshots</span></div><div><strong>{audit.findings.length}</strong><span>Findings</span></div><div><strong>{Math.min(3, audit.findings.filter(finding => finding.verification !== "rejected").length)}</strong><span>Opportunities to review</span></div></div>
      <section><h3>Prospect overview</h3><p>{audit.about || "Business overview unavailable."}</p><p><strong>Audience:</strong> {audit.audience || "Not established"} · <strong>Offering:</strong> {audit.offerings || "Not established"}</p><p>Source-derived suggestions require review.</p></section>
      <section><h3>Digital presence</h3>{audit.sources.map(source => <details key={source.url}><summary>{sourceFields.extra.includes(source.url) ? "Other" : sourcePlatform(source.url) || "Website"} — {source.status === "accessible" ? "Evidence available" : "No screenshot"} · {source.url}</summary>{audit.findings.find(finding => finding.source === source.url && finding.verification !== "rejected") && <p>{audit.findings.find(finding => finding.source === source.url && finding.verification !== "rejected")?.observation}</p>}<p>{source.message} Checked {new Date(source.checkedAt).toLocaleString()}</p><a href={source.url} target="_blank" rel="noreferrer">Open source</a>{source.text && <details><summary>Extracted text</summary><p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{source.text}</p></details>}{source.metadata && <details><summary>Page details</summary><pre>{source.metadata}</pre></details>}{source.images?.map(image => <img key={image.kind} src={image.dataUrl} alt={image.name} />)}{source.screenshot && <div><img src={source.screenshot} alt={`Desktop capture of ${source.url}`} />{source.mobileScreenshot && <img src={source.mobileScreenshot} alt={`Mobile capture of ${source.url}`} />}</div>}</details>)}</section>
      <section><h3>Top opportunities</h3><p>Ranked by evidence confidence, relevance, potential impact, service fit, outreach suitability and ease of explaining the opportunity. Estimates require review.</p>{rankOpportunities(audit.findings.map((finding, index) => ({ ...finding, index }))).slice(0, 3).map(finding => <div className="audit-opportunity" key={finding.index}><strong>{finding.recommendation}</strong><p>{finding.impact || "unknown"} impact · {finding.kind === "observed" ? "Observation to review" : "Inference — needs verification"}</p><p>{finding.observation}</p><p>{finding.benefit}</p><p>Service: {finding.service || "Not assessed"} · Service relevance: {finding.serviceRelevance || "unknown"}</p>{finding.outreachAngle && <p>Possible outreach angle: {finding.outreachAngle}</p>}<a href={finding.source} target="_blank" rel="noreferrer">View source</a></div>)}</section>
      </>}
      <div className="strategy-actions"><button type="button" disabled={busy} onClick={() => void apply("audit", audit, selected)}>Save reviewed audit</button></div>
    </div>}
    {!audit && draft.auditReport && <div ref={resultsRef} tabIndex={-1} className="source-audit-results"><h3>Saved audit findings</h3><details open={openResults}><summary>View saved audit report</summary><pre>{draft.auditReport}</pre></details>{draft.approvedAuditFindings.length ? <ul>{draft.approvedAuditFindings.map((finding, index) => <li key={index}><strong>{finding.kind === "observed" ? "Observation" : "Inference"}:</strong> {finding.observation}<br />Recommendation: {finding.recommendation}<br />Source: {finding.source}</li>)}</ul> : <p>No approved findings are available for this saved audit.</p>}</div>}
  </section>;
}
