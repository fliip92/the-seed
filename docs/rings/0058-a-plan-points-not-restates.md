# Ring 0058 — a plan points at another plan, it does not restate it: prevention over detection (E-009's prose-state class)

- Date: 2026-07-29
- Stage: 4 — Pollination
- Raised-by: gardener — ruling on the fork ring
  [0054](0054-prose-state-rots-where-work-stops-touching-it.md) reserved to them and ring
  [0057](0057-the-dead-link-gate-learns-anchors.md) reframed — presented as *detection vs prevention* on
  the corrected evidence, answered **prevention: build the structural invariant**
- Question: [E-009](../plans/entropy-ledger.md)'s prose-state class has a fired trigger and a
  **falsified** detector. Ring 0057 showed the priced shape (*"a plan's `Next actions` naming work its
  own progress log records as done"*) cannot be built as written: the two halves were never in one file,
  and the corrected text still names all four tokens, so only prose grammar separates the bug from the
  fix. What, if anything, is mechanically enforceable here?
- Decision:
  - **Prevention, not detection — the class converts to a structural invariant that never reads prose
    grammar.** *A plan that delegates live work to another plan points at it and does not restate its
    state.* Restating is then not "discouraged" but out of budget. This is the third time the shape has
    been paid this way and the first time it has been paid *before* the rot recurred:
    [E-026](../plans/entropy-ledger.md) generated the front door's counts, [E-027](../plans/entropy-ledger.md)
    capped the map's state block, and ring 0054 fixed this very entry by hand.
  - **The unit is the BLOCK, not the section — measurement rejected the section.** The first design
    capped any section linking another active plan. Reading the whole corpus killed it: most plan→plan
    links live in `## Progress log` (96, 448 and 184 non-blank lines in the three plans that have them).
    A progress log is dated history; its size is its job, and a dated line cannot rot into an
    instruction. The cap applies to the individual block — a top-level list item, or a paragraph — that
    carries the delegating link.
  - **Only `## Next actions`, because that is the section read as instructions.** AGENTS.md § Start here
    point 2 routes every returning agent to *"the active plan(s) … and continue from the latest `Next
    actions`"*. That is where a stale restatement becomes an instruction to do already-finished work,
    which is exactly what happened. Every other section is unbound.
  - **Both halves must be live.** A **completed** plan is not bound — its `Next actions` records what was
    next when it closed, it carries `- Status: completed YYYY-MM-DD`, and no agent continues from it —
    and a link **to** a completed plan is not a delegation, because frozen state cannot go stale.
    Binding either would demand editing closed plans to no reader's benefit.
  - **The budget is calibrated on the corpus, not on taste.** In plan 0006 — the one plan that delegates
    — the six blocks describing its own six steps run 3–10 non-blank lines and 42–98 words, while the
    delegating block was 11 lines / 137 words: **the largest block in the section**. A pointer bigger
    than everything it sits among is not a pointer, it is a second copy. So a delegating block may be as
    large as the largest block about the plan's own work, and no larger: **10 non-blank lines / 100
    words**, the two-proxy shape of rings [0015](0015-grill-the-gardener-architecture-doc.md) and
    [0055](0055-the-map-states-state-not-history.md) (a line cap alone waves through long wrapped lines;
    a word cap alone waves through a tall list).
  - **It went red on the real repository before the fix**, on both proxies at once, at exactly the block
    the corpus measurement predicted — plan 0006's step 5, the same entry ring 0054 had already fixed by
    hand once. That is the argument for the cap rather than a second by-hand fix: the hand-fix did not
    hold, and it was still carrying plan 0009's drained-queue and half-met-exit-criterion state.
  - **The link resolver's active/⇄completed flex is honored, so the gate cannot be dodged by writing
    the other path.** Resolution goes through [`resolveLinkTarget`](../../.seed/lib/repo.ts) (ring
    [0013](0013-plan-links-resolve-across-active-completed.md)); plan 0007 links plan 0009 as
    `../completed/0009-…`, which
    resolves to the active plan.
  - **A separate check, not a clause inside validate-plans.** Ring 0055's reasoning transfers exactly:
    same law, different question — folding it in would hide the delegation numbers behind
    *"9 plan(s), 27 ledger entries valid"*. It prints its measured maxima on every green run.
- Alternatives considered:
  - **Build the detector E-009 priced.** Rejected — ring 0057 falsified it on the artifacts: plan 0006's
    progress log never mentioned the work its `Next actions` misnamed (plan 0009's did), so there was no
    in-file contradiction to compute, and the corrected text still names all four tokens because naming
    landed work as history is correct. The discriminator would have been prose grammar, which is the
    ~19-false-positive trap ring 0054 measured and rejected for the stage scan.
  - **Cap the whole section that delegates.** Rejected on the corpus measurement above — it binds
    progress logs, which are supposed to be long.
  - **Do nothing; record that prevention already paid the shape three times.** Rejected because the one
    delegating block in the repository had *already decayed again* after ring 0054's by-hand fix. That
    is the ring [0018](0018-map-current-state-drift-doc-only.md) doc-only bet, which has now lost on this
    exact shape twice.
  - **Bind completed plans too, for uniformity.** Rejected: it is archaeology. A closed plan's `Next
    actions` is evidence of what was next then, and no reader is misled by it.
  - **Put the block splitter in `.seed/lib/repo.ts`.** Rejected for now — `topLevelBullets` answers a
    different question (it reads only `- ` bullets and drops leading prose, and leading prose is exactly
    where plan 0006's other delegation lives), and there is one asker. It moves when a second appears,
    the way [`resolveLinkTarget`](../../.seed/lib/repo.ts) did in ring
    [0053](0053-numbered-organs-index-every-entry.md).
- Enforcement: **a new `run-all` check + structural tests.**
  [validate-plan-delegation](../../.seed/checks/validate-plan-delegation.ts) (check 16) caps every block
  in an active plan's `## Next actions` that links another active plan at 10 non-blank lines / 100 words,
  failing LAW-5 and naming the file, the line, and the plan delegated to. Silent when a plan carries no
  such section and when nothing delegates, so a descendant whose plans never point at each other is
  unbound. Five new self-tests (**278** total, was 273): three fire — the line proxy, the word proxy
  isolated from it, and a delegation written through the `../completed/` path that resolves to an active
  plan — and two hold, which is the half the firing cases cannot state: the three exemptions together (a
  huge `## Progress log` delegation, a completed plan's oversized delegation, and an oversized block
  pointing at a completed plan) all stay green, and a delegating block exactly *at* both budgets passes,
  pinning the boundary as inclusive. **Test-of-the-test, both directions — and the second one measured
  something the design argument above had only asserted:** removing the budget comparison turns exactly
  the three firing cases red and nothing else; widening the scope from `## Next actions` to every section
  turns **35 tests red including the pristine copy**, because the real repository then carries five
  violations across *both* active plans — plan 0009's progress log alone contributing a 40-line block.
  That is the section-scoped design failing on the live corpus rather than on reasoning about it. `npm run
  check` (16) + `npm test` (278) + `npm run garden` (`drift_count` 0) green. Declared a `minor`
  [pollen intent](../../pollen/pending.md).
- Revisit-when: a second plan starts delegating and the budget proves miscalibrated against a real
  pointer that legitimately needs more room — the number is a ring, not an edit; or a delegating link
  appears in `## Scope` or a work unit and the section list needs widening (the corpus has none today);
  or the block splitter gains a second asker and moves to `lib/repo.ts`; or the remaining, unenforced
  half of [E-009](../plans/entropy-ledger.md) — inventory drift and the fenced-block blind spots of
  [doc-drift](../../.seed/checks/doc-drift.ts) — proves it needs its own instrument.
