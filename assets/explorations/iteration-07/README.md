# Iteration 07 — D09 inner-face shading only

The operator clarified the desired edit with a close-up and quick sketch: retain the original D09 seam shape/width and all exterior shading; shade the already-black inward face of the left half from front to back, and add the short white lower/base line shown in the example. The wordmark remains the exact B3-W05 / Focus, placed beside or below the mark. Prior iteration-06 geometry/lighting attempts are rejected.

| ID | Inner-face falloff | Focus placement |
|----|--------------------|-----------------|
| G01 | Subtle fill | Right |
| G02 | Linear fade | Below |
| G03 | Eased fade | Right |
| G04 | Fuller face | Below |
| G05 | Balanced fill | Right |
| G06 | Quick recession | Below |
| G07 | Minimal lift | Right |
| G08 | Long fade | Below |
| G09 | Small-size fill | Right |

## Source preservation
Built-in Codex ImageGen supplied the inner grayscale fills; PROMPT.txt is the exact request. generated-seam-study.png preserves the native output. The final sheet does not use the generator's redrawn exteriors. review.html keeps the original D09 raster as an underlay and clips the generated shading to the existing seam. A source-luminance mask protects lit border pixels. The short white base line is a precise local overlay tracing the user's example; it does not move the existing endpoints or widen the seam. Focus is a viewport of the original wordmark raster. Original reference sheets and the user sketch are byte-preserved.

The original D09 raster was enlarged for review; it has not been vectorized. These remain exploratory raster compositions, not final brand exports. The nine shading alternatives are intentionally subtle because the lighting direction and exterior are fixed.

## Validation
contact-sheet.png is a DPR-1 render of review.html. Every cell includes a 224px detail and measured 128/64/32 probes; review-check.json records dimensions. candidates/G01–G09 are enlarged details. preservation-check.json compares each 900px detail with the original D09 reference: zero changed pixels outside the permitted seam/base-line area. The small probes retain the original graph and spherical nodes; no XS simplification has been ratified.

## Status
Awaiting operator visual review. The selected D09 + Focus direction is recorded in [DEC:d09-focus-baseline](../../../.salvor/decisions/2026-10-09-d09-focus-baseline.md); the specific gradient remains unratified. Phase-two exports/social artwork have not started. No commit or push.
