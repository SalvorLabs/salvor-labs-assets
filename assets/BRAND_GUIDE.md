# SalvorLabs — light brand guide

Current identity: a split spherical brain with a knowledge graph, paired with the B3-W05 **Focus** wordmark. Approved regular mark: **G08 / long fade**.

## Logo

The same **G08 full knowledge graph** is used at **512, 256, 128, 64, 32, 16 and 8px**, including favicons. All sizes preserve the graph connections, nodes, seam and overall shape of the single master.

Logo canvases are square, 1:1. Preserve their aspect ratio, framing and existing spacing. Use the supplied PNGs for standard pixel dimensions and the matching SVGs for custom scaling. Resize directly from the master, rather than successively downscaling one export.

## Typography

**Wordmark:** B3-W05 Focus, uppercase sans serif, reading `SALVOR LABS`. The exact font family, weight and point size are **unverified** because the approved source was generated raster artwork. Use the preserved artwork rather than retyping it in a guessed font.

The wordmark master canvas is **209 × 36px** (ratio **209:36**). Scale uniformly; do not alter letter spacing. A final font family and typeset sizing specification will go here when confirmed. No supporting text family has been selected.

Horizontal lockups place the symbol left of the wordmark; vertical lockups place it above. Their export sizes will refer to the square symbol's size. Spacing and relative wordmark scale remain to be set. Wordmark-only sizes refer to the artwork width; tiny wordmark legibility needs its own review.

## Colors

| Role | Value |
|---|---|
| Black | `#000000` |
| White | `#FFFFFF` |
| Depth shading | Neutral grayscale; preserved from the selected artwork |
| Future accent palette | TBD — no accent colors approved |

Transparent assets express grayscale through ink opacity. Choose white ink on dark surfaces and black ink on light surfaces.

## Assets

[Logo pack](logo/README.md): four background/ink treatments, each containing seven PNGs and seven matching SVGs. SVGs contain editable vector paths, with no embedded bitmap or font dependency. They are faithful traces of the approved rasters; their antialiasing differs from the small PNGs.

[Export definitions](EXPORT_SETS.json) prepare the same treatments for horizontal, vertical and wordmark-only packs. Those three packs have not been exported yet. [Master provenance](masters/SOURCES.json) preserves the originals and crop information; [vector provenance](masters/VECTOR_SOURCES.json) records the traces.

## Hero and community artwork

The canonical L09 sphere/swirl artwork is approved separately from the monochrome identity. Use [the canonical transparent PNG](hero/l09/README.md) for reusable scene artwork and UGC. It includes the corrected two-half cutout logo, short restrained gold light cones, rainbow ribbons and clean lower glow, with a five-pixel transparent border. Do not crop the luminous falloff or amplify the outer ribbon bloom. Scene rainbow colors do not establish an additional logo palette.

The main hero and sharing cards derive from this same approved artwork. Refresh social cards whenever a new hero is explicitly locked; do not refresh them on intermediate studies. The current files and hashes are owned by `../site/source/hero-lock.json`.
