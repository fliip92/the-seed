# The dither pollination proof — before/after graft

- Date: 2026-07-27
- Host: **dither** — the first external pollination host ([assessment 0002](../assessments/0002-dither.md),
  named by the Gardener at Stage 4 entry, ring [0032](../rings/0032-stage-4-transition-first-host-dither.md))
- Measurement: read-only [repo-fitness](../../skills/repo-fitness/SKILL.md)
  (`npm run repo-fitness -- <dither>`), the seed's own root-parameterized engine
  ([fitness-metrics.ts](../../.seed/lib/fitness-metrics.ts)) — one definition of each metric (LAW-3)
- Verdict: **the graft measurably improved the host on every metric its anatomy defines.** The
  per-host exit criterion is **half-met** — see [The exit criterion](#the-exit-criterion).

## What this is

SEED.md §6: fitness exists "to judge architecture decisions over time (LAW-9) and **to prove
pollination value with before/after measurement on hosts**." That before/after is the pollination
proof, and this file is dither's — the Stage-4 counterpart to
[recursive-upgrade.md](recursive-upgrade.md) (the Stage-3 proof, measured on a sacrificial repo).
Like that artifact it is a **measurement on a target**, not a snapshot of this seed, so it lives here
rather than in [history/](history/README.md).

It is landed at the point where [plan 0009](../plans/active/0009-dither-metabolize.md)'s refactor
track has drained: nine ledger entries digested, six gates and eight principles standing on dither's
`main`, and four sensing passes finding progressively less. The question the plan's cadence item asks
is *did any of it move the host's health* — answerable only by measuring.

## The measurement is instrument-controlled

The recorded Scout baseline ([assessment 0002](../assessments/0002-dither.md), 2026-07-17) read
`map_reachability` **null**. Quoting that against today's 48.8% would overstate the graft: two of the
seed's own instrument defects have been paid since, and both move this number.

- [E-016](../plans/entropy-ledger.md) — the metric hard-coded `AGENTS.md`, so dither's `CLAUDE.md` map
  read as *mapless*. Paid 2026-07-18; the entry point is now resolved from a name set.
- [E-019](../plans/entropy-ledger.md) — the fraction counted **all** files, so it floored on a product
  monorepo (283 of dither's 386 files are source). Paid 2026-07-20 (ring
  [0043](../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md)); it now counts knowledge
  artifacts.

So the "before" column below is **not** the historical reading. It is dither's **pre-graft tree
re-measured today with today's instrument** — a clone at `2b2b3d5` (the last owner commit before the
first graft commit `da6bb24`), measured 2026-07-27. Same code, same day, same definitions: the delta
is the graft, not the toolchain. The historical baseline is recorded in the Scout and kept there.

## The delta

