# docs/postmortems/ — failures, fully metabolized

One file per failure: `docs/postmortems/NNNN-slug.md`. A postmortem is the artifact the
[postmortem](../../skills/postmortem/SKILL.md) skill produces when something breaks — and the
discipline it enforces is that **a failure yields three artifacts, never one** (SEED.md §4,
Stage 2): the **fix** that resolved it, the **invariant** that prevents its recurrence, and
the **ring** that records the decision trail. "When something fails, the fix is never 'try
harder' — it is always a missing capability, made legible and made enforceable" (LAW-2).

Postmortems are a dated, sequential record of incidents — so, like the
[rings](../rings/README.md), they are numbered `NNNN-slug.md`, not slugged like the per-target
[architecture docs](../architecture/README.md). Unlike a ring they are not append-only frozen:
when a linked artifact is later refactored, the postmortem is repointed — and must be, since
its three links are held live by the [map](../../AGENTS.md)'s dead-link gate, which fails the
check until the reference resolves again.

## Format (enforced by [`.seed/checks/validate-postmortems.ts`](../../.seed/checks/validate-postmortems.ts))

```markdown
# Postmortem NNNN — <title>

- Date: YYYY-MM-DD
- Stage: <stage number — name>
- Failure: <what went wrong — the symptom, the trigger, how it surfaced>
- Fix: <what change resolved the immediate failure> — [the fix](relative/path)
- Invariant: <the rule that now prevents recurrence> — Enforcement: <lint | structural test | CI gate | doc-only (justify why not mechanical)> — [the enforcing artifact](relative/path)
- Ring: <one line> — [ring NNNN](../rings/NNNN-slug.md)
```

The check binds every entry here (its README aside):

- **Sequential filename + title.** `NNNN-slug.md`, four digits with no gaps or duplicates, a
  lowercase-kebab slug, and a `# Postmortem NNNN — <title>` title whose number matches the
  filename — the ring-numbering discipline.
- **All six fields present**, `Date` a real `YYYY-MM-DD`.
- **Three artifacts, each linked.** `Fix` links the change (the artifact, or the plan/ring that
  carried it); `Invariant` names an enforcement mechanism in an `Enforcement:` clause **and**
  links the artifact that enforces it; `Ring` links an **existing** `docs/rings/NNNN-slug.md`.
  Links are local markdown links — the graph the [map](../../AGENTS.md) walks, not external
  URLs. An invariant that is only prose ("we will be more careful") names no mechanism and
  fails: that is the "try harder" non-fix (LAW-2) the discipline exists to reject.

Like [docs/architecture/](../architecture/README.md), the format is defined and
enforced-when-present: the check is vacuous while this directory holds only its README, and
binds the moment `postmortem` lands an entry.

## Postmortems

None yet. The first is written when a real failure occurs — the fix, the invariant, and the
ring, linked together (SEED.md §3: *when you struggle, that is data* — feed it back).
