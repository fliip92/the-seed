# Plan 0001 — Germination

- Status: blocked: awaiting Gardener answers to the germination questions (SEED.md §9)

## Goal

Execute Stage 0 (SEED.md §4): bootstrap the Seed so that a fresh agent, given only a
clone of this repository, reaches its correct first action without human help — with CI
proving the map holds.

## Scope — the seven germination steps

1. ✅ Read the genome completely.
2. ✅ Write `AGENTS.md` v0 — the map.
3. ✅ Scaffold the anatomy (SEED.md §2); every directory carries a README stating purpose.
4. ✅ Open this plan and log progress.
5. ✅ Cut [ring 0001](../../rings/0001-founding-defaults.md) (founding defaults) and
   [ring 0002](../../rings/0002-germination-implementation-defaults.md) (implementation
   defaults the genome left open).
6. ✅ Stand up first CI: map validation (dead links + three-hop reachability), anatomy
   validation, ring/plan/ledger format validation. See [.seed/README.md](../../../.seed/README.md).
7. ⏳ Ask the Gardener the five germination questions; cut answers into rings; close this
   plan.

## Progress log

- **2026-07-04** — Genome read. Repository initialized on `main`. Map (`AGENTS.md`),
  anatomy, rings 0001–0002, entropy ledger (E-001…E-004), and `.seed/` machinery written.
  Node 25 runs the TypeScript checks natively; zero dependencies.
- **2026-07-04** — All checks pass locally (`npm run check`). Negative verification and a
  fresh-agent exit-criterion test run via parallel subagents; evidence below.
- **2026-07-04** — Germination questions delivered to the Gardener. Plan blocked on
  answers.

## Decision log

- CI provider, runtime, and dependency policy → [ring 0002](../../rings/0002-germination-implementation-defaults.md).
- Reachability exemptions kept minimal and explicit in `validate-map.ts`: only `.git/`,
  `node_modules/`, and OS noise are excluded from the three-hop requirement;
  `docs/fitness/history/` is covered by its README (snapshot files are append-only data,
  listing each would be churn without legibility gain).
- Fitness metrics are *defined* now ([FITNESS.md](../../fitness/FITNESS.md)) but computed
  from Stage 1, per the stage boundaries — no stage skipping.

## Evidence (LAW-6)

- `npm run check` green on the committed tree (all four validators pass; map reachability
  100%, 0 dead links).
- Negative tests: each validator was confirmed to fire on a seeded violation (dead link,
  missing anatomy README, malformed ring, malformed ledger entry) with a remediation
  message naming the law it enforces. See progress log date 2026-07-04.
- Fresh-agent test: an agent given only a clean clone and no instructions identified the
  correct first action via `AGENTS.md` → this plan.

## Next actions

1. **Gardener:** answer the five germination questions (SEED.md §9), asked in the session
   of 2026-07-04.
2. **Seed:** cut each answer into a ring (rings 0003+); apply any resulting changes
   (name, license file, remote, cadence automation).
3. **Seed:** flip `AGENTS.md` "Current state", set this plan to `completed`, move it to
   `completed/`, and propose the Stage 1 (Rooting) plan for Gardener approval.
