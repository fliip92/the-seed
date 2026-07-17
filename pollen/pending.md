# Pending release intents

The unreleased portable-subtree changes awaiting the next pollen release. Each is one top-level
bullet:

```
- Impact: <major|minor|patch> — [ring NNNN](../docs/rings/NNNN-slug.md) — <one-line summary>
```

The impact is DECLARED, not parsed from commits (ring 0026): major = breaking (forces a
migration), minor = feature, patch = fix. `node .seed/checks/release.ts cut-release --date
YYYY-MM-DD` folds these into a dated release under [releases/](releases/README.md), bumps the
pollen version, and clears this file. The pending-release notes
([docs/generated/pending-release.md](../docs/generated/pending-release.md)) are computed from
this file and byte-exact-gated by `npm run check`.

_No pending intents — the pollen line rests. Declare one above to compose the next release._
