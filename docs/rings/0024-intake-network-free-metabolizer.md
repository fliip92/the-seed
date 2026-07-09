# Ring 0024 — intake metabolizes a repo-saved corpus network-free; pin-not-mirror provenance and a closed outcome vocabulary

- Date: 2026-07-08
- Stage: 2 — Growth
- Raised-by: seed
- Question: [Plan 0004](../plans/active/0004-intake.md) scope item 2 builds the **intake**
  skill and left three build-time questions to settle when it was built (the plan-0003 rhythm):
  (a) the skill's name (`intake` was the working name); (b) where a corpus intake reads lives
  in the repository — a staging area versus alongside the reference — which decides how far
  quote-match can bind in v0; and (c) the closed vocabulary an entry's outcome is classified
  into.
- Decision:
  - **Name — `intake`.** It names one organ of the metabolism (SEED.md §3), not the whole of
    it: the act of taking field-food in. `metabolize` is the entire loop, `distill` is the
    output verb (a reference is *distilled*), `digest` overloads "digest or delete" (SEED.md
    §0), and `ingest` adds nothing — `intake` is precise and already the name the plan and
    [grounded-or-ask](../principles/grounded-or-ask.md) use for the family.
  - **Provenance — pin, don't mirror.** intake v0 is network-free and **does not copy raw
    corpora into the repository**. A distillation cites each source by link, retrieval date,
    and — where GitHub can pin it — a commit; the raw text is not mirrored. Two forces make this
    the honest v0 rule: the references organ is *distilled, not mirrored* (LAW-7,
    [docs/references/README.md](../references/README.md)), and a committed dump would inflate
    `map_reachability`'s denominator (SEED.md §6) and demand anatomy READMEs for raw text.
    **Consequence for quote-match:** a quoted span is machine-verifiable against its source in
    exactly one v0 case — when the cited source is itself an already-committed in-repo file (the
    self-hosting case). For an externally-pinned source the controls are provenance (date +
    commit) + completeness + Gardener ratification; verbatim quote-checking arrives with
    fetching, in phase 2 (a saved fetch *is* a mirror — network and saved-corpus are one
    deferred capability, not two). This is why `validate-references` (scope item 3) passes on
    the all-external-pin [harness-engineering.md](../references/harness-engineering.md).
  - **Outcome vocabulary — five, closed, no silent drop.** Every parsed entry resolves to
    exactly one of: `reference` (distilled into `docs/references/<subject>.md` — the primary v0
    output), `ledger` (a priced [entropy-ledger](../plans/entropy-ledger.md) entry for a
    capability gap the source reveals about the seed), `ring` (a decision to record),
    `skill-seed` (a named seed for a future plan), or `discard` (**with a stated reason** —
    never silent). A closed set lets a checker prove completeness; the stated-reason rule on
    `discard` is the anti-drop guard ([feedback](../../skills/feedback/SKILL.md),
    [parallel-worktrees](../../skills/parallel-worktrees/SKILL.md) precedent). The set is a
    sibling of SEED.md §0's four products of *entropy* (`ledger`→priced debt, `ring`→a ring,
    `skill-seed`→a future invariant, `discard`→a deletion), with `reference` the metabolized
    structure itself.
- Alternatives considered:
  - **Stage the raw corpus alongside the reference** (a `docs/references/<subject>.sources/`
    sibling) so quote-match binds fully in v0 — rejected: it contradicts the references organ's
    *distill-don't-mirror* rule (LAW-7), bloats `map_reachability`, and would force the
    already-landed harness-engineering.md (external pins only) to retroactively commit its
    corpus for a check scope item 3 says must simply *pass* on it. Pin-not-mirror keeps v0
    honest and defers the mirror to the phase that fetches it.
  - **Save the corpus in v0 but gitignore it** — rejected: an uncommitted corpus cannot be
    quote-matched in CI (no network, no scratch there), so it buys teeth that do not fire where
    they must. The corpus either lands committed (a mirror, deferred) or is pinned (v0).
  - **An open / free-text outcome label** — rejected: completeness ("no entry silently
    dropped") is only checkable against a *closed* set; an open label reintroduces the
    silent-drop the guard exists to forbid (LAW-2).
  - **Collapse `skill-seed` and `ring` into one "proposal" outcome** — rejected: they land in
    different organs and carry different weight (a ring retires a question now; a skill-seed
    schedules future work). v0 need emit neither, but the vocabulary distinguishes them so a run
    that does is unambiguous.
- Enforcement: structural test — the skill's *output* (a `docs/references/*.md` distillation) is
  bound by `validate-references`, the `run-all` check built in
  [plan 0004](../plans/active/0004-intake.md) scope item 3 (named here as pending — the ring
  [0023](0023-grounded-or-ask-first-principle.md) forward-reference discipline, where a
  not-yet-built enforcer is named honestly and linked when it lands): provenance, per-claim
  citation, the grounded/inference split, and — where the corpus is saved in-repo —
  completeness and quote-match. The *faithfulness* residual the machinery cannot yet judge
  ([E-013](../plans/entropy-ledger.md)) is doc-only:
  [grounded-or-ask](../principles/grounded-or-ask.md)'s compose-not-commit + Gardener
  ratification (SEED.md §5), the judge deferred to scope item 4. The committed scout
  [harness-engineering.md](../references/harness-engineering.md) is the standing evidence the
  loop produces a faithful artifact.
- Revisit-when: phase 2 lands (fetching + saving a corpus) — then quote-match gains a saved
  corpus to bind against for externally-sourced references, and the pin-not-mirror default is
  revisited for fetched sources; or a sixth entry-outcome recurs in practice (add it to the
  closed set, the doc-drift-registry rhythm); or the inferential judge (E-013) is built, giving
  faithfulness a mechanical control.
