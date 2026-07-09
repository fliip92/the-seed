# Entropy ledger

Known debt: priced, rated, with conversion paths (LAW-8: entropy is paid continuously).
Entry format is defined in [README.md](README.md) and enforced by
`.seed/checks/validate-plans.ts`. Paid-off entries move to the **Paid** section — the
ledger is also a record of digestion.

## Open

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
  [0011](../rings/0011-drift-advisory.md). First recurrence observed 2026-07-05 — the map's
  "Current state" named an already-landed scope item as next work, written up as
  [postmortem 0001](../postmortems/0001-agents-current-state-drift.md) (ring
  [0018](../rings/0018-map-current-state-drift-doc-only.md)); a *second* recurrence of this
  prose-state shape is the trigger to build the class

## E-011 — The current growth stage is stated in two places, unchecked

- First observed: 2026-07-05, enacting the Stage 1→2 transition (ring
  [0014](../rings/0014-stage-2-transition-approved.md))
- Where: [AGENTS.md](../../AGENTS.md) `Current state` states the stage in prose, and
  [.seed/checks/fitness.ts](../../.seed/checks/fitness.ts) hardcodes `CURRENT_STAGE`; both
  are bumped by hand on a transition (a deliberate choice noted in fitness.ts) and nothing
  checks the two agree
