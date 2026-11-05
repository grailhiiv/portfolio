## Run

Use Node.js 24 or newer for the application and the verification commands below. In PowerShell:

```powershell
npm.cmd install
npm.cmd run dev
```

Open [the local portfolio](http://127.0.0.1:3000). For a production server:

```powershell
npm.cmd run build
npm.cmd start
```

## Pages and editing

- `src/app/pricing/page.tsx`: Pricing
- `src/data/public-prices.ts`: public starting prices shared by the pricing page and matching invoice catalogue items
- `src/app/invoice/catalogue.ts`: invoice catalogue items, including internal-only prices and descriptions
- `src/app/page.tsx`: Home
- `src/app/about/page.tsx`: About
- `src/app/strategy/`: authenticated strategy workspace, cloud sync, AI generation, and PDF export
- `src/app/invoice/`: authenticated invoice workspace, catalogue, calculation, and PDF preview
- `src/app/login/`: sign-in for the internal workspaces
- `src/app/work/page.tsx`: Work, featuring Daniel G. Miller, Melissa Castro, Caroline Montague, and Atlas Rose
- `src/app/work/{daniel,melissa,caroline,atlas}/page.tsx`: the four case studies
- `src/components/header.tsx`: navigation, live Philippine clock (Asia/Manila), scroll-direction header
- `src/components/footer.tsx`: contact information
- `src/components/animation.tsx`: letter animation and scroll reveals
- `src/components/featured-work.tsx`: shared Home and Work cards with hover video previews
- `src/components/work-showcase.tsx`: shared two-column case-study media showcase
- `src/components/cursor.tsx`: pointer effect
- `src/components/service-icon.tsx` and `src/data/`: four Lottie icons
- `public/images/`, `public/videos/`, and `public/fonts/`: local portfolio assets
- `src/app/global.css`: fonts, theme, utilities, shared styles, case studies, and the author showcases

Stack: Next.js App Router, React, TypeScript, Motion, Lottie, Supabase, the OpenAI Responses API, and PDF libraries.

## Styles

`src/app/global.css` is imported by the root layout and contains site-wide styles, utilities, and public-page styles. The strategy and invoice workspaces also import `src/app/strategy/strategy.css` and `src/app/invoice/invoice.css`, respectively. Case-study and showcase classes use prefixes to avoid global name collisions. A Tailwind compilation pipeline is not needed.

When separating page-specific styles from `global.css`, preserve the cascade and check affected pages at desktop and mobile sizes. Pricing styles could be extracted first; a separate pricing stylesheet has not yet been created.

## Pricing and internal workspaces

Update the eight public starting prices in `src/data/public-prices.ts`. The pricing page and matching invoice catalogue entries use these values; catalogue items that are not listed publicly keep their own prices in `src/app/invoice/catalogue.ts`. Existing saved invoices retain their recorded amounts.

The `/strategy` and `/invoice` pages require an authorized Supabase sign-in. Strategy records and screenshots use Supabase, with browser backup for strategy records. Invoice history is stored in the current browser. Strategy AI generation uses an OpenAI API key configured through the workspace or server environment. The source audit analyzes manually uploaded screenshots associated with the supplied source links; it does not crawl or capture the linked pages. At least one screenshot is required. Review the findings and save the audit to retain its screenshots privately, then generate a separate proposal or strategy. Scores are preliminary and based only on assessed categories; an overall score requires at least 80% coverage.

`public/asset-manifest.json` inventories current public files with byte sizes and SHA-256 hashes. Known original source URLs are retained as attribution; verification does not download from those sources. After intentionally adding, changing, or removing public files, run `python scripts/update-asset-manifest.py` and review the manifest diff.

## Verification

```powershell
npm.cmd run typecheck
npm.cmd run build
node --test scripts/invoice-model.test.mjs scripts/strategy-autofill-response.test.mjs scripts/public-prices.test.mjs scripts/strategy-source-links.test.mjs scripts/strategy-audit-scoring.test.mjs scripts/strategy-pagespeed.test.mjs
python scripts/audit-regressions.py
python scripts/verify-site.py
```

The Python verification scripts require a running local server and `requests` plus `beautifulsoup4` (`python -m pip install -r scripts/requirements.txt`). Both accept an optional base URL, for example `python scripts/verify-site.py http://127.0.0.1:3000`, and resolve project paths relative to the script location.

- `audit-regressions.py` checks server-rendered headings, visible HTML, current navigation, and responsive image hints.
- `verify-site.py` discovers current static routes from `src/app`, checks internal links and fragments, image markup and source files, served scripts/styles/images, and every public file against its recorded hash and served bytes. Dynamic routes require concrete verification URLs before this checker can support them.
- `audit-no-script-preview.py` provides an optional script-blocked local preview on port 3001.
The maintained source in `src/` and assets in `public/` are the editing sources. Search indexing remains disabled.

## Audit fixes

See `AUDIT.md` for current verification scope. The Contact link updates its fragment and keyboard focus, and its animation cancels on user input or route changes.

Responsive image hints are centralized in `src/lib/image-sizes.ts`. Entrance animations enhance visible HTML through the Web Animations API; JavaScript failures no longer leave the page transparent.
