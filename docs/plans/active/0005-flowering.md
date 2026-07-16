# Plan 0005 — Flowering (Stage 3)

- Status: active

## Goal

Advance from Stage 2 (Growth) to Stage 3 (Flowering, SEED.md §4): package the portable
subset of the Seed — skills, scaffolding templates, protocols, an installer, and a mandated
uninstall path — as versioned [`pollen/`](../../../pollen/README.md), then run the recursive
test — **the seed is its own first host**: upgrade the seed using its own pollen — proving the
transplant by installing pollen into a sacrificial test repo with fitness measured before and
after. The delta is the proof (the Stage 3 exit criterion).

This plan opened as a **transition proposal**: SEED.md §4 requires each stage transition to be
proposed by the seed as an execution plan, approved by a Gardener, and recorded as a ring. It
is a proposal until the Gardener approves it — no Stage 3 scope item starts and no transition
ring is cut before approval, the arc [plan 0003](../completed/0003-growth.md) (Stage 1→2) and
[plan 0002](../completed/0002-rooting.md) (Stage 0→1) each followed via
[ring 0014](../../rings/0014-stage-2-transition-approved.md) and
[ring 0009](../../rings/0009-stage-1-transition-approved.md).

## Stage 2 exit criterion — evidence

Stage 2's exit criterion (SEED.md §4): *you can assess a foreign repository without modifying
it and produce a proposal its owners could judge on evidence.* Met on both counts, evidenced in
[plan 0003](../completed/0003-growth.md):

- **The skill garden grown.** All six Stage 2 skills are planted, each shipping its own
  verification (LAW-6): grill-the-gardener ([ring 0015](../../rings/0015-grill-the-gardener-architecture-doc.md)),
  repo-fitness ([ring 0016](../../rings/0016-repo-fitness-generalizes-the-metric-engine.md)),
  postmortem ([ring 0017](../../rings/0017-postmortem-three-artifacts-linked.md)),
  parallel-worktrees ([ring 0019](../../rings/0019-parallel-worktrees-host-agnostic-lifecycle.md)),
  onboard-human ([ring 0020](../../rings/0020-onboard-human-generated-briefing.md)), and
  feedback ([ring 0021](../../rings/0021-feedback-composes-upstream-issue.md)). Before Flowering
  the Gardener grew one more organ — intake ([plan 0004](../completed/0004-intake.md),
  rings [0023](../../rings/0023-grounded-or-ask-first-principle.md) /
  [0024](../../rings/0024-intake-network-free-metabolizer.md)) — plus the seed's first stated
  principle, [grounded-or-ask](../../principles/grounded-or-ask.md), giving `enforcement_ratio`
  (SEED.md §6) its first real datum.
- **A foreign repository assessed read-only on evidence.**
  [assessment 0001 — mottainapp](../../assessments/0001-mottainapp.md)
  ([ring 0022](../../rings/0022-assessment-organ-exit-criterion.md)): a 691-file / 792-commit
  foreign product turned into an evidence-judgeable proposal — the full SEED.md §6 baseline
  computed (each metric, or a stated `null` whose reason is the finding), every finding converted
  to one of SEED.md §0's four products, the target's architecture left to a grill agenda rather
  than guessed (SEED.md §5), and the target proven byte-identical (HEAD + tree hash + clean
  status) before and after — repo-fitness's non-mutation contract.

Both conditions are met, and the genome forbids lingering past an exit criterion (SEED.md §4) —
hence this proposal.

## Scope — Stage 3 (Flowering)

SEED.md §4 (Stage 3) packages the portable subset as versioned `pollen/`, then runs the
recursive self-upgrade test. The build is refined by a release/upgrade mechanism designed with
the Gardener on 2026-07-06 and priced, at this transition, as [E-015](../entropy-ledger.md). In
proposed order, each item shipping its own verification (LAW-6):

1. **Pollen boundary + versioning + lineage.** Define exactly which subset is portable — which
   skills, scaffolding templates, and protocols — versus what is sovereign to the mother (the
   laws: amendable only by Gardener-approved PR + ring). Establish the two distinct version lines
   (genome version vs pollen version — never conflated) and the lineage metadata every descendant
   records (seed version, parent, date planted; SEED.md §7). Verification: a structural check that
   the pollen manifest is complete and its lineage fields are present and well-formed.
