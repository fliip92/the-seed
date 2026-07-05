# doc-gardener

Detects doc↔code drift and stale content, then lands the mechanical fixes within the
gardening cadence's automerge classes (ring
[0007](../../docs/rings/0007-gardening-cadence-automerge.md)) and prices or escalates the
rest. It is the Stage 1 organ for the exit criterion *"you detect your own drift
automatically, without being asked"* (SEED.md §4), and it is the source of the
`drift_count` fitness metric (SEED.md §6).

## When to run

- Every session's opening metabolism (SEED.md §3, sense step) and on the weekly gardening
  pass (ring [0007](../../docs/rings/0007-gardening-cadence-automerge.md)).
- After any change that renames, moves, or deletes a file that documentation names.
- In CI, to snapshot `drift_count` into fitness (plan 0002 scope item 4).
- Automatically, weekly: [`.github/workflows/gardening-cadence.yml`](../../.github/workflows/gardening-cadence.yml)
  runs the instruments and files a gardening-pass issue when drift surfaces, so the sense
  step happens on cadence even when no session opens (ring
  [0012](../../docs/rings/0012-cadence-automation-mechanism.md), converting E-008 — plan 0002
  scope item 5).

## The instrument

[`.seed/checks/doc-drift.ts`](../../.seed/checks/doc-drift.ts) scans the **current-state
doc surface** — the documentation whose job is to describe the repository as it is now —
and reports every drift finding plus a `drift_count`.

```bash
npm run garden                          # human-readable report
node .seed/checks/doc-drift.ts --json   # { "drift_count": N, "findings": [...] } for CI
```

It is **advisory, not a gate**: it always exits 0 (ring
[0011](../../docs/rings/0011-drift-advisory.md)). Drift is a trend the cadence digests
continuously (LAW-8), so a non-zero `drift_count` is a normal, healthy state — you are
always digesting some. A crash still exits non-zero, so CI notices a broken instrument.

### What counts as drift (v0)

| Class | Detects | Precision guard |
|---|---|---|
| `stale-path-reference` | a current-state doc names a repo path (in an inline backtick span; fenced code blocks are not scanned) that no longer exists | only concrete claims fire: first segment is an existing top-level entry, has a separator, ends in a known extension; template placeholders (`<name>`, `NNNN`), globs, and non-repo-relative tokens are skipped |

Out of scope (excluded from the scan — a reference there is legitimate history, not
actionable drift, and rewriting it would fight the append-only discipline the gates
protect): `SEED.md` (genome — Gardener-only, ring
[0007](../../docs/rings/0007-gardening-cadence-automerge.md)), `docs/rings/`,
`docs/plans/completed/`, the active-plan bodies, and the ledger's Paid log. The v0
coverage gap — inventory drift, stale counts, and prose drift are still sensed by the
agent, not the instrument — is priced as [E-009](../../docs/plans/entropy-ledger.md).
New classes plug into the `DRIFT_CLASSES` registry without touching the runner.

## The gardening pass

1. **Sense** — run `npm run garden`. Read every finding.
2. **Triage** each finding by ring
   [0007](../../docs/rings/0007-gardening-cadence-automerge.md)'s automerge classes. A fix
   may land directly on `main` only when **all** hold: checks green; it touches none of
   SEED.md, existing ring content, or principle statements; and it is mechanical
   (link/reference cleanup, format compliance, typo/stale-reference fixes, ledger
   bookkeeping). A stale path reference whose correct target is unambiguous is exactly
   this class — fix it and mark the commit `Automerge: stale-reference`, which the
   automerge-scope gate checks for the touched-paths half (AGENTS.md § Protocols, ring
   [0012](../../docs/rings/0012-cadence-automation-mechanism.md)); commit tracing to a plan
   or ring.
3. **Escalate or price** everything else. A drift whose resolution needs judgment (which
   of two files is canonical? should the doc or the code change?) becomes a Gardener
   question or a ledger entry (SEED.md §0) — never a silent guess.
4. **Record** — log the pass, and if a decision was made, cut a ring (LAW-10).

## Verification (LAW-6)

A skill that cannot prove it worked is a claim, not a capability. The instrument's
detection is verified by [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts)
(`npm test`), following the machinery's temp-copy methodology: a pristine copy reports
`drift_count 0`; a seeded stale reference is detected and counted, naming LAW-2 and a
usable fix; a template placeholder and a reference inside an excluded region are both
proven silent (guarding the precision rules against regression). Any change that stops the
detector firing on its class fails CI.
