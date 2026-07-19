# Ring 0034 — dither graft approved: the Propose is accepted; E-016 paid seed-side; the first dither mutation stays Gardener-gated

- Date: 2026-07-18
- Stage: 4 — Pollination
- Raised-by: gardener
- Question: Does the owner approve the dither graft Propose
  ([plan 0007](../plans/active/0007-dither-graft.md)) — the ordered migration (map + reachability
  gate, commit→ADR gate, principles, seeded ledger) distilled from the Scout
  ([assessment 0002](../assessments/0002-dither.md)) + Grill
  ([ring 0033](0033-dither-grill-outcomes.md)) — and how should it be sequenced against the first
  mutation of a real host?
- Decision: **Approved.** The owner accepts plan 0007 as written, authorizing the Graft (SEED.md §4
  step 4). Sequencing chosen: **pay [E-016](../plans/entropy-ledger.md) seed-side first** (make
  `map_reachability` resolve a host's canonical map filename), then **pause before writing anything
  into dither** so the instrument can be seen reading dither's real tree before the first host
  mutation. E-016 is paid this session — read-only on dither, `map_reachability` moved null → 1.4%
  (reachable from `CLAUDE.md`), dither byte-identical. The first *dither* mutation (grafting the
  reachability gate) stays gated pending the owner's go.
- Alternatives considered: begin the full graft immediately (rejected for now — the first mutation
  of a real host warrants a deliberate checkpoint, and E-016 is seed-side so it lands risk-free
  first); hold the Propose unapproved (rejected — the Scout + Grill are done and the migration is
  evidence-judgeable, per plan 0007); amend the migration before approving (declined — accepted as
  written).
- Enforcement: CI gate / lint — the approval authorizes building plan 0007's ordered lints (the
  reachability + dead-link gate from `CLAUDE.md`, the commit→ADR gate, the `ci.yml` principles, the
  seeded ledger), each a graft-step check shipping its own verification (LAW-6); the approval itself
  is doc-only (a Gardener gate act — the transition-approval precedent, rings 0009/0014/0025/0032).
  E-016 is paid + self-tested (its ledger Paid entry).
- Revisit-when: the owner revokes or amends the migration; a graft item's design surfaces an
  ambiguity needing its own ring; or the first dither mutation is authorized (the pause lifts).
