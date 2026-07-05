# Entropy ledger

Known debt: priced, rated, with conversion paths (LAW-8: entropy is paid continuously).
Entry format is defined in [README.md](README.md) and enforced by
`.seed/checks/validate-plans.ts`. Paid-off entries move to the **Paid** section — the
ledger is also a record of digestion.

## Open

## E-001 — `docs/generated/` hand-edit rule is stated but not enforced

- First observed: 2026-07-04, during germination
- Where: [docs/generated/README.md](../generated/README.md) declares hand-editing a lint
  error; no lint exists
- Interest rate: low (the directory is empty; compounds only once generators exist)
- Price: small — a generation manifest (source → artifact) plus a CI check that artifacts
  match regeneration
- Conversion path: invariant — build the manifest + check in Stage 1 alongside the first
  generated artifact; until then the rule is doc-only, which violates LAW-2 and is why
  this entry exists

## E-004 — "Seed" is an uncleared working codename

- First observed: 2026-07-03, planted in SEED.md §8
- Where: SEED.md §8, [ring 0001](../rings/0001-founding-defaults.md)
- Interest rate: low now, spikes to high at Stage 3 (pollen cannot ship under an uncleared
  name)
- Price: Gardener judgment plus a trademark search
- Conversion path: ring — the Gardener named it "The Seed" (ring
  [0004](../rings/0004-name-hosting-visibility.md)), which settles the name but not its
  legal clearance; a trademark search must still land before Stage 3 pollen distribution

## E-006 — Fragment links pass validation without anchor checking

- First observed: 2026-07-04, adversarial drift hunt during germination verification
- Where: `.seed/lib/repo.ts` strips `#fragment` before existence checks, so
  `[x](SEED.md#no-such-section)` counts as a live link
- Interest rate: low (fragments are rare here; a wrong one still lands the reader in the
  right file)
- Price: small — slugify headings the way GitHub does and verify the anchor exists
- Conversion path: invariant — extend the map validator with anchor checking when
  fragment links first appear in real use

## E-009 — Drift detection is v0: only the stale-path-reference class

- First observed: 2026-07-04, building the doc-gardener (plan 0002 scope item 3)
- Where: `.seed/checks/doc-drift.ts` detects one drift class (a current-state doc naming a
  repo path that no longer exists). Other doc↔code divergences — inventory drift (a list
  that no longer mirrors its directory), stale counts baked into prose, and broader prose
  drift — are still sensed by the agent on the gardening pass, not by the instrument, so
  `drift_count` under-reports true drift. Two structural blind spots narrow it further:
  the scan reads only *inline* backtick spans, so a path referenced solely inside a fenced
  code block is not checked (in practice such paths are usually markdown-linked too and so
  caught by the hard dead-link gate, `validate-map`); and the zero-dependency line parser
  tracks only top-level (0–3-space-indented) fences, so a rare list-nested fenced block can
  leak its inline paths — a limit shared with `visibleMarkdownLines`
- Interest rate: low-medium (a fitness signal that under-counts can mask real drift; the
  gap compounds only as the doc surface grows and new divergence shapes appear)
- Price: small per class — each is a new entry in the `DRIFT_CLASSES` registry plus its
  self-test cases; the runner and scan-surface logic are already shared
- Conversion path: invariant — add a drift class to the registry when a divergence shape
  proves to recur (the registry exists precisely so this needs no rework); the
  advisory/gate split is settled by ring
  [0011](../rings/0011-drift-advisory.md)

## Paid

## E-002 — CI is proven locally but not on a hosted runner

- First observed: 2026-07-04, during germination
- Where: [.github/workflows/seed-ci.yml](../../.github/workflows/seed-ci.yml) — no remote
  existed, so the workflow had never executed on GitHub
- Interest rate: medium (every merged change until hosting relied on agents remembering
  to run `npm run check` locally)
