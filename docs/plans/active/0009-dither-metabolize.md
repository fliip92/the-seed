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
3. **[E-007] — map reachability sweep** (medium) — raise `map_reachability` (~11%) by linking the ADR
   index, spikes, and per-context `CONTEXT.md` files into the map's hop graph. A gardening pass.
4. **[E-006] — two stale spike refs** (low) — a gardening deletion; fix or externalize the two paths.

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

## Next actions

1. **E-001 (U1) — landed and pushed.** The Gardener pushed dither `607bc64` + the seed-side record;
   hosted CI on that push is the standing confirmation (run
   [29711596701](https://github.com/fliip92/dither/actions/runs/29711596701)).
2. **E-002 (U2) — DONE** ([ring 0042](../../rings/0042-dither-gates-self-test.md); dither `9f41427`,
   local). The gates self-test built over the verbatim engine + wired into dither CI; **no eighth
   principle** (`enforcement_ratio` 7/7 held); green + 15/15 + the test-of-the-test; E-002 Open→Paid
   (`ledger_trend` +7 → +6). **Remaining: the Gardener pushes** dither `9f41427` and the seed-side
   record (the `607bc64` precedent — local commit, Gardener push via bang), after which one hosted-CI
   run confirms all five gates + the self-test.
3. **Next refactor (the queue):** **E-007** (map-reachability sweep — link the ADR index, spikes, and
   per-context `CONTEXT.md` files into the map's hop graph, raising `map_reachability` ~11.9%), then
   **E-006** (two stale spike refs) — each its own ring + verification, owner-paced. Feature-track
   entries (E-003/E-004/E-005/E-008) at their build-order steps.
4. **On cadence:** measure dither fitness (the before/after-graft delta is the pollination proof); watch
   the trend against the per-host exit criterion. When the trend is positive over a sustained window and
   the owner ships through the agent workflow without the seed being special, dither reaches **step 6 —
   Independence** (its own carried seed, lineage recorded, feedback channel live).
