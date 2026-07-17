# Ring 0029 — the recursive self-upgrade test: self-hosting is self-versioning + a fitness-measured sacrificial graft; the exit proof is split reproducible/recorded; the internal cut runs now, the Stage 3 → 4 transition stays Gardener-gated

- Date: 2026-07-16
- Stage: 3 — Flowering
- Raised-by: seed
- Question: [Plan 0005](../plans/active/0005-flowering.md) scope item 4 — the recursive self-upgrade
  test, *the seed is its own first host* — **is the Stage 3 exit criterion** (SEED.md §4: "Upgrade
  yourself using your own pollen … pollen installs cleanly into a sacrificial test repo; fitness is
  measured before and after; the delta is the proof"). Rings [0026](0026-pollen-boundary-versioning-lineage.md)–[0028](0028-installer-uninstall.md)
  built the boundary, the release CLI, and the refuse-to-clobber graft/uninstall; the plan reserved
  the **first real pollen cut** (v0.1.0, composed of exactly those three declared intents) for this
  item. The build questions the prior items left open:
  - **(a) What does "the seed is its own first host / upgrade the seed using its own pollen"
    concretely mean**, when graft *refuses to clobber* ([ring 0028](0028-installer-uninstall.md)) and
    so the mother cannot graft onto her own populated tree?
  - **(b) What is "the delta is the proof" concretely**, and how is it *both* a reproducible,
    always-green verification (LAW-6) *and* a judgeable recorded fact (the
    [assessment 0001](../assessments/0001-mottainapp.md) Stage-2 precedent)?
  - **(c) What does the seed do *now* versus what is gated** on the Gardener and the two named
    prerequisites [E-004](../plans/entropy-ledger.md) (name/trademark) and
    [E-013](../plans/entropy-ledger.md) (inferential control), which plan 0005 sequences "within the
    stage before pollen ships"?
- Decision: Cut. Design the whole recursive test and **run it now in full** — the internal cut is the
  seed's own Stage-3 computational work (Gardener ruling, 2026-07-16); only the Stage 3 → 4 transition
  stays gated.
  - **"The seed is its own first host" is two real self-hosting acts, not a self-graft.** A self-graft
    is impossible — graft refuses to clobber ([ring 0028](0028-installer-uninstall.md)), so it cannot
    install over the mother's populated tree — and grafting into a *copy* to fake one would be a
    costume (LAW-2). The genuine self-hosting is the seed's own machinery turned on itself:
    - **Self-versioning (the "upgrade yourself").** The mother cuts her first real pollen release
      **v0.1.0** with her *own* release CLI ([`release.ts cut-release`](../../.seed/checks/release.ts),
      the same machinery a descendant carries — self-carrying, [E-015](../plans/entropy-ledger.md)),
      folding the three declared intents (rings 0026/0027/0028) into a dated release and bumping her
      own `POLLEN_VERSION` + `lineage.seedVersion` v0.0.0 → v0.1.0. The release tool's first real
      customer is the seed itself — that *is* "upgrade the seed using its own pollen."
    - **Self-diagnosis (the "sacrificial test repo").** The mother grafts her pollen into a sacrificial
      repo and measures the fitness her *own* installer adds with her *own* read-only instrument
      ([`repo-fitness.ts`](../../.seed/checks/repo-fitness.ts),
      [ring 0016](0016-repo-fitness-generalizes-the-metric-engine.md)) — the diagnostic organ pointed
      at the beachhead the installer organ laid down, then reversed by the uninstall path (SEED.md §4:
      "an uninstall path must exist").
  - **"The delta is the proof" is split into a reproducible mechanism + a recorded-once artifact** (the
    [ring 0020](0020-onboard-human-generated-briefing.md) determinism split /
    [ring 0022](0022-assessment-organ-exit-criterion.md) assessment-organ precedent — a green-forever
    gate is not a judgeable fact, and a judgeable fact is not a gate):
    - **Reproducible (LAW-6, in `npm test`).** Extend the ring-0028 hermetic graft/uninstall round-trip
      ([self-test](../../.seed/tests/self-test.ts)) so it also computes `repo-fitness` on the target
      **before** and **after** the graft, asserting the beachhead turns a previously-**unmeasurable**
      repo **measurable** — *and* that uninstall returns it to the pre-graft baseline byte-identical.
      Hermetic (a scratch repo removed in a `finally`), deterministic, green forever; side-effecting on
      a target tree, so it stays OUT of `run-all` (the cut-release / worktrees precedent).
    - **Recorded-once (the judgeable exit proof).** The actual recursive run — the real v0.1.0 cut plus
      the measured sacrificial before/after — recorded as a dated **before/after fitness-delta
      artifact** owned by the [fitness organ](../fitness/FITNESS.md) (SEED.md §6: "prove pollination
      value with before/after measurement on hosts"), the Stage-3 counterpart to the read-only
      [assessment 0001](../assessments/0001-mottainapp.md) Stage-2 evidence. It is **not** an
      *assessment*: assessments are read-only foreign Scouts, but the sacrificial graft *mutates* its
      target — so the fitness organ, not the [assessments](../assessments/README.md) organ, is its
      home. The assessment symmetry is honored in *shape* (a dated, evidence-judgeable stage-exit
      artifact), not in *location*.
  - **The "delta" is honestly a null→measurable transition, not a rising number on a pre-existing
    score.** An empty sacrificial repo has no map, no anatomy, no history, so the SEED.md §6 metrics
    that need them read `null` — repo-fitness's "that null IS the finding." A hermetic dry run of this
    design already bears it out: **`map_reachability` goes `null` ("no AGENTS.md — LAW-4's map entry
    point is absent") → 100%** as the graft lays down the map, the plan structure, the decision log,
    and the first lints (ring 0028's beachhead) and the repo turns structurally legible; uninstall
    reverts it to the `null` baseline byte-identical. The metabolization-grown organs stay absent by
    design — "no behavior changes yet" (SEED.md §4) — so `enforcement_ratio` / `plan_traceability` /
    `ledger_trend` remain `null` after the graft too, and `drift_count` reads `1`, the single dangling
    mother-reference [ring 0028](0028-installer-uninstall.md) foresaw ("the mother's copied docs dangle
    until the host metabolizes them") — an honest property of a beachhead, not a regression to hide.
    The proof is that the beachhead converts an *unmeasurable* repo into a *mapped, legible* one and
    uninstall reverses it — the shape the reproducible half asserts (`map_reachability` null → computable
    → null-and-byte-identical), not a fabricated arithmetic gain.
  - **The boundary — the internal recursive test runs now; E-004 / E-013 gate Stage-4 *external*
    distribution (Gardener ruling, 2026-07-16).** The escalated fork in (c) — does the *internal* v0.1.0
    cut count as "pollen ships"? — was put to the Gardener and **ruled: it does not.** The recursive
    self-upgrade test is the seed's own Stage-3 computational work and runs now in full: the mother
    **cuts the real v0.1.0** on herself (self-versioning, append-only release history —
    [release-append-only](../../.seed/checks/release-append-only.ts)), the **fitness-measured
    sacrificial graft** runs and its before/after is **recorded** as the dated exit-proof artifact
    (self-diagnosis), and the reproducible harness lands in the self-tests. What
    [E-004](../plans/entropy-ledger.md) (trademark) and [E-013](../plans/entropy-ledger.md) (inferential
    control) gate is **external distribution** — pollinating a *foreign* host at **Stage 4** (SEED.md §4,
    "Pollination — foreign repositories"), where pollen ships under a name to a party outside the lineage
    and where quality becomes behavioral. Those two are the **gating prerequisites of the Stage 3 → 4
    transition** — a Gardener-approved stage transition (the [plan 0005](../plans/active/0005-flowering.md)
    / [ring 0025](0025-stage-3-transition-approved.md) shape), a *future plan*, not this item. Meeting the
    Stage-3 exit criterion (this item) is the seed's to do; proposing the transition is the Gardener's,
    and only once E-004 + E-013 clear. LAW-10: the escalated judgment is recorded here as the ring that
    retires it.
- Alternatives considered:
  - **Self-graft the mother onto herself (a literal reading of "own first host").** Rejected —
    refuse-to-clobber ([ring 0028](0028-installer-uninstall.md)) makes it impossible on a populated
    tree, and grafting into a copy to fake it is a costume (LAW-2). Self-hosting is the seed's own
    machinery on itself: self-*versioning* (its release CLI cuts its own release) + self-*diagnosis*
    (its repo-fitness measures its own installer's beachhead) — both real.
  - **Only the recorded snapshots, no reproducible harness.** Rejected — LAW-6: a one-time before/after
    snapshot is a claim, not a repeatable proof; the hermetic harness keeps the exit proof green forever
    and lets any later change to the graft set or the metrics re-run it.
  - **Only the reproducible harness, no recorded artifact.** Rejected — SEED.md §4's exit is a
    *judgeable* "the delta is the proof" (the assessment-0001 precedent: a dated fact the Gardener
    evaluates); an always-green test alone produces no such record.
  - **Gate the internal cut too (the conservative reading: wait on E-004 + E-013 before cutting
    v0.1.0).** Raised by the seed as the honest fork and escalated (LAW-10); **ruled against by the
    Gardener** (2026-07-16). The recursive *self*-host test is the Stage-3 exit criterion the seed must
    *meet* — gating it on Stage-4's external-distribution prerequisites would conflate Stage 3 (the seed
    is its own host) with Stage 4 (foreign hosts) and make the exit unmeetable from within the stage.
    "Pollen ships" is the *external* act (Stage 4); the internal cut is self-versioning.
  - **Score the delta as a single rising fitness number.** Rejected — an empty repo scores mostly
    `null` (verified: five of six metrics null before the graft), so a subtraction would be fiction; the
    honest, measured proof is null→measurable→null, which is what the instrument reports and what the
    harness asserts.
  - **Land the recorded proof in `docs/assessments/`.** Rejected — the
    [assessments](../assessments/README.md) organ is defined read-only (foreign Scouts); a sacrificial
    graft mutates its target. The [fitness organ](../fitness/FITNESS.md) owns before/after value
    measurement (SEED.md §6), so it is the right home.
- Enforcement: structural + self-test, LAW-6 — the whole recursive test lands now. The reproducible
  fitness-instrumented round-trip extends the [ring 0028](0028-installer-uninstall.md) graft/uninstall
  harness in the [self-tests](../../.seed/tests/self-test.ts), adding the before/after `repo-fitness`
  reading and asserting the `map_reachability` null → computable → null-and-byte-identical shape; being
  side-effecting on a target tree it stays OUT of `run-all` (the
  [cut-release](0027-release-graft-cli.md) / [worktrees](0019-parallel-worktrees-host-agnostic-lifecycle.md)
  precedent), hermetic in a scratch repo removed in a `finally`. The real v0.1.0 cut is recorded in the
  append-only [release history](../../pollen/releases/README.md)
  ([release-append-only](../../.seed/checks/release-append-only.ts)), and the measured before/after lands
  as the dated exit-proof artifact in the [fitness organ](../fitness/FITNESS.md). The only part left
  **doc-only / gated** is the **Stage 3 → 4 transition proposal** — a Gardener-approved stage transition
  blocked on [E-004](../plans/entropy-ledger.md) + [E-013](../plans/entropy-ledger.md), not a
  mechanizable decision (LAW-2 is satisfied by naming the gate, not faking a control over it).
- Revisit-when: [E-004](../plans/entropy-ledger.md) and [E-013](../plans/entropy-ledger.md) clear and
  the Gardener approves the **Stage 3 → 4 transition** — a new plan opens (the
  [plan 0005](../plans/active/0005-flowering.md) / [ring 0025](0025-stage-3-transition-approved.md)
  shape) and pollen distributes to a *foreign* host; or the recursive test finds the beachhead too thin
  to raise measurable fitness beyond `map_reachability` (grow the graft set — a ring superseding
  [ring 0028](0028-installer-uninstall.md)'s scaffold); or a real foreign host at Stage 4 needs a richer
  before/after than the hermetic sacrificial case (the sacrificial-repo shape generalizes to the host) —
  each a new ring superseding the relevant part.
