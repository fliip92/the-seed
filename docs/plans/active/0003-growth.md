# Plan 0003 — Growth (Stage 2)

- Status: active

## Goal

Advance from Stage 1 (Rooting) to Stage 2 (Growth): grow the skill garden (SEED.md §4,
Stage 2) — the skills that make the seed useful beyond maintaining itself — until it can
assess a foreign repository without modifying it and produce a proposal its owners could
judge on evidence (the Stage 2 exit criterion).

This plan is first a **transition proposal**. SEED.md §4 requires each stage transition to
be proposed as an execution plan, approved by a Gardener, and recorded as a ring. It is
`active` because it is the live proposal, but no scope item below starts and no transition
ring is cut until the Gardener approves — mirroring how [plan 0002](../completed/0002-rooting.md)
opened ("drafted / awaiting transition approval") and [ring 0009](../../rings/0009-stage-1-transition-approved.md).

## Stage 1 exit criterion — evidence

Stage 1's exit criterion (SEED.md §4): *the seed detects its own drift automatically,
without being asked.* Met, with evidence in [plan 0002](../completed/0002-rooting.md):

- **Automatic drift detection.** The [doc-gardener](../../../skills/doc-gardener/SKILL.md)
  drift detector (`npm run garden`) reports `drift_count` (plan 0002 scope item 3; advisory
  per ring [0011](../../rings/0011-drift-advisory.md)), and the weekly
  [gardening-cadence](../../../.github/workflows/gardening-cadence.yml) workflow runs the
  sensing instruments on a schedule and files a gardening-pass issue when drift surfaces —
  so drift is caught even when no session opens (scope item 5, E-008). First hosted
  `workflow_dispatch` green on 2026-07-05.
- **Supporting organs,** each shipped with verification (LAW-6) and hosted-evidenced in plan
  0002: machinery self-tests (`npm test`, E-007 + the E-005 append-only gate), the
  plan-traceability gate (E-003), fitness v0 in CI with dated snapshots (scope item 4), and
  the automerge-scope gate plus CI runtime bump (E-008 + E-010).

## Scope — the Stage 2 skill garden

SEED.md §4 (Stage 2) grows six skills; each ships with its own verification (LAW-6). In
proposed execution order:

1. **grill-the-gardener** — architecture elicitation. Interview the Gardener until the
   target architecture (a) fits on one page, (b) is expressible as lintable rules, and
   (c) has an explicit human/agent ownership split; ambiguity ends the interview only by
   becoming a ring. Verification: produces a one-page architecture doc plus candidate lint
   rules, with a structural check that the doc exists and each stated rule names an
   enforcement (the principle-format discipline, SEED.md §2).
2. **repo-fitness** — read-only fitness assessment of *any* repository, producing a report a
   stranger could evaluate. The diagnostic instrument for hosts and the core of the Stage 2
   exit criterion. Verification: run against a fixture repo (and against this one) and assert
   the SEED.md §6 metrics compute without mutating the target.
3. **postmortem** — a failure yields three artifacts, never one: the fix, the invariant that
   prevents recurrence, and the ring recording the decision trail. Verification: a structural
   check that a postmortem entry links all three.
4. **parallel-worktrees** — decompose a large task across isolated git worktrees, one booted
   instance per worktree, torn down at task end; host-specific boot mechanics live in host
   adapters, not the genome. Verification: a dry-run that creates and tears down N worktrees
   and asserts isolation plus cleanup.
5. **onboard-human** — brief a new human: current state → goal, as conversation plus a
   generated md/html artifact. Verification: the artifact regenerates deterministically from
   repo state (the `docs/generated/` discipline; E-001's manifest when built).
6. **feedback** — open issues upstream against the mother seed from any repository (LAW-11).
   Verification: a dry-run that composes a well-formed upstream issue without posting.

This is the genome's Stage 2 menu, not yet a frozen build order: per-item build decisions
are cut as rings when each skill is designed (the plan 0002 precedent, where each scope item
carried its own decisions). The exit criterion governs completion, not the item count.

## Decision log

- **This plan is a proposal until approved.** Per SEED.md §4 a transition is proposed as a
  plan, approved by the Gardener, and recorded as a ring. No Stage 2 scope item starts and no
  transition ring is cut before approval — the [ring 0009](../../rings/0009-stage-1-transition-approved.md)
  precedent for Stage 0→1.
- **repo-fitness is the load-bearing organ; grill-the-gardener precedes it.** The exit
  criterion is a read-only foreign-repo assessment, which repo-fitness delivers — but a
  fitness verdict is only meaningful against a stated target architecture, which
  grill-the-gardener elicits. Hence the ordering.
- **Tier (ring [0010](../../rings/0010-model-effort-selection.md)).** This proposal is
  Gardener-judgment work — drafted at mid tier; the transition decision is the Gardener's.
  Once live, the skill-garden items are pattern-following work under their own verification
  (cheapest tier that clears the harness), with novel design and any surface that gates
  `main` at the top tier or a top-tier review pass.

## Progress log

- **2026-07-05** — Drafted at the close of [plan 0002](../completed/0002-rooting.md) (Stage 1
  complete, exit criterion evidenced above). Proposed for Gardener approval of the Stage 1→2
  (Rooting → Growth) transition (SEED.md §4). Awaiting approval; on approval a transition ring
  is cut (the ring 0009 pattern) and scope item 1 (grill-the-gardener) begins.

## Next actions

1. **Gardener:** approve (or amend) the Stage 1→2 (Rooting → Growth) transition. The Stage 1
   exit criterion is evidenced above, and SEED.md §4 forbids lingering past an exit criterion.
   On approval, the seed cuts the transition ring (the [ring 0009](../../rings/0009-stage-1-transition-approved.md)
   pattern) and updates the [AGENTS.md](../../../AGENTS.md) `Current state` stage line.
2. **Seed, on approval:** open scope item 1 (grill-the-gardener) with its verification, and
   log progress here — the plan 0002 rhythm.
