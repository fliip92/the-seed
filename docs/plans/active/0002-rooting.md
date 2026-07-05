# Plan 0002 — Rooting (Stage 1)

- Status: active

## Goal

Grow the self-maintenance organs (SEED.md §4, Stage 1) so the seed detects its own drift
automatically, without being asked — the Stage 1 exit criterion.

## Scope

In execution order, each item shipping with its own verification (LAW-6):

1. **Machinery self-tests** — convert [E-007](../entropy-ledger.md): commit structural
   tests that seed each violation class in a temp copy and assert the right check fires
   with a law-naming message; run them in CI. Includes the ring append-only git gate
   ([E-005](../entropy-ledger.md)).
2. **Traceability gate** — convert [E-003](../entropy-ledger.md): every change landing on
   `main` must trace to a plan or ring (commit-message reference checked in CI), making
   the `plan_traceability` metric computable.
3. **doc-gardener skill** (`skills/doc-gardener/SKILL.md`): detects doc↔code drift and
   stale content; lands fix-up commits within ring
   [0007](../../rings/0007-gardening-cadence-automerge.md)'s automerge classes; feeds
   `drift_count`.
4. **Fitness v0 in CI** — compute the SEED.md §6 metrics that are now computable
   (`map_reachability`, `enforcement_ratio`, `drift_count`, `ledger_trend`; the rest
   recorded as null per the [FITNESS.md](../../fitness/FITNESS.md) schema); land the
   first dated snapshots in `docs/fitness/history/`.
5. **Cadence automation** — convert [E-008](../entropy-ledger.md): scheduled invocation
   of the gardening pass, plus a path-based gate encoding the automerge classes.

Already in place from germination: the entropy ledger is live (Stage 1's "ledger seeded"
item), and every session opens with the metabolism per the map.

## Progress log

- **2026-07-04** — Drafted at germination close ([plan 0001](../completed/0001-germination.md)
  complete, both Stage 0 exit criteria evidenced). Awaiting transition approval.
- **2026-07-04** — Transition approved by the Gardener; recorded as ring
  [0009](../../rings/0009-stage-1-transition-approved.md). Plan active. Stage 1 begins
  with scope item 1 (machinery self-tests, E-007).
- **2026-07-04** — Scope item 1 complete: [self-tests](../../../.seed/tests/self-test.ts)
  (`npm test`) seed all 31 violation classes plus 5 append-only-gate scenarios into temp
  copies and assert the right check fires with a law-naming message (E-007 paid); the
  [ring append-only gate](../../../.seed/checks/ring-append-only.ts) runs as a third CI
  step (E-005 paid). Sensitivity proven by mutation testing — details in the ledger's
  Paid entries. A 16-agent adversarial review confirmed 3 defects (9 claims refuted),
  all fixed before landing: a gate crash on no-common-ancestor bases, a symlink route
  around the gate's pathspec, and hardcoded fixture numbers that the next real ring
  would have invalidated. Local evidence: `npm run check` green, `npm test` 37/37 green.

## Decision log

- **Self-test strategy — subprocess in a temp copy.** Each case copies the working tree
  (minus `.git`/`node_modules`), seeds one violation, and runs the copy's own
  `run-all.ts`, asserting on exit code and output. This exercises the exact end-to-end
  path CI runs, with zero new dependencies (ring 0002). Rejected: in-process fixture
  injection — faster, but it would bypass `run-all.ts` wiring and exit-code behavior,
  which is precisely what regressed before (E-007's origin).
- **`npm test` is separate from `npm run check`.** The check loop stays fast and pure
  (no git, no subprocesses); the self-tests spawn ~35 node processes and must not run
  inside the copies they create (recursion). CI runs both, plus the gate.
- **Gate design.** The append-only gate lives outside `run-all.ts` because it needs git
  history. CI passes the event's base ref (PR base branch, or the push's previous tip);
  the script falls back to `origin/main`, then `HEAD~1`, and skips with an explicit note
  only when nothing resolves (branch-create push / shallow clone), because the PR run
  against the base branch still applies it. `docs/rings/README.md` is exempt — it is the
  index and legitimately gains a line per ring. Residual force-push evasion is accepted
  while solo and recorded in E-005's Paid entry.
- **Symlinks are banned repo-wide** (`validate-anatomy`, LAW-2). Checks read through a
  symlink while git diffs track only its target path, so a symlinked artifact lets
  content change with no diff at the linked path — adversarial review showed this
  bypassing the append-only gate. Banning the class beats patching the instance (LAW-3).
- **Self-test fixture numbers are derived, never hardcoded.** Gap/duplicate fixtures
  compute the repo's current max ring/plan/ledger numbers at runtime; a hardcoded
  "found 0011 where 0010 was expected" would have failed CI the day ring 0010 was cut
  for real.
- **Model/effort selection is policy, not catalog** — recorded as ring
  [0010](../../rings/0010-model-effort-selection.md): verification-harness strength
  decides the tier; volatile per-item tier hints live in `Next actions` below and die
  with this plan.

## Next actions

1. **Seed:** execute scope item 2 — traceability gate ([E-003](../entropy-ledger.md)):
   every change landing on `main` must trace to a plan or ring (commit-message reference
   checked in CI), making the `plan_traceability` metric computable. Tier hint (ring
   [0010](../../rings/0010-model-effort-selection.md)): mid-tier model at default
   effort — pattern work fully covered by the self-test harness; one mid-effort review
   pass suffices.
2. **Seed:** then scope items 3–5 in order, logging progress and evidence here. Tier
   hints (ring [0010](../../rings/0010-model-effort-selection.md)): item 4 (fitness v0)
   is mechanical — mid tier; items 3 (doc-gardener, autonomous edit decisions) and 5
   (cadence automation, security-relevant CI surface) carry open design space — top
   tier, or mid-tier implementation plus a top-tier review.