2. **The release / graft CLI** — owned in `.seed/`, not imported (LAW-7; the buy-vs-build verdict
   is E-015: every mainstream release tool fails on commit grammar, ring-0020 determinism,
   artifact shape, LAW-2 legibility, and the zero-dep clause). A thin orchestrator over
   already-built skills — verbs `sense` / `graft` / `verify` / `feedback` / `uninstall` — that
   ships *inside* pollen (self-carrying, so a descendant can graft the next release). Its
   determinism obeys [ring 0020](../../rings/0020-onboard-human-generated-briefing.md): pure
   pending-release notes computed in `run-all` from committed intent (byte-exact gated); an
   append-only dated release history (release dates are recorded-once facts, the ring-append-only
   shape); and the git-aware, side-effecting cut-release step *out* of `run-all`, self-tested as a
   dry-run (the [worktrees](../../rings/0019-parallel-worktrees-host-agnostic-lifecycle.md) /
   [feedback](../../rings/0021-feedback-composes-upstream-issue.md) precedent). Verification: a
   side-effect-free dry-run pinned by the self-tests in the three-binding shape (works / has teeth
   / side-effect-free).
3. **Installer + the mandated uninstall path** (SEED.md §4: *an uninstall path must exist*).
   Install pollen into a repo — the map, the plan structure, the first lints (the Stage 4 graft
   step, dry-run here) — and prove it reverses cleanly. Verification: install-then-uninstall
   against a hermetic scratch repo leaves it byte-identical (the worktrees hermetic-dry-run shape).
4. **The recursive test — the seed is its own first host** (SEED.md §4). Upgrade the seed using
   its own pollen, and install pollen into a sacrificial test repo, with
   [repo-fitness](../../rings/0016-repo-fitness-generalizes-the-metric-engine.md) measured before
   and after each; **the delta is the exit proof.** Verification: this item *is* the exit criterion
   — the before/after fitness snapshots plus the clean sacrificial-repo install, with the target
   proven restorable via the uninstall path.

This is the genome's Stage 3 menu, not a frozen build order: per-item build decisions are cut as
rings when each is designed (the plan 0003 rhythm), and the release-process **founding ring**
(E-015's conversion path) is the first of them. The exit criterion governs completion, not the
item count.

## Decision log

- **This plan is a proposal until approved.** Per SEED.md §4 a transition is proposed as a plan,
  approved by the Gardener, and recorded as a ring. No Stage 3 scope item starts and no transition
  ring is cut before approval — the [ring 0009](../../rings/0009-stage-1-transition-approved.md) /
  [0014](../../rings/0014-stage-2-transition-approved.md) precedent.
- **The parked release design is priced at this transition, not baked in.** The release/upgrade
  mechanism worked out with the Gardener (2026-07-06) lived only in agent memory — tribal knowledge
  is entropy (SEED.md §0). It is converted to a repo-legible priced debt,
  [E-015](../entropy-ledger.md), at this transition (the [E-004](../entropy-ledger.md) precedent: a
  Stage-3-gated debt priced ahead), so the Stage 3 scope is grounded in an artifact, not a memory
  (grounded-or-ask). The open design forks — the semver/migration trigger, improvement granularity
  (ring vs skill vs pollen-version), and the framework/local ownership boundary — are explicitly
  deferred to the founding ring, not decided here.
- **Propagation is re-metabolization, not `npm update`.** A descendant adopts an upstream
  improvement as *sensed input* to its own metabolism — its own plan / ring / fitness — so an
  adopted change cannot land without becoming the descendant's own ring (its `plan-traceability`
  gate already refuses ringless changes). Decline is a first-class product (a divergence ring),
  so "propose, never force" falls out for free; this is why the release tool composes-never-posts
  ([ring 0021](../../rings/0021-feedback-composes-upstream-issue.md)) and gates mutating/outward
  acts on the Gardener.
