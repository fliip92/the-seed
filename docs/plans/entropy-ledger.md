# Entropy ledger

Known debt: priced, rated, with conversion paths (LAW-8: entropy is paid continuously).
Entry format is defined in [README.md](README.md) and enforced by
`.seed/checks/validate-plans.ts`. Paid-off entries move to the **Paid** section — the
ledger is also a record of digestion.

## Open

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
- **Trigger FIRED: 2026-07-27**, the fifth sensing pass (ring
  [0054](../rings/0054-prose-state-rots-where-work-stops-touching-it.md)) — two further recurrences in one
  sweep. [plan 0006](active/0006-pollination.md)'s step 5 named E-002/E-007/E-006 as *"Next"* (all landed
  2026-07-20) and called a pushed commit *"local, push Gardener-gated"* — and it is the section the map
  routes a fresh agent to; and the front door's six false state claims ([E-026](entropy-ledger.md)). Both
  contents are fixed; **the class is now owed an instrument**. What the pass also measured is why it was
  deferred and what it will cost: distinguishing a live claim from permanent history is the whole problem
  — ~19 correct provenance mentions of `Stage N` alone — so the class most likely lands as
  *generate-don't-detect* (E-026's path) for the countable half, plus a narrow detector for the shape that
  actually bit twice: a **plan's `Next actions` naming work its own progress log records as done**. That
  one is computable — both halves are in the same file, in formats the plan validator already parses

## E-017 — the seed asserts LLM/context efficiency but never measures it

- First observed: 2026-07-18, Gardener question comparing the seed's map/reference graph to
  graphify's token-optimization skill ("does our graph make the LLM more efficient?")
- Where: SEED.md §6 names no token/context-cost metric — the six v0 metrics measure structure
  (`map_reachability`, `enforcement_ratio`, `drift_count`, `plan_traceability`, `ledger_trend`)
  and human friction (`escalation_rate`), none the agent's own operating cost. The efficiency the
  seed's navigation graph is claimed to buy — bounded ≤3-hop reachability (LAW-4), curated
  compression ([docs/references/](../references/README.md) + the onboard-human briefing),
  never-re-derive (LAW-10 + rings) — is a design assertion, unmeasured, so LAW-9 (measure to
  judge) cannot arbitrate it. The blocking prerequisite is the very instrument `escalation_rate`
  already waits on: [.seed/lib/fitness-metrics.ts](../../.seed/lib/fitness-metrics.ts) returns it
  null with reason "no run-log instrument yet" — no per-task record captures tokens, context, or
  escalations
- Interest rate: low now (solo, small corpus the map already makes cheap to read), rising sharply
  at Pollination — proving the seed's value on a host is a before/after fitness trend (SEED.md §6),
  and "agents operate more cheaply after graft" is exactly the claim a fleet of hosts needs
  measured, not asserted
- Price: medium — the run-log instrument `escalation_rate` is already null on, recording per-task
  cost (tokens/context + escalations), plus a §6 metric defined over it; the hard part is a
  legible, reproducible-enough-to-trend reading of a noisy per-run quantity (LAW-2/LAW-9). Likely
  amends SEED.md §6, so Gardener-approved PR + ring (AGENTS.md Protocols)
- Conversion path: ring then invariant — decide the metric + instrument as a ring (it touches the
  §6 set and probably amends SEED.md, both Gardener-gated), then build the run-log instrument once
  and compute both this and the already-priced-null `escalation_rate` from it (one instrument, two
  metrics). Sequence against live [plan 0006](active/0006-pollination.md); the dither Scout
  ([assessment 0002](../assessments/0002-dither.md)) is the first real task whose cost it could
  record. Distinct from [E-014](entropy-ledger.md), which *reduces* re-derivation cost via a
  work-unit format — this *measures* the cost

## E-018 — no query-instead-of-read retrieval for scouting large hosts

- First observed: 2026-07-18, same Gardener question (graphify's "query the graph instead of
  grepping" token play), during the live Stage 4 Scout of dither
  ([assessment 0002](../assessments/0002-dither.md))
- Where: the seed's graph is navigational (follow the map to the artifact) and its compression is
  curated ([docs/references/](../references/README.md) distillations + the onboard-human briefing) —
  there is no queryable *content* surrogate: no `query "how does X work"` that traverses an index
  and returns a compact, budgeted answer instead of reading files. On the mother seed this is fine
  (small, map-indexed corpus — reading is already cheap). On a large foreign host it is not:
  Scout/Grill/Metabolize (SEED.md §4) read an unknown codebase — exactly where "query instead of
  grep" pays — and [repo-fitness](../../skills/repo-fitness/SKILL.md) returns mostly null against an
  ungrafted host (it measures absent seed-anatomy, not what the host does), so orientation cost
  falls on raw reading
- Interest rate: low now (first host; the scouting agent already has external graph/query tools at
  zero repo cost), rising as host size and the host fleet grow
- Price: medium–large for a native organ (an owned index + budgeted query/traverse, self-tested —
  LAW-6/LAW-7); ~zero to instead lean on an external graph tool during a Scout as a throwaway
  reading aid (no seed artifact, no dependency grafted)
- Conversion path: measure-then-decide — treat the live dither Scout as the experiment: use an
  external graph/query aid while scouting and record whether query-instead-of-read actually cut
  reading cost (the same measurement [E-017](entropy-ledger.md) is about); only if the saving is
  real and recurs across hosts, grow a native `query` organ via a plan + ring. Do not build it
  speculatively (LAW-7: own the small subset, and only once the need is evidenced). Host-facing
  tooling, not the mother seed's corpus

## E-022 — the seed's decisions about a host are recorded only in the seed, so they are invisible from inside the host

- First observed: 2026-07-27, the moment [E-020](entropy-ledger.md) was paid (ring
  [0051](../rings/0051-decision-log-shape-resolved-not-assumed.md)) and `plan_traceability` could read
  dither at all: it read a **decline** — 45.2% (28/62) pre-graft → 39.5% (30/76) today. The graft
  installed a commit→ADR traceability organ and then diluted the very metric that organ serves
- Where: the seed's commit convention (AGENTS.md § Protocols — every commit names the plan or ring
  governing it) names the **seed's** decision log, and the seed's rings are where every decision *about
  dither* is recorded: the four graft organs (rings [0037](../rings/0037-dither-map-gate-graft.md)–[0040](../rings/0040-dither-ledger-graft.md)),
  the import boundary, the map-completeness gate, the metric rescoping. Twelve of the fourteen commits the
  seed has landed on dither's `main` therefore cite *"Seed plan 0009 / E-NNN"* — a plan dither does not
  carry and cannot verify — while dither's own nine ADRs record none of it. The two that do trace do so
  incidentally (their bodies discuss ADR-0009). The metric decline is the *symptom*; the debt is that a
  dither maintainer reading dither's own decision log finds **no record of why six CI gates appeared in
  their repository**, and the pointer back to the governing ring exists only in commit prose
- Interest rate: medium, and it scales with the fleet — every host the seed touches accumulates
  seed-driven commits that trace to nothing locally, so the metric the seed uses to prove pollination
  value is depressed by pollination itself, on every host, permanently. It also cuts against the exit
  criterion's spirit (SEED.md §4: owners shipping through the agent workflow *without the seed being
  special*): decisions that live only in the mother make the seed a load-bearing external dependency for
  understanding the host. Bounded today only because dither has one graft and one reader
