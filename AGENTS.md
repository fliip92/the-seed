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

**This section states state, not history.** What stage the seed is in, what the live work is, and
what a fresh agent does first — nothing else. How it got here is recorded three times over already:
the active plan's `Progress log`, the [entropy ledger](docs/plans/entropy-ledger.md)'s Paid notes,
and [docs/rings/](docs/rings/README.md). Append there, not here — a line budget enforces it
([validate-map-budget](.seed/checks/validate-map-budget.ts), ring
[0055](docs/rings/0055-the-map-states-state-not-history.md), paying
[E-027](docs/plans/entropy-ledger.md)).

- **Stage:** 4 — Pollination, entered 2026-07-17 (ring
  [0032](docs/rings/0032-stage-4-transition-first-host-dither.md)). It is **terminal and ongoing**
  (SEED.md §0: a repository is never "done") and judged per host. Stages 0–3 are complete, each with
  its exit criterion evidenced in its own plan — [0001](docs/plans/completed/0001-germination.md),
  [0002](docs/plans/completed/0002-rooting.md), [0003](docs/plans/completed/0003-growth.md),
  [0005](docs/plans/completed/0005-flowering.md). The repository is public:
  [github.com/fliip92/the-seed](https://github.com/fliip92/the-seed).
- **Correct first action for a fresh agent right now:** open
  [plan 0009 — dither Metabolize](docs/plans/active/0009-dither-metabolize.md) and continue from its
  `Next actions`. It runs **step 5 (Metabolize)** of the genome's six-step per-host protocol (SEED.md
  §4 — Scout → Grill → Propose → Graft → Metabolize → Independence) on the seed's first external
  host, **dither**; the Stage-4 plan above it is
  [plan 0006](docs/plans/active/0006-pollination.md). With nothing active, § Start here point 3
  governs.
- **Where the host stands.** Steps 1–4 are done — dither's `main` carries all four graft organs,
  hosted CI green ([plan 0007](docs/plans/completed/0007-dither-graft.md)). The structural refactor
  queue is **drained**, so sensing new entropy is that track's default; the per-host **exit criterion
  is half-met** — the fitness-trend half holds, the *owner-ships-features* half is untested — so
  **step 6 (Independence) waits on the feature track, not on more sensing**. The measured evidence is
  the pollination proof [docs/fitness/pollination-dither.md](docs/fitness/pollination-dither.md);
  the elicited target is [docs/architecture/dither.md](docs/architecture/dither.md).
- **What is owed, and what enforces it.** Priced debt lives in the
  [entropy ledger](docs/plans/entropy-ledger.md) — its Open section is the queue § Start here point 3
  works from, and an entry whose conversion path names the Gardener waits for a ruling. Every gate,
  instrument, and organ that must stay green is listed with what it enforces in
  [.seed/README.md](.seed/README.md); the protocols a change must satisfy are § Protocols below.

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
- **Changing portable machinery (`.seed/`, `skills/`)?** Declare the release intent in
  [pollen/pending.md](pollen/pending.md) **in the same commit** — one bullet in that file's declared
  grammar, citing a decision record your commit message names. A release is
  composed from declared intent (ring [0026](docs/rings/0026-pollen-boundary-versioning-lineage.md)),
  and the [pollen-intent gate](.seed/checks/pollen-intent.ts) fails CI on any portable-touching commit
  since the last cut that no intent covers ([E-023](docs/plans/entropy-ledger.md), ring
  [0052](docs/rings/0052-portable-changes-declare-their-intent.md)).
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
