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
