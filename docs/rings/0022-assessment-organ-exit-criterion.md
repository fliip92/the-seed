# Ring 0022 — the assessment organ is the Stage 2 exit criterion's artifact: a read-only Scout converted to four-products findings with the un-elicited architecture left to a grill agenda, enforced structurally

- Date: 2026-07-06
- Stage: 2 — Growth
- Raised-by: seed
- Question: [Plan 0003](../plans/active/0003-growth.md)'s Stage 2 exit criterion (SEED.md §4) is
  to *assess a foreign repository without modifying it and produce a proposal its owners could
  judge on evidence.* The two load-bearing organs are planted — [repo-fitness](0016-repo-fitness-generalizes-the-metric-engine.md)
  (the read-only Scout) and [grill-the-gardener](0015-grill-the-gardener-architecture-doc.md)
  (architecture elicitation). Exercising them end-to-end produces an **assessment**: what *is*
  that artifact, where does it live, and what makes "judgeable on evidence" legible and
  enforceable (LAW-2) rather than a claim? How does an assessment carry its evidence so it cannot
  be cherry-picked, and stay honest about the architecture it did *not* get to elicit (SEED.md
  §5)? And is it a per-commit invariant of the seed's own tree — gated like the
  [architecture](0015-grill-the-gardener-architecture-doc.md) and [postmortem](0017-postmortem-three-artifacts-linked.md)
  organs — or a tool that runs against arbitrary targets, like repo-fitness and
  [feedback](0021-feedback-composes-upstream-issue.md)?
- Decision:
  - **The artifact is a numbered assessment in a new [`docs/assessments/`](../assessments/README.md)
    organ, and the organ ships non-empty.** Exercising repo-fitness + grill-the-gardener on a
    foreign repo yields a durable, citable proposal, so it gets an organ mirroring
    `docs/architecture/` and `docs/postmortems/`: one file per assessment, `NNNN-slug.md` (a
    dated Scout is an item in a sequential record, like a ring or a postmortem), indexed by the
    README, format enforced by [`validate-assessments.ts`](../../.seed/checks/validate-assessments.ts).
    Unlike those two organs it is **born with its first true entry**:
    [assessment 0001 — mottainapp](../assessments/0001-mottainapp.md), a read-only Scout of a real
    691-file / 792-commit pnpm/turbo product, lands with it — the exit criterion is *evidenced*,
    not merely enabled. (The ring 0015 "don't hand-author the seed's own architecture doc"
    discipline, in mirror image: there was no real target so the organ shipped empty; here a real
    foreign target existed, so fabricating nothing still yields a first entry.)
  - **"Judgeable on evidence" is made a property, not a claim, by four bindings** the check holds
    over every entry: **(a)** a `## Scout` naming **all six** SEED.md §6 metrics by key — the whole
    read-only baseline, each computed or `null`-with-reason — so the evidence cannot be
    cherry-picked; a `null` stays in because the null *is* the finding (repo-fitness's contract,
    ring 0016). **(b)** `## Findings` where every finding converts to exactly one of SEED.md §0's
    four products in a `Product:` clause — a proposal is metabolized entropy, not free-form advice
    — the closed-vocabulary discipline feedback.ts applies (ring 0021), link-stripped so a product
    word appearing only in a link's text does not satisfy it (the validate-postmortems teeth, ring
    0017). **(c)** a `## Grill agenda` stating at least one question — a target's architecture is
    *elicited, never guessed* (SEED.md §5), so the Scout names what it could not settle read-only
    rather than baking a guess into a recommendation. **(d)** a `## Ownership` split on two separate
    bullets, one human/owner and one agent/Seed — the grill-the-gardener exit condition (SEED.md
    §4c), with the two-distinct-bullets rigor validate-architecture uses, so a single
    both-mentioning bullet is not a split. Miss any one and the proposal is unjudgeable.
  - **It is a per-commit invariant of the seed's own tree — a `run-all` gate + required anatomy —
    unlike repo-fitness and feedback.** The assessment *format* is a property of *this* repo's
    `docs/assessments/`, so the check runs on every commit (registered in
    [`run-all.ts`](../../.seed/checks/run-all.ts); the README a required-anatomy path in
    [`validate-anatomy.ts`](../../.seed/checks/validate-anatomy.ts)). This is the opposite of the
    ring 0016/0021 placement: repo-fitness and feedback run against *arbitrary* targets and so
    cannot be per-commit invariants, but an assessment is the seed's *own* produced artifact — the
    record it authored — so it is gated like the decisions and postmortems it resembles. The check
    is written **enforced-when-present** (vacuous while the directory holds only its README) even
    though the organ ships non-empty, so a future all-repointed/all-removed state does not turn it
    red — the docs/architecture and docs/postmortems pattern.
  - **The shared section/bullet parsers move to [`lib/repo.ts`](../../.seed/lib/repo.ts) (LAW-3).**
    validate-assessments and validate-architecture both parse `## Section` bodies and top-level
    `- ` bullets; the two helpers (`sectionBody`, `topLevelBullets`) that lived inside
    validate-architecture move to the shared library with one definition each, imported by both.
    What "a section body" and "a top-level bullet" mean now has a single implementation — the same
    consolidation ring 0016 did for the metric engine, taken the moment a second caller appeared
    rather than left to drift into two copies.
  - **Not append-only frozen — held live by the dead-link gate.** Like a postmortem (ring 0017) an
    assessment links live artifacts (the repo-fitness skill, the ledger, the checks) and is
    *repointed* when they refactor, not frozen like a ring; the map's dead-link gate
    ([`validate-map`](../../.seed/checks/validate-map.ts)) keeps every link honest.
  - **The first exercise dogfed an instrument self-observation (SEED.md §3), priced not papered
    over.** Scouting mottainapp surfaced that repo-fitness walks the *on-disk working tree*
    (`listRepoFiles`), not `git ls-files`, so untracked build output and stray worktree snapshots
    inflate `map_reachability`'s denominator and `drift_count`. It changed **no verdict** in
    assessment 0001 (each reading was robust against the tracked-only recount), so it is not a
    blocker — but it would mislead on a target with a real map buried under untracked output, so it
    is priced as [E-012](../plans/entropy-ledger.md) rather than silently tolerated. The exit
    criterion's first real use sensing entropy about the seed itself is the metabolism working as
    designed.
