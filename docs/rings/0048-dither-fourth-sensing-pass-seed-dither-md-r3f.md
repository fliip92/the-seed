# Ring 0048 — fourth entropy-sensing pass on dither; dither clean/unchanged, the seed's own dither.md R3F drift fixed (the seed-side complement to E-012), and ledger_trend matures from a level to a rate

- Date: 2026-07-27
- Stage: 4 — Pollination
- Raised-by: seed (the Gardener directed another sensing pass on dither; [plan 0009](../plans/active/0009-dither-metabolize.md)
  refactor track, whose default is *sense new entropy* once no priced entry is pending — AGENTS.md
  §"Nothing active?", SEED.md §3)
- Question: dither is byte-identical to [ring 0047](0047-dither-third-sensing-pass-stack-drift.md) (HEAD
  still `b8d3823`, no owner commits since), and pass 3 already swept its surfaces deeply. What does a
  fourth pass find — in dither, or in the seed's own dither-facing artifacts — without manufacturing debt?
- Decision:
  - **dither re-verified clean and unchanged.** HEAD still `b8d3823`; `drift_count` 0, `enforcement_ratio`
    8/8, `map_reachability` 48.8%. The two genuinely lightly-examined surfaces were confirmed clean:
    README.md's prose is accurate (it already reads "workshop/ Vite + React SPA" — no R3F drift), and there
    is only `ci.yml` (no other workflows to audit). No new dither entropy — the refactor track is
    idle-clean, as expected on an unchanged repo already swept in pass 3.
  - **One genuine finding, seed-side: `docs/architecture/dither.md:7` described the workshop as
    "static Vite + R3F".** This is the same `react-three-fiber` drift E-012 fixed on the dither side
    ([ring 0047](0047-dither-third-sensing-pass-stack-drift.md) / fork A), left uncaught here because E-012
    was scoped to dither's own repo. The seed's [dither.md](../architecture/dither.md) is the Grill's
    elicited target; it inherited the R3F assumption from the pre-E-012 ADR-0006 / architecture.md mention.
    Fixed → "static Vite + React" (the workshop is a Vite + React SPA that renders the matrix face via
    WebGPU; `react-three-fiber` is the *deferred* 3D bust). This is the seed-side complement to E-012,
    parallel to how [E-001 / ring 0041](0041-dither-import-boundary-gate.md) corrected this same doc's
    *package-graph* line. **Scoped to one line:** every other R3F / stack reference across seed docs is
    either a narrative *record* of the E-012 work (correctly describing the drift that was fixed) or an
    append-only ring — not drift; dither's own README already reads correctly.
  - **Observation (not entropy): `ledger_trend` read -2 (was +4) with no dither commit — the metric
    maturing exactly as its code documents.** It is a *7-day net delta* of open entries
    ([fitness-metrics.ts](../../.seed/lib/fitness-metrics.ts)): while dither's ledger was younger than the
    window the baseline was "0 open" so it read as the open-count *level* (+8 → +7 → … → +4); now that the
    ledger has aged past 7 days it reads the true weekly *flow* — **-2 = net 2 entries digested this week,
    a healthy shrink**. No metric change (SEED.md §6): it tracks real health correctly. The imprecision was
    the informal "`ledger_trend` +N = N open" shorthand (in the memory and prior reports), corrected here to
    "`ledger_trend` is a **rate**, not a level." As the pass-3 conversions age out of the window it drifts
    toward 0 in a quiet week — expected, not a regression.
- Alternatives considered:
  - **Manufacture entropy on an unchanged, already-deeply-swept repo.** Rejected — "dither clean/unchanged,
    one seed-side fix, one metric note" is a valid metabolism (AGENTS.md §"Nothing active?": when nothing is
    open, sensing *is* the work). Re-scanning byte-identical surfaces finds nothing new by construction.
  - **Price the seed's dither.md R3F drift as open debt (seed ledger).** Rejected — it is a resolve-now
    stale-reference (deletion class, the [ring 0007](0007-gardening-cadence-automerge.md) automerge shape),
    fixed in-pass; a ledger entry is for debt that outlives the pass, not a one-line gardening correction.
  - **Replace or rescope `ledger_trend` because it "swung 6 points with no commit."** Rejected — the swing
    is the young-repo baseline aging out, which the metric's own code explicitly documents; -2 is the honest
    weekly-delta reading. The metric tracks real health; only the shorthand was off (SEED.md §6: replace a
    metric that *stops* tracking real health — this one still does).
  - **Treat the seed's dither.md as append-only (leave the drift).** Rejected — unlike an ADR, the elicited
    architecture target is a *living* doc the seed maintains to match the host's code (E-001 already
    corrected it under plan 0009); a stale current-state claim in it is drift to fix, not a historical record.
- Enforcement: doc-only — the [dither.md](../architecture/dither.md) fix is a stale-reference gardening
  correction (the [ring 0044](0044-dither-e006-stale-spike-refs-gardened.md) / [0045](0045-dither-sensing-pass-theme-layout.md)
  shape), its correctness that the Shape line now matches dither's code (a Vite + React workshop — verified
  against dither's README + `apps/workshop/package.json`, no `three` / `react-three-fiber`). No new
  instrument (one line, seed-side); one recurrence would not warrant one (LAW-7). **No dither mutation this
  pass** (dither is clean and unchanged), so no dither commit and nothing to push there. Seed-side
  `npm run check` (validate-map + validate-architecture green on the edited dither.md) + `npm test` (241) +
  `npm run garden` (`drift_count` 0) green. `map_reachability` 48.8%, `drift_count` 0, `ledger_trend` -2
  (metric maturation, informational).
- Revisit-when: the seed's dither.md drifts from dither's code again as the product is built (each a
  stale-reference gardening fix; only if it recurs often would a check that the elicited target's stack
  claims resolve against the host be worth building, LAW-7); or `ledger_trend` is read as a level rather
  than a 7-day rate (it is a rate — this ring is the reference).
