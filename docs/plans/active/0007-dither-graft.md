# Plan 0007 — dither graft (Pollination Propose → Graft)

- Status: active

## Goal

Convert the dither Scout ([assessment 0002](../../assessments/0002-dither.md)) and Grill
([ring 0033](../../rings/0033-dither-grill-outcomes.md); target architecture
[docs/architecture/dither.md](../../architecture/dither.md)) into the four Propose products
(SEED.md §4 step 3) — target architecture, migration plan, workflows, responsibilities — for
dither's owner to review and approve. This plan **opens as the Propose**: it is a proposal until
the owner approves it, and **no Graft (step 4) mutation of dither begins before that approval**
(LAW-1, the owner gate). On approval it governs the Graft — the additive, refuse-to-clobber,
byte-exact-reversible install of the map, decision structure, and first lints
([ring 0028](../../rings/0028-installer-uninstall.md)); no behavior changes.

## Target architecture

→ [docs/architecture/dither.md](../../architecture/dither.md) (the Grill's output). Not restated
here; the migration installs its Rules as enforcement, in order.

## Migration plan (the ordered graft)

Each item is one organ/lint, installed additively (refuse-to-clobber, byte-exact uninstall —
ring 0028), shipping its own verification (LAW-6), its per-item build decision cut as a ring when
designed. Order = dependency + value:

1. **Map + reachability/dead-link gate.** Seed-side prerequisite (mutates only the seed, so payable
   before the owner gate): pay [E-016](../entropy-ledger.md) — make `map_reachability`'s entry
   filename resolvable so it reads dither's canonical `CLAUDE.md` (ring 0033). Then graft the
   reachability + dead-link gate into dither's CI, measuring ≤3 hops from `CLAUDE.md`. Verification:
   a real `map_reachability` computes for dither (not null); a seeded dead link fails the gate.
2. **Commit→ADR traceability gate.** Graft the seed's plan-traceability shape adapted to dither's
   decision surface: a commit enacting a decision cites an existing in-repo ADR (`docs/adr/NNNN-*`).
   Verification: fires on a decision-commit with no ADR citation, holds on one citing a valid ADR;
   GitHub-Issue refs stay allowed prose but are not the gate.
3. **Principles organ + `enforcement_ratio`.** State dither's CI-enforced norms as principles naming
   `ci.yml` (it runs lint + typecheck + test). Verification: `enforcement_ratio` computes a real
   ratio (no longer null); each principle names an enforcer that exists.
4. **Entropy ledger, seeded.** Create dither's ledger from its own pre-sensed entropy —
   `architecture.md`'s "Deferred to build time" list, the risk register, the `docs/spikes/`
   feasibility notes — each given an interest rate + conversion path. Verification: ledger validates;
   `ledger_trend` computable.

**Threaded through the graft (not a step):** the seed installs its skills in a path separate from
dither's vendored `.agents/skills/`, which stays pinned (`skills-lock.json`) and is excluded from
the seed's reachability/drift gates (ring 0033).

**Deferred to Metabolize (step 5), priced not built now:** the app→package / package-independence
import-boundary structural test (dither.md Rule 5) — a behavior-adjacent lint, outside the "no
behavior changes yet" first graft; priced into dither's new ledger at graft.

## Workflows (post-graft)

dither's owner ships through the agent workflow: the agent does the work, the owner approves at
gates (LAW-1); commits cite the ADR they enact (item 2); new decisions become ADRs (or rings, per
the owner's chosen surface); sensed entropy is priced into the ledger (LAW-8); fitness is measured
on cadence — the before/after-graft delta is the pollination proof (SEED.md §6). The two Metabolize
tracks (refactor-toward-architecture + feature work) run in parallel once grafted, fitness
arbitrating pace.

## Responsibilities

→ [docs/architecture/dither.md](../../architecture/dither.md) Ownership. In short: the owner
(Gardener) owns intent, priorities, taste, and every gate approval — including approving **this**
proposal and each per-item ring; the agent owns everything else — building the lints/organs above
and their verification.

## Decision log

- **Proposal until the owner approves it** (SEED.md §4 step 3; the plan-0006 transition-proposal
  precedent). No Graft mutation of dither begins before approval — the owner gate (LAW-1).
- **The graft is additive and reversible** ([ring 0028](../../rings/0028-installer-uninstall.md)):
  refuse-to-clobber, byte-exact uninstall. The seed touches dither only after approval and can be
  removed leaving dither byte-identical.
- **Method, not dogma** (SEED.md §4): every item formalizes something dither already does (a legible
  map, CI-enforced norms, ADRs, pre-sensed deferred/risk entropy) — none imposes foreign structure;
  the graft adapts to dither's surfaces (`CLAUDE.md`, ADRs), it does not rename them.
- **Branch-protection residual carried** ([E-005](../entropy-ledger.md)/[E-008](../entropy-ledger.md),
  flagged at the Stage 4 transition): the seed's gates land in dither's CI, but enforcing them on
  `main` is the owner's call (dither's `ci.yml` already gates PRs). Named here; the owner decides at
  graft, not the seed.
- **Tier** ([ring 0010](../../rings/0010-model-effort-selection.md)): this Propose is
  Gardener-judgment work, drafted mid tier; the graft against a real host (the first mutation) runs
  at top tier or a top-tier review pass.

## Progress log

- **2026-07-18** — Opened as the **Propose** (SEED.md §4 step 3), converting the dither Scout
  ([assessment 0002](../../assessments/0002-dither.md)) + Grill
  ([ring 0033](../../rings/0033-dither-grill-outcomes.md),
  [docs/architecture/dither.md](../../architecture/dither.md)) into the four products above. Awaiting
  the owner's approval; on approval this plan governs the Graft (step 4), whose item 1 pays
  [E-016](../entropy-ledger.md) (seed-side) before the reachability gate lands on dither. `npm run
  check` + `npm test` green.

## Next actions

1. **Owner reviews and approves this Propose** (SEED.md §4 step 3) — the gate before any mutation.
   Approval is a Gardener act; record it as a ring (the transition-approval precedent) and confirm
   the graft order.
2. On approval, **Graft item 1** (step 4): pay [E-016](../entropy-ledger.md) seed-side, then install
   the map + reachability/dead-link gate into dither — the first mutation of a real host, additive
   and reversible ([ring 0028](../../rings/0028-installer-uninstall.md)), at top tier.
3. Then graft items 2–4 in order, each a ring + its verification; price the deferred import-boundary
   test into dither's new ledger.
