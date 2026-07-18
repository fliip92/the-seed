# Ring 0032 — Stage 3 → 4 transition approved; dither is the first external host

- Date: 2026-07-17
- Stage: 4 — Pollination (entering)
- Raised-by: gardener
- Question: SEED.md §4 requires each stage transition to be proposed as an execution plan,
  approved by a Gardener, and recorded as a ring. Is the Stage 3 → 4 (Flowering → Pollination)
  transition approved — and which repository is the first external host?
  [Ring 0006](0006-solo-until-flowering.md) reserved that choice for the Gardener at Stage 4 entry.
- Decision: Approved by the Gardener on 2026-07-17, on
  [plan 0006](../plans/active/0006-pollination.md) as proposed. Stage 4 (Pollination) is entered;
  plan 0006 is the governing execution plan. The **first external host is dither**, designated by
  the Gardener at Stage 4 entry — which resolves [ring 0006](0006-solo-until-flowering.md)'s
  `Revisit-when` ("the Gardener designates a host"): the seed is no longer solo.
  - Stage 3's exit criterion — pollen installs into a sacrificial repo with a measured before/after
    fitness delta, plus the recursive self-upgrade test and a mandated uninstall path (SEED.md §4) —
    was evidenced in [plan 0005](../plans/completed/0005-flowering.md): the portable subset packaged
    as versioned pollen (rings [0026](0026-pollen-boundary-versioning-lineage.md) /
    [0027](0027-release-graft-cli.md) / [0028](0028-installer-uninstall.md), the first release
    v0.1.0), the recursive test ([ring 0029](0029-recursive-self-upgrade-test.md)) grafting v0.1.0
    into a sacrificial repo and uninstalling byte-identical
    ([docs/fitness/recursive-upgrade.md](../fitness/recursive-upgrade.md)), and both gating
    prerequisites paid ([E-013](../plans/entropy-ledger.md) / [ring 0030](0030-inferential-control-judge.md);
    [E-004](../plans/entropy-ledger.md) / [ring 0031](0031-name-cleared-codename-retained.md)).
  - Stage 4 runs the genome's six-step per-host protocol against dither: Scout → Grill → Propose →
    Graft → Metabolize → Independence. The mutating steps (Graft onward) gate on the host owners'
    review and approval of the Propose step; the per-host exit criterion governs — a positive fitness
    trend over a sustained window with owners shipping through the agent workflow without the seed
    being special (SEED.md §4). Pollination is terminal and ongoing (SEED.md §0).
- Alternatives considered:
  - **Lingering in Stage 3** — rejected: the exit criterion was met and the genome forbids lingering
    past an exit criterion (SEED.md §4).
  - **A different first host** — mottainapp, the one repository already Scouted read-only
    ([assessment 0001](../assessments/0001-mottainapp.md)), was the pre-Scouted candidate named in
    the proposal; the Gardener chose **dither**. A read-only Scout is not a commitment to graft, so
    the assessment does not bind the choice.
  - **Deferring host selection past Stage 4 entry** — rejected: ring 0006 routes the choice to entry,
    and Scout (step 1) cannot begin without a named host.
- Enforcement: doc-only — justified: a stage transition is a recorded governance event with no
  artifact to lint (the [ring 0025](0025-stage-3-transition-approved.md) precedent); its substance is
  enforced as plan 0006's per-host protocol steps land, each shipping its own verification (LAW-6).
  The stage bump itself is a hand-edit in two places — AGENTS.md `- **Stage:**` and `fitness.ts`
  `CURRENT_STAGE` — whose agreement is still unchecked ([E-011](../plans/entropy-ledger.md)); both
  were bumped to 4 with this ring.
- Revisit-when: Never — a transition is a historical fact, and Pollination is the terminal stage
  (there is no Stage 5). Ring 0006 is resolved by this ring; a second external host is recorded
  separately, not by reopening this one.
