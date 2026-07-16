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
