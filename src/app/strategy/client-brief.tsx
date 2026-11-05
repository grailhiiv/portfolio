"use client";

import CustomSelect from "./custom-select";
import GeneratableField from "./generatable-field";
import { activePackageOptions, getActiveBusinessFields, getPlaceholders, type Draft } from "./schema";

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
  function isFieldGenerating(targetKey: string, currentValue: string | undefined): boolean {
    if (!generatingField) return false;
    if (generatingField === targetKey) return true;
    return generatingField === "all_missing" && !(currentValue ?? "").trim();
  }
  return (
        <section className="strategy-section"><div className="strategy-heading"><span>01 / THE BRIEF</span><h2>Client Brief<span>.</span></h2><p>Start with what you know. You can come back and add more anytime.</p></div>
          <div className="strategy-fields">
            <div className="strategy-grid-2"><label>Client name (optional)<input value={draft.name} disabled={!ready} onChange={e => update("name", e.target.value)} /></label><label>Business name (optional)<input value={draft.business} disabled={!ready} onChange={e => update("business", e.target.value)} /></label></div>
            {([["about", "Business context", "What should we know about the business, audience, or offer?"], ["goals", "Primary goal", "What does the business want to achieve?"], ["challenges", "Known challenges", "What needs improvement?"], ["currentAssets", "Available resources", "Existing content, team, and other resources"], ["budgetTier", "Budget", "Known budget or package"], ["constraints", "Timing, tools, and constraints", "Important dates, tools, or limits"], ["competitors", "Competitors", "Relevant competitors or links"]] as const).map(([field, label, placeholder]) => <label key={field}>{label}<textarea rows={2} placeholder={placeholder} value={draft[field]} disabled={!ready} onChange={e => update(field, e.target.value)} /></label>)}
            {draft.mode === "client" && <><label>Current results and baselines<textarea rows={2} value={draft.baselineKpis} disabled={!ready} onChange={e => update("baselineKpis", e.target.value)} /></label><label>What is working and what is not<textarea rows={2} value={draft.campaignHistory} disabled={!ready} onChange={e => update("campaignHistory", e.target.value)} /></label></>}
            {draft.mainSource && <label>Previously saved source notes<textarea rows={3} value={draft.mainSource} disabled={!ready} onChange={e => update("mainSource", e.target.value)} /></label>}

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

            <GeneratableField id="field-location" label="Location or Market" value={draft.location} placeholder={placeholders.location} loading={isFieldGenerating("location", draft.location)} disabled={!ready} generationDisabled={!ready || Boolean(generatingField) || generatingStrategy} onChange={value => update("location", value)} onGenerate={() => void generateField("location")} />

            {([["differentiator", "What Makes Them Different", placeholders.differentiator], ["audience", "Target Audience", placeholders.audience], ["offerings", "Products or Services", placeholders.offerings]] as const).map(([field, label, placeholder]) => {
              const loading = isFieldGenerating(field, draft[field]);
              return (
                <GeneratableField key={field} id={`field-${field}`} label={label} value={draft[field]} placeholder={placeholder} multiline loading={loading} disabled={!ready} generationDisabled={!ready || Boolean(generatingField) || generatingStrategy} onChange={value => update(field, value)} onGenerate={() => void generateField(field)} />
              );
            })}

            <div className="strategy-grid-2">
              {([["conversionGoal", "Desired Customer Action", placeholders.conversionGoal], ["brandVoice", "Brand Voice", placeholders.brandVoice]] as const).map(([field, label, placeholder]) => {
                const loading = isFieldGenerating(field, draft[field]);
                return (
                  <GeneratableField key={field} id={`field-${field}`} label={label} value={draft[field]} placeholder={placeholder} multiline loading={loading} disabled={!ready} generationDisabled={!ready || Boolean(generatingField) || generatingStrategy} onChange={value => update(field, value)} onGenerate={() => void generateField(field)} />
                );
              })}
            </div>

            {draft.mode === "client" && (
              <div className="strategy-subpanel" role="group" aria-label="Current client details">
                <div className="strategy-subpanel-header">
                  <span>CURRENT CLIENT DETAILS</span>
                  <h3>Current Results & What’s Working</h3>
                </div>
                <CustomSelect label="Current Package" value={draft.activePackage} disabled={!ready} onChange={value => update("activePackage", value)} options={activePackageOptions} />

              </div>
            )}
          </div>
        </section>
  );
}
