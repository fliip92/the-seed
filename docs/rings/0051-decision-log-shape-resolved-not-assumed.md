# Ring 0051 — the decision log is resolved, not assumed: `plan_traceability` learns ADRs, and SEED.md §6 is amended (E-020 paid)

- Date: 2026-07-27
- Stage: 4 — Pollination
- Raised-by: seed (the Gardener: *"fix E-020"* — the entry priced one pass earlier in
  [ring 0049](0049-dither-pollination-proof-exit-criterion-half-met.md) and **held**, because
  converting it edits the genome)
- Question: `plan_traceability` reported *"no plans or rings — no decision log to trace commits
  to"* about dither — a host that keeps **nine numbered ADRs** under `docs/adr/`, whose commit→ADR
  traceability the seed itself grafted ([ring 0038](0038-dither-adr-gate-graft.md), the second of
  the four graft organs). The reason was factually false, and the cost was concrete: one installed,
  green, enforcing organ showed **null → null** in its own pollination proof. Teaching the metric a
  second decision-log shape changes SEED.md §6's stated definition (*"% merged PRs tracing to a
  plan or ring"*), which both §6 ("when a metric stops correlating with real health, propose its
  replacement — via ring") and the amendment rule route to the Gardener. So: is "traces to a
  decision record" **one** metric over a resolved shape, or **two** metrics that must not be
  averaged across hosts — and what does §6 now say?
