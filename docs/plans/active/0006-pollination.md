# Plan 0006 — Pollination (Stage 4)

- Status: active

## Goal

Advance from Stage 3 (Flowering) to Stage 4 (Pollination, SEED.md §4): enter a real foreign
host and run the genome's six-step per-host protocol — **Scout → Grill → Propose → Graft →
Metabolize → Independence** — bringing **method, not dogma** (the host's target architecture is
discovered by grilling its owners, never imposed). Every step's instrument was built and proven
during Stages 2–3; Stage 4 is the first time the whole organism is applied, mutating, to a
repository that is not the Seed itself. Unlike every prior stage, Pollination is **terminal and
ongoing** (SEED.md §0: a repository is never "done") — its exit criterion is judged *per host*,
and the mother keeps pollinating indefinitely (SEED.md §7).

This plan opens as a **transition proposal**: SEED.md §4 requires each stage transition to be
proposed by the seed as an execution plan, approved by a Gardener, and recorded as a ring. It is
a proposal until the Gardener approves it — no Stage 4 scope step starts and no transition ring
is cut before approval — the arc [plan 0005](../completed/0005-flowering.md) (Stage 2→3, via
[ring 0025](../../rings/0025-stage-3-transition-approved.md)),
[plan 0003](../completed/0003-growth.md) (Stage 1→2, via
[ring 0014](../../rings/0014-stage-2-transition-approved.md)), and
[plan 0002](../completed/0002-rooting.md) (Stage 0→1, via
[ring 0009](../../rings/0009-stage-1-transition-approved.md)) each followed.

## Stage 3 exit criterion — evidence

Stage 3's exit criterion (SEED.md §4): *pollen installs cleanly into a sacrificial test repo;
fitness is measured before and after; the delta is the proof* — plus the recursive test (the seed
upgrades itself using its own pollen) and a mandated uninstall path. Met and evidenced in
[plan 0005](../completed/0005-flowering.md):

- **The portable subset packaged as versioned pollen.** The boundary, the two version lines, and
  lineage ([ring 0026](../../rings/0026-pollen-boundary-versioning-lineage.md)); the owned
  `.seed/` release / graft CLI paying off [E-015](../entropy-ledger.md)
  ([ring 0027](../../rings/0027-release-graft-cli.md)); and the installer + the mandated uninstall
  path ([ring 0028](../../rings/0028-installer-uninstall.md)) — each shipping its own verification
  (LAW-6). The pollen line rests at **v0.1.0** ([pollen/releases/v0.1.0.md](../../../pollen/releases/v0.1.0.md)).
- **The recursive self-upgrade test — the seed is its own first host**
  ([ring 0029](../../rings/0029-recursive-self-upgrade-test.md)). The mother cut her first real
  pollen release with her own CLI (v0.0.0 → v0.1.0), grafted it into a sacrificial repo, and
  measured it with her own repo-fitness before and after (`map_reachability` null → 100% → null),
  then uninstalled to **byte-identical** — the judgeable exit proof
  ([docs/fitness/recursive-upgrade.md](../../fitness/recursive-upgrade.md)), with the reproducible
  shape pinned by a self-test. The uninstall path exists and reverses cleanly (SEED.md §4).
- **Both Stage 3 → 4 gating prerequisites paid.** [E-013](../entropy-ledger.md) — the seed's first
  inferential control (the [judge](../../../skills/judge/SKILL.md) skill: a compose-not-commit
  LLM-as-judge whose probabilistic verdict rides in a deterministic, staleness-gated envelope) —
  paid 2026-07-17 ([ring 0030](../../rings/0030-inferential-control-judge.md)); and
  [E-004](../entropy-ledger.md) — the uncleared "Seed" codename — paid 2026-07-17
  ([ring 0031](../../rings/0031-name-cleared-codename-retained.md)): the Gardener's trademark
  knockout search landed and "The Seed" is retained as a non-exclusive descriptive codename, no
  registration claimed.

All conditions are met, and the genome forbids lingering past an exit criterion (SEED.md §4) —
hence this proposal.

## Scope — Stage 4 (Pollination)

