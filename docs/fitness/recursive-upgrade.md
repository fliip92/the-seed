# The recursive self-upgrade test — Stage 3 exit proof

- Date: 2026-07-16
- Test: **the seed is its own first host** (SEED.md §4; [plan 0005](../plans/active/0005-flowering.md)
  scope item 4, [ring 0029](../rings/0029-recursive-self-upgrade-test.md))
- Verdict: **PASS** — the Stage 3 (Flowering) exit criterion is met.

## What this is

The Stage 3 exit criterion (SEED.md §4): *"Upgrade yourself using your own pollen … pollen installs
cleanly into a sacrificial test repo; fitness is measured before and after; the delta is the proof."*
[Ring 0029](../rings/0029-recursive-self-upgrade-test.md) resolved *"the seed is its own first host"*
into two self-hosting acts — the seed's own machinery turned on itself. This file is the **recorded,
judgeable** half of the proof (the Stage-3 counterpart to the read-only
[assessment 0001](../assessments/0001-mottainapp.md), the Stage-2 exit artifact); its **reproducible**
half is the self-test `recursive test (ring 0029)`
([.seed/tests/self-test.ts](../../.seed/tests/self-test.ts)), green in `npm test`.

## Act 1 — self-versioning (upgrade the seed using its own pollen)

The mother cut her first real pollen release with her own release CLI
([ring 0027](../rings/0027-release-graft-cli.md)): **v0.0.0 → v0.1.0**, composing the three portable
capabilities landed this stage — the pollen boundary
([ring 0026](../rings/0026-pollen-boundary-versioning-lineage.md)), the release / graft CLI
([ring 0027](../rings/0027-release-graft-cli.md)), and the installer + the mandated uninstall path
([ring 0028](../rings/0028-installer-uninstall.md)). The release is
[pollen/releases/v0.1.0.md](../../pollen/releases/v0.1.0.md) (minor; no migration). The release tool's
first customer is the seed itself — that is "upgrade the seed using its own pollen."

## Act 2 — self-diagnosis (the sacrificial test repo)

The mother grafted her v0.1.0 pollen (56 files) into a sacrificial empty git repo with her own installer
([ring 0028](../rings/0028-installer-uninstall.md)) and measured it with her own read-only repo-fitness
([ring 0016](../rings/0016-repo-fitness-generalizes-the-metric-engine.md)) before and after, then
reversed it. The SEED.md §6 metrics:

| Metric | Before (empty repo) | After graft | After uninstall |
|---|---|---|---|
| `map_reachability` | null — *no AGENTS.md* | **100%** | null |
| `enforcement_ratio` | null | null — *no principles (not grafted)* | null |
| `drift_count` | 0 | 1 — *one dangling mother-reference* | 0 |
| `plan_traceability` | null | null — *no commits/rings yet* | null |
| `escalation_rate` | null | null | null |
| `ledger_trend` | null | null | null |

**The delta.** The beachhead converts an *unmeasurable* repo (no map; five of six metrics `null`) into a
*mapped, legible* one — `map_reachability` `null → 100%`. The metabolization-grown organs (principles,
fitness history, assessments) stay absent **by design**: SEED.md §4 step 4 is *"the map, the plan
structure, and the first lints. No behavior changes yet."* The single `drift_count` of 1 is the dangling
mother-reference [ring 0028](../rings/0028-installer-uninstall.md) foresaw ("the mother's copied docs
dangle until the host metabolizes them") — an honest property of a beachhead, not a regression.

## The uninstall path (SEED.md §4: "an uninstall path must exist")

Uninstall removed the 15 top-level graft paths and pruned the 7 directories it had emptied, leaving the
target **byte-identical** to its pre-graft empty state — **0 files remaining**, every metric back to
`null`. The method is self-carrying ([E-015](../plans/entropy-ledger.md)): the grafted seed's **own**
copied release CLI ran in the target (`sense` reported its pollen version against the grafted data) — the
method was installed *and works*, then cleanly reversed.

## The delta is the proof

The measured before/after **is** the Stage 3 exit proof (SEED.md §4): the seed versioned itself with its
own release tool and raised a sacrificial repo from unmeasurable to mapped with its own installer,
reversibly, and proved the method runs in the descendant. The exit criterion is met.

## What remains (outside this proof)

The **Stage 3 → 4 transition** — pollinating a *foreign* host, where pollen ships *externally* — was
gated on [E-004](../plans/entropy-ledger.md) (name/trademark) and [E-013](../plans/entropy-ledger.md)
(inferential control); **both cleared 2026-07-17** ([ring 0031](../rings/0031-name-cleared-codename-retained.md)
and [ring 0030](../rings/0030-inferential-control-judge.md)). The transition itself is a Gardener-approved
stage transition ([ring 0029](../rings/0029-recursive-self-upgrade-test.md)): meeting the exit criterion
(this artifact) was the seed's work; proposing the transition is the Gardener's, now that both
prerequisites are clear.

## Reproducibility

This artifact records the one real run against a sacrificial repo (a dated fact). The *shape* is pinned
reproducibly by the self-test `recursive test (ring 0029)`
([.seed/tests/self-test.ts](../../.seed/tests/self-test.ts)) — a hermetic graft into a scratch repo
asserting `map_reachability` `null → computable → null`-and-byte-identical, green forever in `npm test`.
