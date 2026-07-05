# docs/architecture/ — elicited target architectures

One file per target: `docs/architecture/<slug>.md`. An architecture doc is the artifact the
[grill-the-gardener](../../skills/grill-the-gardener/SKILL.md) skill produces — the target
architecture of a repository, distilled from interviewing its Gardener until it (a) fits on
one page, (b) is expressible as lintable rules, and (c) has an explicit human/agent ownership
split (SEED.md §4, Stage 2; §5, the grilling protocol).

Architecture docs are per-target statements, not the sequential decision log the
[rings](../rings/README.md) are — so they are named by slug, not numbered. A decision made
*during* elicitation (an ambiguity the interview could only end by resolving) is still cut as
a ring (LAW-10); the architecture doc is the standing picture, the ring is the retired
question.

## Format (enforced by [`.seed/checks/validate-architecture.ts`](../../.seed/checks/validate-architecture.ts))

```markdown
# Architecture — <target name>

- One-liner: <the entire architecture in one sentence>   (recommended opener; not enforced)

## Shape

<the one-page picture of the target architecture — prose and/or a diagram: the layers,
the boundaries, the dependency direction, what is allowed to know about what>

## Rules

- <architectural rule> — Enforcement: <lint | structural test | CI gate | doc-only (justify why not mechanical)>
- <architectural rule> — Enforcement: <mechanism>

## Ownership

- Human (Gardener): <what humans own — intent, priorities, taste, gate approvals>
- Agent (Seed): <what the agent owns — everything else>
```

The check binds every doc here (its README aside):

- **One page.** The whole doc must fit the one-page budget the check enforces — a word cap
  and a line cap, whose exact numbers live in
  [`validate-architecture.ts`](../../.seed/checks/validate-architecture.ts) so they stay a
  single source of truth (SEED.md §4a). The constraint is the value: an architecture that will
  not distill is one the interview has not finished. Keep any Shape diagram small — it counts
  toward the budget.
- **Required sections.** `## Shape`, `## Rules`, `## Ownership` must all be present.
- **Lintable rules.** `## Rules` states at least one rule, and every rule names an
  enforcement mechanism in its `Enforcement:` clause (`lint | structural test | CI gate |
  doc-only`) — the principle-format discipline (SEED.md §2) applied to a whole-architecture
  statement. A rule CI cannot verify is not enforceable, so it does not exist (LAW-2).
- **Explicit ownership.** `## Ownership` names the human/Gardener side and the agent/Seed
  side on separate bullets. An unsplit architecture leaves the handoff ambiguous (SEED.md §4c).
- The `- One-liner:` opener is a recommended summary, not one of the enforced constraints.

Like [docs/principles/](../principles/README.md), the format is defined and
enforced-when-present: the check is vacuous while this directory holds only its README, and
binds the moment `grill-the-gardener` lands a doc.

## Architecture docs

None yet. The first is produced when the Gardener is grilled — for this repository, the
seed's own target architecture is already recorded across [SEED.md](../../SEED.md) and the
rings, so its distillation is a follow-on run of the skill rather than a fresh interview
(SEED.md §0: the seed applies its method to itself first).
