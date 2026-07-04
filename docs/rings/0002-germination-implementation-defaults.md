# Ring 0002 — Germination implementation defaults

- Date: 2026-07-04
- Stage: 0 — Germination
- Raised-by: seed
- Question: The genome mandates first CI and TypeScript machinery (SEED.md §4 Stage 0
  step 6, §8) but does not name a CI provider, runtime version, dependency policy, or
  where CI definitions live relative to `.seed/`. What are the defaults?
- Decision:
  - CI provider: GitHub Actions, as a thin shim — `.github/workflows/seed-ci.yml` does
    nothing but check out, set up Node, and run `node .seed/checks/run-all.ts`. All logic
    lives in `.seed/` (the genome's home for CI defs); the shim is replaceable in one file
    if hosting changes.
  - Runtime: Node ≥ 22.18 running `.ts` files natively via type stripping (erasable-syntax
    TypeScript only — no enums, no namespaces, no decorators in machinery). No build step.
  - Dependency policy: zero runtime dependencies for machinery (LAW-7). The needed subset
    (file walking, markdown link extraction) is small enough to own outright.
  - Error-message contract: every check failure names the LAW or principle it enforces and
    states concretely how to comply (SEED.md §3 — write error messages for your future
    self). Checks exit non-zero on any violation.
- Alternatives considered:
  - `tsx`/`ts-node` runners — rejected: adds a dependency for what the platform now does
    natively (LAW-7).
  - A compile step (`tsc` → `dist/`) — rejected: indirection and a generated artifact to
    manage, for zero benefit at this scale.
  - Choosing no CI provider until hosting is decided — rejected: Stage 0 step 6 requires
    CI to exist now; the thin-shim design makes the provider choice cheap to reverse.
    Remote execution remains unproven until hosted (priced as
    [E-002 in the entropy ledger](../plans/entropy-ledger.md)).
- Enforcement: CI gate — `.seed/checks/validate-anatomy.ts` requires the shim and runner
  to exist; `package.json` `engines` declares the Node floor; the checks themselves run on
  every push/PR.
- Revisit-when: The Gardener's answer to germination question 1 implies non-GitHub
  hosting, or machinery genuinely needs a dependency, or Node type stripping changes.
