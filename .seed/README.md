# .seed/ — machinery

Linters, structural tests, fitness scripts, and CI definitions. Everything here is
TypeScript run natively by Node (≥ 22.18, type stripping — no build step, zero
dependencies; ring [0002](../docs/rings/0002-germination-implementation-defaults.md)).

## Run

```bash
npm run check          # the invariant checks (fast, no git needed)
npm test               # the machinery self-tests (spawns the checks in temp copies)
npm run garden         # the doc-gardener drift scan (advisory; reports drift_count)
npm run fitness        # the fitness v0 snapshot (advisory; prints all SEED.md §6 metrics)
# equivalently:
node .seed/checks/run-all.ts
node .seed/tests/self-test.ts
node .seed/checks/doc-drift.ts
node .seed/checks/fitness.ts
```

Exit code 0 means the repository holds its own invariants. Any violation exits non-zero.
CI additionally runs the git-aware gates (below), which need git history.

## Checks

| Check | Enforces | Law |
|---|---|---|
| [checks/validate-anatomy.ts](checks/validate-anatomy.ts) | The anatomy of SEED.md §2 exists; every organ has its README; no symlinks anywhere | LAW-2 |
| [checks/validate-map.ts](checks/validate-map.ts) | No dead links; every file ≤3 hops from AGENTS.md; reports `map_reachability` | LAW-4 |
| [checks/validate-rings.ts](checks/validate-rings.ts) | Ring filenames, sequence, and format (SEED.md §2) | LAW-10 |
| [checks/validate-plans.ts](checks/validate-plans.ts) | Plan filenames, sequence, format; ledger entry format | LAW-5, LAW-8 |

Shared helpers (repo walking, markdown link extraction, violation formatting):
[lib/repo.ts](lib/repo.ts). Runner: [checks/run-all.ts](checks/run-all.ts).

## Gates (git-aware, CI-invoked)

Gates are not part of `run-all.ts` because they need git history (the content checks
deliberately see only the working tree). CI passes each gate the event's base ref (PR
base branch, or the push's previous tip); the scripts fall back to `origin/main`, then
`HEAD~1`, skipping with an explicit note only when nothing resolves or the base shares
no history with HEAD (orphan branch).

[checks/ring-append-only.ts](checks/ring-append-only.ts) enforces the append-only rule
of [docs/rings/README.md](../docs/rings/README.md) (converted from ledger E-005): any
modification or deletion of an existing ring since the base ref fails CI, naming LAW-10.
The symlink route around its pathspec (link a ring to a file outside `docs/rings/`,
then edit the target) is closed by the repo-wide symlink ban in `validate-anatomy`.

[checks/plan-traceability.ts](checks/plan-traceability.ts) enforces traceability
(converted from ledger E-003; SEED.md §4 Stage 1): every non-merge commit since the
base ref must reference an existing plan or ring in its message — `plan 0002`,
`ring 0010`, ranges like `rings 0004-0007` — else CI fails naming LAW-5. Merge commits
are exempt (machine-written subjects; the commits they carry are each checked
individually). This makes the SEED.md §6 `plan_traceability` metric computable from CI
history.

## Drift detection

[checks/doc-drift.ts](checks/doc-drift.ts) is the doc-gardener's instrument
([skills/doc-gardener/SKILL.md](../skills/doc-gardener/SKILL.md)). It scans the
current-state doc surface for doc↔code drift — v0 detects the `stale-path-reference` class
(a current-state doc names a repo path that no longer exists) — and reports `drift_count`,
the SEED.md §6 fitness metric it sources. Unlike the checks above it is **advisory, not a
gate**: it always exits 0 on findings (ring
[0011](../docs/rings/0011-drift-advisory.md)), because drift is a trend the gardening
cadence digests continuously (LAW-8), not a merge blocker. It is therefore outside
`run-all.ts`; its detection is verified by the self-tests. `--json` emits
`{ drift_count, findings }` for the fitness computation (plan
[0002](../docs/plans/active/0002-rooting.md) scope item 4).

## Fitness

[checks/fitness.ts](checks/fitness.ts) computes the SEED.md §6 fitness v0 metrics (plan
[0002](../docs/plans/active/0002-rooting.md) scope item 4) and prints a dated snapshot —
`docs/fitness/history/*.json`, rendered in [docs/fitness/FITNESS.md](../docs/fitness/FITNESS.md).
Five of six metrics are computable today: `map_reachability` (reuses
`validate-map.ts`'s own computation), `enforcement_ratio` (scans `docs/principles/` for a
non-empty Enforcement field, vacuously 1 while no principle is stated yet),
`drift_count` (shells out to `doc-drift.ts --json`), `plan_traceability` (walks the
repo's entire non-merge commit history for a resolvable plan/ring reference, sharing its
reference grammar with `plan-traceability.ts` via `lib/repo.ts` so the gate and the trend
cannot silently disagree on what "traces" means), and `ledger_trend` (net change in open
ledger entries over a trailing 7-day git window). `escalation_rate` stays `null` — no
run-log instrument exists yet. Like doc-drift, it is **advisory**: a CI step runs it for
hosted evidence, but only a thrown error (a broken instrument) fails the run — the numbers
themselves never gate. `--json` emits the exact `{ date, stage, metrics }` snapshot shape.

## Self-tests

[tests/self-test.ts](tests/self-test.ts) (`npm test`) verifies the verifiers (converted
from ledger E-007; LAW-6): it copies the repository to a temp directory, seeds one
violation class per case — every class the checks above claim to catch, 31 in all —
runs the copy's own `run-all.ts`, and asserts the right check fires with a law-naming
message and exit 1. A pristine copy must pass. The gates are tested the same way against
scratch git repos (append-only: modify, delete, append, unresolvable base, no shared
history; traceability: plan and ring references pass, missing and phantom references
fail, merge commits exempt, unresolvable base skips). Fixture numbers are derived from
the repository's current maxima, so cutting
the next real ring/plan/ledger entry cannot invalidate a seeded gap. Any change to a
validator that stops a class from firing fails CI.

## Error-message contract

Every violation a check emits must name the LAW (or principle) it enforces and state
concretely how to comply — the agent reading the failure *is* the context window you are
writing to (SEED.md §3). `lib/repo.ts` `formatViolation` enforces the shape; a check that
can't fill in the `fix` field doesn't understand its own rule yet.

## CI

[.github/workflows/seed-ci.yml](../.github/workflows/seed-ci.yml) is a deliberately thin
shim: checkout (full history) → Node → the invariant checks, the self-tests, the
git-aware gates, and the fitness snapshot, in that order. All logic lives here in
`.seed/` so the CI provider is swappable in one file (ring 0002). Hosted since
[E-002](../docs/plans/entropy-ledger.md) was paid.

## Repository plumbing

- [package.json](../package.json) — machinery manifest: `npm run check`, Node engine
  floor, `private: true`, zero dependencies.
- [.gitignore](../.gitignore) — `node_modules/` and OS noise only.
