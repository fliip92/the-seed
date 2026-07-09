# Ring 0023 — grounded-or-ask: the first stated principle and its validator

- Date: 2026-07-08
- Stage: 2 — Growth
- Raised-by: seed
- Question: The principles organ (SEED.md §2) has stood empty since germination, so
  `enforcement_ratio` (SEED.md §6) measured nothing and the epistemic discipline under the intake
  family (plan 0004) lived only as plan prose. What is the seed's first stated principle, and how
  is a principle's own claim of enforcement made legible and enforceable (LAW-2) so the organ
  cannot fill with unenforceable wishes?
- Decision: State **grounded-or-ask** as the first principle
  ([docs/principles/grounded-or-ask.md](../principles/grounded-or-ask.md)): every claim in a
  distilled or generated artifact is cited to a source or raised as a question; a silent assumption
  is a defect. Enforce the principle *format* with a new `run-all` check,
  [validate-principles](../../.seed/checks/validate-principles.ts), which binds every
  `docs/principles/*.md` to the §2 four-field format AND requires the Enforcement clause to name a
  mechanism (lint | structural test | CI gate | doc-only) whose enforcer is **linked and exists** —
  the [validate-postmortems](../../.seed/checks/validate-postmortems.ts) Invariant discipline
  applied to the principle itself. grounded-or-ask's interim enforcer is
  [validate-generated](../../.seed/checks/validate-generated.ts) (the generated-artifact family: no
  claim survives that is not regenerable from a named source); the distilled-reference family's
  enforcer, `validate-references`, lands in plan 0004 scope item 3, and its link is added to the
  principle then. The faithfulness residual (E-013) stays doc-only (compose-not-commit + Gardener
  ratification).
- Alternatives considered:
  - Make validate-principles mechanism-only, like validate-architecture's Rules — rejected: a
    principle is the *numerator* of `enforcement_ratio`, so a phantom enforcer would inflate a
    fitness reading with a claim CI cannot back; the enforcer must be proven to exist (the
    validate-postmortems precedent, stronger than validate-architecture).
  - Collapse scope items 1 and 3 so grounded-or-ask names `validate-references` from the start —
    rejected: it couples the first principle to an unbuilt check. Naming the existing
    validate-generated now and adding validate-references when it lands is honest, monotonic
    growth — the principle's enforcement widens as the machinery does.
  - Allow a purely doc-only principle (no enforcer link) — rejected: docs/principles/README already
    routes "cannot enforce it yet" to the entropy ledger, so the organ holds only mechanically
    anchored taste. A principle may *note* a doc-only residual (grounded-or-ask does, for
    faithfulness) but must link at least one real enforcer.
- Enforcement: structural test — [validate-principles](../../.seed/checks/validate-principles.ts)
  in `run-all`, pinned by [self-test.ts](../../.seed/tests/self-test.ts) (the format cases, the
  mechanism/enforcer-exists teeth, and a valid-principle-passes block). With grounded-or-ask landed,
  `enforcement_ratio` (SEED.md §6) carries its first real datum (1/1).
- Revisit-when: the principle format needs a field the four do not cover, or the enforcer-exists
  teeth prove too strict for a legitimate principle (e.g. one enforced by an external CI the
  markdown link parser cannot follow) — then loosen the link rule via a superseding ring.
