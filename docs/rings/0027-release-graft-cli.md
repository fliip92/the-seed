# Ring 0027 — the release / graft CLI: the determinism split made mechanical

- Date: 2026-07-15
- Stage: 3 — Flowering
- Raised-by: seed
- Question: [Plan 0005](../plans/active/0005-flowering.md) scope item 2 builds the owned `.seed/`
  release/graft CLI — the [E-015](../plans/entropy-ledger.md) conversion path. Ring
  [0026](0026-pollen-boundary-versioning-lineage.md) fixed the *model* (pollen is semver; the impact
  class is declared-and-checked; the bump is a pure function of the max declared impact; a major
  forces a migration; the decision log is the changelog) but left the *build* — where committed intent
  lives, what shape the release history takes, how the three determinism-split artifacts are enforced,
  and the CLI's verb surface — to this per-item ring (the plan-0003 rhythm). How is it built?
- Decision: Cut. The CLI is owned in `.seed/` (portable, so a descendant carries it and cuts its own
  pollen — self-carrying, E-015), a thin orchestrator over the already-built organs. The
  [ring 0020](0020-onboard-human-generated-briefing.md) determinism split maps onto three concrete
  artifacts, each with its own enforcement:
  - **Committed intent → one file, [`pollen/pending.md`](../../pollen/pending.md).** The unreleased
    portable changes awaiting the next release, each a top-level bullet
    `- Impact: <major|minor|patch> — [ring NNNN](…) — <one-line summary>`. Declared, not parsed from
    commit keywords (ring 0026). One always-present file, not a changeset-style directory of many —
    reachability is a single link, validation is simple, and the seed is a solo-Gardener line where
    parallel-intent merge conflicts are not yet a live cost (the revisit trigger below). `pollen/` is
    LOCAL (each seed grows its own intents); the boundary is unchanged.
  - **Pending-release notes → generated, byte-exact.** [`docs/generated/pending-release.md`](../generated/pending-release.md)
    is a pure function of `pending.md` + the manifest's `POLLEN_VERSION` + the release history —
    registered in the generation manifest ([`.seed/lib/generated.ts`](../../.seed/lib/generated.ts)) so
    [validate-generated](../../.seed/checks/validate-generated.ts) gives it the byte-exact, in-`run-all`
    gate for free (ring 0020's "pure pending notes computed from committed intent"). It states the next
    version (bumped by max declared impact), the composing rings, and whether a migration is required.
  - **Release history → append-only, per-release files.** A cut release is a dated, recorded-once fact
    (the ring shape), so each lands as one file `pollen/releases/vX.Y.Z.md` under
    [`pollen/releases/`](../../pollen/releases/README.md), and
    [release-append-only.ts](../../.seed/checks/release-append-only.ts) — a near-clone of
    [ring-append-only](../../.seed/checks/ring-append-only.ts), the same git-aware CI gate — forbids
    modifying or deleting one (the index README exempt). A single append-only `RELEASES.md` was
    rejected: it would need fragile line-level append-only checking; per-file reuses the proven
    file-level gate.
  - **cut-release → git-aware, side-effecting, out of `run-all`.** It bumps `POLLEN_VERSION` and the
    lineage `seedVersion`, writes the release file, clears `pending.md`, and regenerates the notes. Its
    `--date` is **required** — a release date is a recorded fact, so the tool reads no wall-clock and a
    cut is fully deterministic (ring 0020). Its `--dry-run` is its verification (the
    [worktrees](0019-parallel-worktrees-host-agnostic-lifecycle.md) /
    [feedback](0021-feedback-composes-upstream-issue.md) precedent): it computes and prints the plan and
    writes nothing, pinned by the self-tests in the three-binding shape (works / has teeth /
    side-effect-free).
  - **The pure invariants → [validate-release.ts](../../.seed/checks/validate-release.ts) (in `run-all`).**
    Every intent is well-formed and names an existing ring; every release file is semver-named, dated,
    and strictly increasing; `POLLEN_VERSION` equals the latest release (or `0.0.0` when none) — the
    single version source tracks the history; and every **major** release links an existing migration
    (the migration-required tooth's structural half). It is a pure function of the working tree (the
    validate-generated shape), so it gates in `run-all`.
  - **The verb surface.** `sense` (report a target's pollen version, released history, and pending next
    release — the read side a descendant runs against its mother), `cut-release`, `verify` (delegates to
    `run-all` — prove a grafted seed holds its invariants), and `feedback` (delegates to the
    [feedback composer](../../.seed/checks/feedback.ts)) are working verbs. `graft` and `uninstall` are
    **reserved** — their machinery *is* plan 0005 scope item 3 (the installer + the mandated uninstall
    path); the CLI names them (the surface is complete and self-carrying) and each emits a legible
    "lands in scope item 3" notice rather than a costume that pretends to install (LAW-2).
  - **The first release is not cut here.** Two real intents are declared now — the boundary (ring 0026)
    and this CLI (ring 0027), both minor — so the notes show a true pending **v0.1.0** and the mechanism
    is exercised on real content, not only in tests. Cutting it is deferred to scope item 4 (the
    recursive test: upgrade the seed using its own pollen, fitness measured before and after), where the
    first real cut belongs.
- Alternatives considered:
  - **Changeset-style `pollen/pending/*.md` (one file per intent).** Rejected for now — conflict-free
    parallel authorship is its only advantage, and the seed is a single-Gardener line; one file is
    simpler to reach (one link) and validate. Promoted to files if parallel intents start colliding
    (revisit).
  - **A single append-only `pollen/RELEASES.md`.** Rejected — append-only on one growing file needs
    line-level diffing (existing sections must not change while new ones append); per-release files reuse
    ring-append-only's file-level logic verbatim.
  - **Read the wall-clock for the release date.** Rejected — a required `--date` keeps the seed
    clock-free and cut-release deterministic (the release date is a recorded fact, ring 0020), and makes
    the dry-run self-test reproducible.
  - **Ship `graft`/`uninstall` as working verbs now.** Rejected — the install/uninstall machinery is
    scope item 3; a stub that pretends to graft is doc-only enforcement in a costume (LAW-2). Reserve
    the surface, defer the capability honestly.
- Enforcement: structural + gate, LAW-6. [validate-release.ts](../../.seed/checks/validate-release.ts)
  (in `run-all`) proves the pure invariants; [validate-generated.ts](../../.seed/checks/validate-generated.ts)
  proves the pending notes are byte-exact; [release-append-only.ts](../../.seed/checks/release-append-only.ts)
  (the CI gate) proves the history is append-only; and the cut-release `--dry-run` is pinned by the
  [self-tests](../../.seed/tests/self-test.ts) in the three-binding shape (works / has teeth /
  side-effect-free), with the real-cut path proven to bump, clear, regenerate, and leave `run-all` green.
- Revisit-when: parallel intents start colliding in one `pending.md` (promote to per-intent files); the
  first **major** release needs its migration home (`pollen/migrations/`) created and the tooth's
  cut-time half exercised on a real migration; or a descendant's `sense`/`graft` needs a
  baseline-diff richer than "releases since version X" (scope item 4 / Stage 4 may grow it) — each a new
  ring superseding the relevant part.
