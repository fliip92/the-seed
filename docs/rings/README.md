# docs/rings/ — the decision log

Append-only, numbered record of every decision that retired a question (LAW-10: never ask
twice; SEED.md §2 defines the format). Before asking the Gardener anything, search this
directory — if a ring answers it, asking again is drift in you.

## Rings

- [0001 — Founding defaults](0001-founding-defaults.md)
- [0002 — Germination implementation defaults](0002-germination-implementation-defaults.md)
- [0003 — Ring and ledger field formats refine the genome's sketch](0003-artifact-field-formats.md)
- [0004 — Name, hosting, and visibility](0004-name-hosting-visibility.md)
- [0005 — License: MIT](0005-license-mit.md)
- [0006 — Solo until Flowering](0006-solo-until-flowering.md)
- [0007 — Gardening cadence and automerge policy](0007-gardening-cadence-automerge.md)
- [0008 — Ring 0001 confirmed: germination question 5 closed](0008-ring-0001-confirmed.md)

## Format (enforced by `.seed/checks/validate-rings.ts`)

- Filename: `NNNN-slug.md` — four digits, sequential, no gaps, lowercase-kebab slug.
- Title line: `# Ring NNNN — <title>` (number must match the filename).
- Required bullets, each starting a line: `- Date:` (YYYY-MM-DD), `- Stage:`,
  `- Raised-by:` (`gardener` or `seed`), `- Question:`, `- Decision:`,
  `- Alternatives considered:`, `- Enforcement:` (must name a mechanism: lint |
  structural test | CI gate | doc-only with justification — enforced), `- Revisit-when:`.
- Multi-part answers go in indented sub-bullets under the relevant key.
- This explicit-key format is canonical and refines the shorthand sketch in SEED.md §2
  (ring [0003](0003-artifact-field-formats.md)).

## Procedure

1. Take the next free number (check the list above — and add your ring to it).
2. Write the ring using the format. State the enforcement mechanically wherever possible;
   `doc-only` must justify why not mechanical (LAW-2).
3. Run `npm run check` — the ring validator must pass.
4. Rings are append-only: never edit a ring's Decision after merge. If a decision changes,
   cut a new ring that supersedes it and note the supersession in both.
