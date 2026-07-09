# Harness engineering — foundations

Distilled, seed-relevant field knowledge on **harness engineering**: designing the scaffolding
(context, constraints, verification, control loops) that lets an AI agent operate reliably. The
seed is itself a harness-engineering artifact, so this is knowledge about how things like the
seed are built — and, unusually, several sources describe the seed's own shape from the outside.

- **Source:** [ai-boost/awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering),
  `## Foundations` section, pinned at commit `a28cc8e` — retrieved 2026-07-08.
- **Scope:** the 29-entry Foundations section only — the first slice metabolized. The Design
  Primitives, Evals, and Templates sections remain unmetabolized (each a future pass).
- **Discipline — grounded-or-ask.** Every distilled claim cites the source entry it came from and
  carries that source's own framing, never an embellishment. Lines marked **Seed reading:** are
  this repository's *own* inference connecting a source to the seed — separated explicitly, never
  smuggled in as the source's words. This separation is the point: it is the intake discipline the
  seed is designing, dogfooded on its first corpus.

## What the discipline is

- Harness engineering is three interlocking systems — **context engineering** (curating what the
  agent knows), **architectural constraints** (deterministic linters and structural tests), and
  **entropy management** (periodic agents that repair documentation drift) — with humans *on* the
  loop, designing and maintaining the environment rather than inspecting each output
  ([Fowler](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)).
  - **Seed reading:** this is the seed's architecture named from outside. Architectural
    constraints = the structural gates in `.seed/checks/`; entropy management = the
    [doc-gardener](../../skills/doc-gardener/SKILL.md) + the gardening cadence; context
    engineering = the [AGENTS.md](../../AGENTS.md) map and this `references/` organ; humans-on-the-loop
    = the Gardener (SEED.md §5). Independent corroboration that the seed's shape matches the
    discipline's own synthesis — not proof it is *correct*, but evidence it is not idiosyncratic.
