# Ring 0041 — dither's import-boundary gate (Metabolize refactor E-001): the first Metabolize mutation; an owned R1/R2/R3 structural check over the verbatim engine; the pre-flight found the elicited package graph itself drifted (traits/matrix "build on droid-file" → they build on traits) and the target was corrected to the code (fix docs to code) before enforcing; E-001 Open→Paid — dither's first digested debt

- Date: 2026-07-19
- Stage: 4 — Pollination
- Raised-by: seed
- Question: [Plan 0009](../plans/active/0009-dither-metabolize.md) opens SEED.md §4 **step 5 —
  Metabolize** on dither, and its first refactor-toward-architecture unit (U1) is
  [E-001](https://github.com/fliip92/dither/blob/main/docs/plans/entropy-ledger.md) — the
  app→package import boundary ([dither.md](../architecture/dither.md) Rule 5) held by convention, not
  by a test. Left to design time: the **mechanism** (an owned script vs. an imported
  dependency-cruiser); **what exactly to assert**; and — the load-bearing one, surfaced by building
  the check's oracle — that the package graph the test would enforce (as stated in dither.md Rule 5,
  distilled from dither's `architecture.md`) is **drifted from the code**, so *which graph is truth*
  had to be resolved before any lint could encode it (SEED.md §5: ambiguity becomes a decision, never
  a silent assumption baked into a check).
- Decision: Built and committed to dither (`607bc64`, local; the push stays Gardener-gated). The
  first mutation of a real external host on the **Metabolize** track (the Graft track completed with
  [plan 0007](../plans/completed/0007-dither-graft.md)). The design:
  - **The read-only pre-flight caught a drifted target, and the Gardener chose *fix docs to code*.**
    Reading dither's real import graph (declared `@dither/*` deps + source imports, byte-identical)
    against the stated one split E-001 in two. The **direction rule holds** — no `packages/**` file
    imports an `apps/**` workspace. But the **stated inter-package graph is inverted**: dither.md Rule
    5 (and dither's `architecture.md` build-order line, *"droid-file … everything else depends on
    it"*) read *"`traits` and `matrix` build on `droid-file`, not each other,"* while the code is the
    reverse — `traits` and `theme` import no `@dither/*` (the dependency-free foundation), `droid-file`
    → `traits` (a value import, `TRAIT_DIMENSIONS`), and `matrix` → `traits`. The source is a
    build-**sequencing** note the Grill sharpened into a false dependency-**direction** claim, which
    the seed's own dither.md inherited. Presented as a fork ([plan 0009](../plans/active/0009-dither-metabolize.md)
    Decision log); the Gardener chose **A — fix docs to code** (the code graph is clean: `traits`
    holds the shared domain vocabulary — `TraitVector`, `MatrixIdentity`, `Palette`). So the target was
    corrected *first*: this seed's [dither.md](../architecture/dither.md) Rule 5 + Shape (seed-side),
    and dither's own [`architecture.md`](https://github.com/fliip92/dither/blob/main/docs/architecture.md)
    build-order line (host-side, surfaced to the owner), now state the code's real graph — then the
    check enforces it, so the enforced graph is the true one. *The first refactor-toward-architecture
    act was to make the architecture target true.*
  - **The verbatim-engine + host-owned-runner pattern extends (rings 0037–0040).**
    [`.seed/checks/import-boundary.ts`](https://github.com/fliip92/dither/blob/main/.seed/checks/import-boundary.ts)
    is dither's runner — the one file of host judgment; `.seed/lib/repo.ts` beside it is the seed's
    engine, confirmed **byte-identical** (no re-copy). It reads the committed tree (`git ls-files`),
    discovers the workspaces from their `package.json` names, and asserts three rules mapped 1:1 to
    dither.md Rule 5: **R1 direction** (no `packages/** → apps/**`), **R2 independence** (a package
    imports only its allowed peers), **R3 gateway-thin** (the Gateway shares only `droid-file` +
    `traits`, ADR-0001).
  - **The allowed graph is encoded intent, not derived from `package.json`.** Deriving the allowed
    edges from declared deps would only prove imports match `package.json` — a tautology, not that the
    *architecture* holds. So the graph is stated in the runner (kept in sync with dither.md Rule 5),
    and the package **set** is cross-checked against reality: adding a package fails the gate until the
    architecture rule is consciously updated (LAW-9 — the invariant tracks the architecture, it does
    not lag it).
  - **An owned script, not a dependency (LAW-7).** The needed subset — walk `git ls-files`, extract
    each source file's import specifiers (`from`, side-effect, dynamic, `require`; comments stripped),
    resolve `@dither/*` and boundary-crossing relative imports, assert R1/R2/R3 — is small and fully
    owned/instrumented/tested, so no `dependency-cruiser` black box is imported.
  - **A seventh principle keeps [ring 0039](0039-dither-principles-gate-graft.md)'s completeness claim
    honest.** Adding an eighth `ci.yml` gate step (Import boundary) would silently falsify the
    principles organ's *"every norm CI enforces is stated"* (no completeness gate catches it — ring
    0039's soundness-only decision), so
    [`package-boundaries-hold`](https://github.com/fliip92/dither/blob/main/docs/principles/package-boundaries-hold.md)
    is stated, naming `node .seed/checks/import-boundary.ts`. `enforcement_ratio` stays 100% (7/7). A
    `CLAUDE.md` pointer keeps it on the map.
  - **E-001 is paid — dither's first digested debt.** With the invariant live, E-001 moves Open→Paid
    in dither's ledger (keeping its number, with the digestion evidence), so `ledger_trend` records the
    first negative tick against the graft's `+8` — the ledger now records both live debt and what has
    been metabolized (LAW-8), which is the point of seeding it.
  - **Not ring 0028's pure-additive beachhead (as the graft items were not).** The change adds the
    runner + the principle, and modifies `ci.yml` (+ the gate step), `package.json` (+ `check:imports`),
    `CLAUDE.md`, `docs/principles/README.md`, `docs/architecture.md` (the target correction), and
    `docs/plans/entropy-ledger.md` (E-001 → Paid). Reversibility is *revert the commit → byte-identical*
    ([ring 0037](0037-dither-map-gate-graft.md)).
- Alternatives considered:
  - **Encode the stated graph and let it fail** (build the test against dither.md Rule 5 as written).
    Rejected — it would fire on the whole tree on arrival (the stated graph is inverted), turning a
    green-with-teeth invariant into a red one, and would enforce a *false* architecture. The honest
    order is correct-the-target-then-enforce.
  - **Refactor the code to the doc** (make `traits`/`matrix` build on `droid-file`; remove `matrix` →
    `traits`). Rejected by the Gardener's fork choice — it inverts a clean, working layering (`traits`
    is the shared-vocabulary foundation) and touches product code for no architectural gain.
  - **Derive the allowed edges from `package.json`.** Rejected — tautological; it would prove imports
    match declared deps, not that the architecture graph holds, and would silently bless a new bad edge
    the moment someone declared it.
  - **Import `dependency-cruiser`.** Rejected (LAW-7) — the needed subset is small and ownable; the
    graft's whole pattern is owned scripts over the verbatim engine.
  - **Leave app→app unaddressed vs. add a fourth rule.** Kept scope to the three rules dither.md Rule 5
    states (R1/R2/R3); app→app is not stated and no such edge exists, so inventing a rule for it would
    be dogma. Priced-if-it-appears.
- Enforcement: CI gate (LAW-6). dither's
  [`ci.yml`](https://github.com/fliip92/dither/blob/main/.github/workflows/ci.yml) runs
  `node .seed/checks/import-boundary.ts` as a fast, install-free step beside the map, ADR, principles,
  and ledger gates. Verified this session: **GREEN** on dither's committed tree (228 source files, 5
  packages + 3 apps, R1/R2/R3 clean); **TEETH 9/9** on a throwaway skeleton — the gate FIRES (exit 1)
  on R1 (a package importing an app, both bare and via a relative climb), R2 (a foundation package and
  a peer package importing a disallowed peer), R3 (the Gateway importing `matrix`), and an unmapped
  package; and HOLDS (exit 0) on the clean tree, a commented-out violation, and a non-gateway app
  importing every package. Measured by the seed's read-only [repo-fitness](../../.seed/checks/repo-fitness.ts)
  (dither byte-identical): `enforcement_ratio` **100% (7/7)**; `map_reachability` 11.3% → **11.7%**
  (cascade — the principle + pointers); E-001 Open→Paid so `ledger_trend` ticks **+8 → +7**, the
  ledger's first digestion; `drift_count` held at **2**. The landing range `8ce4e11..607bc64` — what
  hosted CI judges on push — is green on all five gates (map, ADR, principles, ledger, import
  boundary). Seed-side `npm run check` + `npm test` green.
- Revisit-when: a **package or app is added or renamed** (update `ALLOWED_PKG_DEPS` + dither.md Rule 5
  — the gate fires until the architecture rule is updated); a **new allowed inter-package edge** is
  genuinely intended (an architecture change — update the graph and record an ADR); an **app→app**
  import appears (price the fourth rule then); the **committed `.seed/` self-test harness**
  ([E-002](https://github.com/fliip92/dither/blob/main/docs/plans/entropy-ledger.md)) is built, at
  which point this gate gains a dither-side self-test (today its teeth live only in this ring); or a
  **second host** needs an import-boundary organ (the generalized-graph-config returns with the
  ring 0016 second-host bar). This is plan 0009's U1 — the next refactor units (E-002, E-007, E-006)
  and the owner-paced feature track follow.
