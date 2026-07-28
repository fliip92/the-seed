# FITNESS.md — current fitness

Fitness is a **trend, not a grade** (SEED.md §6, LAW-9). Snapshots are dated JSON in
[history/](history/README.md), never edited; this file renders the current state and
trend.

## Status

Fitness v0 landed in Stage 1 (Rooting), per SEED.md §4 (plan 0002 scope item 4):
[`.seed/checks/fitness.ts`](../../.seed/checks/fitness.ts) (`npm run fitness`) computes
five of the six metrics below on every CI run; `escalation_rate` stays null until a
run-log instrument exists.

In Stage 2 the metric computation was generalized into one root-parameterized engine,
[`.seed/lib/fitness-metrics.ts`](../../.seed/lib/fitness-metrics.ts) (plan 0003 scope item 2,
ring [0016](../rings/0016-repo-fitness-generalizes-the-metric-engine.md)), so the same
implementation assesses this repo (`fitness.ts`) and any foreign repo
([`repo-fitness.ts`](../../.seed/checks/repo-fitness.ts), read-only) — one definition of each
metric (LAW-3). Against a repo whose anatomy does not define a metric, that metric reads
`null` with a stated reason (the null-when-absent contract `escalation_rate` uses). Latest
self snapshot — [2026-07-27](history/2026-07-27.json), stage 4, against
[2026-07-04](history/2026-07-04.json) (the first landed, stage 1):

| Metric | 2026-07-04 (stage 1) | 2026-07-27 (stage 4) |
|---|---|---|
| `map_reachability` | 100.0% | 100.0% |
| `enforcement_ratio` | 100.0% (vacuous — no principles stated yet) | 100.0% (1/1 — [grounded-or-ask](../principles/grounded-or-ask.md), enforced) |
| `drift_count` | 0 | 0 |
| `plan_traceability` | 100.0% | 100.0% |
| `escalation_rate` | null | null |
| `ledger_trend` | +6 open entries (repo younger than the trailing 7-day window) | +0 (trailing 7 days — a **rate**, not a level: net zero opened-minus-digested this week) |

**The trend, three stages on: flat at the ceiling, and that is the honest reading.** Four metrics have
held at their maximum across 23 days and three stage transitions while the repo roughly doubled — the
gates hold under growth, which is what they are for. Two readings need naming rather than celebrating:
`enforcement_ratio` was *vacuous* in Stage 1 (nothing stated, so nothing unenforced) and is now a real
1/1, but over a single principle — the seed states few norms as principles and enforces the rest as
gates ([ring 0011](../rings/0011-drift-advisory.md)'s split); and `ledger_trend` has matured from a
level to its true 7-day **rate** (ring [0048](../rings/0048-dither-fourth-sensing-pass-seed-dither-md-r3f.md)),
so +0 means *this week's opens and payments cancelled*, not *no debt*. A metric pinned at 100% is a
metric that has stopped discriminating; that limit is priced as [E-017](../plans/entropy-ledger.md) (the
seed measures structure, never its own operating cost).

**Stage 3 exit proof.** The recursive self-upgrade test — the seed grafting its own v0.1.0 pollen into a
sacrificial repo with fitness measured before and after (ring
[0029](../rings/0029-recursive-self-upgrade-test.md)) — is recorded in
[recursive-upgrade.md](recursive-upgrade.md): `map_reachability` `null → 100% → null`, byte-identically
reversed. That delta is the Stage 3 exit proof (SEED.md §4).

**Stage 4 pollination proof — dither.** The before/after-graft delta on the first external host is
recorded in [pollination-dither.md](pollination-dither.md): `map_reachability` 6.8% → **48.8%**,
`enforcement_ratio` null → **8/8**, `drift_count` 2 → **0**, `ledger_trend` null → **-2** (digesting),
measured instrument-controlled (the pre-graft tree re-measured with today's engine, so the delta is the
graft and not the [E-016](../plans/entropy-ledger.md)/[E-019](../plans/entropy-ledger.md) instrument
fixes). It also records the one metric that reads *wrong* on a host — `plan_traceability`, blind to
dither's ADR-shaped decision log ([E-020](../plans/entropy-ledger.md)).

Both are before/after measurements on a *target* (the fitness organ's §6 role — "prove pollination value
with before/after measurement"), not snapshots of this seed, so they live here rather than in
[history/](history/README.md).

## Metric definitions (v0)

| Metric | Question it answers | Source |
|---|---|---|
| `map_reachability` | % of knowledge artifacts (docs) reachable ≤3 hops from AGENTS.md | `.seed/checks/validate-map.ts` |
| `enforcement_ratio` | enforced principles ÷ stated principles | script over `docs/principles/` |
| `drift_count` | open doc↔code divergences | doc-gardener skill (Stage 1) |
| `plan_traceability` | % merged PRs tracing to a plan or ring | CI history |

Definitions mirror SEED.md §6 verbatim — the genome states them, this file renders them (LAW-3).
`map_reachability` counts **docs only**, not all files, since ring
[0043](../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md) rescoped it
([E-019](../plans/entropy-ledger.md)); the *gate* still enforces total reachability over every file, so
metric and gate deliberately answer different questions.
| `escalation_rate` | Gardener interventions per completed task | run logs |
| `ledger_trend` | entropy ledger net change per week | ledger diff |

## Snapshot schema (history/*.json)

```json
{
  "date": "YYYY-MM-DD",
  "stage": 0,
  "metrics": { "map_reachability": 1.0, "...": "one key per metric; null = not yet computable" }
}
```

Replacing a metric that stops correlating with real health requires a ring.
