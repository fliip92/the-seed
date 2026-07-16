# Ring 0028 — the installer + the mandated uninstall path: graft is a refuse-to-clobber beachhead, uninstall its byte-exact inverse

- Date: 2026-07-15
- Stage: 3 — Flowering
- Raised-by: seed
- Question: [Plan 0005](../plans/active/0005-flowering.md) scope item 3 builds the installer and the
  mandated uninstall path (SEED.md §4: *an uninstall path must exist*) — the machinery the release CLI
  reserved the `graft` / `uninstall` verbs for ([ring 0027](0027-release-graft-cli.md)). SEED.md §4's
  Stage 4 step 4 names the graft precisely: *install the map, the plan structure, and the first lints.
  No behavior changes yet.* The build questions the reserved surface left open: **what** does a graft
  lay down, **where** do the scaffolding templates live, **how** does uninstall reverse to
  byte-identical, and **what** verifies it? The plan fixes the exit proof — install-then-uninstall
  against a hermetic scratch repo leaves it byte-identical, the
  [worktrees](0019-parallel-worktrees-host-agnostic-lifecycle.md) hermetic-dry-run shape.
- Decision: Cut. The installer is owned in `.seed/` (portable — a descendant carries the machinery that
  grafts the *next* seed, self-carrying, [E-015](../plans/entropy-ledger.md)) as a graft model
  ([`.seed/lib/graft.ts`](../../.seed/lib/graft.ts)) the CLI's `graft` / `uninstall` verbs orchestrate:
  - **A graft is the Stage-4 step-4 BEACHHEAD, not a turnkey seed.** The running seed installs its own
    portable subset into a target, mapping ring [0026](0026-pollen-boundary-versioning-lineage.md)'s
    three ownership tiers onto two mechanisms:
    - **Copied verbatim** — the **portable** method (`.seed/`, `skills/`) and the **sovereign** genome
      (`SEED.md`). A descendant carries the method *and* the installer, so it can graft onward.
    - **Emitted as parameterized templates** — the **local** scaffold each seed grows itself: the map
      (`AGENTS.md`), the plan structure (`docs/plans/` + the entropy ledger), the decision log
      (`docs/rings/README.md`), the release data (`pollen/pending.md`, `pollen/releases/README.md`),
      the lineage (`pollen/lineage.json`, recording parent + the grafted pollen version + `planted`,
      SEED.md §7), and the minimal plumbing (`package.json`, `.gitignore`) that lets the lints run.
      The other organs (principles, architecture, postmortems, assessments, references, fitness) are
      **not** grafted — they grow through metabolization (SEED.md §4 Stage 4 step 5), which is exactly
      what *"no behavior changes yet"* means. A beachhead that faked a mature seed's organs would be a
      costume (LAW-2).
  - **Templates live as a data module, not as `.md` files.** They sit as strings in
    [`.seed/lib/graft.ts`](../../.seed/lib/graft.ts). A `.md` template carrying `{{placeholders}}` would
    be scanned by the mother's own [validate-map](../../.seed/checks/validate-map.ts) /
    [doc-drift](../../.seed/checks/doc-drift.ts) as if it were a live doc — its placeholder links reading
    as dead links, its path strings as stale references. A `.ts` data module is invisible to those
    `.md`-only scanners and parameterizes cleanly; being in portable `.seed/`, it is carried onward.
  - **Purely additive: graft refuses to clobber.** If any path it would create already exists in the
    target, graft refuses and names the conflict — a host's own files are never overwritten (LAW-2). This
    is the invariant that makes uninstall a clean inverse: a *successful* graft created **every** path in
    its set, so **uninstall removes exactly that set** and prunes the directories it emptied, restoring
    the target byte-identical. **No install receipt is persisted** — the graft plan *is* the receipt
    (LAW-3, one source); a second, recorded list of what-was-installed could only drift from it. Post-graft
    local work the host then does is preserved, never destroyed (a non-empty directory is not pruned).
  - **The verbs are side-effecting, so they live OUT of `run-all`** — the [cut-release](0027-release-graft-cli.md)
    / [worktrees](0019-parallel-worktrees-host-agnostic-lifecycle.md) precedent. `graft <target>
    [--parent owner/repo] [--planted YYYY-MM-DD] [--repo owner/repo] [--dry-run]` and `uninstall <target>
    [--dry-run]` really operate on a target (item 4 installs into a sacrificial repo); `--dry-run`
    computes and prints the plan while writing nothing. `--planted` is a recorded fact, never a
    wall-clock read (ring [0020](0020-onboard-human-generated-briefing.md)), so a graft is deterministic
    and the round-trip self-test is reproducible.
  - **The mother's copied docs dangle until the host metabolizes them.** The portable subtrees carry the
    mother's cross-references to *her* rings and plans, which do not resolve in a fresh graft. That is
    expected — a beachhead is *method, not dogma*, adopted then re-metabolized (Stage 4 step 5) — so the
    graft's verification proves the method is **installed and runs** (the target's own
    [`release.ts sense`](../../.seed/checks/release.ts) executes against the grafted `pollen/` data and
    the lineage is recorded), **not** that every copied link already resolves. Proving a fresh graft
    passes its *full* `run-all` is the recursive self-upgrade test, scope item 4.
