# Plan 0009 — dither Metabolize (Pollination step 5)

- Status: active

## Goal

Run SEED.md §4 **step 5 — Metabolize** on the first external host, dither, now that the
Propose→Graft is complete ([plan 0007](../completed/0007-dither-graft.md): all four graft organs live
on dither `main`, hosted CI green). Metabolize is **two agent-driven tracks running in parallel,
indefinitely** — **refactor-toward-architecture** and **feature work** — with **fitness trends
arbitrating pace and priority** between them (SEED.md §4; LAW-9). Unlike every prior step, it is not a
discrete deliverable: this plan governs the ongoing metabolism of dither and stays active until the
per-host **exit criterion** is met — *dither's fitness trend is positive over a sustained window, and
its owner ships features through the agent workflow without the seed being special* (SEED.md §4).

This plan **opens as a proposal** (the [plan 0007](../completed/0007-dither-graft.md) precedent): a
refactor mutates dither, and **every dither mutation gates on the owner** (LAW-1, the owner gate). No
refactor lands before the owner's go; the seed-side setup, the read-only pre-flight, and the queue
below are payable now.

## The two tracks

- **Refactor-toward-architecture** *(agent-driven; the seed paces it by ledger interest).* Digest
  dither's [entropy ledger](https://github.com/fliip92/dither/blob/main/docs/plans/entropy-ledger.md) —
  the structural entries — into invariants that make [dither.md](../../architecture/dither.md)'s Rules
  mechanically true, converging code to the elicited architecture. Each refactor is one ledger entry
  paid via its conversion path, shipping its own verification (LAW-6), its build decision cut as a ring.
- **Feature work** *(owner-driven; the owner sets priorities).* dither's product build-out — the
  [architecture.md](https://github.com/fliip92/dither/blob/main/docs/architecture.md) build order
  (Gateway → Workshop → Phone → instrumentation → cohort). The agent does the work **through the agent
  workflow**: commits cite the ADR they enact (the item-2 gate), new decisions become ADRs, sensed
  entropy is priced (LAW-8). The feature-adjacent ledger entries (E-003 wgpu device test, E-004 `.droid`
  import path, E-005 local-brain, E-008 build-time decisions) live on this track, resolved as their
  build-order steps arrive.

**Fitness arbitrates (SEED.md §6, LAW-9).** [repo-fitness](../../../skills/repo-fitness/SKILL.md) is
measured on cadence; the before/after-graft delta is the pollination proof. The refactor track shows in
a rising `ledger_trend` (debt digested), a holding/rising `enforcement_ratio`, and a climbing
`map_reachability`; the feature track in product velocity. When structural debt compounds faster than
features need it clean, the refactor track takes pace; when the product needs to move, it yields
(LAW-8). The metric that stops tracking real health gets replaced — via ring (SEED.md §6).

## The refactor queue (dither's ledger, structural entries by interest)

1. **[E-001] — import-boundary test** (medium) — dither.md Rule 5; the priced first refactor. **U1
   below.**
2. **[E-002] — self-test the grafted `.seed/` gates** (medium) — the gates guard the repo; nothing
   guards the gates ([ring 0038](../../rings/0038-dither-adr-gate-graft.md) named the gap). Port the
   seed's E-007 self-test harness, scoped to dither's five gates. **Done — U2 below.**
3. **[E-007] — map reachability sweep** (medium) — raise `map_reachability` by linking dither's stranded
   docs into the map's hop graph. A gardening pass — whose pre-flight found the metric itself
   source-floored, so the Seed rescoped it to knowledge artifacts first (ring 0043 / E-019). **Done — U3
   below.**
4. **[E-006] — two stale spike refs** (low) — a gardening deletion; fix or externalize the two paths.
   **Done — U4 below.**

E-003 / E-004 / E-005 / E-008 are feature-track (owner-driven), resolved at their build-order steps.
The queue is re-ordered as fitness moves and as new entropy is sensed — it is a live priority, not a
frozen build order.

## Work units

*Refactors are added as units as the queue is worked; feature-track work is owner-paced and tracked in
dither's own surfaces (ADRs, Issues), not enumerated here. The [work-unit format](../README.md)
(ring [0036](../../rings/0036-work-unit-format.md)) fits this indefinite cross-session track.*

### U1 — E-001: enforce the app→package import boundary; correct the drifted target first
- Status: done
- Landed: dither `607bc64` (local; push Gardener-gated) — [ring 0041](../../rings/0041-dither-import-boundary-gate.md)
- Scope: **(a)** correct the architecture target where it is drifted from dither's code (below) — the
  seed's [dither.md](../../architecture/dither.md) Rule 5 + Shape (seed-side), and surface dither's own
  `architecture.md` line 94 to the owner; **(b)** a host-owned structural import-boundary check in
  dither's `.seed/checks/` over the verbatim engine (the rings [0037](../../rings/0037-dither-map-gate-graft.md)–[0040](../../rings/0040-dither-ledger-graft.md)
  pattern: one host-owned runner over a byte-identical `.seed/lib/repo.ts`, reading the committed tree
  via `git ls-files`), asserting the **direction rule** — no `packages/**` imports `apps/**` — wired as
  a `ci.yml` step + a `check:imports` script. In scope of the boundary as the target is corrected: the
  real inter-package graph (`droid-file`→`traits`, `matrix`→`traits`, `matrix-playground`→`matrix`,`traits`).
  Out of scope: any behavior change to dither's product code.