SEED.md §4 (Stage 4) is a six-step per-host protocol, run against a real foreign host. Its shape
is the genome's, not this plan's — and every step's instrument already exists, built and proven
across Stages 2–3. In genome order, each per-host run shipping its own evidence (LAW-6):

1. **Scout** — a read-only fitness assessment of the named host; report delivered. Instrument: the
   [repo-fitness](../../../skills/repo-fitness/SKILL.md) Scout + the
   [assessments](../../assessments/README.md) organ, already exercised end-to-end read-only in
   [assessment 0001 — mottainapp](../../assessments/0001-mottainapp.md) (the Stage 2 exit
   criterion). **Pre-flight:** [E-012](../entropy-ledger.md) (repo-fitness walks the on-disk tree,
   not `git ls-files`) is owed *before the instrument is pointed at a real host in earnest* — its
   conversion path names this moment.
2. **Grill** — interview the host's owners; the target architecture defined to one page + lintable
   rules; the human/agent ownership split explicit. Instrument:
   [grill-the-gardener](../../../skills/grill-the-gardener/SKILL.md) + the
   [architecture](../../architecture/README.md) organ. Ambiguity ends the interview only by
   becoming a ring (SEED.md §5).
3. **Propose** — target architecture, migration plan, workflows, responsibilities; **humans review
   and approve**. Instrument: the assessment→proposal composition, proven end-to-end in assessment
   0001 (findings converted to the four products, the un-elicited architecture left to a grill
   agenda). This is an owner/Gardener gate before any mutation.
4. **Graft** — install the map, the plan structure, and the first lints; **no behavior changes
   yet**. Instrument: the release CLI's `graft` verb over
   [.seed/lib/graft.ts](../../../.seed/lib/graft.ts) ([ring 0028](../../rings/0028-installer-uninstall.md)),
   proven hermetically in the recursive test — a purely-additive, refuse-to-clobber beachhead whose
   [uninstall](../../../.seed/checks/release.ts) is a byte-exact inverse. This is the **first
   mutation of a real host**, gated on step 3's approval.
5. **Metabolize** — two agent-driven tracks run in parallel, indefinitely — **refactor-toward-
   architecture** and **feature work** — with fitness trends arbitrating pace and priority.
   Instruments: the metabolism (SEED.md §3) + [parallel-worktrees](../../../skills/parallel-worktrees/SKILL.md)
   + the fitness trend. [E-014](../entropy-ledger.md) (no resumable, context-scoped work-unit
   format) compounds here — the indefinite two-track run across sessions and worktrees is exactly
   where it bites.
6. **Independence** — the host carries its own seed, its lineage recorded, its feedback channel to
   the mother **live** (LAW-11). Instruments: the shared [lineage schema](../../../.seed/lib/lineage.ts)
   + the [feedback](../../../skills/feedback/SKILL.md) skill. The feedback composer stops at
   composing (compose-not-commit, [ring 0021](../../rings/0021-feedback-composes-upstream-issue.md));
   for a real host the upstream channel must be genuinely operable — the mother able to receive what
   a descendant sends.

This is the genome's Stage 4 protocol, not a frozen build order: per-host, per-step build decisions
are cut as rings when each is designed (the plan 0003 / plan 0005 rhythm). The **exit criterion
governs completion, per host** (SEED.md §4): *the host's fitness trend is positive over a sustained
window, and its owners ship features through the agent workflow without the seed being special.*
Because Pollination is ongoing, "the plan completes" is not a stage end — it is the first host
reaching its exit while the mother continues to pollinate.

## Decision log

- **This plan is a proposal until approved.** Per SEED.md §4 a transition is proposed as a plan,
  approved by the Gardener, and recorded as a ring. No Stage 4 scope step starts and no transition
  ring is cut before approval — the [ring 0009](../../rings/0009-stage-1-transition-approved.md) /
  [0014](../../rings/0014-stage-2-transition-approved.md) /
  [0025](../../rings/0025-stage-3-transition-approved.md) precedent.
