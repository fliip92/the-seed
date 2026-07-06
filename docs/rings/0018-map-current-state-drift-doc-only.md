# Ring 0018 — the map's current-state prose drift is handled doc-only until the drift instrument grows the class

- Date: 2026-07-05
- Stage: 2 — Growth
- Raised-by: seed
- Question: The map's ([AGENTS.md](../../AGENTS.md)) "Current state" named an already-landed
  scope item (repo-fitness, scope item 2) as "next work" — hand-authored prose drifting from
  [plan 0003](../plans/active/0003-growth.md)'s actual progress
  ([postmortem 0001](../postmortems/0001-agents-current-state-drift.md)). How is recurrence of
  this class prevented, and why is it not mechanically enforced now?
- Decision:
  - **Doc-only, priced, not fabricated.** There is no cheap mechanical invariant for "the map's
    current-state prose agrees with plan progress." The map's "Current state" is deliberately
    *hand-authored orientation* — a distilled correct-first-action for a fresh agent — not a
    derived artifact that could be regenerated and diffed. The v0 drift instrument
    ([`.seed/checks/doc-drift.ts`](../../.seed/checks/doc-drift.ts)) detects stale *path*
    references, not a stale prose *claim* about which step is next. So prevention is the
    doc-only discipline **update the map's current-state in the same commit that lands a scope
    item**, and the residual is priced — this failure is the first observed recurrence of the
    "broader prose drift" shape already carried by [E-009](../plans/entropy-ledger.md), whose
    stated conversion trigger is *a shape that proves to recur*. This is that trigger firing
    once; a second recurrence converts it to a drift class (the registry exists for exactly
    this, so no rework). Naming doc-only with a priced residual, rather than inventing a
    throwaway lint, is the honest form the postmortem skill prescribes (LAW-2: an unenforced
    rule must not masquerade as enforced).
  - **The mechanizable sibling is tracked separately.** The growth **stage** is also stated in
    two hand-bumped, unchecked places (AGENTS.md prose and `fitness.ts`'s `CURRENT_STAGE`) —
    [E-011](../plans/entropy-ledger.md) — and that one *does* have a cheap structural check (the
    two must name the same stage). E-011 is not this failure (stage ≠ scope-item) and is not
    folded in here; it converts on its own next-touch. Keeping them distinct avoids
    over-claiming that one check prevents the other.
  - **This is the first exercise of the postmortem discipline** (plan 0003 scope item 3, ring
    [0017](0017-postmortem-three-artifacts-linked.md)): a real failure metabolized into the fix,
    the invariant (doc-only + priced), and this ring — proving the organ binds on a genuine
    incident, not only on self-test fixtures.
- Alternatives considered:
  - *Strip the map's current-state narration and defer entirely to the plan's Next actions* —
    rejected: the map's job (LAW-4) is to state the correct first action for a fresh agent in
    three hops; gutting that narration to a bare "see the plan" makes the entry point worse, and
    the duplication it removes is small next to the orientation it costs.
  - *Build a prose-state drift class now* — deferred: it is real work (parsing current-state
    prose and cross-referencing plan ✅ markers is brittle), warranted only once the shape
    recurs a second time — exactly E-009's stated threshold. Building it on the first sighting
    would be speculative machinery (LAW-7: boring compounds; don't build ahead of need).
  - *Convert E-011's stage-agreement check and call it the invariant* — rejected: it would
    prevent a *different* failure (stale stage, not stale scope-item); claiming it prevents this
    recurrence would be dishonest. E-011 stands on its own.
  - *Fabricate a mechanical invariant to avoid a doc-only first postmortem* — rejected outright:
    that is precisely the "try harder"/costume-enforcement anti-pattern the discipline exists to
    reject (LAW-2). An honest doc-only entry with a priced residual is the correct metabolization.
- Enforcement: doc-only — justified: the map's current-state is hand-authored orientation, not a
  derived artifact, and no drift class for prose-state claims exists yet; the residual is priced
  as [E-009](../plans/entropy-ledger.md)'s first recurrence with a concrete conversion path, so
  the rule is legible and its non-enforcement is accounted for rather than hidden (LAW-2). The
  discipline (update the map when a scope item lands) is the interim guard.
- Revisit-when: the "broader prose drift" shape recurs a second time — the E-009 trigger to add
  a prose-state drift class to `doc-drift.ts`'s `DRIFT_CLASSES` registry (with self-tests); or
  the map's current-state becomes a derived/generated artifact that can be diffed mechanically.
