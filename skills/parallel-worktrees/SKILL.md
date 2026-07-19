# parallel-worktrees

Decompose a large task across **isolated git worktrees** — boot one fully isolated instance of
the system per worktree (its own working tree, its own branch, its own logs and metrics,
queryable by you), then purge and consolidate at task end (SEED.md §4, Stage 2). Parallelism
without isolation is just shared state with more writers; worktrees give each sub-task its own
checkout so the branches diverge cleanly and merge deliberately, never by accident.

The genome ships only the **host-agnostic lifecycle**: create N isolated worktrees, boot an
instance per worktree through a host-adapter contract, tear them all down, and prove isolation
and cleanup held. **Host-specific boot mechanics live in host adapters, not in the genome** — an
iOS-simulator boot, a dev-build cache keyed to main's hash, a Metro/Orbit-style fast boot for a
mobile host. Each is one host's answer to "what does *boot an instance* mean here"; the genome
knows only the contract, never the answer (SEED.md §4).

## When to run

- A task splits cleanly into independent sub-tasks that each touch the working tree — a sweep
  across many files, N candidate implementations to compare, a refactor plus its regression
  check — and running them in one tree would make them step on each other. One worktree per
  sub-task keeps them isolated until you consolidate.
- You want to compare booted instances side by side (A/B a change, profile before vs. after)
  without rebuilding or re-checking-out between runs.
- Not for a change that is inherently sequential, or small enough for one tree — the worktree
  setup/teardown cost buys nothing there. Boring compounds (LAW-7): reach for this only when the
  isolation is load-bearing.

## The lifecycle

Work the cycle; the value is that every step is isolated and every worktree is accounted for at
the end.

1. **Decompose.** Split the task into sub-tasks that can each own a worktree. When the task is
   driven by a [plan](../../docs/plans/README.md), its `## Work units` section (ring
   [0036](../../docs/rings/0036-work-unit-format.md)) *is* this decomposition: each unit with no
   unmet `Depends-on` can own a worktree, and its `Entry-context` is exactly what that worktree's
   agent reads to start cold — no re-deriving the whole plan. If sub-tasks cannot be made
   independent, that is the finding — they belong in one tree, or the decomposition is wrong.
2. **Create.** One worktree per sub-task, each on its own branch (`seed/wt-<i>`), off the base
   commit. `git worktree add` gives each a separate working directory; a change in one is
   invisible in the others and in the base until you merge it.
3. **Boot.** Boot one instance per worktree through the host adapter (`boot(worktree, branch)`).
   The genome's default adapter treats the isolated checkout itself as the instance (its handle
   is the worktree's independent HEAD); a real host adapter boots whatever that host needs —
   simulator, dev server, cache — behind the same contract.
4. **Work & consolidate.** Do each sub-task in its worktree. When one is good, merge its branch
   back deliberately; discard the rest. Consolidation is a decision, not a side effect.
5. **Teardown.** At task end, `teardown` every booted instance, `git worktree remove` every
   worktree, delete every `seed/wt-*` branch, and `git worktree prune` — leaving the repository
   exactly at its baseline. A worktree left registered is leaked state; the teardown proves none
   were.

## The tool

[`.seed/checks/worktrees.ts`](../../.seed/checks/worktrees.ts) owns the host-agnostic lifecycle
and the `HostAdapter` contract (`boot` / `teardown`). It is not a `run-all.ts` gate (it needs
git and touches the filesystem) and not a per-commit metric — it is the machinery the lifecycle
above runs on, plus its own self-verifying dry-run:

```bash
npm run worktrees -- dry-run                 # human report
node .seed/checks/worktrees.ts dry-run --count 4 --json   # { mode, count, scratch, ok, checks }
```

The dry-run runs the whole cycle against a **hermetic scratch repo** it creates and owns under
the OS temp dir and removes at the end — so running it never creates a worktree, a branch, or a
file in the repository you run it from. It exits 0 when isolation and cleanup held, 1 on a
defect.

## Verification (LAW-6)

A skill that cannot prove it worked is a claim, not a capability. The lifecycle is verified by
its own `dry-run` and pinned by [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts)
(`npm test`), following the machinery's temp-copy methodology, with the same three-binding shape
[repo-fitness](../repo-fitness/SKILL.md) uses:

- **It works.** The dry-run creates, isolates, boots, and tears down N worktrees; every isolation
  assertion (own branch, distinct working tree, no leak into the base, unchanged base HEAD, a
  booted handle and a boot dispatch per worktree) and every cleanup assertion (count back to
  baseline, no `seed/wt-*` branches, no worktree directories, a teardown dispatch per instance)
  passes, exit 0 — and the self-test pins the exact ordered set of checks, so none can be silently
  dropped or stubbed.
- **The assertions have teeth.** An injected cross-worktree leak makes the isolation leak-check
  fire, and a skipped teardown makes the cleanup checks *and* the teardown-dispatch check fire —
  both exit 1. A dry-run whose checks can never go red would be doc-only enforcement in a costume
  (LAW-2), so the self-tests prove they go red on their fault class, and the exact-set pin guards
  the git-guaranteed checks no fault can force red.
- **It is hermetic and caller-invariant.** The scratch repo the dry-run reports no longer exists
  after the run, and running the dry-run from inside a git repo leaves that repo byte-identical
  (tree hash, `git worktree list`, and status unchanged) — the read-only-of-the-caller property,
  proven externally the way repo-fitness's non-mutation is.

Ring [0019](../../docs/rings/0019-parallel-worktrees-host-agnostic-lifecycle.md) records the
build decision: the genome ships the git-agnostic lifecycle plus the host-adapter boot contract,
and the hermetic dry-run is the verification.