- Price: small–medium. The cheap half is the **commit convention** — a seed-authored commit on a host
  cites the host's decision record when one governs the change, alongside its own plan/ring. The real
  half is **where a host-shaping decision gets recorded**: an ADR (or the host's equivalent) landed *in
  the host* for decisions that change the host's shape, summarizing the ring and pointing at it, so the
  host's decision log is complete on its own terms. Not every seed commit needs one — dither's own gate
  deliberately does not require universal citation (ring [0038](../rings/0038-dither-adr-gate-graft.md)),
  and a gardening fix genuinely traces to no decision — so the target is not 100%, it is *no
  host-shaping change without a host-side record*
- Conversion path: **ring, then host mutation — owner-gated, not agent-convertible in full.** The seed
  half (the commit convention, and writing the host-side record as part of the change rather than after)
  is a ring and a protocol line in AGENTS.md. The host half mutates dither's ADR set, which is the
  owner's decision surface — SEED.md §4 gates mutating steps on owner review, and ring 0038 already
  established that dither's ADR practice is the owner's to define. Natural trigger: the next commit the
  seed lands on dither, which is the feature-track work the exit criterion is waiting on anyway. Once
  converted, dither's `plan_traceability` should start climbing again, and
  [pollination-dither.md](../fitness/pollination-dither.md) gets its next row — the check that the
  conversion actually worked

## E-026 — the public front door's state claims are hand-maintained and unread by any instrument

- First observed: 2026-07-27, the fifth sensing pass (ring
  [0054](../rings/0054-prose-state-rots-where-work-stops-touching-it.md)) — reading [README.md](../../README.md)
  against the tree it describes. Six claims were false, some for weeks: *21 rings* (53), *seven planted
  skills* (9 — `intake` and `judge` were missing from the list entirely), *two completed plans plus one
  active* (7 + 2), *principles … none stated yet* (grounded-or-ask, ring
  [0023](../rings/0023-grounded-or-ask-first-principle.md), stated a week before the README was last
  touched), *a **solo experiment*** (ring [0032](../rings/0032-stage-4-transition-first-host-dither.md)
  retired that), and *pollen … does not exist until Stage 3 … deliberately empty* (v0.1.0 cut 2026-07-16).
  The stage claim in the same file is [E-025](entropy-ledger.md), paid in the same pass because a gate
  already existed for it
- Where: [README.md](../../README.md) — the repository's public face (public by ring
  [0004](../rings/0004-name-hosting-visibility.md)) — plus, in principle, any hand-written count in a
  current-state doc. It **is** inside the [drift scan](../../.seed/checks/doc-drift.ts) surface, and the
  scan is honest about what it reads: `stale-path-reference` is the only class, so a path that stops
  resolving fires and a *number* that stops being true does not. `validate-map` reads links, not claims.
  `drift_count 0` was correct and blind at the same time
- Interest rate: medium, and it is the **only** entropy here with an audience outside the repository.
  Every count drifts monotonically the moment it is written; the file is edited only when someone
  remembers it exists (last touched 2026-07-15, twelve days and 32 rings before this pass). The specific
  cost is credibility: the document's own pitch is *"don't take it on faith — clone it and watch it verify
  itself"*, and the first numbers a visitor could check were the ones nothing checked. Bounded only by the
  project's obscurity
- Price: small–medium, and the shape is already owned. The seed generates artifacts from repo state and
  gates them byte-exact ([validate-generated](../../.seed/checks/validate-generated.ts), the generation
  manifest [generated.ts](../../.seed/lib/generated.ts), ring
  [0020](../rings/0020-onboard-human-generated-briefing.md), paying E-001). The counts are all pure
  functions of the tree — rings, plans, skills, principles, metrics — so the work is one generator plus
  the decision of how a *hand-written, voiced* README consumes it
- Conversion path: invariant — **generate, don't detect.** Add a `docs/generated/` state block (counts +
  the live fitness line) to the manifest, and have README link it rather than restate it; the
  regeneration gate then makes a stale count impossible instead of merely detectable. The alternative — a
  `stale-count` drift class — is second choice: it needs a regex over prose that distinguishes *"53
  rings"* (a live claim) from *"the four graft organs"* (permanent history), which is the same
  false-positive surface that keeps [E-009](entropy-ledger.md)'s prose class deferred. Do it when the next
  reader-facing change touches README, or immediately if the seed goes looking for readers. The content is
  correct as of 2026-07-27 — hand-fixed in the sensing pass — so the debt is the **enforcement**, not the
  current text

## E-027 — the map is 71% current-state narrative, restating what four other artifacts already record

- First observed: 2026-07-27, the fifth sensing pass (ring
  [0054](../rings/0054-prose-state-rots-where-work-stops-touching-it.md)), measuring the map's sections:
  **§ Current state is 198 of [AGENTS.md](../../AGENTS.md)'s 279 lines.** Its growth is the finding — 9
  lines on 2026-07-04, 35 on 07-05, 93 on 07-17, 135 on 07-27 morning, **198 by evening** — while every
  other section stayed flat across the same 23 days (Start here 10, Territory 19, Protocols 36, Laws 6)
- Where: [AGENTS.md](../../AGENTS.md) § Current state. The navigational half of the map does its LAW-4 job
  in ~80 stable lines; the narrative half is a **second progress log**, restating what
  [plan 0009](active/0009-dither-metabolize.md)'s progress log, this ledger's Paid notes, and the ring
  bodies each already record in full. Three costs, all real: every session (and every fresh agent, by
  instruction) reads it before doing anything; the human briefing
  [docs/generated/onboarding.md](../generated/onboarding.md) is generated *from* it, so bloat propagates
  to the artifact meant to be short; and it is the most drift-prone prose in the repository — the one
  place with its own [postmortem](../postmortems/0001-agents-current-state-drift.md) and a ring
  ([0018](../rings/0018-map-current-state-drift-doc-only.md)) that consciously left it doc-only, taken
  when the section was 35 lines and now 5.6× that
- Interest rate: medium and compounding by construction — each unit appends a paragraph and none removes
  one, so the entry point grows without bound while the thing it is *for* (orienting a fresh agent in
  three hops) degrades. It is also the substrate every prose-state defect this pass found grows in
- Price: small to execute, but the decision is not the agent's. The mechanical part is trivial (move the
  per-unit narrative behind the links that already carry it, leave a short state + pointer). What needs
  taste is the **fork**: (A) the map states *state* only — stage, live plan, correct first action,
  standing gates — and history lives one hop away in the plan; (B) the section is capped (a line budget,
  enforced like the architecture doc's one-page rule, ring
  [0015](../rings/0015-grill-the-gardener-architecture-doc.md)); (C) it is *generated* from the active
  plan's latest progress entries, which makes it unable to drift but also unable to be written well; or
  (D) it stays as-is, deliberately, because a self-describing repository would rather pay context than
  lose the narrative that makes it legible
