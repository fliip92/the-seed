# Plan 0002 — Rooting (Stage 1)

- Status: completed 2026-07-05

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

- **2026-07-04** — Drafted at germination close ([plan 0001](0001-germination.md)
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
- **2026-07-04** — Scope item 2 complete: the
  [plan traceability gate](../../../.seed/checks/plan-traceability.ts) runs as a fourth
  CI step (E-003 paid): every non-merge commit since the event's base ref must name an
  existing plan or ring in its message. Six new self-test cases pin fire/hold behavior
  (existing plan and ring references pass; missing and phantom references fail naming
  LAW-5; merge commits exempt; unresolvable base skips with a note). The commit-message
  convention is documented in AGENTS.md § Protocols. Local evidence: `npm run check`
  green, `npm test` 43/43 green, both gates green against `HEAD~1`. Hosted evidence:
  first execution of the new gate green on GitHub —
  [seed-ci run 28725041081](https://github.com/fliip92/the-seed/actions/runs/28725041081),
  the gate reporting `all 1 new commit(s) since bff0793a40cf trace to a plan or ring`.
- **2026-07-04** — Scope item 3 complete: the doc-gardener skill
  ([skills/doc-gardener/SKILL.md](../../../skills/doc-gardener/SKILL.md)) and its
  instrument, the [drift detector](../../../.seed/checks/doc-drift.ts) (`npm run garden`).
  It scans the current-state doc surface for the `stale-path-reference` class and reports
  `drift_count` — the SEED.md §6 metric it sources — as an **advisory** signal (always
  exits 0 on findings; recorded as ring [0011](../../rings/0011-drift-advisory.md)),
  because drift is a trend the gardening cadence digests, not a merge gate. Verified by
  seven new self-tests (`npm test`, 50 total): a pristine copy reports `drift_count 0`; a
  seeded stale reference is detected, counted, and names LAW-2; placeholders, glob forms,
  excluded append-only regions, the `./` and `:line`/`#fragment` normalizations, and the
  scan-surface inclusion side are each pinned by a case — and mutation testing confirms
  every guard's case fails when its guard regresses (the E-007 standard). The v0 coverage
  residual (one class; inline spans only) is priced as [E-009](../entropy-ledger.md). A
  14-agent adversarial review confirmed seven low-severity findings (two refuted), all
  folded in before landing: a glob-metacharacter gap (`[`, `]`, `?` slipped the placeholder
  guard, contradicting the "globs skipped" contract), three unpinned self-test guards, and
  honest scoping of the inline-only / fenced-block limit in E-009 and the skill. Local
  evidence: `npm run check` green (`map_reachability` 100%, 44/44 files), `npm test` 50/50,
  `npm run garden` `drift_count 0`. Hosted evidence: first execution green on GitHub —
  [seed-ci run 28726001712](https://github.com/fliip92/the-seed/actions/runs/28726001712),
  the hosted runner independently reporting `all checks passed` (`map_reachability` 100.0%,
  44/44), `all 50 self-tests passed` (the seven doc-drift cases among them), and both
  git-aware gates green.
- **2026-07-04** — Scope item 4 complete: fitness v0.
  [`.seed/checks/fitness.ts`](../../../.seed/checks/fitness.ts) (`npm run fitness`)
  computes five of SEED.md §6's six metrics and prints them as a dated
  `{ date, stage, metrics }` snapshot: `map_reachability` and `drift_count` are reused
  directly from `validate-map.ts` (now exporting `analyzeReachability`) and
  `doc-drift.ts --json`; `plan_traceability` walks the repo's entire non-merge commit
  history for a resolvable reference, sharing its reference grammar with
  `plan-traceability.ts` via two new `lib/repo.ts` helpers
  (`extractPlanRingRefs`/`numberedFilenames`) so the gate and the trend cannot silently
  disagree on what "traces"; `enforcement_ratio` scans `docs/principles/` for a non-empty,
  non-"none" Enforcement field (vacuously 1 while zero principles are stated, the same
  zero-denominator convention `map_reachability` already used); `ledger_trend` diffs
  current open-entry count against the ledger's state just before a trailing 7-day git
  window, falling back to a zero baseline while the repo (or the ledger) is younger than
  the window itself — honest for a one-day-old repo: everything open today genuinely did
  appear within the last week. `escalation_rate` stays null (no run-log instrument yet).
  Wired as CI's fifth step (advisory: only a thrown error fails it, the numbers never
  gate). Verified by nine new self-tests (59 total, two mutation-checked live: breaking
  the window-baseline branch and weakening the enforcement "none" guard both failed
  exactly the case built to catch them). First snapshot landed:
  [docs/fitness/history/2026-07-04.json](../../fitness/history/2026-07-04.json)
  (`map_reachability` 100%, `enforcement_ratio` 100% vacuous, `drift_count` 0,
  `plan_traceability` 100%, `ledger_trend` +6). Local evidence: `npm run check` green
  (`map_reachability` 100%, 46/46 files), `npm test` 59/59 green,
  `npm run fitness` printing the snapshot above.

- **2026-07-04** — Scope item 5 implemented: cadence automation (converting
  [E-008](../entropy-ledger.md); mechanism recorded as ring
  [0012](../../rings/0012-cadence-automation-mechanism.md)), with the E-010 CI-action bump
  folded in as the ledger directed. **Path-based automerge gate**
  ([`.seed/checks/automerge-scope.ts`](../../../.seed/checks/automerge-scope.ts), CI's sixth
  step): a commit that declares itself automerge-class with an `Automerge: <class>` trailer
  (`<class>` one of ring 0007's six mechanical classes) must touch none of SEED.md, existing
  ring content, or principle statements (README indices exempt), else CI fails naming LAW-8;
  a marker naming an unknown class is itself a violation. Unmarked commits are the
  Gardener-review path, unconstrained by the gate — the honest, bounded guarantee is that an
  automerge *claim* provably stayed inside the mechanical boundary (the solo residual is
  recorded with E-008 and hardens at Flowering, the E-005 shape). **Scheduled gardening pass**
  ([`.github/workflows/gardening-cadence.yml`](../../../.github/workflows/gardening-cadence.yml),
  weekly cron + `workflow_dispatch`, least-privilege `contents:read`/`issues:write`): runs the
  sense/measure instruments and, via
  [`.seed/checks/gardening-report.ts`](../../../.seed/checks/gardening-report.ts) (a subprocess
  composer over doc-drift + fitness, the pattern fitness already uses), files a durable, dated
  gardening-pass issue when `drift_count > 0`, so drift surfaces on cadence even when no session
  opens. **E-010**: both workflows bumped to `actions/checkout@v5` / `actions/setup-node@v5`
  (Node 24 runtime); staged and kept Open — its only enforcement is the hosted run, so it is
  Paid when the push confirms green. Verified (LAW-6): eleven self-test cases pin the gate's
  fire/hold behavior (marked+protected fails; a non-ASCII-named protected add still fails;
  unknown class fails; unmarked passes; both README indices exempt; merge exempt; unresolvable
  base skips) and two pin the report composition (pristine → no findings + valid date; a seeded
  stale reference flips has_findings and renders); `npm test` 72/72 green; six guards
  mutation-checked live (SEED.md protection, the ring- and principles-README exemptions, the
  unknown-class guard, `has_findings`, the `-z` path-quoting fix, and the merge exemption each
  failed exactly the case built to catch it). A 15-agent adversarial review (seven finder
  lenses → eight per-finding adversarial verifiers) confirmed five defects (three refuted), all
  folded in before landing: a **path-quoting bypass** (git's default `core.quotepath` quoted a
  non-ASCII-named protected file, so `isProtected` missed it and a marked commit could add an
  oddly-named ring/principle — closed with `-z`), a **merge-exemption self-test that asserted
  too little** (it passed even with `--no-merges` dropped — now pins the marked count), and
  three low-severity verification/doc gaps (the `--json` `date` field, the principles-README
  exemption, and the `.seed/README` §Self-tests enumeration were unpinned/stale). The three
  refutations were sound (an unreachable duplicate-issue path, spec'd class case-sensitivity, a
  non-triggering prose false-positive). Local evidence: `npm run check` green
  (`map_reachability` 100%, 50/50 files), `npm test` 72/72, the new gate green against `HEAD~1`,
  both workflows parse, the cadence shell logic dry-runs correctly (clean tree → no issue
  filed).

- **2026-07-05** — Scope item 5 hosted evidence captured (`Next actions` item 1 done). The
  scope-item-5 push (`cc6a261`) drove **seed-ci green** —
  [run 28752296476](https://github.com/fliip92/the-seed/actions/runs/28752296476): all six
  check steps pass including the new automerge-scope gate (step 8), which correctly reported
  `no automerge-marked commits since b40492419aef; 1 commit(s) on the Gardener-review path`
  (`cc6a261` is unmarked plan work, so the gate constrains nothing and passes); the `@v5`
  actions ran with **no Node-20 deprecation warning** (job annotations empty — the sole
  `DEP0040 punycode` line is a Node-internal userland notice, not the Actions runtime
  deprecation), **paying [E-010](../entropy-ledger.md)**. The first
  `workflow_dispatch` of the scheduled pass ran **gardening-cadence green** —
  [run 28752304367](https://github.com/fliip92/the-seed/actions/runs/28752304367): it composed
  the report and took the skip path (`drift_count 0` → "no issue filed"; no `gardening-pass`
  issue created), **closing E-008's workflow-glue confirmation**. All five scope items are now
  hosted-evidenced; what remains is `Next actions` item 2 (close this plan, propose Stage 1→2).

- **2026-07-05** — Plan closed. All five scope items are implemented and hosted-evidenced
  (entries above); the **Stage 1 exit criterion is met** — the seed detects its own drift
  automatically, without being asked — via the [doc-gardener](../../../skills/doc-gardener/SKILL.md)
  (scope item 3) and the scheduled [gardening-cadence](../../../.github/workflows/gardening-cadence.yml)
  (scope item 5). Status set to `completed 2026-07-05`; plan `git mv`d to `completed/`. Moving
  the file would have dead-linked append-only [ring 0009](../../rings/0009-stage-1-transition-approved.md)
  (which links this plan by its `active/` path and cannot be edited); that class was fixed
  first in [ring 0013](../../rings/0013-plan-links-resolve-across-active-completed.md) — plan
  links now resolve across `active/`⇄`completed/`. The Stage 1→2 (Rooting → Growth) transition
  is proposed as [plan 0003](../active/0003-growth.md) for Gardener approval (SEED.md §4); on
  approval it is recorded as a ring (the ring 0009 pattern).

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
- **Traceability is per-commit, not per-PR.** SEED.md §4 says "merged PRs must trace",
  but solo pushes straight to `main` are the normal landing path today (ring
  [0006](../../rings/0006-solo-until-flowering.md)), so PR-level checking would gate
  nothing. The gate checks every non-merge commit since the base ref; merge commits are
  exempt because their subjects are machine-written and the commits they carry are each
  checked individually.
- **References must resolve.** "plan 0002" counts only if that plan exists in `active/`
  or `completed/` (rings likewise) — a phantom reference traces to nothing. Existence is
  checked against HEAD's tree, which cannot go stale: plans are kept forever and rings
  are append-only (the sibling gate).
- **History is grandfathered.** Only commits past the merge base are judged. Two
  pre-gate commits on `main` carry no reference; rewriting them to satisfy a new gate
  would break the very append-only discipline the gates exist to protect.
- **Drift is advisory, not a gate — recorded as ring
  [0011](../../rings/0011-drift-advisory.md).** The detector reports `drift_count` and
  exits 0; it lives outside `run-all.ts` and is verified by dedicated self-tests run
  directly (the same precedent as the git-aware gates). Gating drift would block routine
  merges on non-mechanical reconciliation and misreads the SEED.md §6 trend; the full
  argument, and the promotion path to a hard invariant, live in the ring.
- **Scan surface = current-state docs, not logs.** The detector scans only documentation
  whose job is to describe the repo as it is now, and excludes SEED.md (genome, amended
  only by Gardener PR + ring — ring 0007 keeps it out of the automerge remit),
  `docs/rings/`, `docs/plans/completed/`, the active-plan bodies, and the ledger. In those
  a path reference is legitimate point-in-time record, not actionable drift, and
  "correcting" it would fight the append-only discipline the gates protect.
- **Precision over recall in the path-claim rule.** A backtick token is treated as a
  checkable repo-path claim only when it is unmistakably one (first segment an existing
  top-level entry, has a separator, ends in a known extension, no placeholder/glob
  metacharacters). A false positive poisons a *trend* metric, so the rule is deliberately
  conservative — it misses relative and fenced-only references (priced as
  [E-009](../entropy-ledger.md)) rather than risk noise. The rule was tuned against real
  repository data: the committed tree's baseline is `drift_count 0`, which also lets a
  single seeded reference read cleanly as `drift_count 1` in the self-tests.
- **`enforcement_ratio` is vacuously 1 with zero principles stated.** Mirrors
  `map_reachability`'s own zero-denominator convention (already silent precedent in
  `validate-map.ts`): an empty set has nothing unenforced in it. Alternative rejected:
  `null` — the metric genuinely is computable today (0/0 by convention), and `null` is
  reserved for metrics with no instrument at all (`escalation_rate`). The trend becomes
  informative the moment Stage 2 authors the first real principle.
- **`plan_traceability` walks full history, independent of the gate.**
  `plan-traceability.ts` judges commits since a base ref and fails CI; the fitness metric
  needs a repo-wide trend and must never fail. Rather than import the gate script (it
  executes and calls `process.exit` at module scope) or fork its regex, the reference
  grammar (`extractPlanRingRefs`, `numberedFilenames`) moved to `lib/repo.ts` so both
  consumers share one definition of "traces" — a duplicated regex here would have been
  exactly the kind of invariant-vs-implementation split LAW-3 warns against.
- **`ledger_trend` falls back to a zero baseline inside the trailing window, not to the
  ledger's inception content.** The first version tried "diff against the ledger's
  oldest known state," which double-counts entries paid off within the window as if they
  never existed. Diffing against "nothing" when no prior commit sits outside the 7-day
  window is what "net change per week" actually means for a repo younger than a week: the
  whole ledger genuinely appeared in the last 7 days. Verified live by mutation (Progress
  log, scope item 4).
- **Automerge is claimed per commit by a message trailer; the gate constrains the claim
  (scope item 5, ring [0012](../../rings/0012-cadence-automation-mechanism.md)).** Solo
  commits go straight to `main` (ring 0006), so there is no PR or branch to carry a label —
  the commit message is the only durable per-commit channel, already used by traceability.
  And there is no mechanical "was this Gardener-reviewed" signal while solo, so the gate
  cannot require a review-marker on protected edits (the inverse polarity); it instead proves
  that whatever *declares* `Automerge: <class>` stayed inside ring 0007's mechanical boundary.
  Both alternatives (label marker, inverse polarity) revisit at Flowering with branch
  protection.
- **The automerge class vocabulary is required, and grounded in an append-only ring.** A
  marker must name a real mechanical class (`link`, `format`, `typo`, `stale-reference`,
  `regeneration`, `ledger`), or it is a violation — `Automerge: yes` cannot buy a pass on the
  path check. The vocabulary derives from ring 0007's list, which the append-only gate freezes,
  so gate and policy cannot silently drift (LAW-3).
- **The scheduled pass files an issue, not an autonomous committer.** A Claude Code action
  that commits automerge fixes on the schedule was rejected: heavier, dependent on an
  API-key secret, less boring (LAW-7), and it would itself need the automerge gate to bound
  it. A weekly cron that runs the instruments and files a durable, dated gardening-pass issue
  when `drift_count > 0` converts E-008's actual risk (no session opens → drift unseen) into a
  work item an in-session agent picks up — the boring, verifiable v0. v0 triggers on
  `drift_count` alone (a metric moving is a trend to read, not a discrete task); widening the
  trigger is a later priced step.
- **E-008 is Paid on local evidence; E-010 stays Open.** The gate meets the E-005 Paid
  standard (runs in CI, fire/hold pinned by self-tests + mutation) and the workflow's report
  composition is self-tested, so E-008's substantive conversion is done locally; only the thin
  cron/issue glue is hosted-pending, noted honestly. E-010's *entire* enforcement is the
  hosted run (the deprecation warning surfaces only there), so its bump is staged but it is not
  Paid until the scope-item-5 push confirms green — marking it Paid now would assert a result
  not yet observed.

## Next actions

Plan complete — both original `Next actions` items are done:

1. ✅ **Hosted evidence captured** (2026-07-05): scope item 5's seed-ci run and the
   gardening-cadence `workflow_dispatch` are green and linked in the progress log; E-010 and
   E-008 are Paid in the [ledger](../entropy-ledger.md).
2. ✅ **Plan closed; transition proposed:** all five scope items are evidenced, the Stage 1
   exit criterion is met (doc-gardener scope item 3 + scheduled cadence scope item 5), Status
   is `completed 2026-07-05`, and the plan lives in `completed/`. The Stage 1→2 (Rooting →
   Growth) transition is proposed as [plan 0003](../active/0003-growth.md) for Gardener
   approval (SEED.md §4); on approval it is recorded as a ring, following the
   [ring 0009](../../rings/0009-stage-1-transition-approved.md) pattern.

Nothing further here — the successor work lives in [plan 0003](../active/0003-growth.md).
