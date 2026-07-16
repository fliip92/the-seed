# docs/generated/ — regenerated-only artifacts

Artifacts in this directory are **produced by scripts, never by hand**. Hand-editing a
generated artifact is a lint error by decree of the genome (SEED.md §2) — the fix always
goes into the source or the generator, then regenerate: `npm run generate`.

**Enforcement:** mechanical (converted from ledger E-001, ring
[0020](../rings/0020-onboard-human-generated-briefing.md)). Every artifact is registered in
the generation manifest ([`.seed/lib/generated.ts`](../../.seed/lib/generated.ts)) with its
sources, its regeneration command, and a pure `generate(root)` function.
[`.seed/checks/validate-generated.ts`](../../.seed/checks/validate-generated.ts) (part of
`npm run check`) re-runs each generator from the current tree and fails if the committed
artifact differs — so a hand-edit, or a source that changed without regenerating, cannot
merge. It also fails on any file here that no manifest entry claims, and on a generator that
cannot run (e.g. a source it reads is gone — a legible violation, not a crash). Generators are
**pure functions of repo files** (no wall-clock, no environment), which is what lets an
artifact regenerate byte-identically.

## Manifest

| Artifact | Sources | Regenerate |
|---|---|---|
| [onboarding.md](onboarding.md) | the map (AGENTS.md) + the active plans it links | `npm run generate` |
| [pending-release.md](pending-release.md) | [`pollen/pending.md`](../../pollen/pending.md) + the pollen version + the release history | `npm run generate` |

[onboarding.md](onboarding.md) is the [onboard-human](../../skills/onboard-human/SKILL.md)
briefing — current state → goal, derived from the map's stage line and the active plan it
links, so it cannot drift from the truth without `npm run check` catching it.

[pending-release.md](pending-release.md) is the **pending-release notes** (ring
[0027](../rings/0027-release-graft-cli.md)): what the next pollen release would be — the version
bumped by the maximum declared impact, and the rings it composes — computed purely from the committed
[pending intents](../../pollen/pending.md). It is the ring-0020 determinism split's "pure pending
notes, byte-exact-gated" half; the release tool that consumes those intents is
[.seed/checks/release.ts](../../.seed/checks/release.ts).

Every artifact added here must be registered in the manifest with its source and regeneration
command.
