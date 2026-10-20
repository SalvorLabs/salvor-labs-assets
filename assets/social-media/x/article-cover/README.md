# Salvor Labs announcement article cover

Approved for repository commit/push by the operator, 20 October 2026. Revision 02 replaces the rejected enlarged traced wordmark with centered white Futura Medium capitals and deliberate tracking. The quiet dusk plate was generated with ImageGen; sphere geometry is preserved exactly; typography uses clean native font contours exported to SVG paths.

- `salvorlabs-article-cover-2500x1000.jpg`: full-resolution upload file (approximately 810KB).
- `salvorlabs-article-cover-2500x1000.png`: lossless master.
- `salvorlabs-article-cover-1500x600.jpg`: compact export.
- `salvorlabs-article-cover-2500x1000.svg`: editable composition with embedded raster scene and outlined wordmark.

The 5:2 layout is a chosen landscape composition, not an asserted mandatory X specification. Keep the complete central sphere and title visible when applying any platform crop. No extra tagline or token promotion is included.

`SOURCES.json` records source/output hashes and layout. `source/PROMPT.txt` records background generation. Reproduce exports with `SALVOR_SHARP_PATH=/absolute/path/to/sharp node source/export.cjs`.

Existing hero, site sharing cards, and the separately developed X profile banner are unchanged. The operator approved including this cover in the combined copy/visual save on `gh-pages-preview`.

The first title treatment is preserved in `archive/01-traced-title/`. Its low-resolution-derived contours became visibly uneven when enlarged. `source/title-outlines.swift` records the replacement lettering recipe; `source/title-futura-02.svg` is self-contained and needs no installed font to render. `verification.json` confirms the upper 740 rows are pixel-identical to the prior cover.
