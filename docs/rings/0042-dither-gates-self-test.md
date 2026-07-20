# Ring 0042 — dither's gates self-test (Metabolize refactor E-002): the verification of the verifiers; a scoped port of the seed's self-test.ts binds each of the five gates' violation classes into a committed CI harness; no eighth principle — the self-test is LAW-6 verification, not a product norm; E-002 Open→Paid, dither's second digested debt

- Date: 2026-07-19
- Stage: 4 — Pollination
- Raised-by: seed
- Question: [Plan 0009](../plans/active/0009-dither-metabolize.md)'s second refactor-toward-architecture
  unit (U2) is [E-002](https://github.com/fliip92/dither/blob/main/docs/plans/entropy-ledger.md) — the
  five grafted gates ([map](0037-dither-map-gate-graft.md), [ADR](0038-dither-adr-gate-graft.md),
  [principles](0039-dither-principles-gate-graft.md), [ledger](0040-dither-ledger-graft.md),
  [import-boundary](0041-dither-import-boundary-gate.md)) guard dither's repo, but **nothing guarded
  the gates**: each was verified only on a throwaway clone at graft time, its teeth living in a ring,
  so a regression — a bad re-copy of the verbatim [`.seed/lib/repo.ts`](https://github.com/fliip92/dither/blob/main/.seed/lib/repo.ts)
  on upgrade, a loosened check — would land green. [Ring 0038](0038-dither-adr-gate-graft.md) named
  the gap. Left to design: the port's **scope** (the seed's [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts)
  is 3538 lines over ~26 organs; dither has five gates); how to run each gate **hermetically** over a
  mutated copy; and — the load-bearing call — whether adding a CI step **obliges an eighth principle**
  (the rings 0039/0041 "each new gate names a principle" rhythm) or whether the self-test is a
  different category that states no new norm.
- Decision: Built and committed to dither (`9f41427`, local; the push stays Gardener-gated) — the
  **second mutation** of a real external host on the Metabolize track. The design:
  - **A scoped port of the seed's `self-test.ts`, not the whole thing.**
    [`.seed/tests/gates-self-test.ts`](https://github.com/fliip92/dither/blob/main/.seed/tests/gates-self-test.ts)
    copies the committed tree (`git ls-files` — the gates' own scope, so gitignored build output
    never enters), `git init`s + commits it once as a shared baseline, then per case clones that
    baseline, mutates the clone, and runs the ONE gate against it. Each gate runs as the **copy's own
    runner**, so the seed's verbatim `repo.ts` resolves `REPO_ROOT` (from its own file location) to
    the copy — the mutation is judged in isolation. **Fifteen cases:** five baselines (the pristine
    tree passes every gate) + ten teeth (each load-bearing violation class fires exit 1 with the
    gate's law-naming message) — map dead-link; ADR cite-absent + add-unnamed; principles
    phantom-enforcer + missing-field; ledger bad-enum + missing-section; import-boundary R1/R2/R3.
  - **The test-of-the-test.** A harness that only ever sees green proves nothing. Neutering `map-gate`
    (forcing its broken-link set empty) this session turned exactly its dead-link tooth **red** (exit
    0 ≠ the expected 1) while every baseline stayed green — a silently-broken gate fails the harness,
    which is the whole point (LAW-6: a verification that cannot fail verifies nothing).
  - **No eighth principle — the load-bearing call.** Each prior gate graft added a principle naming
    its new CI step (rings 0039–0041, keeping the principles organ's completeness claim honest), so
    adding a `Gates self-test` step *looks* like it needs a `gates-are-tested` principle. It does not.
    A principle is a **norm about dither** (its links resolve, its code lints, its decisions are
    ADRs); the self-test is the **verification of the other gates' enforcers** — LAW-6 infrastructure
    one level up, not a product norm. The seed itself models exactly this: it runs `self-test.ts` in
    CI but states a single principle ([grounded-or-ask](../principles/grounded-or-ask.md)) — its own
    self-test is not among its principles. So faithfully, E-002 adds **no principle** and
    `enforcement_ratio` stays 7/7. To keep the completeness claim honest,
    [`CLAUDE.md`](https://github.com/fliip92/dither/blob/main/CLAUDE.md)'s *Enforced norms* now reads
    *"one per **norm-enforcing** step"* and names the self-test explicitly as the gates' LAW-6
    verification (which adds no principle, as the seed's own self-test does not).
  - **Copy `git ls-files`, not the whole tree.** The seed's own self-test `cpSync`s the working tree
    minus `.git`; a real product repo carries gitignored build output (dither's `graphify-out/`,
    dist), so the port copies each **tracked file's working-tree content** instead — faster, and
    exactly the scope the gates analyze. Tracked symlinks (dither surfaces skills through
    `.claude/skills`) are recreated, not followed; sockets/fifos skipped — none is a file any gate
    reads.
  - **E-002 is paid — dither's second digested debt.** With the harness live, E-002 moves Open→Paid
    in dither's ledger (keeping its number, with the digestion evidence), so `ledger_trend` ticks
    +7 → +6. This **closes [ring 0041](0041-dither-import-boundary-gate.md)'s own Revisit-when** — the
    import-boundary gate's teeth (and the other four gates') now live in a committed, CI-run harness,
    not only in a ring.
  - **Reversibility: revert the commit** ([ring 0037](0037-dither-map-gate-graft.md)). The change adds
    the harness, `check:gates`, and the `Gates self-test` step, and modifies `CLAUDE.md` and the
    ledger (E-002 → Paid); no product code is touched, and `.seed/` stays outside dither's pnpm
    workspace so lint/typecheck/test are unaffected.
- Alternatives considered:
  - **Add a `gates-are-tested` principle** (keep the "one principle per CI step" simplicity, raise
    `enforcement_ratio` to 8/8). Rejected — it mis-categorizes LAW-6 verification-infra as a golden
    norm; the seed's own self-test is not a principle; "the gates are tested" is not a norm *about
    dither*. The honest fix is to state the category in `CLAUDE.md`, not to mint a principle.
  - **Copy the seed's `self-test.ts` verbatim** (all ~26 organs). Rejected — dither has five gates,
    not the seed's rings/plans/pollen/assessments anatomy; those cases would be dead weight or fail on
    absent organs. A scoped port tests exactly dither's surface (SEED.md §4, method-not-dogma).
  - **`cpSync` the whole working tree** (the seed's own approach). Rejected — it copies dither's
    gitignored build output (slow, and not what the gates read); copying `git ls-files` is faster and
    is precisely the tree the gates judge.
  - **Export `HEAD` via `git archive`** instead of the working tree. Rejected — the self-test should
    judge the *working tree* (uncommitted edits included), the seed self-test's semantic; copying
    tracked files' working-tree content preserves it while still excluding build output.
  - **One combined pass over all five gates** (mutate once, run all). Rejected — each gate must see
    exactly its own seeded violation in isolation, or one fired gate could mask another's silence; one
    clone per case keeps the teeth independent.
- Enforcement: CI gate (LAW-6). dither's
  [`ci.yml`](https://github.com/fliip92/dither/blob/main/.github/workflows/ci.yml) runs
  `node .seed/tests/gates-self-test.ts` as the `Gates self-test` step (pure git + node, install-free)
  beside the five gates it verifies. Verified this session: **GREEN + 15/15 cases** on dither's
  committed tree — five baselines pass every gate; ten teeth fire (exit 1) with the law-naming
  message (map dead-link; ADR cite-absent + add-unnamed; principles phantom-enforcer + missing-field;
  ledger bad-enum + missing-section; import-boundary R1/R2/R3); the **test-of-the-test** confirmed by
  neutering `map-gate` and watching its tooth go red. Measured by the seed's read-only
  [repo-fitness](../../.seed/checks/repo-fitness.ts) (dither byte-identical): `enforcement_ratio`
  **100% (7/7, unchanged — no new principle)**; `map_reachability` 11.7% → **11.9%** (the `CLAUDE.md`
  + ledger edits added reachable edges); E-002 Open→Paid so `ledger_trend` **+7 → +6**, the second
  digestion; `drift_count` held at **2**. The landing range `607bc64..9f41427` — what hosted CI judges
  on push — is green on all five gates **and** the new self-test. Seed-side `npm run check` +
  `npm test` green.
- Revisit-when: a **sixth gate is grafted** (add its violation classes to the harness — the harness is
  a gate's standing home for its teeth now); a **gate's output format changes** (update the asserted
  substrings — the teeth pin the message deliberately); the seed's own `self-test.ts` **gains a case
  class** worth porting to dither's surface; the next refactor units land (**E-007** map-reachability
  sweep, then **E-006** stale spike refs — plan 0009's queue); or a **second host** needs the harness
  (generalize past dither's five-gate hardcode — the [ring 0016](0016-repo-fitness-generalizes-the-metric-engine.md)
  second-host bar). This is plan 0009's U2; the owner-paced feature track runs alongside.
