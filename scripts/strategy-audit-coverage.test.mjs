import test from "node:test";
import assert from "node:assert/strict";
import { reconcileDashboard, formatDashboard, additionalChannelOpportunities, matchingChannelOpportunity } from "../src/app/strategy/audit/dashboard.ts";
import { normalizeDraft } from "../src/app/strategy/schema.ts";

const ledger = [
  {id:"S1",name:"https://example.com",type:"Website",url:"https://example.com",status:"not retrieved",date:"Not provided",scope:"URL supplied",limitation:"Not retrieved"},
  {id:"S1-F1",name:"home.png",type:"Screenshot",url:"https://example.com",status:"not verified",date:"Capture date not provided",scope:"Pending",limitation:"Unknown"},
  {id:"S2",name:"https://example.org",type:"Instagram",url:"https://example.org",status:"not retrieved",date:"Not provided",scope:"URL supplied",limitation:"Not retrieved"},
  {id:"S2-F1",name:"unreadable.png",type:"Screenshot",url:"https://example.org",status:"not verified",date:"Capture date not provided",scope:"Pending",limitation:"Unknown"},
  {id:"S3",name:"https://example.net",type:"Other",url:"https://example.net",status:"not retrieved",date:"Not provided",scope:"URL supplied",limitation:"Not retrieved"},
];
const dashboard = {
 summary:"Visible offer", goals:[{role:"primary",goal:"Increase enquiries",status:"Possible / inferred",provenance:"Business type",verification:"Confirm goal"}],
 strengths:[{observation:"Offer shown",sourceId:"S1-F1"},{observation:"Invented",sourceId:"S2"}],
 opportunities:[{title:"Clarify action",priority:"medium",confidence:"low",observation:"Action visible",sourceId:"S1-F1",goal:"Possible enquiries",why:"May help",action:"Review",verification:"Ask client"},{title:"Unsupported",sourceId:"S3"}],
 reviews:[{sourceId:"S1",scope:"One screenshot",strengths:"Offer",opportunities:"Action",notAssessed:"Full site"},{sourceId:"S2",scope:"Invented"}],
 journey:[{stage:"Interest",observation:"Offer shown",sourceId:"S1-F1"},{stage:"Action",observation:"Invented",sourceId:"S3"}],
 direction:"Confirm enquiries", outreachAngle:"Offer visible",outreachDraft:"Hello",questions:["Confirm goal?"],handoff:"Possible enquiries [S1-F1]",files:[{id:"S1-F1",status:"reviewed",scope:"Visible homepage",limitation:"Single screenshot"},{id:"S2-F1",status:"unreadable",scope:"None",limitation:"Text illegible"}]
};
test("mixed sources keep unvisited URLs separate from interpreted and unreadable screenshots", () => {
 const result = reconcileDashboard(dashboard, ledger);
 assert.deepEqual(result.ledger.map(x => x.status), ["not retrieved", "reviewed", "not retrieved", "unreadable", "not retrieved"]);
 assert.equal(result.dashboard.strengths.length, 1); assert.equal(result.dashboard.opportunities.length, 1); assert.equal(result.dashboard.reviews.length, 1); assert.equal(result.dashboard.journey.length, 1);
 assert.equal(result.dashboard.goals[0].status, "Possible / inferred");
 assert.match(formatDashboard(result.dashboard, result.ledger), /Action: Unknown \/ not assessed/);
 assert.match(formatDashboard(result.dashboard, result.ledger), /unreadable/);
 assert.ok(result.reviewedUrls.has("https://example.com")); assert.ok(!result.reviewedUrls.has("https://example.org"));
});
test("no interpretable screenshot suppresses invented outreach and source findings", () => {
 const result = reconcileDashboard({...dashboard, files: []}, ledger);
 assert.equal(result.dashboard.outreachDraft, ""); assert.equal(result.dashboard.opportunities.length, 0);
 assert.match(result.dashboard.summary, /No submitted source/); assert.equal(result.ledger[1].status, "not verified");
});
test("new and legacy snapshots survive draft normalization", () => {
 const snapshot = {dashboard, ledger, findings:[], checks:[], sources:[], report:{}};
 assert.deepEqual(normalizeDraft(JSON.parse(JSON.stringify({auditSnapshot:snapshot}))).auditSnapshot, snapshot);
 assert.equal(normalizeDraft({auditReport:"Legacy audit"}).auditReport, "Legacy audit");
});

test("retrieved URL evidence works without screenshots and remains distinct from unreadable files", () => {
 const live = ledger.map(x => x.id === "S1" ? {...x,status:"partially reviewed",date:"Retrieved at 2026-11-06",scope:"Text excerpt"} : x);
 const result = reconcileDashboard({...dashboard, strengths:[{observation:"Offer in text",sourceId:"S1"},{observation:"Unreadable image",sourceId:"S2-F1"}], files:[{id:"S2-F1",status:"unreadable",scope:"None",limitation:"Illegible"}]}, live);
 assert.equal(result.dashboard.strengths.length, 1);
 assert.equal(result.dashboard.strengths[0].sourceId, "S1");
 assert.ok(result.reviewedUrls.has("https://example.com"));
 assert.equal(result.dashboard.outreachDraft, "Hello");
 assert.match(formatDashboard(result.dashboard, result.ledger), /Retrieved at 2026-11-06/);
 assert.match(formatDashboard(result.dashboard, result.ledger), /Capture date not provided/);
});