- Alternatives considered:
  - *A free-form assessment report, not a bound format* — rejected: "judgeable on evidence" would
    be a claim, not a property (LAW-2). A stranger judging the proposal needs the whole §6 baseline
    (not a flattering subset), every finding tied to a concrete conversion, and the un-elicited
    architecture surfaced as open questions — exactly the four bindings. Free-form prose can omit
    any of them silently, which is precisely the "try harder" non-enforcement LAW-2 forbids.
  - *Let the Scout report only the non-null metrics* — rejected: a `null` metric is the sharpest
    finding — the anatomy that defines it is *absent* — so dropping nulls would discard the most
    important evidence. The check requires all six keys; a null stays in with its reason.
  - *Guess the target's architecture from the code and grade against it* — rejected: it inverts
    SEED.md §5 (elicit, never guess) and turns a proposal *for* the owner into a verdict *on* them.
    The grill agenda names what only the owner can answer; the findings are provisional until they
    do. A read-only Scout that invented a target architecture would be measuring against a fiction.
  - *Fold assessments into `docs/postmortems/` or `docs/architecture/`* — rejected: an assessment
    is neither a failure metabolized (postmortem) nor an elicited target architecture (architecture
    doc) — it is the read-only-Scout-plus-proposal artifact of the exit criterion, with its own
    four bindings. One shared organ would blur three distinct formats and three distinct checks.
  - *Gate it like repo-fitness — out of `run-all`, reachability only* — rejected: repo-fitness runs
    against arbitrary targets and so cannot be a per-commit invariant of this tree; an assessment is
    the seed's *own* produced record and belongs among the tree's invariants, like the rings and
    postmortems it is numbered alongside.
- Enforcement: structural test — [`.seed/checks/validate-assessments.ts`](../../.seed/checks/validate-assessments.ts)
  (in `npm run check` via [`run-all.ts`](../../.seed/checks/run-all.ts)) binds every
  `docs/assessments/NNNN-slug.md`: sequential filename + title with agreeing numbers, the two
  fields (`Date` a real `YYYY-MM-DD`), the four sections, a `## Scout` naming all six §6 metric
  keys, at least one `## Findings` bullet each converting to one of the four products (link-stripped),
  a `## Grill agenda` that asks, and a two-bullet `## Ownership` split.
  [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts) (`npm test`) pins it — a valid
  four-section assessment passes all checks (reachability included), every one of the four products
  is accepted (including feedback.ts's hyphenated `priced-debt`), and each binding fails red on a
  fixture that breaks exactly it (bad title / filename / mismatched number, missing field, malformed
  `Date`, missing section, a Scout omitting a §6 metric, a finding with no `Product:` clause / a
  clause naming no product / a product word only in a link, an empty Findings section, a questionless
  grill agenda, one-sided and single-bullet ownership, duplicate and gap numbering).
  `docs/assessments/README.md` is a required-anatomy path (`validate-anatomy`), and the organ is
  map-reachable through [AGENTS.md](../../AGENTS.md)'s Territory table.
- Revisit-when: the evidence set needs to grow beyond the six §6 metrics (a Stage 3 metric amends
  SEED.md §6 — the check's `METRIC_KEYS` pin tracks that constitutional source and is updated with
  it); or a grafted host needs a **machine-readable** assessment (the current format is prose for
  humans — a structured export lands when a host consumes assessments programmatically); or the
  on-disk-walk instrument (E-012) is fixed, changing what a Scout's denominators mean (assessments
  taken before the fix carry the instrument note, ones after do not).
