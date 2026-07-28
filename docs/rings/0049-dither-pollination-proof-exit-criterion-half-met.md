# Ring 0049 — the dither pollination proof lands (instrument-controlled): the exit criterion is half-met, Independence waits on the feature track, and `plan_traceability` is priced blind to ADRs

- Date: 2026-07-27
- Stage: 4 — Pollination
- Raised-by: seed ([plan 0009](../plans/active/0009-dither-metabolize.md) `Next actions` item 4 — the
  standing fitness-cadence item: *"measure dither fitness (the before/after-graft delta is the
  pollination proof); watch the trend against the per-host exit criterion"*, the one live item never
  yet executed as a landed artifact)
- Question: nine ledger entries are digested, six gates and eight principles stand on dither's `main`,
  and the last two sensing passes found almost nothing. **Did any of it measurably improve the host** —
  and how close is dither to the per-host exit criterion (SEED.md §4 step 6, Independence)?
- Decision:
  - **The pollination proof is landed as an artifact, not a quoted number:**
    [docs/fitness/pollination-dither.md](../fitness/pollination-dither.md), the Stage-4 counterpart to
    [recursive-upgrade.md](../fitness/recursive-upgrade.md) (the Stage-3 proof). SEED.md §6 gives fitness
    exactly two jobs, and *"prove pollination value with before/after measurement on hosts"* is the
    second; until now that measurement existed only as figures scattered across rings.
  - **The measurement is instrument-controlled — the "before" column is a re-measurement, not the
    historical baseline.** The Scout ([assessment 0002](../assessments/0002-dither.md)) read
    `map_reachability` **null**, but two of the seed's own instrument defects have been paid since —
    [E-016](../plans/entropy-ledger.md) (hard-coded `AGENTS.md`, so dither's `CLAUDE.md` map read as
    mapless) and [E-019](../plans/entropy-ledger.md) (counted all files, flooring on a product monorepo;
    ring [0043](0043-map-reachability-scoped-to-knowledge-artifacts.md)) — and **both move this exact
    number**. Quoting `null → 48.8%` would have credited the graft with the seed's own toolchain fixes.
    So the pre-graft tree (`2b2b3d5`, the last owner commit before `da6bb24`) was cloned and re-measured
    **today, with today's engine**: same code, same day, same definitions. The delta below is the graft.
  - **The verdict: four of six metrics moved, every one that moved improved, none regressed.**
    `map_reachability` **6.8% (5/74 docs) → 48.8% (42/86)** — a 7.2× rise in doc navigability;
    `enforcement_ratio` **null → 100% (8/8)**; `drift_count` **2 → 0**; `ledger_trend` **null → -2**
    (net two entries digested this week). The `drift_count` move is *attributable*, not correlated: the
    two pre-graft drifts re-scanned today are exactly the two [E-006](../plans/entropy-ledger.md) paid
    (ring [0044](0044-dither-e006-stale-spike-refs-gardened.md)) — the ExecuTorch `docs/source/…` path
    and the never-built `leanPrompt.ts`.
  - **The per-host exit criterion is HALF-MET, and the missing half is not more refactoring.** SEED.md
    §4: *"dither's fitness trend is positive over a sustained window, **and** its owner ships features
    through the agent workflow without the seed being special."* Half 1 is **met** — ten days, nine
    entries digested, no regression. Half 2 is **untested**: dither's last owner-authored feature commit
    is `2b2b3d5`, the commit immediately *before* the graft, so every commit on `main` since is
    seed-driven refactor-track work and the claim has no evidence either way. **Independence (step 6)
    is blocked on the feature track running at least once post-graft** — not on further sensing. This
    also explains passes 3 and 4 finding progressively less: a host that has not changed since
    `b8d3823` generates no new entropy, so sensing on it is correctly near-idle.
  - **One metric reads *wrong* on a host, and it is the seed's defect: `plan_traceability`.** It reports
    *"no plans or rings — no decision log to trace commits to"* about a repo with nine numbered ADRs
    whose commit→ADR traceability **the seed itself grafted and enforces** (ring
    [0038](0038-dither-adr-gate-graft.md)). The consequence is specific: one of the four graft organs is
    invisible in its own pollination proof. Priced as [E-020](../plans/entropy-ledger.md) and
    **deliberately not converted in-pass** — teaching the metric a second decision-log shape edits
    SEED.md §6's stated definition, which §6 itself and the genome's amendment rule both route to the
    Gardener (the [E-012](../plans/entropy-ledger.md) fork precedent). The proof states the null is
    wrong rather than quoting it.
  - **The seed's own fitness cadence had lapsed; the tick is taken.** One snapshot existed
    (`2026-07-04`, stage 1) against a file claiming snapshots land "on cadence from Stage 1 onward" —
    23 days and three stage transitions stale. Landed [2026-07-27](../fitness/history/2026-07-27.json)
    (stage 4) and re-rendered [FITNESS.md](../fitness/FITNESS.md) as a two-column trend. Two staleness
    fixes fell out: its `enforcement_ratio` row still read *"vacuous — no principles stated yet"* (the
    seed now states and enforces one), and its `map_reachability` **definition** still said "% of files"
    — contradicting SEED.md §6 since ring [0043](0043-map-reachability-scoped-to-knowledge-artifacts.md)
    rescoped it to docs. A local copy of a genome definition drifting from the genome is a LAW-3 break in
    the small; the row now mirrors §6 and says so.
  - **Sensed in-pass, priced, not converted: [E-021](../plans/entropy-ledger.md) — the working-tree gates
    ignore git's ignore rules.** Mid-session the agent tool wrote `.claude/settings.local.json` (a
    permission grant) into the working tree, and the repo's two done-criteria went green → **3
    `npm run check` violations and 26 of 241 failing self-tests** (`validate-map` demanding the file be
    reachable, `validate-pollen` demanding `.claude` be classified, and every self-test fixture that
    copies the tree and asserts the pristine copy is green) — while `git status` still reported a **clean
    tree**, because the file is git-ignored via the user's global `~/.config/git/ignore`. [`listRepoFiles`](../../.seed/lib/repo.ts) walks the directory and
    consults only a hardcoded exclusion set, so the repo holds **two disagreeing definitions of "what is
    in this repository"** (git's ignore rules vs `repo.ts`'s list, which already duplicates `.gitignore`'s
    entries) — a LAW-3 break, and a falsification of [E-012](../plans/entropy-ledger.md)'s recorded
    assumption that "the seed's own tracked set equals its on-disk set". Priced **high**: it breaks the
    repo's own done-criterion on a real machine, for a file the Gardener never authored and cannot see in
    `git status`, and it is invisible in CI (a clone carries no ignored local state). Not converted here —
    it changes the single most load-bearing helper in the repo and every gate inherits it, so it deserves
    its own pass with the self-tests named in the entry, not a ride-along in a measurement unit (LAW-8:
    price it now, convert it deliberately).
  - **Minor, in-path:** `fitness.ts --json` emitted single-line JSON while its own header says to
    "redirect straight into `docs/fitness/history/`" — whose landed file and documented schema are
    two-space-indented. Fixed to emit the directory's convention, so the documented path produces the
    documented shape instead of a second format.
