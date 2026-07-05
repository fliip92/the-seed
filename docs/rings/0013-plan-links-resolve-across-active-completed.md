# Ring 0013 — Plan links resolve across active/ and completed/

- Date: 2026-07-05
- Stage: 1 — Rooting
- Raised-by: seed
- Question: Closing plan 0002 `git mv`s it from `docs/plans/active/` to
  `docs/plans/completed/` (docs/plans/README.md § Procedure), but ring
  [0009](0009-stage-1-transition-approved.md) links plan 0002 by its `active/` path — and
  rings are append-only (the E-005 gate fails CI on any edit to an existing ring), so that
  link cannot be repointed. A literal-path map check would then see a dead link and fail
  CI. How should a link to a plan survive the plan's active/⇄completed/ relocation without
  rewriting history?
- Decision: A plan is a stable artifact identified by its four-digit number; its filing
  location (`active/` vs `completed/`) is mutable state. A link to
  `docs/plans/active/NNNN-slug.md` or `docs/plans/completed/NNNN-slug.md` therefore resolves
  to the plan wherever it currently lives. `validate-map` (and `fitness.ts`, which shares
  its reachability pass via `analyzeReachability`) checks a plan link's existence against
  both directories; the number and slug must still match exactly, so only the
  active/⇄completed/ segment flexes and a genuine typo stays a dead link. This mirrors the
  established traceability rule that a prose "plan NNNN" resolves if the plan exists in
  either directory (`lib/repo.ts`, `plan-traceability.ts`) — it closes the one remaining
  place link resolution still hard-coded a plan's mutable location. The Gardener selected
  this resolution (fix the class) over the two alternatives below.
- Alternatives considered:
  - **Amend the convention so completed plans never physically move** — denote completion by
    the `- Status:` line and the README indices alone. Rejected: it fights the anatomy
    (SEED.md §2: `active/` = plans in flight) and the plan 0001 precedent (already moved to
    `completed/`), trading a small central resolver for permanent directory/state
    inconsistency.
  - **Price the collision as ledger debt and defer** — rejected: the collision fires the
    instant plan 0002 moves, so deferral just means not closing 0002. The class fix is small
    and removes the whole class now (LAW-3: invariants over instances).
  - **Edit ring 0009's link to point at `completed/`** — impossible by design: the ring
    append-only gate (E-005) fails CI on any modification to an existing ring.
- Enforcement: CI gate — `validate-map` (the LAW-4 map check, run in `npm run check` and on
  every push/PR). Two self-tests pin the behavior (the E-007 harness, mutation-checked): a
  completed plan linked by its `active/` path yields no dead link (the rule holds), and a
  plan-shaped path that exists in neither directory stays a dead link (dead-link detection
  is not weakened).
- Revisit-when: plans stop being location-partitioned (e.g. a flat `docs/plans/` adopted at
  Flowering), or a plan's slug is allowed to change when it completes — either would change
  what "the same plan" means across the move, and this resolver would need to follow.
