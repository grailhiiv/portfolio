## Run

Requires Node.js 20.9 or newer. In PowerShell:

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://127.0.0.1:3000. For a production server:

```powershell
npm.cmd run build
npm.cmd start
```

## Pages and editing

- `src/app/page.tsx`: Home
- `src/app/about/page.tsx`: About
- `src/app/work/page.tsx`: Work and eight-image exploration gallery
- `src/app/work/{4fett,kiwi,togevent,bounty-hunters}/page.tsx`: four complete case studies
- `src/components/header.tsx`: navigation, live Philippine clock (Asia/Manila), scroll-direction header
- `src/components/footer.tsx`: contact information
- `src/components/animation.tsx`: letter animation and scroll reveals
- `src/components/gallery.tsx`: image viewer with arrow keys, Escape, focus containment and focus restoration
- `src/components/cursor.tsx`: pointer effect
- `src/components/service-icon.tsx` and `src/data/`: four Lottie icons
- `public/images/` and `public/fonts/`: local reference assets
- `src/app/reference.css`: the reference's compiled Tailwind stylesheet, formatted for editing
- `src/app/globals.css`: reconstruction-specific styles

Stack: Next.js App Router, React, TypeScript, Motion, Lottie, and Next.js image optimization. The captured Tailwind stylesheet is included directly; a Tailwind compilation pipeline is not needed for this baseline. Add new CSS rules in `globals.css` when adding utility classes that are not in the captured stylesheet.

`public/asset-manifest.json` records the source URLs and local files for the 78 downloaded image/font assets. The four service animation JSON files were recovered from the public page's serialized data. Links to external project sites, LinkedIn, and the original email address retain the reference's destinations.

## Verification

```powershell
npm.cmd run typecheck
npm.cmd run build
python scripts/audit-regressions.py
python scripts/verify-recreation.py
```

The last command requires the local server plus Python with `requests` and `beautifulsoup4`. It checks every route, local asset responses, reference text and image parity, and internal navigation destinations. Captured reference pages are included under `reference/`. Reference and QA files are tracked along with the project source. `scripts/inspect-reference.py` and the other acquisition scripts document how the public reference was inspected; they are not runtime dependencies.

The project remains local. Search indexing is disabled for this reference-copy baseline. The existing `.agents/`, `.codex/`, and Git history were retained; previous files deleted by the user were not restored.

## Audit fixes

See `AUDIT.md` for the October 20 audit, responsive matrix, evidence, and remaining design concerns. The audit preserves the visible reference layout while adding readable server HTML, accessible headings/current navigation, a reliable cursor fallback, corrected responsive image delivery, and a wider phone image viewer. The Contact link now updates its fragment and keyboard focus, and its animation cancels on user input or route changes.

Responsive image hints are centralized in `src/lib/image-sizes.ts`. Entrance animations enhance visible HTML through the Web Animations API; JavaScript failures no longer leave the page transparent. The acquisition scripts are archival helpers and are not run by development or production builds; regenerating the original snapshot would overwrite subsequent source edits.
