# Plan 0001 — Germination

- Status: blocked: awaiting the Gardener's ring 0001 review (question 5) and the go-ahead to publish the remote

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
   validation, ring/plan/ledger format validation. Verified locally; hosted execution
   pending a remote ([E-002](../entropy-ledger.md)). See [.seed/README.md](../../../.seed/README.md).
7. ⏳ Ask the Gardener the five germination questions; cut answers into rings; close this
   plan.

## Germination questions (SEED.md §9, delivered 2026-07-04)

Asked verbatim; answers arrive as a Gardener message in a working session and enter the
repository as rings citing this plan (next free ring numbers, currently 0004+):

1. Repository name, org, and visibility?
2. License?
3. First external host candidate — or does the seed grow solo until Flowering?
4. Gardening cadence — how often do background cleanup tasks run, and what may automerge?
5. Anything already decided in your head that belongs in Ring 0001 before I assume it?

## Progress log

- **2026-07-04** — Genome read. Repository initialized on `main`. Map (`AGENTS.md`),
  anatomy, rings 0001–0002, entropy ledger (E-001…E-004), and `.seed/` machinery written.
  Node 25 runs the TypeScript checks natively; zero dependencies. First full check run
  green. Committed as `950d989`.
- **2026-07-04** — First verification attempt (a four-agent background workflow) collapsed
  under API instability: 21 stalled attempts over ~2.5 h, no results returned. Struggle is
  data (SEED.md §3): fell back to deterministic inline negative tests plus two focused
  subagents; the missing committed self-test for the machinery is priced as
  [E-007](../entropy-ledger.md).
- **2026-07-04** — Verification complete. Negative tests: 7/7 seeded violations caught
  with law-naming, fix-carrying messages. Fresh-agent exit test: passed — correct first
  action reached from a clean clone with no human help. Adversarial drift hunt: 15
  verified findings (1 high, 5 medium, 9 low) — the high one a duplicate-number
  suppression bug in all three sequence checks. All validator bugs fixed and covered by
  12 regression tests same day; unenforceable-now rules priced as E-005…E-007; map/plan
  wording drift fixed; ring [0003](../../rings/0003-artifact-field-formats.md) cut.
  Evidence below.
- **2026-07-04** — Germination questions delivered to the Gardener (recorded above). Plan
  blocked on answers.
- **2026-07-04** — Gardener answered questions 1–4; cut as rings
  [0004](../../rings/0004-name-hosting-visibility.md) (name "The Seed", no org, public),
  [0005](../../rings/0005-license-mit.md) (MIT, seed-recommended and adopted),
  [0006](../../rings/0006-solo-until-flowering.md) (solo until Flowering),
  [0007](../../rings/0007-gardening-cadence-automerge.md) (cadence + automerge policy,
  seed-recommended and adopted). LICENSE and human-facing README added and enforced via
  validate-anatomy; E-008 priced (manual cadence); E-004 updated (name settled, clearance
  still open). Question 5 pending: the Gardener is reading ring 0001 before confirming.
  Remote creation/push awaits explicit go-ahead — publishing is outward-facing, and the
  first green hosted CI run is what pays [E-002](../entropy-ledger.md).

## Decision log

