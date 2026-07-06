# Ring 0019 — parallel-worktrees ships the host-agnostic worktree lifecycle; boot lives in host adapters, verified by a hermetic dry-run

- Date: 2026-07-05
- Stage: 2 — Growth
- Raised-by: seed
- Question: Building [plan 0003](../plans/active/0003-growth.md) scope item 4
  (parallel-worktrees) — decompose a large task across isolated git worktrees, one booted
  instance per worktree, torn down at task end (SEED.md §4, Stage 2) — what does the *genome*
  ship versus a host, where does "boot an instance" live, and how is "creates and tears down N
  worktrees, isolation plus cleanup" verified (LAW-6) without the verification itself leaving
  worktrees or branches behind in the repository it runs from?
- Decision:
  - **The genome ships only the host-agnostic lifecycle.**
    [`.seed/checks/worktrees.ts`](../../.seed/checks/worktrees.ts) owns the git-only cycle:
    create N isolated worktrees (each on its own `seed/wt-<i>` branch off the base commit), boot
    an instance per worktree, tear them all down (`worktree remove` + `branch -D` +
    `worktree prune`), and assert isolation and cleanup held. This is pure git — it is identical
    on any host — so it belongs in the genome. The [skill](../../skills/parallel-worktrees/SKILL.md)
    documents the decompose → create → boot → work/consolidate → teardown workflow the lifecycle
    runs.
  - **"Boot an instance" is a host-adapter contract, not genome code (SEED.md §4).** The tool
    exports a `HostAdapter` interface — `boot(worktree, branch)` and `teardown(instance)` — and a
    default *genome adapter* that is deliberately host-agnostic: it treats the isolated checkout
    itself as the instance (the handle is the worktree's independent HEAD, so the instance is
    "queryable by you"), and its teardown is a no-op because the genome acquires no host-specific
    resource. Real host boot mechanics — an iOS-simulator boot, a dev-build cache keyed to main's
    hash, a Metro/Orbit fast boot — implement the same contract and live in host adapters
    *outside* the genome. SEED.md §4 draws exactly this line ("Host-specific mechanics … live in
    host adapters, not in the genome"); the contract is the seam.
  - **The verification is a hermetic dry-run — the tool verifies itself (LAW-6).** `dry-run`
    runs the whole cycle against a scratch git repo it creates and owns under the OS temp dir and
    removes in a `finally`, so a run never creates a worktree, branch, or file in the caller's
    repository. It asserts **isolation** (each worktree on its own branch, distinct working-tree
    content, no work leaked into the base tree, the base HEAD unmoved, a booted handle per
    worktree) and **cleanup** (worktree count back to baseline, no `seed/wt-*` branches, no
    worktree directories). Exit 0 when both held, 1 on a defect — it is self-asserting, unlike
    the advisory instruments (doc-drift, fitness) that always exit 0. `--json` emits
    `{ mode, count, scratch, ok, checks }`.
  - **The dry-run's assertions must have teeth (the sharp LAW-2 point).** Git *guarantees*
    worktree isolation, so a dry-run that only ever passes proves nothing — it would be doc-only
    enforcement in a costume. Two mechanisms give the checks teeth. (1) A test-only
    `--inject <fault>` forces the two *behavioral* defect classes the genome owns: `leak` (a
    worktree's work written into the base tree) fires the isolation leak-check, and `skip-teardown`
    (the per-instance teardown loop skipped) fires the cleanup checks *and* the teardown-dispatch
    check — so the teardown half of the host-adapter contract is observable, not just the git
    removal (the dry-run counts boot/teardown dispatches through a wrapping adapter, since the
    no-op genome adapter releases nothing observable). (2) The happy-path self-test pins the *exact
    ordered set* of check names, so the git-guaranteed checks (own-branch, distinct content,
    unmoved base HEAD) — which no fault can force red — still cannot be silently deleted, renamed,
    or made vacuously-true without turning the suite red. This is the postmortem-skill discipline
    (a validator that does not fire on its class is doc-only in costume) applied to a functional
    dry-run rather than a structural check.
  - **No new CI step, no new required-anatomy entry** — the ring 0016 (repo-fitness) precedent.
    The dry-run needs git and touches the filesystem, so it is not a `run-all.ts` gate; it is an
    on-demand lifecycle tool whose correctness proof is the self-tests, exactly like
    [`repo-fitness.ts`](../../.seed/checks/repo-fitness.ts). The tool and skill are reached
    through the map (`.seed/README.md`, `skills/README.md`) and covered by `validate-map`'s
    reachability rather than added to `validate-anatomy`'s curated `REQUIRED_FILES`.
- Alternatives considered:
  - *Bake host boot mechanics (simulators, dev-build caches) into the genome* — rejected: SEED.md
    §4 reserves those for host adapters, and hard-coding one host's boot into the genome is the
    dogma-not-method failure Stage 4 warns against. The genome ships the contract; hosts ship the
    answer.
  - *Run the dry-run against the live repository (real worktrees off the caller's HEAD)* —
    rejected: the verification would create real branches/worktrees and depend on the caller's
    state, and a crash mid-run would leak them. A hermetic scratch repo makes the cycle
    deterministic and leaves the caller byte-identical — the repo-fitness read-only discipline
    (ring 0016), here achieved by owning a throwaway repo rather than by only reading the target.
  - *A structural check in `run-all.ts` instead of a runnable dry-run* — rejected: worktree
    isolation and cleanup are behavioral, not a property of a file's text; only actually creating
    and tearing down worktrees can assert them. So the verification is a functional dry-run, like
    the gate tests exercise real git, not a static validator.
  - *Ship the dry-run without fault injection* — rejected: it would pass unconditionally (git
    enforces the isolation it checks), making it exactly the "try harder" non-fix — a green light
    that proves nothing. `--inject` gives the assertions teeth the self-tests pin (LAW-2).
  - *A new `adapters/` organ now* — deferred: no host adapter exists yet (the seed is a docs +
    machinery repo whose "instance" is the checkout itself). Introducing the organ before its
    first inhabitant would be empty scaffolding; the contract lives in the tool's types until a
    real host needs a home for its adapter, priced nowhere because nothing needs it yet.
- Enforcement: structural test — the dry-run
  [`.seed/checks/worktrees.ts`](../../.seed/checks/worktrees.ts) is self-asserting (exit 1 on any
  isolation/cleanup defect), and [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts)
  (`npm test`) pins it: it works (the full lifecycle passes, exit 0, with the exact ordered
  check-set present and all green so no assertion can be silently dropped); its assertions have
  teeth (an injected leak fires the isolation leak-check; a skipped teardown fires the cleanup
  checks *and* the teardown-dispatch check; both exit 1 — proven by mutation: dropping the
  teardown dispatch or renaming an isolation check turns the suite red); it is hermetic (the
  reported scratch repo no longer exists after the run); and it is caller-invariant (run from
  inside a git repo, it leaves that repo byte-identical — tree hash, `git worktree list`, and
  status unchanged — the before/after proof repo-fitness uses for non-mutation). `npm run check`
  stays green — the two new files are map-reachable.
- Revisit-when: a real host adapter lands and needs a home outside the tool's types (the
  deferred `adapters/` organ becomes worth cutting); or the genome's git lifecycle needs an
  operation the dry-run does not cover (locking, detached-HEAD worktrees, submodules); or booting
  real instances proves the no-op default adapter too thin to verify against.
