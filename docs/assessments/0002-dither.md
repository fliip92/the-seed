# Assessment 0002 — dither

- Date: 2026-07-17
- Target: `dither`, a pnpm monorepo (`apps/` — phone, workshop, gateway; `packages/` —
  droid-file, traits, matrix, matrix-playground) — a personal-AI-droid mobile app. 334
  git-tracked files, 49 commits. Foreign: it carries none of the seed's anatomy (no genome, no
  plan/ring log, no `docs/principles/` organ, no entropy ledger), so it has not been grafted —
  but it is unusually well-tended, with a `CLAUDE.md` agent entry point, a `CONTEXT-MAP.md`, a
  one-page architecture doc, and eight ADRs (detailed under Scout). It is the **first external
  pollination host**, named by the Gardener at Stage 4 entry
  ([ring 0032](../rings/0032-stage-4-transition-first-host-dither.md)); its owner is the Seed's
  own Gardener (the same human). Assessed strictly read-only — its HEAD (`93d02cd`), tree hash
  (`d2f2b41`), and working tree (clean but for one pre-existing untracked spike under
  `docs/spikes/`, `executorch-lora-adapter-feasibility.md`) were byte-identical before and after
  the Scout (repo-fitness's non-mutation contract, self-test-proven). This is the first exercise
  of the Stage 4 *Scout* step (SEED.md §4) against a real host — the pre-flight
  [E-012](../plans/entropy-ledger.md) fix (count the committed repository, not the on-disk walk)
  landed first, so the untracked spike is correctly excluded from every reading.

## Scout

Read-only SEED.md §6 fitness baseline, computed by
[repo-fitness](../../skills/repo-fitness/SKILL.md) (`npm run repo-fitness -- <dither>`). A
trend, not a grade (LAW-9): a `null` means the target lacks the anatomy that metric is defined
over — the absence is itself the finding.

```
map_reachability   null — no AGENTS.md — LAW-4's map entry point is absent
enforcement_ratio  null — no docs/principles/ organ — no stated principles to enforce
drift_count        0
plan_traceability  null — no plans or rings — no decision log to trace commits to
escalation_rate    null — no run-log instrument yet
ledger_trend       null — no entropy ledger
```

Three readings are load-bearing and need reading honestly, not just quoting:

- **`map_reachability` null — but dither is not mapless.** The metric hard-codes the entry
  filename as `AGENTS.md` ([fitness-metrics.ts](../../.seed/lib/fitness-metrics.ts)); dither has
  none, so the metric degrades to null. Its *stated* finding — "the map entry point is absent" —
  is however false for this host. dither has a genuinely legible map, just under conventional
  non-`AGENTS.md` names and split across several roots: `CLAUDE.md` is a real agent entry point
  (it links the design authority `DESIGN.md`, ADR-0008, `PRD.md`, `CONTEXT-MAP.md`, and the
  agent config under `docs/agents/`); `CONTEXT-MAP.md` is a code-territory map (its six contexts
  mirror the `apps/`+`packages/` layout, with the inter-context dependency directions written
  out); `README.md` is a human front door (→ `PRD.md`, the architecture doc, ADR-0002, the
  layout, the dev commands); and the POC architecture doc (`architecture.md` under `docs/`) is a
  one-page target architecture with a decision register mapping each area to one of eight ADRs.
  So the honest reading is not "no map" but **"a legible, multi-rooted map under non-`AGENTS.md`
  names, with no single canonical entry point and nothing enforcing its completeness."** The null
  is therefore two distinct findings: an instrument gap in the seed (the metric sees only
  `AGENTS.md`; priced below as [E-016](../plans/entropy-ledger.md)) and a real, milder LAW-4 gap
  in dither (no one map reaches the territory in ≤3 hops; no reachability gate).

- **`drift_count` 0 — genuine, not vacuous.** dither's current-state docs name repository paths
  honestly. The metric ([scanDrift](../../.seed/checks/doc-drift.ts)) checks concrete
  root-relative path claims inside inline-backtick spans; dither carries 32 such claims, and
  every one that resolves to a checkable path resolves. A fuller manual check of dither's
  *dominant* citation style — 87 markdown file-links, which `scanDrift` does not yet cover
  ([E-009](../plans/entropy-ledger.md)) — finds only three unresolved, all inside a single
  skill-teaching doc (`domain-modeling/CONTEXT-FORMAT.md` under `.agents/skills/`, linking
  `./src/billing/CONTEXT.md` and two siblings) where they are *format examples*, not claims about
  dither's own tree (dither has no top-level `src/`). So the 0 is load-bearing — a real strength,
  against mottainapp's 343 ([assessment 0001](0001-mottainapp.md)) — and the narrow coverage is
  the seed's own E-009, not a dither finding.

- **`plan_traceability` null — but decisions are recorded, on two disjoint surfaces.** dither is
  not decision-less: it keeps eight ADRs under `docs/adr/` (its architecture rationale) and
  operates work through GitHub Issues (`fliip92/dither`). Its 49 commits are richly scoped
  (`phone:`, `gateway:`, `workshop:`, `spike:`, `docs:`) and many cite an issue number (`#33`,
  `#31`, `#1`). But the metric reads null honestly: there is no `docs/plans/` or `docs/rings/`
  decision log to trace to, nothing binds a commit to the *ADR* it enacts, and an issue citation
  points **outside the committed repository** — a gate reading `git ls-files` cannot verify it. So
  the finding is not "untraceable chaos" but "two real decision surfaces, neither bound to commits
  by an in-repo, checkable citation."

*Instrument note (sensed entropy about the seed itself, SEED.md §3):* the first two readings
above are as much about the Scout as about dither. The `AGENTS.md`-only map recognition is newly
sensed on this host — it turns a well-mapped repo into a null — and is priced as
[E-016](../plans/entropy-ledger.md); the markdown-link blind spot in drift detection is the
already-priced [E-009](../plans/entropy-ledger.md). Neither changes a verdict here (each reading
is robust on the evidence), but both name what the instrument under-sees on a well-tended host —
exactly the class of finding [E-012](../plans/entropy-ledger.md) was, surfaced by
[assessment 0001](0001-mottainapp.md).

## Findings

The through-line: dither already **practices the seed's methods by hand** — it grilled its own
architecture into `architecture.md` (a dated 2026-07-02 grilling session), keeps ADRs, maps its
contexts, names a single design authority, gates every push in CI, and carries zero doc drift.
What it lacks is the seed's **enforcement and measurement** organs. Every finding below makes
*legible and enforceable* (LAW-2) something dither already does well — method, not dogma (SEED.md
§4); none imposes foreign structure.

- **No single canonical, reachable map** (`map_reachability` null): dither's map is real but
  split across `CLAUDE.md` (agents), `README.md` (humans), `CONTEXT-MAP.md` (domain), and the
  architecture doc + eight ADRs (design) — no one entry point reaches the territory in ≤3 hops,
  and nothing keeps the map complete as the tree grows (LAW-4). — Product: invariant — designate
  one canonical map (or teach `map_reachability` dither's chosen entry filename, per
  [E-016](../plans/entropy-ledger.md)) that links the human front door, the context map, the
  architecture doc, and `docs/adr/`, with a reachability + dead-link gate as the graft's first
  lint (the same lint would lock in the current `drift_count` 0 mechanically rather than by
  discipline).

- **Enforced norms are not stated as principles** (`enforcement_ratio` null): dither's CI
  workflow (`ci.yml`) already gates every push and PR on `pnpm lint && pnpm typecheck && pnpm
  test` — real enforcement — but no principle *states* the norm, so it is tribal and discoverable
  only by reading the workflow YAML (LAW-2: a rule a fresh agent cannot discover is not legible).
  — Product: invariant — state each enforced norm as a principle naming `ci.yml` as its
  enforcement; the null `enforcement_ratio` then becomes a computable ratio instead of an absence.

- **Decisions are recorded but not traceable from commits** (`plan_traceability` null): dither
  keeps eight ADRs and cites GitHub issue numbers in commit subjects, but nothing binds a commit
  to the ADR it enacts, and issue citations resolve only outside the committed repo. — Product:
  invariant — adopt a commit→decision citation gate over dither's *existing* ADR + issue
  discipline (reuse what is there; do not impose the seed's plan/ring form), with the
  authoritative decision surface named by the owner (Grill agenda).

- **No priced debt** (`ledger_trend` null): dither senses entropy informally — the architecture
  doc's explicit "Deferred to build time" list, its risk register, the `docs/spikes/` feasibility
  notes — but nothing is priced with an interest rate and a conversion path, so it compounds
  silently (LAW-8). — Product: priced debt — seed an entropy ledger, opening it with the
  deferred-list and risk register already written down (they are pre-sensed entropy awaiting only
  a price and a conversion path).

(`escalation_rate` is null for the same universal reason it is null for the seed itself — no
run-log instrument exists to measure it — so it yields no finding here. `drift_count` 0 is the
*absence* of entropy, not a finding: it is a strength to preserve, which the map finding's
dead-link gate does mechanically.)

## Grill agenda

The Scout measures; it does not get to invent the target architecture (SEED.md §5). dither is an
unusual host here — it already ran its own grilling session (the 2026-07-02 one that produced
`architecture.md`), so the *product* architecture is largely elicited. These are the questions
that remain, about the seed's specific organs, and the proposal above is provisional until
dither's owner answers them:

- Which file is dither's intended **canonical map** — `CLAUDE.md`, `README.md`, or a new
  `AGENTS.md` — and should the reachability gate measure from that one, or should the seed teach
  `map_reachability` dither's chosen entry filename ([E-016](../plans/entropy-ledger.md))?
- Between the eight ADRs and GitHub Issues, which is the **authoritative decision record**, and
  should commits cite ADRs, issues, or both — and must issues stay in GitHub (so no in-repo gate
  can verify a citation), or is moving the work log in-repo acceptable?
- `CONTEXT-MAP.md` lists six contexts with only two `CONTEXT.md` files written (a stated lazy
  convention); is that the intended steady state, or should every context carry one before graft?
- The `.agents/skills/` library is vendored from `mattpocock/skills` with a `skills-lock.json`; is
  it authoritative and pinned, or a starting point dither will diverge from — and how should the
  seed's own skills coexist with it?
- `architecture.md` is explicitly a *POC* architecture; what is its steady-state shape past the
  POC, and who signs off before any map, principle, gate, or ledger is grafted?

## Ownership

- Owner (human — dither's owner, who is also the Seed's Gardener,
  [ring 0032](../rings/0032-stage-4-transition-first-host-dither.md)): intent, priorities, and
  taste; which file is the canonical map; which of ADRs vs GitHub Issues is authoritative; every
  Grill-agenda answer; and approval before any map, principle, gate, or ledger is grafted
  (LAW-1). The mutating steps (Graft onward) do not begin until this approval
  ([plan 0006](../plans/active/0006-pollination.md)).
- Seed (agent): the read-only Scout (done); composing this evidence-judgeable proposal; and, once
  the owner approves, building the canonical map and its reachability + dead-link lint, the stated
  principles naming `ci.yml`, the commit→decision traceability gate over the existing ADR/issue
  discipline, and the entropy ledger seeded from the deferred-list + risk register — everything
  except the judgment calls above. Propagation is re-metabolization, not `npm update`: each
  adopted change becomes dither's own decision, never forced
  ([plan 0006](../plans/active/0006-pollination.md)).
