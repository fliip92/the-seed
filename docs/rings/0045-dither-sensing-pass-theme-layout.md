# Ring 0045 — first entropy-sensing pass on dither post-queue-drain; dither clean, E-009 (theme absent from layout) converted

- Date: 2026-07-20
- Stage: 4 — Pollination
- Raised-by: seed (the Gardener directed a sensing pass on dither once the structural refactor queue
  drained; [plan 0009](../plans/active/0009-dither-metabolize.md) refactor track)
- Question: with E-001/E-002/E-007/E-006 all digested, the refactor track's default becomes *sense new
  entropy* ([AGENTS.md](../../AGENTS.md) §"Nothing active?"; SEED.md §3). What new entropy does dither
  carry, and what converts now — without manufacturing debt to look busy?
- Decision:
  - **The pass found dither substantially clean** — the graft's original sensing holds. `drift_count` 0;
    no genuine `// TODO`/`FIXME`/`HACK` in source (the 115 raw hits were the phone's `todo_*` product
    feature, not markers); no unimplemented stubs; the [architecture.md](https://github.com/fliip92/dither/blob/main/docs/architecture.md)
    risk register fully accounted (2 priced pending-actions E-003/E-004; 3 mitigated-by-decision excluded
    — voice/cost/edge, the risk-register honesty filter); 7 principles, one per CI norm, none vacuous
    (`enforcement_ratio` 100%); well-tested (77 test files / 148 source; the security-critical seal,
    ADR-0007, has `seal.test.ts` + a `tampered-seal.droid` fixture).
  - **One genuine new entry, priced and converted in the same pass: E-009** — architecture.md's "Repo
    layout" diagram lists four packages but the repo has five; `@dither/theme` (design tokens + the
    dither/Bayer motif, imported by ~10 app files) was absent — a residual of the E-001 correction, which
    updated the doc's build-order *direction* line to name `theme` as foundation but left the *layout*
    diagram stale, so the doc contradicted itself. Uncaught by every gate: the stale-path drift scan
    flags only backtick paths that fail to resolve (not a *missing* entry), and the import-boundary gate
    knows `theme` but does not read the prose layout. Converted here: `theme/` added to the layout, so the
    diagram and the build-order line agree and every committed package appears in the map. `drift_count`
    held 0 (the layout is a fenced block — the addition makes no inline path claim); `ledger_trend` +4
    unchanged (sensed and paid in one pass nets zero open debt).
  - **One marginal candidate noted, not priced into dither's ledger: E-010** — the 43 vendored
    `.agents/skills/*.md` (pinned from mattpocock/skills) floor `map_reachability` at 48.2%. Left as
    [ring 0043](0043-map-reachability-scoped-to-knowledge-artifacts.md)'s Revisit-when per the Gardener,
    rather than duplicating it as a dither entry.
- Alternatives considered:
  - **Manufacture entropy to fill the drained queue.** Rejected — the honest finding is that dither is
    clean; a sensing pass whose main output is "clean, plus one real fix" is a valid metabolism
    (AGENTS.md: with every entry gated or none open, *sensing new entropy is the work*). Inventing debt
    to look busy would violate SEED.md §0/§3.
  - **Price the branch-protection gap as dither entropy.** dither `main` is unprotected, so a red CI run
    does not mechanically block a merge. Rejected: the **seed's own `main` is also unprotected** (checked
    — GitHub returns 404) — CI-on-push + single-owner push-via-bang is the *inherited* operating model,
    not a dither defect; pricing it would hold dither to a bar the seed itself does not meet.
  - **Price the graphify soft-dependency.** CLAUDE.md instructs agents to use/update a gitignored,
    locally-generated graph. Rejected: a deliberate optional aid with a safe grep fallback (the same
    stance the seed took on graphify), and the vendored skills it pairs with are committed + pinned
    (`skills-lock.json`) — no reproducibility debt.
  - **Build a "layout completeness" gate now** (assert every package/app appears in architecture.md's
    layout). Rejected for a single occurrence (LAW-7); named as a candidate invariant in E-009's
    conversion path if the drift recurs.
- Enforcement: doc-only — E-009 is a gardening fix (the [ring 0044](0044-dither-e006-stale-spike-refs-gardened.md)
  shape) with no new instrument; its correctness is that architecture.md's layout now matches
  `git ls-files` (5 packages) and the doc's own build-order line, verified by reading both, and the
  standing `drift_count` scan stays 0. All five dither gates + the gates self-test green on the landing
  range `0f078ef..eeb5fdd` (the ledger gate now reads 9 entries all priced; import-boundary 5 packages +
  3 apps); seed-side `npm run check` + `npm test` + `npm run garden` green (no seed code change).
- Revisit-when: package↔layout drift recurs (a package added without updating architecture.md's layout)
  — then the "layout completeness" drift class becomes worth building as a dither invariant; or the
  vendored-doc reachability floor (E-010 / ring 0043 Revisit) is decided host-side.
