# .seed/ — machinery

Linters, structural tests, fitness scripts, and CI definitions. Everything here is
TypeScript run natively by Node (≥ 22.18, type stripping — no build step, zero
dependencies; ring [0002](../docs/rings/0002-germination-implementation-defaults.md)).

## Run

```bash
npm run check          # the invariant checks (fast, no git needed)
npm test               # the machinery self-tests (spawns the checks in temp copies)
# equivalently:
node .seed/checks/run-all.ts
node .seed/tests/self-test.ts
```

Exit code 0 means the repository holds its own invariants. Any violation exits non-zero.
CI additionally runs the ring append-only gate (below), which needs git history.

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

[checks/ring-append-only.ts](checks/ring-append-only.ts) enforces the append-only rule
of [docs/rings/README.md](../docs/rings/README.md) (converted from ledger E-005): any
modification or deletion of an existing ring since the base ref fails CI, naming LAW-10.
It is not part of `run-all.ts` because it needs git history; CI passes the event's base
ref (PR base branch, or the push's previous tip) and the script falls back to
`origin/main`, then `HEAD~1`, skipping with an explicit note only when nothing resolves
or the base shares no history with HEAD (orphan branch). The symlink route around its
pathspec (link a ring to a file outside `docs/rings/`, then edit the target) is closed
by the repo-wide symlink ban in `validate-anatomy`.

## Self-tests

[tests/self-test.ts](tests/self-test.ts) (`npm test`) verifies the verifiers (converted
from ledger E-007; LAW-6): it copies the repository to a temp directory, seeds one
violation class per case — every class the checks above claim to catch, 31 in all —
runs the copy's own `run-all.ts`, and asserts the right check fires with a law-naming
message and exit 1. A pristine copy must pass. The append-only gate is tested the same
way against a scratch git repo (modify, delete, append, unresolvable base, no shared
history). Fixture numbers are derived from the repository's current maxima, so cutting
the next real ring/plan/ledger entry cannot invalidate a seeded gap. Any change to a
validator that stops a class from firing fails CI.

## Error-message contract

Every violation a check emits must name the LAW (or principle) it enforces and state
concretely how to comply — the agent reading the failure *is* the context window you are
writing to (SEED.md §3). `lib/repo.ts` `formatViolation` enforces the shape; a check that
can't fill in the `fix` field doesn't understand its own rule yet.

## CI

[.github/workflows/seed-ci.yml](../.github/workflows/seed-ci.yml) is a deliberately thin
shim: checkout (full history) → Node → the invariant checks, the self-tests, and the
ring append-only gate, in that order. All logic lives here in `.seed/` so the CI
provider is swappable in one file (ring 0002). Hosted since
[E-002](../docs/plans/entropy-ledger.md) was paid.

## Repository plumbing

- [package.json](../package.json) — machinery manifest: `npm run check`, Node engine
  floor, `private: true`, zero dependencies.
- [.gitignore](../.gitignore) — `node_modules/` and OS noise only.