- Conversion path: ring — the Gardener picks a fork, then the mechanical edit follows in the same unit.
  Held rather than converted because it edits the seed's own entry point on a matter of taste (the
  [E-012](entropy-ledger.md) precedent: sense it, price it, present the fork, do not choose unilaterally).
  Natural trigger: the next unit that would append another paragraph to § Current state — which is every
  unit, so the first one after a ruling

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
- Paid: 2026-07-05 (plan [0003](completed/0003-growth.md) scope item 5, onboard-human; ring
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

## E-015 — the release / pollen-upgrade mechanism is designed but unbuilt

- First observed: 2026-07-06, worked out with the Gardener as the Stage 3 release/upgrade
  process; formalized into the ledger 2026-07-08 at the Stage 2 → 3 transition proposal
  ([plan 0005](completed/0005-flowering.md))
- Where: the design lived only in agent memory (tribal knowledge is entropy, SEED.md §0) until it
  was priced here, its forks decided (ring
  [0026](../rings/0026-pollen-boundary-versioning-lineage.md)), and the machinery built across
  [plan 0005](completed/0005-flowering.md) scope items 1–2 — the boundary + version lines + lineage,
  then the release/graft CLI: the seed can now cut a versioned pollen release, compute a version bump
  from committed intent, carry a migration, and let a descendant `sense`/`graft` an upstream improvement
- Interest rate: low then, spiked to high at Stage 3 (Flowering's pollen work could not begin
  without it) — the [E-004](entropy-ledger.md) shape
- Price: medium — a thin `.seed/` release/graft CLI, owned not imported (LAW-7: every mainstream
  release tool fails on commit grammar, [ring 0020](../rings/0020-onboard-human-generated-briefing.md)
  determinism, artifact shape, LAW-2 legibility, and the zero-dep clause), verbs
  `sense`/`graft`/`verify`/`feedback`/`uninstall`, self-carrying inside pollen; plus the
  determinism split (pure in-`run-all` pending notes, an append-only dated release history, a
  git-aware side-effecting cut-release out of `run-all`)
- Conversion path: ring then invariant — **converted.** The founding ring
  ([0026](../rings/0026-pollen-boundary-versioning-lineage.md)) decided the forks and scope item 1
  landed [validate-pollen](../../.seed/checks/validate-pollen.ts); the build ring
  ([0027](../rings/0027-release-graft-cli.md)) and scope item 2 landed the CLI and its invariants.
  Propagation is re-metabolization, not `npm update`: an adopted upstream change becomes the
  descendant's own ring (its `plan-traceability` gate already refuses ringless changes), so "propose,
  never force" falls out for free
- Paid: 2026-07-15 ([plan 0005](completed/0005-flowering.md) scope item 2, ring
  [0027](../rings/0027-release-graft-cli.md)). The release model
  ([.seed/lib/release.ts](../../.seed/lib/release.ts)) — the single source of truth for how a release
  is composed, versioned, and recorded (read by the generator, the check, and the CLI) — plus the CLI
  ([.seed/checks/release.ts](../../.seed/checks/release.ts), `npm run release`) and the pure gate
  [validate-release](../../.seed/checks/validate-release.ts). The
  [ring 0020](../rings/0020-onboard-human-generated-briefing.md) determinism split is real: byte-exact
  [pending-release notes](../generated/pending-release.md) (via `validate-generated`), the append-only
  dated [release history](../../pollen/releases/README.md) (via
  [release-append-only.ts](../../.seed/checks/release-append-only.ts)), and the side-effecting
  `cut-release` verified by its dry-run. `graft`/`uninstall` are reserved for scope item 3 (the
  installer). 18 self-tests pin it (LAW-6); the first real release (v0.1.0) is cut by scope item 4

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
- Paid: 2026-07-17 ([plan 0005](completed/0005-flowering.md), ring
  [0030](../rings/0030-inferential-control-judge.md)) — a Stage 3 → 4 gating prerequisite cleared. The
  instrument is a **deterministic envelope around a probabilistic core**: the seed owns the envelope and
  never pretends the judgment is deterministic (the hard part, named above). The
  [judge](../../skills/judge/SKILL.md) skill (portable) performs the LLM-as-judge as a **host act
  outside the genome** — the seed carries no LLM client, so network-free + zero-dep + CI reproducibility
  hold (the ring-0021 compose-not-commit boundary); it is given only the pinned inputs (artifact +
  source + [rubric](../../skills/judge/rubrics/faithfulness.md)), blind to the composing context. The
  pure model [.seed/lib/judge.ts](../../.seed/lib/judge.ts) (LAW-3) defines the verdict schema, the
  rubric registry, the zero-dep content pin (`sha256:`, node's `createHash`), staleness, and the
  pinned-prompt renderers. Verdicts land dated + scored + input-pinned in
  [docs/judgments/](../judgments/README.md) (local history) — the LAW-9 trend record — and their
  **envelope** is gated by [validate-judgments](../../.seed/checks/validate-judgments.ts) in `run-all`:
  well-formed, pins resolve, and **fresh** (a stale verdict, whose judged artifact changed after
  scoring, fails), while the probabilistic score is trended, never gated (ring
  [0011](../rings/0011-drift-advisory.md)). The [judge CLI](../../.seed/checks/judge.ts) (`npm run
  judge`, out of `run-all`) assembles the pinned prompt side-effect-free. Intake's faithfulness residual
  — held doc-only until now — routes to it, composing the two-surface control (structural fabrication
  guard + inferential faithfulness judge). Verification (LAW-6): 18 self-tests — 14 envelope violation
  classes (incl. the staleness tooth) + the pristine-passes case + the CLI's works / teeth /
  side-effect-free / round-trip shape — plus the standing verdict on
  [harness-engineering.md](../references/harness-engineering.md). `npm run check` (13 checks) + `npm
  test` (231 cases) green; `drift_count` 0. Only [E-004](entropy-ledger.md) (Gardener trademark) now
  gates the Stage 3 → 4 transition proposal

## E-004 — "Seed" is an uncleared working codename

- First observed: 2026-07-03, planted in SEED.md §8
- Where: SEED.md §8, [ring 0001](../rings/0001-founding-defaults.md)
- Interest rate: low now, spikes to high at Stage 3 (pollen cannot ship under an uncleared
  name)
- Price: Gardener judgment plus a trademark search
- Conversion path: ring — the Gardener named it "The Seed" (ring
  [0004](../rings/0004-name-hosting-visibility.md)), which settles the name but not its
  legal clearance; a trademark search must still land before Stage 3 pollen distribution
- Paid: 2026-07-17 ([plan 0005](completed/0005-flowering.md), ring
  [0031](../rings/0031-name-cleared-codename-retained.md)) — the last Stage 3 → 4 gating
  prerequisite cleared. The **trademark knockout search** landed (the priced work): "Seed" /
  "The Seed" is a crowded, weak name in and around AI/dev software — senior in-space users
  (ByteDance's Seed family incl. the open-source `seed-oss`; seed.run's SEED CI/CD; SeedsAI /
  Seed AI / Seed Innovations), a registered bare wordmark (SEED, Seed Health, Inc., US Reg.
  5629609, another class), and a phonetic twin (Seeed Studio) — so a bare "Seed" wordmark for
  Nice Class 9/42 is realistically not registrable, and it is not needed. **The Gardener's
  judgment:** retain "The Seed" as a **non-exclusive, descriptive codename** — claim no
  trademark, seek no registration — cleared *for use* in the seed's open-source, non-commercial,
  private-repos posture (SEED.md §7), not owned as an exclusive mark. Enforcement is doc-only
  (the [ring 0004](../rings/0004-name-hosting-visibility.md) naming precedent): the seed makes no
  ™/® claim. Revisit-when a public *commercial* launch, a conflict/cease-and-desist, or a
  decision to register / adopt a distinct outward brand — with professional counsel — arises.
  With [E-013](entropy-ledger.md) also paid, the Stage 3 → 4 transition is no longer gated on a
  prerequisite; proposing it is the Gardener's (SEED.md §4)

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
- Paid: 2026-07-17 ([plan 0006](active/0006-pollination.md), Stage 4 step-1 pre-flight — owed
  before the Scout is pointed at the first real host, dither, in earnest). The metric engine now
  counts the **committed repository** for a git target:
  [.seed/lib/fitness-metrics.ts](../../.seed/lib/fitness-metrics.ts) lists the tracked files
  (`git ls-files -z`, read-only — it consults the index, so the Scout's byte-identical contract
  holds) via a new `trackedFiles(root)`, guarded by the same `gitRootStatus` the history metrics
  use. Untracked build output and stray `.claude/worktrees/` snapshots no longer inflate
  `map_reachability`'s denominator or `drift_count`. A non-git target, a nested subdirectory
  (measures itself, not the enclosing repo), or a git repo with no commit yet (nothing committed
  to match) degrades to the on-disk walk ([`listRepoFiles`](../../.seed/lib/repo.ts)) — so the
  recursive-upgrade proof's freshly-`git init`'d target still measures its uncommitted graft.
  Scoped to the metrics engine, not the seed's own working-tree gates (`run-all`, `doc-drift`),
  which must still validate uncommitted files; the seed's own tracked set equals its on-disk set,
  so its self-fitness is unchanged (self-equivalence with `fitness.ts` still pinned). Verification
  (LAW-6): a new self-test pins the contrast — an untracked file does not inflate `drift_count`,
  and the same file counts once committed — and the dangling-symlink crash-guard case now commits
  its broken symlinks so the tracked listing still exercises the skip-filter. `npm run check` (13
  checks) + `npm test` (232 cases) green; `drift_count` 0. End-to-end, a scratch host with ten
  untracked `.claude/worktrees/moire-*` snapshots (225 on-disk files vs 4 tracked) reported
  identical metrics before and after the junk (`map_reachability` 0.75, `drift_count` 0) — the
  mottainapp shape reproduced.

## E-016 — `map_reachability` hard-codes `AGENTS.md`, so a differently-mapped host reads null

- First observed: 2026-07-17, first Stage 4 *Scout* of a real host — the read-only
  [assessment 0002 — dither](../assessments/0002-dither.md) (plan
  [0006](active/0006-pollination.md) step 1)
- Where: [.seed/lib/fitness-metrics.ts](../../.seed/lib/fitness-metrics.ts) hard-codes the map
  filename (`const MAP = 'AGENTS.md'`); `mapReachability` returns null when the target has no
  `AGENTS.md`, with the stated reason "LAW-4's map entry point is absent". But a foreign host may
  carry an equally-conventional entry point under another name — dither's is `CLAUDE.md`
  (Anthropic's own default) plus a `CONTEXT-MAP.md` and a `README.md` front door — so the metric
  reports a well-mapped repo as mapless, and its null reason is factually wrong for that host. It
  is the [E-012](entropy-ledger.md) shape: a Scout instrument systematically under-reading a real
  host, surfaced by pointing it at one
- Interest rate: medium — it misfires on the common case (most non-grafted repos map under
  `CLAUDE.md` or `README.md`, not `AGENTS.md`), turning the single most load-bearing Scout reading
  into a false null on well-tended hosts; the damage is bounded only because the Scout's narrative
  catches it by hand (it did on dither), which does not scale to trend-tracking a fleet of hosts
- Price: small–medium — resolve the host's entry point rather than assume a fixed filename: either
  a known-name set (`AGENTS.md`, `CLAUDE.md`, `README.md`) tried in priority order, or an explicit
  Scout parameter naming the map, reporting the resolved filename alongside the metric so the
  reading stays legible (LAW-2); plus self-tests pinning that a `CLAUDE.md`-mapped repo computes a
  real fraction instead of null
- Conversion path: invariant — make the map filename a resolved input to `mapReachability` (the
  ring [0016](../rings/0016-repo-fitness-generalizes-the-metric-engine.md) generalization already
  isolated it to one constant), self-tested; fold into the next repo-fitness change, or a
  dedicated fix before the reachability gate is grafted onto dither — the graft's first lint
  depends on which file is canonical, a choice the [assessment 0002](../assessments/0002-dither.md)
  Grill agenda routes to the owner
- Paid: 2026-07-18 ([plan 0007](active/0007-dither-graft.md) graft item 1 — the seed-side
  prerequisite; the graft's owner gate was approved in
  [ring 0034](../rings/0034-dither-graft-approved.md)). `map_reachability` now RESOLVES the target's
  entry map from an agent-map name set — `AGENTS.md`, then `CLAUDE.md`
  ([`resolveMapFilename` / `MAP_FILENAMES`](../../.seed/checks/validate-map.ts)) — instead of
  hard-coding `AGENTS.md`, so a host mapped under a conventional non-`AGENTS.md` name is measured,
  not read as a false null. `analyzeReachability` now takes the resolved filename as a parameter
  (the seed's own `validate-map` GATE stays `AGENTS.md`-strict — it enforces the seed's law, not a
  host convention), and the resolved filename rides in the metric note so the reading stays legible
  even when it computes (LAW-2). **`README.md` is deliberately excluded** from the set — a human
  front door is not an agent map ([ring 0033](../rings/0033-dither-grill-outcomes.md) rejected it
  for dither) — so a README-only repo still reads a null `map_reachability`, the honest "no agent
  entry point" finding. Chose the known-name resolver over an explicit Scout parameter: it is
  zero-config and generalizes to the whole host fleet. Verification (LAW-6): a new self-test pins
  that a `CLAUDE.md`-mapped host computes a real fraction with a naming note (not a false null),
  while the foreign-repo degradation and recursive-upgrade tests still pass unchanged. `npm run
  check` (13) + `npm test` (233) green. Demonstrated read-only on dither: `map_reachability`
  **null → 1.4% (reachable from `CLAUDE.md`)**, dither byte-identical (HEAD `919a3b6`, clean tree) —
  the low fraction is the real finding (the current `CLAUDE.md` reaches almost none of the territory
  in ≤3 hops), which the graft's reachability gate + a canonical map will raise.

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
- Paid: 2026-07-19 (ring [0035](../rings/0035-stage-agreement-invariant.md)) — converted during
  the [plan 0007](active/0007-dither-graft.md) dither-graft pause as the highest-certainty free
  ledger item (LAW-8: pay entropy continuously while the live step is gated). The agreement is now
  a structural check: [.seed/checks/validate-stage.ts](../../.seed/checks/validate-stage.ts) (in
  `run-all`) reads the `- **Stage:**` number from [AGENTS.md](../../AGENTS.md) and `CURRENT_STAGE`
  from [.seed/checks/fitness.ts](../../.seed/checks/fitness.ts) and fails naming LAW-2 when they
  disagree — verifying the hand-bump, not mechanizing the deliberately-manual decision (fitness.ts's
  comment stands). It fires **only when both are stated and differ**, so a grafted host — which
  carries the portable `run-all` + copied fitness.ts but whose map template tracks no genome stage
  (ring [0026](../rings/0026-pollen-boundary-versioning-lineage.md)) — is not bound, while the seed,
  always stating both, is. Verification (LAW-6): a new self-test seeds a disagreement (bump
  fitness.ts's `CURRENT_STAGE` +1 relative to the map) and asserts the check fires with a law-naming
  message and exit 1; the pristine copy passes. `npm run check` (14 checks) + `npm test`
  (234 cases) green; `drift_count` 0.

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
- Paid: 2026-07-19 ([plan 0008](completed/0008-work-unit-format.md), ring
  [0036](../rings/0036-work-unit-format.md)) — converted during the
  [plan 0007](active/0007-dither-graft.md) dither-graft pause as a free ledger item (LAW-8), after
  [E-011](entropy-ledger.md) (ring 0035). The seed's plans now carry an **optional, context-scoped
  work-unit format**: a `## Work units` section a plan MAY decompose into when it spans sessions or
  parallel [worktrees](../../skills/parallel-worktrees/SKILL.md) agents, each `### U<n> — <title>`
  unit holding **Status / Scope / Entry-context / Done-when / Owner** (+ optional Depends-on) —
  Entry-context being the cold-start payload a fresh session reads *instead of* re-deriving the whole
  plan (Meta's hibernate-and-wake + LangChain's context-rot,
  [harness-engineering.md](../references/harness-engineering.md)). Enforced **conditionally** (the
  ring-0035 shape): [validate-plans.ts](../../.seed/checks/validate-plans.ts) validates each unit
  only when a plan has the section, so every prior plan and every small single-session plan stays
  valid; the check pins the `### U<n>` shape, id-uniqueness, a valid Status enum, and the four
  required fields, naming LAW-5. Documented in [docs/plans/README.md](README.md) and consumed by
  [parallel-worktrees](../../skills/parallel-worktrees/SKILL.md)'s Decompose step (each unit with no
  unmet Depends-on can own a worktree). Dogfooded: [plan 0008](completed/0008-work-unit-format.md)
  decomposed its own build into U1–U4. Grounded in the already-metabolized long-horizon subsection +
  the seed's own plan experience, not a fresh intake of the awesome-harness-engineering "Design
  Primitives" section (still unmetabolized — the ring is supersedable when that pass lands).

## E-019 — `map_reachability` counts all files, so it floors on a product monorepo

- First observed: 2026-07-20, the E-007 map-reachability-sweep pre-flight on the first host
  ([plan 0009](active/0009-dither-metabolize.md) refactor track) — measuring dither's stranded
  knowledge to scope the gardening surfaced that the metric itself under-reads
- Where: [.seed/checks/validate-map.ts](../../.seed/checks/validate-map.ts) computed the fraction over
  `files.length` — every tracked file. On the seed (almost all `.md` + machinery indexed by
  `.seed/README.md`) that reads a true ~100%, but on a product monorepo most files are source navigated
  by code tooling, not the doc map: dither has **283 of 386 tracked files as source**, capping the
  metric near ~15% however well the docs are tended. It stopped tracking doc navigability — the health
  it exists to measure — the same Scout-instrument-under-reads-a-real-host shape as
  [E-012](entropy-ledger.md) / [E-016](entropy-ledger.md), surfaced by pointing it at dither
- Interest rate: medium — it does not misfire to null (E-016) but it flattens: the one metric meant to
  prove doc-gardening value on a host is nearly insensitive to it (linking every stranded dither doc
  moves it 11.9% → ~15%), so a rising-navigability trend is invisible in the number the pollination
  before/after leans on
- Price: small — scope the fraction's denominator (and numerator) to knowledge artifacts (`.md`),
  leaving the unreachable-file VIOLATIONS untouched so each host keeps its own reachability policy (the
  seed's GATE stays total-reachability-strict; dither still gates only broken links); self-test the
  scoping; update SEED.md §6's one-line definition
- Conversion path: invariant — rescope the fraction inside the single shared `analyzeReachability`
  (ring [0016](../rings/0016-repo-fitness-generalizes-the-metric-engine.md) already made it the one
  definition), self-tested; fold into the E-007 sweep that surfaced it
- Paid: 2026-07-20 (ring [0043](../rings/0043-map-reachability-scoped-to-knowledge-artifacts.md)) —
  `map_reachability` now counts only knowledge artifacts (`.md`): `analyzeReachability` derives
  `reachableCount` / `knowledgeTotal` from the markdown docs reachable ≤3 hops, source/config excluded.
  The GATE is unchanged — the seed still enforces total reachability over every file, dither still gates
  broken links only — so no host's policy shifts; only the reported metric is rescoped, and metric/gate
  now answer different questions. The seed reads **100% (94/94 docs)**, unchanged in value; dither reads
  **11.9% → 32.9%** on re-copy (source no longer floors it), the honest doc-navigability the E-007
  gardening raises toward ~48% (the residual being 43 vendored `.agents/skills/*.md` + a test fixture,
  left to a separate decision — ring 0043 Revisit). Verification (LAW-6): a new self-test pins that an
  unreachable non-doc file leaves the metric at 1.0 (the twin of the existing unreachable-`.md`-drops-it
  case). SEED.md §6's definition updated. `npm run check` + `npm test` green.
  Verification (LAW-6): six new self-tests — five fire on a malformed unit (missing field, id-less
  heading, invalid Status, duplicate id, empty section) with a LAW-5 message + exit 1, and one holds
  (a well-formed multi-unit plan passes), atop the pristine copy now carrying plan 0008's real units.
  `npm run check` (14 checks) + `npm test` (240 cases) green; `drift_count` 0.

## E-021 — the working-tree gates ignore git's ignore rules, so a git-ignored file fails `npm run check`

- First observed: 2026-07-27, during the U10 fitness-cadence pass ([plan 0009](active/0009-dither-metabolize.md),
  ring [0049](../rings/0049-dither-pollination-proof-exit-criterion-half-met.md)) — the agent tool wrote
  `.claude/settings.local.json` (a permission grant) into the working tree mid-session, and the repo's two
  done-criteria went from green to **3 `npm run check` violations and 26 of 241 failing self-tests**, with
  `git status` still reporting a **clean tree**. Measured both ways: with that one file held aside, checks
  and all 241 self-tests pass
- Where: [`listRepoFiles`](../../.seed/lib/repo.ts) walks the directory with `readdirSync`, skipping only a
  hardcoded `EXCLUDED_DIRS` / `EXCLUDED_FILES` set (`.git`, `node_modules`, OS noise). It never consults
  git's ignore rules, so a file git has *already declared out of the repository* — here via the user's
  global `~/.config/git/ignore`, but repo `.gitignore` and `.git/info/exclude` behave identically — is
  still walked. Every working-tree gate inherits it: `validate-map` demands the file be reachable ≤3 hops
  from AGENTS.md (LAW-4), `validate-pollen` demands its top-level directory be classified in the pollen
  manifest (LAW-3), and `doc-drift` scans it. The **self-tests inherit it twice over**, which is where the
  26 failures come from: each fixture copies the tree into a scratch repo and asserts the pristine copy is
  green, so one ignored file in the source tree fails every one of them at once The repository therefore has **two disagreeing definitions of
  "what is in this repository"** — git's ignore rules and `repo.ts`'s hardcoded set, which already
  duplicates `.gitignore`'s `node_modules/` and `.DS_Store` entries. That duplication is the LAW-3 break in
  miniature: one invariant, two implementations, now observably out of sync. It also falsifies the standing
  assumption recorded in [E-012](entropy-ledger.md)'s Paid note — *"the seed's own tracked set equals its
  on-disk set, so its self-fitness is unchanged"* — which held only until an agent tool wrote local state
- Interest rate: high — it breaks the repo's own done-criterion on the Gardener's machine (AGENTS.md
  Protocols: `npm run check` green before any change is claimed done) for a file they never authored and
  cannot see in `git status`, and it presents as a contradiction — clean tree, red check — that costs a
  session's trust before it is diagnosed. It is silent in CI (a clone has no ignored local state), so it
  fires *only* on a real working machine, the worst place for a false alarm. Every agent tool that writes
  local state (editor dirs, `.claude/`, worktree snapshots) is a new trigger, so it recurs by default
- Price: small — resolve "not repo content" from git rather than a hardcoded list: filter `listRepoFiles`
  through `git check-ignore --stdin` (or list `git ls-files` plus `--others --exclude-standard`) when the
  root is a git repo, keeping the on-disk walk as the non-git fallback — the exact fallback shape
  [E-012](entropy-ledger.md) already built for the metrics engine, so the pattern is proven here. **The
  intent E-012 protected is preserved:** an uncommitted, non-ignored file is still walked and still
  gated — only files git has been *told* to ignore drop out
- Conversion path: invariant — one change inside `listRepoFiles`, self-tested with the pair E-012's own
  test used (an ignored file does not trip the gates; the same file, un-ignored, still does), plus a case
  pinning that global-ignore and repo-`.gitignore` rules are honored alike (the observed trigger came from
  the *global* file). Fold into the next change touching `repo.ts`. Two smaller questions ride along and
  should be settled in the same pass rather than separately: whether `EXCLUDED_DIRS`/`EXCLUDED_FILES`
  survives at all once git is the source of truth (it should shrink to `.git` itself), and whether the
  repo's own `.gitignore` should name `.claude/` explicitly so the exclusion does not depend on a
  machine-local global file that a second Gardener would not have
- Paid: 2026-07-27 (ring [0050](../rings/0050-gates-honor-git-ignore-rules.md)) — the gates now take
  their file set from git. [`listRepoFiles`](../../.seed/lib/repo.ts) still walks the tree, then filters
  it through `git ls-files --cached --others --exclude-standard`: tracked files plus untracked ones no
  ignore rule covers, so repo `.gitignore`, the user's global `core.excludesFile`, and
  `.git/info/exclude` are all honored because **git** honors them — one definition of repository
  membership (LAW-3), not a hardcoded list drifting beside it. The old set survives as the non-git
  fallback (a target with no ignore rules to consult keeps the unfiltered walk) and as a walk-cost guard
  on `node_modules`. **The gates' set stays deliberately broader than the metrics'** — E-012 scoped
  metrics to the committed repository and left the gates judging the working tree, since a pre-commit
  gate that ignores uncommitted work is pointless — so an uncommitted file is still gated and only an
  ignored one drops out; a *tracked* file is never ignored, exactly as git treats it. Both halves were
  load-bearing: the self-test fixtures had the same defect (`copyRepo` raw-copied the tree, so one
  ignored file broke 26 cases at once) and now assemble from `listRepoFiles`, sharing the gates'
  definition. `.claude/settings.local.json` is named in the repo's own
  [`.gitignore`](../../.gitignore), so the exclusion no longer depends on one machine's global file.
  **dither is unaffected** — its grafted runners already list via `git ls-files -z`, chosen at graft
  time; the mother converged on the practice her own host was already following, and the fix ships to
  descendants as a `patch` pollen intent, not a hand-copy. Verification (LAW-6): three self-tests (244
  total) — the four-step contrast on one file (gated uncommitted → silent once ignored → gated again
  once tracked), a `core.excludesFile` case pinning *the source that actually bit*, and the non-git
  fallback; neutering the filter turns the first two red and returns the 26 fixture failures.
  `npm run check` (18 checks) + `npm test` (244) + `npm run garden` (`drift_count` 0) green **with the
  ignored file present** — the condition that broke everything.

## E-020 — `plan_traceability` only knows plans and rings, so it reads null on an ADR-governed host

- First observed: 2026-07-27, landing the dither **pollination proof**
  ([pollination-dither.md](../fitness/pollination-dither.md); [plan 0009](active/0009-dither-metabolize.md)
  fitness-cadence item, ring [0049](../rings/0049-dither-pollination-proof-exit-criterion-half-met.md)) —
  the before/after-graft measurement is the one reading where the blindness has a visible cost
- Where: [`planTraceability`](../../.seed/lib/fitness-metrics.ts) resolves the target's decision log by
  looking for numbered files under `docs/rings/` and `docs/plans/{active,completed}/` only; finding
  neither it returns null with the reason *"no plans or rings — no decision log to trace commits to"*.
  For dither that reason is **factually false**: dither keeps nine numbered ADRs under `docs/adr/`, its
  commits cite them, and the seed itself grafted the gate that *enforces* commit→ADR traceability (ring
  [0038](../rings/0038-dither-adr-gate-graft.md), the second of the four graft organs). So the metric
  reports "no decision log" about a host whose decision log the seed mechanically polices — the
  [E-016](entropy-ledger.md) shape (a Scout instrument systematically under-reading a real host,
  surfaced by pointing it at one) recurring on the sibling metric
- Interest rate: medium — it does not merely under-read, it **hides a graft organ from the pollination
  proof**: `plan_traceability` null → null is the one row of dither's before/after where an installed,
  green, enforcing organ shows no delta at all (SEED.md §6's stated purpose for fitness is proving
  pollination value with before/after measurement). The cost scales with hosts, since ADRs are the
  common decision-record convention in repos that have one at all, and the seed's own reading stays
  correct either way, so nothing local surfaces it
- Price: small–medium — resolve the target's *decision-log shape* rather than assume the seed's own,
  the [E-016](entropy-ledger.md) `resolveMapFilename` move one level up: recognize numbered
  `docs/adr/NNNN-*.md` as a decision log, extend the commit-message reference extractor to `ADR-NNNN` /
  `ADR NNNN` alongside `plan`/`ring`, and report the resolved shape in the metric note so the reading
  stays legible (LAW-2); self-tests pinning that an ADR-governed fixture computes a real fraction and
  that a repo with no decision log still reads null. The genuinely uncertain part is not the code but
  the **definition**: whether "traces to a decision record" is one metric over a resolved shape or two
  metrics that should not be averaged across hosts
- Conversion path: **ring, then invariant — Gardener-gated, not agent-convertible.** Unlike E-016 (a
  filename set, no definition change), teaching the metric a second decision-log shape changes SEED.md
  §6's stated definition (*"% merged PRs tracing to a plan or ring"*), and both §6 ("When a metric stops
  correlating with real health, propose its replacement — via ring") and the genome's amendment rule
  (SEED.md: "amend only via approved PR + ring") route a §6 edit to the Gardener. Hence priced Open and
  held, not converted in-pass — the [E-012](entropy-ledger.md) fork precedent. Fold the build into the
  next repo-fitness change once the ring lands; until then dither's proof states the null is wrong
  rather than quoting it
- Paid: 2026-07-27 (ring [0051](../rings/0051-decision-log-shape-resolved-not-assumed.md), on the
  Gardener's ruling — *"fix E-020"*). `plan_traceability` now **resolves the target's decision-log
  shape** instead of assuming the seed's: numbered plans and rings, or numbered ADRs under `docs/adr/`
  ([`resolveDecisionLog`](../../.seed/lib/repo.ts)), with a citation counted only when the record it
  names exists in the repository being measured. **SEED.md §6 is amended** to *"% commits tracing to a
  decision record the repository carries — a plan or ring, or an ADR"*, which also retires the row's
  older inaccuracy (*"merged PRs"*; the metric has walked full non-merge commit history since
  [plan 0002](completed/0002-rooting.md)). The **metric name is deliberately unchanged** — the key is
  the schema of every dated snapshot in [docs/fitness/history/](../fitness/history/README.md), and
  renaming it would break the trend series to buy a better word; the resolved shape rides in the metric
  note instead (LAW-2). The seed's own plan-traceability **gate** stays plan/ring-strict — it enforces
  the seed's law, not a host convention — exactly the split [E-016](entropy-ledger.md) drew for
  `validate-map`, and the seed's own reading is unchanged at 100%. The ADR citation forms are a
  deliberate **superset** of the host gate's (`ADR-0009`, slash-lists, `docs/adr/0009-` paths, plus the
  prose `ADR 0009`): a metric stricter than the gate enforcing the same norm under-reads the host it
  measures, which is this entry recurring one level down. **dither now reads 39.5%, note "traced against
  9 ADRs (docs/adr/)", where it read null this morning** — the graft organ that was invisible in its own
  pollination proof is visible. Fixing the instrument changed the finding: the row moved **45.2%
  pre-graft → 39.5% today**, a decline caused by the seed's own commits citing the seed's plan rather
  than dither's decision record — priced as [E-022](entropy-ledger.md) and reported in
  [pollination-dither.md](../fitness/pollination-dither.md) rather than smoothed. Verification (LAW-6):
  two self-tests (**246** total, was 244) — an ADR-governed host driven through all three citation forms
  plus a dangling `ADR-0042`, pinned at exactly 3/6 with the shape named in the note; and a repo keeping
  **both** rings and ADRs, where a citation of either traces (the case that catches ADR support shadowing
  the seed's own shape) — plus the updated no-decision-log case pinning the corrected null reason.
  Test-of-the-test: removing the `adr` shape turns exactly those two red. `npm run check` (18) +
  `npm test` (246) + `npm run garden` (`drift_count` 0) green; no dither mutation (the defect was the
  mother's instrument, not the host)

## E-023 — portable machinery has changed three times since the v0.1.0 cut with no declared release intent

- First observed: 2026-07-27, declaring this pass's own pollen intent ([E-020](entropy-ledger.md), ring
  [0051](../rings/0051-decision-log-shape-resolved-not-assumed.md)) — reading
  [pollen/pending.md](../../pollen/pending.md) to add a line showed it holding exactly one, for ring 0050
- Where: the release model composes a release from **committed intent** (ring
  [0026](../rings/0026-pollen-boundary-versioning-lineage.md)): every change to the portable subtree
  declares its impact in `pending.md`, and the next version is a pure function of the maximum declared.
  But three portable-machinery changes have landed since the v0.1.0 cut (2026-07-16) without touching
  that file — `99ecc96` (E-012: the metrics engine counts the committed repository), `89c6b9e`
  ([E-016](entropy-ledger.md): `map_reachability` resolves the host's map filename), and `a9779fa`
  ([E-019](entropy-ledger.md): the fraction counts knowledge artifacts). All three change
  [`.seed/`](../../.seed/README.md), all three are portable by the manifest, and all three move a metric a
  descendant computes. Only ring 0050 and this pass declared. So `pending.md` — the artifact whose whole
  job is to be the truthful unreleased delta — currently **under-declares it**, and the generated
  [pending-release notes](../generated/pending-release.md), which are byte-exact-gated and therefore look
  authoritative, inherit the omission
- Interest rate: medium and compounding by construction — the gap is invisible until a release is cut,
  and then it is baked into append-only history: v0.2.0's notes would credit two rings while shipping
  five changes' worth of behavior, so a descendant reading the release to decide whether to upgrade is
  told less than it is getting. It is the LAW-2 shape exactly — a rule that is legible (the format is
  documented) and *not* enforceable (nothing fails when a portable change declares nothing) — and every
  future portable change inherits it. The counterweight: the decision log is the real changelog (rings
  are complete), so the information exists, just not where the release model reads it
- Price: small for the gate, a judgment call for the backfill. The gate: `pending.md` (or the release
  history) must account for every ring whose commit touched a portable path since the last cut —
  computable from git + the pollen manifest, which the seed already owns, and it fails in CI rather than
  at cut time. The backfill is the part that needs a decision, not code: whether to declare the three
  retroactively now (making v0.2.0 honest), or record them in the release as "composed before the intent
  discipline was enforced"
- Conversion path: invariant — a check in `npm run check` (or a clause in
  [validate-pollen](../../.seed/checks/validate-pollen.ts), which already owns the manifest) asserting
  that every portable-touching ring since the last cut appears in `pending.md`, self-tested with the pair
  that matters: a portable change with no intent fails, the same change with one passes. Do it **before
  the next release is cut**, since a cut freezes the omission into append-only history; the backfill
  question rides with it and is a Gardener call
- Paid: 2026-07-27 (plan [0009](active/0009-dither-metabolize.md) U13; ring
  [0052](../rings/0052-portable-changes-declare-their-intent.md), on the Gardener's ruling *"fix
  E-023"*). The invariant is [pollen-intent.ts](../../.seed/checks/pollen-intent.ts), a **CI gate**
  rather than a `run-all` check — the window and the commit messages are git history, and `run-all`
  stays a pure function of the working tree. It asserts a **state**, not a diff: no base ref, a window
  fixed by the commit that added the newest release file, re-judged every run — so a green run is the
  precondition for a cut and an omission cannot slip through between pushes. What is portable comes from
  the [manifest](../../.seed/lib/pollen.ts), never a second list (LAW-3); what accounts for a commit is a
  decision record its message cites, which composes with the traceability gate already guaranteeing every
  commit names one. **Two findings changed the entry as written.** First, the intent grammar had to widen
  to `[plan NNNN]` as well as `[ring NNNN]`: the seed's commit convention permits a plan-only citation and
  one real commit uses it (`99ecc96`), so a plan-governed portable change could not be declared at all —
  the release model was narrower than the decision-record vocabulary SEED.md §6 defines (as amended by
  ring [0051](../rings/0051-decision-log-shape-resolved-not-assumed.md)). Second, **this entry priced
  three; git found eight**: of ten portable-touching commits since the cut, eight were undeclared — the
  judge organ (ring 0030), the Stage-4 machinery residue (ring 0032), `validate-stage` (ring 0035), the
  work-unit format (ring 0036) and the fitness JSON shape (ring 0049) had gone unnoticed by the reading
  pass that priced this. Pricing by eye under-read the debt by five of eight; the instrument found what
  the eye did not, one more time. **The backfill fork resolved to "declare now"** (fork A): all eight are
  now intents, so v0.2.0 will credit eleven decisions instead of two — the alternative required a
  grandfather boundary inside portable machinery, shipped to every descendant forever, to remember one
  mother's one-time omission. The version outcome is unchanged (ring 0051's `minor` already set v0.2.0);
  what changed is that the release now describes what it ships. **dither needs no mutation** — its graft
  carries a scoped engine and no release model at all. Verification (LAW-6): six self-tests (**252**
  total, was 246) — undeclared portable change fails, ring-cited intent passes, plan-cited intent passes,
  non-portable change needs none, non-git tree skips, plus a dangling plan citation caught in the pure
  half; neutering the accounting turns exactly the fail case red, and narrowing the grammar back to
  ring-only turns the plan case red plus 27 more (this repo's own pending.md becomes malformed — the
  widening is load-bearing). `npm run check` (14 checks) + `npm test` (252) + `npm run garden`
  (`drift_count` 0) green, and the gate green on real history: 10 portable-subtree commits since
  `c514a6ce929b`, 11 intents.

## E-024 — the rings index is not enforced complete, and three rings were missing from it

- First observed: 2026-07-27, adding ring 0052's index line during the [E-023](entropy-ledger.md)
  conversion — the [rings README](../rings/README.md) listed 48 of the 51 rings that existed: **0049,
  0050 and 0051 had never been added**, three consecutive rings, all landed within the previous two days
- Where: [docs/rings/README.md](../rings/README.md) carries the ring index, and its own Procedure step 1
  says *"take the next free number (check the list above — and add your ring to it)"*.
  [validate-rings](../../.seed/checks/validate-rings.ts) enforces filenames, sequence and the field
  format; nothing checks that a ring **appears in the index**. `validate-map` does not catch it either —
  a ring stays reachable through the plan that cites it, so the map metric reads 100% while the index it
  is nominally built from is stale. The same hole exists for the other numbered organs with README
  indices (plans, postmortems, assessments, judgments); rings is where it has actually bitten
- Interest rate: medium. Each miss is invisible (nothing fails) and permanent unless someone notices, so
  the index degrades monotonically — and it is the artifact an agent is told to read to find the next
  free number and to see what has already been decided (LAW-10: never ask what a ring already answers).
  An index silently omitting the three most recent rings sends exactly the reader who needs them to the
  wrong answer. Bounded today only because the ring *files* are the source of truth and the index is a
  convenience
- Price: small — the mother already owns the shape she grafted into her host: dither's
  [map-completeness gate](../rings/0046-dither-map-completeness-gate.md) asserts every workspace appears
  in each of three layout maps, with the eighth principle `maps-are-complete`. This is the same invariant
  over `docs/rings/*.md` → `docs/rings/README.md`, and it generalizes to the other numbered organs for
  little extra
- Conversion path: invariant — a clause in `validate-rings` (or a small shared helper the numbered-organ
  validators call) asserting every `NNNN-*.md` in the organ's directory is linked from that organ's
  README, self-tested with the pair: an unindexed ring fails, the same ring indexed passes. Fold into the
  next change touching the ring validator. The three missing entries were written by hand in the E-023
  pass, so the debt is the *enforcement*, not the current content
- Paid: 2026-07-27 (plan [0009](active/0009-dither-metabolize.md) U14; ring
  [0053](../rings/0053-numbered-organs-index-every-entry.md), on the Gardener's ruling *"fix E-024"*).
  The invariant is [`indexCompletenessViolations`](../../.seed/lib/repo.ts) — one shared helper, called
  by the validators of **all five** numbered organs (rings, plans per directory, postmortems,
  assessments, judgments), so the rule has one definition and one message (LAW-3) while the violation
  carries the calling check's id and sends the agent to the organ whose format it broke. It is a
  `run-all` **clause**, not a gate: unlike [E-023](entropy-ledger.md)'s sibling one unit back, the
  question is a pure function of the working tree, and it fires before the commit, which is the only
  moment the fix is one line. The entry priced rings and noted the class; **the class was paid on day
  one** — one helper, five call sites, four extra self-tests — and two validators' own headers had
  already been asserting *"indexed by the README"* as though it were enforced. Building it moved the
  active/⇄completed/ link resolver (ring [0013](../rings/0013-plan-links-resolve-across-active-completed.md))
  from `validate-map` into [lib/repo.ts](../../.seed/lib/repo.ts): *"does this link point at that plan"*
  now has two askers, and two implementations would eventually disagree about whether a closing plan is
  indexed. Verification (LAW-6): seven self-tests (**259**, was 252) — a reachable-but-unindexed entry
  fails in each of the five organs, the hole itself is pinned (an unindexed ring reddens `validate-rings`
  **while `validate-map` stays green**), and the same ring indexed passes; the test-of-the-test neuters
  the helper (exactly the six fail cases red) and narrows its resolution to literal paths (the two
  ring-0013 plan-link cases red). `npm run check` (14) + `npm test` (259) + `npm run garden`
  (`drift_count` 0) green. Declared a `minor` [pollen intent](../../pollen/pending.md). Checked and
  **not** priced: the slugged organs (`skills/`, `docs/references/`, `docs/principles/`,
  `docs/architecture/`) are all currently index-complete, so generalizing the membership rule to them
  waits on evidence (LAW-7) — it is the ring's Revisit trigger, not a new entry

## E-025 — the growth stage is stated in a third place the stage gate does not know about

- First observed: 2026-07-27, the fifth sensing pass (ring
  [0054](../rings/0054-prose-state-rots-where-work-stops-touching-it.md)) — [README.md](../../README.md)
  read *"currently at **Stage 2 — Growth** … entered 2026-07-05"* while the repository has been at Stage 4
  since 2026-07-17 (ring [0032](../rings/0032-stage-4-transition-first-host-dither.md)). **Ten days wrong,
  on the public front door**, with a stage-agreement gate green the whole time
- Where: [validate-stage](../../.seed/checks/validate-stage.ts) proved agreement between exactly **two**
  hand-bumped places — the map's `- **Stage:** N` bullet and `CURRENT_STAGE` in
  [fitness.ts](../../.seed/checks/fitness.ts) — because those were the two that existed when
  [E-011](entropy-ledger.md) was priced (ring [0035](../rings/0035-stage-agreement-invariant.md)). README's
  *"currently at"* sentence is a third, and a gate that names its members can only be as complete as that
  list: the same residual [E-024](entropy-ledger.md) closed for organ indices, one artifact over
- Interest rate: medium — a stage transition happens rarely and touches everything, so the forgotten place
  is silently wrong for the whole stage, and this one faced outward. It is E-011 recurring, which makes it
  the class the seed has now paid twice
- Price: small — the gate exists; it needed a source *set* instead of a pair, plus one canonical form for
  the new source
- Conversion path: invariant — generalize `validate-stage` to a declared list of (file, canonical form)
  sources compared against the map, self-tested with the pair that matters: a third place disagreeing
  fails, a source stating nothing stays silent
- Paid: 2026-07-27 (plan [0009](active/0009-dither-metabolize.md) U15; ring
  [0054](../rings/0054-prose-state-rots-where-work-stops-touching-it.md), in the sensing pass that found
  it). `validate-stage` now compares a **declared source set** — the map is the reference, `fitness.ts`
  and README's *"currently at **Stage N**"* sentence are compared to it — and it went **red on the real
  repository on its first run**, which is the fire the conversion is built on; the README line was then
  corrected to Stage 4. Per-source silence is kept (ring 0035's contract, now applied per source), so a
  descendant carrying the check but not the mother's README prose is unbound. **The list stays explicit
  and that is the measured choice**: this repository carries ~19 *correct* provenance mentions of
  `Stage N` (*"the Stage 2 exit criterion"*, *"the Stage 1 organ"*) that no regex separates from a
  current-state claim, so a prose scan would fire 19 false positives to catch one real defect and train
  every agent to ignore it. The completeness of the list is therefore the acknowledged residual, named in
  the failure message. Verification (LAW-6): two self-tests (**261**, was 259) — README disagreeing with
  the map fails, a source stating no stage keeps everything green — plus the test-of-the-test (reverting
  to the two hardcoded places turns exactly the README case red, nothing else). `npm run check` (14) +
  `npm test` (261) + `npm run garden` (`drift_count` 0) green. Declared a `minor`
  [pollen intent](../../pollen/pending.md). The end state is single-sourcing the stage (generated from one
  constant), recorded as the ring's Revisit rather than built now