- CI provider, runtime, and dependency policy → [ring 0002](../../rings/0002-germination-implementation-defaults.md).
- Ring/ledger explicit-key field format (refining the genome's §2 sketch) →
  [ring 0003](../../rings/0003-artifact-field-formats.md).
- Repo-walk exclusions (`.git/`, `node_modules/`, OS noise) live in `.seed/lib/repo.ts`
  and apply to all checks. Reachability exemptions are narrower still: only files matching
  `YYYY-MM-DD.json` under `docs/fitness/history/` are covered by that directory's README
  (append-only data, excluded from the `map_reachability` denominator); anything else
  there must be linked or deleted.
- Reference-style and HTML links are forbidden outright rather than parsed: the inline
  link parser stays the single source of truth for the map (LAW-7 — one boring format).
- Fitness metrics are *defined* now ([FITNESS.md](../../fitness/FITNESS.md)) but computed
  from Stage 1, per the stage boundaries — no stage skipping.

## Evidence (LAW-6)

Final check run on the tree this plan describes:

```
✓ seed/validate-anatomy — 19 required anatomy paths present
✓ seed/validate-map — map_reachability 100.0% (28/28 files ≤3 hops), dead links: 0
✓ seed/validate-rings — 3 ring(s) valid
✓ seed/validate-plans — 1 plan(s), 7 ledger entries valid
all checks passed
```

**Negative tests, round 1** (each validator fires; transcript excerpts, exit=1 in all
cases, every message carries `law:` and `fix:` lines):

```
V1 dead link in AGENTS.md            → ✗ [seed/validate-map] AGENTS.md:63 dead link: docs/ghost.md
V2 delete docs/principles/README.md  → ✗ [seed/validate-anatomy] required anatomy file missing (+ map dead link)
V3 orphan file linked from nothing   → ✗ [seed/validate-map] docs/orphan.md is not reachable within 3 hops
V4 ring missing Enforcement field    → ✗ [seed/validate-rings] …missing or malforms required field: Enforcement
V5 malformed ledger heading E-9      → ✗ [seed/validate-plans] entry heading malformed (+ numbering gap)
V6 ring numbering gap (0002→0004)    → ✗ [seed/validate-rings] title/filename mismatch + numbering violation
V7 plan missing Next actions         → ✗ [seed/validate-plans] …missing required section: ## Next actions
baseline before and after: exit=0
```

**Negative tests, round 2** (regressions for the drift-hunt fixes; exit=1 with law+fix
in all cases, except R5 which must stay green):

```
R1  duplicate ring number            → ✗ duplicate ring number 0002: two rings claim the same citation
R2  duplicate ledger number          → ✗ duplicate ledger number E-004
R3  dead link in a depth-3 file      → ✗ docs/references/b.md:3 dead link (was invisible pre-fix)
R4  non-snapshot file in data dir    → ✗ …hidden-knowledge.md is not reachable (was silently covered)
R5  legit YYYY-MM-DD.json snapshot   → green; "1 data file(s) covered by README", excluded from metric
R6  reference-style link definition  → ✗ uses a reference-style link definition
R7  HTML link                        → ✗ uses a HTML link
R8  dead link after ```-fence w/ ~~~ → ✗ caught (fence state no longer inverts)
R9  Status outside vocabulary        → ✗ no valid `- Status:` line
R10 plan file at docs/plans/ root    → ✗ sits directly in docs/plans/
R11 lowercase ledger heading e-002   → ✗ heading neither Open, Paid, nor a valid entry
R12 blocked-status plan in completed/→ ✗ is in completed/ but its status is "blocked: …"
```

**Fresh-agent exit test** (Stage 0 exit criterion): an agent given only a clean clone and
zero instructions reached the correct first action via `AGENTS.md → SEED.md → plan 0001 →
entropy ledger`, and verified from repo evidence alone that Gardener answers had not
arrived. Its two reported frictions (ledger-conversion phrasing assuming an ungated entry
exists; ambiguity about where answers materialize) were fixed in `AGENTS.md` and this plan
the same day.

**Adversarial drift hunt**: 15 verified findings. Disposition: findings 1–5 (validator
bugs: duplicate suppression, depth-3 blind spot, data-dir escape, unparsed link forms,
fence-state inversion) — fixed, regression-tested R1–R8. Findings 6–8 (circular evidence,
unrecorded questions, present-tense CI claims) — fixed in this plan, `AGENTS.md`, and
ring 0002. Findings 10–13 (documented-but-unenforced and enforced-but-undocumented rules,
validation escape holes) — enforcement added (R9–R12) and READMEs aligned; the two rules
needing git history or anchors priced as [E-005](../entropy-ledger.md) and
[E-006](../entropy-ledger.md). Finding 14 (genome template sketch vs enforced format) —
ring [0003](../../rings/0003-artifact-field-formats.md). Finding 15 (decision-log
misattribution) — corrected above.

## Next actions

1. **Gardener:** review [ring 0001](../../rings/0001-founding-defaults.md) (question 5) —
   confirm it, or state what to add/amend (additions become rings; amendments to SEED.md
   need an approved PR).
2. **Gardener:** confirm creating the public GitHub repo `the-seed` (personal account,
   per ring [0004](../../rings/0004-name-hosting-visibility.md)) and pushing `main`.
3. **Seed:** on both confirmations — cut any question-5 ring, create the remote, push,
   verify the first hosted CI run is green (pays [E-002](../entropy-ledger.md)), then
   flip `AGENTS.md` "Current state", set this plan `completed`, `git mv` it to
   `completed/`, and propose the Stage 1 (Rooting) plan for Gardener approval.
