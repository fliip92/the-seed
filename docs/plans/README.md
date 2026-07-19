# docs/plans/ — execution plans and the entropy ledger

Plans are first-class artifacts (LAW-5). Small changes get lightweight ephemeral plans in
the conversation; complex work gets a plan file here, checked in and versioned with the
work it drives.

- [active/](active/README.md) — plans in flight. One file per plan.
- [completed/](completed/README.md) — finished plans, kept forever.
- [entropy-ledger.md](entropy-ledger.md) — known debt: priced, rated, with conversion paths.

## Plan format (enforced by `.seed/checks/validate-plans.ts`)

- Plans live only in `active/` or `completed/`; `docs/plans/` itself holds only this
  README and the ledger (enforced).
- Filename: `NNNN-slug.md` — four digits, sequential across active + completed combined,
  no gaps or duplicates, lowercase-kebab slug.
- Title line: `# Plan NNNN — <title>` (number must match the filename).
- A `- Status:` line near the top, with exactly one of: `active`, `blocked: <on what>`,
  `completed YYYY-MM-DD`. The status must agree with the directory: `completed` status ⟺
  `completed/` directory (enforced).
- Required sections: `## Goal`, `## Progress log` (dated entries
  `- **YYYY-MM-DD** — <what happened>`, at least one, newest last — enforced),
  `## Decision log` (local decisions + pointers to any rings cut), `## Next actions`.
- Optional `## Work units` (ring [0036](../rings/0036-work-unit-format.md)): a plan that will span
  sessions or parallel [worktrees](../../skills/parallel-worktrees/SKILL.md) agents MAY decompose
  into work units — each a `### U<n> — <title>` block carrying `- Status:`
  (`todo | in progress (<owner>) | done | blocked: <on what>`), `- Scope:` (bounded — the
  don't-derail fence), `- Entry-context:` (the exact files/rings/units to read to start **cold**,
  without re-deriving the whole plan), `- Done-when:` (a verifiable acceptance criterion, LAW-6),
  `- Owner:` (`human | agent`, optionally a `· seed/wt-<i>` handle), and an optional `- Depends-on:`
  (unit ids, or `none`). **Validated only when the section is present** (enforced); a small
  single-session plan omits it. Unit ids are unique, not necessarily gapless.
- This explicit-key format is canonical and refines the shorthand sketch in SEED.md §2
  (ring [0003](../rings/0003-artifact-field-formats.md)).

## Procedure

1. Take the next free number across `active/` and `completed/` combined.
2. Write the plan; keep the progress log updated as you work — it is the hand-off to the
   next agent, who may be you with no memory.
3. Attach evidence for anything you claim works (LAW-6): command output, test results,
   links to CI runs.
4. On completion: set Status to `completed YYYY-MM-DD`, `git mv` the file to
   `completed/`, and update any links to it.

**Decomposing for multi-session / parallel work.** When a plan will span sessions or run across
parallel [worktrees](../../skills/parallel-worktrees/SKILL.md), give it a `## Work units` section
(above). Each unit's `Entry-context` is the cold-start payload a fresh agent reads *instead of*
re-deriving the whole plan, and `Depends-on` tells parallel-worktrees which units are independent
enough to each own a worktree. Keep unit `Status` current as you go — the section is the structured
hand-off the prose progress log is not (ring [0036](../rings/0036-work-unit-format.md)).

## Ledger entry format (enforced by `.seed/checks/validate-plans.ts`)

The ledger has exactly two sections, `## Open` and `## Paid` — both required; paid-off
entries move to `## Paid` rather than being deleted, keeping their numbers forever.
Entries use `## E-NNN — <short description>` (three digits, em dash) with bullets
`- First observed:`, `- Where:`, `- Interest rate:` (high | medium | low), `- Price:`,
`- Conversion path:`. Numbers are sequential with no gaps or duplicates across both
sections; no other `##` headings are permitted in the ledger.
