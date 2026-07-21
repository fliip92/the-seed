# docs/rings/ — the decision log

Append-only, numbered record of every decision that retired a question (LAW-10: never ask
twice; SEED.md §2 defines the format). Before asking the Gardener anything, search this
directory — if a ring answers it, asking again is drift in you.

## Rings

- [0001 — Founding defaults](0001-founding-defaults.md)
- [0002 — Germination implementation defaults](0002-germination-implementation-defaults.md)
- [0003 — Ring and ledger field formats refine the genome's sketch](0003-artifact-field-formats.md)
- [0004 — Name, hosting, and visibility](0004-name-hosting-visibility.md)
- [0005 — License: MIT](0005-license-mit.md)
- [0006 — Solo until Flowering](0006-solo-until-flowering.md)
- [0007 — Gardening cadence and automerge policy](0007-gardening-cadence-automerge.md)
- [0008 — Ring 0001 confirmed: germination question 5 closed](0008-ring-0001-confirmed.md)
- [0009 — Stage 0 → 1 transition approved](0009-stage-1-transition-approved.md)
- [0010 — Model and effort selection policy](0010-model-effort-selection.md)
- [0011 — Drift detection is an advisory trend signal, not a gate](0011-drift-advisory.md)
- [0012 — Cadence automation mechanism](0012-cadence-automation-mechanism.md)
- [0013 — Plan links resolve across active/ and completed/](0013-plan-links-resolve-across-active-completed.md)
- [0014 — Stage 1 → 2 transition approved](0014-stage-2-transition-approved.md)
- [0015 — grill-the-gardener produces a one-page architecture doc, enforced structurally](0015-grill-the-gardener-architecture-doc.md)
- [0016 — repo-fitness generalizes the metric engine; self-fitness is the target=self case](0016-repo-fitness-generalizes-the-metric-engine.md)
- [0017 — postmortem is a numbered entry that must link all three artifacts, enforced structurally](0017-postmortem-three-artifacts-linked.md)
- [0018 — the map's current-state prose drift is handled doc-only until the drift instrument grows the class](0018-map-current-state-drift-doc-only.md)
- [0019 — parallel-worktrees ships the host-agnostic worktree lifecycle; boot lives in host adapters, verified by a hermetic dry-run](0019-parallel-worktrees-host-agnostic-lifecycle.md)
- [0020 — onboard-human generates a deterministic briefing; the generation manifest + regeneration check land with it, converting E-001](0020-onboard-human-generated-briefing.md)
- [0021 — feedback ships the upstream-issue composer; posting is a Gardener-gated host act outside the genome, verified by a side-effect-free dry-run](0021-feedback-composes-upstream-issue.md)
- [0022 — the assessment organ is the Stage 2 exit criterion's artifact: a read-only Scout converted to four-products findings with the un-elicited architecture left to a grill agenda, enforced structurally](0022-assessment-organ-exit-criterion.md)
- [0023 — grounded-or-ask is the seed's first stated principle; validate-principles binds every principle to name a mechanism whose enforcer exists](0023-grounded-or-ask-first-principle.md)
- [0024 — intake metabolizes a repo-saved corpus network-free; pin-not-mirror provenance and a closed outcome vocabulary](0024-intake-network-free-metabolizer.md)
- [0025 — Stage 2 → 3 transition approved](0025-stage-3-transition-approved.md)
- [0026 — the pollen boundary, two version lines, and the semver/migration model](0026-pollen-boundary-versioning-lineage.md)
- [0027 — the release / graft CLI: the determinism split made mechanical](0027-release-graft-cli.md)
- [0028 — the installer + the mandated uninstall path: graft is a refuse-to-clobber beachhead, uninstall its byte-exact inverse](0028-installer-uninstall.md)
- [0029 — the recursive self-upgrade test: self-hosting is self-versioning + a fitness-measured sacrificial graft; the exit proof is split reproducible/recorded; the internal cut runs now, the Stage 3 → 4 transition stays Gardener-gated](0029-recursive-self-upgrade-test.md)
- [0030 — the inferential-control instrument: a compose-not-commit judge whose probabilistic verdict rides in a deterministic, staleness-gated envelope](0030-inferential-control-judge.md)
- [0031 — the "Seed" name is cleared as a non-exclusive descriptive codename: the trademark knockout search landed, no registration is claimed, E-004 paid](0031-name-cleared-codename-retained.md)
- [0032 — Stage 3 → 4 transition approved; dither is the first external host (resolving ring 0006's Gardener-designates-a-host revisit)](0032-stage-4-transition-first-host-dither.md)
- [0033 — dither grill: canonical map, decision record, context-doc coverage, skills coexistence](0033-dither-grill-outcomes.md)
- [0034 — dither graft approved: the Propose is accepted; E-016 paid seed-side; the first dither mutation stays Gardener-gated](0034-dither-graft-approved.md)
- [0035 — the stage-agreement invariant: validate-stage checks AGENTS.md against fitness.ts's CURRENT_STAGE, firing only on disagreement so a grafted host is not bound](0035-stage-agreement-invariant.md)
- [0036 — the work-unit format: an optional, context-scoped `## Work units` section a plan decomposes into and parallel-worktrees consumes, conditionally enforced so small plans stay valid](0036-work-unit-format.md)
- [0037 — dither's map gate (graft item 1): the Seed's engine copied verbatim + a thin host-owned runner; dead links gated repo-wide, reachability measured; the committed-tree scope; the 6 pre-existing links fixed; not ring 0028's pure-additive beachhead](0037-dither-map-gate-graft.md)
- [0038 — dither's commit→ADR gate (graft item 2): the Seed's plan-traceability shape adapted to dither's decision surface — two clauses (cited-ADR-must-exist + a new-ADR commit names it), the ADD-not-modify trigger grounded in dither's own history, no universal-citation clause](0038-dither-adr-gate-graft.md)
- [0039 — dither's principles gate (graft item 3): every norm CI enforces stated as a principle naming a command ci.yml runs; the enforcer-exists check adapted to dither's CI-step surface (stronger than link-exists); all five gates covered, not the plan's three; enforcement_ratio null→100%](0039-dither-principles-gate-graft.md)
- [0040 — dither's entropy ledger (graft item 4): 8 entries seeded from its pre-sensed entropy + graft-surfaced items; a ledger-only gate over the verbatim engine (no plan system imposed); fire-when-present; the risk-register honesty filter; ledger_trend null→+8, map_reachability 6.1%→11.3% — the dither Propose→Graft completes](0040-dither-ledger-graft.md)
- [0041 — dither's import-boundary gate (Metabolize refactor E-001): the first Metabolize mutation; an owned R1/R2/R3 check over the verbatim engine; the pre-flight found the elicited package graph itself drifted (traits/matrix "build on droid-file" → they build on traits) and the target was corrected to the code (fix docs to code) before enforcing; E-001 Open→Paid — dither's first digested debt](0041-dither-import-boundary-gate.md)
- [0042 — dither's gates self-test (Metabolize refactor E-002): the verification of the verifiers; a scoped port of the seed's self-test.ts binds each of the five gates' violation classes into a committed CI harness (15/15, test-of-the-test by neutering map-gate); no eighth principle — the self-test is LAW-6 verification, not a product norm; E-002 Open→Paid — dither's second digested debt](0042-dither-gates-self-test.md)
- [0043 — map_reachability counts knowledge artifacts, not all files: the metric denominator is scoped to `.md` docs so it tracks doc navigability instead of flooring on a product monorepo (283 of dither's 386 files are source); the GATE is untouched — the seed still enforces total reachability, dither still gates broken links only, metric and gate now answer different questions; surfaced by the E-007 sweep, E-019 paid; seed 100% (94/94 docs) unchanged, dither 11.9% → 32.9% on re-copy](0043-map-reachability-scoped-to-knowledge-artifacts.md)

## Format (enforced by `.seed/checks/validate-rings.ts`)

- Filename: `NNNN-slug.md` — four digits, sequential, no gaps, lowercase-kebab slug.
- Title line: `# Ring NNNN — <title>` (number must match the filename).
- Required bullets, each starting a line: `- Date:` (YYYY-MM-DD), `- Stage:`,
  `- Raised-by:` (`gardener` or `seed`), `- Question:`, `- Decision:`,
  `- Alternatives considered:`, `- Enforcement:` (must name a mechanism: lint |
  structural test | CI gate | doc-only with justification — enforced), `- Revisit-when:`.
- Multi-part answers go in indented sub-bullets under the relevant key.
- This explicit-key format is canonical and refines the shorthand sketch in SEED.md §2
  (ring [0003](0003-artifact-field-formats.md)).

## Procedure

1. Take the next free number (check the list above — and add your ring to it).
2. Write the ring using the format. State the enforcement mechanically wherever possible;
   `doc-only` must justify why not mechanical (LAW-2).
3. Run `npm run check` — the ring validator must pass.
4. Rings are append-only: never edit a ring's Decision after merge. If a decision changes,
   cut a new ring that supersedes it and note the supersession in both.
