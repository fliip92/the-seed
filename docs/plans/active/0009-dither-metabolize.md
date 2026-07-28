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

### U6 — E-010/E-011: build the map-completeness gate (the recurrence triggers E-009's invariant)
- Status: done
- Landed: dither `1274d48` (local; push Gardener-gated) — [ring 0046](../../rings/0046-dither-map-completeness-gate.md)
- Scope: the second sensing pass (Decision log) found E-009 was one instance of a class — `theme` +
  `matrix-playground` also omitted from README.md's layout and CONTEXT-MAP.md's context list — meeting
  E-009's Revisit-when. **(a) E-010:** add the two workspaces to README + CONTEXT-MAP so all three maps
  are complete. **(b) E-011:** build
  [map-completeness.ts](https://github.com/fliip92/dither/blob/main/.seed/checks/map-completeness.ts), a
  sixth dither gate over the verbatim engine asserting every `packages/*`/`apps/*` workspace is listed in
  each layout map, wired as a `ci.yml` step with the eighth principle `maps-are-complete` and a
  gates-self-test tooth pair. In scope: the both-forks decision (fix instances + build the invariant), the
  name-boundary matching (`matrix` ≠ `matrix-playground`), the test-of-the-test. Out of scope: a per-map
  exclusion mechanism (a Revisit if a unit should legitimately be omitted from a map); any product-code
  change.
- Entry-context: [ring 0045](../../rings/0045-dither-sensing-pass-theme-layout.md)'s E-009 + its
  Revisit-when; the second-pass findings (Decision log); dither's
  [import-boundary.ts](https://github.com/fliip92/dither/blob/main/.seed/checks/import-boundary.ts) (the
  runner + "new package fires" template) and
  [gates-self-test.ts](https://github.com/fliip92/dither/blob/main/.seed/tests/gates-self-test.ts) (the
  teeth harness); the three maps (architecture.md, README.md, CONTEXT-MAP.md).
- Done-when: all three maps list every workspace; the map-completeness gate runs in dither CI, **GREEN**
  (8 workspaces × 3 maps); **TEETH** — a new package in no map and a workspace dropped from one map both
  fire it (self-test 18/18), and neutering the gate turns its cases red; the eighth principle keeps
  `enforcement_ratio` at 100% (8/8); E-010 + E-011 Open→Paid in the same pass (`ledger_trend` +4
  unchanged); the landing range green on all six gates + the self-test; seed-side `npm run check` +
  `npm test` + `npm run garden` green.
- Owner: agent
- Depends-on: E-009 (ring 0045) landed — its Revisit-when is the trigger; the first sensing pass had to
  find the class before the second could find its recurrence.

### U7 — third sensing pass: convert E-013 (map-completeness script), price E-012 Open (architecture.md stack drift)
- Status: done
- Landed: dither `8959b3e` (local; push Gardener-gated) — [ring 0047](../../rings/0047-dither-third-sensing-pass-stack-drift.md)
- Scope: run the metabolism (SEED.md §3) again — the structural queue drained, and dither unchanged since
  [ring 0046](../../rings/0046-dither-map-completeness-gate.md) (`1274d48`), so new entropy can only live in
  surfaces the first two passes did not reach. A read-only pass across four such surfaces (ADR bodies vs
  code, dependency/config hygiene, map claims vs code beyond the gated layout, the gate tooling's own
  consistency), plus a confirm that the copied engine (`repo.ts`/`validate-map.ts`) is byte-identical to
  the seed's canonical. **(a) E-013 (converted):** the map-completeness gate had a `ci.yml` step but no
  `check:*` script — the sole gate of seven without one (an E-011 residual, the E-009-is-a-residual-of-E-001
  shape); add `check:mapcomplete`, restoring one-script-per-gate parity. **(b) E-012 (priced Open, held):**
  architecture.md's stack rows name `Zustand`, `react-native-unistyles`, and `react-three-fiber` (all absent
  from the built code) and the pre-rename `react-native-wgpu`; priced with an **owner fork** (fix docs to
  code vs adopt the stated libraries — the [E-001 shape](../../rings/0041-dither-import-boundary-gate.md)),
  held for the Gardener. In scope: the honesty filter — the three ADR-body discrepancies (append-only
  decision records), the framework-managed `react`/`eslint` version skews, and `console.*`/`eslint-disable`
  hygiene, all checked and **not** priced. Out of scope: converting E-012 (owner-gated); a gate for
  gate↔script parity (one occurrence, LAW-7).
