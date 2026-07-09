# Plan 0004 — Intake: metabolizing external knowledge into the seed

- Status: active

## Goal

Grow a new Stage 2 skill — **intake** — that metabolizes external knowledge (curated link
lists, blog posts, papers, community write-ups) *already saved into the repository* into the
seed's four products (SEED.md §0), under a discipline that never lets inference masquerade as
fact: **grounded-or-ask** — every claim is either cited to a source or raised as a question; a
silent assumption is a defect (SEED.md §5). This extends the seed's food supply from the
entropy it senses *inside* a repo to knowledge *from the field* — the step the Gardener judged
highest-leverage before Flowering: a seed that keeps learning from the field goes out into the
world sturdier than one frozen at its planting-day knowledge.

The skill and its principle were **scouted, not guessed**: the hand-pass proof
([docs/references/harness-engineering.md](../../references/harness-engineering.md), commit
`6c732ff`) metabolized one real corpus section end-to-end — it is the evidence this loop
produces a faithful, useful artifact, and it surfaced the two capability gaps this work turns on
([E-013](../entropy-ledger.md), [E-014](../entropy-ledger.md)).

## Context — why now, and why not the transition

Plan 0003's Stage 2 exit criterion is met (assessment 0001, ring 0022), so the genome's next
prescribed step is the Stage 2 → 3 (Growth → Flowering) transition. The Gardener has instead
elected to **grow one more organ first** — deliberately, not by lingering (SEED.md §4's
caution). The choice is bounded and recorded: the Stage 2 skill menu was never a frozen build
order (plan 0003's own framing), intake is Stage-2-natured ("grow the skills that make you
useful beyond yourself"), and the Flowering transition stays explicitly queued behind this plan
(plan 0003 Next actions item 9). This plan does not re-open the exit criterion; it adds a
capability judged load-bearing for a sturdy Flowering.

## The intake family (why intake first)

Three prospective skills share one engine — **assemble grounded context → surface the gaps as
questions, never guesses → compose a proposal → the Gardener ratifies**:

- **grill-the-gardener** (built, ring [0015](../../rings/0015-grill-the-gardener-architecture-doc.md)) — that engine pointed at *architecture*.
- **intake** (this plan) — that engine pointed at *external sources*.
- **PRD / intent authoring** (a sibling, deferred) — that engine pointed at *product intent*.

intake goes first because it has a ready, owned corpus (the awesome-harness-engineering list,
already scouted) and it enriches the seed's own knowledge of how harnesses like it are built —
informing every skill after it. The PRD sibling is named here, not scoped; it earns its own plan
when intake's engine is proven.

## Scope — each item ships its own verification (LAW-6)

1. **grounded-or-ask — the seed's first stated principle, and the principle validator it needs.**
   Write `docs/principles/grounded-or-ask.md` in the SEED.md §2 format (statement / rationale /
   enforcement / exceptions): every claim in a distilled or generated artifact is cited to a
   source or raised as a question; a silent assumption is a defect. This fills the empty
   principles organ and gives `enforcement_ratio` its first datum. Because the organ was empty
   there is **no principle validator yet** — so this item also ships `.seed/checks/validate-principles.ts`
   (in `run-all`) binding every `docs/principles/*.md` to the §2 format and requiring the
   enforcement line to name a real mechanism whose enforcer exists (the validate-architecture /
   validate-assessments pattern: vacuous while the organ holds only its README, binding the moment
   the first principle lands). Self-tests pin it.
2. **intake skill** (`skills/intake/SKILL.md`) — the procedure: point at a corpus already saved
   in-repo → parse its entries → classify each into exactly one outcome (a `docs/references/`
   distillation, a proposed ring, a priced ledger entry, a new-skill seed, or discard-with-reason —
   **no entry silently dropped**) → compose the proposal → the Gardener ratifies → land. The
   grounded-or-ask separation is carried in the output (the **Seed reading:** convention the proof
   established). **Network-free**: it operates on saved content; fetching the underlying sources is
   phase 2 (a deferred ring — the feedback.ts "the genome composes, a host performs the outward
   act" precedent, ring [0021](../../rings/0021-feedback-composes-upstream-issue.md)).
3. **reference-format verification** (`.seed/checks/validate-references.ts`, in `run-all`) — bind
   every `docs/references/*.md`: a source line carrying a retrieval date and, for a repo-pinnable
   source, a commit pin; every distilled claim cites a source; the grounded/inference separation is
   structurally present. **Teeth:** where the cited corpus is saved in-repo, **completeness** (every
   source entry classified or discarded-with-reason — no silent truncation, the worktrees/feedback
   anti-drop guard) and **quote-match** (a quoted span must appear in the cited saved source). It
   must pass on the already-landed `harness-engineering.md` (its first real binding subject, the
   assessment-0001 pattern). Self-tests pin it works, has teeth (each guard fires on a fixture
   breaking exactly it), and passes a valid reference.
4. **the honest residual, deferred not dropped.** The *inferential* control that judges paraphrase
   faithfulness and synthesis quality ([E-013](../entropy-ledger.md)) — an LLM-as-judge — is **not**
   built here: v0's mitigation is compose-not-commit + Gardener ratification (grounded-or-ask's
   doc-only half), and the mechanical guards above bound only the *fabrication* surface, not
   faithfulness. Named so the gap stays visible; built when the skill's inferential-quality gap
   first bites. [E-014](../entropy-ledger.md) (a resumable work-unit format) is a *separate* thread,
   not this plan.

## Decision log

- **Network deferred to phase 2 (a ring when built).** v0 operates on content already saved into
  the repo; fetching underlying URLs pulls network + auth into the genome — the host-specific
  mechanics SEED.md §4 keeps in adapters (the ring 0021 precedent). Confirmed with the Gardener
  2026-07-08.
- **v0 output is references-first, ledger-ideas secondary.** The corpus is pre-annotated links, so
  the lowest-fabrication-risk, highest-immediate-use output is a curated `docs/references/` index;
  capability-gap ledger entries fall out of the same pass (proven: E-013/E-014 from the hand-pass).
  ring-candidates and new-skill seeds are richer outputs the skill *may* propose; v0 need not.
- **grounded-or-ask is a principle, not merely a skill rule** — it is the epistemic law under the
  whole intake family (and PRD later), and the principles organ was empty, so `enforcement_ratio`
  measured nothing. Stating it once, enforced, serves both.
- **Open build-ring questions (settled when the skill is built, the plan 0003 rhythm):** the name
  (`intake` is the working name); where a saved corpus lives in-repo (a staging area vs. alongside
  the reference) — which decides how far quote-match can bind in v0; and the exact classification
  vocabulary for an entry's outcome.
- **Tier (ring [0010](../../rings/0010-model-effort-selection.md)).** Novel design — the first
  principle, a new skill, and the inferential-control question — so the design and any surface that
  gates `main` runs at the top tier or a top-tier review pass; the mechanical check-writing is the
  cheapest tier that clears the harness.

## Progress log

- **2026-07-08** — Plan opened. Preceded by a Gardener-ratified hand-pass proof (commit `6c732ff`):
  the awesome-harness-engineering `Foundations` section metabolized into the seed's first
  `docs/references/` distillation under the grounded-or-ask discipline, surfacing E-013 and E-014.
  The proof is the scout; this plan formalizes the loop into a skill + its principle + its
  verification. Next: scope item 1 (the grounded-or-ask principle + its validator), unless the
  Gardener first wants to reshape the reference-output format — it is the skill's output contract.
- **2026-07-08** — Scope item 1 landed (ring [0023](../../rings/0023-grounded-or-ask-first-principle.md)).
  [grounded-or-ask](../../principles/grounded-or-ask.md) is the seed's first stated principle
  (SEED.md §2 format), and [validate-principles](../../../.seed/checks/validate-principles.ts) (in
  `run-all`) binds every `docs/principles/*.md` to the four fields with the load-bearing teeth: the
  Enforcement clause must name a mechanism whose enforcer is **linked and exists** (the
  validate-postmortems Invariant discipline). The interim enforcer named is
  [validate-generated](../../../.seed/checks/validate-generated.ts) (the generated-artifact family:
  no claim survives that is not regenerable from a named source); `validate-references` is added to
  the principle's Enforcement when scope item 3 lands. Ten self-test cases pin it (nine failure
  classes + a valid-principle-passes block); `enforcement_ratio` (SEED.md §6) now reads 1/1. Also
  fixed sensed drift found in passing: the `.seed/README.md` Checks table was missing its
  validate-assessments row. Next: scope item 2, the intake skill.
