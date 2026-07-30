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
- **Every decision is traceable.** A CI gate rejects any commit whose message doesn't reference an existing plan or ring — each one a numbered, append-only entry in the [decision log](docs/rings/README.md).
- **Generated docs can't drift.** The human onboarding briefing ([docs/generated/onboarding.md](docs/generated/onboarding.md)) and the counts on this page ([docs/generated/state.md](docs/generated/state.md)) are regenerated from repo state; a gate fails if the committed bytes differ from a fresh generation. That is why the counts below are links rather than numbers: while they were hand-typed, six of them were false for weeks and nothing looked ([E-026](docs/plans/entropy-ledger.md)).
- **Errors are written for the next agent.** Every lint names the LAW it enforces and states exactly how to comply — the agent reading the failure *is* the context window the message is written to.

The whole apparatus — checks, gates, fitness scripts, CI definitions — lives in [the machinery](.seed/README.md), all of it agent-written, all of it boring and owned ([LAW-7](SEED.md)) rather than imported as a black box.

## What's inside

| Where to look | What it is |
|---|---|
| [SEED.md](SEED.md) | The genome — the eleven laws, the anatomy, the growth stages, the metabolism |
| [AGENTS.md](AGENTS.md) | The map — how any agent orients in a single file |
| [docs/generated/onboarding.md](docs/generated/onboarding.md) | **Humans start here** — a generated briefing: current state → goal |
| [docs/generated/state.md](docs/generated/state.md) | **The numbers** — what has grown, and the latest fitness snapshot, counted from the tree |
| [the decision log](docs/rings/README.md) | Every answered question, permanently retired — how the Seed actually reasons |
| [plans](docs/plans/README.md) | Plans as first-class artifacts, plus the [entropy ledger](docs/plans/entropy-ledger.md) |
| [docs/fitness/FITNESS.md](docs/fitness/FITNESS.md) | Fitness as a *trend*, not a grade — current scores and method |
| [principles](docs/principles/README.md) | Golden principles, each naming its own enforcement — [grounded-or-ask](docs/principles/grounded-or-ask.md) is the first stated |
| [architecture](docs/architecture/README.md) | Elicited target architectures — one page, expressible as lintable rules |
| [postmortems](docs/postmortems/README.md) | Failures metabolized into fix + invariant + ring |
| [pollen](pollen/README.md) | The portable distribution — the method, versioned and graftable |
| [the skill garden](skills/README.md) | The planted skills (below) |

### The skill garden

Stage 2 grew the skills that make the Seed useful beyond itself; Stages 2–3 added more. All of them:

- [doc-gardener](skills/doc-gardener/SKILL.md) — detects doc↔code drift, opens fix-up PRs, sources the `drift_count` metric.
- [grill-the-gardener](skills/grill-the-gardener/SKILL.md) — interviews the Gardener until the target architecture fits one page, is expressible as lintable rules, and has an explicit human/agent ownership split.
- [repo-fitness](skills/repo-fitness/SKILL.md) — a read-only fitness assessment of *any* repository; the Seed's diagnostic instrument for future hosts, proven not to mutate the target.
- [postmortem](skills/postmortem/SKILL.md) — a failure yields three artifacts, never one: the fix, the invariant that prevents recurrence, and the ring recording the decision.
- [parallel-worktrees](skills/parallel-worktrees/SKILL.md) — decompose a large task across isolated git worktrees, one booted instance per worktree, torn down at task end.
- [onboard-human](skills/onboard-human/SKILL.md) — brief a new human from a briefing *generated* from repo state, so it can't drift, verified by a regeneration gate.
- [feedback](skills/feedback/SKILL.md) — compose (never post) a well-formed upstream issue against the mother seed from any repository ([LAW-11](SEED.md)).
- [intake](skills/intake/SKILL.md) — metabolize an external corpus into a distilled, pinned [reference](docs/references/README.md), network-free and provenance-recorded.
- [judge](skills/judge/SKILL.md) — the seed's one *inferential* control: an LLM-as-judge verdict scored against a rubric, carried in a deterministic, staleness-gated [envelope](docs/judgments/README.md).

## Suggestions of use

The Seed is no longer solo: [ring 0032](docs/rings/0032-stage-4-transition-first-host-dither.md) retired the solo-until-Flowering decision and named its **first external host**. The portable distribution now exists — [pollen](pollen/README.md), first cut 2026-07-16 — but grafting it is still a hand-driven, Gardener-gated protocol (SEED.md §4), not an install command. What you *can* do today:

- **Clone it and run the checks** (above) — see the invariants fire against a live repo, and `npm test` prove the testers work.
- **Read the genome**, [SEED.md](SEED.md) — it is short, and it is the whole argument — then the map, [AGENTS.md](AGENTS.md).
- **Follow the reasoning** — the [rings](docs/rings/README.md) are the append-only trail of every decision and why the alternatives were rejected; the [active plans](docs/plans/active/README.md) show what it is building next.
- **Point the read-only instrument at your own project** — `npm run repo-fitness -- <path>` reads a foreign repo without touching it.
- **Star / watch** [github.com/fliip92/the-seed](https://github.com/fliip92/the-seed) and follow it through Pollination.

## Status & roadmap

This is an **experiment**, currently at **Stage 4 — Pollination** (entering other repositories), entered 2026-07-17. The stages are: **0 Germination → 1 Rooting → 2 Growth → 3 Flowering → 4 Pollination.** Stages 0 through 3 are complete, each closed by a plan ([Germination](docs/plans/completed/0001-germination.md), [Rooting](docs/plans/completed/0002-rooting.md), [Growth](docs/plans/completed/0003-growth.md), [Flowering](docs/plans/completed/0005-flowering.md)). Pollination is terminal and ongoing — a repository is never "done".

What it has grown on its own under this discipline — rings, plans, skills, principles, the entropy ledger — is **[counted from the tree, not typed here](docs/generated/state.md)**, alongside the latest fitness snapshot. Of the six fitness metrics the genome defines, five compute in CI today; `escalation_rate` is not yet instrumented (an honest gap, not a hidden zero). Method and trend: [docs/fitness/FITNESS.md](docs/fitness/FITNESS.md).

**Stage 3 (Flowering)** shipped the portable subset as [pollen](pollen/README.md) and proved the transplant on the Seed itself — the first version was cut 2026-07-16, and what the [next release](docs/generated/pending-release.md) composes is generated from the declared intents. **Stage 4 (Pollination)** is the live work: the Seed is inside its first external host, running the genome's six-step per-host protocol — Scout → Grill → Propose → Graft → Metabolize → Independence — with every mutating step gated on the host owner's approval.

## License

[MIT](LICENSE).
