# assets — SalvorLabs identity

Build: **ASSETS:01** — source: `../VERSION.md`.

Raster/vector artwork and Markdown. The logo-only pack is ratified and exported; further lockup and social packs follow.

## Current files

- `BRIEF.md` — canonical user requests and phase boundaries.
- `BRAND_GUIDE.md` — brief usage guide; typography status, monochrome colors and consistent scaling.
- `masters/` — preserved G08 and Focus artwork, SVG traces and provenance.
- `logo/` — four treatments, each with seven PNG/SVG pairs; manifest and verification.
- `reviews/logo-set-01/review.html` — exact-size review with PNG/SVG switch.
- `EXPORT_SETS.json` — common ladder/treatments and prepared horizontal, vertical and wordmark-only sets.
- `social-media/README.md` — platform artwork; current X banner pack and export provenance.
- `tools/README.md` — repeatable deterministic exports and tracing.
- Governing rationale: [DEC:d09-focus-baseline](../.salvor/decisions/2026-10-09-d09-focus-baseline.md).

## Source history

`references/` preserves the supplied inspiration. `explorations/iteration-01/` through `iteration-10/` preserve the full sequence. Iteration-04 owns the exact Focus raster; iteration-05 owns original D09; iteration-07 owns the approved G08 long fade; iteration-09 remains historical exploration. RGB studies, iteration-06 seam drafts, iteration-08 irregular outline and iteration-10 sparse network are not production masters. `selections/d09-focus/` preserves the restored original comparison.

## Workflow and validation

Preserve sources and stable IDs. The same full G08 knowledge graph is used at all seven sizes, including favicons. The canonical decision owns this selection; the brand guide owns concise usage. The wordmark's exact font is unverified; preserve its artwork. Future lockup spacing/scale remains pending; approved scene/social derivatives are routed below.

Check PNG dimensions, alpha/background compositing, matching SVG paths/viewBoxes, source fidelity and actual-size appearance. SVGs are editable traces, not original analytic 3D geometry or pixel-identical small rasterizations. Domain facts live in `../.salvor/DOMAIN_REF.md`; operations in `../.salvor/INFRA.md`. The local website preview is routed by `../site/CLAUDE.md`.

Canonical assets are approved for dev integration on 2026-10-16. Iteration-07 review references deduplicated, byte-identical local image sources rather than repeated embedded payloads. The future site mock must begin on a separate branch created from dev after the asset integration.

`products/salvor/` preserves byte-identical black/white regular Salvor product PNG and SVG marks with provenance; the source product checkout is read-only for this work.

`hero/l09/SOURCES.json` owns the canonical L09 scene artwork approved on 2026-10-20. Its 4096×2654 transparent PNG is byte-identical to contained-glow04 and has a verified 5px clear border. The corrected two-half cutout logo, shorter/dimmer warm cones, restrained ribbons and clean lower glow are preserved. Native images, prompt, export and previous studies remain in `hero/l09/repair-04/` and earlier folders. This scene artwork does not replace the monochrome G08/Focus identity.

The landscape hero is composed from that exact PNG, not a regenerated logo. Its clean plate, composition, previous lock and preservation evidence are in `../site/source/dusk-flow-06/`; current sharing derivatives are owned by `../site/source/hero-lock.json`. Main review: `http://127.0.0.1:64613/?cut=dusk-flow-08`; artifact review: `/review/dusk-flow-08/`. Earlier art is retained. Repair approval is complete; Git integration and public publication have not been performed in this artwork update.

`social-media/x/banner/` owns the art-only X header at1500×500 PNG/JPEG and3000×1000 PNG, with matching editable raster-composition SVGs, platform references, layout guide, hashes and export recipe. It uses the canonical artwork without regeneration and does not modify the website/social-card lock.
