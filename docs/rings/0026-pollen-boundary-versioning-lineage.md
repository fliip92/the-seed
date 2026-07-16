# Ring 0026 — the pollen boundary, two version lines, and the semver/migration model

- Date: 2026-07-15
- Stage: 3 — Flowering
- Raised-by: seed
- Question: The Stage 3 release/upgrade mechanism was designed with the Gardener (2026-07-06) and
  priced as [E-015](../plans/entropy-ledger.md), which named three open forks the build cannot start
  without: (a) the semver/migration trigger — what classifies a release breaking/feature/fix, and
  what "breaking" forces; (b) improvement granularity — is the unit of an adopted improvement a ring,
  a skill, or a whole pollen version; (c) the framework/local ownership boundary — what is sovereign
  to the mother versus graftable-and-adaptable. [Plan 0005](../plans/active/0005-flowering.md) scope
  item 1 defers them here, to the **founding ring** (E-015's conversion path), the first Stage 3 build
  decision. How are they decided?
- Decision: Cut, deciding all three plus the version-line and lineage model that scope item 1 builds:
  - **(c) Ownership — three tiers, and the pollen manifest classifies every top-level repo entry into
    exactly one** (the Gardener's steer — "the laws are sovereign to the mother; everything below is
    graftable-and-adaptable" — adopted and made total):
    - **Sovereign — the frame.** The genome, `SEED.md`. Carried into every descendant; amended only
      the mother's way (a law needs a Gardener-approved PR + ring, SEED.md §1; a founding default
      amends via a local ring, §8). Its §1 laws are the invariants that make a repo a seed at all.
    - **Portable — the method.** The machinery (`.seed/`) and the skill garden (`skills/`), plus the
      scaffolding templates + protocols the installer emits (those land with scope item 3). Grafted
      into descendants and locally adaptable; divergence is a legitimate lineage (LAW-11), surfaced by
      the descendant's own fitness, never forced.
    - **Local — the history.** Everything a seed writes about *itself*: its map (`AGENTS.md`), its
      `docs/` (rings, plans, ledger, principles, fitness, assessments, postmortems, references,
      generated), its `pollen/` distribution + lineage, and repo plumbing. Never in pollen; each seed
      grows its own. Pollen ships *templates* for these, not the mother's instances.
  - **Two version lines, never conflated.** The **genome version** (the constitution's line,
    authoritative in `SEED.md`'s header, shape `X.Y`) and the **pollen version** (the portable
    distribution's line, semver `X.Y.Z`). They move independently: the genome evolves slowly under
    Gardener gate, pollen as the method grows. The manifest ([`.seed/lib/pollen.ts`](../../.seed/lib/pollen.ts))
    declares both; its genome copy is cross-checked against `SEED.md` so it cannot silently drift (the
    [E-011](../plans/entropy-ledger.md) shape). Pollen sits at `0.0.0` until the release tool cuts the
    first release (scope item 2).
  - **(a) Semver/migration — pollen is semver; the trigger is a DECLARED, checked impact class, not
    parsed from commit keywords** (conventional-commits is rejected: the seed's commit grammar is
    plan/ring references, E-015):
    - **major = breaking** — a descendant that already grafted an earlier pollen cannot adopt this as
      a pure additive merge; a **migration is required**, and a breaking release is invalid without
      one.
    - **minor = feature** — a new portable artifact (skill / template / protocol) or a
      backward-compatible capability; no migration.
    - **patch = fix** — a correction within an existing portable artifact; no interface change.
    - The next version is a **pure function of the max declared impact** across a release's committed
      intents (the ring-0020 determinism split: pure, in-`run-all`, byte-exact-gated), and the impact
      class is anchored to what changed in the *portable* subtree, not free taste. This ring fixes the
      model; the bump computation and the migration-required tooth land with the release tool (scope
      item 2).
  - **(b) Granularity — the fork dissolves into three orthogonal axes, each governing its own
    operation** (no single "ring vs skill vs pollen-version" choice):
    - The **pollen version** is the unit of a **release** — what a descendant grafts ("adopt v0.3").
    - The **ring / plan-item** is the unit of a **learning** — a release's notes enumerate the rings
      that composed it; the decision log *is* the changelog source (the changesets/git-cliff idea,
      stolen not imported, E-015).
    - The **skill / template / protocol** is the unit of a **portable artifact** — what the manifest
      enumerates and the installer grafts.
    - So `sense` reports "releases since your baseline, and the rings each composed," and a descendant
      re-metabolizes at whatever grain fits — adopt a whole release, or cherry-pick the ring behind one
      skill's improvement into *its own* ring (propagation is re-metabolization: the change becomes the
      descendant's ring, its `plan-traceability` gate already refusing ringless change, so "propose,
      never force" falls out for free).
  - **Lineage.** Every seed records the SEED.md §7 triple in [`pollen/lineage.json`](../../pollen/lineage.json):
    `seedVersion` (= the pollen version it carries — a descendant is planted *from* a release, so the
    "seed version" is the pollen line), `parent` (the mother's `owner/repo`; null at the root), and
    `planted`. One schema ([`.seed/lib/lineage.ts`](../../.seed/lib/lineage.ts)), read by both the
    pollen check and the [feedback](../../skills/feedback/SKILL.md) composer.
- Alternatives considered:
  - **Parse impact from commit messages (conventional-commits).** Rejected — the seed's commit grammar
    is `Plan NNNN` / `ring NNNN`, not `feat:`/`fix:` (E-015); a declared, checked impact class anchored
    to the portable subtree fits the existing grammar and stays deterministic.
  - **Pick one granularity (ring, or skill, or pollen-version).** Rejected — they are not competitors;
    each names a different thing (a learning, an artifact, a release). Forcing one horn would lose the
    others; naming all three by operation is what lets `sense` be legible and re-metabolization work.
  - **Make the whole genome (all of `SEED.md`) sovereign-and-immutable, or make everything portable.**
    Rejected — §8 founding defaults explicitly amend via a local ring, and LAW-11 makes divergence a
    legitimate lineage; the boundary is the *laws* as the sovereign frame, with the method portable and
    the history local. Three tiers, not two.
  - **Enumerate portable *files* exhaustively.** Rejected — the boundary belongs at the top-level
    altitude (LAW-3: invariants centrally, autonomy within); whole-subtree tiers plus a completeness
    check that forces a decision on any new top-level entry keeps it total without micromanaging.
- Enforcement: structural test — [validate-pollen](../../.seed/checks/validate-pollen.ts) (in
  `npm run check`, LAW-6) checks the manifest is **complete** (every top-level entry classified —
  ownership boundary (c)), the two version lines are well-formed and the genome copy tracks `SEED.md`,
  and `pollen/lineage.json` is present and well-formed; pinned by the machinery self-tests. The
  semver/migration model (a) and the ring-enumerated release notes (b) are decided here and enforced
  when their machinery lands (scope item 2): the version-bump-from-committed-intent as a byte-exact
  `run-all` computation, and the migration-required-for-major as a structural tooth (the
  [ring 0020](0020-onboard-human-generated-briefing.md) determinism split) — until then those two are
  recorded-decision, doc-only, justified because their subject (a release tool) does not exist yet.
- Revisit-when: The impact classes prove too coarse or too fine in practice (a change that is neither
  cleanly breaking/feature/fix), a portable artifact needs promotion out of a whole-subtree tier (a
  single skill turning mother-only, or a local doc worth shipping as a template — a per-artifact
  exclusion the manifest would then grow), or the genome/pollen version lines need a defined coupling
  (a genome amendment that forces a pollen major); each is a new ring that supersedes the relevant part.
