# Asset export tools

These local Node.js tools use the single G08 raster/vector logo master at every size and preserve the selected Focus wordmark. No application server or credentials are required. They use Sharp 0.35.4; `trace-masters.cjs` additionally uses [Potrace 2.1.8](https://github.com/tooolbox/node-potrace) for Bézier tracing.

From the repository root, with Sharp resolvable as a Node module:

```sh
node assets/tools/export-logo.cjs --config=assets/EXPORT_SETS.json --set=logo_only --output=/tmp/salvor-logo-export
node assets/tools/add-svg-companions.cjs --config=assets/EXPORT_SETS.json --set=logo_only --output=/tmp/salvor-logo-export
```

Alternatively pass `--sharp=/absolute/path/to/sharp` to each command. The PNG exporter requires a fresh output directory; the SVG exporter adds companions to that pack, retaining its PNG files and updating its manifest. Existing incompatible files are never replaced.

`trace-masters.cjs --config=assets/EXPORT_SETS.json` can create SVG masters from the preserved rasters in a fresh copy of the master folder. It accepts `--sharp=...` and `--potrace=...` module paths. Logo traces use 64 grayscale contour levels; the flat wordmark uses one filled glyph contour. Existing canonical masters are not overwritten.

The three prepared wordmark sets in the configuration are intentionally unavailable to the current square-logo exporters until their layouts are finished. The shared size ladder and four color/background treatments are already defined.
