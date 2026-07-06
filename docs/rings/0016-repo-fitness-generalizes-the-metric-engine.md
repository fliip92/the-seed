# Ring 0016 — repo-fitness generalizes the metric engine; self-fitness is the target=self case

- Date: 2026-07-05
- Stage: 2 — Growth
- Raised-by: seed
- Question: Building [plan 0003](../plans/active/0003-growth.md) scope item 2 (repo-fitness) —
  a read-only fitness assessment of *any* repository, computing the SEED.md §6 metrics without
  mutating the target — how is it structured so it does not duplicate the seed's existing
  self-assessment ([`fitness.ts`](../../.seed/checks/fitness.ts)), what does a metric read
  against a repo that lacks the seed's anatomy, and how is read-only proven (LAW-6)?
- Decision:
  - **One engine, two thin CLIs.** The SEED.md §6 metric computation is generalized into a
    single root-parameterized engine,
    [`.seed/lib/fitness-metrics.ts`](../../.seed/lib/fitness-metrics.ts): `computeMetrics(root)`
    computes all six metrics against any repository root. `fitness.ts` (the seed's
    **self**-assessment) is the `target=self` case (`root = REPO_ROOT`); `repo-fitness.ts` (any
    repository) is the `target=argv` case. So *what a metric means* has exactly one
    implementation (LAW-3) — the seed measures a foreign repo by running its own instruments
    against that repo's root, the self-hosting move (SEED.md §0: apply the method to yourself
    first). The shared file primitives (`lib/repo.ts`: `listRepoFiles`, `readRepoFile`, the
    markdown/link/inline-code readers, `numberedFilenames`) and the two metric analyses that
    already lived in checks (`analyzeReachability` in `validate-map.ts`, `scanDrift` in
    `doc-drift.ts`) each took a new optional `root` argument defaulting to `REPO_ROOT`, so every
    existing caller — the `run-all.ts` checks — is byte-for-byte unchanged, and only the engine
    passes a foreign root.
  - **Metrics degrade to `null` with a stated reason.** The §6 metrics are defined over the
    seed's anatomy (an `AGENTS.md` map, `docs/principles/`, a plan/ring log, an entropy ledger,
    a git history). A foreign repo carries little of it, so each metric reads `null` when the
    target lacks the structure it is defined over — no `AGENTS.md` → `map_reachability` null; no
    `docs/principles/` organ → `enforcement_ratio` null; not a git repo, or no plan/ring log →
    `plan_traceability` null; no ledger, or not a git repo → `ledger_trend` null. This is the
    same null-when-absent contract `escalation_rate` already uses, and **the null plus its
    reason is the diagnostic finding** a stranger evaluates, not a broken instrument.
    `drift_count` is the one universal metric (a doc naming a path that does not exist is drift
    in any repo) and always computes.
  - **Strictly read-only, proven not asserted.** The engine reads files and runs only
    read-only git subcommands (`rev-parse`, `rev-list`, `log`, `show`) against the target with
    `git -C <root>`; it never writes, inits, stages, or commits, and a git failure (non-repo,
    no commits) degrades to `null` rather than throwing. The verification hashes the target
    tree before and after a run and asserts byte-identical, and asserts `git status` stays
    clean — mutation is a test failure.
  - **`doc-drift.ts` runs `main()` only when executed directly.** So the engine can `import`
    its exported `scanDrift` without triggering the report as an import side effect — which is
    precisely why `fitness.ts` used to shell out to a subprocess. That subprocess wart is now
    gone; drift is computed by a direct, root-parameterized function call, symmetric with how
    reachability is already imported from `validate-map.ts`.
  - **No new CI step, no new required-anatomy entry.** `repo-fitness` is an on-demand
    diagnostic for *foreign* repos, not a per-commit self-metric (that is `fitness.ts`'s job,
    already in seed-ci), so it stays out of the CI shim (the ring 0002 thin-shim ethos); its
    correctness proof is the self-tests, exactly like `doc-drift.ts`. And like
    `validate-architecture.ts` (ring 0015), the new instrument and skill are reached through
    the map (`.seed/README.md`, `skills/README.md`) and covered by `validate-map`'s
    reachability rather than added to `validate-anatomy`'s `REQUIRED_FILES` — that set is a
    curated subset (the runner, the E-005 gate, the Stage-1 metric sources), not every file.
- Alternatives considered:
  - *Duplicate the metric logic in `repo-fitness.ts`* — rejected outright: it creates exactly
    the doc↔code / two-sources-of-truth drift the seed exists to kill (LAW-3), letting "what
    `map_reachability` means" silently diverge between self and foreign assessment.
  - *Report `0` (or a low fraction) instead of `null` for absent anatomy* — rejected: a foreign
    repo with no plan/ring log is not *failing* traceability at 0%, the metric does not apply;
    `null` + reason is honest, `0` is a false negative that would poison the trend.
  - *Keep shelling out to `doc-drift.ts --json` and add a `--root` flag to it* — rejected: a
    subprocess cannot point `doc-drift.ts` at a foreign root (it computes `REPO_ROOT` from its
    own location), and importing the exported function after guarding `main()` is simpler,
    faster, and removes a wart rather than adding a flag.
  - *Move `analyzeReachability`/`scanDrift` into `lib/`* — considered; deferred. `fitness.ts`
    already imported `analyzeReachability` from a `run-all` check, so the engine importing both
    analyses from the checks that own them is the established pattern; a lib move is a larger
    refactor with no behavior gain, priced nowhere because nothing needs it yet.
  - *Run `repo-fitness .` as a CI step too* — rejected as redundant with `fitness.ts` and the
    self-equivalence self-test; it would thicken the shim for no new signal.
- Enforcement: structural test — [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts)
  (`npm test`) pins repo-fitness with three bindings: self-equivalence (`repo-fitness <seed>`
  metrics byte-identical to `fitness.ts`), honest degradation (a synthetic foreign git repo
  and a non-git directory return the right `null`s with reasons while `drift_count` still
  catches a seeded stale reference), and read-only (target tree hashed before/after asserted
  identical, `git status` clean). The pre-existing `fitness.ts` self-tests continue to pass
  unchanged, proving the generalization preserved the self case. `npm run check` stays green
  (the two new files are map-reachable).
- Revisit-when: the null-when-absent contract proves too coarse for a real host (a metric
  needs a partial reading rather than `null`); or a run-log instrument lands and
  `escalation_rate` stops being unconditionally null; or the shared analyses are needed
  somewhere a `lib/` move would pay for itself.
