# Portfolio audit — October 20, 2026

The local Next.js recreation was reviewed and repaired. All seven routes passed the checked mobile, tablet, desktop, and landscape layouts. The reference palette is preserved at the user's explicit request; this is not a claim of full WCAG conformance.

## Findings repaired

| Priority | Finding and evidence | Repair |
| --- | --- | --- |
| P1 | Server-rendered entrance styles hid content until hydration. The initial HTTP regression found 61 transparent content elements on Home, 90 on Work, and transparent content on every other route. | `src/components/animation.tsx`: visible semantic HTML first, entrance animations as a progressive enhancement. With scripts blocked by CSP, the live browser showed readable content and zero transparent main-content elements. |
| P2 | The stylesheet hid the native cursor on every fine-pointer device before the custom cursor was ready. | `src/components/cursor.tsx`, `src/app/globals.css`: hide the system cursor only after a real pointer event activates the custom pointer. Keyboard navigation, pointer changes, blur, and forced-colour mode have fallbacks. The script-blocked browser retained `cursor: auto`. |
| P2 | About had no main heading. Animated headings exposed individual letters to the accessibility tree, section labels used paragraphs, and navigation omitted current-page semantics. | Add a visually hidden About h1, natural-language accessible names for animated headings, consistent h2/h3 structure, and `aria-current` for the current route or Work section. No visible copy was rewritten. |
| P2 | Responsive image hints did not match the actual layout: the full-width About hero advertised 512px/50vw, Work cards advertised 100vw, and mobile gallery thumbnails advertised desktop-scale widths. | `src/lib/image-sizes.ts`: account for the 1440px content cap, mobile gutters, and each responsive grid. Remove unnecessary Work-card preloads and preload the local primary font. Image files and image order are unchanged. |
| P2 | Phone image viewers spent excessive width on side margins. | On portrait phones, widen the image stage and move previous/next controls into a bottom row. Provide at least 44×44px controls and safe-area spacing. Twelve viewer sizes passed control-boundary checks. |
| P2 | Contact scrolling suppressed normal fragment/focus behavior and its animation lacked input/route cancellation. | Update `#contact` and move focus to the footer after scrolling. The next Tab reaches its email link. Cancel scrolling on user input or route change; preserve modified-click behavior. |
| P3 | Focus treatment and modal scroll handling were inconsistent. | Add visible keyboard focus styles and contain modal overscroll. Keep the native dialog, Escape handling, arrow navigation, and opener focus restoration. |

## Responsive verification

Seven routes × twelve viewport configurations = **84 checks**. No horizontal document overflow, clipped visible paragraph/hero/navigation text, broken loaded images, missing main heading, or missing current-navigation indication was found in the final sweep.

| Coverage | Viewports |
| --- | --- |
| Phones | 320×568, 360×740, 390×844 |
| Intermediate / breakpoint edges | 640×900, 767×900 |
| Tablets | 768×1024, 820×1180, 1024×768 |
| Landscape | 844×390 |
| Desktops | 1280×800, 1440×900, 1920×1080 |

The main visible layout and supplied content remain based on the reference. The only deliberately clipped text in the sweep was the screen-reader-only About heading, which was excluded from visible-text clipping assertions.

Additional browser checks covered opening both galleries, image navigation and wraparound, Escape, opener-focus restoration, modal body-scroll locking, Contact URL/focus behavior, and readable content with all page scripts blocked.

Evidence retained locally:

- `qa/responsive-audit.json`: before/after viewport results
- `qa/gallery-audit.json`: twelve lightbox configurations
- `qa/audit-mobile.jpg`, `qa/audit-tablet.jpg`, `qa/audit-desktop.jpg`
- `qa/gallery-mobile-audit.jpg`, `qa/script-blocked.jpg`

## Automated checks

- `npm.cmd run build`: passed; all seven pages statically generated.
- `npm.cmd run typecheck`: passed.
- `python scripts/audit-regressions.py`: failed on the original defects, passed after repair.
- `python scripts/verify-recreation.py`: seven routes, reference copy/image-order parity, valid internal destinations, and all 78 local image/font assets passed.
- Production server on loopback port 3002: all seven routes returned HTTP 200 and the HTTP audit regressions passed. The temporary production process was stopped after checking.
- Next.js MCP: no compilation issues, configuration errors, or browser session errors.
- `npm.cmd audit` and `npm.cmd audit --omit=dev`: zero reported vulnerabilities at audit time.

The normal development preview remains at `http://127.0.0.1:3000/`. Temporary audit servers were not deployed or exposed publicly.

## Remaining findings and verification limits

1. **P2 — Reference colour contrast, intentionally retained.** `#b2b2b2` against white measures approximately **2.12:1**, below the 3:1 requirement for large text. Other pale copy/navigation and the lightbox counter also warrant a contrast pass if the palette is later allowed to change. The user explicitly chose to preserve the reference colours during this audit.
2. **P2 — Continuous-animation pause affordance.** The logo marquee supports hover pause and reduced motion; decorative icons honour reduced motion. The exact-reference interface still lacks a dedicated touch-accessible pause control for all looping decoration. No new visible control was added to the reference layout.
3. Browser checks used the in-app Chromium browser with viewport overrides. Physical phones/tablets, mobile browser chrome, Safari, Firefox, screen-reader speech output, forced-colour mode, and an operating-system reduced-motion toggle were not independently exercised. Their relevant code paths were reviewed; this is not cross-browser or assistive-technology certification.
4. No Lighthouse score or field Core Web Vitals is claimed. Responsive image delivery and font loading were corrected from verified markup/layout mismatches, not from an invented performance score.
5. Public source acquisition scripts are archival helpers. Regenerating snapshot source would overwrite later edits, including audit fixes; development and production builds do not execute those helpers.

Review checklist: [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md). The audit kept the user's exact-reference design constraints where they conflict with optional stylistic advice.
