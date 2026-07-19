# Ring 0038 — dither's commit→ADR gate (graft item 2): the Seed's plan-traceability shape adapted to dither's decision surface — two clauses (cited-ADR-must-exist + a new-ADR commit names it), the ADD-not-modify trigger grounded in dither's own history, no universal-citation clause, the verbatim-engine + host-runner pattern extended

- Date: 2026-07-19
- Stage: 4 — Pollination
- Raised-by: seed
- Question: [Plan 0007](../plans/active/0007-dither-graft.md) graft item 2 — the **commit→ADR
  traceability gate** — is the second organ grafted into dither, authorized under
  [ring 0034](0034-dither-graft-approved.md) and started by the Gardener. The plan sets the shape
  ("a commit enacting a decision cites an existing in-repo ADR, `docs/adr/NNNN-*`") and its
  verification ("fires on a decision-commit with no ADR citation, holds on one citing a valid ADR;
  GitHub-Issue refs stay allowed prose but are not the gate"); the build questions left to design
  time: **what identifies a "decision-commit"** that must cite (dither is a *product* repo — most
  commits do not enact an architectural decision, so the Seed's own "every commit names a plan/ring"
  universal rule cannot transfer)? **What counts as a valid ADR citation** versus a GitHub-Issue
  reference? And **how does a history-aware gate wire into dither's CI**, which checks out shallow?
- Decision: Built and committed to dither (`95dd09a`, local; the push stays Gardener-gated). The
  design:
  - **The verbatim-engine + host-owned-runner pattern extends (ring 0037).**
    [`.seed/checks/adr-gate.ts`](https://github.com/fliip92/dither/blob/main/.seed/checks/adr-gate.ts)
    is dither's runner — the one file of host judgment; `.seed/lib/repo.ts` beside it is the Seed's
    engine, confirmed **byte-identical** to the Seed's this session (no re-copy needed). The runner
    composes the engine's reusable primitives (`numberedFilenames`, `formatViolation`, the
    `Violation` shape) with dither's ADR vocabulary and the Seed's proven base-ref/merge-base/range
    plumbing (lifted in shape from [plan-traceability](../../.seed/checks/plan-traceability.ts)). The
    ADR-citation regex and the decision-commit definition are **dither judgment**, so they live in
    the host runner, not the shared engine — the Seed has no ADRs (it has rings); its surface is not
    dither's.
  - **Two clauses, over the non-merge commits in the event's range (`mergeBase..HEAD`) — history is
    never re-judged** (the Seed's plan-traceability discipline):
    - **Clause 1 — citation must resolve.** Any ADR a commit *cites* — prose `ADR-0009`, a slash-list
      `ADR-0003/0007` (split), or a `docs/adr/0009-` path mention — must resolve to an existing
      `docs/adr/NNNN-*.md`. A citation to nothing traces to nothing. This is the Seed's
      "references only ring 0099 — none exist" clause on dither's vocabulary. GitHub-Issue refs
      (`#47`) never match the ADR forms, so they stay allowed prose — exactly as the plan required.
    - **Clause 2 — a new-decision commit names its ADR.** A commit that **ADDS** a new
      `docs/adr/NNNN-*.md` is recording a decision; its message must name that ADR, so
      `git log --grep ADR-NNNN` finds where each decision entered. This is the "fires on a
      decision-commit with no ADR citation" tooth.
  - **The clause-2 trigger is ADD, not add-or-modify — grounded in dither's own history, not
    imposed.** The plan says "a commit *enacting* a decision cites its ADR." *Enacting* (implementing
    a decision in code) is not mechanically detectable from paths; *recording* it (a new ADR file)
    is. Requiring every commit that merely **touches** an ADR file to cite would over-fire on dither's
    legitimate practice: two commits in its history modify an ADR without citing — `919a3b6`, a
    `test(phone)` commit tweaking ADR-0009's CI-check note, and the genesis import `996d28f`, adding
    ADRs 0001–0007 in one commit. Gating those is foreign structure (SEED.md §4 *method, not dogma*).
    Every *decision-recording* commit dither has (`b2d81e5` adds 0009, `0a9fd07` adds 0008) already
    names its ADR — so the ADD-only rule **formalizes what dither does**, and a modification stays
    bound by clause 1.
  - **No universal-citation clause — the key adaptation from the Seed's shape.** The Seed's
    plan-traceability requires *every* non-merge commit to name a plan/ring, because the Seed is a
    governance repo where every commit is deliberate. dither is a product repo; forcing every
    `feat`/`fix` to cite an ADR would red-fail continuously and impose structure dither does not use.
    So the enforceable decision surface is the ADR files themselves (clause 2) plus citation validity
    everywhere (clause 1); the convention that a feature commit enacting ADR-0009 cites it stays a
    *convention* that clause 1 keeps honest, not a mandate the gate can (or should) manufacture.
  - **CI wiring — history-aware, pre-install.** dither's
    [`.github/workflows/ci.yml`](https://github.com/fliip92/dither/blob/main/.github/workflows/ci.yml)
    checked out shallow (`checkout@v7`, default depth 1); the range gate needs history, so
    `fetch-depth: 0` is added — exactly what the Seed's own CI does for its git-aware gates. The
    `ADR gate` step runs after `Map gate`, before `pnpm install` (git + node only), passing the event
    base ref (`origin/<base_ref>` on a PR, `github.event.before` on a push) — the Seed's
    plan-traceability wiring, verbatim. A `check:adr` script joins `check:map` in dither's root
    `package.json`.
  - **Not ring 0028's pure-additive beachhead (as item 1).** The graft modifies existing files
    (`ci.yml` wiring + one `package.json` script line) and adds `.seed/checks/adr-gate.ts`.
    Reversibility is *revert the graft commit → byte-identical*, not *remove created paths only*
    ([ring 0037](0037-dither-map-gate-graft.md) established this for the into-an-existing-host case).
- Alternatives considered:
  - **Add-or-modify trigger for clause 2** (any commit touching an ADR file must cite it). Rejected —
    dither's own history over-fires under it (`919a3b6`, `996d28f` are legitimate *uncited* ADR
    touches); it would gate note/status edits and the genesis import. ADD targets the sharp "a
    decision is recorded here" event; modifications are covered by clause 1.
  - **The Seed's universal-citation rule** (every commit names an ADR, mirroring the plan/ring
    mandate). Rejected — dither is a product repo; most commits are ordinary work under an
    already-recorded decision or below the ADR threshold. Universal citation is foreign structure and
    would red-fail on contact — the opposite of *no behavior changes yet*.
  - **A generalized commit→decision-record engine in the Seed** (parameterized by citation-regex +
    decision-predicate, copied to every host so one implementation serves all). Not built — the Seed's
    own plan-traceability is not built on such an engine, and generalizing for a fleet of *one* host is
    speculative (LAW-7: own the small subset; generalize when a **second** caller appears — the
    [ring 0016](0016-repo-fitness-generalizes-the-metric-engine.md) bar). The dither runner is
    self-contained; the generalization earns its place when a second host needs commit→decision
    traceability. Recorded as a revisit trigger.
  - **Re-implement as a bespoke dither-native script, or `npx` a pollen package.** Rejected for item
    1's reasons ([ring 0037](0037-dither-map-gate-graft.md)): two divergent copies of one algorithm
    (LAW-7); the Seed publishes no npm package and propagation is re-metabolization, not `npm update`.
- Enforcement: CI gate (LAW-6). dither's `ci.yml` runs `node .seed/checks/adr-gate.ts <base>` as a
  fast, install-free step. Verified this session against a throwaway clone of dither across **9
  scenarios** — FIRE on: an added-but-unnamed ADR (clause 2), a dangling `ADR-0099` (clause 1), and a
  slash-list with one dangling half (`ADR-0003/0099`, proving the split); HOLD on: an added **and**
  named ADR, a `#47`-issue-ref-only commit (prose, not the gate), a **modified** uncited ADR (the
  ADD-only trigger), a valid slash-list (`ADR-0003/0007`), an empty range, and a `docs/adr/README.md`
  edit (the item-1 index is not a numbered ADR). Landed in dither `95dd09a` (local; push
  Gardener-gated); the landing range `da6bb24..95dd09a` — exactly what hosted CI judges on push — is
  **green on both** the ADR and map gates. Dogfooding tooth: the gate first caught its *own*
  installation commit's **illustrative** `ADR-0042` (clause 1 cannot tell an example from a citation),
  reworded to the literal `ADR-NNNN` placeholder — a real demonstration that commit prose cannot name
  a non-existent decision. The vendored engine is pinned to the Seed's by being byte-identical
  (confirmed this session).
- Revisit-when: a **second host** needs commit→decision traceability (the generalized-engine
  alternative returns — extract the shared plumbing into the verbatim engine and re-copy to both);
  dither adopts a decision surface beyond `docs/adr/NNNN` (e.g. rings) that clause 2's ADD trigger
  should also cover; a legitimate need arises to record *several* decisions in one commit without
  naming each (clause 2 requires every added ADR be named); or dither's `.seed/` gate count grows
  enough to warrant grafting a **committed self-test harness** — today these host gates' fire/hold is
  session-verified + ring-recorded (the [ring 0037](0037-dither-map-gate-graft.md) precedent), not a
  committed test, a gap worth pricing into dither's own ledger at graft item 4.
