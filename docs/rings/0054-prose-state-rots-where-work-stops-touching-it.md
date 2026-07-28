# Ring 0054 — fifth entropy-sensing pass, turned on the mother: prose state rots exactly where the work stopped touching it; the stage gate learns its third place (E-025 paid), the front door's other claims and the map's bulk are priced (E-026, E-027)

- Date: 2026-07-27
- Stage: 4 — Pollination
- Raised-by: gardener (*"sense new entropy"*, with the structural queue drained, dither unchanged since
  `b8d3823`, and [E-024](../plans/entropy-ledger.md) paid one unit earlier)
- Question: the four previous sensing passes ([0045](0045-dither-sensing-pass-theme-layout.md),
  [0046](0046-dither-map-completeness-gate.md), [0047](0047-dither-third-sensing-pass-stack-drift.md),
  [0048](0048-dither-fourth-sensing-pass-seed-dither-md-r3f.md)) swept the **host**, and the host has not
  changed in six days — its last commit is the seed's own `b8d3823` (2026-07-21). So this pass swept the
  **mother**. What entropy has the seed accumulated in its own tree, and does any of it recur as a class
  the ledger already predicted?
- Decision:
  - **The finding is one shape, in three artifacts: hand-maintained prose state rots exactly where the
    work stopped touching it.** The docs every unit edits — [.seed/README.md](../../.seed/README.md)
    (14 check rows for 14 checks), [pollen/README.md](../../pollen/README.md),
    [FITNESS.md](../fitness/FITNESS.md), the organ indices — are all current. The docs *outside* the
    blast radius of recent work are stale in proportion to how long they have been outside it:
    [README.md](../../README.md), last touched 2026-07-15, and
    [plan 0006](../plans/active/0006-pollination.md)'s `Next actions`, last touched 2026-07-19. Nothing
    reads either: `validate-map` checks links, `doc-drift` checks backticked *paths*, and plan bodies are
    excluded from the drift surface by design. `drift_count 0` was honest and blind.
  - **[E-025](../plans/entropy-ledger.md) — the stage's third place — paid in this pass.** README.md said
    *"currently at **Stage 2 — Growth**, entered 2026-07-05"* while the repo has been at Stage 4 since
    2026-07-17: **ten days wrong, on the public front door**. This is [E-011](../plans/entropy-ledger.md)
    recurring — the same defect [ring 0035](0035-stage-agreement-invariant.md) closed for two places,
    reappearing in a third the gate was never told about.
    [validate-stage](../../.seed/checks/validate-stage.ts) now takes its sources from a **declared list**
    (the map is the reference; `fitness.ts`'s `CURRENT_STAGE` and README's *"currently at **Stage N**"*
    sentence are compared to it), and it caught the live defect on its first run.
  - **The source list is explicit, and that is a deliberate limit, not an oversight.** A prose scan for
    `Stage N` would be worse than no check: this pass counted ~19 *correct* provenance mentions across
    `skills/` and the organ READMEs (*"the Stage 2 exit criterion"*, *"the Stage 1 organ"*) that no regex
    separates from a current-state claim. Each source therefore declares one canonical form, and the
    completeness of the list is the residual — the [E-024](../plans/entropy-ledger.md) shape, answered
    the same way: an explicit list, named in the failure message so adding a place is the obvious move.
  - **Per-source silence is kept** (ring 0035's contract, now applied per source): a declared source that
    states no stage is skipped, so a descendant carrying the check but not the mother's README prose is
    not bound by her lifecycle. Pinned by a self-test that rewords the sentence out of canonical form and
    requires all checks green.
  - **The front door's other false claims are fixed by hand in this pass; the enforcement is priced as
    [E-026](../plans/entropy-ledger.md).** README.md claimed *21 rings* (53), *seven planted skills* (9,
    with `intake` and `judge` missing from the list entirely), *two completed plans plus one active*
    (7 + 2), *principles — none stated yet* (grounded-or-ask, stated at ring
    [0023](0023-grounded-or-ask-first-principle.md)), *a solo experiment* (ring
    [0032](0032-stage-4-transition-first-host-dither.md) retired that), and *pollen … does not exist
    until Stage 3 … deliberately empty* (v0.1.0 was cut 2026-07-16). For a document whose own pitch is
    *"don't take it on faith — clone it and watch it verify itself"*, the numbers a visitor checks first
    were the ones nothing checked. The content is now true; the **debt is the enforcement**, exactly as
    E-024 was scoped one unit ago.
  - **The map's bulk is priced, not touched: [E-027](../plans/entropy-ledger.md), and it is the
    Gardener's fork.** [AGENTS.md](../../AGENTS.md) § Current state is **198 of 279 lines — 71% of the
    map** — and it has grown 9 → 198 lines in 23 days while every other section stayed flat (Start here
    10, Territory 19, Protocols 36, Laws 6). It restates what plan 0009's progress log, the ledger's Paid
    notes and the rings already record, every session pays to read it, and the human briefing is
    *generated from it*. The decision it needs — what belongs in the map versus behind a link — is a
    taste call about the seed's own entry point, so it is priced Open with its forks stated rather than
    converted unilaterally (the [E-012](../plans/entropy-ledger.md) precedent).
  - **[E-009](../plans/entropy-ledger.md)'s trigger has fired.** Its conversion path pre-registered *"a
    second recurrence of this prose-state shape is the trigger to build the class"*, the first being
    [postmortem 0001](../postmortems/0001-agents-current-state-drift.md) (the map's Current state naming
    an already-landed scope item as next work, held doc-only by ring
    [0018](0018-map-current-state-drift-doc-only.md)). This pass found **two** more: plan 0006's step 5
    named E-002/E-007/E-006 as *"Next"* — all landed 2026-07-20 — and called a pushed commit *"local,
    push Gardener-gated"*, and it is the section the map routes a fresh agent to (*"the governing plan is
    plan 0006 — continue from its `Next actions`"*). The content is fixed (that step is now a pointer to
    plan 0009, which cannot rot into instructions), the trigger trip is recorded on E-009, and building
    the class is the Gardener's next call — its false-positive surface is the same ~19 provenance
    mentions measured above, which is precisely why it was deferred in the first place.
  - **No dither mutation, and none was warranted.** The host is byte-identical to `b8d3823`, with no
    owner commit since 2026-07-21. Four passes have now found it clean; a fifth would find the same. The
    exit criterion's missing half is a *feature*, not a finding.
