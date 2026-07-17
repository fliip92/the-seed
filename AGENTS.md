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

- **Stage:** 3 — Flowering, entered 2026-07-15 (ring
  [0025](docs/rings/0025-stage-3-transition-approved.md)). Stage 2 (Growth) completed with its
  exit criterion evidenced in [plan 0003](docs/plans/completed/0003-growth.md) — the skill garden
  grown and a foreign repo assessed read-only on evidence (assessment 0001); Stage 1 (Rooting) in
  [plan 0002](docs/plans/completed/0002-rooting.md), Stage 0 in
  [plan 0001](docs/plans/completed/0001-germination.md). The repository is public:
  [github.com/fliip92/the-seed](https://github.com/fliip92/the-seed).
- **Correct first action for a fresh agent right now:** Stage 3 (Flowering) is underway
  (transition approved 2026-07-15, ring
  [0025](docs/rings/0025-stage-3-transition-approved.md)). The governing plan is
  [plan 0005](docs/plans/active/0005-flowering.md) — continue from its `Next actions`: **scope item 4
  (the recursive self-upgrade test — the seed is its own first host) landed 2026-07-16 in
  [ring 0029](docs/rings/0029-recursive-self-upgrade-test.md), and the Stage 3 exit criterion is met**
  (proof: [docs/fitness/recursive-upgrade.md](docs/fitness/recursive-upgrade.md)); **the live work is now
  clearing the Stage 3 → 4 gating prerequisites [E-004](docs/plans/entropy-ledger.md) /
  [E-013](docs/plans/entropy-ledger.md), then proposing the transition**. Scope item 3
  (the installer + the mandated uninstall path) landed 2026-07-15 in
  [ring 0028](docs/rings/0028-installer-uninstall.md): the graft model
  ([.seed/lib/graft.ts](.seed/lib/graft.ts)) — the running seed copies its portable method + sovereign
  genome verbatim and emits the local scaffold (map, plans, rings, lineage, plumbing) as parameterized
  templates, purely additive (refuse-to-clobber) so `uninstall` reverses byte-identical — plus the
  release CLI's now-live `graft` / `uninstall` verbs, pinned by 3 self-tests in the worktrees hermetic
  round-trip shape (works + teeth + byte-identical, refuse-to-clobber, `--dry-run` side-effect-free).
  Scope item 2 (the owned
  `.seed/` release/graft CLI) landed 2026-07-15 in [ring 0027](docs/rings/0027-release-graft-cli.md),
  **paying off [E-015](docs/plans/entropy-ledger.md)**: the release model
  ([.seed/lib/release.ts](.seed/lib/release.ts)) and CLI
  ([.seed/checks/release.ts](.seed/checks/release.ts), `npm run release` — verbs
  `sense`/`cut-release`/`verify`/`feedback`, with `graft`/`uninstall` landing in scope item 3), the
  ring-0020 determinism split (pure byte-exact
  [pending-release notes](docs/generated/pending-release.md); the append-only dated
  [release history](pollen/releases/README.md) with its
  [gate](.seed/checks/release-append-only.ts); the side-effecting `cut-release`, dry-run-verified),
  the version-bump-from-max-declared-impact and the migration-required-for-major tooth, all pinned by
  [validate-release](.seed/checks/validate-release.ts) + the self-tests. The pollen line rests at
  **v0.1.0** — cut 2026-07-16 by the recursive self-upgrade test
  ([ring 0029](docs/rings/0029-recursive-self-upgrade-test.md)), composing the boundary (ring 0026), the
  release tool (ring 0027), and the installer (ring 0028) as its first release
  ([pollen/releases/v0.1.0.md](pollen/releases/v0.1.0.md)); [pending](pollen/pending.md) is now empty. Scope item 1 (pollen boundary + versioning + lineage) landed 2026-07-15 in the founding
  [ring 0026](docs/rings/0026-pollen-boundary-versioning-lineage.md), which decided E-015's three
  forks — the semver + migration model, the three
  orthogonal granularity axes (release = pollen version, learning = ring, artifact = skill), and the
  three ownership tiers (sovereign genome / portable method / local history) — and shipped the
  [pollen manifest](.seed/lib/pollen.ts) (the boundary + the two version lines) with
  [validate-pollen](.seed/checks/validate-pollen.ts). Stage 3 packages the portable subset — skills, scaffolding templates, protocols, an
  installer, and a mandated uninstall path — as versioned [`pollen/`](pollen/README.md), then runs
  the recursive test (**the seed is its own first host**: upgrade the seed using its own pollen),
  proving the transplant by installing pollen into a sacrificial test repo with fitness measured
  before and after — the delta is the exit proof (SEED.md §4). Two gating prerequisites clear
  *within* this stage before pollen ships: [E-004](docs/plans/entropy-ledger.md) (the "Seed" name
  is an uncleared codename — a trademark search is owed) and
  [E-013](docs/plans/entropy-ledger.md) (the seed has only computational controls; inferential
  quality rises sharply at Flowering). Stage 2 grew the skill garden — **grill-the-gardener** (ring
  [0015](docs/rings/0015-grill-the-gardener-architecture-doc.md)), **repo-fitness** (ring
  [0016](docs/rings/0016-repo-fitness-generalizes-the-metric-engine.md)), **postmortem** (ring
  [0017](docs/rings/0017-postmortem-three-artifacts-linked.md)), **parallel-worktrees** (ring
  [0019](docs/rings/0019-parallel-worktrees-host-agnostic-lifecycle.md)), **onboard-human** (a
  briefing generated from the map — [docs/generated/onboarding.md](docs/generated/onboarding.md) —
  ring [0020](docs/rings/0020-onboard-human-generated-briefing.md)), **feedback** (ring
  [0021](docs/rings/0021-feedback-composes-upstream-issue.md)) — and its exit criterion was
  evidenced by [assessment 0001 — mottainapp](docs/assessments/0001-mottainapp.md), a read-only
  Scout of a 691-file / 792-commit foreign product turned into an evidence-judgeable proposal, the
  target proven byte-identical before and after (ring
  [0022](docs/rings/0022-assessment-organ-exit-criterion.md), the
  [docs/assessments/](docs/assessments/README.md) organ). Before Flowering the Gardener grew one
  more organ: the [intake](skills/intake/SKILL.md) skill and the seed's first principle
  [grounded-or-ask](docs/principles/grounded-or-ask.md), with
  [validate-references](.seed/checks/validate-references.ts) binding every distilled source
  ([docs/references/harness-engineering.md](docs/references/harness-engineering.md)) — landed by
  [plan 0004](docs/plans/completed/0004-intake.md) (rings
  [0023](docs/rings/0023-grounded-or-ask-first-principle.md)/[0024](docs/rings/0024-intake-network-free-metabolizer.md)).
  Each capability shipped its own verification (LAW-6). Stage 1's self-maintenance organs — all
  built and evidenced in [plan 0002](docs/plans/completed/0002-rooting.md) — remain live: the
  self-tests (`npm test`), the traceability gate, the [doc-gardener](skills/doc-gardener/SKILL.md)
  drift detector (`npm run garden`, advisory per ring
  [0011](docs/rings/0011-drift-advisory.md)), fitness v0 (`npm run fitness`) with snapshots
  in [docs/fitness/history/](docs/fitness/history/README.md), and the weekly
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