test("blocked profile with a reviewed screenshot keeps both statuses and the evidence reference", () => {
 const blocked = ledger.map(x => x.id === "S1" ? {...x, type:"Instagram", status:"inaccessible", limitation:"Source returned HTTP 403."} : x);
 const result = reconcileDashboard(dashboard, blocked);
 assert.equal(result.ledger[0].status, "inaccessible");
 assert.equal(result.ledger[1].status, "reviewed");
 assert.equal(result.dashboard.strengths[0].sourceId, "S1-F1");
 assert.match(formatDashboard(result.dashboard, result.ledger), /HTTP 403/);
 const reopened = normalizeDraft({approvedAuditFindings:[{source:"https://example.com",evidenceId:"S1-F1",observation:"Visible bio"}]});
 assert.equal(reopened.approvedAuditFindings[0].evidenceId, "S1-F1");
});

test("conditional channel opportunities preserve intake and reviewed evidence without assuming missing channels", () => {
 const opportunity = {title:"Consider a landing page", currentPresence:"Facebook screenshot reviewed; website URL not supplied, existence unknown", evidenceIds:["INTAKE", "S1-F1"], goal:"Possible goal: reader enquiries", reason:"May give readers one place for links", scope:"Confirm first, then consider a simple page", existingAlternative:"Improve the Facebook action", conditions:"Confirm existing site, audience, budget and capacity", priority:"undetermined", priorityReason:"Goals and resources need confirmation"};
 const result = reconcileDashboard({...dashboard, channelOpportunities:[opportunity]}, ledger);
 assert.deepEqual(result.dashboard.channelOpportunities, [opportunity]);
 const report = formatDashboard(result.dashboard, result.ledger);
 assert.match(report, /website URL not supplied, existence unknown/);
 assert.match(report, /INTAKE refers only to provided fields, not a search/);
 assert.match(report, /Existing-channel alternative: Improve the Facebook action/);
 assert.match(report, /Priority: undetermined/);
 const reopened = normalizeDraft(JSON.parse(JSON.stringify({auditSnapshot:{dashboard:result.dashboard, ledger:result.ledger}})));
 assert.deepEqual(reopened.auditSnapshot.dashboard.channelOpportunities, [opportunity]);
});
test("channel suggestions reject unreviewed source citations and allow intake-only questions", () => {
 const idea = {title:"Explore",currentPresence:"Not supplied",evidenceIds:["INTAKE"],goal:"Possible",reason:"Conditional",scope:"Confirm first",existingAlternative:"Review existing channel",conditions:"Verify",priority:"undetermined",priorityReason:"Unknown"};
 const result = reconcileDashboard({...dashboard, files:[], channelOpportunities:[idea, {...idea, title:"Unsupported", evidenceIds:["S2-F1"]}, {...idea, title:"Missing ref", evidenceIds:[]}]}, ledger);
 assert.deepEqual(result.dashboard.channelOpportunities, [idea]);
 assert.match(formatDashboard({...dashboard, channelOpportunities:undefined}, ledger), /None identified/);
});


test("channel ideas already represented in top opportunities are grouped without losing distinct ideas", () => {
 const main = { ...dashboard.opportunities[0], title: "Review Facebook booking button" };
 const duplicate = { title: "Facebook booking button", relatedOpportunity: main.title, evidenceIds: ["S1-F1"] };
 const legacy = { title: "Facebook booking button", evidenceIds: ["S1-F1"] };
 const distinct = { title: "Explore reader updates", relatedOpportunity: "", evidenceIds: ["INTAKE"] };
 const d = { ...dashboard, opportunities: [main], channelOpportunities: [duplicate, legacy, distinct] };
 assert.equal(matchingChannelOpportunity(d, duplicate), main);
 assert.equal(matchingChannelOpportunity(d, legacy), main);
 assert.deepEqual(additionalChannelOpportunities(d), [distinct]);
});

test("related channel context remains in the exported report and legacy equivalents are grouped", () => {
 const main = { ...dashboard.opportunities[0], title: "Verify the existing retailer route" };
 const reader = { ...main, title: "Explore reader updates only if there is a need" };
 const idea = {title:"Test the existing website's purchase options",currentPresence:"Retail links visible",evidenceIds:["S1-F1"],goal:"Possible",reason:"Help readers find a purchase path",scope:"Check links",existingAlternative:"Keep existing retailers",conditions:"Verify first",priority:"medium",priorityReason:"Subject to goals"};
 const newsletter = {...idea, title:"Consider an opt-in reader update only conditionally"};
 const d = {...dashboard, opportunities:[main, reader], channelOpportunities:[idea, newsletter]};
 assert.equal(matchingChannelOpportunity(d, idea), main);
 assert.equal(matchingChannelOpportunity(d, newsletter), reader);
 assert.deepEqual(additionalChannelOpportunities(d), []);
 assert.match(formatDashboard(d, ledger), /Help readers find a purchase path/);
});
