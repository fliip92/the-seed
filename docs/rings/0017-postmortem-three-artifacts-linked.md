# Ring 0017 — postmortem is a numbered entry that must link all three artifacts, enforced structurally

- Date: 2026-07-05
- Stage: 2 — Growth
- Raised-by: seed
- Question: Building [plan 0003](../plans/active/0003-growth.md) scope item 3 (postmortem) — a
  failure must yield three artifacts, never one: the fix, the invariant that prevents
  recurrence, and the ring recording the decision trail (SEED.md §4, Stage 2) — what form does
  a postmortem entry take, where does it live, and how is "links all three" enforced (LAW-6)?
- Decision:
  - **Artifact.** The skill produces one postmortem entry per failure at
    `docs/postmortems/<NNNN>-<slug>.md`. A new organ, `docs/postmortems/`, holds them; its
    [README](../postmortems/README.md) defines the format. Format: a `# Postmortem NNNN —
    <title>` title and the fields `- Date:`, `- Stage:`, `- Failure:`, `- Fix:`,
    `- Invariant:`, `- Ring:`.
  - **Numbered, like a ring — not slugged like an architecture doc.** A postmortem is a dated
    incident in a sequential record (you read the set as "what has failed here, in order"),
    the rings/plans family — so `NNNN-slug.md` with the ring-numbering discipline (four digits,
    no gaps or duplicates, matching title number). Architecture docs are per-target *standing*
    statements revised in place, hence slugged (ring [0015](0015-grill-the-gardener-architecture-doc.md));
    a postmortem records a fixed past event, hence numbered.
  - **The enforced core: three artifacts, each LINKED** —
    [`.seed/checks/validate-postmortems.ts`](../../.seed/checks/validate-postmortems.ts),
    registered in `run-all.ts`, binds every entry. `Fix` must carry ≥1 local markdown link
    (the changed artifact, or the plan/ring that carried it); `Invariant` must name an
    enforcement mechanism in an `Enforcement:` clause (the `lint | structural test | CI gate |
    doc-only` vocabulary, scoped exactly as `validate-rings.ts` / `validate-architecture.ts`)
    **and** carry ≥1 local link to the enforcing artifact; `Ring` must link an **existing**
    `docs/rings/NNNN-slug.md`. Plus the format hygiene shared with rings (filename, sequence,
    title, all six fields, a real `Date`). The Invariant-names-a-mechanism rule is the sharp
    LAW-2 point: an "invariant" that is only prose ("we will be careful") is the "try harder"
    non-fix the discipline exists to reject.
  - **Local links, not external URLs.** All three artifacts are local markdown links, so a
    postmortem's three products live in the graph the map walks (LAW-4) and validate-map's
    dead-link gate keeps them *live*, not merely present. A GitHub commit URL is invisible to
    the link parser; link the plan/ring that carried the fix, or the changed file, instead.
  - **Vacuous while empty; no fabricated first incident.** The check is vacuous while
    `docs/postmortems/` holds only its README and binds the moment an entry lands — the
    `docs/principles/` / `docs/architecture/` pattern (format defined, enforced-when-present).
    No postmortem is authored now: manufacturing a fake failure would be a false record. The
    first is written when a real failure occurs — the grill-the-gardener precedent (ring 0015)
    of shipping the enforced capability without fabricating its first artifact.
  - **Not append-only-gated; its links held live by the map's dead-link gate.** Unlike a ring,
    a postmortem is a living record — it is *not* added to the ring-append-only gate, so when a
    linked enforcer is later refactored the postmortem can be repointed. And it must be: the
    three artifacts are markdown links, so `validate-map`'s dead-link gate (the same one that
    keeps them live, above) hard-fails `npm run check` until the link resolves again — the
    record cannot silently freeze a stale pointer. It is also *not* excluded from
    `doc-drift.ts`'s current-state scan, so any backtick path-claims in its prose are checked
    advisory like any doc (LAW-8); but the load-bearing artifact *links* are the dead-link
    gate's concern, not the drift scan's — the scan reads inline code spans, not link targets.
  - **This extends the anatomy without amending the genome.** `docs/postmortems/README.md`
    joins `validate-anatomy`'s `REQUIRED_FILES` the same way `docs/architecture/README.md` did
    (ring 0015): the organ is genome-anticipated (SEED.md §4 Stage 2 names postmortem), editing
    `REQUIRED_FILES` is not a SEED.md edit (LAW-1 reserves that gate for the genome), and the
    whole decision is Gardener-visible under approved plan 0003 and reversible.
- Alternatives considered:
  - *Slug postmortems like architecture docs* — rejected: a postmortem is a dated, sequential
    incident (chronology is part of the reading), not a per-target statement revised in place;
    numbering fits, and it reuses the ring sequence machinery (`findSequenceIssues`).
  - *Require the Fix to be a commit SHA* — rejected: it would make the structural check
    git-aware (it is a pure file check, like validate-rings), and a SHA is illegible next to a
    linked plan/ring. Linking the carrying plan/ring gives the same trace, in the map's graph.
  - *Accept a prose Invariant without a named mechanism* — rejected outright: that is precisely
    the "try harder" non-fix (LAW-2). If no mechanical enforcement is warranted yet, the entry
    says `doc-only` (justified) and prices the residual into the ledger — an unenforced rule is
    itself entropy.
  - *Make postmortems append-only-gated like rings* — rejected: their value is that the linked
    invariant is *still live*, so they must be updatable when machinery is refactored; the
    drift scan + the gardening pass keep them honest instead of freezing them.
  - *Author a first postmortem now from a past incident (e.g. E-011)* — deferred: no past
    failure has all three artifacts cleanly assembled, and fabricating one is a false record.
    The capability ships; the first real entry follows a real failure (the ring 0015 precedent).
- Enforcement: structural test — [`.seed/checks/validate-postmortems.ts`](../../.seed/checks/validate-postmortems.ts)
  in `run-all.ts` (`npm run check`), with its firing on each completion condition — bad
  filename, invalid title, title/number mismatch, missing field, unlinked fix, invariant with
  no mechanism, invariant with no link, non-ring `Ring` link, duplicate number, numbering gap,
  and the valid-linked-entry-passes path — pinned by temp-copy cases in
  [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts) (`npm test`).
- Revisit-when: a real postmortem shows the six-field format too thin or too heavy for a
  genuine incident; or postmortems prove to warrant an append-only gate (their volume or
  tamper-risk grows); or a foreign host needs a postmortem home other than `docs/postmortems/`.
