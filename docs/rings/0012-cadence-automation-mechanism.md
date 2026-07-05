# Ring 0012 — Cadence automation mechanism

- Date: 2026-07-04
- Stage: 1 — Rooting
- Raised-by: seed
- Question: Ring [0007](0007-gardening-cadence-automerge.md) set the gardening cadence and
  the automerge classes but left two halves unenforced — the touched-paths restriction was
  doc-only, and the weekly pass was manual — pricing the gap as
  [E-008](../plans/entropy-ledger.md). Executing plan 0002 scope item 5, how is each made
  mechanical: how does a change *claim* automerge eligibility so a gate can check it, and
  what invokes the pass on a schedule?
- Decision: Both halves land as boring, verifiable mechanism; ring 0007's Revisit-when
  ("scheduled automation lands — tighten the class rules mechanically") is now satisfied.
  - **Automerge is claimed per commit by an `Automerge: <class>` message trailer**, where
    `<class>` is one of ring 0007's mechanical classes — `link`, `format`, `typo`,
    `stale-reference`, `regeneration`, `ledger`. The `seed/automerge-scope` CI gate
    (`.seed/checks/automerge-scope.ts`) proves the claim: a marked commit must touch none of
    the Gardener-gated surfaces — SEED.md, existing ring content (`docs/rings/` minus its
    README index), or principle statements (`docs/principles/` minus its README index). A
    marker naming an unrecognized class is itself a violation, so `Automerge: anything`
    cannot buy a pass. The convention is documented in [AGENTS.md](../../AGENTS.md) §
    Protocols.
  - **Polarity: constrain the claim, do not require a review marker on protected edits.**
    While solo (ring [0006](0006-solo-until-flowering.md)) there is no mechanical
    "was this Gardener-reviewed" signal, so the honest, bounded guarantee is that whatever
    *declares* itself safe-to-automerge provably stayed inside the mechanical boundary.
    Unmarked commits are the Gardener-review path and are not this gate's business (they are
    bound by traceability and Gardener judgment). Residual — while solo a constitution edit
    can simply omit the marker and commit directly — is accepted and recorded with E-008, the
    same shape as E-005's force-push residual; it hardens at Flowering with branch protection.
  - **The scheduled pass files an issue; it does not run an autonomous committer.**
    `.github/workflows/gardening-cadence.yml` (weekly cron + manual `workflow_dispatch`) runs
    the sense/measure instruments via `.seed/checks/gardening-report.ts` and files a durable,
    dated gardening-pass issue when `drift_count > 0`. The issue is the invocation — it turns
    E-008's risk (no session opens → drift accumulates unseen) into a work item an in-session
    agent or the Gardener picks up. v0 triggers on `drift_count`; widening the trigger is a
    later priced step, not a silent one.
- Alternatives considered:
  - A label or branch-name marker instead of a message trailer — rejected: solo commits go
    straight to `main` (ring 0006); there is no PR or branch to carry a label, and the commit
    message is the only durable per-commit channel, already used by traceability.
  - No class vocabulary (any `Automerge:` value passes the path check) — rejected:
    `Automerge: yes` would be a meaningless escape hatch. Naming a real mechanical class
    forces categorization against ring 0007 and lets the gate reject a vague claim; the
    vocabulary is grounded in an append-only ring, so it cannot silently drift.
  - Inverse polarity — require a Gardener-review marker on any protected-path edit — rejected
    for now: not mechanically decidable while solo (no review artifact exists to check);
    revisit at Flowering when branch protection supplies one.
  - A Claude Code action that autonomously commits automerge fixes on the schedule —
    rejected: heavier, depends on an API-key secret, less boring (LAW-7), and it would itself
    need the automerge gate to bound it. Filing an issue for an in-session agent is the
    boring, verifiable v0.
- Enforcement: CI gate — `.seed/checks/automerge-scope.ts` runs as a seed-ci step; its
  fire/hold behavior (marked + protected path fails; unknown class fails; unmarked passes;
  README index exempt; merge commit exempt; unresolvable base skips) is pinned by nine
  self-test cases in `.seed/tests/self-test.ts` (the E-007 harness). The scheduled pass's
  report composition is pinned by two further self-test cases; its cron + issue-filing glue is
  verified by a hosted `workflow_dispatch` run, the same standard as E-002.
- Revisit-when: branch protection arrives at Flowering (harden the polarity to require review
  on protected-path edits, closing the solo residual); or a new mechanical automerge class
  proves to recur (extend the vocabulary here via a new ring); or the scheduled trigger should
  widen beyond `drift_count` (a fitness regression or compounding ledger interest should also
  file a pass).
