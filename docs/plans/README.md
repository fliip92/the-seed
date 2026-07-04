# docs/plans/ — execution plans and the entropy ledger

Plans are first-class artifacts (LAW-5). Small changes get lightweight ephemeral plans in
the conversation; complex work gets a plan file here, checked in and versioned with the
work it drives.

- [active/](active/README.md) — plans in flight. One file per plan.
- [completed/](completed/README.md) — finished plans, kept forever.
- [entropy-ledger.md](entropy-ledger.md) — known debt: priced, rated, with conversion paths.

## Plan format (enforced by `.seed/checks/validate-plans.ts`)

- Filename: `NNNN-slug.md` — four digits, sequential across active + completed combined,
  no gaps, lowercase-kebab slug.
- Title line: `# Plan NNNN — <title>` (number must match the filename).
- A `- Status:` line near the top (e.g. `active`, `blocked: <on what>`, `completed YYYY-MM-DD`).
- Required sections: `## Goal`, `## Progress log` (dated entries, newest last),
  `## Decision log` (local decisions + pointers to any rings cut), `## Next actions`.

## Procedure

1. Take the next free number across `active/` and `completed/` combined.
2. Write the plan; keep the progress log updated as you work — it is the hand-off to the
   next agent, who may be you with no memory.
3. Attach evidence for anything you claim works (LAW-6): command output, test results,
   links to CI runs.
4. On completion: set Status to `completed YYYY-MM-DD`, `git mv` the file to
   `completed/`, and update any links to it.

## Ledger entry format (enforced by `.seed/checks/validate-plans.ts`)

Entries in [entropy-ledger.md](entropy-ledger.md) use `## E-NNN — <short description>`
with bullets `- First observed:`, `- Where:`, `- Interest rate:` (high | medium | low),
`- Price:`, `- Conversion path:`. Numbers are sequential; paid-off entries move to the
ledger's "Paid" section rather than being deleted.
