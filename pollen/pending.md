# Pending release intents

The unreleased portable-subtree changes awaiting the next pollen release. Each is one top-level
bullet:

```
- Impact: <major|minor|patch> — [ring NNNN](../docs/rings/NNNN-slug.md) — <one-line summary>
```

The impact is DECLARED, not parsed from commits (ring
[0026](../docs/rings/0026-pollen-boundary-versioning-lineage.md)): major = breaking (forces a
migration), minor = feature, patch = fix. The next version is a pure function of the maximum declared
impact across these intents. `node .seed/checks/release.ts cut-release --date YYYY-MM-DD` folds them
into a dated release under [releases/](releases/README.md), bumps the pollen version, and clears this
file. The pending-release notes
([docs/generated/pending-release.md](../docs/generated/pending-release.md)) are computed from this
file and byte-exact-gated by `npm run check` (ring
[0027](../docs/rings/0027-release-graft-cli.md)).

- Impact: minor — [ring 0026](../docs/rings/0026-pollen-boundary-versioning-lineage.md) — the pollen boundary, the two version lines, the lineage schema + manifest (plan 0005 scope item 1).
- Impact: minor — [ring 0027](../docs/rings/0027-release-graft-cli.md) — the release / graft CLI: sense, cut-release, the determinism split, the version bump, the migration tooth (plan 0005 scope item 2).
- Impact: minor — [ring 0028](../docs/rings/0028-installer-uninstall.md) — the installer + the mandated uninstall path: graft (a refuse-to-clobber beachhead) and uninstall (its byte-exact inverse) (plan 0005 scope item 3).
