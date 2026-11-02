"use client";

import CustomSelect from "./custom-select";
import GeneratableField, { SparkIcon } from "./generatable-field";
import { activePackageOptions, budgetTierOptions, businessTypes, getActiveBusinessFields, getPlaceholders, videoCapacityOptions, type Draft } from "./schema";

function formatBusinessTypeLabel(type: string): string {
  return type.replace(/\b[a-z]/g, (letter, index) =>
    index === 0 || !/^(and|or)$/.test(type.slice(index).split(" ")[0]) ? letter.toUpperCase() : letter,
  );
}



type Props = {
  draft: Draft;
  ready: boolean;
  generatingField: string | null;
  generatingStrategy: boolean;
  update: <K extends keyof Draft>(field: K, value: Draft[K]) => void;
  updateDetail: (key: string, value: string) => void;
  generateField: (target: string) => Promise<void>;
};

export default function ClientBrief({ draft, ready, generatingField, generatingStrategy, update, updateDetail, generateField }: Props) {
  const activeBusinessFields = getActiveBusinessFields(draft.businessType);
  const placeholders = getPlaceholders(draft.businessType);
  const resolvedBusinessLabel = draft.businessType === "Other"
    ? (draft.businessTypeOther ?? "").trim() || "Custom Business Type"
    : formatBusinessTypeLabel(draft.businessType);
  function isFieldGenerating(targetKey: string, currentValue: string | undefined): boolean {
    if (!generatingField) return false;
    if (generatingField === targetKey) return true;
    return generatingField === "all_missing" && !(currentValue ?? "").trim();
  }
  return (
        <section className="strategy-section"><div className="strategy-heading"><span>01 / THE BRIEF</span><h2>Client Brief<span>.</span></h2><p>Start with what you know. You can come back and add more anytime.</p></div>
          <div className="strategy-fields">
            <CustomSelect label="Business Type" value={draft.businessType} disabled={!ready} onChange={value => update("businessType", value)} options={[{ value: "", label: "Select a Business Type" }, ...(draft.businessType && !(businessTypes as readonly string[]).includes(draft.businessType) ? [{ value: draft.businessType, label: draft.businessType }] : []), ...businessTypes.map(type => ({ value: type, label: formatBusinessTypeLabel(type) }))]} />
            {draft.businessType === "Other" && <label>Specify Business Type<input placeholder="Enter a business type or niche" value={draft.businessTypeOther} disabled={!ready} onChange={e => update("businessTypeOther", e.target.value)} /></label>}

            <div className="strategy-subpanel" role="group" aria-label="Main source for autofill">
              <div className="strategy-subpanel-header">
                <span>QUICK SOURCE</span>
                <h3>Source Info for Cold Outreach</h3>
              </div>
              <label>
                {placeholders.mainSourceLabel}
                <textarea
                  rows={3}
                  placeholder={placeholders.mainSourcePlaceholder}
                  value={draft.mainSource ?? ""}
                  disabled={!ready}
                  onChange={e => update("mainSource", e.target.value)}
                />
              </label>
              <div className="strategy-source-actions">
                <small>Paste a link or bio above, then click the spark icon on any field—or fill all blank fields at once.</small>
                <button
                  type="button"
                  className={`strategy-autofill-btn ${generatingField === "all_missing" ? "is-loading" : ""}`}
                  disabled={!ready || Boolean(generatingField) || generatingStrategy}
                  onClick={() => void generateField("all_missing")}
                >
                  <SparkIcon />
                  {generatingField === "all_missing" ? "Filling Blank Fields…" : "Fill Blank Fields"}
                </button>
              </div>
            </div>

            {activeBusinessFields.length > 0 && (
              <div className="strategy-subpanel" role="group" aria-label={`${resolvedBusinessLabel} inputs`}>
                <div className="strategy-subpanel-header">
                  <span>BUSINESS DETAILS</span>
                  <h3>{resolvedBusinessLabel}</h3>
                </div>
                {activeBusinessFields.map(field => {
                  const targetKey = `detail:${field.key}`;
                  const currentVal = draft.details[field.key] ?? "";
                  const loading = isFieldGenerating(targetKey, currentVal);
                  return field.type === "select" && field.options ? (
                    <CustomSelect
                      key={field.key}
                      label={field.label}
                      value={currentVal}
                      disabled={!ready}
                      onChange={value => updateDetail(field.key, value)}
                      options={field.options}
                    />
                  ) : (
                    <GeneratableField key={field.key} id={`field-${field.key}`} label={field.label} value={currentVal} placeholder={field.placeholder} multiline={field.type === "textarea"} loading={loading} disabled={!ready} generationDisabled={!ready || Boolean(generatingField) || generatingStrategy} onChange={value => updateDetail(field.key, value)} onGenerate={() => void generateField(targetKey)} />
                  );
                })}
              </div>
            )}

            <div className="strategy-grid-2">
              {([["name", "Client Name", placeholders.name, false], ["business", "Business Name", placeholders.business, false], ["website", "Website", placeholders.website, false], ["location", "Location or Market", placeholders.location, true]] as const).map(([field, label, placeholder, spark]) => {
                const loading = spark && isFieldGenerating(field, draft[field]);
                return spark ? (
                  <GeneratableField key={field} id={`field-${field}`} label={label} value={draft[field]} placeholder={placeholder} loading={loading} disabled={!ready} generationDisabled={!ready || Boolean(generatingField) || generatingStrategy} onChange={value => update(field, value)} onGenerate={() => void generateField(field)} />
                ) : (
                  <label key={field}>{label}<input type={field === "website" ? "url" : "text"} placeholder={placeholder} value={draft[field]} disabled={!ready} onChange={e => update(field, e.target.value)} /></label>
                );
              })}
            </div>

            {([["about", "About the Business", placeholders.about], ["differentiator", "What Makes Them Different", placeholders.differentiator], ["audience", "Target Audience", placeholders.audience], ["goals", "Main Goals", placeholders.goals], ["offerings", "Products or Services", placeholders.offerings], ["challenges", "Marketing Challenges", placeholders.challenges], ["competitors", "Competitors", placeholders.competitors]] as const).map(([field, label, placeholder]) => {
              const loading = isFieldGenerating(field, draft[field]);
              return (
                <GeneratableField key={field} id={`field-${field}`} label={label} value={draft[field]} placeholder={placeholder} multiline loading={loading} disabled={!ready} generationDisabled={!ready || Boolean(generatingField) || generatingStrategy} onChange={value => update(field, value)} onGenerate={() => void generateField(field)} />
              );
            })}

            <div className="strategy-grid-2">
              {([["conversionGoal", "Desired Customer Action", placeholders.conversionGoal], ["brandVoice", "Brand Voice", placeholders.brandVoice]] as const).map(([field, label, placeholder]) => {
                const loading = isFieldGenerating(field, draft[field]);
                return (
                  <GeneratableField key={field} id={`field-${field}`} label={label} value={draft[field]} placeholder={placeholder} loading={loading} disabled={!ready} generationDisabled={!ready || Boolean(generatingField) || generatingStrategy} onChange={value => update(field, value)} onGenerate={() => void generateField(field)} />
                );
              })}
            </div>

            <div className="strategy-subpanel" role="group" aria-label="Content, tools, and budget">
              <div className="strategy-subpanel-header">
                <span>PRACTICAL DETAILS</span>
                <h3>Content, Tools & Budget</h3>
              </div>
              <div className="strategy-grid-2">
                <CustomSelect label="Video & Photo Availability" value={draft.videoCapacity} disabled={!ready} onChange={value => update("videoCapacity", value)} options={videoCapacityOptions} />
                <CustomSelect label="Monthly Budget / Package" value={draft.budgetTier} disabled={!ready} onChange={value => update("budgetTier", value)} options={budgetTierOptions} />
              </div>
              <div className="strategy-grid-2">
                {([["techStack", "Website Platform & Tools Used", placeholders.techStack], ["timeline", "Important Dates or Seasons", placeholders.timeline]] as const).map(([field, label, placeholder]) => {
                  const loading = isFieldGenerating(field, draft[field]);
                  return (
                    <GeneratableField key={field} id={`field-${field}`} label={label} value={draft[field]} placeholder={placeholder} loading={loading} disabled={!ready} generationDisabled={!ready || Boolean(generatingField) || generatingStrategy} onChange={value => update(field, value)} onGenerate={() => void generateField(field)} />
                  );
                })}
              </div>
              <div className="strategy-field">
                <label htmlFor="field-currentAssets">Existing Audience & Marketing Materials</label>
                <div className={`strategy-input-wrap is-input ${isFieldGenerating("currentAssets", draft.currentAssets) ? "is-loading" : ""}`}>
                  <input id="field-currentAssets" type="text" placeholder={isFieldGenerating("currentAssets", draft.currentAssets) && !draft.currentAssets ? "Generating…" : placeholders.currentAssets} value={draft.currentAssets} disabled={!ready} onChange={e => update("currentAssets", e.target.value)} />
                  <button type="button" className={`strategy-spark-btn ${isFieldGenerating("currentAssets", draft.currentAssets) ? "is-loading" : ""}`} title="Generate Existing Audience & Marketing Materials" aria-label="Generate Existing Audience & Marketing Materials" disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField("currentAssets")}><SparkIcon /></button>
                </div>
              </div>
              <div className="strategy-field">
                <label htmlFor="field-constraints">Limits or Things to Avoid</label>
                <div className={`strategy-input-wrap is-textarea ${isFieldGenerating("constraints", draft.constraints) ? "is-loading" : ""}`}>
                  <textarea id="field-constraints" rows={2} placeholder={isFieldGenerating("constraints", draft.constraints) && !draft.constraints ? "Generating…" : placeholders.constraints} value={draft.constraints} disabled={!ready} onChange={e => update("constraints", e.target.value)} />
                  <button type="button" className={`strategy-spark-btn ${isFieldGenerating("constraints", draft.constraints) ? "is-loading" : ""}`} title="Generate Limits or Things to Avoid" aria-label="Generate Limits or Things to Avoid" disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField("constraints")}><SparkIcon /></button>
                </div>
              </div>
            </div>

            {draft.mode === "lead" ? (
              <div className="strategy-subpanel" role="group" aria-label="Proposal details">
                <div className="strategy-subpanel-header">
                  <span>PROPOSAL DETAILS</span>
                  <h3>Why They Need Help Now</h3>
                </div>
                <div className="strategy-field">
                  <label htmlFor="field-leadTrigger">Why Are They Reaching Out Now?</label>
                  <div className={`strategy-input-wrap is-input ${isFieldGenerating("leadTrigger", draft.leadTrigger) ? "is-loading" : ""}`}>
                    <input id="field-leadTrigger" type="text" placeholder={isFieldGenerating("leadTrigger", draft.leadTrigger) && !draft.leadTrigger ? "Generating…" : placeholders.leadTrigger} value={draft.leadTrigger} disabled={!ready} onChange={e => update("leadTrigger", e.target.value)} />
                    <button type="button" className={`strategy-spark-btn ${isFieldGenerating("leadTrigger", draft.leadTrigger) ? "is-loading" : ""}`} title="Generate Why Are They Reaching Out Now?" aria-label="Generate Why Are They Reaching Out Now?" disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField("leadTrigger")}><SparkIcon /></button>
                  </div>
                </div>
                <div className="strategy-field">
                  <label htmlFor="field-quickWin">Biggest Quick Win</label>
                  <div className={`strategy-input-wrap is-textarea ${isFieldGenerating("quickWin", draft.quickWin) ? "is-loading" : ""}`}>
                    <textarea id="field-quickWin" rows={2} placeholder={isFieldGenerating("quickWin", draft.quickWin) && !draft.quickWin ? "Generating…" : placeholders.quickWin} value={draft.quickWin} disabled={!ready} onChange={e => update("quickWin", e.target.value)} />
                    <button type="button" className={`strategy-spark-btn ${isFieldGenerating("quickWin", draft.quickWin) ? "is-loading" : ""}`} title="Generate Biggest Quick Win" aria-label="Generate Biggest Quick Win" disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField("quickWin")}><SparkIcon /></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="strategy-subpanel" role="group" aria-label="Current client details">
                <div className="strategy-subpanel-header">
                  <span>CURRENT CLIENT DETAILS</span>
                  <h3>Current Results & What’s Working</h3>
                </div>
                <CustomSelect label="Current Package" value={draft.activePackage} disabled={!ready} onChange={value => update("activePackage", value)} options={activePackageOptions} />
                <div className="strategy-field">
                  <label htmlFor="field-baselineKpis">Current Numbers & Results</label>
                  <div className={`strategy-input-wrap is-input ${isFieldGenerating("baselineKpis", draft.baselineKpis) ? "is-loading" : ""}`}>
                    <input id="field-baselineKpis" type="text" placeholder={isFieldGenerating("baselineKpis", draft.baselineKpis) && !draft.baselineKpis ? "Generating…" : placeholders.baselineKpis} value={draft.baselineKpis} disabled={!ready} onChange={e => update("baselineKpis", e.target.value)} />
                    <button type="button" className={`strategy-spark-btn ${isFieldGenerating("baselineKpis", draft.baselineKpis) ? "is-loading" : ""}`} title="Generate Current Numbers & Results" aria-label="Generate Current Numbers & Results" disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField("baselineKpis")}><SparkIcon /></button>
                  </div>
                </div>
                <div className="strategy-field">
                  <label htmlFor="field-campaignHistory">What’s Working & What’s Not</label>
                  <div className={`strategy-input-wrap is-textarea ${isFieldGenerating("campaignHistory", draft.campaignHistory) ? "is-loading" : ""}`}>
                    <textarea id="field-campaignHistory" rows={3} placeholder={isFieldGenerating("campaignHistory", draft.campaignHistory) && !draft.campaignHistory ? "Generating…" : placeholders.campaignHistory} value={draft.campaignHistory} disabled={!ready} onChange={e => update("campaignHistory", e.target.value)} />
                    <button type="button" className={`strategy-spark-btn ${isFieldGenerating("campaignHistory", draft.campaignHistory) ? "is-loading" : ""}`} title="Generate What’s Working & What’s Not" aria-label="Generate What’s Working & What’s Not" disabled={!ready || Boolean(generatingField) || generatingStrategy} onClick={() => void generateField("campaignHistory")}><SparkIcon /></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
  );
}
