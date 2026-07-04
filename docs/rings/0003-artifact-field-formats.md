# Ring 0003 — Ring and ledger field formats refine the genome's sketch

- Date: 2026-07-04
- Stage: 0 — Germination
- Raised-by: seed
- Question: SEED.md §2 sketches ring fields as combined bullets (`- Date / Stage /
  Raised-by (gardener | seed)`) and ledger fields as `- First observed / Where`. The
  validators require one explicit `- Key: value` bullet per field, so an agent copying
  the genome's sketch verbatim writes an artifact CI rejects. Which format is canonical?
- Decision: The explicit-key format documented in
  [docs/rings/README.md](README.md) and [docs/plans/README.md](../plans/README.md) is
  canonical — one `- Key: value` bullet per field, machine-checkable. The genome's §2
  blocks specify required *content*, not literal templates; the READMEs are the
  templates.
- Alternatives considered: Loosening the validators to also accept the combined-bullet
  sketch — rejected: two accepted formats means every future parser handles both, which
  is entropy by construction. Amending SEED.md §2 immediately — deferred: genome
  amendments need a Gardener-approved PR (LAW-1 gate); queued for the germination review
  instead.
- Enforcement: structural test — `.seed/checks/validate-rings.ts` and
  `.seed/checks/validate-plans.ts` accept only the explicit-key format and name it in
  their error messages.
- Revisit-when: SEED.md §2 is amended (fold this refinement into the genome and mark this
  ring superseded), or the Gardener objects at germination review.
