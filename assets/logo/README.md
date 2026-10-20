# SalvorLabs logo-only pack

**28 PNGs and 28 matching SVGs**, in four folders. Every folder contains the sizes **512, 256, 128, 64, 32, 16 and 8**.

| Folder | Ink | Background |
|---|---|---|
| `white_on_black_bg/` | White/grayscale | Black |
| `black_on_white_bg/` | Black/grayscale | White |
| `black_on_trans_bg/` | Black with grayscale opacity | Transparent |
| `white_on_trans_bg/` | White with grayscale opacity | Transparent |

Filenames pair directly: `salvor-labs-logo-128.png` and `salvor-labs-logo-128.svg`.

Every size uses the same **G08 full knowledge graph**, including 32, 16 and 8px. PNGs are independently resized from the one preserved square master. Every SVG uses the same regular master viewBox and Bézier paths, with no embedded raster. Use PNGs for exact standard pixel sizes and SVGs for custom layouts.

See the [interactive PNG/SVG review](../reviews/logo-set-01/review.html), [brand guide](../BRAND_GUIDE.md), [manifest](manifest.json) and [verification](verification.json). The common 512px vector comparison has a mean alpha error of 1.71/255; native-size comparisons are recorded separately because raster resampling and SVG antialiasing differ.

Future horizontal, vertical and wordmark-only sets share the definitions in [EXPORT_SETS.json](../EXPORT_SETS.json). Their masters are prepared; those exports remain pending.

Repeatable export commands live in [tools/README.md](../tools/README.md). [CHANGES.md](CHANGES.md) lists this milestone's files; the manifest lists all 56 asset paths and hashes.
