# Ring 0035 — the stage-agreement invariant: validate-stage checks AGENTS.md against fitness.ts's CURRENT_STAGE, firing only on disagreement so a grafted host is not bound

- Date: 2026-07-19
- Stage: 4 — Pollination
- Raised-by: seed
- Question: The growth stage is stated in two hand-bumped, unchecked places —
  [AGENTS.md](../../AGENTS.md)'s "- **Stage:** N" prose (the map's Current state) and
  [`.seed/checks/fitness.ts`](../../.seed/checks/fitness.ts)'s `CURRENT_STAGE` (stamped into every
  fitness snapshot) — so a forgotten bump on a transition would silently mislabel every snapshot's
  stage until noticed ([E-011](../plans/entropy-ledger.md), anticipated by
  [ring 0018](0018-map-current-state-drift-doc-only.md): "E-011 stands on its own … converts on its
  own next-touch"). How is the agreement enforced without mechanizing the decision fitness.ts
  deliberately keeps manual, and without misfiring on a grafted host?
- Decision:
  - **A structural agreement check, not a derivation.**
    [`.seed/checks/validate-stage.ts`](../../.seed/checks/validate-stage.ts) (in
    [`run-all`](../../.seed/checks/run-all.ts)) reads the "- **Stage:** N" number from the map and
    the `CURRENT_STAGE = N` number from fitness.ts and fails naming LAW-2 when they disagree. It
    verifies the hand-bump; it does not compute the stage. fitness.ts keeps its comment that the
    stage is a rare, deliberate, Gardener-approved manual bump (SEED.md §4) — the check guards that
    bump rather than replacing it.
  - **Fires only when both are stated and they differ — host-safe.** `run-all.ts` is portable
    (ring [0026](0026-pollen-boundary-versioning-lineage.md)): a grafted host carries this check and
    the copied fitness.ts (with the mother's `CURRENT_STAGE`), but its map template tracks no genome
    stage. So the check is deliberately silent when the map states no "- **Stage:**" line — a
    descendant is not bound by the mother's lifecycle — while the seed, which always states both, is
    fully bound. This is the precise agreement [E-011](../plans/entropy-ledger.md) prices, no more.
  - **Metabolism during the dither-graft pause.** Converted as the highest-certainty free ledger
    item while [plan 0007](../plans/active/0007-dither-graft.md)'s first dither mutation is paused on
    the owner's go — the LAW-8 "pay entropy continuously" default when the live step is gated
    (AGENTS.md § Start here).
- Alternatives considered:
  - *Derive `CURRENT_STAGE` from AGENTS.md automatically* — rejected: fitness.ts deliberately keeps
    the stage a manual, Gardener-approved bump (its own comment, SEED.md §4); auto-deriving would
    mechanize a decision the genome keeps human, and coupling the snapshot's stage to the map's
    hand-authored orientation prose is the wrong dependency direction.
  - *Require a stage line everywhere (fire when the map states none)* — rejected: it misfires on a
    grafted host whose map template tracks no genome stage while carrying the copied fitness.ts —
    exactly the false positive run-all's portability (ring 0026) makes possible. Firing only on
    disagreement keeps the check honest on the mother and quiet on descendants.
  - *Fold the check into [validate-map](../../.seed/checks/validate-map.ts) or
    [validate-anatomy](../../.seed/checks/validate-anatomy.ts)* — rejected: stage agreement is
    neither reachability nor anatomy presence; a focused check stays legible — the house pattern of
    one check, one invariant.
  - *Cite the governing [plan 0006](../plans/active/0006-pollination.md) for traceability instead of
    cutting a ring* — rejected: E-011 is unrelated to the dither pollination, so attributing it to
    that plan would pollute the plan's story. A dedicated ring is the honest anchor (AGENTS.md
    § Protocols: make a decision durable).
- Enforcement: structural test — [`.seed/checks/validate-stage.ts`](../../.seed/checks/validate-stage.ts)
  in [`run-all`](../../.seed/checks/run-all.ts), plus a [self-test](../../.seed/tests/self-test.ts)
  case that seeds a disagreement (bump fitness.ts's `CURRENT_STAGE` by +1 relative to the map) and
  asserts the check fires with a law-naming message and exit 1 (LAW-6); the pristine copy — the stage
  stated identically in both — passes.
- Revisit-when: a grafted host needs to track its own lifecycle stage (the both-present-and-differ
  scoping would then need a host-stage source rather than staying silent), or the run-log instrument
  ([E-017](../plans/entropy-ledger.md)) subsumes stage-stamping and the snapshot's stage stops being
  hand-carried.
