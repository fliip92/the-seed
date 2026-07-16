# pollen/ — the portable distribution

The versioned, installable subset of the Seed — skills, scaffolding templates, protocols,
installer, and an uninstall path — built at Stage 3 (Flowering, SEED.md §4) and carried
into foreign hosts at Stage 4 (Pollination, SEED.md §7). The first install target is the
Seed itself: the recursive test is upgrading this repository using its own pollen, with
fitness measured before and after.

## The boundary, the two version lines, and lineage (scope item 1)

[Plan 0005](../docs/plans/active/0005-flowering.md) scope item 1 defines *what is portable*
and *how it is versioned*, decided in the founding
[ring 0026](../docs/rings/0026-pollen-boundary-versioning-lineage.md):

- **The boundary.** The [pollen manifest](../.seed/lib/pollen.ts) classifies every top-level
  repo entry into one tier — **portable** (the method: the skills and the machinery, grafted
  into descendants and locally adaptable), **sovereign** (the genome, `SEED.md` — the mother's
  frame, amended only her way), or **local** (this seed's own history — its map, plans, rings,
  ledger, fitness; never portable, each seed grows its own). Scaffolding templates for the
  local artifacts ship here as the installer is built (scope item 3).
- **Two version lines, never conflated.** The **genome version** (the constitution's line,
  authoritative in `SEED.md`) and the **pollen version** (this distribution's line, semver).
  A pollen release is cut by the release tool (scope item 2); the line sits at `0.0.0` until
  then — the boundary is defined, no release yet.
- **Lineage.** Every seed records its lineage (SEED.md §7: seed version, parent, date
  planted) in [`lineage.json`](lineage.json). The mother is the root of its lineage
  (`parent` null); a descendant names its parent and carries migrations so it can upgrade
  (LAW-11: feedback flows upstream). The [feedback](../skills/feedback/SKILL.md) skill reads
  this same file to address an issue upstream — one lineage schema
  ([lib/lineage.ts](../.seed/lib/lineage.ts)), read by both organs.

The boundary's completeness, the version lines, and the lineage are enforced by
[validate-pollen](../.seed/checks/validate-pollen.ts) (LAW-6), part of `npm run check`.

## The release mechanism (scope item 2)

[Plan 0005](../docs/plans/active/0005-flowering.md) scope item 2 builds the owned release / graft
CLI, decided in ring [0027](../docs/rings/0027-release-graft-cli.md) — a thin orchestrator
([`.seed/checks/release.ts`](../.seed/checks/release.ts), `npm run release`) over the model in
[`.seed/lib/release.ts`](../.seed/lib/release.ts). A release is composed from **committed intent** and
recorded as **append-only history**, with the [ring 0020](../docs/rings/0020-onboard-human-generated-briefing.md)
determinism split:

- **[pending.md](pending.md)** — the committed intents: the unreleased portable-subtree changes, each
  declaring its impact (major/minor/patch), the ring behind it, and a one-line summary. The next
  version is a pure function of the max declared impact (ring 0026).
- **[releases/](releases/README.md)** — the append-only, dated release history: one file per cut
  release, enumerating the rings it composed (the decision log is the changelog). Enforced append-only
  by [release-append-only.ts](../.seed/checks/release-append-only.ts).
- **[pending-release notes](../docs/generated/pending-release.md)** — what the next release *would* be,
  generated purely from `pending.md` and byte-exact-gated by `npm run check`.

The pollen line rests at **v0.0.0**; the boundary (ring 0026) and this release tool (ring 0027) are
declared as pending intents composing a first **v0.1.0**, cut by the recursive self-upgrade test
(scope item 4). The pure invariants are [validate-release](../.seed/checks/validate-release.ts) (part
of `npm run check`). `graft` and `uninstall` are reserved for the installer (scope item 3).