- A harness has **four necessary and sufficient elements**: an agent loop, a tool interface,
  context management, and control mechanisms — a rigorous test separating a harness from a plain
  tool wrapper or a guardrail ([What makes a harness a harness](https://arxiv.org/abs/2606.10106)).
- Reliability is a **harness** problem, not only a model one: harness-only changes moved agents
  20+ ranking positions without swapping the model ([deepset](https://www.deepset.ai/blog/harness-engineering)),
  and harness setup alone can swing benchmarks 5+ points
  ([Anthropic — 2026 Agentic Coding Trends](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf?hsLang=en)).

## Design principles the field converges on

- **Every harness component encodes an assumption that the model can't do something — and those
  assumptions expire.** Design so they can be *removed* as capabilities improve; build on tools
  the model already knows ([Anthropic — Harness Design for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps);
  [Anthropic — 3 Patterns](https://claude.com/blog/harnessing-claudes-intelligence)).
  - **Seed reading:** this is precisely the job of a ring's `Revisit-when` field and the
    "boot lives in host adapters, revisit when the capability lands" pattern
    ([ring 0019](../rings/0019-parallel-worktrees-host-agnostic-lifecycle.md)). The seed already
    encodes assumption-expiry structurally; the field says lean into it harder.
- **Two kinds of control, not interchangeable:** *computational* controls (linters, tests —
  deterministic) and *inferential* controls (LLM-as-judge — probabilistic). A harness self-corrects
  with feedforward guides plus feedback sensors before output reaches a human
  ([Böckeler](https://martinfowler.com/articles/harness-engineering.html)).
  - **Seed reading:** the seed today has *only* computational controls (every check in
    `.seed/checks/`). It has no inferential control at all — which is exactly the missing organ for
    judging whether a digest stayed faithful or a grill elicited completely. Priced as
    [E-013](../plans/entropy-ledger.md).
- **Tool design is agent UX** — naming, schemas, and error surfaces are the interface the agent
  reasons over ([Anthropic — Writing Effective Tools](https://www.anthropic.com/engineering/writing-effective-tools-for-agents)).
  - **Seed reading:** already law here — LAW-2's remediation-carrying lint messages ("write error
    messages for your future self", SEED.md §3) are tool-UX for the agent reading a failure.
- **Filesystem-as-context can beat bespoke tooling:** exposing source, runbooks, and schemas as
  files the agent reads with `read_file`/`grep`/`shell` outperformed 100+ specialized tools in one
  production SRE agent ("Intent Met" 45%→75%) ([Microsoft — Context Engineering, Azure SRE Agent](https://techcommunity.microsoft.com/blog/appsonazureblog/context-engineering-lessons-from-building-azure-sre-agent/4481200/)).

## Portability — the seed's thesis, from the outside

- **Externalize control logic as portable natural-language artifacts** rather than burying it in
  bespoke controller code, so a harness can be studied, versioned, and transferred — addressing the
  root cause of harness fragility ([Natural-Language Agent Harnesses](https://arxiv.org/abs/2603.25723));
  relatedly, shared code artifacts as the basis of agent infrastructure and multi-agent scaling
  ([Code as Agent Harness](https://arxiv.org/abs/2605.18747)).
  - **Seed reading:** the seed's core bet, stated by an outside source — SEED.md, AGENTS.md, and
    the `SKILL.md` files *are* "portable natural-language artifacts," and harness-portability is a
    founding default (SEED.md §8). Directly load-bearing for Flowering, where the portable subset
    becomes versioned `pollen/`.
- **Co-evolution warning:** models trained against a specific harness can overfit to it, so harness
  choices have consequences beyond the immediate task ([LangChain — Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)).

## Long-horizon & multi-session work

- Reusable long-horizon artifacts — Plan.md, Implement.md, Documentation.md — structure multi-step
  tasks ([OpenAI — Run Long-Horizon Tasks with Codex](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex/)).
- **Hibernate-and-wake checkpointing** resumes interrupted multi-hour/multi-day tasks without losing
  context when a single turn exceeds the model's context window ([Meta — Ranking Engineer Agent](https://engineering.fb.com/2026/03/17/developer-tools/ranking-engineer-agent-rea-autonomous-ai-system-accelerating-meta-ads-ranking-innovation/)).
  - **Seed reading:** the seed's plans (LAW-5) are its long-horizon artifact, but they carry a prose
    progress log, not a *resumable, context-scoped work-unit* a fresh session or a parallel worktree
    agent could pick up cold. This is the gap under "implement pieces across sessions without
    derailing"; priced as [E-014](../plans/entropy-ledger.md).

## Evals

- Agent evals are their own discipline: **unit-test-style evals fail for agents** — decide what
  behavior to measure and build an eval harness for it ([Anthropic — Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)).
  - **Seed reading:** the seed measures *structure* (fitness §6, the checks) but never *behavior* —
    it has no eval of whether a skill does its job well. This is the demand side of E-013's
    inferential control.

## Failure & postmortem

- A real harness-level postmortem: Claude Code quality degradation traced to three independent
  harness changes — a reasoning-effort downgrade, a cache bug dropping thinking history, an
  over-aggressive verbosity limit — minor adjustments compounding into visible regressions
  ([Anthropic — April postmortem](https://www.anthropic.com/engineering/april-23-postmortem)).
  - **Seed reading:** validates the [postmortem](../../skills/postmortem/SKILL.md) organ's premise —
    a failure yields a durable decision-trail, not just a fix.

## Go deeper

- Empirical comparison across 70 public agent systems, five dimensions (subagent architecture,
  context management, tool systems, safety, orchestration)
  ([Architectural Design Decisions in AI Agent Harnesses](https://arxiv.org/abs/2604.18071)).
- A 500+ reference academic survey / reading list ([RUCAIBox/awesome-agent-harness](https://github.com/RUCAIBox/awesome-agent-harness)).
- Canonical vendor framings: [Anthropic — Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) ·
  [OpenAI — Harness Engineering](https://openai.com/index/harness-engineering/) ·
  [OpenAI — A Practical Guide to Building AI Agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/).

## Capability gaps this slice surfaced

Metabolizing this section sensed two units of entropy about the seed itself (SEED.md §3), priced in
the [entropy ledger](../plans/entropy-ledger.md):

- **[E-013](../plans/entropy-ledger.md)** — the seed has only computational controls, no inferential
  ones (the missing organ for judging faithfulness/quality of an agent's synthesis).
- **[E-014](../plans/entropy-ledger.md)** — plans have no resumable, context-scoped work-unit format
  for multi-session / parallel handoff.
