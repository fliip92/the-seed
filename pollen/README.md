# pollen/ — the portable distribution

The versioned, installable subset of the Seed — skills, scaffolding templates, protocols,
installer, and an uninstall path — built at Stage 3 (Flowering, SEED.md §4) and carried
into foreign hosts at Stage 4 (Pollination, SEED.md §7). The first install target is the
Seed itself: the recursive self-upgrade test upgraded this repository using its own pollen
(v0.1.0, cut 2026-07-16), with fitness measured before and after — the Stage 3 exit proof
([docs/fitness/recursive-upgrade.md](../docs/fitness/recursive-upgrade.md),
[ring 0029](../docs/rings/0029-recursive-self-upgrade-test.md)).

## The boundary, the two version lines, and lineage (scope item 1)

[Plan 0005](../docs/plans/active/0005-flowering.md) scope item 1 defines *what is portable*
and *how it is versioned*, decided in the founding
[ring 0026](../docs/rings/0026-pollen-boundary-versioning-lineage.md):

- **The boundary.** The [pollen manifest](../.seed/lib/pollen.ts) classifies every top-level
  repo entry into one tier — **portable** (the method: the skills and the machinery, grafted
  into descendants and locally adaptable), **sovereign** (the genome, `SEED.md` — the mother's
  frame, amended only her way), or **local** (this seed's own history — its map, plans, rings,
  ledger, fitness; never portable, each seed grows its own). The installer emits scaffolding
  templates for the local artifacts (scope item 3, below); they live in the portable
  [`.seed/lib/graft.ts`](../.seed/lib/graft.ts), carried onward with the method.
- **Two version lines, never conflated.** The **genome version** (the constitution's line,
  authoritative in `SEED.md`) and the **pollen version** (this distribution's line, semver).
  A pollen release is cut by the release tool (scope item 2); the line reached `0.1.0` at the
  first cut (2026-07-16, ring 0029).
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

The pollen line rests at **v0.1.0** — cut 2026-07-16 by the recursive self-upgrade test (scope item 4,
ring [0029](../docs/rings/0029-recursive-self-upgrade-test.md)), composing the boundary (ring 0026), this
release tool (ring 0027), and the installer (ring 0028) as its first release
([releases/v0.1.0.md](releases/v0.1.0.md)); [pending.md](pending.md) is now empty. The pure invariants are
[validate-release](../.seed/checks/validate-release.ts) (part of `npm run check`).

## The installer + the mandated uninstall path (scope item 3)

[Plan 0005](../docs/plans/active/0005-flowering.md) scope item 3 gives the release CLI's `graft` /
`uninstall` verbs their machinery, decided in ring
[0028](../docs/rings/0028-installer-uninstall.md) — the model is
[`.seed/lib/graft.ts`](../.seed/lib/graft.ts). `graft <target>` installs this seed's portable subset —
the SEED.md §4 Stage-4 step-4 beachhead: the map, the plan structure, and the first lints, *no behavior
changes yet* — **copying** the portable method (`.seed/`, `skills/`) + the sovereign genome (`SEED.md`)
verbatim and **emitting** the local scaffold (map, plans, rings, release data, lineage, plumbing) as
parameterized templates. It is purely additive (it refuses to overwrite), so `uninstall <target>` is a
clean inverse — it removes exactly the graft set and prunes the directories it emptied, restoring the
target byte-identical (SEED.md §4: *an uninstall path must exist*). The round-trip is verified hermetically
by the self-tests (LAW-6).
