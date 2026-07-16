# pollen/releases/ — the release history

The append-only, dated record of every cut pollen release (founding ring
[0026](../../docs/rings/0026-pollen-boundary-versioning-lineage.md); build ring
[0027](../../docs/rings/0027-release-graft-cli.md)). Each release is one file,
`vX.Y.Z.md`, recording its impact class, its date (a recorded-once fact, ring
[0020](../../docs/rings/0020-onboard-human-generated-briefing.md)), the rings it composed (the
decision log is the changelog), and its migration (for a major). A release is history: once cut it is
never edited or deleted — [release-append-only.ts](../../.seed/checks/release-append-only.ts) (a CI
gate, the [ring-append-only](../../.seed/checks/ring-append-only.ts) shape) enforces it, this index
README excepted (it gains a line per release).

Releases are cut by the release tool ([.seed/checks/release.ts](../../.seed/checks/release.ts)
`cut-release`), which folds the [pending intents](../pending.md) into the next release, bumps the
pollen version, and appends here. What the next release *would* be is the byte-exact
[pending-release notes](../../docs/generated/pending-release.md).

## Releases

_No release cut yet — the pollen line rests at v0.0.0. The boundary (ring 0026) and the release tool
(ring 0027) are declared as [pending intents](../pending.md); the first release, **v0.1.0**, is cut by
the recursive self-upgrade test ([plan 0005](../../docs/plans/active/0005-flowering.md) scope item 4)._
