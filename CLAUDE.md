# salvor-labs-assets
### CURRENT STATE (L1 Cache)
@.salvor/active_state.md

> Read `.salvor/active_state_verbose.md` only during context recovery or when requested.

## Project Overview
SalvorLabs identity and brand assets, maintained separately from the Salvor product repository. The user brief lives in `assets/BRIEF.md`. The logo is ratified and the first PNG/SVG export pack is ready. Horizontal, vertical, wordmark-only and social packs follow; see the assets spoke and light brand guide. Exploratory sources are preserved separately from approved exports.

## Architecture
| Component | Stack | Spoke |
|-----------|-------|-------|
| assets | Raster/vector design assets and Markdown | @assets/CLAUDE.md |
| GHPAGE | Preserved static HTML/CSS review mock; integration paused | @site/CLAUDE.md |

## Documentation Map
| Document | Purpose |
|----------|---------|
| `assets/BRIEF.md` | User-supplied identity requirements and phase boundaries |
| `assets/BRAND_GUIDE.md` | Current logo, typography and small-icon usage |
| `RULES.md` | Salvor Core governance; optional Strict defaults disabled |
| `VERSION.md` | Release version and component build counters, plus dated history |
| `.salvor/DOMAIN_REF.md` | Current approved domain facts and learned-failure registry |
| `.salvor/INFRA.md` | Local workflow and external systems |
| `.salvor/DEFERRED_TODOS.md` | User-approved deferred findings |
| `.salvor/decisions/` | Approved design rationale |
| `.salvor/domain-learnings/` | Approved empirical findings |

## Memory Maintenance
Update L1 after confirmed milestones; keep it under 50 lines. Immediately update L2 with curated recovery history and evidence, never raw logs or hidden reasoning. Condense L2 beyond approximately 1,500 lines or at release milestones. Routine operational state updates are automatic; durable capture is user-gated. Never persist secrets, credentials or personal data.

## Capture Classes
Follow RULES §2 and §7. Ask exactly before durable capture:
- `Record this as a design decision? (yes/no)` → `.salvor/decisions/`
- `Save this as a domain learning? (yes/no)` → `.salvor/domain-learnings/`, including learned failures
- `Log this to .salvor/DEFERRED_TODOS.md? (yes/no)` → deferred findings
Each durable fact has one canonical owner; adapters and tool memories only route to it.

## Tooling
Core mode. No Serena project or GitNexus index has been initialized for this repository. Do not use another repository's semantic tools as if they represented this one. No global/client configuration changes are authorized by setup.
