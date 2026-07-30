# Ring 0056 — the front door's numbers are generated, not typed: a state block joins the manifest and README links it (E-026 paid)

- Date: 2026-07-29
- Stage: 4 — Pollination
- Raised-by: gardener (*"fix E-026"* — the ruling the entry's conversion path waited on)
- Question: [E-026](../plans/entropy-ledger.md) found **six false claims** on the public
  [README](../../README.md), some weeks old, with every check green: *21 rings* against 53, *seven
  planted skills* against 9 (`intake` and `judge` missing from the list entirely), *two completed
  plans plus one active* against 7 + 2, *principles … none stated yet* a week after
  [grounded-or-ask](../principles/grounded-or-ask.md) was stated, *a solo experiment* after ring
  [0032](0032-stage-4-transition-first-host-dither.md) retired that, and *pollen … deliberately
  empty* after v0.1.0 was cut. Nothing read them: [doc-drift](../../.seed/checks/doc-drift.ts) reads
  backticked *paths* and [validate-map](../../.seed/checks/validate-map.ts) reads links, so
  `drift_count 0` was correct and blind at once. The content was hand-fixed in the sensing pass, so
  the debt was the **enforcement**. What shape does it take, and how does a hand-written, *voiced*
  front door consume it?
- Decision:
  - **Generate, don't detect** — the entry's first-choice path, and the ring
    [0020](0020-onboard-human-generated-briefing.md) shape the seed already owns.
    [docs/generated/state.md](../generated/state.md) is a third entry in the generation manifest
    ([.seed/lib/generated.ts](../../.seed/lib/generated.ts)): rings, plans, skills, principles and
    the ledger's open/paid split, each counted from the organ itself, plus the latest committed
    fitness snapshot. `npm run generate` writes it and
    [validate-generated](../../.seed/checks/validate-generated.ts) proves the committed bytes equal a
    fresh generation, so a stale count moves from *detectable* to **impossible**.
  - **The README links it rather than restating it, and keeps its voice.** The claims became
    *"what it has grown … is **[counted from the tree, not typed here](../generated/state.md)**"*.
    Prose the front door is *for* — the argument, the nine skills each with its one-line pitch, the
    stage sentence — stays hand-written. Only the numbers moved, because only the numbers rot.
  - **The evidence that this was not premature: two days after the hand-fix, three counts were
    wrong again.** 53 rings had become 55, *twelve declared intents* fourteen, and the ledger had
    moved — the sensing pass's fix decayed in 48 hours, exactly as the entry predicted
    ("every count drifts monotonically the moment it is written"). The generated page read 55 on its
    first run.
  - **The fitness readings are READ from the newest committed snapshot, never recomputed.** A
    generator must be a pure function of repo files (ring 0020), and `plan_traceability` /
    `ledger_trend` are functions of git history and a trailing 7-day window — computing them would
    make the artifact differ from itself when nothing in the tree changed. The three file-pure
    metrics are read from the same snapshot for a second reason: `map_reachability` counts the link
    graph *this page is a node in*, so computing it here would make the artifact a function of its
    own output. Presentation over a landed number; what a metric MEANS still has one definition
    ([fitness-metrics.ts](../../.seed/lib/fitness-metrics.ts)).
  - **`ledgerCounts` moved to [repo.ts](../../.seed/lib/repo.ts).** Two organs now ask what an open
    entry is — `ledger_trend` and this page — so the public number and the metric cannot disagree
    (LAW-3).
  - **The cost is deliberate and named: landing a ring now means running `npm run generate`.** That
    is the mechanism, not a side effect — the gate fires locally before the commit, with a fix line
    naming the command. Five exit-0 self-test fixtures that add a ring, a plan or a principle
    regenerate too, which is the same discipline stated in the harness.
  - **The map was examined and needs nothing** (ring [0055](0055-the-map-states-state-not-history.md)'s
    Revisit, fired by this conversion): after that rewrite § Current state states stage, the first
    action, where the host stands and what is owed — and **no counts at all**. There is nothing to
    convert; the budget already forbids the narrative that would grow them back.
- Alternatives considered:
  - **A `stale-count` drift class** (the entry's stated second choice, and
    [E-009](../plans/entropy-ledger.md)'s deferred prose class). Rejected on the same measured
    grounds E-025 rejected a prose scan for the stage: a regex cannot separate *"53 rings"* (a live
    claim) from *"the four graft organs"* (permanent history), so it buys false positives to catch
    what generation makes impossible. Detection is the second-best answer to a question generation
    answers exactly.
  - **A generated REGION inside README.md**, marked and byte-exact-gated in place, keeping the
    numbers on the front page. Rejected for now: it widens the manifest contract from "a whole file
    under `docs/generated/`" to "a region inside a hand-authored file" — a real change to a settled
    organ (ring 0020) for one consumer, against LAW-7. Recorded as the Revisit if linking proves to
    cost the front door too much.
  - **Recompute fitness live in the generator.** Rejected: it breaks the purity the byte-exact gate
    stands on (see the Decision), and would make `npm run check` fail on a clean tree the moment a
    commit landed.
  - **Also count references, assessments, postmortems, judgments and architecture docs.** Rejected
    as scope: E-026 is about *the front door's* claims, and each extra count couples another exit-0
    fixture to regeneration for a number nobody states publicly. They are one line each when a
    reader-facing claim first needs them.
  - **Leave the counts out entirely** (say "dozens of rings"). Rejected: the README's own pitch is
    *"don't take it on faith — clone it and watch it verify itself"*. Vague-so-it-cannot-be-wrong is
    the opposite of that; the answer is a number that cannot be wrong.
- Enforcement: **structural test — the existing byte-exact regeneration gate, extended by a third
  manifest entry.** [validate-generated](../../.seed/checks/validate-generated.ts) (in
  [run-all](../../.seed/checks/run-all.ts)) re-runs `generateState` and fails when the committed
  page differs, which is the whole invariant: a count that stops being true cannot merge. Two new
  self-tests (**267** total, was 265) pin both sources — a **landed ring** (indexed, so
  `validate-rings` stays out of it) leaves the page stale, and a **newer fitness snapshot** does
  too — each asserting on `docs/generated/state.md` by name so neither can pass on the onboarding
  briefing's evidence. **Test-of-the-test:** freezing the counts to literals turns exactly those two
  cases green while the rest stay green, and reverting the five fixture regenerations turns exactly
  those five red. The generator degrades rather than throws on an absent organ (0, or "no snapshot
  yet"), so a descendant carrying this portable manifest is not bound to the mother's anatomy — the
  ring [0035](0035-stage-agreement-invariant.md) contract. `npm run check` (15) + `npm test` (267) +
  `npm run garden` (`drift_count` 0) green. Declared a `minor`
  [pollen intent](../../pollen/pending.md): a descendant gains a front door whose numbers cannot rot.
- Revisit-when: the README's *prose* goes stale in a way counts cannot catch — a skill listed with a
  description that no longer matches, or a new skill never added to the list (the count is generated,
  the enumeration is not; the slugged organs' index completeness is ring
  [0053](0053-numbered-organs-index-every-entry.md)'s own Revisit); or linking proves to cost the
  front door too much and the generated-region alternative becomes worth its widening of the
  manifest; or a reader-facing claim needs an organ this page does not count; or
  [E-009](../plans/entropy-ledger.md)'s prose-state class lands and subsumes what is left — the
  genome-fixed counts (*eleven laws*, *six metrics*) that move only by Gardener-approved amendment
  and are deliberately still typed.
