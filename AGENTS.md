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
  Metabolize → Independence.** **The live work is step 4 — Graft:** Scout
  ([assessment 0002](docs/assessments/0002-dither.md)), Grill
  ([ring 0033](docs/rings/0033-dither-grill-outcomes.md)), and Propose
  ([plan 0007](docs/plans/active/0007-dither-graft.md), approved
  [ring 0034](docs/rings/0034-dither-graft-approved.md)) are done; **all four graft items have landed on
  dither, completing the Propose→Graft** — the map reachability + dead-link gate
  ([ring 0037](docs/rings/0037-dither-map-gate-graft.md): the first mutation of a real external host,
  hosted CI green), the commit→ADR traceability gate ([ring 0038](docs/rings/0038-dither-adr-gate-graft.md):
  hosted CI green), the principles + `enforcement_ratio` organ
  ([ring 0039](docs/rings/0039-dither-principles-gate-graft.md)), and the seeded entropy ledger
  ([ring 0040](docs/rings/0040-dither-ledger-graft.md): `ledger_trend` null → +8) — all four pushed to
  dither's `main`, hosted CI green (items 3–4 confirmed by run
  [29707599339](https://github.com/fliip92/dither/actions/runs/29707599339), the Ledger gate live beside
  the map, ADR, and principles gates). **The next SEED.md §4 step is Metabolize (step 5)**, whose first
  refactor candidate (the app→package import-boundary test) is already priced in dither's new ledger.
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