- Price: trivial once germination question 1 was answered — push, watch one run go green
- Conversion path: invariant — hosted CI on every push/PR
- Paid: 2026-07-04 — repository published (ring
  [0004](../rings/0004-name-hosting-visibility.md)); first hosted run green:
  [seed-ci run 28712013718](https://github.com/fliip92/the-seed/actions/runs/28712013718),
  independently reporting `map_reachability 100.0% (35/35 files ≤3 hops), dead links: 0`
  and `all checks passed`

## E-003 — Plan traceability is a stated metric with no enforcement

- First observed: 2026-07-04, during germination
- Where: SEED.md §6 (`plan_traceability`) and §4 Stage 1 ("merged PRs must trace to a plan
  or ring") — nothing checks this today
- Interest rate: medium (unattributed changes accumulate silently until Stage 1)
- Price: small — a CI check that the branch/PR references a plan or ring identifier
- Conversion path: invariant — mechanical trace check, scheduled as Stage 1 work
- Paid: 2026-07-04 — [.seed/checks/plan-traceability.ts](../../.seed/checks/plan-traceability.ts)
  runs in CI against the event's base ref: every non-merge commit must name an existing
  plan or ring in its message ("plan 0002", "ring 0010"), else CI fails naming LAW-5.
  Merge commits are exempt (machine-written; their carried commits are checked
  individually) and history before the merge base is never re-judged. Fire/hold behavior
  pinned by six self-test cases (the E-007 harness). First hosted execution green:
  [seed-ci run 28725041081](https://github.com/fliip92/the-seed/actions/runs/28725041081).
  `plan_traceability` is now computable from CI history — fitness v0 (plan 0002 scope
  item 4) will compute it

## E-005 — Ring append-only rule has no mechanical enforcement

- First observed: 2026-07-04, adversarial drift hunt during germination verification
- Where: [docs/rings/README.md](../rings/README.md) declares rings append-only ("never
  edit a ring's Decision after merge"); nothing checks git history for edits
- Interest rate: medium (a silently rewritten decision is worse than no decision — it
  poisons LAW-10 retrieval)
- Price: small — a CI step diffing `docs/rings/` against the merge base and failing on
  modifications to existing rings
- Conversion path: invariant — add the git-diff gate in Stage 1 alongside the other
  machinery structural tests (E-007)
- Paid: 2026-07-04 — [.seed/checks/ring-append-only.ts](../../.seed/checks/ring-append-only.ts)
  runs in CI against the event's base ref and fails on any modification or deletion of
  an existing ring (index README exempt); its fire/hold behavior is pinned by five
  self-test cases (E-007). A symlink route around its pathspec, found in adversarial
  review, is closed by the repo-wide symlink ban in `validate-anatomy` (self-tested).
  Residual, accepted while solo (ring
  [0006](../rings/0006-solo-until-flowering.md)): a force-push to `main` rewrites the
  base the push event reports, so it can evade the diff — revisit at Flowering when
  branch protection arrives

## E-007 — Machinery has no committed self-tests

- First observed: 2026-07-04, when the negative tests proving the validators fire had to
  be re-run ad hoc after a failed verification workflow
- Where: `.seed/checks/` — verified by session-run negative tests whose transcripts live
  in [plan 0001](completed/0001-germination.md), not by anything in CI
- Interest rate: medium (every validator change until then is verified only by whoever
  remembers to re-run the ad-hoc script; regressions land silently)
- Price: medium — a committed structural test that seeds each violation class in a temp
  copy and asserts the right check fires with a law-naming message
- Conversion path: invariant — Stage 1 ("first structural lints on your own machinery"),
  folding in the E-005 git-diff gate
- Paid: 2026-07-04 — [.seed/tests/self-test.ts](../../.seed/tests/self-test.ts)
  (`npm test`, second CI step) seeds all 31 violation classes plus 5 gate scenarios into
  temp copies and asserts the right check fires with a law-naming message; a pristine
  copy must pass, and fixture numbers derive from the repo's current maxima so normal
  growth cannot invalidate them. Sensitivity proven by mutation: disabling sequence
  checking failed exactly the 6 sequence cases; neutering the gate failed exactly the
  2 gate cases

## E-008 — Gardening cadence is manual until scheduled automation exists

- First observed: 2026-07-04, while adopting the cadence policy (ring
  [0007](../rings/0007-gardening-cadence-automerge.md))
- Where: the weekly gardening pass and the automerge class restrictions depend on an
  agent being invoked and on rules no CI gate checks yet
- Interest rate: medium (if no session opens, no gardening happens — drift accumulates
  exactly when nobody is looking)
- Price: medium — a scheduled agent invoking the gardening pass, plus a path-based CI
  gate encoding the automerge classes
- Conversion path: invariant — Stage 1 automation alongside doc-gardener and the
  machinery structural tests (E-005, E-007)
- Paid: 2026-07-04 (plan 0002 scope item 5; mechanism ring
  [0012](../rings/0012-cadence-automation-mechanism.md)). Two halves landed. **Path-based
  gate:** [.seed/checks/automerge-scope.ts](../../.seed/checks/automerge-scope.ts) runs as a
  seed-ci step — a commit declaring `Automerge: <class>` (a mechanical class of ring 0007)
  must touch none of SEED.md, existing ring content, or principle statements (README indices
  aside), else CI fails naming LAW-8; fire/hold behavior pinned by nine self-test cases and
  mutation-checked (the E-005/E-007 Paid standard). **Scheduled pass:**
  [.github/workflows/gardening-cadence.yml](../../.github/workflows/gardening-cadence.yml)
  runs the sense/measure instruments weekly (cron + `workflow_dispatch`) via
  [.seed/checks/gardening-report.ts](../../.seed/checks/gardening-report.ts) (composition
  pinned by two self-tests) and files a durable gardening-pass issue when `drift_count > 0`.
  Residual, accepted while solo (ring [0006](../rings/0006-solo-until-flowering.md)): nothing
  forces a constitution-touching commit to carry — or omit — the marker, so the gate makes an
  automerge *claim* trustworthy rather than forcing review; it hardens at Flowering with
  branch protection, the same shape as E-005's force-push residual. Hosted confirmation of
  the workflow's cron + issue-filing glue: its first `workflow_dispatch` run green —
  [gardening-cadence run 28752304367](https://github.com/fliip92/the-seed/actions/runs/28752304367)
  — composed the report and took the skip path (`drift_count 0` → "no issue filed"; no
  `gardening-pass` issue created), on 2026-07-05 after the scope-item-5 push

## E-010 — CI pins action versions on the Node 20 runtime GitHub is deprecating

- First observed: 2026-07-04, in the seed-ci run landing plan 0002 scope item 3 (hosted
  run 28726001712 emitted the deprecation warning)
- Where: [.github/workflows/seed-ci.yml](../../.github/workflows/seed-ci.yml) and
  [gardening-cadence.yml](../../.github/workflows/gardening-cadence.yml) used
  `actions/checkout@v4` / `actions/setup-node@v4`, which target the Node 20 runtime GitHub
  now force-runs on Node 24 and has announced removing from its runners
- Interest rate: low (runs were green — GitHub transparently ran the actions on Node 24;
  the risk was a future runner change breaking the pinned versions with no local signal,
  since the deprecation only surfaced in hosted CI)
- Price: trivial — bump to the action versions that declare a Node 24 runtime, and re-run
  CI to confirm green
- Conversion path: invariant — update the pinned action versions in the CI shim; the
  hosted run is itself the enforcement. Folded into plan 0002 scope item 5's commit (the
  same change adding the automerge-scope gate)
- Paid: 2026-07-05 — both workflows pin `actions/checkout@v5` / `actions/setup-node@v5`
  (Node 24 runtime); the scope-item-5 push's seed-ci run confirms it green with no Node-20
  deprecation warning —
  [seed-ci run 28752296476](https://github.com/fliip92/the-seed/actions/runs/28752296476),
  job annotations empty (the only `DEP0040 punycode` line is a Node-internal userland-module
  notice, not the Actions Node-20 runtime deprecation this entry tracked)
