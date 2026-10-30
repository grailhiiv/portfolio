export type Profile = {
  id: string;
  platform: string;
  url: string;
  status?: string;
  followers?: string;
  cadence?: string;
  notes: string;
};

export type Finding = {
  id: string;
  source: string;
  date: string;
  observation: string;
  status: string;
  category?: string;
};

export type Draft = {
  mode: string;
  name: string;
  business: string;
  website: string;
  about: string;
  audience: string;
  goals: string;
  research: string;
  source: string;
  strategy: string;
  businessType: string;
  businessTypeOther: string;
  offerings: string;
  challenges: string;
  competitors: string;
  conversionGoal: string;
  mainSource: string;
  // Universal strategic context
  location: string;
  brandVoice: string;
  differentiator: string;
  currentAssets: string;
  videoCapacity: string;
  techStack: string;
  budgetTier: string;
  timeline: string;
  constraints: string;
  // Mode-specific context
  leadTrigger: string;
  quickWin: string;
  activePackage: string;
  campaignHistory: string;
  baselineKpis: string;
  // Dynamic business-type inputs
  details: Record<string, string>;
  profiles: Profile[];
  findings: Finding[];
};

export const emptyDraft: Draft = {
  mode: "lead",
  name: "",
  business: "",
  website: "",
  about: "",
  audience: "",
  goals: "",
  research: "",
  source: "",
  strategy: "",
  businessType: "",
  businessTypeOther: "",
  offerings: "",
  challenges: "",
  competitors: "",
  conversionGoal: "",
  mainSource: "",
  location: "",
  brandVoice: "",
  differentiator: "",
  currentAssets: "",
  videoCapacity: "",
  techStack: "",
  budgetTier: "",
  timeline: "",
  constraints: "",
  leadTrigger: "",
  quickWin: "",
  activePackage: "",
  campaignHistory: "",
  baselineKpis: "",
  details: {},
  profiles: [],
  findings: [],
};

export const businessTypes = [
  "Author or publisher",
  "Coach or consultant",
  "Creator or influencer",
  "E-commerce or retail",
  "Professional services",
  "Health and wellness",
  "Beauty and personal care",
  "Food and hospitality",
  "Real estate",
  "Education and training",
  "Technology or software",
  "Nonprofit or community",
  "Arts and entertainment",
  "Local services",
  "Other",
] as const;

export const socialPlatforms = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "TikTok",
  "YouTube",
  "Pinterest",
  "Threads",
  "X",
  "Bluesky",
  "Substack",
  "Goodreads",
  "Amazon Author Central",
  "Google Business Profile",
  "Other",
];

export const profileStatuses = [
  { value: "", label: "Not Specified" },
  { value: "Active", label: "Active" },
  { value: "Inconsistent", label: "Inconsistent" },
  { value: "Dormant", label: "Inactive / Dormant" },
  { value: "Needs Creation", label: "Not Created Yet" },
];

export const findingCategories = [
  { value: "", label: "Not Specified" },
  { value: "Content & Creative", label: "Posts & Visuals" },
  { value: "Audience & Community", label: "Audience & Engagement" },
  { value: "Website & Funnel", label: "Website & Booking / Checkout" },
  { value: "Competitor Gap", label: "Competitors" },
  { value: "Market & Cultural Trend", label: "Industry Trend" },
];

export const videoCapacityOptions = [
  { value: "", label: "Select Video & Photo Availability" },
  { value: "Can film raw video regularly", label: "Can Film Video Clips Regularly" },
  { value: "Occasional raw video clips", label: "Can Film Occasional Video Clips" },
  { value: "Photos & graphics only", label: "Photos & Graphics Only (No Video)" },
  { value: "Needs stock or repurposed assets", label: "Needs Stock or Existing Material Only" },
];

export const budgetTierOptions = [
  { value: "", label: "Select Monthly Budget / Package" },
  { value: "Essentials (~$650 USD/mo)", label: "Essentials (~$650 USD / month)" },
  { value: "Growth (~$1,100 USD/mo)", label: "Growth (~$1,100 USD / month)" },
  { value: "Complete (~$1,750 USD/mo)", label: "Complete (~$1,750 USD / month)" },
  { value: "Add-on Project Only", label: "One-Time Project Only (Website / Setup)" },
  { value: "Custom / Undecided", label: "Not Sure Yet" },
];

export const activePackageOptions = [
  { value: "", label: "Select Current Package" },
  { value: "Essentials ($650 USD/mo)", label: "Essentials ($650 USD / month)" },
  { value: "Growth ($1,100 USD/mo)", label: "Growth ($1,100 USD / month)" },
  { value: "Complete ($1,750 USD/mo)", label: "Complete ($1,750 USD / month)" },
  { value: "Custom Retainer / Project", label: "Custom Plan or One-Time Project" },
];

