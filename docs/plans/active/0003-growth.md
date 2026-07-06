# Plan 0003 — Growth (Stage 2)

- Status: active

## Goal

Advance from Stage 1 (Rooting) to Stage 2 (Growth): grow the skill garden (SEED.md §4,
Stage 2) — the skills that make the seed useful beyond maintaining itself — until it can
assess a foreign repository without modifying it and produce a proposal its owners could
judge on evidence (the Stage 2 exit criterion).

This plan opened as a **transition proposal** (SEED.md §4 requires each stage transition to
be proposed as an execution plan, approved by a Gardener, and recorded as a ring). The
Gardener **approved** it on 2026-07-05, recorded as
[ring 0014](../../rings/0014-stage-2-transition-approved.md); Stage 2 (Growth) is now underway
and this is the governing execution plan — the same arc [plan 0002](../completed/0002-rooting.md)
followed via [ring 0009](../../rings/0009-stage-1-transition-approved.md).

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
- **2026-07-05** — Transition **approved** by the Gardener; recorded as
  [ring 0014](../../rings/0014-stage-2-transition-approved.md). Stage 2 (Growth) entered; this
  is the governing execution plan. AGENTS.md `Current state` and `fitness.ts` (`CURRENT_STAGE`)
  flipped to Stage 2; the transition surfaced that the current stage lives in two unchecked
  places, priced as [E-011](../entropy-ledger.md), and retired two now-stale "in Stage 1"
  claims (E-001's conversion path and `docs/generated/`). Scope item 1 (grill-the-gardener) is
  the live work; each Stage 2 skill cuts rings for its build decisions as it is designed (the
  plan 0002 rhythm).
- **2026-07-05** — Scope item 1, **grill-the-gardener**, planted. The skill
  ([skills/grill-the-gardener/SKILL.md](../../../skills/grill-the-gardener/SKILL.md)) is the
  architecture-elicitation interview procedure; its output is a one-page architecture doc in the
  new [docs/architecture/](../../architecture/README.md) organ. Verification (LAW-6):
  [`.seed/checks/validate-architecture.ts`](../../../.seed/checks/validate-architecture.ts) (in
  `run-all.ts`) binds every architecture doc to the interview's three exit conditions — one
  page, lintable rules each naming an enforcement, explicit human/agent ownership split —
  pinned by temp-copy cases in the self-tests. Build decision recorded as
  [ring 0015](../../rings/0015-grill-the-gardener-architecture-doc.md): the artifact format,
  the `docs/architecture/` home, the 500-word one-page cap, and the choice not to hand-author
  the seed's own architecture doc (it would duplicate the genome into a drift-prone second
  source). `npm run check` + `npm test` green; `drift_count` 0.
- **2026-07-05** — Scope item 2, **repo-fitness**, planted — the load-bearing organ of the
  Stage 2 exit criterion. The SEED.md §6 metric computation was generalized into one
  root-parameterized engine
  ([`.seed/lib/fitness-metrics.ts`](../../../.seed/lib/fitness-metrics.ts)); the seed's own
  self-assessment ([`fitness.ts`](../../../.seed/checks/fitness.ts)) became the `target=self`
  case, and the new [`repo-fitness.ts`](../../../.seed/checks/repo-fitness.ts) (`npm run
  repo-fitness -- <path>`) points the same engine at *any* repository — so what a metric means
  has one implementation (LAW-3). Against a foreign repo, each metric whose defining anatomy is
  absent reads `null` with a stated reason (the null IS the finding); `drift_count` is
  universal. The instrument is **strictly read-only**. The [skill](../../../skills/repo-fitness/SKILL.md)
  documents the Scout-step workflow. Verification (LAW-6):
  [`.seed/tests/self-test.ts`](../../../.seed/tests/self-test.ts) pins self-equivalence
  (`repo-fitness <seed>` metrics byte-identical to `fitness.ts`), honest degradation against a
  synthetic foreign repo, and non-mutation (target tree hash + git HEAD + status unchanged).
  Enabling refactor: `doc-drift.ts` now runs `main()` only when executed directly, so the
  engine imports `scanDrift` instead of shelling out (the old subprocess wart is gone). Build
  decision recorded as [ring 0016](../../rings/0016-repo-fitness-generalizes-the-metric-engine.md).
  `npm run check` (61/61 files, 100% reachable) + `npm test` (96 cases) green; `drift_count` 0.
