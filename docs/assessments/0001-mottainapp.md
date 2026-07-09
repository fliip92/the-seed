# Assessment 0001 — mottainapp

- Date: 2026-07-06
- Target: `mottainapp`, a pnpm/turbo monorepo (`apps/api`, `apps/mobile`, `packages/`) — 691
  git-tracked files, 792 commits. Foreign: it carries none of the seed's anatomy (no genome,
  no plan/ring log, no principles organ, no ledger), so it has not been grafted. Assessed
  strictly read-only — its HEAD (`1a728c7`), tree hash (`073992e`), and clean `git status`
  were byte-identical before and after the Scout (repo-fitness's non-mutation contract,
  self-test-proven). This is the first exercise of the Stage 2 exit criterion (SEED.md §4):
  assess a foreign repository without modifying it and produce a proposal its owners could
  judge on evidence.

## Scout

Read-only SEED.md §6 fitness baseline, computed by [repo-fitness](../../skills/repo-fitness/SKILL.md)
(`npm run repo-fitness -- <mottainapp>`). A trend, not a grade (LAW-9): a `null` means the
target lacks the anatomy that metric is defined over — the absence is itself the finding.

```
map_reachability   0.0%
enforcement_ratio  null — no docs/principles/ organ — no stated principles to enforce
drift_count        343
plan_traceability  null — no plans or rings — no decision log to trace commits to
escalation_rate    null — no run-log instrument yet
ledger_trend       null — no entropy ledger
```

Two readings are load-bearing and need reading honestly, not just quoting:

- **`map_reachability` 0.0%.** An `AGENTS.md` *exists*, so the metric computes — but that file
  is a **beads/tooling brief** (how to run `bd`, non-interactive shell flags, a session-push
  workflow) with **zero markdown links to repository files**. It reaches only itself. The
  repository is otherwise richly documented — a docs tree with design-system specs, 18 decision
  records, milestones, and PRDs — but nothing ties that territory into a graph a fresh agent can
  walk (LAW-4). The 0.0% is displayed against the full on-disk walk (18,736 files, inflated by
  untracked build output — see the instrument note below); measured against only the 691
  tracked files the reading is still ≈0.1%. **The verdict — no working map — is robust either
  way.**
- **`drift_count` 343.** These are inline-backtick path references in markdown that do not
  resolve (320 are `.ts` paths, 243 under a `services/` tree; 23 are `.md`). They **cluster**:
  ~150 come from ten *untracked* `.claude/worktrees/moire-*/` snapshots on disk (git tracks
  **zero** files there) that each duplicate the same feature-analysis design doc; the rest are
  concrete source paths named in the tracked `.claude/moire-v0-wave*.md` design docs that don't
  exist at those paths — design-ahead-of-code, renamed, or abandoned modules. So 343 overstates
  distinct drift; the distinct, committed drift is closer to ~180, concentrated in a handful of
  planning docs.

*Instrument note (sensed entropy about the seed itself, SEED.md §3):* both inflations above
come from repo-fitness walking the **on-disk working tree**, not `git ls-files` — so untracked
build artifacts and stray worktree snapshots count. Priced into the seed's own ledger as
[E-012](../plans/entropy-ledger.md); it does not change any verdict here (each is robust against
the tracked-only reading), but it would mislead on a repo with a real map buried under untracked
output.

## Findings

- **No legible entry point** (`map_reachability` 0.0%): a rich docs tree with no map tying it
  together; `AGENTS.md` is a tool brief, not a territory index — a fresh agent cannot reach the
  design decisions, PRDs, or module layout from it (LAW-4). — Product: invariant — propose an
  `AGENTS.md` **map**: a territory table linking the decision records, design-system, PRDs, and
  the `apps/`+`packages/` layout, with a `map_reachability` gate as the graft's first lint.
- **Enforced norms are not stated as principles** (`enforcement_ratio` null): `.husky/pre-commit`
  (lint-staged) and `.husky/pre-push` (`pnpm typecheck && pnpm test`) already gate every commit
  and push — real enforcement — but no principle *states* the norm, so it is tribal and
  undiscoverable (LAW-2: a rule a fresh agent cannot discover is not legible). — Product:
  invariant — state each enforced norm as a principle naming its hook/CI enforcement; the null
  `enforcement_ratio` then becomes a computable ratio instead of an absence.
- **Decisions are recorded but not traceable from commits** (`plan_traceability` null): the
  target keeps 18 decision records under `docs/decisions/` and commits already carry task IDs
  (e.g. `feat(moire): … (moire-x2ae.1)`), but nothing binds a commit to the decision it enacts,
  and the `bd` issue DB holds only 2 issues (aspirational, not load-bearing). — Product:
  invariant — adopt a commit→decision citation gate over the *existing* `docs/decisions/` +
  moire-ID discipline (reuse what's there; do not impose the seed's plan/ring form).
- **Stranded untracked worktree snapshots** (~150 of the 343 drift): ten `.claude/worktrees/moire-*/`
  trees sit on disk, untracked, each duplicating one feature-analysis doc. — Product: deletion —
  remove the stranded worktree snapshots (they are not part of the committed repo and inflate
  every on-disk scan).
- **Unresolved source references in design docs** (~180 distinct drift): the tracked
  `.claude/moire-v0-wave*.md` docs name `.ts` paths that don't resolve — a mix of aspirational
  (design-ahead-of-code) and genuinely stale (renamed/moved). Which is which is the owner's call
  (see Grill agenda). — Product: priced debt — a triage backlog rating each reference
  realize-the-design vs. fix-the-reference vs. delete-the-doc, paid down on a cadence.
- **No priced debt at all** (`ledger_trend` null): entropy is sensed informally (wave-doc TODOs,
  feature-analysis gaps) but nothing is priced with an interest rate and a conversion path, so it
  compounds silently (LAW-8). — Product: priced debt — seed an entropy ledger, opening it with
  the drift-triage backlog above and the map gap.

(`escalation_rate` is null for the same universal reason it is null for the seed itself — no
run-log instrument exists to measure it — so it yields no finding here.)

## Grill agenda

The Scout measures; it does not get to invent the target architecture (SEED.md §5). These are
the questions only mottainapp's owner can answer, and the proposal above is provisional until
they do:

- What is the intended dependency direction among `apps/api`, `apps/mobile`, and `packages/` —
  which package is the shared core, and may the two apps depend on each other?
- Of the `services/…` and `apps/api/src/…` `.ts` paths named across the wave/design docs, which
  are intended-but-unbuilt, which were renamed/moved, and which are abandoned? (This is what
  splits the ~180 drift references into realize / fix / delete.)
- Is `bd` (beads) the intended task system going forward, or aspirational — and between it and
  `docs/decisions/`, which is the authoritative decision record?
- Are the `.claude/worktrees/` trees meant to exist on disk at all, or are they leftover from a
  parallel-agent run and safe to delete?
- What is the target architecture's one-page shape, and who signs off on it before any graft?

## Ownership

- Owner (human — mottainapp's Gardener): intent, priorities, and taste; the target architecture's
  shape; every Grill-agenda answer (which drift is design vs. stale, which task system is
  authoritative); and approval before any map, principle, gate, or deletion is grafted (LAW-1).
- Seed (agent): the read-only Scout (done); composing this evidence-judgeable proposal; and, once
  the owner approves, building the map and its reachability lint, the stated principles, the
  commit→decision traceability gate, the entropy ledger, and executing the drift triage —
  everything except the judgment calls above.
