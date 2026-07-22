# AGENTS.md — the map

You are an agent working in the Seed. This file is your entry point, every session
(LAW-4: everything meaningful is reachable from here in three hops or fewer).

## Start here

1. **New to this repository?** Read [SEED.md](SEED.md) — the genome — completely, once.
   It is the constitution; this map is the daily entry point.
2. **Returning?** Open the active plan(s) in [docs/plans/active/](docs/plans/active/README.md)
   and continue from the latest `Next actions` section.
3. **Nothing active?** Run the metabolism (SEED.md §3): sense for new entropy and price
   it into the [entropy ledger](docs/plans/entropy-ledger.md), then convert the
   highest-interest entry whose conversion path is not gated on a stage or the Gardener.
   If every entry is gated, sensing new entropy *is* the work.

## Current state

- **Stage:** 4 — Pollination, entered 2026-07-17 (ring
  [0032](docs/rings/0032-stage-4-transition-first-host-dither.md)). Stage 3 (Flowering) completed
  with its exit criterion evidenced in [plan 0005](docs/plans/completed/0005-flowering.md) — the
  portable subset packaged as versioned [`pollen/`](pollen/README.md) (v0.1.0) and the recursive
  self-upgrade test passed (the seed is its own first host; proof
  [docs/fitness/recursive-upgrade.md](docs/fitness/recursive-upgrade.md)). Stage 2 (Growth) in
  [plan 0003](docs/plans/completed/0003-growth.md) — the skill garden grown and a foreign repo
  assessed read-only on evidence (assessment 0001); Stage 1 (Rooting) in
  [plan 0002](docs/plans/completed/0002-rooting.md), Stage 0 in
  [plan 0001](docs/plans/completed/0001-germination.md). The repository is public:
  [github.com/fliip92/the-seed](https://github.com/fliip92/the-seed).
- **Correct first action for a fresh agent right now:** Stage 4 (Pollination) is underway
  (transition approved 2026-07-17, ring
  [0032](docs/rings/0032-stage-4-transition-first-host-dither.md)). The governing plan is
  [plan 0006](docs/plans/active/0006-pollination.md) — continue from its `Next actions`. The seed
  enters its **first external host, dither** (named by the Gardener at Stage 4 entry, ring 0032 —
  which resolves [ring 0006](docs/rings/0006-solo-until-flowering.md): the seed is no longer solo),
  and runs the genome's six-step per-host protocol (SEED.md §4): **Scout → Grill → Propose → Graft →
  Metabolize → Independence.** **Scout, Grill, Propose, and Graft are done:** Scout
  ([assessment 0002](docs/assessments/0002-dither.md)), Grill
  ([ring 0033](docs/rings/0033-dither-grill-outcomes.md)), Propose
  ([plan 0007](docs/plans/completed/0007-dither-graft.md), approved
  [ring 0034](docs/rings/0034-dither-graft-approved.md)), and the Graft — **all four graft organs have
  landed on dither's `main`, hosted CI green**: the map reachability + dead-link gate
  ([ring 0037](docs/rings/0037-dither-map-gate-graft.md): the first mutation of a real external host),
  the commit→ADR traceability gate ([ring 0038](docs/rings/0038-dither-adr-gate-graft.md)), the
  principles + `enforcement_ratio` organ ([ring 0039](docs/rings/0039-dither-principles-gate-graft.md)),
  and the seeded entropy ledger ([ring 0040](docs/rings/0040-dither-ledger-graft.md): `ledger_trend`
  null → +8), each a host-owned runner over the seed's verbatim engine, confirmed by run
  [29707599339](https://github.com/fliip92/dither/actions/runs/29707599339)
  ([plan 0007](docs/plans/completed/0007-dither-graft.md) completed). **The live work is step 5 —
  Metabolize** ([plan 0009](docs/plans/active/0009-dither-metabolize.md)): two agent-driven tracks in
  parallel, indefinitely — refactor-toward-[architecture](docs/architecture/dither.md) + feature work,
  fitness arbitrating pace — until dither's per-host exit criterion is met. The refactor queue digests
  dither's seeded ledger by interest; its first refactor, **E-001** (the app→package import boundary,
  dither.md Rule 5), is **done** ([ring 0041](docs/rings/0041-dither-import-boundary-gate.md); dither
  `607bc64`, pushed to `main`): its read-only pre-flight found the elicited package graph
  itself drifted (`traits`/`matrix` were written as building on `droid-file`; the code is the reverse),
  the Gardener chose *fix docs to code*, and the corrected graph is now enforced by an owned R1/R2/R3
  import-boundary gate over the verbatim engine — green + teeth 9/9, `enforcement_ratio` 7/7, E-001
  Open→Paid (`ledger_trend` +8 → +7, dither's first digested debt). Its second refactor, **E-002** (the
  gates' own self-test, [ring 0042](docs/rings/0042-dither-gates-self-test.md)), is **done** (dither
  `9f41427`, pushed; its hosted CI caught a real `.git`-copy race in the self-test, fixed in `edec7fd`,
  now green): a scoped port of the seed's self-test.ts binds each of the five
  gates' violation classes into a committed CI harness (green + 15/15; the test-of-the-test by neutering
  map-gate turns its tooth red) — **no eighth principle**, the self-test is the gates' LAW-6 verification,
  not a product norm (`enforcement_ratio` held 7/7, `ledger_trend` +7 → +6, `map_reachability` 11.9%). Its
  third refactor, **E-007** (the map-reachability sweep,
  [ring 0043](docs/rings/0043-map-reachability-scoped-to-knowledge-artifacts.md)), is **done** (dither
  `c058fbc`, pushed, hosted CI green): the pre-flight found `map_reachability` structurally source-floored
  on a product repo (283 of dither's 386 files are source) and the plan's named targets already reachable,
  so the Gardener had the metric rescoped to knowledge artifacts (docs) — the GATE untouched, the seed
  still enforcing total reachability — then dither's own stranded docs linked; the seed reads 100% (94/94
  docs) unchanged, dither 11.9% → 48.2%. Its fourth refactor, **E-006** (the two stale spike refs,
  [ring 0044](docs/rings/0044-dither-e006-stale-spike-refs-gardened.md)), is **done** (dither `0f078ef`,
  pushed, hosted CI green) — the first refactor that adds **no instrument**: a gardening content-fix whose
  LAW-6 verification is the standing drift scan (`drift_count` 2 → 0, `ledger_trend` +5 → +4, no new
  principle). With all four priced structural entries (E-001/E-002/E-007/E-006) digested, the structural
  refactor queue is **drained** — the feature track is owner-paced, and sensing new entropy is the
  refactor track's default (AGENTS.md §"Nothing active?"). The **first sensing pass**
  ([ring 0045](docs/rings/0045-dither-sensing-pass-theme-layout.md); dither `eeb5fdd`, pushed, CI green)
  found dither substantially clean and converted one genuine finding — **E-009**, `@dither/theme` absent
  from architecture.md's Repo layout (a residual of the E-001 correction), added so the layout matches the
  committed package set; branch protection and graphify were checked and deliberately **not** priced (the
  seed's own main is likewise unprotected — inherited posture, not a defect). A **second sensing pass**
  ([ring 0046](docs/rings/0046-dither-map-completeness-gate.md); dither `1274d48`, local) found E-009 was
  one instance of a class — `theme`/`matrix-playground` were also missing from README.md and
  CONTEXT-MAP.md — which tripped E-009's pre-registered Revisit trigger; the Gardener built the invariant:
  a **sixth dither gate**, `map-completeness.ts`, asserting every `packages/*`/`apps/*` workspace is listed
  in each of three layout maps, with the eighth principle `maps-are-complete` (`enforcement_ratio` 8/8) and
  self-test teeth (18/18 + a neuter test-of-the-test). Six gates + eight principles now stand on dither.
  Every step's instrument was built across
  Stages 2–3 (Scout / Propose proven read-only in
  [assessment 0001](docs/assessments/0001-mottainapp.md), Graft hermetically in the recursive test);
  the **mutating** steps (Graft onward) gate on the host owners' review + approval of the Propose
  step, and the per-host exit criterion governs — a positive fitness trend over a sustained window
  with owners shipping through the agent workflow without the seed being special. Pollination is
  terminal and ongoing (SEED.md §0: a repository is never "done").
- **Stage 3 (Flowering), completed 2026-07-17** — packaged the portable subset as versioned
  [`pollen/`](pollen/README.md) and proved the transplant on itself. The boundary + two version lines
  + lineage (founding [ring 0026](docs/rings/0026-pollen-boundary-versioning-lineage.md)), the owned
  `.seed/` release / graft CLI ([ring 0027](docs/rings/0027-release-graft-cli.md), paying off
  [E-015](docs/plans/entropy-ledger.md); [.seed/checks/release.ts](.seed/checks/release.ts), `npm run
  release`), and the installer + mandated uninstall path
  ([ring 0028](docs/rings/0028-installer-uninstall.md); [.seed/lib/graft.ts](.seed/lib/graft.ts))
  composed the first pollen release **v0.1.0**
  ([pollen/releases/v0.1.0.md](pollen/releases/v0.1.0.md)); the recursive self-upgrade test
  ([ring 0029](docs/rings/0029-recursive-self-upgrade-test.md)) grafted it into a sacrificial repo
  with fitness measured before/after and uninstalled byte-identical — the exit proof
  ([docs/fitness/recursive-upgrade.md](docs/fitness/recursive-upgrade.md)). Both Stage 3 → 4 gating
  prerequisites paid: the seed's first inferential control, the [judge](skills/judge/SKILL.md)
  ([ring 0030](docs/rings/0030-inferential-control-judge.md), [E-013](docs/plans/entropy-ledger.md)),
  and the "Seed" name retained as a non-exclusive descriptive codename
  ([ring 0031](docs/rings/0031-name-cleared-codename-retained.md),
  [E-004](docs/plans/entropy-ledger.md)).
- **Live organs (Stages 1–2), each shipping its own verification (LAW-6):** Stage 2's skill garden —
  **grill-the-gardener** (ring [0015](docs/rings/0015-grill-the-gardener-architecture-doc.md)),
  **repo-fitness** (ring [0016](docs/rings/0016-repo-fitness-generalizes-the-metric-engine.md)),
  **postmortem** (ring [0017](docs/rings/0017-postmortem-three-artifacts-linked.md)),
  **parallel-worktrees** (ring [0019](docs/rings/0019-parallel-worktrees-host-agnostic-lifecycle.md)),
  **onboard-human** (a briefing generated from the map —
  [docs/generated/onboarding.md](docs/generated/onboarding.md) — ring
  [0020](docs/rings/0020-onboard-human-generated-briefing.md)), **feedback** (ring
  [0021](docs/rings/0021-feedback-composes-upstream-issue.md)) — evidenced by
  [assessment 0001 — mottainapp](docs/assessments/0001-mottainapp.md) (ring
  [0022](docs/rings/0022-assessment-organ-exit-criterion.md), the
  [docs/assessments/](docs/assessments/README.md) organ), plus **intake** and the seed's first
  principle [grounded-or-ask](docs/principles/grounded-or-ask.md)
  ([plan 0004](docs/plans/completed/0004-intake.md), rings
  [0023](docs/rings/0023-grounded-or-ask-first-principle.md)/[0024](docs/rings/0024-intake-network-free-metabolizer.md);
  [validate-references](.seed/checks/validate-references.ts) binding
  [docs/references/harness-engineering.md](docs/references/harness-engineering.md)). Stage 1's
  self-maintenance organs — all in [plan 0002](docs/plans/completed/0002-rooting.md) — remain live:
  the self-tests (`npm test`), the traceability gate, the
  [doc-gardener](skills/doc-gardener/SKILL.md) drift detector (`npm run garden`, advisory per ring
  [0011](docs/rings/0011-drift-advisory.md)), fitness v0 (`npm run fitness`) with snapshots in
  [docs/fitness/history/](docs/fitness/history/README.md), and the weekly
  [gardening-cadence](.github/workflows/gardening-cadence.yml) workflow (ring
  [0012](docs/rings/0012-cadence-automation-mechanism.md)).

## Territory

| Path | What it is | Index |
|---|---|---|
| [SEED.md](SEED.md) | The genome: laws, anatomy, stages, metabolism | — |
| [README.md](README.md) | Human-facing front door (public repo, ring 0004); license: [MIT](LICENSE) | — |
| [docs/rings/](docs/rings/README.md) | Decision log, append-only, numbered | [README](docs/rings/README.md) |
| [docs/plans/](docs/plans/README.md) | Execution plans (active + completed) and the entropy ledger | [README](docs/plans/README.md) |
| [docs/principles/](docs/principles/README.md) | Golden principles, each naming its enforcement | [README](docs/principles/README.md) |
| [docs/architecture/](docs/architecture/README.md) | Elicited target architectures (grill-the-gardener) | [README](docs/architecture/README.md) |
| [docs/postmortems/](docs/postmortems/README.md) | Failures metabolized into fix + invariant + ring (postmortem) | [README](docs/postmortems/README.md) |
| [docs/assessments/](docs/assessments/README.md) | Read-only foreign-repo assessments — the Stage 2 exit criterion's artifact | [README](docs/assessments/README.md) |
| [docs/fitness/](docs/fitness/FITNESS.md) | Fitness metrics, current scores, dated history | [FITNESS.md](docs/fitness/FITNESS.md) |
| [docs/references/](docs/references/README.md) | Distilled external docs, curated for agents | [README](docs/references/README.md) |
| [docs/judgments/](docs/judgments/README.md) | Inferential verdicts — the [judge](skills/judge/SKILL.md)'s LLM-as-judge scores (ring 0030, E-013) | [README](docs/judgments/README.md) |
| [docs/generated/](docs/generated/README.md) | Regenerated-only artifacts — never hand-edit (enforced, ring 0020) | [README](docs/generated/README.md) |
| [skills/](skills/README.md) | The skill garden (`SKILL.md` convention) | [README](skills/README.md) |
| [pollen/](pollen/README.md) | Portable distribution, built at Stage 3 | [README](pollen/README.md) |
| [.seed/](.seed/README.md) | Machinery: checks, CI definitions, fitness scripts | [README](.seed/README.md) |

## Protocols

- **Verify everything:** run `npm run check` (or `node .seed/checks/run-all.ts`) before
  claiming any change is done. Hosted CI runs the same checks, the self-tests, and the
  git-aware gates on every push/PR ([E-002](docs/plans/entropy-ledger.md), paid) — see
  [.seed/README.md](.seed/README.md).
- **Committing:** every commit message names the plan or ring governing it — e.g.
  `Plan 0002 scope item 2: …` or `… (ring 0010)` — enforced in CI by the
  traceability gate (`.seed/checks/plan-traceability.ts`, E-003). Work with no plan or
  ring behind it needs one first.
- **Automerging a mechanical fix:** a change that qualifies for ring
  [0007](docs/rings/0007-gardening-cadence-automerge.md)'s automerge classes may declare it
  with an `Automerge: <class>` trailer in the commit message — `<class>` one of `link`,
  `format`, `typo`, `stale-reference`, `regeneration`, `ledger`. The automerge-scope gate
  (`.seed/checks/automerge-scope.ts`, E-008) then proves the claim: a marked commit must
  touch none of SEED.md, existing ring content, or principle statements (the README indices
  aside) — those need Gardener review. Omit the trailer for Gardener-gated work; an unmarked
  commit is unconstrained by this gate. Mechanism: ring
  [0012](docs/rings/0012-cadence-automation-mechanism.md).
- **Make a decision durable:** cut a ring — format and procedure in
  [docs/rings/README.md](docs/rings/README.md). Never ask the Gardener a question a ring
  already answers (LAW-10): search `docs/rings/` first.
- **Start non-trivial work:** open a plan — format and procedure in
  [docs/plans/README.md](docs/plans/README.md).
- **Found ambiguity you can't resolve now?** Price it into the
  [entropy ledger](docs/plans/entropy-ledger.md). Nothing ambiguous survives contact:
  invariant, ring, priced debt, or deletion.
- **Changing SEED.md?** Only via Gardener-approved PR plus a ring. Everything else you
  may change freely within the laws.

## Laws (summary — full text in SEED.md §1)

LAW-1 seed writes itself · LAW-2 legible + enforceable or it doesn't exist ·
LAW-3 invariants over implementations · LAW-4 the map is the entry point ·
LAW-5 plans are first-class · LAW-6 every capability ships verification ·
LAW-7 boring compounds · LAW-8 entropy is paid continuously · LAW-9 measure to judge ·
LAW-10 escalate scarce judgment, never ask twice · LAW-11 feedback flows upstream
