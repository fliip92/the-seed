# docs/principles/ — golden principles

One file per principle. Each principle states: the rule, the rationale, the enforcement
(tool + rule id), and allowed exceptions. **A principle without an enforcement line is
itself entropy** (LAW-2) — if you cannot enforce it yet, it belongs in the
[entropy ledger](../plans/entropy-ledger.md) with a conversion path, not here.

## Format

```markdown
# <principle name>

- Statement: <the rule, one or two sentences>
- Rationale: <why this rule exists — the failure it prevents>
- Enforcement: <tool + rule id, e.g. `seed/no-freetext-log` in .seed/checks/>
- Exceptions: <allowed exceptions, or "none">
```

The format is enforced by [validate-principles](../../.seed/checks/validate-principles.ts)
(in `run-all`, ring [0023](../rings/0023-grounded-or-ask-first-principle.md)): every principle
here must carry the four fields, and its Enforcement clause must name a mechanism whose enforcer
**exists** — so a principle is mechanically anchored taste, never a wish that inflates
`enforcement_ratio` (SEED.md §6) with a claim CI cannot back.

## Principles

- [grounded-or-ask](grounded-or-ask.md) — every claim in a distilled or generated artifact is
  cited to a source or raised as a question; a silent assumption is a defect. The seed's first
  stated principle (ring [0023](../rings/0023-grounded-or-ask-first-principle.md)), the epistemic
  law under the intake family (plan [0004](../plans/active/0004-intake.md)).

More principles are captured as taste gets exercised — from Gardener grilling (SEED.md §5),
postmortems, and repeated review feedback. Taste is captured once, then enforced mechanically
forever (LAW-9).
