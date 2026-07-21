# Ring 0044 — dither's two stale spike refs gardened; the first refactor that adds no instrument

- Date: 2026-07-20
- Stage: 4 — Pollination
- Raised-by: seed (the E-006 pre-flight on dither, [plan 0009](../plans/active/0009-dither-metabolize.md)
  refactor track — the fourth and lowest-interest structural ledger entry)
- Question: dither's `drift_count` fitness scan (the seed's [doc-drift.ts](../../.seed/checks/doc-drift.ts),
  run Seed-side and read-only) reported exactly two stale path references, both in frozen feasibility
  spikes — an ExecuTorch spec file written in bare backticks as if local
  (`docs/source/ptd-file-format.md`, which is in fact the *label* of a valid markdown link to upstream
  pytorch/executorch) and an illustrative phone path for a file never built
  (`apps/phone/src/localbrain/leanPrompt.ts`). Both are technically-flagged-but-benign: one a
  correctly-linked external reference whose backtick label merely collides with dither's `docs/`
  namespace, the other a design sketch. How should E-006 be paid — and does it warrant editing
  "intentionally-frozen" spikes, or a change to the instrument?
- Decision:
  - **Content-fix on a gardening pass — the conversion path the ledger already sanctioned.** The
    ExecuTorch reference was relabeled to its upstream-qualified path
    `pytorch/executorch/docs/source/ptd-file-format.md` (the link href unchanged), so it reads as
    external and no longer collides with a dither top-level; the never-built illustrative path was
    reduced to the module identifier `leanPrompt`. dither `0f078ef`. The seed's standing `drift_count`
    scan of dither now reports **2 → 0**.
  - **This is the first Metabolize refactor that builds no new instrument.** E-001 / E-002 / E-007 each
    shipped a gate or a self-test as their LAW-6 verification; E-006's verification is the *pre-existing*
    doc-gardener drift scan — the instrument that detected the drift confirms its removal. So E-006 adds
    **no gate, no principle, no product-code change** (`enforcement_ratio` held 7/7). A gardening
    deletion's honest LAW-6 story is the standing advisory instrument, not a manufactured new one.
  - **The pre-flight found no forced fork.** Unlike E-001 (the elicited target itself was drifted from
    the code) and E-007 (the metric was structurally floored), here the instrument is correct and both
    refs are real. The only judgment was *fix the docs or the instrument* — the docs were fixed.
  - **The tokenizer constrained the fix, and the fix was validated against it before landing.**
    `doc-drift`'s `pathClaims` splits a backtick span on whitespace and re-checks each word, so a
    space-separated relabel (`pytorch/executorch: docs/…`) would stay flagged — only a single
    non-colliding token clears it. Both chosen labels were run through the real tokenizer and confirmed
    clean.
- Alternatives considered:
  - **Scope frozen spikes out of the drift surface (Seed-side).** Add `docs/spikes/**` to
    [doc-drift.ts](../../.seed/checks/doc-drift.ts)'s `isScanned` exclusions, treating a feasibility
    spike as a point-in-time record like a completed plan. Rejected: a Seed-wide mechanism change driven
    by one host's two low-interest refs (E-007's rescope was justified by a *structurally broken* metric;
    here the scanner is correct); the existing exclusions are all gate-frozen / append-only surfaces
    (the rings gate, `completed/` never edited, the ledger append-only), whereas a spike is only "we
    don't plan to touch it" — a weaker claim; and excluding spikes would blind the scanner to *future*
    real drift in them.
  - **Teach the scanner to skip a backtick that is a markdown link-label with an `http(s)` href.**
    Rejected: real LAW-7 complexity for a rare case, and a backtick that reads as a local path is
    genuinely misleading to a human regardless of the href — fixing the *doc* (mark it clearly external)
    improves legibility *and* clears the scan, strictly better than teaching the instrument to ignore a
    genuinely-ambiguous pattern.
  - **Graft the drift scan into dither's own CI while here.** Rejected: a separate organ graft, not this
    gardening deletion; the scan is advisory (it never gates) and already runs Seed-side. If guarding
    drift in dither CI is later wanted, price it host-side and decide it on its own (the
    branch-protection residual is carried the same way).
- Enforcement: **doc-only** — and deliberately so: E-006's whole thesis is the first refactor that ships
  no new mechanism. What keeps the decision true is the *pre-existing* **advisory** `drift_count` scan
  ([doc-drift.ts](../../.seed/checks/doc-drift.ts), the advisory/gate split of
  [ring 0011](0011-drift-advisory.md)) — it already measures the outcome (dither reads **0**, was 2) and
  would re-flag any regression on the next gardening pass, so a hard gate is unwarranted for two
  low-interest refs in intentionally-frozen exploratory spikes. No seed instrument was touched. All five
  dither gates + the gates self-test are green on the landing range `c058fbc..0f078ef`;
  `enforcement_ratio` 7/7, `ledger_trend` +5 → +4 (dither's fourth digested debt), `map_reachability`
  48.2% unchanged. Seed-side `npm run check` + `npm test` + `npm run garden` green (no seed code change).
  *(Aside: `doc-drift.ts`'s inline `(E-006: anchors unchecked)` comment refers to the **seed's own**
  E-006, an unrelated same-numbered entry in the seed's ledger — not dither's.)*
- Revisit-when: a stale reference recurs in a frozen spike often enough that per-ref gardening is more
  churn than an exclusion would cost — then reconsider scoping `docs/spikes/**` out of the drift surface
  (the rejected first alternative) as a deliberate, priced change rather than repeated gardening.