- **2026-07-08** — Scope item 2 landed (ring [0024](../../rings/0024-intake-network-free-metabolizer.md)).
  The [intake](../../../skills/intake/SKILL.md) skill is planted: parse a repo-saved corpus →
  classify every entry into one closed outcome (`reference` / `ledger` / `ring` / `skill-seed` /
  `discard`-with-reason — no silent drop) → compose a distillation carrying the grounded/inference
  split (**Seed reading:**) → the Gardener ratifies → land, network-free. Ring 0024 settled the three
  build-time questions: the name (`intake`); provenance (**pin, don't mirror** — cite by link +
  retrieval-date + commit-pin; quote-match binds only where a cited source is an already-committed
  in-repo file, so saving a fetched corpus defers to phase 2 alongside fetching); and the
  five-outcome vocabulary. The skill's structural enforcer, `validate-references`, is named-pending
  (scope item 3, the ring-0023 forward-reference discipline); its live control today is
  grounded-or-ask's compose-not-commit + Gardener ratification, with the committed scout
  ([harness-engineering.md](../../references/harness-engineering.md)) as standing evidence the loop
  produces a faithful artifact. Next: scope item 3, validate-references.

## Next actions

1. **Scope item 3 — validate-references.** `.seed/checks/validate-references.ts` with completeness +
   quote-match teeth (the latter binding where a cited source is saved in-repo, per ring 0024's
   pin-not-mirror decision), passing the landed `harness-engineering.md`, pinned by self-tests. When
   it lands, add its link to grounded-or-ask's Enforcement clause — the interim-enforcer note there
   names it as pending (ring 0023).
2. **Then** — return to plan 0003 Next actions item 9: propose the Stage 2 → 3 (Growth → Flowering)
   transition, now with intake in the garden.

(Scope item 1 landed 2026-07-08: grounded-or-ask + validate-principles, ring 0023. Scope item 2
landed 2026-07-08: the intake skill, ring 0024.)
