# Ring 0010 — Model and effort selection policy

- Date: 2026-07-04
- Stage: 1 — Rooting
- Raised-by: gardener
- Question: Which model tier and reasoning effort should a session (or a subagent it
  spawns) run at for a given piece of Seed work? Asked while choosing how to execute
  plan 0002 scope item 2; without a policy, every scope item re-asks it.
- Decision: The strength of the verification harness, not the perceived importance of
  the task, decides the tier.
  - Pattern-following work whose mistakes the machinery catches mechanically (`npm run
    check`, the self-tests, CI gates) runs on the cheapest tier that clears it, at the
    default reasoning effort.
  - Novel design, adversarial review, and security-relevant surfaces (CI definitions,
    automerge rules, anything that gates main) run on the top available tier — or a
    mid-tier implementation followed by a top-tier review pass.
  - Effort moves off the default only with a reason: raised for the genuinely hard end,
    lowered for purely mechanical batch work.
  - Subagents and workflow stages spawned inside a session: mechanical fan-out stages
    run at low effort on a cheap tier; verify/judge stages inherit the session tier or
    higher.
  - Specific model names and prices are never committed to durable docs — they rot
    faster than the Seed can verify them. Volatile bindings live in the active plan's
    `Next actions` as per-item tier hints, and die with the plan.
- Alternatives considered: A committed model/pricing reference under docs/references/ —
  rejected: it duplicates external documentation the Seed cannot keep fresh and becomes
  a standing drift source (LAW-8). No policy, deciding ad hoc each session — rejected:
  re-asking the Gardener a retired question is drift (LAW-10).
- Enforcement: doc-only for the launch-time choice — justified: the session's model is
  picked by the Gardener outside the repository's mechanical reach, so there is no
  artifact to lint at decision time. The two halves inside the repo's reach are
  followable: agents apply the subagent/workflow clause directly, and tier hints are
  carried in the active plan's `Next actions`, visible in plan review. Becomes a CI
  gate if session launch is ever automated (Stage 1 cadence work may do this).
- Revisit-when: The model lineup, pricing structure, or effort semantics change
  materially; or automation begins launching sessions mechanically, at which point the
  hint becomes machine-read and the enforcement should harden.