- **Gating prerequisites — named risks this plan carries, not silent deferrals.**
  [E-004](../entropy-ledger.md): "Seed" is an uncleared codename whose interest rate *spikes to
  high at Stage 3* — pollen cannot ship under an uncleared name, so a trademark search is Gardener
  work owed within this stage before the exit criterion's "pollen ships" moment.
  [E-013](../entropy-ledger.md): the seed has only computational controls, and inferential quality
  (whether pollen behaves as claimed) *rises sharply at Flowering*, where pollen quality is
  behavioral, not structural.
- **Tier ([ring 0010](../../rings/0010-model-effort-selection.md)).** This proposal is
  Gardener-judgment work — drafted at mid tier; the transition decision is the Gardener's. Once
  live, the pollen-packaging items are pattern-following work under their own verification
  (cheapest tier that clears the harness), with novel design (the release CLI, the
  recursive-upgrade harness) and any surface that gates `main` at the top tier or a top-tier
  review pass.

## Progress log

- **2026-07-08** — Drafted at the close of [plan 0004](../completed/0004-intake.md) (intake
  landed) and on [plan 0003](../completed/0003-growth.md)'s Next actions item 9, with both Stage 2 exit
  conditions evidenced above. Proposed for Gardener approval of the Stage 2 → 3 (Growth →
  Flowering) transition (SEED.md §4). The parked release/upgrade design is formalized at this
  transition as [E-015](../entropy-ledger.md) — the "at/before the transition" step it called for
  (the E-004 precedent). Awaiting approval; on approval a transition ring is cut (the
  [ring 0014](../../rings/0014-stage-2-transition-approved.md) pattern), Stage 3 is entered, this
  plan becomes governing, [plan 0003](../completed/0003-growth.md) completes and moves to `completed/`, and
  AGENTS.md `Current state` + `fitness.ts` (`CURRENT_STAGE`) flip to Stage 3. `npm run check` +
  `npm test` green; `drift_count` 0.
- **2026-07-15** — **Transition approved by the Gardener**; recorded as
  [ring 0025](../../rings/0025-stage-3-transition-approved.md). **Stage 3 (Flowering) entered; this
  plan is now governing.** Enacted: [plan 0003](../completed/0003-growth.md) set to `completed
  2026-07-15` and `git mv`d to `completed/` (non-ring references repointed; the append-only rings
  resolve through validate-map's active/⇄completed/ plan-link flex), AGENTS.md `Current state` +
  `fitness.ts` (`CURRENT_STAGE`) flipped to Stage 3, and this plan's status held `active` as the
  live plan. No scope item is built yet — **scope item 1 (pollen boundary + versioning + lineage)
  is the live work**, and its first build decision is the release-process founding ring (E-015's
  conversion path). `npm run check` + `npm test` green; `drift_count` 0.

## Next actions

1. ✅ **Transition approved** (2026-07-15) — recorded as
   [ring 0025](../../rings/0025-stage-3-transition-approved.md); Stage 3 entered, this plan
   governing, [plan 0003](../completed/0003-growth.md) completed, AGENTS.md `Current state` +
   `fitness.ts` flipped to Stage 3.
2. **Scope item 1 — pollen boundary + versioning + lineage (the live work).** Cut the
   release-process **founding ring** first (E-015's conversion path): decide the open forks — the
   semver/migration trigger, improvement granularity (ring vs skill vs pollen-version), and the
   framework/local ownership boundary. Then define the portable subset (which skills, scaffolding
   templates, protocols) versus what is sovereign to the mother, the two version lines (genome vs
   pollen), and the lineage metadata (seed version, parent, date planted; SEED.md §7), with a
   structural check on manifest completeness and lineage well-formedness (LAW-6).
3. **Then items 2–4** in scope order: the owned `.seed/` release/graft CLI, the installer + the
   mandated uninstall path, and the recursive self-upgrade test (fitness before/after as the exit
   proof). Clear the gating prerequisites [E-004](../entropy-ledger.md) (name/trademark) and
   [E-013](../entropy-ledger.md) (inferential control) within the stage before pollen ships.