- **The first external host is the Gardener's selection at Stage 4 entry — named on approval, not
  presumed here.** [Ring 0006](../../rings/0006-solo-until-flowering.md) decided the seed grows solo
  until the Stage 3 exit criterion is met, and reserved the first-host choice for the Gardener at
  Stage 4 entry (its `Revisit-when: Stage 3 exit criterion met` is now triggered). This proposal
  therefore *routes* the host decision to the approval gate rather than baking one in — the E-004
  precedent of carrying a Gardener input as a named item, not a silent assumption (grounded-or-ask).
  [Mottainapp](../../assessments/0001-mottainapp.md) is the one repository already Scouted read-only
  (assessment 0001) and so the natural candidate, but a read-only Scout is not a commitment to graft:
  the selection is the Gardener's.
- **Method, not dogma (SEED.md §4).** The host's target architecture is *elicited* (step 2), never
  imposed; the proposal (step 3) is a starting point the owners review, not a verdict on them (the
  assessment organ's stated contract). Steps 1–3 are proven read-only in assessment 0001; the
  **mutating** steps 4–6 begin only after the owners approve step 3 — the graft is refuse-to-clobber
  and reversible by construction ([ring 0028](../../rings/0028-installer-uninstall.md)), so "propose,
  never force" holds mechanically.
- **Pollination ends "solo" — [ring 0006](../../rings/0006-solo-until-flowering.md) is revisited by
  this transition.** Taking a first external host means the seed is no longer solo, which reopens
  the branch-protection residuals accepted "while solo": [E-005](../entropy-ledger.md)'s force-push
  evasion of the ring-append-only gate and [E-008](../entropy-ledger.md)'s automerge-scope residual,
  both of which the ledger slated to harden "at Flowering with branch protection." Flowering closed
  without that hardening; the transition is the honest moment to either land branch protection or
  re-price — named here as a carried risk, not a silent deferral.
- **Named risks this plan carries (the plan 0005 gating-prerequisites shape).**
  [E-012](../entropy-ledger.md): the Scout instrument must count `git ls-files`, not the on-disk
  walk, before it measures a real host's map (owed before step 1). [E-014](../entropy-ledger.md):
  the indefinite two-track metabolize (step 5) across sessions and worktrees is where the missing
  resumable work-unit format compounds. The **live feedback channel** (step 6, LAW-11): the mother
  must be able to receive a descendant's upstream issue, not only compose it. None of these gate the
  *transition decision*; each is priced and named for its step.
- **Propagation is re-metabolization, not `npm update`** (carried forward from
  [plan 0005](../completed/0005-flowering.md)). A host adopts the method as *sensed input* to its own metabolism —
  its own plan / ring / fitness — so an adopted change becomes the host's own ring (its
  `plan-traceability` gate refuses ringless changes), and decline is a first-class product (a
  divergence ring). This is why the graft is additive and the feedback composes-never-posts.
- **Tier ([ring 0010](../../rings/0010-model-effort-selection.md)).** This proposal is
  Gardener-judgment work — drafted at mid tier; the transition decision, and the first-host
  selection, are the Gardener's. Once live, each per-host step runs under its own verification
  (cheapest tier that clears the harness), with novel design (the per-host migration plan, the
  two-track fitness arbitration) and any host-mutating surface (the graft against a real repo) at
  the top tier or a top-tier review pass.

## Progress log

- **2026-07-17** — Drafted at the close of [plan 0005](../completed/0005-flowering.md)'s Stage 3 work: the exit
  criterion met (the recursive self-upgrade test, [ring 0029](../../rings/0029-recursive-self-upgrade-test.md);
  proof [docs/fitness/recursive-upgrade.md](../../fitness/recursive-upgrade.md)) and both gating
  prerequisites paid ([E-013](../entropy-ledger.md) / [ring 0030](../../rings/0030-inferential-control-judge.md);
  [E-004](../entropy-ledger.md) / [ring 0031](../../rings/0031-name-cleared-codename-retained.md)).
  Proposed for Gardener approval of the Stage 3 → 4 (Flowering → Pollination) transition (SEED.md
  §4). The single input this proposal routes to the Gardener is **naming the first external host**
  ([ring 0006](../../rings/0006-solo-until-flowering.md)). Awaiting approval; on approval a transition
  ring is cut (the [ring 0025](../../rings/0025-stage-3-transition-approved.md) pattern), Stage 4 is
  entered, this plan becomes governing, [plan 0005](../completed/0005-flowering.md) completes and moves to
  `completed/`, and AGENTS.md `Current state` + `fitness.ts` (`CURRENT_STAGE`) flip to Stage 4.
  `npm run check` + `npm test` green; `drift_count` 0.
