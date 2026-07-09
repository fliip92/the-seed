# skills/ — the skill garden

One directory per skill, following the `SKILL.md` convention (ring
[0001](../docs/rings/0001-founding-defaults.md)): `skills/<skill-name>/SKILL.md` plus any
supporting files. Skills are how capability becomes durable and portable — the subset
that travels ships in [pollen/](../pollen/README.md) at Stage 3.

## Planted skills

- [doc-gardener](doc-gardener/SKILL.md) — detects doc↔code drift and stale content, lands
  the mechanical fixes within the gardening automerge classes, and is the source of the
  `drift_count` fitness metric (Stage 1; plan
  [0002](../docs/plans/completed/0002-rooting.md)).
- [grill-the-gardener](grill-the-gardener/SKILL.md) — architecture elicitation: interview the
  Gardener until the target architecture fits one page, is expressible as lintable rules, and
  has an explicit human/agent ownership split, producing an
  [architecture doc](../docs/architecture/README.md) its verification enforces (Stage 2, plan
  [0003](../docs/plans/active/0003-growth.md) scope item 1; ring
  [0015](../docs/rings/0015-grill-the-gardener-architecture-doc.md)).
- [repo-fitness](repo-fitness/SKILL.md) — read-only fitness assessment of *any* repository:
  the shared SEED.md §6 metric engine pointed at a target repo's root, degrading each metric
  to `null` with a stated reason where the target's anatomy does not define it, proven not to
  mutate the target. The seed's diagnostic instrument for hosts and the load-bearing organ of
  the Stage 2 exit criterion (Stage 2, plan
  [0003](../docs/plans/active/0003-growth.md) scope item 2; ring
  [0016](../docs/rings/0016-repo-fitness-generalizes-the-metric-engine.md)).
- [postmortem](postmortem/SKILL.md) — a failure yields three artifacts, never one: the fix,
  the invariant that prevents recurrence (made enforceable, LAW-2), and the ring recording the
  decision trail. Produces a numbered [postmortem entry](../docs/postmortems/README.md) its
  verification binds to link all three (Stage 2, plan
  [0003](../docs/plans/active/0003-growth.md) scope item 3; ring
  [0017](../docs/rings/0017-postmortem-three-artifacts-linked.md)).
- [parallel-worktrees](parallel-worktrees/SKILL.md) — decompose a large task across isolated git
  worktrees, one booted instance per worktree, torn down at task end. The genome ships the
  host-agnostic worktree lifecycle plus a host-adapter boot contract; host-specific boot
  mechanics live in adapters, not the genome (SEED.md §4). Verified by a hermetic dry-run that
  creates, isolates, boots, and tears down N worktrees and asserts isolation plus cleanup (Stage
  2, plan [0003](../docs/plans/active/0003-growth.md) scope item 4; ring
  [0019](../docs/rings/0019-parallel-worktrees-host-agnostic-lifecycle.md)).
- [onboard-human](onboard-human/SKILL.md) — brief a new human, current state → goal, as
  conversation plus a generated artifact. The briefing
  ([docs/generated/onboarding.md](../docs/generated/onboarding.md)) is generated from the map
  and the active plan it links, not hand-written, so it cannot drift from the truth; it lands
  the generation manifest and the regeneration check that convert ledger E-001 (Stage 2, plan
  [0003](../docs/plans/active/0003-growth.md) scope item 5; ring
  [0020](../docs/rings/0020-onboard-human-generated-briefing.md)).
- [feedback](feedback/SKILL.md) — open an issue upstream against the mother seed from any repository
  (LAW-11; SEED.md §7). The genome ships the composer — a well-formed upstream issue (title + a fixed
  Lineage / Kind / What happened / Why this is upstream / Proposed conversion body), addressed to the
  descendant's recorded parent; it never posts, emitting the `gh issue create` command a human runs
  once the Gardener approves. A root seed with no parent is refused (feedback flows upstream).
  Verified by a side-effect-free dry-run that composes well-formed, has teeth, and mutates nothing
  (Stage 2, plan [0003](../docs/plans/active/0003-growth.md) scope item 6; ring
  [0021](../docs/rings/0021-feedback-composes-upstream-issue.md)).
- [intake](intake/SKILL.md) — metabolize external knowledge already saved in-repo (curated link
  lists, papers, write-ups) into the seed's four products, under **grounded-or-ask** (cite or ask,
  never silently assume). Parse a saved corpus → classify every entry into one closed outcome
  (`reference` / `ledger` / `ring` / `skill-seed` / `discard`-with-reason — no silent drop) →
  compose a distillation carrying the grounded/inference split (**Seed reading:**) → the Gardener
  ratifies → land. Network-free in v0 (pins sources by link + date + commit, does not mirror or
  fetch); the [references](../docs/references/README.md) organ is its primary output. Scouted by the
  first external-corpus intake ([harness-engineering.md](../docs/references/harness-engineering.md))
  (Stage 2, plan [0004](../docs/plans/active/0004-intake.md) scope item 2; ring
  [0024](../docs/rings/0024-intake-network-free-metabolizer.md)).

Every Stage 2 skill on the SEED.md §4 menu is planted (grill-the-gardener, repo-fitness, postmortem,
parallel-worktrees, onboard-human, feedback), and the Stage 2 exit criterion is evidenced
([assessment 0001](../docs/assessments/0001-mottainapp.md), ring
[0022](../docs/rings/0022-assessment-organ-exit-criterion.md)). **intake** is one organ more, grown
before Flowering by Gardener election (plan [0004](../docs/plans/active/0004-intake.md)), not a menu
item. The garden grows by stage (SEED.md §4); next is the Stage 2 → 3 transition, queued behind plan
0004.

Every skill ships with its own verification (LAW-6): a skill that cannot prove it worked
is a claim, not a capability.
