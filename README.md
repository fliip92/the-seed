# The Seed

**A software repository that writes itself, under a constitution enforced by CI. Don't take it on faith — clone it and watch it verify itself in about two minutes.**

Every artifact here — code, docs, lints, CI, decisions — was written by an AI agent (the *Seed*) operating under a written constitution ([SEED.md](SEED.md), the genome), directed by a human (the *Gardener*) who plants intent, sets priorities, exercises taste, and approves at gates. No human has hand-written a line of the machinery. That is not a slogan; it is [LAW-1](SEED.md), and when it is violated the fix is to grow the missing capability, not to reach for the keyboard.

If "self-writing software" reads as hype to you: good. This README is written to be disproven. Clone it, run `npm run check`, and watch the repository enforce its own laws against itself.

## The one idea

> **Convert entropy into structure, structure into leverage, and leverage into propagation.**

*Entropy*, operationally, is any state in which the correct next action is ambiguous to a fresh agent holding nothing but this repository: undocumented decisions, unenforced conventions, drift between docs and code, tribal knowledge, failures nobody owns. Every unit of detected entropy is metabolized into exactly one of four products:

- an **invariant** — a rule enforced mechanically (a lint, a structural test, a CI gate);
- a **ring** — a recorded decision that permanently retires the question ([the decision log](docs/rings/README.md));
- a **priced debt** — a line in the [entropy ledger](docs/plans/entropy-ledger.md) with an interest rate and a conversion path;
- or a **deletion**.

Nothing ambiguous survives contact. Digest or delete.

## See it work

The interesting part isn't the manifesto — it's that the laws are CI-enforced, and you can watch them enforce themselves in about two minutes. Zero dependencies, no build step: the machinery is TypeScript run natively by Node (`>=22.18`).

```bash
git clone https://github.com/fliip92/the-seed
cd the-seed
npm run check   # the invariant checks: the map, anatomy, ring/plan formats, gates
npm test        # the self-tests: seed a violation, prove the right check fires
```

`npm run check` is what a fresh agent — and hosted CI on every push and PR — runs before claiming any change is done. `npm test` is the part worth staring at: it **copies the repo, seeds one violation per check class, and asserts the right check fires with a message that names the law it broke.** A test suite that proves the tests work — "a PR without evidence is a claim, not a change" ([LAW-6](SEED.md)), made literal.

Two more you can run right now:

```bash
npm run fitness                # compute the fitness metrics against this repo
npm run repo-fitness -- <path> # the same engine, read-only, against ANY repo
```

## The receipts

The laws are not vibes. Each is legible to a fresh agent and verifiable by CI — "legible and enforceable, or it doesn't exist" ([LAW-2](SEED.md)). Concretely:

- **The map is CI-enforced.** [AGENTS.md](AGENTS.md) is the agent's daily entry point; a check fails on any dead link or any file more than three hops from it ([LAW-4](SEED.md)). No knowledge hides off the map. Break a link, run `npm run check`, watch it catch you.
- **Every decision is traceable.** A CI gate rejects any commit whose message doesn't reference an existing plan or ring — 21 rings so far, each a numbered, append-only entry in the [decision log](docs/rings/README.md).
- **Generated docs can't drift.** The human onboarding briefing ([docs/generated/onboarding.md](docs/generated/onboarding.md)) is regenerated from repo state; a gate fails if the committed bytes differ from a fresh generation.
- **Errors are written for the next agent.** Every lint names the LAW it enforces and states exactly how to comply — the agent reading the failure *is* the context window the message is written to.

The whole apparatus — checks, gates, fitness scripts, CI definitions — lives in [the machinery](.seed/README.md), all of it agent-written, all of it boring and owned ([LAW-7](SEED.md)) rather than imported as a black box.

## What's inside

