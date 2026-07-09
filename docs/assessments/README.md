# docs/assessments/ — foreign-repo assessments, judgeable on evidence

One file per assessment: `docs/assessments/NNNN-slug.md`. An assessment is the artifact the
**Stage 2 exit criterion** produces (SEED.md §4): *assess a foreign repository without
modifying it and produce a proposal its owners could judge on evidence.* It is the two
load-bearing organs exercised end-to-end — the read-only [repo-fitness](../../skills/repo-fitness/SKILL.md)
Scout (SEED.md §4, Stage 4 step 1) that measures, and the
[grill-the-gardener](../../skills/grill-the-gardener/SKILL.md) elicitation (step 2) that says
what to measure *against* — converted into a proposal (step 3) the target's owners review.

The report is **evidence, not a grade** (LAW-9): every finding is a unit of the host's sensed
entropy converted into exactly one of SEED.md §0's four products — an invariant the host could
adopt, a ring, a priced debt, or a deletion. What the read-only Scout could *not* settle —
the target's intended architecture — is never guessed (SEED.md §5): it is named as a **grill
agenda** of questions the owner answers. The proposal is a starting point for the owner, not a
verdict on them.

Assessments are a dated, sequential record of scouts the seed has produced — so, like the
[rings](../rings/README.md) and [postmortems](../postmortems/README.md), they are numbered
`NNNN-slug.md`. Like a postmortem they are not append-only frozen: when a linked artifact is
refactored the assessment is repointed, held live by the [map](../../AGENTS.md)'s dead-link
gate.

## Format (enforced by [`.seed/checks/validate-assessments.ts`](../../.seed/checks/validate-assessments.ts))

```markdown
# Assessment NNNN — <target name>

- Date: YYYY-MM-DD
- Target: <the assessed repository, its lineage/foreignness, read-only attestation>

## Scout

<the read-only SEED.md §6 baseline — all six metrics, each named by its key — computed, or
null-with-reason. The null is a finding, not an omission.>

## Findings

- <sensed entropy> — Product: <invariant | ring | priced debt | deletion> — <the conversion step>
- <sensed entropy> — Product: <product> — <the conversion step>

## Grill agenda

- <an architecture question only the owner can answer>?

## Ownership

- Owner (human): <what the target's humans decide — intent, priorities, taste, gate approvals>
- Seed (agent): <what the agent does — everything else>
```

The check binds every entry here (its README aside):

- **Sequential filename + title.** `NNNN-slug.md`, four digits with no gaps or duplicates, a
  lowercase-kebab slug, and a `# Assessment NNNN — <target>` title whose number matches the
  filename — the ring/postmortem numbering discipline.
- **Both fields present**, `Date` a real `YYYY-MM-DD`.
- **The four sections present**: `## Scout`, `## Findings`, `## Grill agenda`, `## Ownership`.
- **Whole-baseline evidence.** `## Scout` names **all six** §6 metrics by key
  (`map_reachability`, `enforcement_ratio`, `drift_count`, `plan_traceability`,
  `escalation_rate`, `ledger_trend`) — a proposal judged *on evidence* carries the full
  read-only baseline, never a cherry-picked subset. A `null` metric stays in: the null and its
  reason are the finding (repo-fitness's contract).
- **Findings convert to the four products.** `## Findings` states at least one finding, and
  every finding names one of SEED.md §0's four products in its `Product:` clause. A finding
  that names none is entropy sensed but not metabolized (SEED.md §0) — the closed-vocabulary
  discipline the [feedback](../../skills/feedback/SKILL.md) composer applies to a conversion.
- **A grill agenda that asks.** `## Grill agenda` states at least one question. A target's
  architecture is elicited, never guessed (SEED.md §5); the agenda is the Scout naming what it
  could not settle read-only.
- **Explicit ownership.** `## Ownership` names the human/owner side and the agent/Seed side on
  separate bullets — the grill-the-gardener exit condition (SEED.md §4c).

Like [docs/architecture/](../architecture/README.md) and [docs/postmortems/](../postmortems/README.md),
the format is defined and enforced-when-present: the check is vacuous while this directory
holds only its README, and binds the moment an assessment lands.

## Assessments

- [0001 — mottainapp](0001-mottainapp.md) — the first foreign-repo assessment, evidencing the
  Stage 2 exit criterion (plan [0003](../plans/active/0003-growth.md), ring
  [0022](../rings/0022-assessment-organ-exit-criterion.md)): a read-only Scout of a real
  691-file / 792-commit product, its findings converted to the four products, its architecture
  left to a grill agenda rather than guessed.