- Entry-context: [dither.md](../../architecture/dither.md) Rule 5 + Shape; dither ledger
  [E-001](https://github.com/fliip92/dither/blob/main/docs/plans/entropy-ledger.md); dither's
  [architecture.md](https://github.com/fliip92/dither/blob/main/docs/architecture.md) line 94 (build
  order) + package list (lines 32–38) + [ADR-0002](https://github.com/fliip92/dither/blob/main/docs/adr/0002-pnpm-monorepo.md);
  the pre-flight finding + declared graph in this plan's Decision log; the graft runner pattern
  ([dither `principles-gate.ts`](https://github.com/fliip92/dither/blob/main/.seed/checks/principles-gate.ts)
  over `.seed/lib/repo.ts`).
- Done-when: dither.md Rule 5 + Shape state the code's real graph (and dither's `architecture.md` drift
  is surfaced to the owner); the import-boundary check runs in dither CI, **GREEN** on the current tree;
  **TEETH** — a seeded `packages/*`→`apps/*` import (and a disallowed cross-package edge) fails it with a
  Rule-5 / LAW-naming message; a seed-side ring records the build decision + the target correction; the
  landing range is green on all five gates; `.seed/` stays outside dither's pnpm workspace so
  lint/typecheck/test are unaffected.
- Owner: agent
- Depends-on: the owner's target-drift fork decision

### U2 — E-002: self-test the grafted `.seed/` gates (the verification of the verifiers)
- Status: done
- Landed: dither `9f41427` (local; push Gardener-gated) — [ring 0042](../../rings/0042-dither-gates-self-test.md)
- Scope: a committed structural self-test, dither's
  [`.seed/tests/gates-self-test.ts`](https://github.com/fliip92/dither/blob/main/.seed/tests/gates-self-test.ts)
  over the verbatim engine, that for each of dither's **five** gates proves the pristine committed
  tree passes and seeds each load-bearing violation class into an isolated git clone, asserting the
  gate fires (exit 1, its law-naming message); wired as a `ci.yml` `Gates self-test` step + a
  `check:gates` script, `.seed/` staying outside the pnpm workspace. In scope: the **no-eighth-principle**
  decision (the self-test is LAW-6 verification, not a product norm — `CLAUDE.md`'s *Enforced norms*
  categorizes it, `enforcement_ratio` held 7/7) and E-002 Open→Paid. Out of scope: any product-code
  change; a sixth gate.
- Entry-context: [ring 0038](../../rings/0038-dither-adr-gate-graft.md) (named the gap); the seed's
  [self-test.ts](../../../.seed/tests/self-test.ts) (the port source, scoped down); dither's five gate
  runners over the verbatim `.seed/lib/repo.ts`; [ring 0041](../../rings/0041-dither-import-boundary-gate.md)'s
  *Revisit-when* (this closes it — a gate's teeth now live in a committed harness, not only a ring).
- Done-when: the self-test runs in dither CI, **GREEN + 15/15** on the current tree (5 baselines + 10
  teeth); **TEETH** — each gate's seeded violation fires it, and neutering a gate turns its tooth red
  (the test-of-the-test); **no eighth principle** (`enforcement_ratio` 7/7 held); E-002 Open→Paid
  (`ledger_trend` +7 → +6); the landing range green on all five gates **and** the self-test; seed-side
  `npm run check` + `npm test` green.
- Owner: agent
- Depends-on: E-001 landed (the fifth gate must exist to be self-tested)

### U3 — E-007: map reachability sweep — rescope the metric to docs, then link dither's stranded docs
- Status: done
- Landed: seed metric rescope — [ring 0043](../../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md) + [E-019](../entropy-ledger.md); dither `c058fbc` (gardening; local, push Gardener-gated)
- Scope: **(a) seed-side** — rescope `map_reachability`'s denominator to knowledge artifacts (`.md`) in
  the shared [`analyzeReachability`](../../../.seed/checks/validate-map.ts), the **GATE untouched** (the
  seed still enforces total reachability — a stray unreachable `.ts` still fails seed CI — and dither
  still gates only broken links); a [self-test](../../../.seed/tests/self-test.ts) twin pinning that an
  unreachable non-doc leaves the metric at 1.0; SEED.md §6's definition updated; [E-019](../entropy-ledger.md)
  priced + paid. **(b) dither-side** — re-copy the rescoped `validate-map.ts` verbatim, then link
  dither's 14 own stranded docs from `CLAUDE.md` (backtick doc-refs made real + a `## Map` section),
  `map-gate.ts` wording matched, dither's E-007 Open→Paid. Out of scope: excluding the 43 vendored
  `.agents/skills/*.md` from the denominator (ring 0043 Revisit — a separate host-side decision); the one
  test-fixture doc.
- Entry-context: the E-007 read-only pre-flight finding (Decision log below) — the metric was
  source-floored (283 of dither's 386 files are source) and the plan's named targets (ADRs/spikes/`CONTEXT.md`)
  were already reachable; the real stranded set was dither's own per-app/cohort docs + vendored skills;
  the Gardener chose "scope the denominator to docs" over vendored-exclusion or garden-only.
- Done-when: seed reads 100% (94/94 docs) unchanged, `npm run check` + `npm test` green with the new
  self-test case; dither reads 11.9% → 32.9% (re-copy) → **48.2%** (gardening, 41/85 docs), 0 broken
  links, all five gates + the self-test green on the landing range; dither's E-007 + the seed's E-019
  Open→Paid.
- Owner: agent
- Depends-on: E-002 landed **and its hosted CI green** — the self-test the re-copy must not break (its
  CI caught a real `.git`-copy race first; see the Progress log)

### U4 — E-006: fix the two stale spike refs (a gardening deletion, no new instrument)
- Status: done
- Landed: dither `0f078ef` (local; push Gardener-gated) — [ring 0044](../../rings/0044-dither-e006-stale-spike-refs-gardened.md)
- Scope: the two backtick path refs the seed's `drift_count` scan flags in dither's frozen feasibility
  spikes — **(a)** relabel the ExecuTorch reference in `docs/spikes/executorch-lora-adapter-feasibility.md`
  to its upstream-qualified path (`pytorch/executorch/…`, link href unchanged) so it reads external and
  no longer collides with dither's `docs/` namespace; **(b)** reduce the never-built illustrative phone
  path in `docs/spikes/local-brain-experience-feasibility.md` to the module identifier `leanPrompt`; and
  **(c)** E-006 Open→Paid. In scope: the **no-new-instrument** decision (a gardening deletion's LAW-6
  verification is the standing drift scan, not a new gate — `enforcement_ratio` held 7/7) and the
  content-fix choice over scoping-spikes-out or refining-the-scanner. Out of scope: any seed instrument
  change; grafting the drift scan into dither CI; any product-code change.
- Entry-context: the E-006 pre-flight (Decision log below) — drift confirmed exactly 2, both refs as the
  ledger names, fixes validated against the real `pathClaims` tokenizer; dither ledger
  [E-006](https://github.com/fliip92/dither/blob/main/docs/plans/entropy-ledger.md); the seed's
  [doc-drift.ts](../../../.seed/checks/doc-drift.ts) (`isScanned` surface + the `stale-path-reference`
  class); [ring 0043](../../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md) (the prior
  gardening refactor).
- Done-when: the seed's `drift_count` scan of dither reads **0** (was 2); dither's E-006 Open→Paid
  (`ledger_trend` +5 → +4); **no new principle, no new gate** (`enforcement_ratio` 7/7 held); the landing
  range green on all five gates + the gates self-test; a seed-side ring records the gardening pass;
  seed-side `npm run check` + `npm test` + `npm run garden` green.
- Owner: agent
- Depends-on: E-007 landed **and its hosted CI green** (dither run 29797280462 on `c058fbc` — success),
  so the gardening builds on the reachability-swept tree.

### U5 — E-009: entropy-sensing pass (queue drained); convert the theme-layout drift
- Status: done
- Landed: dither `eeb5fdd` (local; push Gardener-gated) — [ring 0045](../../rings/0045-dither-sensing-pass-theme-layout.md)
- Scope: run the metabolism (SEED.md §3) on dither now the structural queue is drained — a read-only
  sensing pass (fitness, the existing ledger, structure/map, a marker/stub/deferral sweep, the risk
  register, the test surface, branch-protection posture) — then **(a)** price the one genuine finding,
  **E-009** (architecture.md's Repo layout omits `@dither/theme`), and **(b)** convert it: add the
  `theme/` line so the layout matches `git ls-files` and the doc's own build-order line. In scope: the
  honesty filter — candidates checked and deliberately **not** priced (branch protection: the seed's own
  main is likewise unprotected; graphify: a deliberate optional aid; the `escalation_rate` /
  `plan_traceability` nulls: by-design), and E-010 (vendored-doc reachability floor) left as
  [ring 0043](../../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md)'s Revisit rather than a
  dither entry. Out of scope: manufacturing entropy to fill the drained queue; a new "layout
  completeness" gate (LAW-7, one occurrence).
- Entry-context: the sensing-pass findings (Decision log below + ring 0045); dither's
  [architecture.md](https://github.com/fliip92/dither/blob/main/docs/architecture.md) Repo layout vs its
  build-order line 94; the seed's [doc-drift.ts](../../../.seed/checks/doc-drift.ts) (why a *missing*
  entry is uncaught); [ring 0044](../../rings/0044-dither-e006-stale-spike-refs-gardened.md) (the
  gardening-fix shape).
- Done-when: dither's `drift_count` stays 0; E-009 priced + converted (Paid in the same pass, so
  `ledger_trend` +4 unchanged — no new open debt); the layout diagram matches the committed package set
  (5 packages) and the build-order line; the landing range green on all five gates + the gates self-test;
  a seed-side ring records the pass (including what was *not* priced); seed-side `npm run check` +
  `npm test` + `npm run garden` green.
- Owner: agent
- Depends-on: the structural queue drained (E-001/E-002/E-007/E-006 all Paid) — the sensing pass is the
  refactor track's default work once no priced structural entry is pending.

## Decision log

- **Opens as a proposal; every dither mutation gates on the owner** (LAW-1; the
  [plan 0007](../completed/0007-dither-graft.md) owner-gate precedent — the Graft did not mutate dither
  before approval, and each item was owner-started, built locally, and Gardener-pushed). The seed-side
  setup and the read-only pre-flight are payable now; the E-001 build lands only on the owner's go.

- **E-001 read-only pre-flight — a target-drift finding (dither byte-identical).** Building the E-001
  test requires the allowed import graph as its oracle, so the pre-flight read dither's real graph
  (declared `@dither/*` deps + source imports, read-only) against the stated one. It **splits E-001 in
  two:**
  - **The direction rule holds and is cleanly enforceable now.** No `packages/**` file imports any
    `apps/**` — apps depend on packages, never the reverse. This is the load-bearing invariant (it is
    what keeps packages reusable — the phone swapping `matrix` presentation to Skia, the Gateway staying
    droid-stateless). E-001 enforces this immediately: green today, teeth on a seeded reverse edge.
  - **The stated inter-package graph is drifted from the code.** [dither.md](../../architecture/dither.md)
    Rule 5 / Shape say *"`traits` and `matrix` build on `droid-file`, not each other."* The code is the
    **opposite**: `traits` (and `theme`) are the foundation — they import no `@dither/*` package;
    **`droid-file` → `traits`** (a value import, `TRAIT_DIMENSIONS`, in `validate.ts`, not only types) and
    **`matrix` → `traits`** (`MatrixIdentity`, `Palette`). Nothing but apps depends on `droid-file`. So
    (1) the direction `traits`→`droid-file` is inverted, and (2) `matrix`→`traits` is exactly the peer
    edge "not each other" says should not exist. (The Gateway clause — *"shares only `droid-file`/`traits`"*
    — is **correct**: `gateway` → `droid-file`, `traits`.)
  - **Source of the drift.** dither's own [architecture.md](https://github.com/fliip92/dither/blob/main/docs/architecture.md)
    line 94 (Build order) reads *"`packages/droid-file` … everything else depends on it"* — a build-
    **sequencing** note (build droid-file first) that the seed's Grill distilled into a specific
    dependency-**direction** graph, sharpening a loose sequencing claim into a false one. The seed's own
    dither.md inherited the error — this is seed-side entropy about the elicitation.

- **Recommendation: fix the docs to the code, then enforce (pending the owner's fork).** The code's graph
  is clean and correct — `traits` holds the shared domain vocabulary (`TraitVector`, `MatrixIdentity`,
  `Palette`), so `droid-file` and `matrix` both building on `traits` is exactly right. So the honest first
  Metabolize act is to **correct the target**, not the code: repoint the seed's dither.md Rule 5 + Shape
  to the real graph (seed-side, no dither gate), and **surface** dither's `architecture.md` line 94 to
  the owner (owner-doc — the seed reports drift, the owner fixes it, method-not-dogma; likely a one-line
  dither edit or a note, possibly a [feedback](../../../skills/feedback/SKILL.md) item). Then E-001
  enforces the corrected graph: the direction rule (undrifted) as the load-bearing invariant, and — as
  the target is now true — the real inter-package edges as a second assertion.

- **The fork is the owner's (grounded-or-ask; LAW-10).** Two readings of the drift, and the seed does
  not pick for the owner: **(A)** the code graph is the intended target → fix the docs (recommended;
  cheap, and the code is sensible); **(B)** the doc graph is the intended target → a real code refactor
  (make `traits`/`matrix` build on `droid-file`, remove the `matrix`→`traits` edge). (B) inverts a clean
  layering and is very unlikely, but which is *truth* is the owner's call — this is exactly the ambiguity
  the metabolism routes to a decision rather than baking a silent assumption into a lint (SEED.md §5).

- **Mechanism: an owned script, not a dependency (LAW-7).** The import-boundary check is a small owned
  TypeScript runner over the seed's verbatim engine — the four-gate graft pattern — not an imported
  `dependency-cruiser`. The needed subset (walk `git ls-files`, read each `packages/*`/`apps/*` source
  file's imports, resolve `@dither/*` + boundary-crossing relative imports, assert the allowed edges) is
  small and fully ownable/instrumentable/testable (LAW-7). The build design is cut as a ring when
  designed (the per-item ring rhythm, rings 0037–0040).

- **Feature track runs on the owner's cadence, not the seed's.** The seed paces the refactor queue by
  ledger interest; feature priority is the owner's (SEED.md §5). The seed does not manufacture feature
  work — it does the owner's product work through the agent workflow and keeps the metabolism honest
  around it (price sensed entropy, cite ADRs, measure fitness).

- **Branch-protection residual still carried** ([E-005](../entropy-ledger.md)/[E-008](../entropy-ledger.md);
  flagged since the Stage 4 transition) — the seed's gates run in dither CI, but enforcing them on `main`
  is the owner's call. Named, not silently deferred.

- **Tier** ([ring 0010](../../rings/0010-model-effort-selection.md)): this proposal + pre-flight drafted
  mid tier; the E-001 build against a real host (a dither mutation) runs at top tier or a top-tier review
  pass — the first-mutation discipline (plan 0007).

- **E-007 read-only pre-flight — the metric was the entropy, not the links (the E-001 pattern again).**
  Measuring dither's stranded set to scope the sweep found the plan's named targets (the ADR index, the
  spikes, the `CONTEXT.md` files) **already reachable** via the item-3 / item-4 graft hubs
  (`docs/adr/README.md`, `CONTEXT-MAP.md`), and `map_reachability` itself **source-floored** — its
  all-files denominator (283 of dither's 386 files are source) capped it near ~15% however well tended, so
  the one metric meant to prove pollination value had gone insensitive to doc gardening. Surfaced to the
  Gardener as three options (scope denom to docs / exclude vendored only / garden only); the Gardener chose
  **scope the denominator to knowledge artifacts (docs)**. So E-007 split like E-001: a seed-side metric
  rescope ([ring 0043](../../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md) /
  [E-019](../entropy-ledger.md)) then the dither-side gardening. The 43 vendored `.agents/skills/*.md`
  stay counted (dither lands at 48.2%, not higher) — excluding them is a separate host-side decision
  (ring 0043 Revisit), not folded into this metric change.

## Progress log

- **2026-07-19** — **Opened as the Metabolize proposal** at the close of the dither Propose→Graft
  ([plan 0007](../completed/0007-dither-graft.md) completed — all four graft organs pushed to dither
  `main`, hosted CI green). Framed the two tracks + fitness arbitration + the per-host exit criterion,
  and ordered the refactor queue by ledger interest (E-001 → E-002 → E-007 → E-006; the feature-adjacent
  entries owner-paced). Ran the **E-001 read-only pre-flight** on dither (byte-identical, no mutation):
  the app→package **direction rule holds** and is cleanly enforceable, but the **stated inter-package
  graph is drifted from the code** (Decision log) — the first refactor-toward-architecture step finds the
  architecture *target itself* is entropy, sourced from dither's `architecture.md` line 94 and inherited
  by the seed's dither.md. Recommendation: correct the target (docs → code), then enforce the direction
  rule. **Awaiting the owner's fork decision (A fix docs / B refactor code) + the go to build E-001.** No
  dither mutation yet. `npm run check` + `npm test` green seed-side.
- **2026-07-19** — **U1 / E-001 done — the first Metabolize refactor landed on dither** (`607bc64`, local;
  push Gardener-gated; [ring 0041](../../rings/0041-dither-import-boundary-gate.md)). The Gardener chose the
  fork **A — fix docs to code**: the target was corrected first (this seed's
  [dither.md](../../architecture/dither.md) Rule 5 + Shape; dither's own `architecture.md` build-order line)
  to the code's real graph — `traits`/`theme` foundational, `droid-file` and `matrix` → `traits` — then
  enforced. [`.seed/checks/import-boundary.ts`](https://github.com/fliip92/dither/blob/main/.seed/checks/import-boundary.ts)
  over the verbatim engine asserts R1 (no package→app) / R2 (package independence) / R3 (Gateway-thin); a
  seventh principle (`package-boundaries-hold`) keeps [ring 0039](../../rings/0039-dither-principles-gate-graft.md)'s
  completeness claim honest. Verified: **GREEN** on dither's tree (228 source files) + **TEETH 9/9** on a
  throwaway; the landing range `8ce4e11..607bc64` is green on all five gates; `enforcement_ratio` **100%
  (7/7)**, `map_reachability` 11.3% → **11.7%**, E-001 **Open→Paid** so `ledger_trend` **+8 → +7** (dither's
  first digested debt), `drift_count` held at 2. Seed-side `npm run check` + `npm test` green.
- **2026-07-19** — **U2 / E-002 done — the second Metabolize refactor landed on dither** (`9f41427`, local;
  push Gardener-gated; [ring 0042](../../rings/0042-dither-gates-self-test.md)). The Gardener had pushed E-001
  (`607bc64`) + the seed-side record; the gates self-test is the second refactor.
  [`.seed/tests/gates-self-test.ts`](https://github.com/fliip92/dither/blob/main/.seed/tests/gates-self-test.ts)
  — a scoped port of the seed's [self-test.ts](../../../.seed/tests/self-test.ts) — copies the committed tree
  (`git ls-files`), git-inits it, and for each of the five gates proves the pristine tree passes then seeds
  each load-bearing violation class into an isolated clone, asserting the gate fires (exit 1, its law-naming
  message). **No eighth principle**: the self-test is the gates' LAW-6 verification, not a product norm (the
  seed's own self-test is likewise not a principle) — `CLAUDE.md`'s *Enforced norms* categorizes it, and
  `enforcement_ratio` stays **7/7**. Verified: **GREEN + 15/15** (5 baselines + 10 teeth); the
  **test-of-the-test** — neutering `map-gate` turns its tooth red. `map_reachability` 11.7% → **11.9%**,
  E-002 **Open→Paid** so `ledger_trend` **+7 → +6** (the second digestion), `drift_count` held at 2; the
  landing range `607bc64..9f41427` green on all five gates + the self-test. Seed-side `npm run check` +
  `npm test` green. Closes [ring 0041](../../rings/0041-dither-import-boundary-gate.md)'s *Revisit-when*.
- **2026-07-20** — **E-002's hosted CI caught a real bug the local 15/15 missed.** The gates self-test
  `cpSync`-cloned its baseline *including* `.git`, and CI's detached auto-gc repacked it mid-copy
  (`std::filesystem: directory iterator cannot open directory`, exit 134) — the seed's own self-test is
  immune (it excludes `.git` and re-inits; dither's port keeps `.git` for a shared baseSha, so it freezes
  it instead). Fixed by disabling auto-gc on the baseline commit (`gc.auto=0` + `maintenance.auto=false`,
  inline on the commit). Two commits: the first fix (`9522128`) deleted the `git init` line in a follow-up
  edit and was itself caught by CI — a re-verify-after-the-last-edit lesson — and the corrected `edec7fd`
  went **green** (run 29796090886). A bugfix to E-002, recorded here (not a ring), cited via the dither
  commits' `Seed plan 0009 / E-002`.
- **2026-07-20** — **U3 / E-007 done — the third Metabolize refactor, its scope rewritten by the
  pre-flight** (Decision log; the E-001 pattern). The Seed rescoped `map_reachability` to knowledge
  artifacts ([ring 0043](../../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md) /
  [E-019](../entropy-ledger.md); [validate-map.ts](../../../.seed/checks/validate-map.ts), the GATE
  untouched + a self-test twin pinning that an unreachable non-doc stays at 1.0) because measuring dither
  found it source-floored (~15% ceiling) and the plan's named targets already reachable; then the sweep
  re-copied the rescoped engine verbatim and linked dither's own stranded docs from `CLAUDE.md`
  (dither `c058fbc`, local). **Seed 100% (94/94 docs)** unchanged in value; **dither 11.9% → 32.9%
  (re-copy) → 48.2% (41/85 docs)**, 0 broken links, residual = 43 vendored skill docs + 1 test fixture.
  dither's E-007 + the seed's E-019 Open→Paid. All five dither gates + the self-test green on the landing
  range `edec7fd..c058fbc`; seed `npm run check` + `npm test` green.
- **2026-07-20** — **U4 / E-006 done — the fourth Metabolize refactor, and the first that adds no
  instrument** (dither `0f078ef`, local; push Gardener-gated;
  [ring 0044](../../rings/0044-dither-e006-stale-spike-refs-gardened.md)). The Gardener chose the
  content-fix fork. The E-006 pre-flight confirmed dither's `drift_count` was exactly 2 (both refs as the
  ledger names) and validated each fix against the real `pathClaims` tokenizer — catching that a
  *space-separated* relabel stays flagged (the backtick span is re-split on whitespace), so only a single
  non-colliding token clears it. The ExecuTorch reference — a valid markdown link to upstream whose
  backtick label merely collided with dither's `docs/` namespace — was relabeled `pytorch/executorch/…`;
  the never-built illustrative phone path was reduced to `leanPrompt`. Unlike E-001/E-002/E-007, **E-006
  builds no gate or self-test** — its LAW-6 verification is the standing drift scan, which now reads
  **`drift_count` 2 → 0**. `enforcement_ratio` held **7/7** (no new principle), `ledger_trend` **+5 → +4**
  (dither's fourth digested debt), `map_reachability` 48.2% unchanged. The landing range
  `c058fbc..0f078ef` is green on all five gates + the gates self-test; seed-side `npm run check` +
  `npm test` + `npm run garden` green. Considered and rejected: scoping frozen spikes out of the drift
  surface (a Seed-wide change for one host's two low-interest refs) and refining the scanner to skip
  link-labeled backticks (LAW-7 complexity for a genuinely-misleading pattern). *(The
  `(E-006: anchors unchecked)` comment in `doc-drift.ts` is the seed's own unrelated E-006 — a
  same-number coincidence.)*
- **2026-07-20** — **U5 / entropy-sensing pass — the refactor track's first "sense" cycle after the
  structural queue drained** (dither `eeb5fdd`, local; push Gardener-gated;
  [ring 0045](../../rings/0045-dither-sensing-pass-theme-layout.md)). With E-001/E-002/E-007/E-006 all
  digested, the Gardener directed a sensing pass (AGENTS.md §"Nothing active?"). It found **dither
  substantially clean** — `drift_count` 0, no genuine `// TODO`/`FIXME`/`HACK` (the 115 raw hits were the
  phone's `todo_*` product feature), no stubs, the risk register fully accounted (2 pending-action
  entries + 3 mitigated-by-decision excluded), 7 principles one-per-norm, well-tested (77 test files /
  148 source; the seal has a tamper fixture). **One genuine finding, priced + converted: E-009** —
  architecture.md's Repo-layout diagram omitted `@dither/theme` (a foundation package imported by ~10
  files), a residual of the E-001 correction (which fixed the doc's build-order direction line but not
  the layout diagram), uncaught because no gate reads prose for a *missing* entry; the `theme/` line was
  added so the diagram matches `git ls-files` and the build-order line. Sensed-and-paid in one pass →
  `ledger_trend` +4 unchanged, `drift_count` 0, all five gates + self-test green on `0f078ef..eeb5fdd`.
  **Deliberately not priced** (the honesty filter — not manufacturing entropy): branch protection (the
  seed's own main is also unprotected — inherited posture), graphify (a deliberate optional aid), the
  `escalation_rate` / `plan_traceability` nulls (by-design); E-010 (vendored-doc reachability floor) left
  as ring 0043's Revisit per the Gardener. Seed-side `npm run check` + `npm test` + `npm run garden` green.

## Next actions

1. **E-001 (U1) / E-002 (U2) / E-006 (U4) / E-007 (U3) — landed, pushed, hosted-CI green.** The four
   structural refactors all stand on dither `main`; E-006's run
   [29798876491](https://github.com/fliip92/dither/actions/runs/29798876491) was the latest green (all
   five gates + the gates self-test + lint/typecheck/test), on the reachability-swept, drift-0 tree
   (`map_reachability` 48.2%, `enforcement_ratio` 7/7, `ledger_trend` +4).
2. **E-009 (U5) — DONE, held for the Gardener's push** (seed
   [ring 0045](../../rings/0045-dither-sensing-pass-theme-layout.md) + dither `eeb5fdd`, local). The first
   entropy-sensing pass after the queue drained: dither found substantially clean, one genuine finding
   priced + converted — `@dither/theme` added to architecture.md's Repo layout so it matches the
   committed package set (`drift_count` 0, `ledger_trend` +4 unchanged — sensed-and-paid in one pass).
   **Remaining: the Gardener pushes** the seed record and dither `eeb5fdd` (the local-commit / push-via-
   bang precedent), after which one dither CI run confirms all five gates + the self-test.
3. **Refactor track: sensing is now the recurring default.** The structural queue is drained
   (E-001/E-002/E-007/E-006 digested); with no priced structural entry pending, the track's work is to
   **sense new entropy on a cadence** and convert the highest-interest ungated finding (AGENTS.md
   §"Nothing active?"). This pass's carried residuals, deliberately *not* priced: **E-010 / the
   vendored-doc reachability floor** (43 `.agents/skills/*.md` hold dither at 48.2% — decide host-side,
   [ring 0043](../../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md) Revisit); **branch
   protection** on `main` (the seed's own main is likewise unprotected — inherited posture, not a defect);
   **graphify** (a deliberate optional aid). The **feature-track** entries (E-003/E-004/E-005/E-008) stay
   owner-paced at their build-order steps.
4. **On cadence:** measure dither fitness (the before/after-graft delta is the pollination proof); watch
   the trend against the per-host exit criterion. When the trend is positive over a sustained window and
   the owner ships through the agent workflow without the seed being special, dither reaches **step 6 —
   Independence** (its own carried seed, lineage recorded, feedback channel live).
