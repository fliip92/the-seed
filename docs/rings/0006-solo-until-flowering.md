# Ring 0006 — Solo until Flowering

- Date: 2026-07-04
- Stage: 0 — Germination
- Raised-by: gardener
- Question: Germination question 3 (SEED.md §9, plan 0001): first external host
  candidate — or does the seed grow solo until Flowering?
- Decision: Solo. No external host until the Stage 3 (Flowering) exit criterion is met —
  pollen installs cleanly into a sacrificial test repo with a measured before/after
  fitness delta. The first real external host is selected by the Gardener at Stage 4
  entry. This refines ring [0001](0001-founding-defaults.md)'s "First external host: TBD
  by the Gardener".
- Alternatives considered: Taking an external host during Growth (Stage 2) — rejected:
  pollinating before the pollen exists front-loads risk onto someone else's repository,
  and the genome orders pollination after flowering anyway (SEED.md §4).
- Enforcement: doc-only — justified: a roadmap constraint with no repository artifact to
  lint; stage gates (Gardener-approved transition plans) enforce the ordering
  procedurally.
- Revisit-when: Stage 3 exit criterion met, or the Gardener designates a host earlier.
