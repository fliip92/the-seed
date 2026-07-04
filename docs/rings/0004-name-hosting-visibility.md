# Ring 0004 — Name, hosting, and visibility

- Date: 2026-07-04
- Stage: 0 — Germination
- Raised-by: gardener
- Question: Germination question 1 (SEED.md §9, plan 0001): repository name, org, and
  visibility?
- Decision:
  - Name: **The Seed** (proposed repo slug `the-seed`).
  - Org: none — hosted under the Gardener's personal GitHub account.
  - Visibility: public.
  - Consequence: a public repository gets read by humans before agents, so a minimal
    human-facing [README.md](../../README.md) joins the required anatomy, pointing at the
    genome and the map.
  - [E-004](../plans/entropy-ledger.md) (trademark/naming clearance) stays open: the
    Gardener naming the project settles what it is called, not its legal clearance —
    which still gates pollen distribution at Stage 3.
  - Implementation (creating the remote and pushing) proceeds only on explicit Gardener
    go-ahead, recorded in plan 0001; the first green hosted CI run pays
    [E-002](../plans/entropy-ledger.md).
- Alternatives considered: An org-owned repo — rejected: no org exists; migration later
  is cheap and would reopen this ring. Private until Flowering — rejected by the
  Gardener: public now.
- Enforcement: structural test — `.seed/checks/validate-anatomy.ts` requires README.md.
  Hosting and visibility themselves are doc-only, justified: they live in GitHub settings
  outside the repository; E-002's closure (hosted CI green) is their observable proof.
- Revisit-when: naming is legally cleared or changed (E-004), or an org is created.
