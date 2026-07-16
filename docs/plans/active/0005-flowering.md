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
- **2026-07-15** — **Scope item 1 landed (pollen boundary + versioning + lineage).** The
  release-process **founding [ring 0026](../../rings/0026-pollen-boundary-versioning-lineage.md)**
  decides [E-015](../entropy-ledger.md)'s three forks: **(a)** pollen is semver and the impact class
  is *declared-and-checked* (not parsed from commit keywords — the seed's grammar is plan/ring refs),
  major = breaking *forces a migration*, minor = feature, patch = fix; **(b)** improvement granularity
  dissolves into three orthogonal axes — a *release* is a pollen version, a *learning* is a ring (the
  decision log is the changelog), a *portable artifact* is a skill/template/protocol; **(c)** the
  ownership boundary is three tiers — **sovereign** (the genome `SEED.md`), **portable** (the method:
  `skills/` + `.seed/`), **local** (each seed's own history). Built: the
  [pollen manifest](../../../.seed/lib/pollen.ts) (the boundary + the two version lines, genome `0.1`
  vs pollen `0.0.0`, never conflated), the shared [lineage schema](../../../.seed/lib/lineage.ts)
  (SEED.md §7 — now the single definition read by *both* the pollen check and the
  [feedback](../../../skills/feedback/SKILL.md) composer, LAW-3, closing the E-011 shape by
  construction), the mother's root [lineage.json](../../../pollen/lineage.json) (`parent` null), and
  [validate-pollen](../../../.seed/checks/validate-pollen.ts) (in `npm run check`) proving the boundary
  **complete** + the version lines + lineage well-formed — pinned by 10 self-test violation cases + a
  valid-descendant exit-0 case (LAW-6). `npm run check` (12 checks) + `npm test` (191 cases) green;
  `drift_count` 0. **Scope item 2 (the owned `.seed/` release/graft CLI) is now the live work.**
- **2026-07-15** — **Scope item 2 landed (the owned `.seed/` release/graft CLI) — [E-015](../entropy-ledger.md)
  paid.** The build **[ring 0027](../../rings/0027-release-graft-cli.md)** decides the concrete design
  ring 0026 left open, mapping the [ring 0020](../../rings/0020-onboard-human-generated-briefing.md)
  determinism split onto three artifacts: **committed intent** →
  [pollen/pending.md](../../../pollen/pending.md) (one file, declared `- Impact: … — [ring NNNN](…) — …`
  bullets); **pending-release notes** → the generated, byte-exact
  [docs/generated/pending-release.md](../../generated/pending-release.md) (via `validate-generated`);
  and the **append-only dated release history** → [pollen/releases/](../../../pollen/releases/README.md)
  (one file per cut release, guarded by [release-append-only.ts](../../../.seed/checks/release-append-only.ts),
  the ring-append-only shape). Built: the pure model [.seed/lib/release.ts](../../../.seed/lib/release.ts)
  (the single source of truth read by the generator, the check, and the CLI — LAW-3) with the
  version-bump-from-max-declared-impact and the migration-required-for-major tooth; the CLI
  [.seed/checks/release.ts](../../../.seed/checks/release.ts) (`npm run release`) with verbs
  `sense` / `cut-release` (the git-aware, side-effecting step, `--date` a recorded fact, out of
  `run-all`, verified by its `--dry-run`) / `verify` / `feedback`, and `graft` / `uninstall` reserved
  for scope item 3; and [validate-release.ts](../../../.seed/checks/validate-release.ts) (in `npm run
  check`) proving the pure invariants (intents well-formed + ring-resolving, releases well-formed,
  `POLLEN_VERSION` tracks the latest release, majors carry a migration). The two capabilities that have
  landed (rings 0026, 0027) are declared as pending intents composing a first **v0.1.0**; the pollen
  line rests at v0.0.0 (the first real cut is scope item 4). Verification (LAW-6): 18 new self-tests —
  the 9 `validate-release` violation classes, the `cut-release --dry-run` in the three-binding shape
  (works / has teeth: nothing-to-release + the migration tooth both ways / side-effect-free), a real
  cut proven to bump + clear + regenerate and leave `run-all` green (the generate.ts fixpoint shape),
  and the append-only gate (modify/delete fail, append passes, unresolvable base skips). `npm run check`
  (12 checks) + `npm test` (209 cases) green; `drift_count` 0. **Scope item 3 (the installer + the
  mandated uninstall path) is now the live work.**
- **2026-07-15** — **Scope item 3 landed (the installer + the mandated uninstall path).** The build
  **[ring 0028](../../rings/0028-installer-uninstall.md)** decides the graft as the SEED.md §4
  Stage-4-step-4 **beachhead** — *the map, the plan structure, and the first lints; no behavior changes
  yet* — and the uninstall as its byte-exact inverse. Built: the graft model
  [.seed/lib/graft.ts](../../../.seed/lib/graft.ts) — the single source of truth (LAW-3) for what graft
  **lays down** and uninstall **takes back**, so the round-trip is byte-identical: the running seed
  **copies** its portable method (`.seed/`, `skills/`) + sovereign genome (`SEED.md`) verbatim and
  **emits** the local scaffold (map, plans, rings, release data, lineage, plumbing) as parameterized
  templates carried as strings — invisible to the mother's own `.md`-only
  [validate-map](../../../.seed/checks/validate-map.ts) / [doc-drift](../../../.seed/checks/doc-drift.ts)
  that a `.md` template would trip. Graft is **purely additive** (refuses to overwrite, LAW-2) — the
  invariant that makes uninstall a clean inverse (remove exactly the graft set + prune emptied dirs →
  byte-identical). The release CLI's reserved `graft` / `uninstall` verbs
  ([.seed/checks/release.ts](../../../.seed/checks/release.ts)) gained their machinery —
  `graft <target> --planted YYYY-MM-DD [--parent] [--repo] [--dry-run]` and `uninstall <target>
  [--dry-run]`, side-effecting so **out of `run-all`** (the cut-release/worktrees precedent), `--planted`
  a recorded fact (ring 0020). Verification (LAW-6): 3 self-tests in the worktrees three-binding shape —
  **works + teeth + byte-identical** (graft into a hermetic empty repo lands the method + scaffold, the
  target's **own copied** `release.ts sense` runs against the grafted data, uninstall restores it
  byte-identical, and the round-trip proves graft **changed** the tree while uninstall **reversed** it),
  **refuse-to-clobber** (a pre-existing target path → exit 1, host file untouched, nothing installed),
  and **`--dry-run` side-effect-free**. The installer (ring 0028) is declared a third pending intent
  composing **v0.1.0** (still minor). `npm run check` (12 checks) + `npm test` (212 cases) green;
  `drift_count` 0. **Scope item 4 (the recursive self-upgrade test — the seed is its own first host) is
  now the live work.**

## Next actions

1. ✅ **Transition approved** (2026-07-15) — recorded as
   [ring 0025](../../rings/0025-stage-3-transition-approved.md); Stage 3 entered, this plan
   governing, [plan 0003](../completed/0003-growth.md) completed, AGENTS.md `Current state` +
   `fitness.ts` flipped to Stage 3.
2. ✅ **Scope item 1 landed** (2026-07-15) — the founding
   [ring 0026](../../rings/0026-pollen-boundary-versioning-lineage.md) decided the three forks
   (semver/migration model, the three orthogonal granularity axes, and the three ownership tiers);
   the [pollen manifest](../../../.seed/lib/pollen.ts) (boundary + two version lines), the shared
   [lineage schema](../../../.seed/lib/lineage.ts) + the mother's root
   [lineage.json](../../../pollen/lineage.json), and [validate-pollen](../../../.seed/checks/validate-pollen.ts)
   landed with 11 self-test cases (LAW-6).
3. ✅ **Scope item 2 landed** (2026-07-15) — the owned `.seed/` release/graft CLI, decided in
   [ring 0027](../../rings/0027-release-graft-cli.md) and paying off [E-015](../entropy-ledger.md): the
   pure model ([.seed/lib/release.ts](../../../.seed/lib/release.ts)), the CLI
   ([.seed/checks/release.ts](../../../.seed/checks/release.ts), verbs `sense`/`cut-release`/`verify`/`feedback`,
   `graft`/`uninstall` reserved for item 3), the determinism split (byte-exact
   [pending notes](../../generated/pending-release.md); append-only
   [release history](../../../pollen/releases/README.md) + [its gate](../../../.seed/checks/release-append-only.ts);
   dry-run-verified `cut-release`), the version-bump-from-max-declared-impact + the migration tooth, and
   [validate-release](../../../.seed/checks/validate-release.ts) — with 18 self-tests (LAW-6).
4. ✅ **Scope item 3 landed** (2026-07-15) — the installer + the mandated uninstall path, decided in
   [ring 0028](../../rings/0028-installer-uninstall.md): the graft model
   ([.seed/lib/graft.ts](../../../.seed/lib/graft.ts)) — copy the portable method + sovereign genome,
   emit the local scaffold as parameterized templates, purely additive (refuse-to-clobber) so uninstall
   reverses byte-identical — and the release CLI's now-live `graft` / `uninstall` verbs
   ([.seed/checks/release.ts](../../../.seed/checks/release.ts)), pinned by 3 self-tests in the worktrees
   hermetic round-trip shape (works + teeth + byte-identical, refuse-to-clobber, `--dry-run`
   side-effect-free).
5. **Scope item 4 — the recursive self-upgrade test (the live work): the seed is its own first host.**
   Cut the first real pollen release (**v0.1.0**, already composed as the pending intents of rings 0026,
   0027, 0028), upgrade the seed using its own pollen, and graft into a sacrificial test repo, with
   [repo-fitness](../../rings/0016-repo-fitness-generalizes-the-metric-engine.md) measured before and
   after each — the delta is the exit proof (SEED.md §4). Clear the gating prerequisites
   [E-004](../entropy-ledger.md) (name/trademark) and [E-013](../entropy-ledger.md) (inferential control)
   within the stage before pollen ships.
