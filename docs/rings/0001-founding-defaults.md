# Ring 0001 — Founding defaults

- Date: 2026-07-04
- Stage: 0 — Germination
- Raised-by: gardener
- Question: Which foundational defaults govern the Seed before any other decision exists —
  harness, languages, first host, and name?
- Decision: The defaults planted in SEED.md §8 are adopted as-is:
  - Harness: Claude Code. Skills follow the `SKILL.md` directory convention. Protocols
    stay harness-portable — the genome outlives any given harness.
  - Machinery language: TypeScript/Node for lints, structural tests, and fitness scripts.
    Markdown for all knowledge artifacts.
  - Knowledge base language: English.
  - First host: this repository (self). First external host: TBD by the Gardener.
  - Name: "Seed" is a working codename. Trademark/naming must be cleared before any
    external use (priced as [E-004 in the entropy ledger](../plans/entropy-ledger.md)).
- Alternatives considered: None at planting — these are the Gardener's seeded intent.
  Section 8 explicitly allows amendment via ring at any time.
- Enforcement: Partially structural — `.seed/checks/validate-anatomy.ts` enforces the
  anatomy that embodies these defaults (Markdown knowledge base, TypeScript machinery in
  `.seed/`, `skills/` directory). Harness choice and naming are doc-only: they are
  meta-level choices with no in-repo artifact to lint yet; the ledger prices the naming
  debt.
- Revisit-when: The Gardener answers the germination questions (SEED.md §9) differently
  than these defaults imply, or any default measurably blocks work.