- Interest rate: low (the stage changes about once per stage, so the two rarely drift — but a
  forgotten bump would silently mislabel every fitness snapshot's `stage` until noticed)
- Price: small — a structural check that the `- **Stage:**` number in AGENTS.md and
  `CURRENT_STAGE` in fitness.ts name the same stage
- Conversion path: invariant — add the agreement check; it verifies the hand-bump rather than
  mechanizing the decision fitness.ts deliberately keeps manual, so it respects that comment
  while closing the LAW-2 gap. Fold into the next change touching either

## E-012 — repo-fitness walks the on-disk working tree, not `git ls-files`

- First observed: 2026-07-06, first exercise of the Stage 2 exit criterion — the read-only
  Scout of a foreign repo ([assessment 0001 — mottainapp](../assessments/0001-mottainapp.md),
  ring [0022](../rings/0022-assessment-organ-exit-criterion.md))
- Where: [.seed/lib/repo.ts](../../.seed/lib/repo.ts) `listRepoFiles` walks the directory tree
  with `readdirSync`, excluding only `.git`/`node_modules`/OS-noise dirs — it never consults
  `git ls-files`. So untracked files (build output, stray `.claude/worktrees/` snapshots) count
  toward `map_reachability`'s denominator and `drift_count`. On mottainapp the on-disk walk saw
  18,736 files against 691 git-tracked, and ~150 of 343 drift references came from ten untracked
  `.claude/worktrees/moire-*/` snapshots that git tracks zero files under
- Interest rate: low (it changed no verdict in assessment 0001 — each reading was robust against
  the tracked-only recount — but it would mislead on a target with a real map buried under
  untracked output, and the gap grows with a repo's untracked surface)
- Price: small — list files via `git ls-files` when the target is a git repo, falling back to the
  on-disk walk otherwise, so the metric denominators match the committed repository
- Conversion path: invariant — make the file listing tracked-files-aware for git targets, with a
  self-test pinning that untracked files no longer inflate the count; fold into the next
  repo-fitness change, or a dedicated fix before the instrument is pointed at hosts in earnest

## E-013 — the seed has only computational controls, no inferential ones

- First observed: 2026-07-08, metabolizing the awesome-harness-engineering `Foundations` section
  ([docs/references/harness-engineering.md](../references/harness-engineering.md)) — Böckeler's
  computational-vs-inferential controls distinction
- Where: every check in `.seed/checks/` is a deterministic structural gate
  (a *computational* control). The seed has no *inferential* control — no LLM-as-judge — so it
  cannot judge the quality of an agent's synthesis: whether a distilled reference stayed faithful
  to its source, whether a grill elicited completely, whether a generated doc hallucinated.
  Provenance + quote-match (the intake skill's mechanical guards) catch *fabrication*, but
  paraphrase *faithfulness* is not computationally checkable — it needs a judge
- Interest rate: low now, rising sharply the moment the seed ships knowledge-synthesis skills
  (intake, PRD authoring) and again at Flowering, where pollen quality is a behavioral property,
  not a structural one — an unjudged inferential output is trust taken on faith (LAW-6: a claim,
  not a change)
- Price: medium — an LLM-as-judge instrument that scores an inferential artifact against a stated
  rubric, with its inputs pinned so the verdict is reproducible enough to trend (LAW-9); the hard
  part is making a probabilistic control legible and enforceable (LAW-2) without pretending it is
  deterministic
- Conversion path: invariant — build the inferential-control instrument alongside the first skill
  that needs it (intake); until then the mitigation is compose-not-commit plus human ratification
  (the grounded-or-ask discipline), a doc-only control that keeps fabrication visible and gated

## E-014 — plans have no resumable, context-scoped work-unit format

- First observed: 2026-07-08, same metabolization — the long-horizon patterns (OpenAI's
  Plan.md/Implement.md artifacts, Meta's hibernate-and-wake checkpointing, LangChain's
  context-rot/compaction warning) in [docs/references/harness-engineering.md](../references/harness-engineering.md)
- Where: [docs/plans/](README.md) carry a prose progress log and a `Next actions` list, but no
  structured, context-scoped work-unit a fresh session — or a parallel [worktrees](../../skills/parallel-worktrees/SKILL.md)
  agent — can pick up cold without re-deriving context. The Gardener's "implement pieces across
  sessions without derailing, with efficient context/token usage, and parallel humans + machines"
  need has no artifact
- Interest rate: low now (solo, mostly single-session), rising as tasks span sessions and agents —
  re-derivation cost and derailment risk compound with task size and parallelism
- Price: medium — a work-unit / handoff format (scope + entry-context + done-when + owner) that a
  plan decomposes into and parallel-worktrees consumes; likely a plan-format enrichment plus a
  skill
- Conversion path: ring then invariant — decide the format as a ring (it touches the LAW-5 plan
  discipline), then enforce it structurally; sequence after the intake skill, and design it against
  the corpus's not-yet-metabolized "Planning & Task Decomposition" primitives rather than from
  first principles

## E-015 — the release / pollen-upgrade mechanism is designed but unbuilt

- First observed: 2026-07-06, worked out with the Gardener as the Stage 3 release/upgrade
  process; formalized into the ledger 2026-07-08 at the Stage 2 → 3 transition proposal
  ([plan 0005](active/0005-flowering.md))
- Where: no artifact yet — the design lived only in agent memory, and tribal knowledge is
  entropy (SEED.md §0). [pollen/](../../pollen/README.md) is empty and there is no release tool,
  so the seed cannot cut a versioned pollen release, record a descendant's lineage, or let a
  descendant adopt an upstream improvement
- Interest rate: low now, spikes to high at Stage 3 (Flowering's pollen work cannot begin
  without it) — the [E-004](entropy-ledger.md) shape
- Price: medium — a thin `.seed/` release/graft CLI, owned not imported (LAW-7: every mainstream
  release tool fails on commit grammar, [ring 0020](../rings/0020-onboard-human-generated-briefing.md)
  determinism, artifact shape, LAW-2 legibility, and the zero-dep clause), verbs
  `sense`/`graft`/`verify`/`feedback`/`uninstall`, self-carrying inside pollen; plus the
  determinism split (pure in-`run-all` pending notes, an append-only dated release history, a
  git-aware side-effecting cut-release out of `run-all`)
- Conversion path: ring then invariant — a founding release-process ring decides the open forks
  (the semver/migration trigger; improvement granularity, ring vs skill vs pollen-version; the
  framework/local ownership boundary), then the CLI and its verification land as
  [plan 0005](active/0005-flowering.md) scope (items 1–2). Propagation is re-metabolization, not
  `npm update`: an adopted upstream change becomes the descendant's own ring (its
  `plan-traceability` gate already refuses ringless changes), so "propose, never force" falls out
  for free

## Paid

## E-001 — `docs/generated/` hand-edit rule is stated but not enforced

- First observed: 2026-07-04, during germination
- Where: [docs/generated/README.md](../generated/README.md) declared hand-editing a lint
  error; no lint existed
- Interest rate: low (the directory was empty; compounded only once generators existed)
- Price: small — a generation manifest (source → artifact) plus a CI check that artifacts
  match regeneration
- Conversion path: invariant — build the manifest + check alongside the first generated
  artifact (Stage 1 closed with none; the directory stayed empty until Stage 2)
- Paid: 2026-07-05 (plan [0003](active/0003-growth.md) scope item 5, onboard-human; ring
  [0020](../rings/0020-onboard-human-generated-briefing.md)). The first generated artifact —
  [docs/generated/onboarding.md](../generated/onboarding.md), the onboard-human briefing —
  landed with its infrastructure: the generation manifest
  [.seed/lib/generated.ts](../../.seed/lib/generated.ts) (artifact → sources + a pure
  `generate(root)`) and the gate
  [.seed/checks/validate-generated.ts](../../.seed/checks/validate-generated.ts) (in `npm run
  check`), which re-runs each generator from the working tree and fails on a hand-edit, a
  source changed without regenerating, an unregistered file in `docs/generated/`, or a missing
  artifact. Generators are pure functions of repo files (no wall-clock), so an artifact
  regenerates byte-identically; determinism and each fire pinned by the self-tests (the E-007
  harness). `npm run generate` rewrites the artifacts.

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
