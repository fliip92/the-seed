# Ring 0053 — a numbered organ lists every entry, or CI fails: index completeness over one shared resolver (E-024 paid)

- Date: 2026-07-27
- Stage: 4 — Pollination
- Raised-by: seed (the Gardener: *"fix E-024"* — the entry was sensed in-pass one unit earlier,
  [ring 0052](0052-portable-changes-declare-their-intent.md), while hand-adding that ring's own index
  line)
- Question: [docs/rings/README.md](README.md) § Procedure step 1 tells the next agent to *"take the next
  free number (check the list above — and add your ring to it)"*, and
  [AGENTS.md § Territory](../../AGENTS.md) names one README per organ as **the** index for it. Nothing
  enforced either claim. [validate-rings](../../.seed/checks/validate-rings.ts) bound filenames, sequence
  and fields; [validate-map](../../.seed/checks/validate-map.ts) bound reachability — and an unindexed
  ring stays *reachable* through whatever plan cites it, so the map read **100%** while the index listed
  48 of 51 rings: **0049, 0050 and 0051 were missing**, three consecutive rings, all landed inside two
  days. So: what invariant closes it, on which organs, and where does it live?
- Decision:
  - **The invariant: every `NNNN-slug.md` in a numbered organ's directory must be linked from that
    organ's `README.md`.** One shared helper —
    [`indexCompletenessViolations`](../../.seed/lib/repo.ts) — called by the validators of all five
    numbered organs: rings, plans (per directory, `active/` and `completed/`), postmortems, assessments,
    judgments. [E-024](../plans/entropy-ledger.md) Open→**Paid**.
  - **Generalized on day one, not just rings.** The entry priced rings and noted the same hole in the
    other four; building it confirmed the price — one helper, five call sites, one line each, four extra
    self-tests. Two of those validators' own headers already asserted *"indexed by the README"* as if it
    were enforced ([validate-postmortems](../../.seed/checks/validate-postmortems.ts),
    [validate-assessments](../../.seed/checks/validate-assessments.ts)); they now say something true.
  - **The clause is LAW-4 in all five organs, with one message.** The organ README is the second hop of
    the map — the index AGENTS.md itself points at — so an entry missing from it is knowledge the map
    cannot reach *by the route the map advertises*. Stating it once (one helper, one problem string, one
    fix string) rather than as five paraphrases is LAW-3; the violation still carries the calling
    check's id, so a failure sends the agent to the organ whose format it broke, which is where an agent
    already looks.
  - **The link resolver moves to [lib/repo.ts](../../.seed/lib/repo.ts).** *"Does this link point at
    that file"* now has two askers — the map's reachability walk and this clause — and plans are the one
    artifact whose path is mutable state: a plan closes by `git mv` into `completed/`, and a link written
    for either directory resolves to it wherever it lives (ring [0013](0013-plan-links-resolve-across-active-completed.md)).
    Two implementations of that rule would eventually disagree about whether a plan is indexed, so
    `resolveLinkTarget` is now defined once and imported by both. A closing plan may therefore keep its
    index line verbatim as it moves; being listed in **neither** directory's index is what fails.
  - **A clause in `run-all`, not a new check and not a CI gate.** It is a pure function of the working
    tree (the file list plus the README's links), so it belongs where the other content invariants live —
    unlike its sibling one unit back, [pollen-intent](../../.seed/checks/pollen-intent.ts), which needed
    git history and had to be a gate (ring [0052](0052-portable-changes-declare-their-intent.md)). It
    also fires **before** the commit, which is the only moment the fix is one line.
  - **It degrades, it does not guess.** No README under the organ directory → silent (a foreign repo
    measured by [repo-fitness](../../skills/repo-fitness/SKILL.md) need not carry the seed's anatomy);
    no numbered entries → vacuous. The same fire-only-when-present shape as
    ring [0035](0035-stage-agreement-invariant.md).
  - **The mother is converging on her host, again.** This is the invariant the seed grafted into dither
    as `maps-are-complete` (ring [0046](0046-dither-map-completeness-gate.md)) — every workspace appears
    in each of three layout maps — turned on her own organs, where it was absent. That is the second
    time in three units that the host held the practice first
    ([E-021](../plans/entropy-ledger.md): dither's runners already listed via `git ls-files -z`).
    Pollination teaches in both directions.
  - **No new principle.** dither states `maps-are-complete` as a principle because it constrains
    dither's *product* layout; here the rule is about this repository's own anatomy and is already
    law-bound (LAW-4). A principle restating a law would inflate `enforcement_ratio` without adding a
    norm. The organ stays at one stated principle
    ([grounded-or-ask](../principles/grounded-or-ask.md)), as it did for the gates' self-test
    (dither ring 0042's reasoning, applied at home).
- Alternatives considered:
  - **A single new check, `validate-indexes`.** Rejected — the failure would name a check that owns no
    organ, while the index *is* part of each organ's format (the rings README's own Procedure step 1 says
    so). The shared helper already gets the single definition; routing the violation through the organ's
    validator gets the legible failure. Both, not one.
  - **Rings only** (the entry's literal minimum). Rejected — the hole is structural, not ring-specific,
    and the four other organs are numbered, README-indexed, and equally unenforced. Paying only the
    instance that happened to bite is how a class recurs; that lesson is dither's E-009 → ring 0046,
    one organ later.
  - **Fold it into validate-map** — require an entry to be reachable *through its organ README*
    specifically, rather than by any path. Rejected — it conflates two questions and it would change what
    `map_reachability` measures, an append-only snapshot series that E-016 and E-019 have already moved
    twice. Rescoping the metric to pay a ledger entry is the tail wagging the dog.
  - **Generate the index** (a `docs/generated/` artifact, regeneration-gated like the onboarding
    briefing, ring [0020](0020-onboard-human-generated-briefing.md)). Rejected for now — an index line
    carries a hand-written one-line summary of what the ring decided, which is the entire value the index
    has over `ls docs/rings/`; generating it would yield a list of slugs. Enforcing presence keeps the
    prose and removes the failure mode.
  - **Also police the index line's shape** (number, em dash, title matching the ring's). Rejected as
    scope — the invariant that bit is *presence*. A format rule over 52 hand-written summary lines has a
    real false-positive surface and no evidence behind it.
  - **Extend it to the slugged organs too** (`skills/`, `docs/references/`, `docs/principles/`,
    `docs/architecture/`). Rejected today on evidence, not principle: all four were checked in this pass
    and every entry is indexed, and each would need its own definition of what counts as an entry (a
    skill is a *directory* with a `SKILL.md`). LAW-7 — own the small subset the evidence justifies. The
    Revisit trigger below is exactly this.
- Enforcement: **structural test + a `run-all` clause.** The clause is
  [`indexCompletenessViolations`](../../.seed/lib/repo.ts), wired into
  [validate-rings](../../.seed/checks/validate-rings.ts),
  [validate-plans](../../.seed/checks/validate-plans.ts),
  [validate-postmortems](../../.seed/checks/validate-postmortems.ts),
  [validate-assessments](../../.seed/checks/validate-assessments.ts) and
  [validate-judgments](../../.seed/checks/validate-judgments.ts). Seven new cases in
  [self-test.ts](../../.seed/tests/self-test.ts) (**259** total, was 252): a reachable-but-unindexed
  entry **fails** in each of the five organs (each fixture is linked from the map on purpose, so the
  case cannot pass for the reachability reason); the E-024 hole is pinned explicitly — an unindexed ring
  turns `validate-rings` red **while `validate-map` stays green**, which is why three rings went missing
  unnoticed; and the same ring, listed in the index, **passes all checks** (the pair the entry named).
  **Test-of-the-test:** neutering the helper (return no violations) turns exactly the six failing cases
  red and leaves the pass case and the other 252 green; narrowing its link resolution to literal paths
  turns the two ring-0013 plan-link cases red, which is the shared resolver being load-bearing rather
  than decorative. `npm run check` (14 checks) + `npm test` (259) + `npm run garden` (`drift_count` 0)
  green. Declared a `minor` [pollen intent](../../pollen/pending.md): a descendant gains an enforcement
  it did not have. **No dither mutation** — its graft carries a scoped engine and none of these organs.
- Revisit-when: the same completeness miss appears on a **slugged** organ (`skills/`,
  `docs/references/`, `docs/principles/`, `docs/architecture/`) — the evidence that the invariant should
  key on *"has a README index"* rather than *"is numbered"*, and the membership rule generalizes with it;
  or an organ legitimately wants an entry left out of its index (the pressure for an opt-out, which today
  does not exist); or a ring index grows past the point where a human reads it, which is when the
  generate-it alternative becomes the cheaper one and this clause becomes its regeneration check; or a
  **descendant** reports the clause firing on an anatomy it does not carry, which would mean the degrade
  path is wrong.