- Alternatives considered:
  - **Quote the Scout's `null → 48.8%` as the delta.** Rejected — it is the headline number and it
    would be *wrong*: E-016 and E-019 both move it, so an unknown share of that rise is the seed fixing
    its own instrument. Re-measuring the pre-graft tree costs one clone and makes the claim defensible
    to a stranger (LAW-2). The honest 6.8% → 48.8% is also the stronger claim, because it is real.
  - **`git worktree add` on dither for the pre-graft tree.** Rejected — a worktree *writes* to dither's
    `.git`, breaking the Scout's read-only contract on a host (SEED.md §4 step 1). A clone leaves the
    host untouched; the proof records the distinction so the next agent does not reach for the worktree.
  - **Convert E-020 in-pass** (the E-016 precedent: teach the instrument, self-test, done). Rejected —
    E-016 changed a *filename set*; this changes the metric's stated definition in SEED.md §6, which §6
    ("propose its replacement — via ring") and the amendment rule both gate on the Gardener. Priced and
    held.
  - **Declare the exit criterion met on the strength of the trend.** Rejected — that is half the
    criterion, and the omitted half is the one that actually tests pollination: whether the *owner*
    ships through the workflow without the seed being special. Calling it met would convert an untested
    claim into a recorded fact and would mis-target the next work at more refactoring.
  - **Price the lapsed self-fitness cadence as ledger debt.** Rejected — the fix is to take the tick,
    which this pass did (the resolve-now class, ring [0048](0048-dither-fourth-sensing-pass-seed-dither-md-r3f.md)'s
    shape). Whether the cadence should be *mechanized* is a real open question, but it is
    [E-008](../plans/entropy-ledger.md)'s (gardening cadence is manual until scheduled automation
    exists) — already priced; no second entry for the same debt.
- Enforcement: **doc-only** — a measurement pass, and one measurement does not warrant an instrument
  (LAW-7). Justification for not mechanizing: the artifact's correctness is that every figure is
  **reproducible read-only** by the two commands the proof records (a reader re-runs them and gets the
  same table), and that the `drift_count` attribution names the two exact drifted paths rather than
  asserting a correlation. Mechanizing would mean a scheduled cross-repo measurement job — that is the
  already-priced cadence question ([E-008](../plans/entropy-ledger.md)), not this pass's work; a second
  host is the trigger to build it (Revisit-when). **No dither mutation** — dither is unchanged at
  `b8d3823` and the whole pass was read-only on the host (clone, never worktree). `npm run garden`
  (`drift_count` 0) green; the seed's own snapshot for today is landed. `npm run check` **and all 241
  self-tests pass on the committed content** — verified with the untracked, git-ignored `.claude/` held
  aside; with it in place the runs report the [E-021](../plans/entropy-ledger.md) failures described above,
  which are a property of the *local machine's* ignored state, not of anything committed here (hosted CI
  clones tracked files only and is unaffected — which is precisely why E-021 has gone unnoticed). Seed metrics: `map_reachability` 100%,
  `enforcement_ratio` 100% (1/1), `drift_count` 0, `plan_traceability` 100%, `ledger_trend` +0 (a rate —
  this week's opens and payments cancelled: E-020 and E-021 opened, and the pass-3 conversions aged out).
- Revisit-when: **the owner ships a feature on dither through the agent workflow** — that is the exit
  criterion's missing half, and the trigger to re-measure and judge Independence (step 6); or the
  Gardener rules on [E-020](../plans/entropy-ledger.md), after which `plan_traceability` becomes a real
  reading on dither and this proof's one wrong row is re-measured; or a **second** host is grafted, at
  which point the two-column shape here should generalize into a comparable per-host proof rather than
  being re-derived by hand.
