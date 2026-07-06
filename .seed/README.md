# .seed/ — machinery

Linters, structural tests, fitness scripts, and CI definitions. Everything here is
TypeScript run natively by Node (≥ 22.18, type stripping — no build step, zero
dependencies; ring [0002](../docs/rings/0002-germination-implementation-defaults.md)).

## Run

```bash
npm run check          # the invariant checks (fast, no git needed)
npm test               # the machinery self-tests (spawns the checks in temp copies)
npm run garden         # the doc-gardener drift scan (advisory; reports drift_count)
npm run fitness        # the seed's own fitness v0 snapshot (advisory; all SEED.md §6 metrics)
npm run repo-fitness -- <path>   # read-only §6 assessment of ANY repository (advisory)
npm run worktrees -- dry-run     # self-verifying dry-run of the parallel-worktrees lifecycle
npm run generate                 # rewrite every generated artifact from its sources
npm run feedback -- dry-run <path> ...   # compose (never post) a well-formed upstream issue (LAW-11)
# equivalently:
node .seed/checks/run-all.ts
node .seed/tests/self-test.ts
node .seed/checks/doc-drift.ts
node .seed/checks/fitness.ts
node .seed/checks/repo-fitness.ts <path>
node .seed/checks/worktrees.ts dry-run
node .seed/checks/generate.ts
node .seed/checks/feedback.ts dry-run <path> ...
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
| [checks/validate-architecture.ts](checks/validate-architecture.ts) | Architecture-doc format (grill-the-gardener): one page, lintable rules each naming an enforcement, explicit human/agent ownership split (SEED.md §4) | LAW-2 |
| [checks/validate-postmortems.ts](checks/validate-postmortems.ts) | Postmortem-entry format (postmortem): a failure links all three artifacts — fix, invariant (naming a mechanism + linking its enforcer), and an existing ring (SEED.md §4) | LAW-2 |
| [checks/validate-generated.ts](checks/validate-generated.ts) | The `docs/generated/` discipline (onboard-human): every generated artifact matches its regeneration from source, none is unregistered, no generator is broken (converts E-001) | LAW-2 |

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

[checks/automerge-scope.ts](checks/automerge-scope.ts) enforces ring
[0007](../docs/rings/0007-gardening-cadence-automerge.md)'s automerge touched-paths
restriction (converted from ledger E-008; mechanism in ring
[0012](../docs/rings/0012-cadence-automation-mechanism.md)): a commit that declares itself
automerge-class — an `Automerge: <class>` trailer naming one of ring 0007's mechanical
classes — must touch none of the Gardener-gated surfaces (SEED.md, existing ring content,
principle statements; the README indices are exempt), else CI fails naming LAW-8. Unmarked
commits are the Gardener-review path and are not constrained here. It makes the automerge
claim trustworthy; the residual (nothing forces a constitution edit to carry — or omit —
the marker while solo) is recorded with E-008 and hardens at Flowering with branch
protection. The `Automerge:` convention lives in [AGENTS.md](../AGENTS.md) § Protocols.

## Drift detection

[checks/doc-drift.ts](checks/doc-drift.ts) is the doc-gardener's instrument
([skills/doc-gardener/SKILL.md](../skills/doc-gardener/SKILL.md)). It scans the
current-state doc surface for doc↔code drift — v0 detects the `stale-path-reference` class
(a current-state doc names a repo path that no longer exists) — and reports `drift_count`,
the SEED.md §6 fitness metric it sources. Unlike the checks above it is **advisory, not a
gate**: it always exits 0 on findings (ring
[0011](../docs/rings/0011-drift-advisory.md)), because drift is a trend the gardening
cadence digests continuously (LAW-8), not a merge blocker. It is therefore outside
`run-all.ts`; its detection is verified by the self-tests. Its `scanDrift` scan is exported
and root-parameterized: the fitness engine imports it directly to compute `drift_count`
against any repo (ring [0016](../docs/rings/0016-repo-fitness-generalizes-the-metric-engine.md)),
and the gardening-report composer shells its `--json` (`{ drift_count, findings }`).

## Fitness

The SEED.md §6 fitness v0 metrics are computed by one root-parameterized engine,
[lib/fitness-metrics.ts](lib/fitness-metrics.ts) (ring
[0016](../docs/rings/0016-repo-fitness-generalizes-the-metric-engine.md)), so there is a
single definition of what each metric means (LAW-3). Two thin CLIs call it:

- [checks/fitness.ts](checks/fitness.ts) — the seed's **self**-assessment (plan
  [0002](../docs/plans/completed/0002-rooting.md) scope item 4): the engine pointed at this
  repository, printing a dated snapshot (`docs/fitness/history/*.json`, rendered in
  [docs/fitness/FITNESS.md](../docs/fitness/FITNESS.md)). It carries the hand-bumped
  `CURRENT_STAGE` (E-011).
- [checks/repo-fitness.ts](checks/repo-fitness.ts) — the same engine pointed at **any**
  repository (plan [0003](../docs/plans/active/0003-growth.md) scope item 2), the seed's
  read-only diagnostic instrument for hosts (SEED.md §4, Stage 2). It is **strictly
  read-only** — reads files and runs only read-only git subcommands against the target — and
  its non-mutation is proven by the self-tests (LAW-6).

The engine computes: `map_reachability` (reuses `validate-map.ts`'s own computation),
`enforcement_ratio` (scans `docs/principles/` for a non-empty Enforcement field, vacuously 1
while no principle is stated yet), `drift_count` (calls `doc-drift.ts`'s exported `scanDrift`
directly), `plan_traceability` (walks the target's entire non-merge commit history for a
resolvable plan/ring reference, sharing its reference grammar with `plan-traceability.ts` via
`lib/repo.ts` so the gate and the trend cannot silently disagree on what "traces" means), and
`ledger_trend` (net change in open ledger entries over a trailing 7-day git window).
`escalation_rate` stays `null` — no run-log instrument exists yet. Against a **foreign**
repository, any metric whose defining anatomy is absent (no `AGENTS.md`, no `docs/principles/`,
no plan/ring log, no ledger, not a git repo) comes back `null` with a stated reason — the same
null-when-absent contract `escalation_rate` uses, and that null IS the finding.

Like doc-drift, both are **advisory**: a CI step runs `fitness.ts` for hosted evidence, but
only a thrown error (a broken instrument) fails the run — the numbers never gate. `fitness.ts
--json` emits the exact `{ date, stage, metrics }` snapshot shape; `repo-fitness.ts --json`
emits `{ date, stage, metrics, notes }` (stage null, notes explaining each null).

## Parallel worktrees

[checks/worktrees.ts](checks/worktrees.ts) owns the host-agnostic worktree lifecycle for the
[parallel-worktrees](../skills/parallel-worktrees/SKILL.md) skill (plan
[0003](../docs/plans/active/0003-growth.md) scope item 4, ring
[0019](../docs/rings/0019-parallel-worktrees-host-agnostic-lifecycle.md)): create N isolated
worktrees, boot an instance per worktree through a `HostAdapter` contract (`boot` / `teardown`),
tear them all down, and prove isolation + cleanup held. Host-specific boot mechanics (simulators,
dev-build caches, Metro/Orbit fast boot) implement that contract and live in host adapters, not
here (SEED.md §4). It is neither a `run-all.ts` gate (it needs git and touches the filesystem)
nor a per-commit metric, so — like `repo-fitness.ts` — it stays out of the CI shim and is reached
through the map rather than added to `validate-anatomy`'s `REQUIRED_FILES`.

Its own `dry-run` is its verification: `node .seed/checks/worktrees.ts dry-run [--count N]
[--json]` runs the whole lifecycle against a **hermetic scratch repo** it creates and owns under
the OS temp dir and removes at the end, so a run never creates a worktree, branch, or file in the
repository it runs from. Unlike the advisory instruments it is **self-asserting**: exit 0 when
isolation and cleanup held, exit 1 on a defect. `--json` emits `{ mode, count, scratch, ok,
checks }`.

## Feedback

[checks/feedback.ts](checks/feedback.ts) owns the upstream-issue **composer** for the
[feedback](../skills/feedback/SKILL.md) skill (plan [0003](../docs/plans/active/0003-growth.md)
scope item 6, ring [0021](../docs/rings/0021-feedback-composes-upstream-issue.md)): from any
repository it composes a well-formed issue to send upstream against the mother seed (LAW-11;
SEED.md §7) — a `[seed-feedback]` title and a fixed body (Lineage / Kind / What happened / Why this
is upstream / Proposed conversion), addressed to the descendant's `parent`. **It never posts** —
there is no network path in it; it emits the exact `gh issue create` command a human runs to post,
once the Gardener approves (an outward act, LAW-1). The parent comes from the target's
`lineage.json` (in `pollen/`; SEED.md §7's `seed version, parent, date planted`) or `--parent`; a **root
seed** with no recorded parent is refused (feedback flows *upstream* — a learning at the root is a
ring or a ledger entry). Like [repo-fitness](checks/repo-fitness.ts) and [worktrees](checks/worktrees.ts)
it reads arbitrary targets and is not a per-commit invariant, so it stays out of `run-all.ts` and is
reached through the map. `--json` emits `{ mode, ok, target, title, body, command, violations }`;
exit 0 = a well-formed issue composed, 1 = it could not be (ill-formed learning, or no upstream),
2 = usage. Its self-verification (composes well-formed, has teeth, side-effect-free) is the
self-tests (below).

## Generation

[lib/generated.ts](lib/generated.ts) is the **generation manifest** (converting ledger E-001,
ring [0020](../docs/rings/0020-onboard-human-generated-briefing.md)) behind the
[onboard-human](../skills/onboard-human/SKILL.md) skill: a typed registry where every
[docs/generated/](../docs/generated/README.md) artifact names its sources, its regeneration
command, and a **pure** `generate(root)` function — the single definition of what the artifact is
(LAW-3), shared by the generator and its check. Generators take no wall-clock and no environment,
so an artifact regenerates byte-identically.

[checks/generate.ts](checks/generate.ts) (`npm run generate`) rewrites every manifest artifact
from its sources. [checks/validate-generated.ts](checks/validate-generated.ts) is the gate that
makes the discipline real: part of `run-all.ts`, it re-runs each generator and fails when a
committed artifact differs from its regeneration (a hand-edit, or a source changed without
regenerating), when a `docs/generated/` file is registered by no manifest entry, or when a
generator cannot run (e.g. a source it reads is gone). It is a `run-all.ts` gate rather than an advisory instrument
because the generator is a pure function of the working tree (no git, no filesystem side effects)
and a stale generated artifact is a correctness defect, not a trend.

## Self-tests

[tests/self-test.ts](tests/self-test.ts) (`npm test`) verifies the verifiers (converted
from ledger E-007; LAW-6): it copies the repository to a temp directory, seeds one
violation class per case — every class the checks above claim to catch —
runs the copy's own `run-all.ts`, and asserts the right check fires with a law-naming
message and exit 1. A pristine copy must pass. The three gates are tested the same way against
scratch git repos (append-only: modify, delete, append, unresolvable base, no shared
history; traceability: plan and ring references pass, missing and phantom references
fail, merge commits exempt, unresolvable base skips; automerge-scope: marked-vs-protected
fails, unknown class fails, unmarked passes, both README indices exempt, a non-ASCII-named
protected add still fails, merge commit exempt, unresolvable base skips). The
gardening-report composer is covered too (pristine → no findings + a valid date; a seeded
stale reference flips has_findings and renders). repo-fitness (ring
[0016](../docs/rings/0016-repo-fitness-generalizes-the-metric-engine.md)) is pinned by three
cases: self-equivalence (`repo-fitness <seed>` metrics byte-identical to `fitness.ts`),
honest degradation against a synthetic foreign repo (anatomy metrics null with reasons,
`drift_count` still catches a seeded stale reference; a non-git target reports the
not-a-git-repository reason), and read-only (target tree hash, git HEAD, and status unchanged
after a run). The postmortem-entry check (ring
[0017](../docs/rings/0017-postmortem-three-artifacts-linked.md)) is pinned the same way — a
valid three-artifact entry passes, and an unlinked fix, a prose invariant (no mechanism), an
invariant with no link, a non-ring `Ring` link, a missing field, a title/number mismatch, a
bad filename, and a duplicate and a gap in numbering each fire. The parallel-worktrees dry-run
(ring [0019](../docs/rings/0019-parallel-worktrees-host-agnostic-lifecycle.md)) is pinned: it works
(the full lifecycle passes, exit 0, with the exact ordered check-set present and all green so no
assertion can be silently dropped), its assertions have teeth (an injected leak fires the isolation
leak-check; a skipped teardown fires the cleanup checks and the teardown-dispatch check; both
exit 1), and it is hermetic and caller-invariant (the scratch repo it reports is gone after the
run, and running it from inside a git repo leaves that repo byte-identical). The generated-artifact
check (ring [0020](../docs/rings/0020-onboard-human-generated-briefing.md)) is pinned too: the
pristine artifact matches its regeneration, regeneration is a deterministic fixpoint (regenerate →
the bytes are identical and the tree stays green), and a hand-edited artifact, a source changed
without regenerating, a moved source anchor, an unregistered file in `docs/generated/`, and a
missing artifact each fire. The feedback composer (ring
[0021](../docs/rings/0021-feedback-composes-upstream-issue.md)) is pinned the same three-binding way:
it works (a descendant composes a well-formed upstream issue with the exact ordered section set, all
green, and deterministically), its validation has teeth (a missing field, an unknown kind, an unknown
conversion, a malformed lineage file, and a root seed with no parent each exit 1 with a legible
message), and it is side-effect-free (composing leaves the target byte-identical and posts nothing —
the `gh` command emitted as text). Fixture numbers are derived from
the repository's current maxima, so cutting
the next real ring/plan/ledger entry cannot invalidate a seeded gap. Any change to a
validator that stops a class from firing fails CI.

## Error-message contract

Every violation a check emits must name the LAW (or principle) it enforces and state
concretely how to comply — the agent reading the failure *is* the context window you are
writing to (SEED.md §3). `lib/repo.ts` `formatViolation` enforces the shape; a check that
can't fill in the `fix` field doesn't understand its own rule yet.

## Gardening cadence

[checks/gardening-report.ts](checks/gardening-report.ts) composes the weekly gardening
pass (ring [0007](../docs/rings/0007-gardening-cadence-automerge.md), converting ledger
E-008 — the scheduled half of plan 0002 scope item 5). It shells to the two instruments
above (`doc-drift.ts --json` for the drift findings, `fitness.ts --json` for the current
snapshot) because it wants their rendered output, not their internals, and
renders a markdown pass report plus the triage checklist. `--json` emits
`{ date, has_findings, drift_count }`. Like the instruments it composes it is **advisory**:
a sensing record, never a gate.

[.github/workflows/gardening-cadence.yml](../.github/workflows/gardening-cadence.yml) runs
it on a weekly cron (plus manual `workflow_dispatch`) and files a durable gardening-pass
issue when there is drift to digest, so sensed entropy surfaces on cadence even when no
working session opens — E-008's exact risk. Least privilege: `contents: read`,
`issues: write`.

## CI

[.github/workflows/seed-ci.yml](../.github/workflows/seed-ci.yml) is a deliberately thin
shim: checkout (full history) → Node → the invariant checks, the self-tests, the three
git-aware gates (append-only, traceability, automerge-scope), and the fitness snapshot, in
that order. All logic lives here in `.seed/` so the CI provider is swappable in one file
(ring 0002). Both workflows pin `actions/checkout@v5` and `actions/setup-node@v5`, which
declare the Node 24 runtime (E-010). Hosted since
[E-002](../docs/plans/entropy-ledger.md) was paid.

## Repository plumbing

- [package.json](../package.json) — machinery manifest: `npm run check`, Node engine
  floor, `private: true`, zero dependencies.
- [.gitignore](../.gitignore) — `node_modules/` and OS noise only.
- [.gitattributes](../.gitattributes) — pins every text file to LF on checkout, so the
  byte-exact generated-artifact gate ([checks/validate-generated.ts](checks/validate-generated.ts))
  holds on any platform, including a Windows checkout with `core.autocrlf=true` (ring
  [0020](../docs/rings/0020-onboard-human-generated-briefing.md)).
