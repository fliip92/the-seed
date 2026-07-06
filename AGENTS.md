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

- **Stage:** 2 — Growth, entered 2026-07-05 (ring
  [0014](docs/rings/0014-stage-2-transition-approved.md)). Stage 1 (Rooting) completed with
  its exit criterion evidenced in [plan 0002](docs/plans/completed/0002-rooting.md) — the
  seed detects its own drift automatically (doc-gardener + scheduled cadence); Stage 0 in
  [plan 0001](docs/plans/completed/0001-germination.md). The repository is public:
  [github.com/fliip92/the-seed](https://github.com/fliip92/the-seed).
- **Correct first action for a fresh agent right now:** Stage 2 (Growth) is underway
  (transition approved 2026-07-05, ring
  [0014](docs/rings/0014-stage-2-transition-approved.md)). The governing plan is
  [plan 0003](docs/plans/active/0003-growth.md) — continue from its `Next actions`: scope items
  1–3 are planted — **grill-the-gardener** (architecture elicitation, ring
  [0015](docs/rings/0015-grill-the-gardener-architecture-doc.md)), **repo-fitness** (read-only
  assessment of any repository, ring
  [0016](docs/rings/0016-repo-fitness-generalizes-the-metric-engine.md)), and **postmortem**
  (a failure yields fix + invariant + ring, ring
  [0017](docs/rings/0017-postmortem-three-artifacts-linked.md)); the next work is scope item 4,
  **parallel-worktrees**. Stage 2 grows the skill garden (grill-the-gardener, repo-fitness,
  postmortem, parallel-worktrees, onboard-human, feedback), each shipping its own verification
  (LAW-6); the exit criterion is assessing a foreign repository read-only and producing an
  evidence-judgeable proposal (SEED.md §4). Stage 1's self-maintenance organs — all built and evidenced in
  [plan 0002](docs/plans/completed/0002-rooting.md) — remain live: the self-tests
  (`npm test`), the traceability gate, the [doc-gardener](skills/doc-gardener/SKILL.md) drift
  detector (`npm run garden`, advisory per ring
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
| [docs/fitness/](docs/fitness/FITNESS.md) | Fitness metrics, current scores, dated history | [FITNESS.md](docs/fitness/FITNESS.md) |
| [docs/references/](docs/references/README.md) | Distilled external docs, curated for agents | [README](docs/references/README.md) |
| [docs/generated/](docs/generated/README.md) | Regenerated-only artifacts — never hand-edit | [README](docs/generated/README.md) |
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
