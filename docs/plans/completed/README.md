# docs/plans/completed/ — finished plans

Completed plans are kept forever (LAW-5): they are the repository's memory of how it was
built, and the evidence trail behind every capability (LAW-6).

- [0001 — Germination](0001-germination.md) — completed 2026-07-04. Stage 0 bootstrap:
  map, anatomy, rings 0001–0008, first CI, adversarial verification, publication. Both
  exit criteria evidenced in its Evidence section.
- [0002 — Rooting (Stage 1)](0002-rooting.md) — completed 2026-07-05. Grew the
  self-maintenance organs: machinery self-tests (E-007/E-005), the plan-traceability gate
  (E-003), the doc-gardener drift detector, fitness v0 in CI, and cadence automation
  (E-008/E-010). Stage 1 exit criterion evidenced — the seed detects its own drift
  automatically.
- [0003 — Growth (Stage 2)](0003-growth.md) — completed 2026-07-15. Grew the Stage 2 skill garden
  — grill-the-gardener, repo-fitness, postmortem, parallel-worktrees, onboard-human, feedback
  (rings 0015–0021) — each shipping its own verification (LAW-6). Stage 2 exit criterion evidenced:
  [assessment 0001 — mottainapp](../../assessments/0001-mottainapp.md) (ring
  [0022](../../rings/0022-assessment-organ-exit-criterion.md)), a read-only foreign-repo assessment
  turned into an evidence-judgeable proposal, proven byte-identical before and after. Closed by the
  Stage 2 → 3 transition (ring [0025](../../rings/0025-stage-3-transition-approved.md)).
- [0004 — Intake: metabolizing external knowledge](0004-intake.md) — completed 2026-07-08. Grew the
  **intake** skill + the seed's first stated principle, **grounded-or-ask**, so the seed digests
  knowledge from the field (not only in-repo entropy) before Flowering: the network-free parse →
  classify → compose → ratify → land loop (ring [0024](../../rings/0024-intake-network-free-metabolizer.md)),
  enforced by `validate-principles` (ring [0023](../../rings/0023-grounded-or-ask-first-principle.md))
  and `validate-references`. Scouted by the first external-corpus intake
  ([harness-engineering.md](../../references/harness-engineering.md)); surfaced E-013/E-014. The
  inferential faithfulness judge (E-013) is deferred by design.
- [0005 — Flowering (Stage 3)](0005-flowering.md) — completed 2026-07-17. Packaged the portable subset
  as versioned [`pollen/`](../../../pollen/README.md) — the boundary + two version lines + lineage
  (ring [0026](../../rings/0026-pollen-boundary-versioning-lineage.md)), the owned `.seed/`
  release/graft CLI (ring [0027](../../rings/0027-release-graft-cli.md), paying off E-015), and the
  installer + mandated uninstall path (ring [0028](../../rings/0028-installer-uninstall.md)) — then
  proved the transplant on itself: the recursive self-upgrade test
  (ring [0029](../../rings/0029-recursive-self-upgrade-test.md)) cut v0.1.0 and grafted it into a
  sacrificial repo with fitness measured before/after and a byte-identical uninstall — the Stage 3
  exit criterion. Both Stage 3 → 4 gating prerequisites paid: the inferential-control judge (E-013,
  ring [0030](../../rings/0030-inferential-control-judge.md)) and the name (E-004,
  ring [0031](../../rings/0031-name-cleared-codename-retained.md)). Closed by the Stage 3 → 4
  transition (ring [0032](../../rings/0032-stage-4-transition-first-host-dither.md)).

Format and procedure: [../README.md](../README.md).