- Decision:
  - **One metric, over a resolved shape.** The question the metric answers — *can I get from a
    commit to the decision that governs it?* — is the same question in both vocabularies; only the
    filing convention differs. So `plan_traceability` now **resolves the target's decision-log
    shape** instead of assuming the seed's: numbered plans and rings, or numbered ADRs under
    `docs/adr/` ([`resolveDecisionLog`](../../.seed/lib/repo.ts)). This is
    [E-016](../plans/entropy-ledger.md)'s `resolveMapFilename` move one level up — from *which file
    is the map* to *which artifacts are the decision record* — and it is the third instrument
    correction of the same class (E-016, [E-019](../plans/entropy-ledger.md), this), all surfaced
    the same way: by pointing a Scout instrument at a real host.
  - **SEED.md §6 is amended** to *"% commits tracing to a decision record the repository carries —
    a plan or ring, or an ADR"*. Two changes ride in that line, and both are corrections rather
    than expansions of ambition: the **shape** (the substance of this ring), and **"commits"
    replacing "merged PRs"** — the metric has walked the target's entire non-merge commit history
    since [plan 0002](../plans/completed/0002-rooting.md) ("`plan_traceability` walks full history,
    independent of the gate"), so the row had described something the engine never did. The
    [ring 0049](0049-dither-pollination-proof-exit-criterion-half-met.md) precedent governs: when
    §6's prose and the engine disagree, the prose is what gets fixed, in a ring.
  - **The metric's name does not change.** `plan_traceability` is now a slight misnomer on an
    ADR-governed host, and that is the cheaper of two costs: the key is the schema of every dated
    snapshot in [docs/fitness/history/](../fitness/history/README.md), which is append-only data —
    renaming it would either break the trend series or force a migration of committed history, to
    buy a better word. The resolved shape rides in the metric **note** instead, so the reading is
    legible at the point of use (LAW-2).
  - **The seed's own gate stays plan/ring-strict.** [plan-traceability.ts](../../.seed/checks/plan-traceability.ts)
    enforces the seed's law (LAW-5: every commit names the plan or ring governing it) and is
    untouched — exactly the split E-016 drew between the metric's name set and the `AGENTS.md`-strict
    `validate-map` gate. A metric measures whatever a host is; a gate enforces what *this*
    repository must be. The seed's own reading is unchanged at **100%**, as it must be — the change
    is invisible to a repo that keeps no ADRs.
  - **The resolver lives in [lib/repo.ts](../../.seed/lib/repo.ts), not beside the gate**, unlike
    E-016's resolver which lives in `validate-map.ts`. The reason is mechanical, not aesthetic: the
    plan-traceability gate is an executable script with top-level side effects (importing it would
    *run* it), while `validate-map.ts` exports. `repo.ts` already owned `extractPlanRingRefs` as
    "the single definition of what counts as a traceable citation" — the new resolver joins it there
    (LAW-3).
  - **The citation forms are a deliberate superset of the host gate's.** dither's grafted gate
    recognizes `ADR-0009`, slash-lists `ADR-0003/0007`, and `docs/adr/0009-` path mentions; the
    metric recognizes all of those plus the prose form `ADR 0009`. A metric **stricter** than the
    gate enforcing the same norm would under-read the host it measures — which is E-020 itself,
    recurring one level down. `#47`-style issue refs never match: they are prose, not citations.
  - **A dangling citation still traces to nothing.** `ADR-0042` where no `docs/adr/0042-*.md` exists
    does not count, the same clause the gate applies to a plan/ring reference that resolves to
    nothing. Existence is checked against the target's tree today; ADRs, like rings, are kept.
  - **A number is comparable to a host's own past, not across hosts.** This is the one real hazard
    the fork acknowledged, and the honest answer is not a second metric but SEED.md §6's own opening
    line: fitness is *a trend, not a grade*. dither's gate does not require every commit to cite an
    ADR (ring 0038 deliberately scoped it to existence + new-decision naming, because dither's real
    practice modifies ADRs without citing); the seed's gate does require it of every commit. So
    dither's 39.5% and the seed's 100% measure the same question against **different enforced
    norms**, and averaging them would be meaningless. The note names the resolved shape precisely so
    that comparison is never made blind.
  - **The code propagates; the genome amendment does not.** `.seed/` is portable, so the resolver is
    declared a `minor` [pollen intent](../../pollen/pending.md) — `minor`, not `patch`, because a
    descendant gains a measurement it did not have and its own reading can move from null to a number,
    which is more than a defect repair (ring [0026](0026-pollen-boundary-versioning-lineage.md)'s
    taxonomy). SEED.md is **sovereign** — it is not shipped — so the §6 amendment is the mother's
    alone, and a descendant that keeps its own genome states its own definition. dither's copied
    engine now lags the mother by this fix as well as E-021's, and upgrades through a release, not a
    hand-copy.
  - **Measurement changed the story it was meant to confirm.** With the metric fixed, dither reads
    **45.2% pre-graft (28/62) → 39.5% post-graft (30/76)**: the one row of the pollination proof
    that now computes on both sides has moved **down**, and the cause is the seed. Twelve of the
    fourteen commits the seed has landed on dither cite *"Seed plan 0009 / E-NNN"* — the **seed's**
    decision log, which does not exist in dither and cannot be verified from inside it — while
    dither's own commits cite dither's ADRs. The graft installed a traceability organ and then
    diluted the metric that organ serves. That is a real finding, not a rounding artifact, and it is
    priced as **[E-022](../plans/entropy-ledger.md)** rather than smoothed away; the proof
    ([pollination-dither.md](../fitness/pollination-dither.md)) now reports five of six metrics
    moved, four improved and one regressed, with the regression attributed to its true author.
- Alternatives considered:
  - **Two metrics (`plan_traceability` + `adr_traceability`).** Rejected — it multiplies §6 by the
    number of decision-log conventions in the world, makes every host's fitness table a different
    shape, and answers the same question twice. The cross-host comparability worry it was meant to
    solve is not solved by two metrics either (a host with both would still need one reading), and
    is properly handled by §6's "trend, not a grade" plus the naming note.
  - **Leave §6 alone and just widen the code.** Rejected outright — the genome is the constitution;
    code that measures something the genome does not say is exactly the drift LAW-2 exists to
    prevent. This is also why the entry was held for the Gardener instead of converted in-pass.
  - **Rename the metric to `decision_traceability`.** Rejected for now — better English, paid for
    with a break in the append-only snapshot series (see Decision). Recorded as the Revisit trigger:
    if a schema migration of `docs/fitness/history/` ever happens for another reason, rename then.
  - **Resolve ADRs from a wider directory set** (`docs/decisions/`, `doc/adr/`, `adr/`). Rejected —
    LAW-7: own the small subset, once evidenced. `docs/adr/` is the one shape a real host has been
    found keeping (dither); the set grows when the next host presents one, exactly as `MAP_FILENAMES`
    grew from the seed's own name plus dither's.
  - **Count the seed's `Seed plan 0009` citations as tracing on dither.** Rejected — the metric can
    only credit a decision record it can verify exists in the repository it is measuring. A citation
    of another repository's plan is unverifiable from inside the host, and crediting it would let any
    commit claim traceability by naming a plan nobody can check. The right fix is the commit
    convention, which is why E-022 is priced against the seed's practice rather than the metric.
  - **Fix dither's history** (reword the twelve commits). Rejected — rewriting a host's `main` to
    improve a number the seed is measuring is exactly backwards, and would destroy the evidence that
    produced the finding.
  - **Bump the genome version.** Not done — v0.1 has carried previous §6 corrections (the
    `map_reachability` definition, ring 0049); the genome line tracks the constitution's shape, and
    the amendment rule (approved change + ring) is what governs, which this satisfies.
- Enforcement: **structural test** — two new cases in [self-test.ts](../../.seed/tests/self-test.ts)
  (**246** total, was 244). One drives an ADR-governed foreign host through all three citation forms
  (`ADR-0001`, prose `ADR 0002`, a `docs/adr/0001-` path) and a dangling `ADR-0042`, pinning the
  fraction at exactly 3/6 and requiring the note to name the resolved shape; the other pins a repo
  keeping **both** rings and ADRs, where a citation of either traces — the case that would catch
  ADR support shadowing the seed's own shape. The updated foreign-repo case pins the corrected null
  reason (*"no plans, rings, or ADRs"*), so a repo with no decision log still reads null.
  **Test-of-the-test:** removing the `adr` entry from `DECISION_LOG_SHAPES` turns exactly those two
  red and leaves the other 244 green. Live verification on the host: `repo-fitness ~/Repos/dither`
  reads **39.5%**, note *"traced against 9 ADRs (docs/adr/)"*, where it read null this morning; the
  seed's own reading is **100%**, unchanged. `npm run check` (18) + `npm test` (246) + `npm run
  garden` (`drift_count` 0) green. dither needs no mutation — the defect was the mother's
  instrument, not the host.
- Revisit-when: a host records decisions under a convention this resolver does not know
  (`docs/decisions/`, `adr/`, an issue tracker) — extend the shape list then, with that host as the
  evidence; or [E-022](../plans/entropy-ledger.md) is converted, at which point dither's reading
  should start climbing again and the proof's table gets its next row; or `docs/fitness/history/`
  needs a schema migration for any reason, which is when `plan_traceability` should be renamed to
  what it now measures; or a second host makes the cross-host comparability hazard concrete rather
  than theoretical (two hosts, two enforced norms, one column) — the point at which "trend, not a
  grade" needs to be enforced by the artifact's shape and not only stated.
