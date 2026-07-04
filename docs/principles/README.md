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

## Principles

None yet. Principles are captured as taste gets exercised — from Gardener grilling
(SEED.md §5), postmortems, and repeated review feedback. Taste is captured once, then
enforced mechanically forever (LAW-9).
