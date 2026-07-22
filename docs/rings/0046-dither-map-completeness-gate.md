# Ring 0046 — dither's map-completeness gate (Metabolize E-010/E-011): the sensing pass finds E-009 was a class, and the recurrence triggers the pre-registered invariant

- Date: 2026-07-21
- Stage: 4 — Pollination
- Raised-by: seed (the second entropy-sensing pass on dither, [plan 0009](../plans/active/0009-dither-metabolize.md)
  refactor track; the Gardener chose to build the invariant)
- Question: the first sensing pass ([ring 0045](0045-dither-sensing-pass-theme-layout.md)) converted
  E-009 — `@dither/theme` missing from architecture.md's Repo layout — and named a Revisit-when: *"if
  package↔layout drift recurs, a layout-completeness drift class is a candidate invariant."* The second
  pass found the recurrence: `theme` (and `matrix-playground`) were also absent from README.md's layout
  and CONTEXT-MAP.md's context list — E-009 had fixed one of three package-enumerating maps. The trigger
  is met. Fix the instances, and does the invariant get built now?
- Decision:
  - **Both — fix the instances (E-010) and build the invariant (E-011).** The Gardener chose to honor
    E-009's pre-registered trigger fully: a drift class that recurred across three maps from a single
    package addition earns a standing check, not a third one-off fix.
  - **E-010 (the instances):** `theme` + `matrix-playground` added to README.md's layout and
    CONTEXT-MAP.md's context list (architecture.md was already fixed by E-009), so all three maps now list
    every workspace. A gardening fix; `drift_count` held 0 (directory refs, not file-path claims).
  - **E-011 (the invariant) — the sixth dither gate.**
    [map-completeness.ts](https://github.com/fliip92/dither/blob/main/.seed/checks/map-completeness.ts), a
    dither-owned runner over the verbatim `lib/repo.ts` (the rings [0037](0037-dither-map-gate-graft.md)–[0041](0041-dither-import-boundary-gate.md)
    graft pattern), asserts every `packages/*`/`apps/*` workspace — discovered by its package.json, as the
    import-boundary gate does — is listed in each of the three layout maps. "Listed" = the dir basename
    with a trailing slash (`theme/`) or the full dir path (`packages/theme`), matched on a name boundary
    so `matrix` never counts `matrix-playground`. A new workspace fires it until every map lists it — the
    import-boundary gate's "a new package fires until the rule is consciously updated" philosophy applied
    to the maps (LAW-9: the invariant tracks the layout, it does not lag it). It carries the eighth
    principle [maps-are-complete](https://github.com/fliip92/dither/blob/main/docs/principles/maps-are-complete.md),
    keeping ring 0039's "every norm-enforcing CI step has a principle" completeness claim honest
    (`enforcement_ratio` holds 100%, now 8/8), and a gates-self-test tooth *pair* — a new package in no
    map, and a workspace dropped from one map (proving the check is genuinely per-map, not "listed in any
    map"). Verified green + 18/18, and the **test-of-the-test**: neutering the gate turns all three of its
    self-test cases red.
  - **Why a gate, not another advisory drift class.** The stale-path drift scan is advisory and checks
    that *named* paths resolve; it structurally cannot see a *missing* entry. Map-completeness is a
    positive assertion (every unit is present), which fits a hard gate with teeth. And the recurrence
    proved it is not a one-off — the whole point of pre-registering the Revisit-when.
- Alternatives considered:
  - **Fix E-010 only, no gate.** Rejected by the Gardener: it would be the third one-off fix for one
    class, and the next package addition would drift again. The pre-registered trigger existed precisely
    to escalate here (LAW-8: a recurring debt earns a standing instrument).
  - **Scope the gate to CONTEXT-MAP only** — the single map that explicitly states "Contexts follow the
    monorepo layout." Considered as the tightest-grounded scope, but the Gardener chose all three maps:
    README and architecture layouts are navigation surfaces an agent reads too, and gating all three makes
    "add a package → add it to every map" the enforced rule. The added brittleness is bounded — a fourth
    map, or a deliberate per-map omission, is a conscious edit to `MAPS` in the runner.
  - **A completeness principle without a gate.** Rejected: a principle whose enforcer CI never runs is
    exactly what the principles gate refuses (its phantom-enforcer tooth). A norm becomes a principle only
    once its CI step exists.
- Enforcement: CI gate — the `Map completeness gate` step runs
  `node .seed/checks/map-completeness.ts` (dither CI), stated as the `maps-are-complete` principle and
  self-tested by two gates-self-test teeth (plus the neuter test-of-the-test). Green on the tree (8
  workspaces × 3 maps); the landing range `eeb5fdd..1274d48` is green on all six gates + the self-test.
  `enforcement_ratio` 100% (8/8), `drift_count` 0, `ledger_trend` +4 (E-010 + E-011 sensed and paid in
  one pass — no new open debt), `map_reachability` 48.2% → 48.8%. Seed-side `npm run check` +
  `npm test` + `npm run garden` green (no seed code change — this is a dither-side gate over the verbatim
  engine).
- Revisit-when: a workspace legitimately should not appear in a given map (e.g., an internal-only package
  a public README omits) — then the gate needs a per-map exclusion, a conscious edit to `MAPS` / the
  runner rather than a silent carve-out; or a fourth layout map appears and should be enforced (add it to
  `MAPS`).
