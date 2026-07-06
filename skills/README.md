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

The garden grows by stage (SEED.md §4). Still to plant:

- **Stage 2:** parallel-worktrees, onboard-human, feedback.

Every skill ships with its own verification (LAW-6): a skill that cannot prove it worked
is a claim, not a capability.
