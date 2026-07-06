# repo-fitness

Read-only fitness assessment of *any* repository. Point the seed's own SEED.md §6 metric
engine at a target repo's root and produce a report a stranger could evaluate — without
modifying the target. It is the seed's diagnostic instrument for hosts (SEED.md §4, Stage 2)
and the first move of pollination (SEED.md §4, Stage 4 step 1, *Scout*): the read-only scout
that precedes [grill-the-gardener](../grill-the-gardener/SKILL.md). Together they are the
Stage 2 exit criterion — assess a foreign repository read-only and produce an
evidence-judgeable proposal — because a fitness verdict is only meaningful against a stated
target architecture, which the grill elicits.

Fitness is a **trend, not a grade** (LAW-9): the report is evidence for a proposal, never a
pass/fail stamp.

## When to run

- **Scouting a host** before proposing anything (SEED.md §4, Stage 4 step 1): the read-only
  baseline. Re-run it after a metabolizing window to show the before/after delta — the proof
  of pollination value (SEED.md §6).
- **Against this repository** as a cross-check on the self-assessment
  ([`fitness.ts`](../../.seed/checks/fitness.ts)): `repo-fitness .` and `fitness.ts` compute
  the *same* metrics from the *same* engine, so they must agree (the self-tests pin this).
- Any time you need the §6 metrics for a repo that is not the seed itself.

## Run

```bash
npm run repo-fitness -- <path-to-repo>          # human-readable report
node .seed/checks/repo-fitness.ts <path> --json  # { date, stage, metrics, notes } for tooling
```

## What it reports

The six SEED.md §6 metrics, computed by the shared engine
[`.seed/lib/fitness-metrics.ts`](../../.seed/lib/fitness-metrics.ts) — the same
implementation that assesses the seed itself, so *what a metric means* is defined once
(LAW-3, ring [0016](../../docs/rings/0016-repo-fitness-generalizes-the-metric-engine.md)).

The metrics are defined over the seed's anatomy (an `AGENTS.md` map, `docs/principles/`, a
plan/ring decision log, an entropy ledger). A foreign repository that has not been grafted
carries little of it, so **each metric degrades to `null` with a stated reason** when the
target lacks the structure that metric is defined over — the same null-when-absent contract
`escalation_rate` already uses. **The null and its reason are the finding**, not a broken
reading: `map_reachability null — no AGENTS.md` *is* the assessment that this repo has no
legible entry point (LAW-4). `drift_count` is the one universal metric — a current-state doc
naming a path that does not exist is drift in any repository — so it always computes.

## Read-only is the contract

The Scout step modifies nothing (SEED.md §4, Stage 4 step 1). The instrument only reads
files and runs read-only git subcommands (`rev-parse`, `rev-list`, `log`, `show`) against the
target with `git -C <root>`; it never writes, inits, stages, or commits. A run leaves the
target byte-identical — which the verification proves, not merely asserts.

## The report is the start of a proposal, not the end

A `null` (or a low fraction) is a sensed unit of the host's entropy (SEED.md §0). It converts
into exactly one of the four products: an invariant the host could adopt, a ring recording a
decision, a priced debt, or a deletion. `map_reachability null` → propose an `AGENTS.md` map;
`enforcement_ratio null` → propose stating principles with enforcements; a `drift_count > 0`
→ the concrete stale references to fix. That conversion is the pollination *Propose* step
(SEED.md §4, Stage 4 step 3) — the report supplies the evidence its owners judge on.

## Verification (LAW-6)

A skill that cannot prove it worked is a claim, not a capability. repo-fitness is verified by
[`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts) (`npm test`), following the
machinery's temp-copy methodology, with three bindings:

- **Self-equivalence.** `repo-fitness <seed root>` computes byte-identical `metrics` to
  `fitness.ts` — proving the generalization did not change the self case (the seed measures
  itself as the `target=self` instance of measuring any repo).
- **Honest degradation.** Against a synthetic foreign repo (a git repo with no seed anatomy,
  and a non-git directory), the anatomy-dependent metrics come back `null` with the right
  reason while the universal `drift_count` still computes a seeded stale reference.
- **Read-only.** The target tree is hashed before and after a run and asserted
  byte-identical, and its `git status` stays clean — mutation is a test failure.

Ring [0016](../../docs/rings/0016-repo-fitness-generalizes-the-metric-engine.md) records the
build decision.