- **2026-07-05** — Scope item 3, **postmortem**, planted — the discipline that a failure yields
  three artifacts, never one. The skill
  ([skills/postmortem/SKILL.md](../../../skills/postmortem/SKILL.md)) drives a failure into a
  fix, an enforceable invariant, and a decision-trail ring; its output is a numbered
  **postmortem entry** in the new [docs/postmortems/](../../postmortems/README.md) organ.
  Verification (LAW-6): [`.seed/checks/validate-postmortems.ts`](../../../.seed/checks/validate-postmortems.ts)
  (in `run-all.ts`) binds every entry to link all three — the `Fix` links a change, the
  `Invariant` names an enforcement mechanism *and* links its enforcer (the sharp LAW-2 point: a
  prose "invariant" is the "try harder" non-fix), and the `Ring` links an existing ring — plus
  the ring-numbering hygiene (filename, sequence, title, fields, a real date). The organ is
  **vacuous while empty** and binds when the first entry lands; no incident is fabricated (the
  ring 0015 precedent). Build decision recorded as
  [ring 0017](../../rings/0017-postmortem-three-artifacts-linked.md): numbered like a ring (a
  dated sequential incident), the three artifacts as local links held live by the map's
  dead-link gate, not append-only-gated (a living record that can be repointed when its
  machinery is refactored). `npm run check` + `npm test` green; `drift_count` 0.
- **2026-07-05** — First exercise of the postmortem discipline (dogfooding scope item 3):
  [postmortem 0001](../../postmortems/0001-agents-current-state-drift.md) metabolizes a real
  failure this plan's own work surfaced — the map's ([AGENTS.md](../../../AGENTS.md)) "Current
  state" named an already-landed scope item (repo-fitness) as "next work". Three artifacts,
  linked: the fix (the map correction in the scope-item-3 commit), the invariant (doc-only —
  prose-state agreement is not cheaply mechanizable; residual priced as
  [E-009](../entropy-ledger.md)'s first recurrence, with the mechanizable stage sibling tracked
  as E-011), and the ring ([0018](../../rings/0018-map-current-state-drift-doc-only.md)). Proves
  `validate-postmortems.ts` binds on a genuine entry, not only self-test fixtures. `npm run
  check` + `npm test` green; `drift_count` 0.