- Alternatives considered:
  - **Price the README staleness and fix nothing** (pure sensing). Rejected — the false claims are facts,
    not taste, and LAW-8 pays entropy continuously; leaving a public document knowingly wrong for the
    duration of a Gardener round-trip buys nothing. What *was* held back is the part that needs taste:
    E-027's fork, and E-009's class.
  - **Fix only the stage line** (the one the new gate forces). Rejected — it would have left the README
    internally contradictory: "Stage 4" one paragraph above "pollen is deliberately empty until Stage 3".
    A half-corrected front door reads worse than an evenly stale one.
  - **Rewrite the README's voice and pitch while in there.** Rejected — out of scope for a sensing pass.
    Only false statements of fact were changed; every claim that was true stayed exactly as written.
  - **Teach `validate-stage` to scan all prose for `Stage N`.** Rejected on measured evidence: ~19 correct
    provenance mentions would fire. A gate with a 19-to-1 false-positive ratio trains agents to ignore it,
    which is worse than the gap it closes.
  - **Make the stage single-sourced** (generate every statement from `CURRENT_STAGE`). Rejected for now,
    recorded as the Revisit: it is the right end state, it is the same *generate-don't-detect* move E-026
    proposes for the counts, and doing it in a sensing pass would drag `docs/generated/` into the public
    README with no ring behind the shape.
  - **Open a postmortem for the README** (the ring-0017 organ). Rejected — no failure was *experienced*;
    a sensing pass found stale prose before anyone acted on it. Postmortems metabolize incidents, and
    inflating one here would cheapen the organ.
- Enforcement: **structural test + a `run-all` check, plus content fixes whose verification is the
  standing scan.** [validate-stage](../../.seed/checks/validate-stage.ts) now compares a declared source
  set and is green at *"AGENTS.md, .seed/checks/fitness.ts, README.md all state stage 4"* — it was **red
  on the real repository** before the README was corrected, which is the fire this ring is built on. Two
  new self-tests (**261** total, was 259): a README stating a different stage than the map **fails**
  (derive-from-current mutation, so it stays a genuine disagreement as the stage advances), and a source
  stating **no** stage keeps everything green (the per-source degrade path). **Test-of-the-test:**
  reverting the source list to the two hardcoded places turns exactly the README case **red** — nothing
  fires, so the case that proves the third place is checked fails — and leaves the other 260 green. The
  content fixes (README's six false claims, plan 0006's stale step 5)
  are verified by `npm run garden` (`drift_count` 0) and by the numbers being re-derived from the tree in
  this pass, not by memory. `npm run check` (14) + `npm test` (261) + `npm run garden` green. Declared a
  `minor` [pollen intent](../../pollen/pending.md): a descendant gains a stage gate that is a set rather
  than a pair.
- Revisit-when: the stage is single-sourced (generated from one constant), which retires the whole
  agreement gate and is the honest end state — the trigger is a **fourth** place wanting to state it; or
  [E-026](../plans/entropy-ledger.md) converts and the README's counts become generated, at which point
  the stage line should join them; or [E-009](../plans/entropy-ledger.md)'s prose-state drift class is
  built, which would subsume the *"stale instructions in a plan's Next actions"* half of this pass; or a
  **sixth** sensing pass finds the mother stale again in a doc no unit has touched, which would mean
  hand-maintained state needs a cadence (a gardening sweep of untouched docs) rather than another gate.
