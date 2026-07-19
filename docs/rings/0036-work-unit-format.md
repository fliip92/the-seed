# Ring 0036 — the work-unit format: an optional, context-scoped `## Work units` section a plan decomposes into and parallel-worktrees consumes, conditionally enforced so small plans stay valid

- Date: 2026-07-19
- Stage: 4 — Pollination
- Raised-by: seed
- Question: A plan carries a prose `## Progress log` and a `## Next actions` list (LAW-5), but no
  self-contained, context-scoped work-unit a fresh session — or a parallel
  [worktrees](../../skills/parallel-worktrees/SKILL.md) agent — can pick up **cold** without
  re-deriving context from the whole plan and repo ([E-014](../plans/entropy-ledger.md); the
  "implement pieces across sessions without derailing, with efficient context/token usage, and
  parallel humans + machines" need, [harness-engineering.md](../references/harness-engineering.md)
  "Long-horizon & multi-session work"). What is the work-unit format, and how is it enforced without
  over-binding a small single-session plan or a grafted host?
- Decision:
  - **An optional `## Work units` section inside the plan file.** A plan MAY decompose into work
    units when it spans sessions or parallel agents; a small single-session plan omits the section
    and is unchanged. Each unit is a `### U<n> — <title>` block carrying **Status**
    (`todo | in progress (<owner>) | done | blocked: <on what>`), **Scope** (what it changes,
    bounded — the don't-derail fence), **Entry-context** (the exact files/rings/ledger-entries/prior
    units to read to start cold, *without* re-deriving from the whole plan — the checkpoint payload
    and the token/context win), **Done-when** (the verifiable acceptance criterion, LAW-6), and
    **Owner** (`human | agent`, optionally a `· seed/wt-<i>` worktree handle) — plus an optional
    **Depends-on** (unit ids that must finish first; omitted/`none` = independent, so
    parallel-worktrees can claim it immediately).
  - **Grounded, not invented.** Entry-context ← Meta's hibernate-and-wake checkpointing + LangChain's
    context-rot warning (bounded context beats a growing prose log); Status/id ← OpenAI's reusable
    long-horizon artifacts (a waking or parallel agent must see what is open, claim one, and cite it
    across sessions); Scope/Done-when ← the seed's own LAW-6, made per-unit; Owner/Depends-on ←
    SEED.md §4/§5's ownership split + parallel-worktrees's Decompose ("if they cannot be made
    independent, that is the finding"). The section is the seed's Implement.md folded **into** the
    plan (already the long-horizon artifact, LAW-5) rather than a separate file — one file per plan
    keeps the decomposition reachable (LAW-4) and boring (LAW-7).
  - **Conditional enforcement — the [ring 0035](0035-stage-agreement-invariant.md) shape.**
    [`validate-plans.ts`](../../.seed/checks/validate-plans.ts) validates each unit's fields **only
    when a plan has a `## Work units` section**; a plan without it is unconstrained. So all seven
    existing plans, and every future small plan, stay valid — the invariant binds exactly the plans
    that opt in. The check verifies the `### U<n> — <title>` shape, id-uniqueness (not gaplessness —
    units churn), a valid Status, and the presence of Scope / Entry-context / Done-when / Owner.
  - **First live example.** [Plan 0008](../plans/active/0008-work-unit-format.md), which pays E-014,
    decomposes its own build into work units U1–U4 — the format dogfooded as it is decided (LAW-6).
  - **Metabolism during the dither-graft pause.** Converted as a free ledger item while
    [plan 0007](../plans/active/0007-dither-graft.md)'s first dither mutation is paused on the owner's
    go — the LAW-8 "pay entropy continuously" default when the live step is gated (AGENTS.md
    § Start here), after [E-011](../plans/entropy-ledger.md) (ring 0035).
- Alternatives considered:
  - *Mandatory work units on every plan* — rejected: the interest rate is "low now (solo, mostly
    single-session)"; LAW-7 says do not over-bind. Mandating the section on a two-line fix-up plan is
    ceremony, not leverage. Make it available; enforce only when used.
  - *A separate artifact — a `tasks/` directory or an OpenAI-style Implement.md file* — rejected:
    LAW-4 (reachability) + LAW-7 (boring) favor keeping the decomposition in the file the plan
    already is. OpenAI splits Plan.md/Implement.md because its harness lacks a plans-as-files
    discipline; the seed already has one, so it folds the units in.
  - *Build a dedicated handoff/resume skill now* — deferred: the price flagged "likely a skill", but
    LAW-7 says own the small subset and grow an organ when the need is evidenced (the discipline the
    ledger applies to [E-018](../plans/entropy-ledger.md)). The format + a procedure line in
    [docs/plans/README.md](../plans/README.md) + wiring parallel-worktrees to consume it covers the
    need; a skill is priced only if a real multi-session/parallel task proves the docs insufficient.
  - *Strictly-sequential, gapless ids like plans and rings* — rejected: work units churn within a
    plan's life (added, split, dropped) far more than plans or rings do; a gap after a removed unit
    is not entropy. Uniqueness is enough to make a unit citable (`U3`); gaplessness would be
    friction with no payoff.
  - *Metabolize the awesome-harness-engineering "Design Primitives / Planning & Task Decomposition"
    section first, then design* — deferred: that section is still unmetabolized
    ([harness-engineering.md](../references/harness-engineering.md) Scope), and a full intake pass is
    disproportionate to E-014's low current interest. The design is grounded in the **already**-
    metabolized long-horizon subsection plus the seed's own seven-plan experience — not first
    principles — and this ring is supersedable when that fuller pass lands (Revisit-when). No
    unmetabolized source content is claimed here (grounded-or-ask).
  - *Attribute E-014 to the governing [plan 0006](../plans/active/0006-pollination.md) or the paused
    plan 0007 instead of its own plan + ring* — rejected: E-014 is unrelated to dither pollination;
    folding it in would pollute those plans' stories. E-014's own conversion path is "ring then
    invariant", and [plan 0008](../plans/active/0008-work-unit-format.md) is the honest anchor
    (AGENTS.md § Protocols).
- Enforcement: structural test — conditional work-unit validation in
  [`validate-plans.ts`](../../.seed/checks/validate-plans.ts) (part of
  [`run-all`](../../.seed/checks/run-all.ts)), pinned by [self-test](../../.seed/tests/self-test.ts)
  cases that seed a malformed unit (missing a required field, or a duplicate id) and assert the check
  fires with a LAW-5 message and exit 1 (LAW-6), while a plan with no `## Work units` section and a
  plan with well-formed units both pass. The format is documented in
  [docs/plans/README.md](../plans/README.md) and consumed by
  [parallel-worktrees](../../skills/parallel-worktrees/SKILL.md)'s Decompose step.
- Revisit-when: a real multi-session or parallel-worktrees handoff proves the format + docs
  insufficient and a dedicated handoff/resume skill is worth its keep (price and build it then); or
  the awesome-harness-engineering "Design Primitives / Planning & Task Decomposition" intake pass
  lands and refines the field set (this ring is supersedable); or the run-log instrument
  ([E-017](../plans/entropy-ledger.md)) makes per-unit cost and checkpoint state machine-tracked
  rather than hand-written into Entry-context.
