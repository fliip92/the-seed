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

## Decision log

- None yet — scope-level decisions will land here or as rings as work begins.

## Next actions

1. **Seed:** execute scope item 1 — machinery self-tests
   ([E-007](../entropy-ledger.md)): a committed structural test that seeds each violation
   class in a temp copy and asserts the right check fires with a law-naming message; wire
   it into CI; include the ring append-only git gate ([E-005](../entropy-ledger.md)).
2. **Seed:** then scope items 2–5 in order, logging progress and evidence here.
