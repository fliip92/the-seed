# grill-the-gardener

Architecture elicitation. When a repository's target architecture is undefined — or defined
only in someone's head — you do not guess it, you **interview the Gardener** until it can be
written down and enforced. The interview ends only when the architecture (a) fits on one
page, (b) is expressible as lintable rules, and (c) has an explicit human/agent ownership
split (SEED.md §4, Stage 2; §5, the grilling protocol). It is the first move of pollination
(SEED.md §4, Stage 4 step 2) and the load-bearing precondition for
[repo-fitness](../README.md): a fitness verdict is only meaningful against a stated target.

The output is one artifact: an **architecture doc** at
[`docs/architecture/<slug>.md`](../../docs/architecture/README.md), whose format the skill's
verification enforces.

## When to run

- Entering any repository whose architecture is not already stated as one page of lintable
  rules — the Grill step of pollination (SEED.md §4, Stage 4), after the read-only scout.
- When a task surfaces an architectural ambiguity that no ring answers (LAW-10): dependency
  direction, where a boundary sits, what is allowed to know about what. The interview is how
  that ambiguity becomes structure instead of a silent assumption baked into code (SEED.md §5).
- Against **this** repository: the seed's own target architecture is already recorded across
  [SEED.md](../../SEED.md) and the [rings](../../docs/rings/README.md), so its architecture
  doc is a *distillation* of what the genome already decided, not a fresh interview — the
  self-hosting case (SEED.md §0).

## The interview

The goal is not to collect opinions; it is to drive one page of enforceable rules and a clean
ownership line. Work the loop until all three exit conditions hold at once.

1. **Shape.** Ask for the picture: the layers, the boundaries, the dependency direction, what
   is allowed to depend on what. Push until it fits on one page — if it will not distill, the
   architecture is not understood yet, and that is the finding.
2. **Rules.** For each claim in the shape, ask the question that makes it lintable: *"How
   would CI catch a violation of this?"* A rule that cannot answer is either not a rule (drop
   it) or a missing capability (name the enforcement you would build). Every surviving rule
   names its enforcement — `lint | structural test | CI gate | doc-only (justify why not
   mechanical)` — the principle-format discipline (SEED.md §2).
3. **Ownership.** Ask what the humans decide and what the agent decides. Make the split
   explicit: intent, priorities, taste, and gate approvals are the Gardener's (LAW-1);
   everything else is the agent's. An architecture with no stated owner for a decision has an
   ambiguous handoff.

**Ambiguity ends the interview only by becoming a ring.** When a question is genuinely the
Gardener's judgment (which of two designs? where does this boundary belong?), escalate it
once, record the answer as a [ring](../../docs/rings/README.md), and never ask it again
(LAW-10, SEED.md §5). Nothing ambiguous is left as prose to be re-litigated: it is a rule, a
ring, or dropped. Learn the culture too, not just the code — naming, PR etiquette, tone —
and record recurring taste as [principles](../../docs/principles/README.md) so it is
enforced like everything else (SEED.md §5).

## The artifact

Write the result to `docs/architecture/<slug>.md` in the format that
[docs/architecture/README.md](../../docs/architecture/README.md) defines and
[`.seed/checks/validate-architecture.ts`](../../.seed/checks/validate-architecture.ts)
enforces: a title, an optional one-line summary, `## Shape` (the one page), `## Rules` (each
naming an enforcement), and `## Ownership` (the human and agent sides on separate bullets),
the whole doc within the one-page budget.

The candidate lint rules the interview surfaces are the seed of the host's own machinery: each
rule that named a `lint` / `structural test` / `CI gate` enforcement is a check waiting to be
built (the Graft step of pollination, SEED.md §4). Rules that could only name `doc-only` are
the debt to price into the [entropy ledger](../../docs/plans/entropy-ledger.md) — a stated
rule with no mechanical enforcement is itself entropy (LAW-2).

## Verification (LAW-6)

A skill that cannot prove it worked is a claim, not a capability. The elicitation's output is
verified structurally by
[`.seed/checks/validate-architecture.ts`](../../.seed/checks/validate-architecture.ts)
(part of `npm run check`), which binds every architecture doc: it exists with a valid title,
carries the three required sections, fits the one-page budget, states at least one rule, and
**each rule names an enforcement mechanism** — the exact three exit conditions the interview
must satisfy. The check's own firing is pinned by
[`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts) (`npm test`) following the
machinery's temp-copy methodology: a valid fixture doc passes; a missing ownership side, a
rule with no enforcement, an empty rules section, an over-budget doc, and a missing section
are each seeded and proven to fire with a law-naming message. Any change that stops the check
enforcing a completion condition fails CI. Ring
[0015](../../docs/rings/0015-grill-the-gardener-architecture-doc.md) records the build
decision.
