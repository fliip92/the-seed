# onboard-human

Brief a human meeting the Seed for the first time: **current state → goal**, as a
conversation *and* a durable artifact they keep (SEED.md §4, Stage 2). A new collaborator
should not have to read the whole genome to know where the Seed is and where it is going —
that is the briefing's job. But a briefing that is written by hand rots the moment the state
moves (the drift class [postmortem 0001](../../docs/postmortems/0001-agents-current-state-drift.md)
records). So the artifact is **generated from repo state**, never authored: it cannot drift
from the truth without `npm run check` catching it.

Two outputs, one from the other:

1. **The conversation** — you, live, walking the human from where the Seed is to where it is
   going, answering what they ask. Grounded in the map ([AGENTS.md](../../AGENTS.md)) and the
   genome ([SEED.md](../../SEED.md)); the artifact is your script and their takeaway.
2. **The artifact** — [`docs/generated/onboarding.md`](../../docs/generated/onboarding.md), a
   one-screen briefing produced by the generator, registered in the generation manifest, and
   guarded so it stays honest.

## When to run

- A new human (a contributor, a reviewer, a Gardener-to-be) needs to get oriented fast.
- After a stage transition or a change of the active plan, when the standing briefing should
  reflect the new current state — regenerate and hand it over.
- You want a shareable, always-current "start here" that is provably in sync with the repo,
  not a stale wiki page.

## The briefing

The artifact answers three questions, each derived from the repository's own state so it
cannot lie:

- **Where the Seed is now** — the current stage, read from the map's `- **Stage:**` line.
- **Where it is going** — the active plan(s) the map links, each with its goal (the plan's
  `## Goal`), which states the destination and the stage's exit criterion.
- **How to get oriented** — read the map, then the genome; run `npm run check` before
  claiming done; the first law you feel (LAW-2).

To brief a human: **regenerate, then talk.** Run `npm run generate`, open the artifact, and
walk them through it — the generated page is the spine of the conversation and the thing they
keep. Never hand-edit the page; if it says the wrong thing, the *source* is wrong (fix
AGENTS.md or the plan) or the *generator* is (fix [`.seed/lib/generated.ts`](../../.seed/lib/generated.ts)),
then regenerate.

## The generator and the manifest

The briefing is one entry in the **generation manifest**,
[`.seed/lib/generated.ts`](../../.seed/lib/generated.ts): an artifact path under
`docs/generated/`, its sources, its regeneration command, and a pure `generate(root)`
function — the single definition of what the artifact is (LAW-3). The manifest is the home
every future generated artifact registers in; [`.seed/checks/generate.ts`](../../.seed/checks/generate.ts)
(`npm run generate`) writes them all.

```bash
npm run generate     # rewrite every generated artifact from its sources
npm run check        # among other checks, prove each committed artifact matches its source
```

A generator is a **pure function of repo files** — no wall-clock, no randomness, no
environment. That is what makes the briefing regenerate byte-identically; embedding a
timestamp would fabricate drift on every run. The briefing derives from the *map* (AGENTS.md:
the stage line and the active-plan links it carries), not from a directory listing, so it
stays anchored to the entry point (LAW-4) and to whatever plan actually governs.

## Verification (LAW-6)

A skill that cannot prove it worked is a claim, not a capability. The artifact regenerates
deterministically from repo state, enforced by
[`.seed/checks/validate-generated.ts`](../../.seed/checks/validate-generated.ts) (part of
`npm run check`), which re-runs the generator and fails if the committed artifact differs —
so a **hand-edit** is caught, and a **source that changed without regenerating** is caught
(the briefing no longer equals what its sources produce). It also fails on any file in
`docs/generated/` that no manifest entry claims, and on a generator that cannot run (a source
it reads is gone — a legible violation, not a crash). The
check's firing is pinned by [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts)
(`npm test`) with the machinery's temp-copy methodology: the pristine artifact matches its
regeneration; `npm run generate` run against a deliberately corrupted copy exits 0 and restores
the artifact byte-for-byte to the committed bytes (proving the CLI runs, writes, and is a
deterministic fixpoint, leaving the tree green); and a hand-edited artifact, a changed source, a
moved source anchor, an unregistered file in `docs/generated/`, and a missing artifact each fire. This is the manifest + check that
converts ledger E-001 (the `docs/generated/` hand-edit rule, stated but unenforced until the
first generated artifact). Ring
[0020](../../docs/rings/0020-onboard-human-generated-briefing.md) records the build decision.
