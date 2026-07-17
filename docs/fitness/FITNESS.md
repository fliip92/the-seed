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
self snapshot — [2026-07-04](history/2026-07-04.json), the first landed:

| Metric | Value |
|---|---|
| `map_reachability` | 100.0% |
| `enforcement_ratio` | 100.0% (vacuous — no principles stated yet) |
| `drift_count` | 0 |
| `plan_traceability` | 100.0% |
| `escalation_rate` | null |
| `ledger_trend` | +6 open entries (repo younger than the trailing 7-day window) |

**Stage 3 exit proof.** The recursive self-upgrade test — the seed grafting its own v0.1.0 pollen into a
sacrificial repo with fitness measured before and after (ring
[0029](../rings/0029-recursive-self-upgrade-test.md)) — is recorded in
[recursive-upgrade.md](recursive-upgrade.md): `map_reachability` `null → 100% → null`, byte-identically
reversed. That delta is the Stage 3 exit proof (SEED.md §4). This is a before/after measurement on a
*target* (the fitness organ's §6 role — "prove pollination value with before/after measurement"), not a
snapshot of this seed, so it lives here rather than in [history/](history/README.md).

## Metric definitions (v0)

| Metric | Question it answers | Source |
|---|---|---|
| `map_reachability` | % of files reachable ≤3 hops from AGENTS.md | `.seed/checks/validate-map.ts` |
| `enforcement_ratio` | enforced principles ÷ stated principles | script over `docs/principles/` |
| `drift_count` | open doc↔code divergences | doc-gardener skill (Stage 1) |
| `plan_traceability` | % merged PRs tracing to a plan or ring | CI history |
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
