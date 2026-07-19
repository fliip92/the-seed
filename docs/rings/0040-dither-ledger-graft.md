# Ring 0040 — dither's entropy ledger (graft item 4): 8 entries seeded from its own pre-sensed entropy + what the graft surfaced; a ledger-only gate over the verbatim engine (dither has no plan system); fire-when-present; the risk-register honesty filter; ledger_trend null→+8, map_reachability 6.1%→11.3% cascade — the dither Propose→Graft completes

- Date: 2026-07-19
- Stage: 4 — Pollination
- Raised-by: seed
- Question: [Plan 0007](../plans/active/0007-dither-graft.md) graft item 4 — the **seeded entropy
  ledger** — is the fourth and last organ of the dither graft, authorized under
  [ring 0034](0034-dither-graft-approved.md) and anticipated in [ring 0039](0039-dither-principles-gate-graft.md)'s
  revisit-triggers. The plan sets the shape ("create dither's ledger from its own pre-sensed
  entropy — `architecture.md`'s 'Deferred to build time' list, the risk register, the `docs/spikes/`
  feasibility notes — each an interest rate + conversion path", and price in four graft-surfaced
  items: the deferred import-boundary test, the `.seed/`-gates-have-no-self-test gap, the 2 `docs/spikes/`
  drift references, and the 6.1% `map_reachability` sweep) and its verification ("ledger validates;
  `ledger_trend` computable"). Left to design time: **where the ledger lives** (the metric's path is
  hard-coded); **what the gate validates**, given dither has no plan/ring system to attach the Seed's
  `validate-plans` to; **which** pre-sensed items are genuine priced debt versus managed risk or a
  deliberate product deferral; and whether adding a fifth norm-gate obliges a sixth principle
  ([ring 0039](0039-dither-principles-gate-graft.md)'s completeness claim).
- Decision: Built and committed to dither (`8ce4e11`, local; the push stays Gardener-gated). The
  design:
  - **The verbatim-engine + host-owned-runner pattern extends (rings 0037/0038/0039).**
    [`.seed/checks/ledger-gate.ts`](https://github.com/fliip92/dither/blob/main/.seed/checks/ledger-gate.ts)
    is dither's runner — the one file of host judgment; `.seed/lib/repo.ts` beside it is the Seed's
    engine, confirmed **byte-identical** this session (no re-copy). The runner composes the engine's
    `readRepoFile` / `formatViolation` / `findSequenceIssues` / `Violation` with the ledger vocabulary,
    reading the committed tree (`git ls-files`).
  - **The ledger lives at `docs/plans/entropy-ledger.md` because the metric hard-codes that path.**
    The Seed's `ledger_trend` ([.seed/lib/fitness-metrics.ts](../../.seed/lib/fitness-metrics.ts)) reads
    a fixed `docs/plans/entropy-ledger.md` — the [E-012](../plans/entropy-ledger.md)/[E-016](../plans/entropy-ledger.md)
    hard-coded-path shape, not yet generalized. A dither-native path would read a false null, defeating
    the "`ledger_trend` computable" verification. So the ledger lands at that path — but `docs/plans/`
    is scoped to **the ledger only**: dither does **not** adopt the plan/ring system (decisions are ADRs
    — item 2's gate; work is GitHub Issues), stated plainly in its
    [`docs/plans/README.md`](https://github.com/fliip92/dither/blob/main/docs/plans/README.md). No plan
    format is imposed (confirmed: `plan_traceability` stays null — creating the ledger file triggers no
    `docs/plans/active|completed/` or `docs/rings/` decision log).
  - **The gate validates the LEDGER ONLY, and fires only when it is present.** The Seed's
    `validate-plans` validates both its plans and its ledger; the runner ports the **ledger half only**
    (Open/Paid sections present; every `## E-NNN — …` entry priced with the five fields — First observed,
    Where, Interest rate `high|medium|low`, Price, Conversion path; E-numbers sequential 1..N across both
    sections), the faithful subset for a repo with no plan system (*method, not dogma*). And it **fires
    only when the ledger exists** ([ring 0035](0035-stage-agreement-invariant.md)'s shape, like
    principles-gate skipping an empty organ): an absent ledger is `ledger_trend`'s honest null finding,
    not a CI failure — the ledger is dither's chosen organ, not mandatory machinery.
  - **Eight entries, and the honesty filter on the risk register.** Seeded across all three sources +
    the four graft-surfaced items: E-001 import-boundary test unbuilt ([dither.md](../architecture/dither.md)
    Rule 5, deferred to Metabolize), E-002 the `.seed/` gates have no committed self-test
    ([ring 0038](0038-dither-adr-gate-graft.md) gap), E-003 `react-native-wgpu` unproven on tester
    hardware, E-004 `.droid` file-association un-OTA-able (the two risk-register entries), E-005
    local-brain productization parked, E-006 the two `docs/spikes/` drift references, E-007 the map's
    low reachability, E-008 the deferred build-time decisions. The **filter**: a risk register mixes
    debt with managed risk, so only a risk whose mitigation is a **pending action** became an entry —
    E-003 ("test on mid-range Android in week 1", un-run) and E-004 (build the import path first,
    un-verified); the three risks mitigated by an **already-made decision** (voice→frozen Persona Card,
    cost→Gateway budgets, edge-runtime→Hono portability) are *managed*, not open debt, and are excluded.
    The deferred list collapsed to one low-interest entry (E-008), naming the `matrix` engine API surface
    as the one sub-item that calcifies — and noting it already has a home (the Vite playground, build
    order step 2). E-005 was **reframed after reading [ADR-0009](https://github.com/fliip92/dither/blob/main/docs/adr/0009-two-brain-interface-local-and-cloud.md)**:
    the local-brain *experience* is cleared (a 4B holds a Persona Card's voice at 5/6 right-tool), so the
    entry is the *parked productization* (R2 hosting, cartridge↔model binding, entitlements) plus the one
    genuine unknown — separate-file quantized-LoRA-adapter composition — not "feasibility unrun."
  - **A sixth principle keeps [ring 0039](0039-dither-principles-gate-graft.md)'s completeness claim
    honest.** Adding a fifth norm-gate (Ledger gate) to `ci.yml` would silently falsify the principles
    organ's "every norm CI enforces is stated" — there is no completeness gate to catch it (ring 0039's
    soundness-only decision) — so
    [`entropy-is-priced`](https://github.com/fliip92/dither/blob/main/docs/principles/entropy-is-priced.md)
    is stated, naming `node .seed/checks/ledger-gate.ts` (a command `ci.yml` runs). `enforcement_ratio`
    stays 100% (6/6). A `CLAUDE.md` pointer lands the ledger on the map.
  - **E-007's figure self-updated from the graft itself.** The `CLAUDE.md` ledger pointer + the ledger's
    own outbound links raised *measured* `map_reachability` **6.1% → 11.3%** as a cascade (the item-3
    shape) — so E-007 is written at the post-graft ~11%, and its title carries no baked number (durable
    against the next organ that links out). Reachability stays measured, never gated
    ([ring 0037](0037-dither-map-gate-graft.md)).
  - **Not ring 0028's pure-additive beachhead (as items 1–3).** The graft modifies `ci.yml` (+ the
    Ledger gate step), `package.json` (+ `check:ledger`), `CLAUDE.md` (+ the pointer), and
    `docs/principles/README.md` (+ the sixth principle in the list), and adds the ledger, its README, the
    runner, and the principle. Reversibility is *revert the graft commit → byte-identical*
    ([ring 0037](0037-dither-map-gate-graft.md)).
- Alternatives considered:
  - **Mechanically transcribe every risk, every deferred item, and every spike open-question** (~15
    entries). Rejected — a ledger is *priced debt*, not a backlog; a managed risk and a deliberate
    product deferral are not debt. The honesty filter (pending-action risks; genuine claim-vs-reality
    gaps) yields eight real entries and no noise.
  - **Put the ledger at a dither-native path** (e.g. under `docs/`). Rejected — `ledger_trend` hard-codes
    `docs/plans/entropy-ledger.md`, so a native path reads a false null and the verification fails. The
    fix is to scope `docs/plans/` to the ledger (done) — not to fight the metric's current shape. (The
    hard-coded path is the Seed's own [E-012](../plans/entropy-ledger.md)/[E-016](../plans/entropy-ledger.md)
    shape; generalizing it is a Seed-side revisit if a second host maps its ledger elsewhere.)
  - **Make the gate require the ledger** (fail when absent). Rejected — the ledger is an organ a host
    *chooses*, not machinery it must carry; absence is `ledger_trend`'s honest null, and fire-when-present
    matches the Seed's own `validate-plans` and [ring 0035](0035-stage-agreement-invariant.md).
  - **Port `validate-plans` whole** (validate a plan format too). Rejected — dither has no plan/ring
    system; validating a format it does not use is dogma. Ledger-only is the faithful subset.
  - **Build the import-boundary test now** (pay E-001 at graft). Rejected — it is behavior-adjacent,
    outside the graft's "no behaviour changes yet" first pass; the plan defers it to Metabolize and
    prices it here, which is what this ledger does.
- Enforcement: CI gate (LAW-6). dither's [`ci.yml`](https://github.com/fliip92/dither/blob/main/.github/workflows/ci.yml)
  runs `node .seed/checks/ledger-gate.ts` as a fast, install-free step beside the map, ADR, and
  principles gates. Verified this session against the committed tree: **GREEN** — the ledger's 8 entries
  are all priced; `ledger_trend` **null → +8** (all eight open entries appeared this week) and
  `enforcement_ratio` stays 100% (Seed [repo-fitness](../../.seed/checks/repo-fitness.ts), read-only,
  dither byte-identical). **TEETH** — on a throwaway repo, the gate FIRES (exit 1) on a missing field, a
  bad interest-rate enum, a numbering gap, a duplicate number, a malformed heading, a missing `## Open`,
  and a missing `## Paid`; and HOLDS (exit 0) on a valid ledger and on an absent ledger (the skip path) —
  9/9. The landing range `da6bb24..8ce4e11` — what hosted CI judges on push — is **green on all four
  gates** (map, ADR, principles, ledger). `drift_count` held at **2** (E-006 names the two stale paths in
  prose, not backticked inline code, so it added no drift). `.seed/` sits outside dither's pnpm workspace
  (`apps/*`, `packages/*`), so `pnpm lint/typecheck/test` are unaffected.
- Revisit-when: a **second host** needs a ledger organ (the generalized-ledger-engine + the hard-coded-path
  generalization return together — [ring 0016](0016-repo-fitness-generalizes-the-metric-engine.md)'s
  second-host bar); an entry is **paid** (it moves to `## Paid` keeping its number, and `ledger_trend`
  goes negative that week — the digestion record works); the import-boundary test ([E-001]) or the
  committed `.seed/` self-test harness ([E-002]) is built at Metabolize (both priced in dither's ledger);
  or the reachability sweep (E-007) is undertaken. **Graft item 4 completes the dither Propose→Graft
  migration** — all four organs (map+reachability gate, commit→ADR gate, principles+`enforcement_ratio`,
  seeded ledger) have landed; the two Metabolize tracks (SEED.md §4 step 5 — refactor-toward-architecture
  + feature work, fitness arbitrating pace) open next.