- **2026-07-17** — **Transition approved and enacted**
  ([ring 0032](../../rings/0032-stage-4-transition-first-host-dither.md)): the Gardener approved the
  Stage 3 → 4 transition on this plan as proposed and designated the first external host — **dither**.
  Enacted the [ring 0025](../../rings/0025-stage-3-transition-approved.md) pattern — transition ring cut,
  Stage 4 entered, this plan now governing, [plan 0005](../completed/0005-flowering.md) completed and moved
  to `completed/`, and AGENTS.md `Current state` + `fitness.ts` (`CURRENT_STAGE`) bumped to Stage 4.
  [Ring 0006](../../rings/0006-solo-until-flowering.md) (solo-until-Flowering) is resolved: the seed is no
  longer solo.
- **2026-07-17** — **Scout pre-flight landed — [E-012](../entropy-ledger.md) paid** (step 1, owed before the
  instrument is pointed at dither in earnest). The [repo-fitness](../../../skills/repo-fitness/SKILL.md)
  metric engine ([.seed/lib/fitness-metrics.ts](../../../.seed/lib/fitness-metrics.ts)) now counts the
  **committed repository** for a git target (tracked files via `git ls-files`), not the on-disk working
  tree, so untracked build output and stray `.claude/worktrees/` snapshots no longer inflate
  `map_reachability`'s denominator or `drift_count`; a non-git target — or a git repo with no commit yet —
  degrades to the on-disk walk (so the recursive-upgrade proof's freshly-`git init`'d target still measures
  its uncommitted graft). Scoped to the metrics engine, not the seed's own working-tree gates; the seed's
  tracked set equals its on-disk set, so its self-fitness is unchanged. A new self-test pins the contrast
  (untracked → not counted; committed → counted). `npm run check` (13 checks) + `npm test` (232 cases)
  green; `drift_count` 0. The Scout of dither can now proceed on tracked-file evidence.
- **2026-07-17** — **Scout dither delivered — step 1 complete**
  ([assessment 0002 — dither](../../assessments/0002-dither.md)). Pointed the
  [repo-fitness](../../../skills/repo-fitness/SKILL.md) Scout at the first external host read-only
  (334 tracked files, 49 commits) now that the E-012 pre-flight counts the committed repository. Baseline:
  `map_reachability` null, `enforcement_ratio` null, `drift_count` **0**, `plan_traceability` null,
  `escalation_rate` null, `ledger_trend` null. The read-only contract held — dither's HEAD (`93d02cd`),
  tree (`d2f2b41`), and lone pre-existing untracked spike were byte-identical before and after. Unlike
  [mottainapp](../../assessments/0001-mottainapp.md), dither is well-tended: a `CLAUDE.md` map +
  `CONTEXT-MAP.md` + a one-page `architecture.md` (from its own 2026-07-02 grilling session) + eight ADRs
  + CI enforcement + zero drift — so its nulls are mostly the seed's anatomy under other names, and the
  four findings **formalize what dither already does** (a canonical reachable map, principles naming
  `ci.yml`, a commit→decision gate over its ADRs/issues, an entropy ledger) rather than impose structure
  (method, not dogma). The Scout sensed one new unit of entropy about the seed's own instrument —
  `map_reachability` recognizes only `AGENTS.md`, so dither's `CLAUDE.md`-rooted map reads as a false
  null — priced as [E-016](../entropy-ledger.md) (the E-012 pattern; the drift markdown-link blind spot
  is the already-priced [E-009](../entropy-ledger.md)). `npm run check` (13 checks) + `npm test` (232
  cases) green; `drift_count` 0; dither byte-identical after the run (HEAD/tree/status unchanged). The
  mutating steps stay gated on the owner's approval of the Propose step (step 3); step 2 (Grill) is next.
