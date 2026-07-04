# Ring 0009 — Stage 0 → 1 transition approved

- Date: 2026-07-04
- Stage: 1 — Rooting (entering)
- Raised-by: gardener
- Question: SEED.md §4 requires each stage transition to be proposed as an execution
  plan, approved by a Gardener, and recorded as a ring. Is the Stage 0 → 1
  (Germination → Rooting) transition approved?
- Decision: Approved by the Gardener on 2026-07-04, on
  [plan 0002](../plans/active/0002-rooting.md) as proposed. Stage 1 is entered; plan 0002
  is the governing execution plan; the exit criterion is the seed detecting its own drift
  automatically, without being asked.
- Alternatives considered: Lingering in Stage 0 — rejected: both Stage 0 exit criteria
  were evidenced in [plan 0001](../plans/completed/0001-germination.md), and the genome
  forbids lingering past an exit criterion (SEED.md §4).
- Enforcement: doc-only — justified: a transition is a recorded governance event with no
  artifact to lint; its substance is enforced as plan 0002's scope items land as CI
  gates.
- Revisit-when: Never — transitions are historical facts; the next transition gets its
  own ring.
