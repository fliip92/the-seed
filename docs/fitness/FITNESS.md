# FITNESS.md — current fitness

Fitness is a **trend, not a grade** (SEED.md §6, LAW-9). Snapshots are dated JSON in
[history/](history/README.md), never edited; this file renders the current state and
trend.

## Status

Metrics are **defined** (below) and **computed from Stage 1** (Rooting), when fitness v0
lands in CI — per the stage boundaries in SEED.md §4. One preview is already available:
`.seed/checks/validate-map.ts` prints `map_reachability` on every run.

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