- Entry-context: the four read-only investigators' findings (Decision log below + [ring 0047](../../rings/0047-dither-third-sensing-pass-stack-drift.md));
  dither's [architecture.md](https://github.com/fliip92/dither/blob/main/docs/architecture.md) stack rows
  vs the built phone/workshop; the [E-001 fork precedent](../../rings/0041-dither-import-boundary-gate.md)
  (present the fork, await the go, don't bake a silent assumption — SEED.md §5); [ring 0045](../../rings/0045-dither-sensing-pass-theme-layout.md)'s
  sensing-pass + honesty-filter shape.
- Done-when: E-013 converted (`check:mapcomplete` added, `pnpm check:mapcomplete` runs the gate green, 7
  gate steps → 7 `check:*` scripts) and Paid; E-012 priced Open with its fork in the conversion path;
  `drift_count` 0, `enforcement_ratio` 8/8, `ledger_trend` +4 → +5 (E-012's net-new open debt; E-013 paid
  same-pass nets 0); the landing range green on all six gates + the gates self-test; a seed-side ring
  records the pass (including what was **not** priced); seed-side `npm run check` + `npm test` +
  `npm run garden` green.
- Owner: agent (E-013 conversion); E-012's conversion → the Gardener's fork
- Depends-on: the structural queue drained + the first two sensing passes (E-009/E-010/E-011) landed — the
  recurring-sense mode (AGENTS.md §"Nothing active?"); dither unchanged since ring 0046.

### U8 — E-012 fork A: reconcile architecture.md's stack rows to the code
- Status: done
- Landed: dither `b8d3823` (local; push Gardener-gated) — [ring 0047](../../rings/0047-dither-third-sensing-pass-stack-drift.md)
  (the finding + fork; this conversion executes its anticipated fork-A branch — no new ring)
- Scope: the Gardener chose **fork A** (fix docs to code) for E-012 (priced Open in U7 / ring 0047).
  Reconcile [architecture.md](https://github.com/fliip92/dither/blob/main/docs/architecture.md)'s three
  drifted stack descriptions to the built code: **(a)** the Decision register's Phone stack row
  (`Zustand` + `react-native-unistyles` → `React hooks for state` + `StyleSheet`, what the phone actually
  uses); **(b)** the topology + repo layout (the workshop as a `react-three-fiber` SPA → a `Vite + React`
  SPA rendering the matrix face via WebGPU, with `react-three-fiber` marked the *deferred* 3D bust, build
  order step 4); **(c)** the package rename `react-native-wgpu` → `react-native-webgpu` across
  architecture.md (topology, build order, risk register) and the ledger's own E-003. In scope: the
  **ADR-0005-left-append-only** scope call (ADR bodies are not reconciled — ring 0047's honesty-filter
  stance; dither's adr-gate blesses aged citations), and E-012 Open→Paid. Out of scope: any product-code
  change (fork B declined); a new instrument (a doc reconciliation, the E-006/E-009 gardening shape).
- Entry-context: [ring 0047](../../rings/0047-dither-third-sensing-pass-stack-drift.md) (E-012's finding +
  the A/B fork + the append-only-ADR reasoning); the verified phone stack (React hooks + `StyleSheet`, no
  zustand/unistyles) and workshop render path (WebGPU via `@dither/matrix`, no r3f); the
  [E-001 precedent](../../rings/0041-dither-import-boundary-gate.md) (fork A = fix docs to code).
- Done-when: architecture.md's stack rows match the code (no `Zustand` / `react-native-unistyles` /
  current-r3f / old `react-native-wgpu` left, save the deferred-bust note); E-012 Open→Paid; `drift_count`
  0, `ledger_trend` +5 → +4 (E-012 digested), `enforcement_ratio` 8/8 unchanged; the landing range green on
  all six gates + the gates self-test; seed-side `npm run check` + `npm test` + `npm run garden` green.
- Owner: agent (built); the fork decision was the Gardener's
- Depends-on: U7 (E-012 priced Open) + the Gardener's fork choice (A).

### U9 — fourth sensing pass: dither clean/unchanged; fix the seed's own dither.md R3F drift
- Status: done
- Landed: seed-side only (no dither mutation — dither is clean and unchanged at `b8d3823`) — [ring 0048](../../rings/0048-dither-fourth-sensing-pass-seed-dither-md-r3f.md)
- Scope: run the metabolism again with dither byte-identical to U8 (`b8d3823`). Re-verify dither clean
  (`drift_count` 0, `enforcement_ratio` 8/8, `map_reachability` 48.8%; README prose accurate, only
  `ci.yml`) — no new dither entropy. **The one finding is seed-side:** the seed's elicited target
  [dither.md](../../architecture/dither.md) Shape line still described the workshop as "static Vite + R3F"
  (the `react-three-fiber` drift E-012 fixed dither-side, uncaught here because E-012 was dither-scoped) →
  corrected to "static Vite + React". In scope: the `ledger_trend` maturation observation (a 7-day rate,
  not a level — now -2 = healthy weekly digestion; the memory shorthand corrected), and the honesty-filter
  decision not to manufacture dither entropy on an unchanged, already-swept repo. Out of scope: any dither
  mutation (nothing to fix there); a new instrument (a one-line stale-reference fix, LAW-7).
- Entry-context: [ring 0048](../../rings/0048-dither-fourth-sensing-pass-seed-dither-md-r3f.md); the
  E-012 / fork-A work (U8, [ring 0047](../../rings/0047-dither-third-sensing-pass-stack-drift.md)) this
  completes seed-side; [E-001 / ring 0041](../../rings/0041-dither-import-boundary-gate.md) (the prior
  seed-side dither.md correction); the `ledger_trend` definition in
  [fitness-metrics.ts](../../../.seed/lib/fitness-metrics.ts).
- Done-when: the seed's dither.md Shape matches dither's code (no R3F-as-current); dither confirmed
  clean/unchanged (no dither commit); a seed-side ring records the pass + the `ledger_trend` observation;
  seed-side `npm run check` + `npm test` + `npm run garden` green.
- Owner: agent
- Depends-on: U8 (E-012 fork A) landed — this is its seed-side residual; dither unchanged since `b8d3823`.

### U10 — the fitness cadence: land the dither pollination proof and judge the exit criterion
- Status: done
- Landed: seed-side only (no dither mutation — read-only on the host) — [ring 0049](../../rings/0049-dither-pollination-proof-exit-criterion-half-met.md)
- Scope: execute this plan's standing cadence item (`Next actions` 4) — the one live item never yet
  executed as an artifact. Measure dither's before/after-graft delta **instrument-controlled** (clone the
  pre-graft tree at `2b2b3d5` and re-measure it with *today's* engine, so the [E-016](../entropy-ledger.md)
  / [E-019](../entropy-ledger.md) instrument fixes are not credited to the graft), land it as
  [pollination-dither.md](../../fitness/pollination-dither.md), and judge the per-host exit criterion.
  In scope: the seed's own lapsed fitness cadence (one snapshot, stage 1, 23 days stale) — take the tick
  and re-render [FITNESS.md](../../fitness/FITNESS.md), including its `map_reachability` definition, which
  had drifted from SEED.md §6 since ring 0043; and pricing what the pass sensed in the seed itself
  ([E-021](../entropy-ledger.md) — the working-tree gates ignore git's ignore rules, surfaced when the
  agent tool wrote `.claude/settings.local.json` mid-session and turned a clean tree into a red
  `npm run check`). Out of scope: converting [E-020](../entropy-ledger.md) (it edits SEED.md §6 —
  Gardener-gated) or [E-021](../entropy-ledger.md) (it changes `listRepoFiles`, which every gate inherits
  — its own pass, not a ride-along); any dither mutation; mechanizing the fitness cadence
  ([E-008](../entropy-ledger.md) already prices that).
- Entry-context: [ring 0049](../../rings/0049-dither-pollination-proof-exit-criterion-half-met.md);
  [recursive-upgrade.md](../../fitness/recursive-upgrade.md) (the Stage-3 proof this parallels);
  [assessment 0002](../../assessments/0002-dither.md) (the recorded Scout baseline, superseded as the
  "before" column but kept as history); the four graft rings
  ([0037](../../rings/0037-dither-map-gate-graft.md)–[0040](../../rings/0040-dither-ledger-graft.md)),
  each of which the delta attributes a move to.
- Done-when: the proof is landed with reproducible commands and an instrument-controlled "before";
  four moved metrics attributed to named work; the exit criterion judged **half-met** with the missing
  half named (the owner has not shipped a feature post-graft — dither's last owner commit is pre-graft
  `2b2b3d5`); the `plan_traceability` blindness priced as E-020 and held for the Gardener; today's seed
  snapshot landed; seed-side `npm run check` + `npm test` + `npm run garden` green.
- Owner: agent
- Depends-on: U1–U9 (the nine digested entries the delta measures); dither unchanged at `b8d3823`.

### U11 — E-021: the working-tree gates take their file set from git
- Status: done
- Landed: seed-side only (dither is provably unaffected) — [ring 0050](../../rings/0050-gates-honor-git-ignore-rules.md)
- Scope: convert the entry U10 sensed and priced, on the Gardener's go. Make
  [`listRepoFiles`](../../../.seed/lib/repo.ts) filter the walk through
  `git ls-files --cached --others --exclude-standard`, so repo `.gitignore`, global
  `core.excludesFile`, and `.git/info/exclude` are honored because **git** honors them — one
  definition of repository membership (LAW-3) instead of a hardcoded list drifting beside it; the old
  set stays as the non-git fallback. In scope, because measurement showed it was the larger half: the
  **self-test fixtures**, where `copyRepo` raw-copied the tree so one ignored file broke 26 cases at
  once — it now assembles from `listRepoFiles`, sharing the gates' definition. Also in scope, both
  sub-questions the entry flagged: `.claude/settings.local.json` named in the repo's own
  [`.gitignore`](../../../.gitignore) (so the exclusion is not one machine's global rule), and the
  `pollen` `patch` intent, since `.seed/` is portable. Out of scope: narrowing the *metrics* set
  (E-012 scoped it deliberately, and the gates must stay broader — they judge uncommitted work); any
  dither mutation (its runners already list via `git ls-files -z`); a general LAW-8 pause on plan 0009
  — this is the [ring 0035](../../rings/0035-stage-agreement-invariant.md) shape, a seed-side entry
  paid while the dither track waits on the owner.
- Entry-context: [ring 0050](../../rings/0050-gates-honor-git-ignore-rules.md);
  [E-021](../entropy-ledger.md) and [ring 0049](../../rings/0049-dither-pollination-proof-exit-criterion-half-met.md),
  where the defect surfaced by breaking U10's own verification run;
  [E-012](../entropy-ledger.md), whose Paid note both established the git-listing pattern and
  recorded the assumption this falsified; the four graft rings, whose runners were already right.
- Done-when: `npm run check`, `npm test`, and `npm run garden` are green **with
  `.claude/settings.local.json` present** — the condition that broke them; three new self-tests pin
  the ignore-rule contrast, `core.excludesFile` (the source that actually bit), and the non-git
  fallback; the test-of-the-test (neuter the filter) turns them red; a ring records the decision;
  E-021 Open→Paid; the portable change is declared as a pollen intent.
- Owner: agent
- Depends-on: U10 (which priced it); the Gardener's go.

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
- **2026-07-21** — **U6 / E-010 + E-011 done — the second sensing pass finds E-009 was a class, and
  builds the invariant** (dither `1274d48`, local; push Gardener-gated;
  [ring 0046](../../rings/0046-dither-map-completeness-gate.md)). The pass opened surfaces the first did
  not (the 9 ADRs — index consistent, no staleness; coverage depth — solid, only the matrix-playground
  dev-tool + workshop UI run light, both defensible; per-context docs) and surfaced one coherent thread:
  **E-009 was one instance of a class.** `theme` (and `matrix-playground`) were also missing from
  README.md's layout and CONTEXT-MAP.md's context list — E-009 had fixed only architecture.md — meeting
  E-009's pre-registered Revisit-when. The Gardener chose to honor it fully: **E-010** added the two
  workspaces to README + CONTEXT-MAP (all three maps now complete), and **E-011** built the sixth dither
  gate, [map-completeness.ts](https://github.com/fliip92/dither/blob/main/.seed/checks/map-completeness.ts)
  — a runner over the verbatim engine asserting every `packages/*`/`apps/*` workspace is listed in each of
  the three layout maps (basename `theme/` or dir `packages/theme`, name-bounded so `matrix` ≠
  `matrix-playground`), with the eighth principle `maps-are-complete` (`enforcement_ratio` 8/8) and a
  gates-self-test tooth pair. Verified **GREEN + 18/18**, the **test-of-the-test** (neutering the gate
  turns its three cases red), `drift_count` 0, `ledger_trend` +4 unchanged (E-010 + E-011 sensed and paid
  in one pass), `map_reachability` 48.2% → 48.8%; landing range `eeb5fdd..1274d48` green on all six gates
  + the self-test. Seed-side `npm run check` + `npm test` + `npm run garden` green. *(Label note: the
  ledger's **E-010** is this map-omission fix; the "E-010" tag in ring 0045 / U5 was a provisional label
  for the un-priced vendored-doc-reachability candidate, which never entered the ledger and remains
  ring 0043's Revisit.)*
- **2026-07-21** — **U7 / third sensing pass — the recurring-sense mode's next cycle; deeper surfaces clean,
  one finding converted, one priced Open** (dither `8959b3e`, local; push Gardener-gated;
  [ring 0047](../../rings/0047-dither-third-sensing-pass-stack-drift.md)). dither was unchanged since ring
  0046 (`1274d48`), so the pass swept the four surfaces the first two did not audit against code (ADR bodies
  vs code, dependency/config hygiene, map claims vs code, the gate tooling's consistency) via four read-only
  investigators, each finding cross-checked directly — and confirmed the copied engine
  (`repo.ts`/`validate-map.ts`) byte-identical to the seed's canonical (no stale-copy drift). **Two
  findings. E-013 (converted):** the map-completeness gate had a `ci.yml` step but no `check:*` script — the
  sole gate of seven without one, an E-011 residual (the E-009-is-a-residual-of-E-001 shape); added
  `check:mapcomplete` (7 gate steps → 7 scripts). No principle (a script wrapper is not a norm),
  `enforcement_ratio` held **8/8**. **E-012 (priced Open, held):** architecture.md's stack rows name
  `Zustand`, `react-native-unistyles`, `react-three-fiber` (all absent — the phone uses React hooks +
  `StyleSheet`; the workshop renders via the shared WebGPU matrix canvas; r3f is the *deferred* 3D bust) and
  the pre-rename package name `react-native-wgpu` — the **E-001 pattern on the stack rows**, with an owner
  fork (fix docs to code vs adopt the libraries), so held for the Gardener rather than converted
  (grounded-or-ask; the E-001 precedent). **Honesty filter — checked and not priced:** the three ADR-body
  discrepancies (all 9 core ADR decisions verified; the secondary details are decided-but-deferred tech +
  aged citations in append-only decision records), the framework-managed `react`/`eslint` version skews, and
  `console.*`/`eslint-disable` hygiene. `ledger_trend` **+4 → +5** (E-012's one net-new open debt; E-013
  paid same-pass nets 0), `drift_count` 0, `enforcement_ratio` 8/8, `map_reachability` 48.8%. Landing range
  `1274d48..8959b3e` green on all **six** gates + the self-test (ledger gate 13 entries all priced);
  seed-side `npm run check` + `npm test` + `npm run garden` green (no seed code change).
- **2026-07-21** — **U8 / E-012 fork A — architecture.md reconciled to the code** (dither `b8d3823`, local;
  push Gardener-gated; the finding + fork are [ring 0047](../../rings/0047-dither-third-sensing-pass-stack-drift.md),
  whose Revisit-when anticipated this branch — so no new ring). The Gardener chose **fork A** (fix docs to
  code). architecture.md's three drifted stack descriptions were reconciled to the built code: the Phone
  stack row (`Zustand` + `react-native-unistyles` → React hooks for state + `StyleSheet`, the phone's real
  stack); the workshop (a `react-three-fiber` SPA → a `Vite + React` SPA rendering the matrix face via
  WebGPU, with `react-three-fiber` marked the *deferred* 3D bust, build order step 4); and
  `react-native-wgpu` → `react-native-webgpu` across architecture.md (topology, build order, risk register)
  and the ledger's own E-003. **ADR-0005 left as an append-only decision record** — its aged package-name
  citations stay valid (ring 0047's honesty-filter stance; dither's adr-gate), not reconciled. E-012
  **Open→Paid**: `ledger_trend` **+5 → +4** (E-012 digested), `drift_count` 0, `enforcement_ratio` 8/8
  unchanged, `map_reachability` 48.8%. Landing range `8959b3e..b8d3823` green on all six gates + the gates
  self-test; seed-side `npm run check` + `npm test` + `npm run garden` green (no seed code change).
- **2026-07-27** — **U9 / fourth sensing pass — dither clean/unchanged; the seed's own dither.md R3F drift
  fixed** (seed-side only; no dither mutation; [ring 0048](../../rings/0048-dither-fourth-sensing-pass-seed-dither-md-r3f.md)).
  dither is byte-identical to U8 (`b8d3823`); re-verified clean (`drift_count` 0, `enforcement_ratio` 8/8,
  `map_reachability` 48.8%; README prose accurate, only `ci.yml`) — no new dither entropy. **One finding,
  seed-side:** the seed's elicited [dither.md](../../architecture/dither.md) Shape still read "Workshop
  (static Vite + R3F)" — the `react-three-fiber` drift E-012 fixed dither-side, left here because E-012 was
  dither-scoped; corrected to "static Vite + React" (the seed-side complement to E-012, parallel to E-001's
  package-graph correction). **`ledger_trend` matured** from a level (+N open, while the ledger was <7 days
  old) to its true 7-day rate — now **-2** (net 2 entries digested this week, healthy); no metric change
  (SEED.md §6), the "+N = N open" shorthand was the imprecision. Seed-side `npm run check` + `npm test`
  (241) + `npm run garden` (`drift_count` 0) green; no dither commit.
- **2026-07-27** — **U10 / the fitness cadence: the dither pollination proof lands, and the exit criterion
  is judged half-met** (seed-side only; read-only on the host; [ring 0049](../../rings/0049-dither-pollination-proof-exit-criterion-half-met.md)).
  Executed this plan's standing cadence item — the before/after-graft delta, landed as
  [pollination-dither.md](../../fitness/pollination-dither.md), the Stage-4 counterpart to the Stage-3
  [recursive-upgrade.md](../../fitness/recursive-upgrade.md). **Instrument-controlled:** the "before"
  column is dither's pre-graft tree (`2b2b3d5`) *cloned and re-measured with today's engine*, because
  [E-016](../entropy-ledger.md) and [E-019](../entropy-ledger.md) both move `map_reachability` — quoting
  the Scout's recorded `null` would have credited the graft with the seed's own instrument fixes. **Four
  of six metrics moved, all improved, none regressed:** `map_reachability` **6.8% (5/74 docs) → 48.8%
  (42/86)**, `enforcement_ratio` **null → 8/8**, `drift_count` **2 → 0**, `ledger_trend` **null → -2**.
  The `drift_count` move is *attributable*: the two pre-graft drifts re-scanned today are exactly the two
  E-006 paid. **Exit criterion: HALF-MET** — the trend half is met; the owner-ships-features half is
  **untested**, since dither's last owner-authored commit is the pre-graft `2b2b3d5`, so **Independence
  waits on the feature track, not on more sensing** (which also explains passes 3–4 finding progressively
  less: an unchanged host generates no entropy). **One metric reads wrong on a host:** `plan_traceability`
  reports "no decision log" about a repo with nine ADRs whose commit→ADR gate the seed itself grafted
  (ring 0038) — one graft organ invisible in its own proof; priced **[E-020](../entropy-ledger.md)** and
  **held for the Gardener** (it edits SEED.md §6). Also took the seed's own lapsed fitness tick (one
  snapshot, stage 1, 23 days stale) — landed [2026-07-27](../../fitness/history/2026-07-27.json), re-rendered
  FITNESS.md as a trend, and fixed its `map_reachability` *definition*, which had contradicted SEED.md §6
  since ring 0043. **Sensed in-pass and priced [E-021](../entropy-ledger.md):** the agent tool wrote
  `.claude/settings.local.json` into the working tree and `npm run check` went green → three violations
  while `git status` stayed **clean** — the file is git-ignored (global `~/.config/git/ignore`) but
  [`listRepoFiles`](../../../.seed/lib/repo.ts) consults a hardcoded exclusion set instead of git's ignore
  rules, so the repo carries two disagreeing definitions of "what is in this repository" (LAW-3), and
  E-012's recorded assumption that on-disk equals tracked is falsified. Priced **high** (it breaks the
  repo's own done-criterion on a real machine and is invisible in CI), not converted — every gate inherits
  that helper. Seed-side `npm test` + `npm run garden` (`drift_count` 0) green; `npm run check` green on
  all committed content (verified with the ignored `.claude/` held aside); no dither commit.
- **2026-07-27** — **U11 / E-021 paid: the working-tree gates take their file set from git**
  (seed-side only; [ring 0050](../../rings/0050-gates-honor-git-ignore-rules.md)). On the Gardener's
  go, converted the entry U10 sensed. [`listRepoFiles`](../../../.seed/lib/repo.ts) now filters the
  walk through `git ls-files --cached --others --exclude-standard`, so repo `.gitignore`, global
  `core.excludesFile`, and `.git/info/exclude` are honored because git honors them — **one definition
  of repository membership** (LAW-3); the hardcoded set survives only as the non-git fallback. The
  gates' set stays deliberately broader than the metrics' (E-012 scoped metrics to the committed
  repository; a pre-commit gate blind to uncommitted work is pointless), and a tracked file is never
  ignored, as git treats it. **Measurement changed the scope:** with the gates fixed and the fixtures
  untouched, 26 self-tests still failed — `copyRepo` raw-copied the tree, so every case inherited local
  state; it now assembles from `listRepoFiles`, sharing the gates' definition. Both sub-questions the
  entry flagged were settled: `.claude/settings.local.json` is in the repo's own `.gitignore` (not just
  one machine's global file), and the portable change is declared as a `patch`
  [pollen intent](../../../pollen/pending.md). **dither is unaffected and needs no mutation** — its
  grafted runners already list via `git ls-files -z`, so the mother converged on the practice her own
  host was already following; the fix reaches descendants as a pollen release, not a hand-copy.
  Verification: three new self-tests (**244**, was 241) — the four-step ignore-rule contrast,
  `core.excludesFile` (the source that actually bit), and the non-git fallback — plus the
  test-of-the-test (neutering turns the first two red and returns the 26 fixture failures).
  `npm run check` (18) + `npm test` (244) + `npm run garden` (`drift_count` 0) green **with the ignored
  file present**. E-021 Open→Paid; no dither commit.
- **2026-07-27** — **U12 / E-020 paid: the decision log is resolved, not assumed — and the fixed
  instrument found a regression the seed itself caused** (seed-side only;
  [ring 0051](../../rings/0051-decision-log-shape-resolved-not-assumed.md)). On the Gardener's ruling
  (*"fix E-020"*), converted the entry U10 priced and held. `plan_traceability` now **resolves the
  target's decision-log shape** — numbered plans and rings, or numbered ADRs under `docs/adr/`
  ([`resolveDecisionLog`](../../../.seed/lib/repo.ts)) — instead of assuming the seed's, the
  [E-016](../entropy-ledger.md) `resolveMapFilename` move one level up. Because that changes the metric's
  stated definition, **SEED.md §6 is amended** (*"% commits tracing to a decision record the repository
  carries — a plan or ring, or an ADR"*), which also retires the row's older inaccuracy — it said "merged
  PRs" while the engine has walked full non-merge history since plan 0002. The metric **name** is
  deliberately unchanged (renaming it would break the append-only snapshot series to buy a better word);
  the seed's own **gate** stays plan/ring-strict, enforcing this repo's law rather than a host's
  convention, and the seed's own reading is unchanged at **100%**. dither now reads **39.5%**, note
  *"traced against 9 ADRs (docs/adr/)"* — the graft organ that was invisible in its own proof is visible.
  **Fixing the instrument changed the finding.** Measured on both sides with the fixed engine, the row
  reads **45.2% pre-graft (28/62) → 39.5% (30/76)** — the one metric that moved *down*, and the cause is
  the seed: twelve of the fourteen commits the seed has landed on dither cite *"Seed plan 0009 / E-NNN"*,
  a decision log dither does not carry, while dither's own 62 commits trace exactly as they always did.
  Priced **[E-022](../entropy-ledger.md)** — the debt is not the number but that every decision *about
  dither* lives only in the seed's rings, so a dither maintainer finds no record of why six CI gates
  appeared in their repo; conversion is owner-gated and rides the next commit the seed lands there.
  [pollination-dither.md](../../fitness/pollination-dither.md) was amended same-day from the measurement
  (five of six moved: four improved, one declined, with the decline decomposed by author) and the exit
  criterion's trend half **stands** — dither's own traceability did not regress. Also sensed in-pass and
  priced **[E-023](../entropy-ledger.md)**: three portable-machinery changes have landed since the v0.1.0
  cut (E-012, E-016, E-019) with **no declared pollen intent**, so `pending.md` under-declares the
  unreleased delta and a cut would bake the omission into append-only history — fix before the next
  release. Verification: two new self-tests (**246**, was 244) — an ADR-governed host across all three
  citation forms plus a dangling `ADR-0042` (pinned at 3/6, shape named in the note), and a repo keeping
  both rings and ADRs — plus the test-of-the-test (removing the `adr` shape turns exactly those two red).
  `npm run check` (18) + `npm test` (246) + `npm run garden` (`drift_count` 0) green. Declared a `minor`
  [pollen intent](../../../pollen/pending.md) (next release would be v0.2.0). No dither mutation — the
  defect was the mother's instrument, not the host.

- **2026-07-27** — **U13 / E-023 paid: a portable change declares its intent, or CI fails — and the
  gate found the debt was more than twice what the eye priced** (seed-side only;
  [ring 0052](../../rings/0052-portable-changes-declare-their-intent.md)). On the Gardener's ruling
  (*"fix E-023"*), converted the entry U12 sensed. The new
  [pollen-intent gate](../../../.seed/checks/pollen-intent.ts) proves the pending intents are
  **complete**: every commit since the last cut that touched the portable subtree — the
  [manifest](../../../.seed/lib/pollen.ts)'s definition, never a second list — must be declared in
  [pending.md](../../../pollen/pending.md) by a decision record its message cites. It is a **CI gate**
  (the window and the commit messages are history; `run-all` stays pure), and unlike its four siblings it
  takes **no base ref**: it asserts a *state* over a window fixed by the commit that added the newest
  release file, re-judged every run — so **a green run is the precondition for a cut**, and the omission
  the entry feared cannot be frozen into append-only history. **Building it changed the entry twice.**
  The intent grammar had to widen to `[plan NNNN]` as well as `[ring NNNN]`: the seed's own commit
  convention permits a plan-only citation and one real commit uses it (`99ecc96`), so a plan-governed
  portable change was undeclarable — the release model was narrower than the decision-record vocabulary
  SEED.md §6 defines (ring [0051](../../rings/0051-decision-log-shape-resolved-not-assumed.md)'s
  amendment, one unit old). And the count: the entry priced **three** undeclared changes; git found
  **eight** of ten portable-touching commits — the judge organ (ring 0030), the Stage-4 machinery residue
  (ring 0032), `validate-stage` (ring 0035), the work-unit format (ring 0036) and the fitness JSON shape
  (ring 0049) had all gone unnoticed. Pricing by eye under-read by five of eight; the instrument found
  the rest, the same lesson as E-016/E-019/E-020 turned on the seed's own release history. **The backfill
  fork resolved to declare-now** (the entry's fork A) — the alternative needs a grandfather boundary
  inside portable machinery, shipped to every descendant forever, to remember one mother's one-time
  omission — so all eight are now intents and **v0.2.0 will credit eleven decisions instead of two**; the
  version itself is unchanged (ring 0051's `minor` already set it). Sensed in-pass and priced
  **[E-024](../entropy-ledger.md)**: nothing enforces that a ring appears in the
  [rings index](../../rings/README.md), and rings **0049–0051 were missing from it** — the same
  invariant the seed grafted into dither as `maps-are-complete`
  ([ring 0046](../../rings/0046-dither-map-completeness-gate.md)), absent at home; the four missing lines
  were written by hand in this pass, so the debt is the enforcement. Verification: six new self-tests
  (**252**, was 246) — undeclared portable change fails, ring-cited and plan-cited intents pass, a
  non-portable change needs none, a non-git tree skips, plus a dangling plan citation caught in the pure
  half — plus the test-of-the-test (neutering the accounting reddens exactly the fail case; narrowing the
  grammar reddens the plan case and 27 more, because this repo's own pending.md then holds two malformed
  intents). `npm run check` (14) + `npm test` (252) + `npm run garden` (`drift_count` 0) green, and the
  gate green on real history (10 portable-subtree commits since `c514a6ce929b`, 11 intents). Declared a
  `minor` [pollen intent](../../../pollen/pending.md) for itself. **No dither mutation** — its graft
  carries a scoped engine and no release model at all.

- **2026-07-27** — **U14 / E-024 paid: a numbered organ lists every entry, or CI fails — the class paid
  on day one, not just the instance** (seed-side only;
  [ring 0053](../../rings/0053-numbered-organs-index-every-entry.md)). On the Gardener's ruling
  (*"fix E-024"*), converted the entry U13 sensed. The invariant is one shared helper,
  [`indexCompletenessViolations`](../../../.seed/lib/repo.ts): every `NNNN-slug.md` in a numbered organ's
  directory must be linked from that organ's README — called by the validators of **all five** organs
  (rings, plans per directory, postmortems, assessments, judgments), so the rule has one definition and
  one message (LAW-3) while each violation carries the calling check's id and lands the agent on the
  organ whose format it broke. A `run-all` **clause**, not a gate: unlike U13's sibling one unit back,
  the question is a pure function of the working tree, and it fires before the commit, which is the only
  moment the fix is one line. **The hole it closes is a reachability illusion** — an unindexed entry
  stays reachable through whatever cites it, so `map_reachability` read **100%** while the rings index
  listed 48 of 51 rings; the self-test pins exactly that (an unindexed ring reddens `validate-rings`
  **while `validate-map` stays green**). The entry priced rings and *noted* the class; generalizing cost
  one helper, five call sites and four extra tests, and it made two validators' own headers
  (*"indexed by the README"*) true rather than aspirational. Building it moved the active/⇄completed/
  link resolver (ring [0013](../../rings/0013-plan-links-resolve-across-active-completed.md)) out of
  `validate-map` into [lib/repo.ts](../../../.seed/lib/repo.ts): *"does this link point at that plan"*
  now has two askers, and two implementations would eventually disagree about whether a closing plan is
  indexed. **The mother converged on her host again** — this is dither's `maps-are-complete`
  ([ring 0046](../../rings/0046-dither-map-completeness-gate.md)) turned on the seed's own organs, the
  second time in three units the host held the practice first ([E-021](../entropy-ledger.md) was the
  first). **No eighth-principle move**: the rule is about this repository's anatomy and is already
  LAW-4, so restating it as a principle would inflate `enforcement_ratio` without adding a norm.
  Verification: seven new self-tests (**259**, was 252) — a reachable-but-unindexed entry fails in each
  of the five organs, the map-green/rings-red contrast, and the same ring indexed passes — plus the
  test-of-the-test (neutering the helper reddens exactly the six fail cases and nothing else; narrowing
  its resolution to literal paths reddens the two ring-0013 plan-link cases, so the shared resolver is
  load-bearing). `npm run check` (14) + `npm test` (259) + `npm run garden` (`drift_count` 0) green.
  Declared a `minor` [pollen intent](../../../pollen/pending.md). Checked and **not** priced: the slugged
  organs (`skills/`, `docs/references/`, `docs/principles/`, `docs/architecture/`) are all currently
  index-complete, so generalizing the membership rule waits on evidence (LAW-7) — the ring's Revisit
  trigger, not a new entry. **No dither mutation** — its graft carries none of these organs.

- **2026-07-27** — **U15 / fifth sensing pass, turned on the mother: prose state rots exactly where the
  work stopped touching it** (seed-side only;
  [ring 0054](../../rings/0054-prose-state-rots-where-work-stops-touching-it.md); dither byte-identical to
  `b8d3823`, no owner commit since 2026-07-21, so there was no host entropy to sense). The four prior
  passes swept the host; this one swept the seed, and the finding is a single shape in three artifacts:
  **the docs every unit edits are current** (`.seed/README.md`'s 14 rows for 14 checks, `pollen/README.md`,
  FITNESS.md, every organ index) **and the docs outside the unit's blast radius are stale in proportion to
  how long they have been outside it** — [README.md](../../../README.md) (last touched 2026-07-15) and
  [plan 0006](0006-pollination.md)'s `Next actions` (2026-07-19). Nothing reads either: `validate-map`
  checks links, `doc-drift` checks backticked *paths*, and plan bodies are excluded from the drift surface
  by design, so `drift_count` 0 was honest and blind. **[E-025](../entropy-ledger.md) paid in-pass** — the
  README said *"currently at **Stage 2 — Growth**"* while the repo has been at Stage 4 since 2026-07-17,
  **ten days wrong on the public front door**, because [validate-stage](../../../.seed/checks/validate-stage.ts)
  proved agreement across the *two* places that existed when [E-011](../entropy-ledger.md) was priced. It
  now compares a **declared source set** and went red on the real repository on its first run. The list
  stays explicit on measured grounds: ~19 *correct* provenance mentions of `Stage N` across `skills/` and
  the organ READMEs mean a prose scan would fire 19 false positives to catch one defect. **Two entries
  priced Open, neither converted:** **[E-026](../entropy-ledger.md)** — the front door's other five false
  claims (*21 rings* → 53, *seven skills* → 9 with `intake`/`judge` missing entirely, *7+2* plans, *no
  principles stated*, *solo experiment*, *pollen … deliberately empty*), hand-fixed here so the debt is
  the enforcement; conversion is **generate-don't-detect**, the ring-0020 manifest shape. And
  **[E-027](../entropy-ledger.md)** — [AGENTS.md](../../../AGENTS.md) § Current state is **198 of 279
  lines, 71% of the map**, grown 9 → 198 in 23 days while every other section stayed flat; it restates
  what this progress log, the ledger's Paid notes and the rings already carry, every session reads it, and
  the human briefing is generated from it. Its conversion is a **fork for the Gardener** (state-only /
  capped / generated / deliberately as-is), held rather than chosen unilaterally — the
  [E-012](../entropy-ledger.md) precedent. **[E-009](../entropy-ledger.md)'s pre-registered trigger
  FIRED**: its second and third recurrences landed in one sweep (plan 0006's step 5 named four
  refactors as *"Next"* that landed 2026-07-20, in the very section the map routes a fresh agent to; plus
  the README claims), so the prose-state drift class is now owed an instrument — the pass also measured
  what makes it hard and named the one computable half (a plan's `Next actions` naming work its own
  progress log records as done). Content fixed: the README's facts, and plan 0006's step 5 rewritten as a
  **pointer** to this plan so it cannot rot into instructions again. Verification: two new self-tests
  (**261**, was 259) + the test-of-the-test (reverting the source set to the hardcoded pair turns exactly
  the README case red). Checks (14), tests (261), garden (`drift_count` 0) green; a `minor`
  [pollen intent](../../../pollen/pending.md) declared. Honesty filter — checked and **not** priced: every
  `.seed/checks/*.ts` is wired to a script or CI (dither's E-013 class does not exist here);
  `escalation_rate`'s null is already [E-017](../entropy-ledger.md)/[E-018](../entropy-ledger.md);
  `skills/README.md`'s `plans/active/0004-intake.md` link resolves by ring 0013's designed resolver;
  the ~19 `Stage N` provenance mentions are history, not drift; CI's action/Node pins are current.

- **2026-07-27** — **U16 / [E-027](../entropy-ledger.md) PAID on the Gardener's ruling *"fix E-027"* —
  fork A + B: the map states state, and a budget keeps it that way** (ring
  [0055](../../rings/0055-the-map-states-state-not-history.md); no dither mutation — seed-side prose and
  one new check). The entry was priced Open with four forks because what belongs in the seed's own entry
  point is taste ([E-012](../entropy-ledger.md) precedent); the ruling picked the rewrite **and** the
  cap, which is the difference between this and ring [0018](../../rings/0018-map-current-state-drift-doc-only.md),
  whose doc-only bet on the same section lost while it 5.6×'d. Re-measured at the ruling the section had
  grown again — **214 non-blank lines of the file's 298 (72%), 2352 words, 3.5× the whole rest of the
  map** — and is now **33 lines / 332 words**: stage, the correct first action naming this plan, where
  dither stands and what the exit criterion needs next, and what is owed (pointing at the ledger and
  [.seed/README.md](../../../.seed/README.md)), under an opening line that states the rule to the next
  agent about to append. The cap is check 15,
  [validate-map-budget](../../../.seed/checks/validate-map-budget.ts) — 60 non-blank lines / 650 words,
  the [validate-architecture](../../../.seed/checks/validate-architecture.ts) two-proxy shape, calibrated
  so the state statement may be as large as the navigation that carries it (64 lines / 667 words, flat
  for 23 days) and no larger. It was **red on the real repository before the rewrite** and prints its
  numbers on every green run. **The deletion was only safe because of [E-024](../entropy-ledger.md), one
  unit earlier**: the ~40 rings and plans this section linked directly are still reachable at 2 hops
  through organ indices ring [0053](../../rings/0053-numbered-organs-index-every-entry.md) made complete
  — `map_reachability` **100%**, dead links 0, before and after. **One priced cost did not survive
  contact and the record is corrected**: the generated briefing does not inherit the bloat (its generator
  reads the `- **Stage:**` line and the map's active-plan links only), and
  [onboarding.md](../../generated/onboarding.md) regenerates **byte-identical** across the rewrite —
  pricing by eye over-read here, as [ring 0052](../../rings/0052-portable-changes-declare-their-intent.md)
  found it under-reading there. Verification: four self-tests (**265**, was 261) with each proxy isolated
  (103/60 lines at 542 words; 2132/650 words at 38 lines), a renamed heading silent (a host is not bound),
  and 100 lines appended *outside* the section green (the budget is section-scoped, which is also what
  keeps the dozen existing `AGENTS.md`-appending fixtures independent of the map's total size); plus the
  test-of-the-test — raising both budgets turns exactly the two firing cases red, the other 263 green.
  Checks (**15**), tests (**265**), garden (`drift_count` 0) green; a `minor`
  [pollen intent](../../../pollen/pending.md) declared. Stale prose fixed in passing, the same class the
  pass one unit earlier was built on: `.seed/README.md`'s `validate-stage` row still described the
  **two** hand-bumped places E-025 had already widened into a declared source set.

## Next actions

1. **E-001…E-013 (U1–U8) — landed, pushed, hosted-CI green.** The structural refactors, the three sensing
   passes, and the E-012 fork-A conversion all stand on dither `main`; the fork-A commits went green —
   dither `b8d3823` (run [30315098067](https://github.com/fliip92/dither/actions/runs/30315098067)) and seed
   `f518034` (run [30315139513](https://github.com/fliip92/the-seed/actions/runs/30315139513)). dither
   carries **no open agent-gated debt**.
2. **U9 (fourth sensing pass) — landed, pushed, seed-ci green** (seed `9765e1a`, run
   [30316121224](https://github.com/fliip92/the-seed/actions/runs/30316121224);
   [ring 0048](../../rings/0048-dither-fourth-sensing-pass-seed-dither-md-r3f.md); no dither mutation).
3. **U10 (the pollination proof) — landed, pushed, seed-ci green** (seed `99eb321`, run
   [30318228020](https://github.com/fliip92/the-seed/actions/runs/30318228020);
   [ring 0049](../../rings/0049-dither-pollination-proof-exit-criterion-half-met.md); no dither
   mutation — the pass was read-only on the host, a clone rather than a worktree). The before/after-graft
   delta is landed as [pollination-dither.md](../../fitness/pollination-dither.md):
   instrument-controlled, and **amended same-day by U12** once E-020 was paid — **five of six metrics
   moved, four improved and one declined**: `map_reachability` 6.8% → **48.8%**, `enforcement_ratio` null
   → **8/8**, `drift_count` 2 → **0** (attributably E-006's two refs), `ledger_trend` null → **-2**, and
   `plan_traceability` 45.2% → **39.5%** (the decline, caused by the seed's own commits — E-022).
4. **The exit criterion is HALF-MET — Independence waits on the feature track, not on more sensing.** The
   trend half is met (ten days, nine entries digested; the one decline is the seed's own citation
   practice, not host decay — dither's own commits trace exactly as before). The
   **owner-ships-features half is untested**: dither's last owner-authored commit is the pre-graft
   `2b2b3d5`, so every commit on `main` since is seed-driven. The highest-value next work on this plan is
   therefore **one feature shipped through the agent workflow** (E-003 / E-004 / E-005 / E-008 at their
   build-order steps) — owner-paced, and the trigger to re-measure and judge **step 6 — Independence**
   (its own carried seed, lineage recorded, feedback channel live).
5. **U12 / [E-020](../entropy-ledger.md) — PAID, pushed, seed-ci green** (seed `b0e7559`, run
   [30320883214](https://github.com/fliip92/the-seed/actions/runs/30320883214);
   [ring 0051](../../rings/0051-decision-log-shape-resolved-not-assumed.md); no dither mutation).
   `plan_traceability` resolves the host's decision-log shape, **SEED.md §6 is amended**, and dither reads
   **39.5%** where it read null. Two entries were opened by the pass and are the live follow-ons:
   **[E-022](../entropy-ledger.md)** — the seed's decisions about dither live only in the seed's rings, so
   its commits there trace to nothing locally and a dither maintainer finds no host-side record of why six
   CI gates appeared; **owner-gated**, and it rides the next commit the seed lands on dither (which is the
   feature-track work item 4 is waiting on — pay it *in* that commit, not after). **[E-023](../entropy-ledger.md)** —
   `pollen/pending.md` under-declares the unreleased portable delta — **PAID by U13 below**.
6. **U11 / [E-021](../entropy-ledger.md) — PAID, pushed, seed-ci green** (seed `b44b325`, run
   [30319516789](https://github.com/fliip92/the-seed/actions/runs/30319516789);
   [ring 0050](../../rings/0050-gates-honor-git-ignore-rules.md); no dither mutation — dither's runners
   already list via `git ls-files -z`, so it is unaffected). The gates now take their file set from git;
   check, tests (244), and garden are green **with the ignored file present**. Two follow-ons ride the
   record rather than needing work: the change is declared as a `patch`
   [pollen intent](../../../pollen/pending.md) awaiting the next release, and dither's copied
   `.seed/lib/repo.ts` now **lags** the mother's by this fix — the first divergence since the graft,
   and the designed propagation model (descendants upgrade through versioned releases, not continuous
   mirroring).
7. **U13 / [E-023](../entropy-ledger.md) — PAID, pushed, seed-ci green** (seed `96526e7`, run
   [30322905783](https://github.com/fliip92/the-seed/actions/runs/30322905783) — the gate's first hosted
   execution, reading 11 portable-subtree commits since the cut against 11 intents;
   [ring 0052](../../rings/0052-portable-changes-declare-their-intent.md); no dither mutation — its graft
   carries no release model). The [pollen-intent gate](../../../.seed/checks/pollen-intent.ts) proves no
   portable change since the last cut goes undeclared; the intent grammar accepts a plan as well as a
   ring; the eight undeclared changes git found (the entry priced three) are backfilled, so the pending
   notes now describe **v0.2.0 as eleven decisions**. Checks (14), tests (252), and garden are green, and
   the gate is green on real history. Two follow-ons: **the first cut after this** is the ring's Revisit
   trigger — confirm the window re-anchors on the new release file and the backfilled intents are consumed
   exactly once; and **[E-024](../entropy-ledger.md)** was priced in-pass (nothing enforces that a ring
   appears in the [rings index](../../rings/README.md); 0049–0051 were missing, content fixed by hand) —
   **PAID by U14 below**.
8. **U14 / [E-024](../entropy-ledger.md) — PAID, pushed, seed-ci green** (seed `dd88891`, run
   [30324276666](https://github.com/fliip92/the-seed/actions/runs/30324276666) — run-all (14, 53 rings
   valid) + self-test **259** + all five git-aware gates, the pollen-intent gate reading 12
   portable-subtree commits since the cut against 12 intents; ring
   [0053](../../rings/0053-numbered-organs-index-every-entry.md); no dither mutation — its graft carries
   none of these organs). Every `NNNN-slug.md` in the five numbered organs must be listed in its own
   organ README, over one shared helper and one shared link resolver; the unindexed-but-reachable hole
   that hid rings 0049–0051 is pinned by a self-test that holds `validate-map` green while
   `validate-rings` goes red. Checks (14), tests (**259**), garden (`drift_count` 0) green; a `minor`
   [pollen intent](../../../pollen/pending.md) declared. One follow-on rides the record: the slugged
   organs were checked in-pass and are index-complete, so extending the membership rule to them is the
   ring's Revisit trigger rather than a priced entry.
9. **U15 / fifth sensing pass — landed, pushed, seed-ci green** (seed `6f5e182`, run
   [30325977869](https://github.com/fliip92/the-seed/actions/runs/30325977869) — the widened stage gate's
   first hosted execution, reading *"AGENTS.md, .seed/checks/fitness.ts, README.md all state stage 4"*,
   with self-test **261** and all five git-aware gates; ring
   [0054](../../rings/0054-prose-state-rots-where-work-stops-touching-it.md); no dither mutation — the
   host is byte-identical to `b8d3823`). **[E-025](../entropy-ledger.md) PAID** (the stage's third place,
   `validate-stage` now a declared source set). **Two entries are the live follow-ons, and both are the
   Gardener's call:** **[E-026](../entropy-ledger.md)** — generate the front door's counts rather than
   detect their staleness (agent-convertible once the shape is chosen; content is already correct); and
   **[E-027](../entropy-ledger.md)** — the map is 71% current-state narrative, with four forks stated
   (state-only / capped / generated / as-is) — **ruled and PAID by U16 below**. Also live:
   **[E-009](../entropy-ledger.md)'s trigger has fired**, so the prose-state drift class is owed an
   instrument; its one computable half is *a plan's `Next actions` naming work its own progress log
   records as done*.
10. **U16 / [E-027](../entropy-ledger.md) — PAID, local, awaiting the Gardener's push** (ring
   [0055](../../rings/0055-the-map-states-state-not-history.md); no dither mutation). The Gardener ruled
   *"fix E-027"* on **fork A + B**: [AGENTS.md](../../../AGENTS.md) § Current state is rewritten to
   **33 lines / 332 words** of state + pointers (from 214 / 2352, re-measured at the ruling) and capped
   by check 15, [validate-map-budget](../../../.seed/checks/validate-map-budget.ts), red on the real
   repository before the rewrite. `map_reachability` holds at 100% because
   [E-024](../entropy-ledger.md) made the organ indices complete one unit earlier. **The live follow-ons
   are unchanged and both still the Gardener's:** [E-026](../entropy-ledger.md) (generate the front
   door's counts) and [E-009](../entropy-ledger.md)'s prose-state class. **Two triggers now ride this
   record:** the first unit that *wants* to append to § Current state is the test of whether the shape
   holds under real pressure, and a second host would be the first legitimate pressure on the budget
   (ring 0055's Revisit).
11. **Refactor track: sensing stays the recurring default, at a lower rate.** The structural queue is
   drained and dither is unchanged since `b8d3823`, so passes now correctly find little (pass 4's only
   find was seed-side). Six gates + eight principles stand on dither. Carried residuals, deliberately
   *not* priced: the **vendored-doc reachability floor** (43 `.agents/skills/*.md` hold dither at ~48% —
   decide host-side, [ring 0043](../../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md)
   Revisit); **branch protection** on `main` (the seed's own main is likewise unprotected — inherited
   posture, not a defect); **graphify** (a deliberate optional aid).
12. **On cadence:** re-measure after any dither commit and extend
    [pollination-dither.md](../../fitness/pollination-dither.md)'s table rather than re-deriving it by
    hand; take the seed's own fitness tick alongside (the cadence lapsed 23 days before U10 caught it). If
    a **second** host is grafted, generalize the two-column proof shape into a comparable per-host artifact
    (ring 0049 Revisit).
