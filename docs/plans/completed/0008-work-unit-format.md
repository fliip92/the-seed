# Plan 0008 — work-unit format (pay E-014)

- Status: completed 2026-07-19

## Goal

Convert [E-014](../entropy-ledger.md) via its priced conversion path — **ring then invariant**:
decide, then structurally enforce, an **optional, context-scoped work-unit format** a plan
decomposes into and [parallel-worktrees](../../../skills/parallel-worktrees/SKILL.md) consumes. The
gap E-014 names: a plan today carries a prose `## Progress log` and a `## Next actions` list, but no
self-contained unit a fresh session — or a parallel worktree agent — can pick up **cold** without
re-deriving context from the whole plan and repo. That is the "implement pieces across sessions
without derailing, with efficient context/token usage, and parallel humans + machines" need
([harness-engineering.md](../../references/harness-engineering.md) "Long-horizon & multi-session
work"). Free-item pay during the [plan 0007](0007-dither-graft.md) dither-graft pause (LAW-8), after
[E-011](../entropy-ledger.md) ([ring 0035](../../rings/0035-stage-agreement-invariant.md)).

## The format

An **optional** `## Work units` section inside a plan file. A plan MAY decompose into work units
when it spans sessions or parallel agents; a small single-session plan omits the section entirely
and is unchanged. Each unit is a `### U<n> — <title>` block carrying:

- **Status** — `todo | in progress (<owner>) | done | blocked: <on what>` — a resuming agent's
  at-a-glance open/closed read (the plan-level `- Status:` shape, per unit).
- **Scope** — what this unit changes, bounded — the don't-derail fence (what is in, and by omission
  what is out).
- **Entry-context** — the exact pointers (files, rings, ledger entries, prior units) to read to
  start **cold**, *without* re-deriving from the whole plan or repo. This is the checkpoint payload
  and the token/context win: read this one bounded unit, not the plan's whole prose history.
- **Done-when** — the verifiable acceptance criterion (LAW-6): the check, test, or command that
  proves the unit complete.
- **Owner** — `human | agent`, optionally a worktree/branch handle (`· seed/wt-1`) when
  parallel-worktrees runs it — the SEED.md §4/§5 ownership split, per unit.
- **Depends-on** *(optional)* — unit ids that must finish first; omitted or `none` means
  independent, so parallel-worktrees can claim it immediately.

The work-units section is the seed's Implement.md (OpenAI's reusable long-horizon artifacts), folded
**into** the plan rather than a separate file: the plan is already the long-horizon artifact
(LAW-5), and one file per plan keeps the decomposition reachable (LAW-4) and boring (LAW-7).

## Design (grounded, not from first principles)

Each field maps to a metabolized pattern or a felt seed pain — grounded-or-ask, not invention:

- **Entry-context** ← Meta's hibernate-and-wake checkpointing (resume an interrupted task without
  losing context) + LangChain's context-rot warning (bounded context beats a growing prose log). The
  seed's own pain: a fresh session today re-reads a whole plan + rings to place itself.
- **Status / id** ← OpenAI's reusable long-horizon artifacts — a waking or parallel agent must see
  what is open, claim one, and cite it (`U3`) across sessions.
- **Scope / Done-when** ← the seed's own LAW-6 (ship verification) and the plan's existing
  goal/next-actions discipline, made **per unit** so a unit is independently completable and checkable.
- **Owner / Depends-on** ← SEED.md §4/§5 human/agent ownership split + parallel-worktrees's Decompose
  step ("if they cannot be made independent, that is the finding") — Depends-on encodes exactly that
  independence so the skill knows which units can run concurrently.

## Decision log

- **Optional, not mandatory.** Interest rate is "low now (solo, mostly single-session)"; LAW-7 says
  do not over-bind. Make the format available; mandate nothing. Small plans omit it.
- **Conditional enforcement** (the [ring 0035](../../rings/0035-stage-agreement-invariant.md) shape).
  The invariant fires only when a plan *has* a `## Work units` section, validating each unit's
  fields; a plan without the section is unconstrained. All seven existing plans (no such section)
  stay valid — backward-compatible.
- **In-plan section, not a separate artifact** (`tasks/` dir or an Implement.md file). LAW-4
  reachability + LAW-7 boring: the decomposition lives where the plan lives.
- **No new skill in the first cut.** The price said "likely a skill", but LAW-7 says own the small
  subset and build organs when the need is evidenced (the discipline the ledger applies to E-018).
  The format + a procedure paragraph in [docs/plans/README.md](README.md) + wiring
  parallel-worktrees to consume it covers the need. Price a dedicated handoff/resume skill only if a
  real multi-session/parallel task proves the docs insufficient.
- **Ids unique, not strictly sequential.** Work units churn more than plans/rings; a gap left by a
  removed unit is fine. The invariant checks the `### U<n> — <title>` shape and id-uniqueness, not
  gaplessness.
