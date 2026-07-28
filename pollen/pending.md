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

- Impact: patch — [ring 0050](../docs/rings/0050-gates-honor-git-ignore-rules.md) — the working-tree gates take their file set from git, so a git-ignored file (an agent tool's local state, editor or build output) no longer fails every check and self-test on a working machine while CI stays green
- Impact: minor — [ring 0051](../docs/rings/0051-decision-log-shape-resolved-not-assumed.md) — `plan_traceability` resolves the target's decision-log shape (plans and rings, or numbered ADRs under `docs/adr/`) instead of assuming the seed's, so an ADR-governed host computes a real fraction instead of a false "no decision log" null
