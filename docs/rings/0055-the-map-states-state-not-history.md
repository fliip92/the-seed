# Ring 0055 — the map states state, not history: § Current state is rewritten to state + pointers and capped by a budget (E-027 paid, the Gardener's fork A+B)

- Date: 2026-07-27
- Stage: 4 — Pollination
- Raised-by: gardener (*"fix E-027"* — the ruling the entry's conversion path waited on)
- Question: [E-027](../plans/entropy-ledger.md) measured [AGENTS.md](../../AGENTS.md) § Current state
  at **214 non-blank lines of the file's 298** (72%), grown 9 → 214 in 23 days while Start here (8),
  Territory (17), Protocols (34) and Laws (5) stayed flat. It was priced Open with four forks stated
  and **not converted unilaterally** — what belongs in the seed's own entry point is taste, the
  [E-012](../plans/entropy-ledger.md) precedent. The Gardener's ruling was *"fix E-027"* on **fork
  A + B**: the map states *state*, and a budget keeps it that way. What shape is "state", and what
  makes the cap real rather than a wish?
- Decision:
  - **The section states four things and links out for everything else.** Stage (with the completed
    stages' plans, one line); the correct first action for a fresh agent, naming the live plan; where
    the host stands and what the exit criterion needs next; and what is owed, pointing at the ledger
    and at [.seed/README.md](../../.seed/README.md) for the machinery. It opens by **stating its own
    rule** — *this section states state, not history; append to the plan, the ledger, or a ring* —
    because the next agent reading it is the one about to append. **33 non-blank lines / 332 words,
    from 214 / 2352**: an 85% cut of the lines and 86% of the words, and the section is now smaller
    than § Protocols instead of 3.5× the whole rest of the map.
  - **The cap is a `run-all` check, not a convention:
    [validate-map-budget](../../.seed/checks/validate-map-budget.ts)** — 60 non-blank lines and 650
    words over `## Current state`, the two-proxy shape
    [validate-architecture](../../.seed/checks/validate-architecture.ts) uses for the one-page rule
    (ring [0015](0015-grill-the-gardener-architecture-doc.md)), because a line cap alone misses a few
    very long wrapped paragraphs and a word cap alone misses a tall bulleted list. It was **red on
    the real repository before the rewrite** (214/60, 2352/650) and reads `33/60 lines, 332/650
    words` after — the budget prints on every run, so the trend is visible before it is a violation.
  - **The budget is calibrated to the rest of the map, and the headroom is deliberate.** Start here +
    Territory + Protocols + Laws are 64 non-blank lines / 667 words and have not moved in 23 days;
    the state statement may be as large as the navigation that carries it, and no larger. 33 → 60
    leaves roughly a dozen appended lines before the gate asks where they belong — enough that a
    stage transition or a second host is writable, not enough for another progress log. Raising the
    budget is a ring, and the violation message says so.
  - **The failure message teaches the move, not the trim.** It names the three places the narrative
    is *already* recorded and tells the agent to leave state + pointer, because the wrong fix ("cut
    adjectives until it passes") is the one a bare size gate invites.
  - **What made the deletion safe was [E-024](../plans/entropy-ledger.md), one unit earlier.** Ring
    [0053](0053-numbered-organs-index-every-entry.md) made every numbered organ's README list every
    entry, so the ~40 rings and plans this section linked directly are still reachable at 2 hops
    through their indices: `map_reachability` is **100% (107/107 docs)** before and after, with the
    same denominator and zero dead links. Without that gate this rewrite would have stranded
    knowledge, and the index would have been trusted to catch it while listing 48 of 51 rings.
  - **One of the entry's three stated costs did not survive contact, and the record is corrected
    here.** E-027 claimed the bloat propagates into the generated human briefing
    ([docs/generated/onboarding.md](../generated/onboarding.md)). It does not: the generator reads
    only the `- **Stage:**` line and the *active-plan links*, then imports each plan's `## Goal` —
    so the briefing regenerates **byte-identical** across this rewrite. The two real costs stand
    (every session reads the section; it is the most drift-prone prose in the repository), and the
    third was pricing by eye — the same over-read that [ring 0052](0052-portable-changes-declare-their-intent.md)
    found under-reading in the other direction.
- Alternatives considered:
  - **Fork C — generate § Current state from the active plan's progress entries.** Rejected by the
    ruling, and the build agrees: it cannot drift, but it also cannot be written well, and the map's
    voice would become a function of the plan's. Kept as the Revisit if the section rots again.
  - **Fork D — leave it, deliberately.** Rejected by the ruling. It was the honest option only while
    the growth was bounded; 9 → 214 in 23 days with no removals is unbounded by construction.
  - **Fork A alone (rewrite, no gate).** Rejected: that is exactly the doc-only bet ring
    [0018](0018-map-current-state-drift-doc-only.md) made when the section was 35 lines, and it lost
    — the section 5.6×'d under it. A fix whose only enforcement is intention is not a fix (LAW-2).
  - **Fold the budget clause into [validate-map](../../.seed/checks/validate-map.ts).** Rejected:
    same law, but a different question. `validate-map` answers *"can everything be reached?"* and
    already reports a metric; mixing in *"is the entry point still readable?"* would give one check
    two summaries and hide the budget number behind the reachability line.
  - **Cap total map size instead of the section.** Rejected — it would price a legitimately growing
    Territory table against a bloating narrative and let the map trade one for the other. The
    defect measured was one section's unbounded growth.
  - **A prose rule with no number** ("keep it short"). Rejected: LAW-2. The whole finding is that
    23 days of well-intentioned agents each appended one reasonable paragraph.
- Enforcement: **structural test — a new `run-all` check plus self-test teeth.**
  [validate-map-budget.ts](../../.seed/checks/validate-map-budget.ts) is check 15 in
  [run-all](../../.seed/checks/run-all.ts); it is **silent** when the map is absent or carries no
  `## Current state` section, so a grafted host is not bound by the mother's shape (the ring
  [0035](0035-stage-agreement-invariant.md) contract; dither's map is a `CLAUDE.md` with no such
  section, and the [graft template](../../.seed/lib/graft.ts) emits a six-line one). Four self-tests
  (**265** total, was 261), each proxy isolated so neither can pass on the other's evidence: 70 short
  appended lines fire the **line** budget at 103/60 while staying under the words (542/650), and five
  very long paragraphs fire the **word** budget at 2132/650 while staying under the lines (38/60).
  Two exit-0 contracts the firing cases cannot state: the same content under a **renamed heading**
  stays green (a host names its own sections and is not bound), and **100 lines appended outside the
  section** stay green — the budget is section-scoped, not a cap on the map, which is also what keeps
  the dozen existing fixtures that append to `AGENTS.md` from depending on its total size.
  **Test-of-the-test:** raising `MAX_LINES`/`MAX_WORDS` past the fixtures turns exactly the two
  firing cases red and leaves the other 263 green. `npm run check` (15) + `npm test` (265) +
  `npm run garden` (`drift_count` 0) green; the generated briefing regenerates byte-identical.
  Declared a `minor` [pollen intent](../../pollen/pending.md): a descendant gains a gate that keeps
  its own entry point an entry point.
- Revisit-when: the section hits the budget and the honest answer is that it is all state — then the
  budget was too tight, and raising it is this ring's successor rather than an edit; or § Current
  state rots *again* despite being small, which would mean fork C (generate it) was right and taste
  loses to drift; or [E-026](../plans/entropy-ledger.md) converts and the counts in the public README
  become generated, at which point the map's state bullets should be examined for the same treatment;
  or a **second host** arrives and "where the host stands" needs a per-host shape, which is the first
  legitimate pressure on the budget.
