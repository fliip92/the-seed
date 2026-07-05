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

- **Stage:** 1 — Rooting, entered 2026-07-04 (ring
  [0009](docs/rings/0009-stage-1-transition-approved.md)). Stage 0 completed with both
  exit criteria evidenced in [plan 0001](docs/plans/completed/0001-germination.md); the
  repository is public: [github.com/fliip92/the-seed](https://github.com/fliip92/the-seed).
- **Correct first action for a fresh agent right now:** execute
  [plan 0002](docs/plans/active/0002-rooting.md) from its `Next actions` — first up:
  cadence automation (scope item 5). Scope items 1–4 landed 2026-07-04: `npm test`
  verifies the verifiers (E-007 + E-005), every commit to `main` must trace to a plan or
  ring (E-003), the [doc-gardener](skills/doc-gardener/SKILL.md) drift detector
  (`npm run garden`) reports `drift_count` as an advisory signal (ring
  [0011](docs/rings/0011-drift-advisory.md)), and fitness v0
  (`npm run fitness`, `.seed/checks/fitness.ts`) computes five of the six SEED.md §6
  metrics on every CI run, with the first snapshot landed in
  [docs/fitness/history/](docs/fitness/history/README.md).

## Territory

| Path | What it is | Index |
|---|---|---|
| [SEED.md](SEED.md) | The genome: laws, anatomy, stages, metabolism | — |
| [README.md](README.md) | Human-facing front door (public repo, ring 0004); license: [MIT](LICENSE) | — |
| [docs/rings/](docs/rings/README.md) | Decision log, append-only, numbered | [README](docs/rings/README.md) |
| [docs/plans/](docs/plans/README.md) | Execution plans (active + completed) and the entropy ledger | [README](docs/plans/README.md) |
| [docs/principles/](docs/principles/README.md) | Golden principles, each naming its enforcement | [README](docs/principles/README.md) |
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
