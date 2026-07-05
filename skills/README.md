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

The garden grows by stage (SEED.md §4). Still to plant:

- **Stage 2:** grill-the-gardener, repo-fitness, postmortem, parallel-worktrees,
  onboard-human, feedback.

Every skill ships with its own verification (LAW-6): a skill that cannot prove it worked
is a claim, not a capability.
