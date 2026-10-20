# Horizon — SalvorLabs HTML direction 01

Review mock requested on 2026-10-16. This is an early visual proposal, not an approved or deployed site.

One mirrored sphere in an uncaptured desert of knowledge. The selected G08 logo and exact B3-W05 Focus glyph artwork remain unchanged. Header, footer and favicon use the same full graph mark. Supporting text uses Avenir Next with Segoe UI/Arial fallbacks as a mock-only choice; this does not claim the unknown Focus font is Avenir.

Palette: near-black `#060C12`, blue-black `#08121B`, white `#F3F5F6`, muted gray `#A7B4BF`, quiet gray `#83929F`, divider `#28333D`. The landscape supplies the color; no new brand accent palette is ratified.

Composition: full-height photographic opening, centered headline above the sphere, quiet navigation; then mission, current Salvor project, research direction, and minimal footer. Real HTML text, CSS layout, no framework, no external fonts, no runtime dependencies.

Primary review points: landscape/sphere mood and scale, headline, amount of copy, and the move from hero to mission/work. Deployment and DNS are intentionally absent until this direction is reviewed.

The currently public Salvor URL was verified as `https://github.com/dwasyluk/Salvor`; the organization currently contains only the assets repo. Update the project link after the actual repository transfer.

GitHub Pages supports public organization repositories on the Free plan and custom domains. This existing public repository can host a project Pages site; the bare `salvorlabs.github.io` organization URL requires a repository named `SalvorLabs.github.io`. Official reference: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

The complete mock is now preserved in `site/` within the corrected assets checkout. The original mock and a verified backup remain available. Release work is paused after the directory correction. This site is untracked on the logo branch; its eventual integration still belongs on a separate branch created from dev after canonical logo integration. No design, HTML or CSS changed during migration.

Historical temporary preview (now expired): https://salvorlabs.github.io/salvor-labs-assets/. The existing runtime files were published unchanged on `gh-pages-preview` for twelve hours. A local app heartbeat is scheduled to unpublish after 2026-10-17 15:34:45 UTC; the laptop/app must remain running. Permanent integration and release work stay paused.

Before expiry, the preview had valid, enforced HTTPS at https://salvorlabs.org/. Its Open Graph/X card is media/social/salvorlabs-social-v2.jpg (1200×630); the editable SVG composition, PNG companion and provenance remain in the local site sources. Commit 604a923 was pushed to the preview branch and its Pages workflow passed. Only sharing metadata/crawler policy changed in the page; the visible layout and existing artwork are unchanged.

## Current local review — 2026-10-19

Open http://127.0.0.1:64613/?cut=dusk-flow-06. The selected hero is the dusk chrome sphere with flowing rainbow light, foreground diagonal arc, soft ground light and the centered thin stamped graph treatment. The scene outside the imprint region is preserved pixel-for-pixel; the current spacing pass does not alter its artwork. Header and footer use the detailed graph mark, and the footer now includes the copyright/trademark notice and labeled social icons.

The hero fits common phone, tablet and desktop viewports, including short browser panels. Six responsive checks and screenshots are in `review/dusk-flow-05/`; sources, prompts and locked-scene evidence are in `source/dusk-flow-04/`. The original page still works at `review/dusk-flow-01/baseline/`.

All iterations are retained. This is a local review, not a new public deployment. The earlier twelve-hour preview was unpublished on 2026-10-18; its branch, prior social card and all resources remain intact. The canonical logo master files and the Salvor product checkout were not changed.


## Single logo and Salvor product artwork — 2026-10-19
Current local preview: http://127.0.0.1:64613/?cut=dusk-flow-06. The 16/32px favicons use the full G08 knowledge graph, matching every canonical export size. The regular white Salvor product mark appears beside the Salvor heading; both black/white PNG and SVG sources are preserved in assets/products/salvor. The source Salvor checkout, approved hero and hero spacing are unchanged by this update.


## Approved hero → sharing-card refresh

After the operator locks a new hero, run this command from the repository root with Sharp installed (or pass `--sharp=/absolute/path/to/sharp`):

```sh
node site/tools/export-social-card.cjs --lock-hero=media/horizon-dusk-flow-05.webp
```

Replace the hero path only after approval; it must match the hero in `index.html`. This explicit command exports the 1200×630 JPEG and PNG, saves an editable SVG composition and input/output hashes, updates Open Graph/X metadata and the runtime manifest, and records the lock in `source/hero-lock.json`. Filenames include a key derived from the artwork, brand inputs, exporter and renderer versions so new locked art receives a fresh sharing URL. Existing exports are retained.

Preview/CSS edits do not run this command. On a lock, inspect the full card and a reduced-size preview, verify text/logo readability and metadata, then publish the card and HTML together through the separately authorized deployment process. Local export does not deploy anything. The current card review is `review/social-card-dusk/`; the approved hero itself is unchanged.


## Current locked hero — L09

Open http://127.0.0.1:64613/?cut=dusk-flow-07. L09 is approved: white-hot graph cut channels, amber edges and short warm beams. The previous scene and front neon are preserved outside the local logo-light mask. Source/preservation records: `source/dusk-flow-05/`. The social card and Open Graph/X metadata have been refreshed from this new lock.

Hero, card and light/dark transparent-art previews: `review/dusk-flow-07/`. The independent PNG is 3072×2048 RGBA, owned by `../assets/hero/l09/`, with a runtime download at `media/artwork/salvorlabs-sphere-l09-transparent-3072.png`. Its native generation and scaling provenance are preserved with it. Prior heroes, cards and studies remain intact. All updates are local; publication/integration is pending.
