# Current portfolio verification

The current portfolio contains Home, About, Work, and the Daniel G. Miller, Melissa Castro, Caroline Montague, and Atlas Rose case studies. Home and Work render the same shared featured cards and hover previews. Case studies share their layout and scrolling showcase.

## Automated checks

Run with the local server available:

```powershell
npm.cmd run typecheck
npm.cmd run build
python scripts/audit-regressions.py
python scripts/verify-site.py
```

The regression audit discovers current routes and checks readable server HTML, main headings, active navigation, and responsive image hints. Site verification checks internal destinations, image and video markup, rendered asset URLs, and the current public-file inventory against SHA-256 and served bytes.

## Browser checks

Check Home and Work at phone, tablet, and desktop widths. Both should feature Daniel, Melissa, Caroline, and Atlas in that order, with the same images, captions, destinations, and hover videos. Check that the case-study showcases retain both columns, avoid horizontal overflow, and honor reduced motion. On touch screens, tapping a featured card must open its case study.

Build and HTTP checks do not establish full accessibility conformance or externally verify the supplied campaign results.
