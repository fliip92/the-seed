# Ring 0015 — grill-the-gardener produces a one-page architecture doc, enforced structurally

- Date: 2026-07-05
- Stage: 2 — Growth
- Raised-by: seed
- Question: Building [plan 0003](../plans/active/0003-growth.md) scope item 1
  (grill-the-gardener), what form does the elicitation's output take, where does it live, and
  how are the three interview exit conditions — fits one page, expressible as lintable rules,
  explicit human/agent ownership split (SEED.md §4, §5) — enforced (LAW-6)?
- Decision:
  - **Artifact.** The skill produces one architecture doc per target at
    `docs/architecture/<slug>.md`. A new organ, `docs/architecture/`, holds them; its
    [README](../architecture/README.md) defines the format. Docs are named by slug, not
    numbered: they are per-target standing statements, unlike the sequential decision log the
    rings are. Format: a `# Architecture — <name>` title, `## Shape` (the one page), `## Rules`
    (each `- <rule> — Enforcement: <mechanism>`), and `## Ownership` (the explicit human/agent
    split).
  - **Enforcement.** [`.seed/checks/validate-architecture.ts`](../../.seed/checks/validate-architecture.ts),
    registered in `run-all.ts`, binds every doc in `docs/architecture/` (its README aside) to
    all three exit conditions: the one-page budget (≤ 500 words and ≤ 80 non-blank lines), the
    required sections, at least one rule with every rule naming an enforcement mechanism in its
    `Enforcement:` clause (the principle-format discipline, SEED.md §2, scoped and vocabularied
    exactly as `validate-rings.ts` does), and the human and agent sides named on separate
    ownership bullets. The check is **vacuous while the directory holds only its README** and
    binds the moment a doc lands — the `docs/principles/` pattern (format defined,
    enforced-when-present).
  - **One page ≈ 500 words or 80 non-blank lines.** Two mechanical proxies because "fits on
    one page" is the skill's own success criterion (SEED.md §4a): the word cap forces prose
    distillation, and the line cap stops a tall Shape diagram (few "words", many lines) from
    slipping a multi-page doc through. Both force the distillation the interview exists to reach.
  - **No seed self-architecture doc is authored now.** The seed's own target architecture is
    already recorded across SEED.md and the rings; hand-restating it as prose would create a
    second source of truth that drifts from the genome (the E-009 class of divergence the seed
    exists to prevent). It is produced as a follow-on distillation when warranted, at which
    point the check binds it.
  - **This extends the anatomy without amending the genome.** SEED.md §2 sketches the organs
    and the checks refine that sketch (ring [0003](0003-artifact-field-formats.md)), but the
    load-bearing precedent is that `validate-anatomy`'s required set has always been a superset
    of §2's tree: rings [0004](0004-name-hosting-visibility.md) and
    [0005](0005-license-mit.md) added README.md and LICENSE to it, and germination added
    package.json, .gitignore, and .github/ — none in §2's tree, none an amendment.
    `docs/architecture/README.md` joins that set the same way, making the new organ
    first-class. Editing REQUIRED_FILES is not a SEED.md edit, so no Gardener genome-gate is
    tripped (LAW-1 reserves that gate for the genome itself); the organ is genome-anticipated —
    SEED.md §4 Stage 2 names grill-the-gardener's one-page architecture output — and the whole
    decision is Gardener-visible under approved [plan 0003](../plans/active/0003-growth.md) and
    reversible.
- Alternatives considered:
  - *Number architecture docs like rings* — rejected: an architecture is a per-target standing
    picture that is revised in place, not an append-only sequential decision; slugs fit,
    numbering does not.
  - *Author the seed's architecture doc now by distilling SEED.md* — rejected: it duplicates
    the genome into a drift-prone second source (E-009), and a full self-grilling is a distinct
    follow-on, not a precondition for shipping the capability.
  - *Line count instead of word count for "one page"* — considered; word count is the
    conventional page proxy and robust to markdown wrapping and bullet nesting.
  - *Fold the format into `docs/principles/`* — rejected: a principle is one rule; an
    architecture is the whole-system statement those rules serve. Distinct artifacts.
- Enforcement: structural test — [`.seed/checks/validate-architecture.ts`](../../.seed/checks/validate-architecture.ts)
  in `run-all.ts` (`npm run check`), with its firing on each completion condition pinned by
  temp-copy cases in [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts) (`npm test`).
- Revisit-when: the 500-word one-page cap proves too tight or too loose in real grilling use;
  or a foreign host needs an architecture-doc home other than `docs/architecture/` (pollination
  writes into the host's own tree).