- Alternatives considered:
  - **Persist an install receipt (a manifest of created paths) for uninstall to read.** Rejected — the
    graft plan already enumerates exactly what is installed (LAW-3, one source); refuse-to-clobber makes
    the whole set safe to remove, so a receipt would be a second source that can only drift. Promoted only
    if graft ever must overwrite or merge (an *upgrade* of a host that already carries a seed), where
    pre-graft content matters (revisit).
  - **Ship templates as `.md` files under `.seed/templates/`.** Rejected — the mother's `.md`-only
    validate-map/doc-drift would read a `{{placeholder}}`-bearing template as dead links and stale
    references in the mother herself. A `.ts` data module is invisible to them and still portable.
  - **Emit the full anatomy so a graft passes its own `run-all` immediately.** Rejected as over-reach for
    this item — SEED.md §4 step 4 is *"the map, the plan structure, and the first lints. No behavior
    changes yet."* The full-seed recursive test is scope item 4; fabricating organs a graft has not grown
    would be a costume (LAW-2).
  - **Make graft a hermetic-only dry-run (worktrees-style, no real target).** Rejected — `graft` /
    `uninstall` are real capabilities (item 4 installs into a sacrificial repo). The hermetic round-trip
    is their *verification*, not the verb itself; the verb takes a real `<target>`.
  - **Overwrite existing files on graft.** Rejected — clobbering a host's own files is not additive and
    makes uninstall non-invertible (it would have to restore originals, needing the very receipt above).
    Refuse-and-report keeps graft purely additive and uninstall a clean inverse.
- Enforcement: structural + self-test, LAW-6. Because `graft` / `uninstall` mutate a target tree they
  are out of `run-all` (like `cut-release` and the worktrees lifecycle); their verification is a hermetic
  round-trip pinned by the [self-tests](../../.seed/tests/self-test.ts) in the worktrees three-binding
  shape: **works** — a graft into a scratch git repo lands the method (the copied `.seed/` + `skills/` +
  `SEED.md`), the target's own `release.ts sense` runs and reports `v0.0.0` against the grafted data, and
  `pollen/lineage.json` records the given parent / seed version / `planted`; **has teeth** — graft
  *refuses* a clobber (a pre-existing target file makes it exit non-zero naming the conflict), and the
  round-trip proves graft actually **changed** the tree (`treeHash` before ≠ after graft) **and**
  uninstall **restored** it byte-identical (`treeHash` before = after uninstall), so a no-op graft or a
  no-op uninstall each turn the test red; **side-effect-free preview** — `--dry-run` writes nothing
  (proven by an unchanged tree hash). The scratch repo is removed in a `finally`, so a run leaves no
  trace.
- Revisit-when: graft must **upgrade** a host that already carries a seed (overwrite/merge, where
  pre-graft content matters and a receipt or 3-way merge earns its place — the receipt alternative
  returns); the beachhead's copied portable docs' dangling mother-references need automated rewriting at
  graft time (a Stage 4 metabolization tool, not a fresh-graft concern); or the template scaffold proves
  too thin for a real host and must grow an organ — each a new ring superseding the relevant part.
