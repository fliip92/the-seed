# Ring 0005 — License: MIT

- Date: 2026-07-04
- Stage: 0 — Germination
- Raised-by: gardener
- Question: Germination question 2 (SEED.md §9, plan 0001): which license? The Gardener
  asked the seed for a recommendation, leaning MIT.
- Decision: **MIT**, `Copyright (c) 2026 Felipe Loyola` — recommended by the seed and
  adopted. Rationale: it is the boring choice (LAW-7) — one short file, universally
  understood, zero notice burden beyond retention — and pollination (SEED.md §4 Stage 4)
  means installing pollen into other people's repositories, where a maximally permissive
  license removes every legal adoption question before it is asked.
- Alternatives considered: Apache-2.0 — adds an explicit patent grant and NOTICE
  mechanics; rejected for now as heavier than a protocol-and-scripts repository needs,
  with no patentable surface in sight. Re-evaluate at pollen v1 packaging. No license /
  source-available — rejected: a public repository without a license blocks all legal
  reuse, contradicting propagation (SEED.md §7).
- Enforcement: structural test — `.seed/checks/validate-anatomy.ts` requires
  [LICENSE](../../LICENSE); `package.json` declares `"license": "MIT"`.
- Revisit-when: pollen v1 packaging (re-evaluate the patent question), or external
  contributions raise CLA/DCO questions.
