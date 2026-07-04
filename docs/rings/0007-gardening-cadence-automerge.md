# Ring 0007 — Gardening cadence and automerge policy

- Date: 2026-07-04
- Stage: 0 — Germination
- Raised-by: gardener
- Question: Germination question 4 (SEED.md §9, plan 0001): how often do background
  cleanup tasks run, and what may automerge? The Gardener asked the seed to recommend.
- Decision: Recommended by the seed and adopted:
  - **Opportunistic, every session:** each working session begins with the metabolism
    (already the map's standing instruction) — sense, price, convert.
  - **Dedicated gardening pass, weekly target:** scan for principle deviations and
    doc↔code drift, update the ledger, land small fixes — each reviewable in under a
    minute (LAW-8).
  - **Automerge classes** (once hosted CI exists; until then the seed commits directly to
    `main` under the same rules): allowed only when ALL hold — checks green; the change
    touches none of SEED.md, existing ring content, or principle statements; and the
    change is mechanical: link/index fixes, format compliance, typo and stale-reference
    cleanup, regeneration of `docs/generated/`, ledger bookkeeping. Everything else
    waits for Gardener review.
  - The cadence is manual until scheduled automation exists — priced as
    [E-008](../plans/entropy-ledger.md).
- Alternatives considered: Daily automated pass — rejected for now: no automation
  infrastructure exists and change volume does not warrant it; revisit with E-008. No
  automerge at all — rejected: LAW-8 explicitly directs small recurring refactors,
  automerged when safe.
- Enforcement: CI gate for the checks-green half once hosted (E-002); the
  touched-paths restriction is doc-only until a path-based gate exists — that gap is
  part of E-008's price.
- Revisit-when: scheduled automation lands (tighten the class rules mechanically), or
  fitness trends (`ledger_trend`, `drift_count`) show the cadence too slow or too noisy.