- **2026-07-18** — **Grill dither delivered — step 2 complete** ([ring 0033](../../rings/0033-dither-grill-outcomes.md);
  [docs/architecture/dither.md](../../architecture/dither.md)). dither's *product* architecture was already elicited
  (its own 2026-07-02 grilling session → `architecture.md` + nine ADRs), so the Grill (SEED.md §4 step 2) resolved the
  four open *seed-organ* decisions the Scout left to the owner ([assessment 0002](../../assessments/0002-dither.md)
  Grill agenda): canonical map = root `CLAUDE.md` (the seed teaches `map_reachability` the filename, paying
  [E-016](../entropy-ledger.md), not imposing `AGENTS.md`); authoritative record = the nine in-repo ADRs with a
  commit→ADR citation gate; context-doc coverage stays lazy (the dead-link gate covers referenced ones); the seed's
  skills sit in a separate path with the vendored `.agents/skills/` pinned and excluded from seed gates. Distilled to
  the one-page [architecture doc](../../architecture/dither.md) — Shape / Rules / Ownership, each rule naming the graft
  lint it seeds — validated by `validate-architecture`. During the grill an external graph aid (graphify) was run
  read-only over a `git archive` snapshot of dither as the [E-017](../entropy-ledger.md)/[E-018](../entropy-ledger.md)
  evidence probe (approach A): the full code+markdown structural graph cost **0 LLM tokens**, and its god-nodes +
  ADR→code clusters sharpened this grill's agenda — confirming E-018's finding that the free external tool already
  delivers host orientation, so no native `query` organ is built yet (LAW-7). dither left byte-identical (snapshot
  only). The mutating steps stay gated on the owner's approval of the Propose step (step 3); **step 3 (Propose) is
  next.** `npm run check` + `npm test` green.

## Next actions

The Stage 3 → 4 transition is approved and enacted (ring 0032), dither is the first external host,
the Scout pre-flight ([E-012](../entropy-ledger.md)) has landed, and **step 1 (Scout) is delivered**
([assessment 0002 — dither](../../assessments/0002-dither.md)). The live work is the next genome step:

1. **Scout dither** (step 1) — **done.** The read-only
   [repo-fitness](../../../skills/repo-fitness/SKILL.md) baseline is delivered as
   [assessment 0002](../../assessments/0002-dither.md) (byte-identical read-only run confirmed): a
   well-tended host whose nulls are mostly the seed's anatomy under other names, four findings that
   formalize rather than impose, one new instrument-entropy unit priced ([E-016](../entropy-ledger.md)).
   The Scout modified nothing (SEED.md §4).
2. **Grill dither's owners** (step 2) — **done** ([ring 0033](../../rings/0033-dither-grill-outcomes.md);
   [docs/architecture/dither.md](../../architecture/dither.md)). dither's product architecture was already
   elicited by its own 2026-07-02 grill (`architecture.md` + nine ADRs), so this Grill
   ([grill-the-gardener](../../../skills/grill-the-gardener/SKILL.md) + the
   [architecture](../../architecture/README.md) organ) resolved the four open seed-organ decisions the
   Scout left to the owner ([assessment 0002](../../assessments/0002-dither.md) Grill agenda) — canonical
   map = root `CLAUDE.md` (teach `map_reachability`, pay [E-016](../entropy-ledger.md)); ADRs authoritative
   with a commit→ADR gate; lazy context coverage; seed skills separate from the pinned vendored
   `.agents/skills/` — each distilled into a Rule naming the graft lint it seeds. Ambiguity ended only by
   becoming a ring (SEED.md §5).
3. **Propose** (step 3) — **live.** Convert the Scout findings and the grilled architecture into the four products
   (target architecture, migration plan, workflows, responsibilities); **dither's owners review and
   approve**. This is the owner gate before any mutation — the mutating steps (Graft onward) do not begin
   until it is approved. Per-step build decisions are cut as rings when designed.