| Metric | Before — `2b2b3d5` pre-graft | After — `b8d3823` today | Moved by |
|---|---|---|---|
| `map_reachability` | **6.8%** (5/74 docs) | **48.8%** (42/86 docs) | the map + dead-link organ (ring [0037](../rings/0037-dither-map-gate-graft.md)), then the E-007 sweep (ring [0043](../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md)) |
| `enforcement_ratio` | **null** — *no `docs/principles/` organ* | **100%** (8/8) | the principles organ (ring [0039](../rings/0039-dither-principles-gate-graft.md)) + the norms metabolized onto it (E-011's `maps-are-complete`, ring [0046](../rings/0046-dither-map-completeness-gate.md)) |
| `drift_count` | **2** | **0** | E-006, the two stale spike refs (ring [0044](../rings/0044-dither-e006-stale-spike-refs-gardened.md)) |
| `plan_traceability` | **null** | **null** — *and this is wrong; see below* | — |
| `escalation_rate` | **null** — *no run-log instrument* | **null** — *same* | — (universal; [E-017](../plans/entropy-ledger.md)) |
| `ledger_trend` | **null** — *no entropy ledger* | **-2** (net 2 digested this week) | the seeded ledger + its gate (ring [0040](../rings/0040-dither-ledger-graft.md)) |

**Four of the six moved, and every one that moved improved.** The two that did not are the honest
residue: one is a universal absence the seed carries too, and one is a defect in the seed's own
instrument, priced below.

### Reading each move honestly

- **`map_reachability` 6.8% → 48.8% — a 7.2× rise in doc navigability.** Pre-graft, 69 of dither's 74
  knowledge artifacts were unreachable from its map within three hops: the docs existed and were good
  (the Scout said so), but an agent could not *find* them. Post-graft, 42 of 86 are reachable and the
  dead-link gate keeps the links honest. The residual 44 is dominated by 43 vendored
  `.agents/skills/*.md` — a carried, deliberately-unpriced floor (ring
  [0043](../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md) Revisit), not un-gardened
  debt. Excluding them the host's own docs are ~98% reachable.
- **`enforcement_ratio` null → 100% (8/8).** The Scout's finding was that dither's CI *enforced* real
  norms but *stated* none — "enforced norms are not stated as principles." Eight are now stated, each
  with a named enforcing check, and the ratio is the seed's tightest reading: not one aspirational
  principle. Note this is the metric with the most room to mislead — 8/8 says *every stated norm is
  enforced*, not *every norm is stated* — which is precisely why E-011 built the
  `maps-are-complete` invariant rather than writing a principle and stopping.
- **`drift_count` 2 → 0, attributably.** The two pre-graft drifts re-scanned today are exactly the two
  E-006 paid: `pytorch/executorch/docs/source/ptd-file-format.md` (an upstream ExecuTorch path that read
  as a repo path) at line 82 of
  [dither's ExecuTorch/LoRA spike](https://github.com/fliip92/dither/blob/main/docs/spikes/executorch-lora-adapter-feasibility.md),
  and `dither/apps/phone/src/localbrain/leanPrompt.ts` (a never-built phone path) at line 339 of
  [dither's local-brain spike](https://github.com/fliip92/dither/blob/main/docs/spikes/local-brain-experience-feasibility.md).
  This is the cleanest single attribution in the table: named findings, one refactor, metric to zero.
  (Host paths are written host-qualified — `dither/…`, `pytorch/…` — because this file is *seed*
  current-state prose, where a bare `docs/…` span is a claim about **this** repository and the drift
  scanner rightly resolves it here.)
- **`ledger_trend` null → -2.** The move that matters is **null → computable**: dither had no priced
  debt, so it had no way to see whether debt was growing or shrinking. It now has 13 entries, 9 paid.
  The **-2** is a *7-day rate, not a level* (ring [0048](../rings/0048-dither-fourth-sensing-pass-seed-dither-md-r3f.md)):
  net two entries digested this week. Negative is healthy here.

### The one reading that is wrong: `plan_traceability` null → null

The metric's stated reason is *"no plans or rings — no decision log to trace commits to."* **That is
factually false for dither.** dither has nine numbered ADRs under `docs/adr/`, and the seed grafted a
gate that enforces commit→ADR traceability (ring [0038](../rings/0038-dither-adr-gate-graft.md)) — the
*second* of the four graft organs. The norm the metric measures is not merely present on dither, it is
**mechanically enforced there by an organ the seed installed**, and the metric cannot see it:
[`planTraceability`](../../.seed/lib/fitness-metrics.ts) looks only for `docs/rings/NNNN-*.md` and
`docs/plans/{active,completed}/NNNN-*.md`.

The consequence lands squarely on this artifact: **one of the four graft organs is invisible in the
pollination proof.** This is the [E-016](../plans/entropy-ledger.md) shape recurring on a sibling
metric — a Scout instrument systematically under-reading a real host, surfaced by pointing it at one —
and it is priced as [E-020](../plans/entropy-ledger.md). It is *not* converted in this pass: unlike
E-016's name-set resolver, teaching the metric a second decision-log shape changes SEED.md §6's stated
definition, and both §6 ("propose its replacement — via ring") and the genome's amendment rule
(SEED.md: "amend only via approved PR + ring") route that to the Gardener.

## The exit criterion

SEED.md §4's per-host exit criterion, in two halves:

> *dither's fitness trend is positive over a sustained window, and its owner ships features through the
> agent workflow without the seed being special.*

- **Half 1 — the trend is positive over a sustained window: MET.** Ten days (2026-07-17 → 2026-07-27),
  nine ledger entries digested, every metric that can move moved the right way, and no metric regressed.
  The table above is the evidence.
- **Half 2 — the owner ships features through the agent workflow: NOT YET MET.** dither's last
  owner-authored feature commit is `2b2b3d5` — the commit *immediately before the graft*. Every commit
  since is seed-driven refactor-track work. The feature track (E-003 / E-004 / E-005 / E-008, at their
  build-order steps) has not run once post-graft, so the claim "the owner ships through the agent
  workflow without the seed being special" has **no evidence either way** — it is untested, not failed.

**Verdict: half-met; Independence (step 6) waits on the feature track, not on more refactoring.** This
also explains the shape of the last two sensing passes: they found progressively less because the host
has not changed since `b8d3823` — a static host generates no new entropy. Sensing stays the refactor
track's default, but on an unchanged repo it is correctly near-idle work, and the binding constraint on
dither's Independence is owner feature flow.

## Reproducibility

Every number here is reproducible read-only, and the Scout's non-mutation contract is self-test-proven
([repo-fitness](../../skills/repo-fitness/SKILL.md), ring
[0016](../rings/0016-repo-fitness-generalizes-the-metric-engine.md)):

```
npm run repo-fitness -- ~/Repos/dither            # the "after" column, at b8d3823
git clone ~/Repos/dither <tmp> && git -C <tmp> checkout 2b2b3d5
npm run repo-fitness -- <tmp>                     # the "before" column, same instrument
```

The pre-graft measurement is taken on a **clone**, never a worktree, so dither's own `.git` is not
touched — the Scout is read-only on the host (SEED.md §4 step 1), and a `git worktree add` would write
to it.