export type DynamicFieldSpec = {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export type BusinessPlaceholderSet = {
  mainSourceLabel: string;
  mainSourcePlaceholder: string;
  name: string;
  business: string;
  website: string;
  location: string;
  about: string;
  differentiator: string;
  audience: string;
  goals: string;
  offerings: string;
  challenges: string;
  competitors: string;
  conversionGoal: string;
  brandVoice: string;
  techStack: string;
  timeline: string;
  currentAssets: string;
  constraints: string;
  leadTrigger: string;
  quickWin: string;
  baselineKpis: string;
  campaignHistory: string;
  profileFollowers: string;
  profileCadence: string;
  profileNotes: string;
  findingSource: string;
  findingObservation: string;
};

export const defaultPlaceholders: BusinessPlaceholderSet = {
  mainSourceLabel: "Main Source (Website Link, Social Bio, or Pasted Info)",
  mainSourcePlaceholder: "Paste a website URL, product page link, or copy-paste their bio / 'About' text here to auto-fill blank fields.",
  name: "e.g. Jordan Vance",
  business: "e.g. Vance Studio & Co.",
  website: "https://example.com",
  location: "e.g. United States, UK, or Austin, TX",
  about: "Briefly describe what the business does, who started it, and where it stands today.",
  differentiator: "Why do customers pick them over others? (e.g. unique process, personal service, faster turnaround)",
  audience: "Who are their ideal customers, what problems do they have, and where do they spend time online?",
  goals: "What do they want to achieve in the next 30–90 days? (e.g. more bookings, steady sales, stronger reputation)",
  offerings: "List their main products, services, or packages along with prices.",
  challenges: "What is getting in the way right now? (e.g. no time to post, low website clicks, unclear message)",
  competitors: "List 2–4 similar businesses (names, handles, or links) and what they do well.",
  conversionGoal: "e.g. Booked calls, online orders, quote requests, or email sign-ups",
  brandVoice: "e.g. Warm, friendly, clear, witty, or professional",
  techStack: "e.g. WordPress, Shopify, HubSpot, MailerLite, Calendly",
  timeline: "e.g. Holiday sale in November, new launch on Nov 15, spring busy season",
  currentAssets: "e.g. 2,500 email subscribers, blog articles, product photos, customer reviews",
  constraints: "e.g. Owner has 1 hour/week for approvals; no ad budget; topics or claims to avoid.",
  leadTrigger: "e.g. Getting ready for a new launch after 6 months without posting",
  quickWin: "e.g. Update bio link and pin a 3-post introduction series for new visitors",
  baselineKpis: "e.g. 12k monthly views, 35 website clicks/month, 4 enquiries/month",
  campaignHistory: "e.g. Short talking videos bring profile visits, while plain text graphics get ignored",
  profileFollowers: "e.g. 2,400 followers or 850 subscribers",
  profileCadence: "e.g. 3 times a week, once a month, or inactive since May",
  profileNotes: "Note whether the bio is clear, if the link works, and which posts get the best response.",
  findingSource: "e.g. Instagram profile, website homepage, competitor page, or client call",
  findingObservation: "Write down what you noticed and why it matters for the plan.",
};

export const businessTypePlaceholders: Record<string, Partial<BusinessPlaceholderSet>> = {
  "Author or publisher": {
    mainSourceLabel: "Main Source (Amazon / Goodreads Link or Pasted Book Blurb)",
    mainSourcePlaceholder: "Paste an Amazon book page URL, Goodreads link, author website URL, or copy-paste the book blurb / author bio.",
    name: "e.g. Elise Monroe",
    business: "e.g. Elise Monroe, Author / Nightfall Press",
    website: "https://elisemonroebooks.com",
    location: "e.g. US & UK English-speaking readers",
    about: "e.g. Self-published fantasy romance author with 3 published books, getting ready to release a new 2-book series.",
    differentiator: "e.g. Strong heroines, rich gothic world-building, slow-burn romance, and illustrated special editions.",
    audience: "e.g. BookTok and Bookstagram readers (ages 18–38), Kindle Unlimited readers, fans of Sarah J. Maas and Rebecca Yarros.",
    goals: "e.g. Reach 1,500 preorders, sign up 200 early reviewers, and add 1,000 readers to the email list before launch day.",
    offerings: "e.g. Book 1 ($4.99 eBook / Free on Kindle Unlimited, $18.99 paperback, $32 signed hardcover) + free bonus chapter for email sign-ups.",
    challenges: "e.g. Tired of repetitive 'buy my book' graphics; wants to reach new readers on Reels and TikTok without having to talk on camera.",
    competitors: "e.g. Similar authors in the same genre (handles or websites) and how they share book teasers with readers.",
    conversionGoal: "e.g. Book preorders, Kindle Unlimited reads, early review sign-ups, and email subscribers",
    brandVoice: "e.g. Moody, dramatic, bookish, and warm with readers",
    techStack: "e.g. WordPress website, BookFunnel, MailerLite, Substack, Shopify bookshop",
    timeline: "e.g. Cover reveal Oct 15, early reviewer copies Nov 1, Book 1 release Dec 3",
    currentAssets: "e.g. 1,400 email subscribers, character illustrations, 45 Goodreads reviews, 3 finished books",
    constraints: "e.g. Prefers aesthetic/faceless videos over talking on camera; busy writing Book 2.",
    leadTrigger: "e.g. New book comes out in 60 days and needs a clear cover-reveal-to-launch plan",
    quickWin: "e.g. Replace plain cover graphics with story-hook slides and link directly to a free Chapter 1 download",
    baselineKpis: "e.g. 4,200 Instagram followers, 800 average Reel views, 20 link clicks/week",
    campaignHistory: "e.g. Short quote videos get 5,000+ views; plain book-cover graphics get very few likes",
    profileFollowers: "e.g. 4,200 Instagram followers / 650 Goodreads followers",
    profileCadence: "e.g. Twice a week on Instagram, daily during launch week",
    profileNotes: "Check if bio clearly states the genre, if pinned posts show the reading order, and if the bio link offers a free sample chapter.",
    findingSource: "e.g. @elisemonroebooks TikTok, Goodreads page, or Amazon book listing",
    findingObservation: "e.g. Pinned posts don't show which book to read first, and readers keep asking in comments if it's on Kindle Unlimited.",
  },
  "Coach or consultant": {
    mainSourceLabel: "Main Source (Services Page Link or Pasted LinkedIn Bio)",
    mainSourcePlaceholder: "Paste their 'Work With Me' page URL, website link, or copy-paste their LinkedIn 'About' section and offer details.",
    name: "e.g. Marcus Chen",
    business: "e.g. Chen Leadership Consulting",
    website: "https://chenadvisory.com",
    location: "e.g. United States & Canada (Online)",
    about: "e.g. Business and leadership coach helping small agency owners and startup founders grow without burning out.",
    differentiator: "e.g. 15 years of hands-on experience running operations—shares practical step-by-step templates instead of vague advice.",
    audience: "e.g. Busy business owners and managers (ages 30–50) struggling with hiring, team bottlenecks, and unpredictable sales.",
    goals: "e.g. Book 12 intro calls a month and fill 15 spots in the upcoming winter group program.",
    offerings: "e.g. 90-Day Group Program ($4,500), 1-on-1 Monthly Coaching ($3,000/mo), Free 5-Minute Business Checklist.",
    challenges: "e.g. Posts get likes from other coaches instead of paying clients; no clear step from reading a LinkedIn post to booking a call.",
    competitors: "e.g. Other leadership coaches or consultants on LinkedIn and YouTube.",
    conversionGoal: "e.g. Intro call bookings, free checklist downloads, or direct messages",
    brandVoice: "e.g. Direct, practical, encouraging, and clear",
    techStack: "e.g. WordPress, HubSpot, Calendly, ConvertKit",
    timeline: "e.g. Group program enrollment Nov 10–22; live free workshop on Nov 12",
    currentAssets: "e.g. 3,800 LinkedIn connections, 900 email subscribers, 12 client success stories, podcast guest clips",
    constraints: "e.g. Can record 4 short videos once a month; cannot share private client numbers.",
    leadTrigger: "e.g. Launching a new group program next quarter and word-of-mouth referrals aren't enough",
    quickWin: "e.g. Add the free Business Checklist to the top of LinkedIn and share one real client before-and-after story each week",
    baselineKpis: "e.g. 25k monthly LinkedIn views, 4 booked calls/month",
    campaignHistory: "e.g. Real examples and step-by-step breakdowns bring direct messages; generic tip lists get ignored",
    profileFollowers: "e.g. 5,600 LinkedIn followers / 1,100 Instagram followers",
    profileCadence: "e.g. 4 times a week on LinkedIn, weekly email newsletter",
    profileNotes: "Check if the profile headline clearly says who they help, and whether there is an easy link to book a call.",
    findingSource: "e.g. LinkedIn profile, Calendly booking page, or competitor workshop page",
    findingObservation: "e.g. LinkedIn bio lists past job titles but has no link to book an intro call or download the free checklist.",
  },
  "Creator or influencer": {
    mainSourceLabel: "Main Source (Link-in-Bio URL, Media Kit, or Pasted Bio)",
    mainSourcePlaceholder: "Paste their Linktree / Stan Store URL, YouTube / TikTok profile URL, or copy-paste their bio and recent video topics.",
    name: "e.g. Maya Lin",
    business: "e.g. Maya In Motion",
    website: "https://mayainmotion.co",
    location: "e.g. Los Angeles / US & Global audience",
    about: "e.g. Lifestyle, desk-setup, and productivity creator sharing simple tech reviews and daily routines.",
    differentiator: "e.g. Calm, cozy video style paired with honest, practical reviews for people who work from home.",
    audience: "e.g. Remote workers, freelancers, and students (ages 20–35) who want a comfortable, organized home workspace.",
    goals: "e.g. Grow average video views to 25k+, reach 5,000 email subscribers, and land 3 long-term brand sponsorships.",
    offerings: "e.g. Sponsored videos ($1,500–$3,500), Digital Planner Pack ($39), Amazon & LTK product links.",
    challenges: "e.g. Income goes up and down with algorithm changes; needs a better way to turn video viewers into email subscribers and buyers.",
    competitors: "e.g. Similar home-office and lifestyle creators and their most popular video series.",
    conversionGoal: "e.g. Email sign-ups, digital planner sales, affiliate clicks, and brand inquiries",
    brandVoice: "e.g. Calm, honest, warm, and visually tidy",
    techStack: "e.g. Stan Store, Substack, Notion, Amazon Storefront",
    timeline: "e.g. Back-to-school desk series in August; Holiday gift guides in November",
    currentAssets: "e.g. 48k TikTok followers, 19k Instagram followers, video clip library, media kit",
    constraints: "e.g. Turns down low-quality sponsors; films only on weekends.",
    leadTrigger: "e.g. Wants steady income from her own digital products instead of relying only on brand deals",
    quickWin: "e.g. Start a weekly '3 Desk Upgrades Under $50' video series with a clean bio link to the Digital Planner",
    baselineKpis: "e.g. 8,500 average views per Reel, 320 shop clicks/month",
    campaignHistory: "e.g. Unboxing videos get high views, while 'How I plan my week' posts bring the most digital planner sales",
    profileFollowers: "e.g. 48k TikTok / 19k Instagram / 6k YouTube",
    profileCadence: "e.g. 4 videos a week, daily Stories",
    profileNotes: "Check if business email is easy to find for sponsors, and whether the bio link has too many cluttered buttons.",
    findingSource: "e.g. TikTok profile, bio link page, or sponsor media kit",
    findingObservation: "e.g. Bio link page has 14 buttons, making it hard for followers to find the $39 Digital Planner.",
  },
  "E-commerce or retail": {
    mainSourceLabel: "Main Source (Store Homepage, Best-Seller URL, or Product Copy)",
    mainSourcePlaceholder: "Paste their online store URL, #1 best-selling product page link, or copy-paste their 'About' and product descriptions.",
    name: "e.g. Clara & Sam Rivera",
    business: "e.g. Solace Botanicals",
    website: "https://solacebotanicals.com",
    location: "e.g. Ships across the US & Canada",
    about: "e.g. Small-batch body care brand making refillable, fragrance-free lotions and washes for sensitive skin.",
    differentiator: "e.g. Dermatologist-tested formulas in refillable aluminum bottles that cut plastic waste by 80%.",
    audience: "e.g. Shoppers (ages 25–45) with dry or sensitive skin who want gentle ingredients and eco-friendly packaging.",
    goals: "e.g. Increase online store sales from social media by 30% and add 500 email/text subscribers a month.",
    offerings: "e.g. 3-Step Skin Repair Bundle ($68), Monthly Refill Pouches ($26/mo), Mini Starter Kit ($24).",
    challenges: "e.g. People click through to the website but leave without buying; feed has too many plain bottle photos and not enough real customer videos.",
    competitors: "e.g. Similar clean skincare brands and how they show customer results and bundles.",
    conversionGoal: "e.g. Online store orders, Starter Kit purchases, and 15%-off welcome email sign-ups",
    brandVoice: "e.g. Clean, gentle, honest, and helpful",
    techStack: "e.g. Shopify, Klaviyo email/SMS, Judge.me reviews, TikTok Shop",
    timeline: "e.g. Fall Hydrating Bundle launch Oct 10; Black Friday / Cyber Monday sale Nov 20–Dec 2",
    currentAssets: "e.g. 6,200 email subscribers, 420 5-star reviews, behind-the-scenes making-of videos, 15 customer clips",
    constraints: "e.g. Cannot make medical cure claims for eczema; 3-week restock wait on refill pouches.",
    leadTrigger: "e.g. Getting ready for holiday gift shopping and wants stronger sales from Instagram, TikTok, and email",
    quickWin: "e.g. Pin a '3-Step Sensitive Skin Routine' video and link directly to the $24 Mini Starter Kit",
    baselineKpis: "e.g. $48 average order, $1,800/month in sales from social media",
    campaignHistory: "e.g. Behind-the-scenes videos of how products are made brought 4x more orders than studio product photos",
    profileFollowers: "e.g. 11.5k Instagram / 7.2k TikTok",
    profileCadence: "e.g. 3 posts a week, occasional Stories",
    profileNotes: "Check if products are tagged, if customer reviews are highlighted, and if the welcome discount is easy to find.",
    findingSource: "e.g. Shopify product page, Instagram Shop tab, or customer reviews",
    findingObservation: "e.g. Most 5-star reviews say 'fixed my winter dry skin in 3 days', but social posts only talk about the bottles.",
  },
  "Professional services": {
    mainSourceLabel: "Main Source (Firm Website, Services Page, or Partner Bio)",
    mainSourcePlaceholder: "Paste their firm website URL, practice-area page link, or copy-paste the partner's LinkedIn summary.",
    name: "e.g. Evelyn Harper, CPA",
    business: "e.g. Harper & Sterling Advisory",
    website: "https://harpersterling.com",
    location: "e.g. Chicago area & clients across the US",
    about: "e.g. Accounting and tax planning firm helping medical practices and service businesses save on taxes year-round.",
    differentiator: "e.g. Year-round quarterly tax planning and clear cash-flow reports instead of only talking at tax time.",
    audience: "e.g. Practice owners and business founders ($1M–$10M revenue) tired of surprise tax bills and messy bookkeeping.",
    goals: "e.g. Book 8 qualified tax-planning consultations per month ahead of year-end deadlines.",
    offerings: "e.g. Custom Tax Savings Plan ($3,500), Monthly Accounting & Advisory ($2,200/mo), Year-End Tax Review.",
    challenges: "e.g. Accounting topics can feel dry on social media; partners are busy with client work and need simple compliance-safe posts.",
    competitors: "e.g. Regional accounting firms and virtual bookkeeping agencies on LinkedIn.",
    conversionGoal: "e.g. Consultation bookings and Year-End Tax Checklist downloads",
    brandVoice: "e.g. Trustworthy, clear, approachable, and plain-English",
    techStack: "e.g. WordPress, HubSpot, Calendly, QuickBooks",
    timeline: "e.g. Year-End Tax Planning Window (Oct–Dec); Spring tax deadlines (Jan–April)",
    currentAssets: "e.g. 1,900 client email list, website blog, 8 client tax-savings examples",
    constraints: "e.g. Must include a standard tax disclaimer; never share private client names.",
    leadTrigger: "e.g. Expanding monthly advisory services and wants LinkedIn posts that bring in larger business clients",
    quickWin: "e.g. Share a 4-part LinkedIn series on 'Common Tax Mistakes Costing Practice Owners $40k+' with a booking link",
    baselineKpis: "e.g. 8,000 monthly LinkedIn views, 450 monthly website visits, 2 enquiries/month",
    campaignHistory: "e.g. Simple plain-English breakdowns of tax rule changes got 6x more response than firm announcements",
    profileFollowers: "e.g. 2,100 LinkedIn (Partner) / 480 Company Page",
    profileCadence: "e.g. Once a month",
    profileNotes: "Compare partner personal LinkedIn profiles vs. the company page, and check how easy it is to book a call.",
    findingSource: "e.g. Partner LinkedIn profile, website service pages, or competitor posts",
    findingObservation: "e.g. The partner's personal LinkedIn gets 4x more views than the company page, but has no link to book a consultation.",
  },
  "Health and wellness": {
    mainSourceLabel: "Main Source (Studio / Clinic Website, Booking Page, or Reviews)",
    mainSourcePlaceholder: "Paste their studio/clinic website URL, Mindbody / intro-offer link, or copy-paste their class descriptions and Google reviews.",
    name: "e.g. Dr. Hannah Cole",
    business: "e.g. Aura Movement & Recovery Studio",
    website: "https://auramovement.com",
    location: "e.g. Denver, CO (Cherry Creek & within 10 miles)",
    about: "e.g. Reformer Pilates and physical-therapy studio helping adults build strength and relieve back and joint pain.",
    differentiator: "e.g. Small 8-person classes designed by physical therapists so beginners feel safe and supported.",
    audience: "e.g. Local adults (ages 28–55) dealing with desk stiffness, past injuries, or intimidating big-box gyms.",
    goals: "e.g. Sell 45 New Member 2-Week Intro Packs a month and turn 60% into monthly members.",
    offerings: "e.g. 2-Week Intro Pack ($79), Unlimited Monthly Membership ($249/mo), 1-on-1 Mobility Check ($165).",
    challenges: "e.g. Newcomers feel intimidated by Pilates reformer machines; many locals don't realize classes are physical-therapist led.",
    competitors: "e.g. Local Pilates studios, gyms, and physical therapy clinics in the same neighborhood.",
    conversionGoal: "e.g. $79 Intro Pack sign-ups and 1-on-1 Mobility Check bookings",
    brandVoice: "e.g. Welcoming, encouraging, knowledgeable, and calm",
    techStack: "e.g. WordPress, Mindbody booking app, Klaviyo email, Google Business Profile",
    timeline: "e.g. January 'Move Pain-Free' New Year kickoff; Fall posture reset campaign",
    currentAssets: "e.g. 1,600 past & current client emails, 95 5-star Google reviews, studio video clips",
    constraints: "e.g. Never film clients without permission; avoid medical cure promises or weight-loss pressure.",
    leadTrigger: "e.g. Added 6 new midday classes that are only 40% full right now",
    quickWin: "e.g. Pin a 'What to Expect in Your First Class' walkthrough video with a direct link to the $79 Intro Pack",
    baselineKpis: "e.g. 18 Intro Packs/month, 68% class seats filled, 3,200 local Instagram followers",
    campaignHistory: "e.g. Quick desk-stretch videos get shared locally, while plain class-schedule graphics get skipped",
    profileFollowers: "e.g. 3,200 Instagram / 95 Google Reviews",
    profileCadence: "e.g. Twice a week on feed, daily Stories",
    profileNotes: "Check if the neighborhood is in the bio name for local search, and how many clicks it takes to buy the Intro Pack.",
    findingSource: "e.g. Mindbody booking page, Instagram profile, or Google Reviews",
    findingObservation: "e.g. The Instagram bio link goes to the general homepage instead of directly to the $79 New Member Intro Pack.",
  },
  "Beauty and personal care": {
    mainSourceLabel: "Main Source (Salon Website, Booking Menu Link, or Bio)",
    mainSourcePlaceholder: "Paste their salon website URL, GlossGenius / Vagaro / Boulevard booking link, or copy-paste their service menu.",
    name: "e.g. Sienna Reyes",
    business: "e.g. Atelier Sienna Hair & Scalp Spa",
    website: "https://ateliersienna.com",
    location: "e.g. Scottsdale, AZ",
    about: "e.g. Hair salon and Japanese head-spa studio specializing in low-maintenance hair color and relaxing scalp treatments.",
    differentiator: "e.g. Custom color that grows out softly for 12 weeks, paired with a 60-minute scalp massage ritual.",
    audience: "e.g. Local women (ages 24–50) looking for natural-looking hair color or a relaxing spa treatment.",
    goals: "e.g. Fill Tuesday–Thursday daytime appointments and book 30 Head Spa treatments per month.",
    offerings: "e.g. Lived-In Color Package ($320), 60-Minute Japanese Head Spa ($165), Gloss & Scalp Refresh ($110).",
    challenges: "e.g. Stylists forget to take 'before' photos; new clients aren't sure which service to pick on the booking menu.",
    competitors: "e.g. Other local hair salons, head spas, and med-spas in the area.",
    conversionGoal: "e.g. Online appointment bookings and new-client consultation requests",
    brandVoice: "e.g. Warm, polished, relaxing, and confidence-boosting",
    techStack: "e.g. Boulevard or GlossGenius booking, WordPress, Instagram Book button",
    timeline: "e.g. Spring & Fall wedding seasons; Holiday gift card & self-care season (Nov–Dec)",
    currentAssets: "e.g. Hair transformation videos, relaxing head-spa clips, 140 5-star reviews, 2,100 client text list",
    constraints: "e.g. Stylists only have 5 minutes between clients to film; no discounts on weekend appointments.",
    leadTrigger: "e.g. Opened 2 new head-spa rooms and hired a new stylist whose schedule needs filling",
    quickWin: "e.g. Add a 'Which Service Should I Book?' guide to Instagram Highlights and share relaxing head-spa video clips",
    baselineKpis: "e.g. 72% weekday chairs filled, 4,800 Instagram followers, 25 online bookings/week",
    campaignHistory: "e.g. Relaxing scalp-wash videos and before/after hair reveals bring 5x more booking clicks than static graphics",
    profileFollowers: "e.g. 4,800 Instagram / 2,900 TikTok",
    profileCadence: "e.g. 3 transformation videos a week",
    profileNotes: "Check if city + specialty are in the bio, if the Book button works smoothly, and if service names are easy to understand.",
    findingSource: "e.g. Salon Instagram feed, online booking menu, or Google Reviews",
    findingObservation: "e.g. The online booking menu lists 22 technical hair terms that confuse first-time clients before they finish booking.",
  },
  "Food and hospitality": {
    mainSourceLabel: "Main Source (Restaurant Website, Menu / Resy Link, or Reviews)",
    mainSourcePlaceholder: "Paste their restaurant website URL, Resy / OpenTable page, or copy-paste their menu highlights and Google review themes.",
    name: "e.g. Marco & Elena Rossi",
    business: "e.g. Osteria Lume",
    website: "https://osterialume.com",
    location: "e.g. West Loop, Chicago (within 3 miles)",
    about: "e.g. Neighborhood Italian restaurant and wine bar serving fresh handmade pasta and wood-fired small plates.",
    differentiator: "e.g. Pasta made fresh every morning in-house and a welcoming $12 weekday happy hour.",
    audience: "e.g. Local food lovers, date-night couples, and groups of friends (ages 25–55) looking for a great night out.",
    goals: "e.g. Boost Wednesday–Thursday dinner reservations by 35% and book 8 private holiday parties.",
    offerings: "e.g. Dinner service ($55 avg per person), Weekday Happy Hour (4–6 PM), Chef’s 5-Course Tasting ($85), Private Dining Room.",
    challenges: "e.g. Packed on weekends but quiet mid-week; new seasonal dishes aren't shared consistently online.",
    competitors: "e.g. Nearby neighborhood restaurants, wine bars, and date-night spots.",
    conversionGoal: "e.g. Table reservations on Resy/OpenTable, private party inquiries, and email list sign-ups",
    brandVoice: "e.g. Warm, welcoming, appetizing, and lively",
    techStack: "e.g. Resy or OpenTable, Toast POS, WordPress, Google Business Profile",
    timeline: "e.g. Fall menu launch Oct 12; Holiday private party bookings (Oct–Dec); Valentine's Day",
    currentAssets: "e.g. 3,400 guest emails/texts, kitchen cooking videos, 310 Google reviews (4.8 stars)",
    constraints: "e.g. Kitchen is too busy during dinner rush for staged photo shoots; no coupon-site discounts.",
    leadTrigger: "e.g. Launching the fall menu and promoting the private dining room for holiday parties",
    quickWin: "e.g. Post a 15-second fresh-pasta video every Wednesday afternoon with a direct link to book a mid-week table",
    baselineKpis: "e.g. 60% mid-week tables filled, 95% weekend tables filled, 5,400 Instagram followers",
    campaignHistory: "e.g. Close-up kitchen plating videos and chef specials fill tables the same evening",
    profileFollowers: "e.g. 5,400 Instagram / 310 Google Reviews",
    profileCadence: "e.g. Twice a week, occasional weekend Stories",
    profileNotes: "Check if opening hours, street address, reservation button, and current menu are easy to find right away.",
    findingSource: "e.g. Instagram profile, Google Maps listing, or Resy page",
    findingObservation: "e.g. The menu on the website is still from spring, and the Instagram bio doesn't list the street address or hours.",
  },
  "Real estate": {
    mainSourceLabel: "Main Source (Agent Website, Zillow / Bio Page, or Listings)",
    mainSourcePlaceholder: "Paste their team website URL, Zillow / Realtor profile, or copy-paste their agent bio and target neighborhoods.",
    name: "e.g. Devon Brooks",
    business: "e.g. Brooks Residential Group",
    website: "https://brooksresidential.com",
    location: "e.g. Greater Nashville & Franklin, TN",
    about: "e.g. Local real estate team helping families moving from out of state and local homeowners buying their next home.",
    differentiator: "e.g. Honest neighborhood video tours, school and commute guides, and early access to local builders.",
    audience: "e.g. Relocating families and local move-up buyers ($600k–$1.4M budget) comparing neighborhoods and schools.",
    goals: "e.g. Get 15 Relocation Guide downloads and book 5 buyer or seller consultations per month.",
    offerings: "e.g. Home Buyer Representation, Home Staging & Listing Prep, Free Nashville Neighborhood Guide.",
    challenges: "e.g. Feed is full of 'Just Sold' flyers that don't interest people planning a move 3–6 months from now.",
    competitors: "e.g. Other local real estate agents and relocation YouTube channels in the area.",
    conversionGoal: "e.g. Buyer/seller consultation calls, home value estimates, and Neighborhood Guide downloads",
    brandVoice: "e.g. Helpful, local expert, honest, and approachable",
    techStack: "e.g. Follow Up Boss CRM, WordPress website, Calendly",
    timeline: "e.g. Spring home-selling season (Jan–May); Summer family moving season",
    currentAssets: "e.g. 1,100 past-client contacts, drone home videos, 65 5-star Zillow and Google reviews",
    constraints: "e.g. Must include brokerage name for compliance; can film neighborhood tours one afternoon a week.",
    leadTrigger: "e.g. Wants to attract buyers directly from Instagram and YouTube instead of paying for Zillow leads",
    quickWin: "e.g. Swap 'Just Sold' graphics for 'What $750k Buys You in 2 Different Neighborhoods' walkthrough videos",
    baselineKpis: "e.g. 2,800 Instagram followers, 1,200 average Reel views, 3 enquiries/month",
    campaignHistory: "e.g. Neighborhood pros-and-cons videos and cost-of-living breakdowns get 10x more messages than interest-rate charts",
    profileFollowers: "e.g. 2,800 Instagram / 900 YouTube subscribers",
    profileCadence: "e.g. Twice a week",
    profileNotes: "Check how many posts actually teach buyers about the area vs. 'Just Sold' flyers, and if the free guide is linked.",
    findingSource: "e.g. Agent Instagram, YouTube channel, or website",
    findingObservation: "e.g. The last 9 posts are identical 'Just Sold' templates with no neighborhood tips or reason for buyers to follow.",
  },
  "Education and training": {
    mainSourceLabel: "Main Source (Course / Program Landing Page or Syllabus)",
    mainSourcePlaceholder: "Paste the course landing page URL, school website, or copy-paste the program overview and student outcomes.",
    name: "e.g. Priya Patel",
    business: "e.g. Praxis Design Academy",
    website: "https://praxisuxacademy.com",
    location: "e.g. Online (US, UK, Canada & Europe)",
    about: "e.g. Live 10-week online program helping graphic designers and career-switchers build job-ready product design portfolios.",
    differentiator: "e.g. Weekly live feedback from working designers on real projects—students finish with 2 complete portfolio pieces.",
    audience: "e.g. Graphic designers and junior creatives (ages 22–36) who want to move into higher-paying tech design roles.",
    goals: "e.g. Sign up 350 people for the free portfolio workshop and enroll 40 students in the next class.",
    offerings: "e.g. 10-Week Live Program ($1,850), Self-Paced Beginner Course ($199), Free Live Portfolio Review Workshop.",
    challenges: "e.g. People are cautious about online courses; needs more real student success stories and teacher previews.",
    competitors: "e.g. Other online design programs, bootcamps, and YouTube educators.",
    conversionGoal: "e.g. Class applications, free workshop sign-ups, and course guide downloads",
    brandVoice: "e.g. Practical, encouraging, honest, and mentor-led",
    techStack: "e.g. WordPress or Webflow, Teachable / Circle, HubSpot, ConvertKit, Zoom",
    timeline: "e.g. Free Live Workshop Nov 5; Early-bird deadline Nov 14; Next class starts Dec 1",
    currentAssets: "e.g. 4,500 email subscribers, 30 student video stories, recorded portfolio feedback clips",
    constraints: "e.g. Never promise a guaranteed job; teachers have less time to film during grading weeks.",
    leadTrigger: "e.g. Opening enrollment for the winter class in 45 days and needs a clear launch plan",
    quickWin: "e.g. Share 60-second clips of real student portfolio makeovers each week leading up to the free workshop",
    baselineKpis: "e.g. 7,400 Instagram followers, 3,200 LinkedIn followers, 18% of workshop attendees apply",
    campaignHistory: "e.g. Real before-and-after portfolio fixes and graduate stories drive 70% of course inquiries",
    profileFollowers: "e.g. 7,400 Instagram / 3,200 LinkedIn",
    profileCadence: "e.g. 3 times a week during launches, quiet between classes",
    profileNotes: "Check if the next start date, student results, and free workshop link are easy to see right away.",
    findingSource: "e.g. Course page, Instagram Reels, or student LinkedIn posts",
    findingObservation: "e.g. The account stops posting for 6 weeks between classes, so reach drops right before enrollment opens.",
  },
  "Technology or software": {
    mainSourceLabel: "Main Source (Product Homepage, Pricing Page, or Docs)",
    mainSourcePlaceholder: "Paste their software homepage URL, pricing page link, or copy-paste their product overview and feature list.",
    name: "e.g. Liam O'Connor",
    business: "e.g. PulseFlow",
    website: "https://pulseflow.io",
    location: "e.g. Online Software (US & Europe primary markets)",
    about: "e.g. Software tool that turns client kickoff calls into ready-to-use project checklists and tasks automatically.",
    differentiator: "e.g. Connects with HubSpot, Notion, and Slack in one click—saves teams 6 hours of manual setup every week.",
    audience: "e.g. Operations managers, project leads, and agency owners at 10–100 person companies.",
    goals: "e.g. Get 250 free 14-day trial sign-ups and 25 live demo bookings per month.",
    offerings: "e.g. Pro Plan ($49/month), Team Plan ($199/month), Custom Company Plan, 14-Day Free Trial.",
    challenges: "e.g. Posts read like technical update notes instead of showing how much time the tool actually saves.",
    competitors: "e.g. Zapier, Make, meeting-note apps, and manual spreadsheets.",
    conversionGoal: "e.g. 14-day free trial sign-ups and live demo bookings",
    brandVoice: "e.g. Clear, helpful, practical, and jargon-free",
    techStack: "e.g. WordPress or Next.js site, HubSpot, Stripe, Customer.io",
    timeline: "e.g. Major HubSpot integration launch on Nov 18; Product Hunt launch in December",
    currentAssets: "e.g. 3,100 email users, short screen-recording demos, customer time-saved stats",
    constraints: "e.g. Avoid overhyped AI buzzwords; hide any real customer names in screen recordings.",
    leadTrigger: "e.g. Launching a major new feature next month and wants posts that turn views into trial sign-ups",
    quickWin: "e.g. Post 45-second side-by-side videos showing 'Doing It Manually vs. With PulseFlow' on the founder's LinkedIn",
    baselineKpis: "e.g. 90 free trials/month, 15k monthly LinkedIn views",
    campaignHistory: "e.g. Short screen recordings of real workflows brought 5x more trials than static feature graphics",
    profileFollowers: "e.g. 4,100 Founder LinkedIn / 1,800 X / 950 Company Page",
    profileCadence: "e.g. Twice a week on LinkedIn and X",
    profileNotes: "Check if it's obvious what the software does in 5 seconds, and if posts show the actual product in action.",
    findingSource: "e.g. Website homepage, Founder LinkedIn, or software review sites",
    findingObservation: "e.g. The company page only posts static feature graphics, while the founder's quick screen demos get 20+ comments.",
  },
  "Nonprofit or community": {
    mainSourceLabel: "Main Source (Nonprofit Website, Donate Page, or Impact Report)",
    mainSourcePlaceholder: "Paste their organization website URL, donation campaign link, or copy-paste their mission statement and impact numbers.",
    name: "e.g. Amara Okafor",
    business: "e.g. Harbor Youth Literacy Foundation",
    website: "https://harborliteracy.org",
    location: "e.g. Greater Baltimore & Maryland",
    about: "e.g. Local nonprofit providing free after-school reading tutors and take-home books for elementary school kids.",
    differentiator: "e.g. 92% of students improve by more than a full reading grade level in one school year, and donations stay 100% local.",
    audience: "e.g. Monthly donors (ages 30–65), local business sponsors, and community volunteer tutors.",
    goals: "e.g. Raise $45,000 in the Year-End campaign, add 60 monthly donors ($35/mo), and sign up 40 new volunteer tutors.",
    offerings: "e.g. Sponsor a Reader ($35/month = books + tutoring for 1 child), Local Business Classroom Sponsor ($2,500), Volunteer Sign-Up.",
    challenges: "e.g. Posts look like event flyers or dry statistics instead of personal stories showing how donations help real kids.",
    competitors: "e.g. Other local education charities and national nonprofits during GivingTuesday.",
    conversionGoal: "e.g. Monthly donations, GivingTuesday gifts, and volunteer applications",
    brandVoice: "e.g. Hopeful, warm, community-focused, and transparent",
    techStack: "e.g. WordPress, Givebutter donation page, Bloomerang, Mailchimp",
    timeline: "e.g. GivingTuesday (Dec 2); Year-End Fundraising Drive (Dec 15–31); Spring Volunteer Drive",
    currentAssets: "e.g. 2,800 donor email list, Annual Impact Report, tutor and parent interview clips",
    constraints: "e.g. Always require signed parent permission for student photos; keep stories respectful and uplifting.",
    leadTrigger: "e.g. Getting ready for GivingTuesday and Year-End giving with a $20,000 matching donation to unlock",
    quickWin: "e.g. Share a weekly 'Meet the Tutors' story showing how $35/month provides a child's books for the semester",
    baselineKpis: "e.g. 3,100 Instagram followers, 2,400 Facebook followers, $42 average gift",
    campaignHistory: "e.g. Tutor spotlight videos and simple '$35 = 12 books' graphics raised 3x more than general 'donate now' flyers",
    profileFollowers: "e.g. 3,100 Instagram / 2,400 Facebook / 850 LinkedIn",
    profileCadence: "e.g. 1–2 times a week",
    profileNotes: "Check how many clicks it takes to donate on a phone, and whether posts clearly show what a donation pays for.",
    findingSource: "e.g. Donation page, Instagram feed, or Annual Impact Report",
    findingObservation: "e.g. Donating on a phone takes 4 clicks, and the $35/month option isn't highlighted on the form.",
  },
  "Arts and entertainment": {
    mainSourceLabel: "Main Source (Artist Website, Bandcamp / Spotify, or Press Release)",
    mainSourcePlaceholder: "Paste their artist website, Bandcamp / Linktree URL, or copy-paste their bio and upcoming release/show details.",
    name: "e.g. Julian Vance",
    business: "e.g. Velvet Echo / Julian Vance Studio",
    website: "https://velvetechomusic.com",
    location: "e.g. Brooklyn, NY & East Coast tour cities",
    about: "e.g. Indie synth-pop duo combining 80s analog synthesizers with hand-painted artwork and live visual shows.",
    differentiator: "e.g. Every release comes with a limited-edition painted vinyl print and an immersive live projection show.",
    audience: "e.g. Indie music fans, vinyl collectors, and concert-goers (ages 19–38) who love supporting independent artists.",
    goals: "e.g. Reach 3,000 Spotify/Apple pre-saves for the new EP, sell out 250 limited vinyl records, and sell 400 tour tickets.",
    offerings: "e.g. Signed Limited Vinyl + Art Print ($45), Live Show Tickets ($25), Patreon Fan Club ($8/mo).",
    challenges: "e.g. Account goes quiet between releases; needs a better way to turn casual TikTok listeners into ticket and vinyl buyers.",
    competitors: "e.g. Similar independent bands, visual artists, and touring musicians.",
    conversionGoal: "e.g. Song pre-saves, show ticket sales, vinyl orders, and fan list sign-ups",
    brandVoice: "e.g. Creative, personal, atmospheric, and behind-the-scenes",
    techStack: "e.g. Bandcamp, Shopify, Laylo text alerts, Feature.fm, Patreon, Eventbrite",
    timeline: "e.g. New single Oct 25; Full EP & vinyl release Nov 22; 5-city East Coast tour in December",
    currentAssets: "e.g. 18k monthly Spotify listeners, 900 fan email/text subscribers, studio recording clips",
    constraints: "e.g. Independent budget; prefers real studio and artwork videos over silly trend dances.",
    leadTrigger: "e.g. 6 weeks until the new EP release and December tour kickoff",
    quickWin: "e.g. Post 20-second studio clips showing how the song was made, linked to a text alert for the signed vinyl drop",
    baselineKpis: "e.g. 9,200 TikTok followers, 6,100 Instagram followers, 18k monthly Spotify listeners",
    campaignHistory: "e.g. Raw studio clips and vinyl painting videos got 4x more engagement than polished music video trailers",
    profileFollowers: "e.g. 9,200 TikTok / 6,100 Instagram / 2,300 YouTube",
    profileCadence: "e.g. 3 times a week during releases, quiet in between",
    profileNotes: "Check if upcoming show dates, song pre-save link, and merch store are pinned at the top of the profile.",
    findingSource: "e.g. Spotify profile, Bandcamp store, or TikTok feed",
    findingObservation: "e.g. Top TikTok video has 45k views with fans asking for tour dates, but the bio link only goes to an old song.",
  },
  "Local services": {
    mainSourceLabel: "Main Source (Business Website, Quote Page, or Google Reviews)",
    mainSourcePlaceholder: "Paste their business website URL, service page link, or copy-paste their services list and top Google reviews.",
    name: "e.g. Ryan Miller",
    business: "e.g. Evergreen Outdoor Living & Landscape",
    website: "https://evergreenoutdoor.com",
    location: "e.g. Charlotte, NC & surrounding suburbs (within 25 miles)",
    about: "e.g. Local landscaping, stone patio building, and seasonal lawn care company for homeowners.",
    differentiator: "e.g. Shows homeowners a 3D preview of their yard before work starts, with clear fixed pricing and a 5-year warranty.",
    audience: "e.g. Local homeowners (ages 32–65) who want a great backyard patio or reliable year-round yard care.",
    goals: "e.g. Book 20 patio and landscaping quote requests a month and sign up 35 recurring lawn care customers.",
    offerings: "e.g. Custom Patios & Outdoor Kitchens ($12k–$45k), Monthly Yard Care Plan ($240/mo), 3D Backyard Design.",
    challenges: "e.g. Crew forgets to take 'before' photos on job sites; relies mostly on word-of-mouth with slower winter months.",
    competitors: "e.g. Other local landscaping and patio contractors on Google Maps and Facebook.",
    conversionGoal: "e.g. Free on-site quote requests, phone calls, and monthly lawn care sign-ups",
    brandVoice: "e.g. Reliable, neighborly, proud of the craft, and straightforward",
    techStack: "e.g. WordPress, Jobber scheduling software, Google Business Profile, Nextdoor",
    timeline: "e.g. Fall lawn prep & firepit season (Oct–Nov); Spring patio booking rush (Feb–May)",
    currentAssets: "e.g. 115 5-star Google reviews, finished patio photos, 900 past customers in Jobber",
    constraints: "e.g. Only serves within 25 miles of Charlotte; minimum patio project is $8,000.",
    leadTrigger: "e.g. Wants to book out winter and early-spring patio projects before the spring rush",
    quickWin: "e.g. Turn 3-photo job transformations (Before Yard -> 3D Design -> Finished Patio) into weekly Facebook, Instagram, and Google posts",
    baselineKpis: "e.g. 115 Google reviews (4.9 stars), 1,400 Facebook followers, 12 website quote requests/month",
    campaignHistory: "e.g. Before-and-after backyard transformations with ballpark price ranges bring the most quote requests",
    profileFollowers: "e.g. 1,400 Facebook / 950 Instagram / 115 Google Reviews",
    profileCadence: "e.g. Once a month",
    profileNotes: "Check if towns served are listed in the bio, if the quote form is easy to use on a phone, and if Google photos are current.",
    findingSource: "e.g. Google Business Profile, website quote form, or Facebook page",
    findingObservation: "e.g. The website quote form asks 14 required questions on a phone, and Google Maps hasn't had new job photos in 4 months.",
  },
};

export function getPlaceholders(businessType: string): BusinessPlaceholderSet {
  if (!businessType || !businessTypePlaceholders[businessType]) {
    return defaultPlaceholders;
  }
  return {
    ...defaultPlaceholders,
    ...businessTypePlaceholders[businessType],
  };
}

export const businessTypeFields: Record<string, DynamicFieldSpec[]> = {
  "Author or publisher": [
    {
      key: "author_genre",
      label: "Book Genre",
      type: "text",
      placeholder: "e.g. Fantasy Romance, Mystery / Thriller, Sci-Fi, Historical Fiction, Memoir, Self-Help",
    },
    {
      key: "author_publishing_path",
      label: "How It’s Published",
      type: "select",
      options: [
        { value: "", label: "Select Publishing Type" },
        { value: "Indie / Self-Published", label: "Self-Published / Indie" },
        { value: "Traditionally Published", label: "Traditionally Published" },
        { value: "Hybrid Published", label: "Hybrid" },
        { value: "Small Press / Publisher Catalog", label: "Small Press or Publisher" },
      ],
    },
    {
      key: "author_release_stage",
      label: "Book Stage",
      type: "select",
      options: [
        { value: "", label: "Select Book Stage" },
        { value: "Pre-Launch / ARC & Preorder Phase", label: "Before Launch (Preorders & Early Copies)" },
        { value: "Launch Window (Release Month)", label: "Launch Month" },
        { value: "Post-Launch Momentum", label: "Recently Released" },
        { value: "Backlist / Evergreen Growth", label: "Older Books / Full Series" },
        { value: "Between Releases / World-Building", label: "Between Books" },
      ],
    },
    {
      key: "author_formats_retailers",
      label: "Book Formats & Where It’s Sold",
      type: "text",
      placeholder: "e.g. Kindle Unlimited, Amazon, Apple Books, Kobo, Barnes & Noble, Paperback, Audiobook, Direct Shop",
    },
    {
      key: "author_tropes_comps",
      label: "Themes, Story Hooks & Similar Authors",
      type: "textarea",
      placeholder: "e.g. Themes: enemies-to-lovers, found family. Similar to: Fourth Wing meets The Night Circus. Main 1-sentence hook.",
    },
    {
      key: "author_reader_ecosystem",
      label: "Email List & Reader Group",
      type: "text",
      placeholder: "e.g. 1,400 email subscribers, free bonus chapter, 60 early reviewers, Goodreads page",
    },
  ],
  "Coach or consultant": [
    {
      key: "coach_niche",
      label: "Area of Focus",
      type: "text",
      placeholder: "e.g. Leadership Coaching, Career Changes, Small Business Growth, Health & Habits",
    },
    {
      key: "coach_delivery_model",
      label: "How They Work With Clients",
      type: "select",
      options: [
        { value: "", label: "Select Format" },
        { value: "1:1 Coaching / Advisory Retainer", label: "1-on-1 Coaching or Consulting" },
        { value: "Group Program / Cohort", label: "Group Program" },
        { value: "Hybrid (1:1 + Group)", label: "Both 1-on-1 and Group" },
        { value: "Self-Paced Course / Membership", label: "Online Course or Membership" },
        { value: "Corporate Workshops & Speaking", label: "Company Workshops & Speaking" },
      ],
    },
    {
      key: "coach_price_tier",
      label: "Typical Price Range",
      type: "select",
      options: [
        { value: "", label: "Select Price Range" },
        { value: "Low-Ticket (<$500)", label: "Under $500" },
        { value: "Mid-Tier ($500–$2,000)", label: "$500–$2,000" },
        { value: "High-Ticket ($2,000–$10,000+)", label: "$2,000–$10,000+" },
        { value: "Corporate / Custom Retainer", label: "Custom / Company Retainer" },
      ],
    },
    {
      key: "coach_funnel",
      label: "How New Clients Sign Up",
      type: "text",
      placeholder: "e.g. Free checklist download -> email follow-up -> 30-minute intro call on Calendly",
    },
  ],
  "Creator or influencer": [
    {
      key: "creator_niche",
      label: "Main Topics & Style",
      type: "text",
      placeholder: "e.g. Cozy Home Office & Tech, Book Reviews, Everyday Fashion, Solo Travel, Personal Finance",
    },
    {
      key: "creator_monetization",
      label: "How They Earn Money",
      type: "select",
      options: [
        { value: "", label: "Select Main Income Source" },
        { value: "Brand Sponsorships & UGC", label: "Brand Deals & Sponsored Posts" },
        { value: "Affiliate Links (LTK, Amazon, ShopMy)", label: "Affiliate Links (Amazon, LTK, etc.)" },
        { value: "Paid Community / Patreon / Substack", label: "Paid Memberships (Patreon, Substack)" },
        { value: "Own Digital or Physical Products", label: "Own Products or Merch" },
        { value: "Platform Ad Share / Creator Fund", label: "Platform Ad Payouts" },
      ],
    },
    {
      key: "creator_formats",
      label: "Content Types They Make",
      type: "text",
      placeholder: "e.g. 30-second voiceover Reels, product unboxings, 10-minute YouTube videos, photo carousels",
    },
    {
      key: "creator_media_kit",
      label: "Audience Details & Past Brand Work",
      type: "text",
      placeholder: "e.g. Mostly US/UK women ages 22–34, 18k average video views, past partnerships with Logitech & Notion",
    },
  ],
  "E-commerce or retail": [
    {
      key: "ecom_category",
      label: "Best-Selling Products",
      type: "text",
      placeholder: "e.g. Refillable skincare — #1 seller is the 3-Step Skin Repair Bundle ($68)",
    },
    {
      key: "ecom_channels",
      label: "Where They Sell",
      type: "select",
      options: [
        { value: "", label: "Select Main Sales Channel" },
        { value: "Direct-to-Consumer (Shopify / WooCommerce)", label: "Own Website (Shopify, WooCommerce)" },
        { value: "Omnichannel (Online + Brick & Mortar)", label: "Online + Physical Store" },
        { value: "Marketplace-Led (Amazon / Etsy + DTC)", label: "Marketplaces (Amazon, Etsy) + Website" },
        { value: "Social Commerce (TikTok Shop / IG Shop)", label: "Social Shops (TikTok, Instagram)" },
      ],
    },
    {
      key: "ecom_aov_repeat",
      label: "Typical Order Amount & Repeat Buyers",
      type: "text",
      placeholder: "e.g. $58 average order, customers reorder every 2 months, 15%-off monthly subscription option",
    },
    {
      key: "ecom_fulfillment",
      label: "Stock & Major Sale Seasons",
      type: "text",
      placeholder: "e.g. Made in small batches, ships in 2 days, biggest sales on Mother's Day and Black Friday",
    },
  ],
  "Professional services": [
    {
      key: "pro_practice_area",
      label: "Type of Service",
      type: "text",
      placeholder: "e.g. Accounting & Tax Planning, Law Firm, Architecture Studio, Marketing Agency, IT Support",
    },
    {
      key: "pro_market_focus",
      label: "Who They Serve",
      type: "select",
      options: [
        { value: "", label: "Select Client Type" },
        { value: "B2B (Small & Midsize Businesses)", label: "Small & Medium Businesses" },
        { value: "B2B (Mid-Market & Enterprise)", label: "Large Companies" },
        { value: "B2C (Individuals & Families)", label: "Individuals & Families" },
        { value: "Both B2B and B2C", label: "Both Businesses and Individuals" },
      ],
    },
    {
      key: "pro_sales_cycle",
      label: "Typical Project Price & Decision Time",
      type: "text",
      placeholder: "e.g. $2,500/month retainer or $15k project; clients usually take 3–6 weeks to decide",
    },
    {
      key: "pro_compliance_trust",
      label: "Industry Rules & Proof of Expertise",
      type: "textarea",
      placeholder: "e.g. Legal or financial disclaimer rules; proof includes client case studies, awards, and licenses.",
    },
  ],
  "Health and wellness": [
    {
      key: "health_modality",
      label: "Type of Care or Fitness",
      type: "text",
      placeholder: "e.g. Reformer Pilates Studio, Physical Therapy, Nutritionist, Counseling, Chiropractic",
    },
    {
      key: "health_delivery",
      label: "How Clients Visit",
      type: "select",
      options: [
        { value: "", label: "Select Visit Format" },
        { value: "In-Person Local Studio / Clinic", label: "In-Person Studio or Clinic" },
        { value: "Virtual / Telehealth", label: "Online / Virtual" },
        { value: "Hybrid (In-Person + Online)", label: "Both In-Person and Online" },
        { value: "Digital Membership / Wellness App", label: "App or Online Membership" },
      ],
    },
    {
      key: "health_retention",
      label: "Memberships & Intro Offers",
      type: "text",
      placeholder: "e.g. $79 2-Week Intro Trial -> $249/month unlimited membership",
    },
    {
      key: "health_compliance",
      label: "Privacy & Health Claim Rules",
      type: "textarea",
      placeholder: "e.g. Written client permission needed for photos; avoid medical cure promises or weight-loss claims.",
    },
  ],
  "Beauty and personal care": [
    {
      key: "beauty_segment",
      label: "Type of Beauty Business",
      type: "select",
      options: [
        { value: "", label: "Select Business Type" },
        { value: "Salon / Studio / Spa Services", label: "Hair Salon, Studio, or Spa" },
        { value: "Med-Spa & Aesthetic Treatments", label: "Med-Spa & Skin Treatments" },
        { value: "Skincare / Cosmetics / Haircare Product Brand", label: "Skincare, Makeup, or Hair Product Brand" },
        { value: "Independent Stylist / Artist", label: "Independent Stylist or Artist" },
      ],
    },
    {
      key: "beauty_booking_platform",
      label: "Booking or Store System",
      type: "text",
      placeholder: "e.g. Boulevard, GlossGenius, Vagaro, Fresha, Square, or Shopify",
    },
    {
      key: "beauty_hero_treatments",
      label: "Most Popular Services or Products",
      type: "text",
      placeholder: "e.g. Lived-In Hair Color ($320), 60-Minute Japanese Head Spa ($165), Bridal Packages",
    },
    {
      key: "beauty_visual_assets",
      label: "Before & After Photos or Videos",
      type: "text",
      placeholder: "e.g. Hair transformation videos, relaxing scalp-wash clips, client reviews",
    },
  ],
  "Food and hospitality": [
    {
      key: "food_concept",
      label: "Type of Food Business",
      type: "select",
      options: [
        { value: "", label: "Select Food Business Type" },
        { value: "Restaurant / Bar / Lounge", label: "Restaurant, Bar, or Lounge" },
        { value: "Cafe / Bakery / Quick-Service", label: "Cafe, Bakery, or Quick Counter" },
        { value: "CPG Packaged Food or Beverage Brand", label: "Packaged Food or Drink Brand" },
        { value: "Hotel / Boutique Stay / Event Venue", label: "Hotel, Stay, or Event Space" },
        { value: "Catering / Private Chef / Food Truck", label: "Catering, Private Chef, or Food Truck" },
      ],
    },
    {
      key: "food_radius",
      label: "Neighborhood & Customer Reach",
      type: "text",
      placeholder: "e.g. Downtown dining district — walk-in lunch crowd and 20-minute drive for weekend dinner",
    },
    {
      key: "food_platforms",
      label: "Booking, Delivery & Review Sites",
      type: "text",
      placeholder: "e.g. Resy, OpenTable, Toast online ordering, DoorDash, Google Maps (4.8 stars)",
    },
    {
      key: "food_promos",
      label: "Busiest Times, Specials & Events",
      type: "text",
      placeholder: "e.g. Weekday $12 Happy Hour (4–6 PM), weekend brunch, 24-seat Private Dining Room",
    },
  ],
  "Real estate": [
    {
      key: "re_specialty",
      label: "Type of Real Estate",
      type: "select",
      options: [
        { value: "", label: "Select Focus" },
        { value: "Residential Agent / Team", label: "Home Buying & Selling (Agent or Team)" },
        { value: "Luxury & Estates", label: "Luxury Homes & Estates" },
        { value: "Commercial Real Estate", label: "Commercial Properties" },
        { value: "Property Management / Long-Term Rentals", label: "Property Management & Rentals" },
        { value: "Short-Term Rentals / Boutique Stays", label: "Vacation & Short-Term Rentals" },
      ],
    },
    {
      key: "re_territory",
      label: "Areas & Neighborhoods Covered",
      type: "text",
      placeholder: "e.g. Franklin, Brentwood, and East Nashville ($600k–$1.5M homes)",
    },
    {
      key: "re_market_climate",
      label: "Current Local Market",
      type: "text",
      placeholder: "e.g. Low home supply, buyers asking for seller credits, strong out-of-state demand",
    },
    {
      key: "re_lead_sources",
      label: "How Clients Find Them Now",
      type: "text",
      placeholder: "e.g. Past client referrals, Relocation Guide PDF, neighborhood video tours, open houses",
    },
  ],
  "Education and training": [
    {
      key: "edu_format",
      label: "How Classes Work",
      type: "select",
      options: [
        { value: "", label: "Select Class Format" },
        { value: "Live Cohort / Bootcamp", label: "Live Group Class or Bootcamp" },
        { value: "Self-Paced Online Course / Academy", label: "Self-Paced Online Course" },
        { value: "K-12 / Higher Ed / Brick-and-Mortar School", label: "In-Person School or Campus" },
        { value: "Corporate Training & L&D", label: "Company Training" },
        { value: "1:1 or Small-Group Tutoring / Test Prep", label: "1-on-1 or Small-Group Tutoring" },
      ],
    },
    {
      key: "edu_enrollment",
      label: "When Students Can Join",
      type: "select",
      options: [
        { value: "", label: "Select Schedule" },
        { value: "Evergreen / Open Enrollment", label: "Anytime (Open All Year)" },
        { value: "Cohort Launches (Fixed Intake Windows)", label: "Set Start Dates" },
        { value: "Academic / Semester Calendar", label: "School Year / Semester Schedule" },
        { value: "B2B Institutional Licensing", label: "Company Contracts" },
      ],
    },
    {
      key: "edu_decision_maker",
      label: "Who Pays vs. Who Attends",
      type: "text",
      placeholder: "e.g. Adults paying for themselves (70%) + employers covering tuition (30%), or parents paying for kids",
    },
    {
      key: "edu_outcomes",
      label: "Student Results & Certificates",
      type: "text",
      placeholder: "e.g. 2 finished portfolio projects, certificate of completion, 30+ student video reviews",
    },
  ],
  "Technology or software": [
    {
      key: "tech_category",
      label: "Type of Product",
      type: "select",
      options: [
        { value: "", label: "Select Product Type" },
        { value: "B2B SaaS", label: "Business Software" },
        { value: "B2C Mobile or Web App", label: "Consumer Mobile or Web App" },
        { value: "AI / Workflow Automation Tool", label: "AI or Automation Tool" },
        { value: "Developer Tool / API / Infrastructure", label: "Developer Tool" },
        { value: "Hardware / Connected Device", label: "Hardware or Smart Device" },
      ],
    },
    {
      key: "tech_growth_motion",
      label: "How Customers Sign Up",
      type: "select",
      options: [
        { value: "", label: "Select Sign-Up Flow" },
        { value: "Product-Led (Freemium / Self-Serve Trial)", label: "Free Plan or Self-Serve Trial" },
        { value: "Sales-Led (Demo Request / Outbound)", label: "Book a Sales Demo" },
        { value: "Hybrid (Self-Serve + Sales-Assisted)", label: "Both Free Trial and Sales Demo" },
        { value: "Pre-Launch Waitlist / Early Access Beta", label: "Waitlist / Early Access" },
      ],
    },
    {
      key: "tech_buyer_persona",
      label: "Who Buys It & Who Uses It",
      type: "text",
      placeholder: "e.g. Purchased by Agency Owners / Operations Managers; used daily by Project Managers",
    },
    {
      key: "tech_integrations",
      label: "Connected Apps & Setup Steps",
      type: "text",
      placeholder: "e.g. Connects with HubSpot, Notion & Slack; users get set up in under 10 minutes",
    },
  ],
  "Nonprofit or community": [
    {
      key: "nonprofit_mission",
      label: "Cause & Mission",
      type: "text",
      placeholder: "e.g. Free after-school reading tutors and take-home books for elementary students",
    },
    {
      key: "nonprofit_primary_ask",
      label: "Main Support Needed",
      type: "select",
      options: [
        { value: "", label: "Select Main Goal" },
        { value: "Individual Monthly / One-Time Donations", label: "Monthly & One-Time Donations" },
        { value: "Major Gifts, Grants & Corporate Sponsors", label: "Major Donors, Grants & Business Sponsors" },
        { value: "Volunteer Recruitment & Chapter Growth", label: "Volunteer Sign-Ups" },
        { value: "Fundraising Gala / Event Registration", label: "Fundraising Event Tickets" },
        { value: "Public Awareness & Policy Advocacy", label: "Community Awareness & Advocacy" },
      ],
    },
    {
      key: "nonprofit_calendar",
      label: "Fundraising Events & Dates",
      type: "text",
      placeholder: "e.g. GivingTuesday ($20k matching gift), Year-End Drive (Dec 1–31), Spring Benefit Dinner",
    },
    {
      key: "nonprofit_impact_proof",
      label: "Real-World Impact & Stories",
      type: "text",
      placeholder: "e.g. $35/month provides 1 child's books + tutoring; 480 students helped this year",
    },
  ],
  "Arts and entertainment": [
    {
      key: "arts_medium",
      label: "Type of Art or Entertainment",
      type: "select",
      options: [
        { value: "", label: "Select Creative Field" },
        { value: "Visual Artist / Illustrator / Gallery", label: "Visual Artist, Illustrator, or Gallery" },
        { value: "Musician / Band / Record Label", label: "Musician, Band, or Label" },
        { value: "Filmmaker / Production Studio", label: "Filmmaker or Video Studio" },
        { value: "Live Venue / Theater / Festival", label: "Live Venue, Theater, or Festival" },
        { value: "Podcast / Digital Show", label: "Podcast or Online Show" },
        { value: "Indie Game / Interactive Media", label: "Indie Game or Interactive Art" },
      ],
    },
    {
      key: "arts_releases",
      label: "Upcoming Releases or Shows",
      type: "text",
      placeholder: "e.g. New single Oct 25, 5-song EP & vinyl release Nov 22, 5-city December tour",
    },
    {
      key: "arts_monetization",
      label: "Where Fans Buy Tickets or Merch",
      type: "text",
      placeholder: "e.g. Spotify/Apple pre-saves, Bandcamp vinyl, Eventbrite tickets, Patreon ($8/mo)",
    },
  ],
  "Local services": [
    {
      key: "local_trade",
      label: "Type of Local Service",
      type: "text",
      placeholder: "e.g. Patio Building & Landscaping, Plumbing/HVAC, House Cleaning, Auto Detailing, Pet Grooming",
    },
    {
      key: "local_service_area",
      label: "Service Area",
      type: "text",
      placeholder: "e.g. Charlotte and surrounding suburbs within 25 miles",
    },
    {
      key: "local_demand_type",
      label: "How Jobs Are Booked",
      type: "select",
      options: [
        { value: "", label: "Select Booking Type" },
        { value: "Recurring Maintenance / Service Plans", label: "Ongoing Monthly / Seasonal Plans" },
        { value: "Urgent / Emergency Callouts", label: "Urgent / Same-Day Repairs" },
        { value: "Seasonal / Custom Project Quotes", label: "Custom Project Quotes" },
        { value: "Routine Appointments", label: "Regular Appointments" },
      ],
    },
    {
      key: "local_gbp_reviews",
      label: "Google Reviews & Local Reputation",
      type: "text",
      placeholder: "e.g. 4.9 stars (115 Google reviews), Nextdoor Favorite, 30+ before-and-after job albums",
    },
  ],
  Other: [
    {
      key: "other_model",
      label: "How the Business Makes Money",
      type: "text",
      placeholder: "e.g. Direct online sales plus monthly repeat subscriptions",
    },
    {
      key: "other_cycle",
      label: "How Customers Decide to Buy",
      type: "text",
      placeholder: "e.g. Customers find them on social or search, request a sample, and buy within 2–4 weeks",
    },
    {
      key: "other_nuances",
      label: "Special Industry Rules or Seasons",
      type: "textarea",
      placeholder: "e.g. Busy spring/fall seasons, trade shows, or local licensing rules.",
    },
  ],
};

export function normalizeDraft(raw: Partial<Draft> | null | undefined): Draft {
  const s = (val: unknown, fallback = ""): string => (typeof val === "string" ? val : fallback);
  if (!raw || typeof raw !== "object") {
    return { ...emptyDraft, mainSource: "", details: {}, profiles: [], findings: [] };
  }
  const details: Record<string, string> = {};
  if (raw.details && typeof raw.details === "object" && !Array.isArray(raw.details)) {
    for (const [k, v] of Object.entries(raw.details)) {
      if (typeof v === "string") details[k] = v;
    }
  }
  const profiles: Profile[] = Array.isArray(raw.profiles)
    ? raw.profiles.map(p => ({
        id: typeof p?.id === "string" && p.id ? p.id : crypto.randomUUID(),
        platform: s(p?.platform),
        url: s(p?.url),
        status: s(p?.status),
        followers: s(p?.followers),
        cadence: s(p?.cadence),
        notes: s(p?.notes),
      }))
    : [];
  const findings: Finding[] = Array.isArray(raw.findings)
    ? raw.findings.map(f => ({
        id: typeof f?.id === "string" && f.id ? f.id : crypto.randomUUID(),
        source: s(f?.source),
        date: s(f?.date),
        observation: s(f?.observation),
        status: s(f?.status),
        category: s(f?.category),
      }))
    : [];
  return {
    mode: s(raw.mode, "lead") || "lead",
    name: s(raw.name),
    business: s(raw.business),
    website: s(raw.website),
    about: s(raw.about),
    audience: s(raw.audience),
    goals: s(raw.goals),
    research: s(raw.research),
    source: s(raw.source),
    strategy: s(raw.strategy),
    businessType: s(raw.businessType),
    businessTypeOther: s(raw.businessTypeOther),
    offerings: s(raw.offerings),
    challenges: s(raw.challenges),
    competitors: s(raw.competitors),
    conversionGoal: s(raw.conversionGoal),
    mainSource: s(raw.mainSource),
    location: s(raw.location),
    brandVoice: s(raw.brandVoice),
    differentiator: s(raw.differentiator),
    currentAssets: s(raw.currentAssets),
    videoCapacity: s(raw.videoCapacity),
    techStack: s(raw.techStack),
    budgetTier: s(raw.budgetTier),
    timeline: s(raw.timeline),
    constraints: s(raw.constraints),
    leadTrigger: s(raw.leadTrigger),
    quickWin: s(raw.quickWin),
    activePackage: s(raw.activePackage),
    campaignHistory: s(raw.campaignHistory),
    baselineKpis: s(raw.baselineKpis),
    details,
    profiles,
    findings,
  };
}

export function getActiveBusinessFields(businessType: string): DynamicFieldSpec[] {
  if (!businessType) return [];
  return businessTypeFields[businessType] ?? businessTypeFields.Other ?? [];
}
