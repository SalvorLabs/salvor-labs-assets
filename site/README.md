# SalvorLabs website

Current local page: http://127.0.0.1:64613/?cut=ecosystem-01.

The homepage and [launch announcement](announcement.html) now distinguish free Salvor OS from Salvor+ and place all five high-level $SALVOR utility directions under Salvor+. New services are marked in development. [Announcement copy and editorial timing](copy/README.md) route to the strategy brief and the operator’s latest guidance. The detailed follow-up is tentatively about two weeks after 20 October, subject to readiness.

The approved dusk hero uses the canonical contained-glow L09 artwork, with the corrected two-half cutout logo, short warm-gold light cones, restrained rainbow ribbons and clean lower glow. The sphere is composited from the exact approved transparent PNG. The hero artwork, base stylesheet, header/footer identity and existing sharing images remain unchanged. The copy expansion uses a separate `marketing.css`, with byte-identical supplied Salvor+ marks in `media/brand/salvor-plus/`.

## Current assets

- Hero: `media/horizon-dusk-flow-06.webp` (1672×941, lossless).
- Canonical transparent PNG: `media/artwork/salvorlabs-sphere-l09-contained-transparent-4096.png` (4096×2654, 5px clear border). Ownership/provenance: `../assets/hero/l09/SOURCES.json`.
- Sharing card: current 1200×630 JPEG/PNG/SVG paths and hashes in `source/hero-lock.json`.
- Hero composition, clean plate, original page/lock and preservation evidence: `source/dusk-flow-06/`.
- Hero/card/transparency review and six responsive checks: `review/dusk-flow-08/`.

The 4096px PNG is an enlarged export from native bitmap sources; provenance records the original resolutions. Its glow is contained on a genuinely transparent canvas. The monochrome G08/Focus identity remains separate from the colorful scene artwork.

## Approved hero → sharing-card refresh

After a new hero is explicitly approved, run from the repository root with Sharp installed, or provide `--sharp=/absolute/path/to/sharp`:

```sh
node site/tools/export-social-card.cjs --lock-hero=media/horizon-dusk-flow-06.webp
```

The path must match the current hero in `index.html`. This command exports the sharing JPEG/PNG and editable SVG composition, saves input/output hashes, updates Open Graph/X metadata and refreshes the runtime manifest and hero lock. Filenames include a key derived from image/brand inputs, exporter and renderer versions. Previous outputs are preserved. Draft artwork and CSS iterations never invoke this command. Inspect the full card and its reduced preview after export. Publication is a separate operation.

## Local review and history

Serve this folder over HTTP; the current local server is on port64613. The original working mock is preserved at `review/dusk-flow-01/baseline/`. Earlier dusk images, logo-light studies, transparent reviews and social exports remain in their source/review folders.

The earlier twelve-hour GitHub Pages preview was unpublished on 2026-10-18. This update makes no deployment, DNS or organization-profile changes. Salvor product files remain untouched. The reviewed website is approved for a scoped main commit and push; unrelated staged/unversioned resources remain preserved. The operator requested work on `main`; a local `main` was created at the existing baseline without changing the existing artwork staging.
