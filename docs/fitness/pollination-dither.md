# The dither pollination proof — before/after graft

- Date: 2026-07-27
- Host: **dither** — the first external pollination host ([assessment 0002](../assessments/0002-dither.md),
  named by the Gardener at Stage 4 entry, ring [0032](../rings/0032-stage-4-transition-first-host-dither.md))
- Measurement: read-only [repo-fitness](../../skills/repo-fitness/SKILL.md)
  (`npm run repo-fitness -- <dither>`), the seed's own root-parameterized engine
  ([fitness-metrics.ts](../../.seed/lib/fitness-metrics.ts)) — one definition of each metric (LAW-3)
- Verdict: **the graft measurably improved every metric of host health it touches; the one metric that
  moved down measures the seed's own commit prose, not dither's.** The per-host exit criterion is
  **half-met** — see [The exit criterion](#the-exit-criterion).
- Amended: 2026-07-27, same day, by ring
  [0051](../rings/0051-decision-log-shape-resolved-not-assumed.md) — [E-020](../plans/entropy-ledger.md)
  was paid hours after this file landed, so `plan_traceability` now **reads** on dither instead of
  reporting a false null. Its row was rewritten from the measurement, not the estimate.

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
`map_reachability` **null** and `plan_traceability` **null**. Quoting those against today's readings
would overstate the graft: three of the seed's own instrument defects have been paid since, and each
moves a number in this table.

- [E-016](../plans/entropy-ledger.md) — the metric hard-coded `AGENTS.md`, so dither's `CLAUDE.md` map
  read as *mapless*. Paid 2026-07-18; the entry point is now resolved from a name set.
- [E-019](../plans/entropy-ledger.md) — the fraction counted **all** files, so it floored on a product
  monorepo (283 of dither's 386 files are source). Paid 2026-07-20 (ring
  [0043](../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md)); it now counts knowledge
  artifacts.
- [E-020](../plans/entropy-ledger.md) — `plan_traceability` knew only plans and rings, so an
  ADR-governed host read a false "no decision log" null. Paid 2026-07-27 (ring
  [0051](../rings/0051-decision-log-shape-resolved-not-assumed.md)); the decision-log shape is now
  resolved from the target. **Both columns of that row were measured after this fix** — it is the one
  row where the instrument-control matters most, since the pre-graft tree also carried ADRs.

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
| `plan_traceability` | **45.2%** (28/62 commits) | **39.5%** (30/76) — *the one decline; see below* | the seed's own 14 commits, 12 of which cite the **seed's** plan, not dither's ADRs ([E-022](../plans/entropy-ledger.md)) |
| `escalation_rate` | **null** — *no run-log instrument* | **null** — *same* | — (universal; [E-017](../plans/entropy-ledger.md)) |
| `ledger_trend` | **null** — *no entropy ledger* | **-2** (net 2 digested this week) | the seeded ledger + its gate (ring [0040](../rings/0040-dither-ledger-graft.md)) |

**Five of the six moved: four improved, one declined.** The sixth is `escalation_rate`, a universal
absence the seed carries too ([E-017](../plans/entropy-ledger.md)). The decline is real and is read
honestly below — it is the seed's own contribution to dither's history that caused it, and it is the
most useful thing this measurement produced.

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

### The one decline: `plan_traceability` 45.2% → 39.5%, and the seed caused it

When this file first landed, this row read **null → null** with a note saying the null was wrong: the
metric knew only plans and rings, so dither — nine numbered ADRs under `docs/adr/`, with a commit→ADR
gate **the seed itself grafted** (ring [0038](../rings/0038-dither-adr-gate-graft.md)) — was reported
as having no decision log, leaving one of the four graft organs invisible in its own proof. That was
[E-020](../plans/entropy-ledger.md); it was paid the same day (ring
[0051](../rings/0051-decision-log-shape-resolved-not-assumed.md)), the metric now resolves the host's
decision-log shape, and the row is a measurement. It is also the only row that moved the wrong way.

The decomposition says exactly who moved it:

| Author | Commits | Citing an existing dither ADR | Rate |
|---|---|---|---|
| dither's own history (through `2b2b3d5`) | 62 | 28 | **45.2%** |
| the seed, post-graft (`da6bb24`…`b8d3823`) | 14 | 2 | **14.3%** |
| whole history today | 76 | 30 | **39.5%** |

**dither's own traceability did not regress** — those 62 commits and their 28 citations are untouched.
The whole-history fraction fell because the seed added fourteen commits and twelve of them cite
*"Seed plan 0009 / E-NNN"* — the **seed's** decision log, which dither does not carry and cannot verify
from inside itself. (The two that trace do so incidentally: their bodies discuss ADR-0009.)

That is a finding worth more than the number. Every decision *about dither* — the four graft organs,
the import boundary, the map-completeness gate, the metric rescoping — is recorded in the seed's rings,
so a dither maintainer reading dither's own decision log finds **no record of why six CI gates appeared
in their repository**. The seed grafted a traceability organ and then wrote history that organ's own
metric cannot follow. It is priced as [E-022](../plans/entropy-ledger.md), and its conversion is
owner-gated (dither's ADR set is the owner's surface, SEED.md §4) — the natural moment is the next
commit the seed lands on dither, which is the feature-track work the exit criterion is already waiting
on. When it converts, this row should climb, and that is how the conversion gets checked.

One caveat on reading the number at all: dither's ADR gate deliberately does **not** require every
commit to cite an ADR (ring 0038 scoped it to existence + new-decision naming, matching dither's real
practice), while the seed's own gate requires it of every commit. So dither's 39.5% and the seed's 100%
answer the same question under **different enforced norms** and must not be compared to each other —
only to their own past (SEED.md §6: fitness is a trend, not a grade).

## The exit criterion

SEED.md §4's per-host exit criterion, in two halves:

> *dither's fitness trend is positive over a sustained window, and its owner ships features through the
> agent workflow without the seed being special.*

- **Half 1 — the trend is positive over a sustained window: MET.** Ten days (2026-07-17 → 2026-07-27),
  nine ledger entries digested, and every metric of *host* health that can move moved the right way. The
  one decline, `plan_traceability`, is not host decay: dither's own commits trace exactly as they always
  did (28/62), and the fraction fell only because the seed's own fourteen commits cite the seed's
  decision log rather than dither's ([E-022](../plans/entropy-ledger.md)). Judging the half on a number
  the seed itself depressed would be measuring the instrument's author, not the host. The table above is
  the evidence, and E-022 is the correction owed.
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