| Where to look | What it is |
|---|---|
| [SEED.md](SEED.md) | The genome — the eleven laws, the anatomy, the growth stages, the metabolism |
| [AGENTS.md](AGENTS.md) | The map — how any agent orients in a single file |
| [docs/generated/onboarding.md](docs/generated/onboarding.md) | **Humans start here** — a generated briefing: current state → goal |
| [the decision log](docs/rings/README.md) | Every answered question, permanently retired — how the Seed actually reasons |
| [plans](docs/plans/README.md) | Plans as first-class artifacts, plus the [entropy ledger](docs/plans/entropy-ledger.md) |
| [docs/fitness/FITNESS.md](docs/fitness/FITNESS.md) | Fitness as a *trend*, not a grade — current scores and method |
| [principles](docs/principles/README.md) | The frame for golden principles — each will name its own enforcement; none stated yet |
| [architecture](docs/architecture/README.md) | Elicited target architectures — one page, expressible as lintable rules |
| [postmortems](docs/postmortems/README.md) | Failures metabolized into fix + invariant + ring |
| [the skill garden](skills/README.md) | The seven planted skills (below) |

### The skill garden

Stage 2 grows the skills that make the Seed useful beyond itself. All seven are planted:

- [doc-gardener](skills/doc-gardener/SKILL.md) — detects doc↔code drift, opens fix-up PRs, sources the `drift_count` metric.
- [grill-the-gardener](skills/grill-the-gardener/SKILL.md) — interviews the Gardener until the target architecture fits one page, is expressible as lintable rules, and has an explicit human/agent ownership split.
- [repo-fitness](skills/repo-fitness/SKILL.md) — a read-only fitness assessment of *any* repository; the Seed's diagnostic instrument for future hosts, proven not to mutate the target.
- [postmortem](skills/postmortem/SKILL.md) — a failure yields three artifacts, never one: the fix, the invariant that prevents recurrence, and the ring recording the decision.
- [parallel-worktrees](skills/parallel-worktrees/SKILL.md) — decompose a large task across isolated git worktrees, one booted instance per worktree, torn down at task end.
- [onboard-human](skills/onboard-human/SKILL.md) — brief a new human from a briefing *generated* from repo state, so it can't drift, verified by a regeneration gate.
- [feedback](skills/feedback/SKILL.md) — compose (never post) a well-formed upstream issue against the mother seed from any repository ([LAW-11](SEED.md)).

## Suggestions of use

The Seed is a **solo experiment** right now, by recorded decision (see the [decision log](docs/rings/README.md)). There is no package to install and plant in your own repository yet — the portable "pollen" distribution does not exist until Stage 3. What you *can* do today:

- **Clone it and run the checks** (above) — see the invariants fire against a live repo, and `npm test` prove the testers work.
- **Read the genome**, [SEED.md](SEED.md) — it is short, and it is the whole argument — then the map, [AGENTS.md](AGENTS.md).
- **Follow the reasoning** — the [rings](docs/rings/README.md) are the append-only trail of every decision and why the alternatives were rejected; the [active plan](docs/plans/completed/0003-growth.md) shows what it is building next.
- **Point the read-only instrument at your own project** — `npm run repo-fitness -- <path>` reads a foreign repo without touching it.
- **Star / watch** [github.com/fliip92/the-seed](https://github.com/fliip92/the-seed) and follow it toward Flowering.

## Status & roadmap

This is an **experiment**, currently at **Stage 2 — Growth** (the skill garden), entered 2026-07-05. The stages are: **0 Germination → 1 Rooting → 2 Growth → 3 Flowering → 4 Pollination.** Stages 0 and 1 are complete, each closed by a plan ([Germination](docs/plans/completed/0001-germination.md), [Rooting](docs/plans/completed/0002-rooting.md)).

Grown so far, on its own, under this discipline: **21 rings**, two completed plans plus one active, an entropy ledger, and seven planted skills. Six fitness metrics are defined; five compute in CI today — `map_reachability` 100%, `drift_count` 0, `plan_traceability` 100%, `enforcement_ratio` 100% (vacuous — no principles stated yet), `ledger_trend` tracked; `escalation_rate` is not yet instrumented (an honest gap, not a hidden zero). Straight from [docs/fitness/FITNESS.md](docs/fitness/FITNESS.md).

At **Stage 3 (Flowering)** the portable subset ships as [pollen](pollen/README.md) — the thing you will one day be able to plant in other repositories. That is the roadmap, not a thing available today; [pollen](pollen/README.md) is deliberately empty until then.

## License

[MIT](LICENSE).
