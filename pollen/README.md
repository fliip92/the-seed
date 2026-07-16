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