- **2026-07-05** — Scope item 4, **parallel-worktrees**, planted — decompose a large task across
  isolated git worktrees, one booted instance per worktree, torn down at task end (SEED.md §4,
  Stage 2). The skill ([skills/parallel-worktrees/SKILL.md](../../../skills/parallel-worktrees/SKILL.md))
  drives the decompose → create → boot → consolidate → teardown lifecycle;
  [`.seed/checks/worktrees.ts`](../../../.seed/checks/worktrees.ts) (`npm run worktrees -- dry-run`)
  owns the **host-agnostic** git lifecycle and a `HostAdapter` boot/teardown contract — host-specific
  boot mechanics (simulators, dev-build caches, Metro/Orbit fast boot) implement the contract and
  live in adapters *outside* the genome (the SEED.md §4 line), so the genome's default adapter is a
  no-op that treats the isolated checkout itself as the instance. Verification (LAW-6): the tool's
  own `dry-run` runs the whole cycle against a **hermetic scratch repo** it owns under the OS temp
  dir and removes at the end (so a run never touches the caller's tree), asserting isolation and
  cleanup and exiting non-zero on a defect;
  [`.seed/tests/self-test.ts`](../../../.seed/tests/self-test.ts) pins it — it works (the full
  lifecycle passes with the exact ordered check-set pinned so none can be silently dropped), its
  assertions have teeth (an injected leak fires the isolation leak-check; a skipped teardown fires
  the cleanup *and* teardown-dispatch checks — the host-adapter teardown half is observable, not
  just the git removal; both proven to bite by mutation), it is hermetic (the reported scratch repo
  is gone), and it is caller-invariant (running it from inside a git repo leaves that repo
  byte-identical). Build decision recorded as
  [ring 0019](../../rings/0019-parallel-worktrees-host-agnostic-lifecycle.md). `npm run check` +
  `npm test` green; `drift_count` 0.
- **2026-07-05** — Scope item 5, **onboard-human**, planted — brief a new human, current state →
  goal, as conversation plus a generated artifact (SEED.md §4, Stage 2). The skill
  ([skills/onboard-human/SKILL.md](../../../skills/onboard-human/SKILL.md)) briefs from the map;
  its durable output is [docs/generated/onboarding.md](../../generated/onboarding.md) — the
  **first** artifact in `docs/generated/`, so this item also built E-001's conversion path. The
  generation manifest ([`.seed/lib/generated.ts`](../../../.seed/lib/generated.ts)) registers each
  artifact with its sources, regeneration command, and a **pure** `generate(root)` — the single
  definition of what the artifact is (LAW-3), shared by the generator
  ([`.seed/checks/generate.ts`](../../../.seed/checks/generate.ts), `npm run generate`) and the
  gate. The briefing sources from AGENTS.md (the stage line + the active plans it links), not a
  directory listing, so it stays anchored to the map (LAW-4) and deterministic against stray files;
  it embeds no wall-clock, so it regenerates byte-identically. Verification (LAW-6):
  [`.seed/checks/validate-generated.ts`](../../../.seed/checks/validate-generated.ts) (in
  `run-all.ts`) re-runs each generator and fails on a hand-edit, a source changed without
  regenerating, an unregistered file in `docs/generated/`, or a missing artifact — a `run-all`
  gate, not an advisory number, because a stale generated artifact is a correctness defect, not a
  trend. [`.seed/tests/self-test.ts`](../../../.seed/tests/self-test.ts) pins the pristine match, a
  deterministic fixpoint (regenerate → byte-identical, tree green), and each fire (hand-edit,
  changed source, moved anchor, unregistered file, missing artifact). This converts
  **[E-001](../entropy-ledger.md)** to Paid. Build decision recorded as
  [ring 0020](../../rings/0020-onboard-human-generated-briefing.md). `npm run check` + `npm test`
  green; `drift_count` 0.

## Next actions

1. ✅ **Transition approved** (2026-07-05) — recorded as
   [ring 0014](../../rings/0014-stage-2-transition-approved.md); Stage 2 entered, this plan
   governing, [AGENTS.md](../../../AGENTS.md) `Current state` + `fitness.ts` flipped.
2. ✅ **Scope item 1 — grill-the-gardener planted** (2026-07-05): the elicitation skill plus
   its structural verification (`validate-architecture.ts`) and the `docs/architecture/` organ;
   build decision in [ring 0015](../../rings/0015-grill-the-gardener-architecture-doc.md).
3. ✅ **Scope item 2 — repo-fitness planted** (2026-07-05): the read-only §6 assessment of any
   repository, built as one root-parameterized engine shared by self- and foreign-assessment
   (LAW-3), degrading absent-anatomy metrics to `null` with reasons and proven not to mutate the
   target; build decision in [ring 0016](../../rings/0016-repo-fitness-generalizes-the-metric-engine.md).
4. ✅ **Scope item 3 — postmortem planted** (2026-07-05): the numbered
   [postmortem entry](../../postmortems/README.md) and its structural verification
   ([`validate-postmortems.ts`](../../../.seed/checks/validate-postmortems.ts)) binding every
   entry to link all three artifacts — fix, enforceable invariant, and an existing ring; build
   decision in [ring 0017](../../rings/0017-postmortem-three-artifacts-linked.md).
5. ✅ **Scope item 4 — parallel-worktrees planted** (2026-07-05): the decompose-across-isolated-
   worktrees lifecycle ([`.seed/checks/worktrees.ts`](../../../.seed/checks/worktrees.ts)) plus its
   `HostAdapter` boot contract (host-specific boot mechanics live in adapters outside the genome,
   the SEED.md §4 line) and its hermetic self-verifying dry-run; build decision in
   [ring 0019](../../rings/0019-parallel-worktrees-host-agnostic-lifecycle.md).
6. ✅ **Scope item 5 — onboard-human planted** (2026-07-05): brief a new human, current state →
   goal, as conversation plus [docs/generated/onboarding.md](../../generated/onboarding.md), the
   first `docs/generated/` artifact — generated from the map, verified by deterministic
   regeneration ([`validate-generated.ts`](../../../.seed/checks/validate-generated.ts)), landing
   the generation manifest that converts **E-001** to Paid; build decision in
   [ring 0020](../../rings/0020-onboard-human-generated-briefing.md).
7. **Seed:** open scope item 6 — **feedback** (open a well-formed upstream issue against the mother
   seed without posting, LAW-11) — the last item on the Stage 2 menu. Then the exit criterion —
   assess a foreign repo read-only and produce an evidence-judgeable proposal — is in reach: its two
   load-bearing organs (grill-the-gardener + repo-fitness) are planted. Ship each with its
   verification, cut a ring per build decision, log progress here.