- **Grounded in the already-metabolized long-horizon subsection + the seed's own plan experience**,
  not a fresh intake of the awesome-harness-engineering "Design Primitives / Planning & Task
  Decomposition" section (still unmetabolized — harness-engineering.md Scope). The ring is
  supersedable when that fuller pass lands; Revisit-when names it. No source content is claimed that
  was not read (grounded-or-ask).
- **Raised-by seed; within autonomous authority.** No SEED.md amendment — the plan format's
  authority is [docs/plans/README.md](README.md), which refines the SEED.md §2 sketch (ring 0003).
  The ring is supersedable if the Gardener's taste redirects the format.

## Work units

*This plan's own build, decomposed — the format's first live example (dogfood, LAW-6).*

### U1 — cut the ring deciding the format
- Status: done
- Scope: `docs/rings/0036-*.md` + its entry in `docs/rings/README.md`.
- Entry-context: this plan's "The format" + "Design" + "Decision log" sections; ring format +
  procedure in [docs/rings/README.md](../../rings/README.md); the ring-0035 conditional-enforcement
  precedent.
- Done-when: `npm run check` → `validate-rings` green; the ring is indexed.
- Owner: agent

### U2 — build the invariant + self-test
- Status: done
- Scope: [.seed/checks/validate-plans.ts](../../../.seed/checks/validate-plans.ts) (conditional
  work-unit validation) + [.seed/tests/self-test.ts](../../../.seed/tests/self-test.ts) (a fire case
  + the hold case).
- Entry-context: validate-plans.ts `REQUIRED_SECTIONS` + the `sectionLines` helper (already parses a
  named `##` section); the field set in "The format" above; self-test.ts methodology — seed one
  violation in a temp copy, assert the right check fires with a law-naming message, and a pristine
  copy passes.
- Done-when: `npm test` green with a new case proving a malformed unit fires LAW-5 and a
  no-work-units plan holds.
- Owner: agent
- Depends-on: U1

### U3 — document the format + wire the consumer
- Status: done
- Scope: [docs/plans/README.md](README.md) (format spec + a decompose/handoff procedure line) +
  [skills/parallel-worktrees/SKILL.md](../../../skills/parallel-worktrees/SKILL.md) step 1 (consume
  the plan's `## Work units`).
- Entry-context: docs/plans/README.md "Plan format" list; parallel-worktrees "The lifecycle" step 1
  Decompose ("Split the task into sub-tasks that can each own a worktree").
- Done-when: `npm run check` green (map + drift gates pass); parallel-worktrees Decompose points at
  `## Work units` as the canonical decomposition.
- Owner: agent
- Depends-on: U1

### U4 — verify + pay the ledger
- Status: done
- Scope: [entropy-ledger.md](../entropy-ledger.md) (move E-014 Open→Paid) + this plan's progress log
  + status; AGENTS.md current-state only if it needs it (stage unchanged — likely not).
- Entry-context: the E-014 entry; the E-011 `Paid:` write-up shape in the ledger; the `npm run
  check` + `npm test` evidence produced by U2/U3.
- Done-when: E-014 sits in `## Paid` with dated evidence; `npm run check` + `npm test` green;
  `drift_count` 0.
- Owner: agent
- Depends-on: U2, U3

## Progress log

- **2026-07-19** — Opened to pay [E-014](../entropy-ledger.md) during the dither-graft pause (LAW-8),
  after [E-011](../entropy-ledger.md) ([ring 0035](../../rings/0035-stage-agreement-invariant.md)).
  Designed the optional `## Work units` format (above), grounded in
  [harness-engineering.md](../../references/harness-engineering.md)'s long-horizon subsection and the
  seed's own plan experience. Dogfooded: this plan's build is decomposed into U1–U4. Next: cut the
  ring (U1), then U2–U4.
- **2026-07-19** — **E-014 paid; plan complete.** Cut ring
  [0036](../../rings/0036-work-unit-format.md) (the format decision, indexed) and built the
  conditional invariant in [validate-plans.ts](../../../.seed/checks/validate-plans.ts) — a plan is
  validated against the work-unit format only when it carries a `## Work units` section, so every
  prior plan stays valid. Documented the format in [docs/plans/README.md](../README.md) and wired
  [parallel-worktrees](../../../skills/parallel-worktrees/SKILL.md)'s Decompose step to consume it.
  [E-014](../entropy-ledger.md) moved to Paid. Verification: `npm run check` (14) + `npm test`
  (240 cases, six new work-unit cases — five fire, one holds) green; `drift_count` 0. U1–U4 all done.

## Next actions

Complete — [E-014](../entropy-ledger.md) paid (ring
[0036](../../rings/0036-work-unit-format.md)), all work units done. The format is available for any
future multi-session or parallel-[worktrees](../../../skills/parallel-worktrees/SKILL.md) plan; a
dedicated handoff/resume skill is priced-if-needed (ring 0036 Revisit-when), not built now (LAW-7).
