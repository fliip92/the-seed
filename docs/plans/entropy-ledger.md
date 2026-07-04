# Entropy ledger

Known debt: priced, rated, with conversion paths (LAW-8: entropy is paid continuously).
Entry format is defined in [README.md](README.md) and enforced by
`.seed/checks/validate-plans.ts`. Paid-off entries move to the **Paid** section — the
ledger is also a record of digestion.

## Open

## E-001 — `docs/generated/` hand-edit rule is stated but not enforced

- First observed: 2026-07-04, during germination
- Where: [docs/generated/README.md](../generated/README.md) declares hand-editing a lint
  error; no lint exists
- Interest rate: low (the directory is empty; compounds only once generators exist)
- Price: small — a generation manifest (source → artifact) plus a CI check that artifacts
  match regeneration
- Conversion path: invariant — build the manifest + check in Stage 1 alongside the first
  generated artifact; until then the rule is doc-only, which violates LAW-2 and is why
  this entry exists

## E-002 — CI is proven locally but not on a hosted runner

- First observed: 2026-07-04, during germination
- Where: [.github/workflows/seed-ci.yml](../../.github/workflows/seed-ci.yml) — no remote
  exists yet, so the workflow has never executed on GitHub
- Interest rate: medium (every merged change until hosting relies on agents remembering to
  run `npm run check` locally)
- Price: trivial once germination question 1 is answered — push, watch one run go green
- Conversion path: invariant — hosted CI on every push/PR; blocked on Gardener answer to
  germination question 1

## E-003 — Plan traceability is a stated metric with no enforcement

- First observed: 2026-07-04, during germination
- Where: SEED.md §6 (`plan_traceability`) and §4 Stage 1 ("merged PRs must trace to a plan
  or ring") — nothing checks this today
- Interest rate: medium (unattributed changes accumulate silently until Stage 1)
- Price: small — a CI check that the branch/PR references a plan or ring identifier
- Conversion path: invariant — mechanical trace check, scheduled as Stage 1 work

## E-004 — "Seed" is an uncleared working codename

- First observed: 2026-07-03, planted in SEED.md §8
- Where: SEED.md §8, [ring 0001](../rings/0001-founding-defaults.md)
- Interest rate: low now, spikes to high at Stage 3 (pollen cannot ship under an uncleared
  name)
- Price: Gardener judgment plus a trademark search
- Conversion path: ring — the Gardener named it "The Seed" (ring
  [0004](../rings/0004-name-hosting-visibility.md)), which settles the name but not its
  legal clearance; a trademark search must still land before Stage 3 pollen distribution

## E-005 — Ring append-only rule has no mechanical enforcement

- First observed: 2026-07-04, adversarial drift hunt during germination verification
- Where: [docs/rings/README.md](../rings/README.md) declares rings append-only ("never
  edit a ring's Decision after merge"); nothing checks git history for edits
- Interest rate: medium (a silently rewritten decision is worse than no decision — it
  poisons LAW-10 retrieval)
- Price: small — a CI step diffing `docs/rings/` against the merge base and failing on
  modifications to existing rings
- Conversion path: invariant — add the git-diff gate in Stage 1 alongside the other
  machinery structural tests (E-007)

## E-006 — Fragment links pass validation without anchor checking

- First observed: 2026-07-04, adversarial drift hunt during germination verification
- Where: `.seed/lib/repo.ts` strips `#fragment` before existence checks, so
  `[x](SEED.md#no-such-section)` counts as a live link
- Interest rate: low (fragments are rare here; a wrong one still lands the reader in the
  right file)
- Price: small — slugify headings the way GitHub does and verify the anchor exists
- Conversion path: invariant — extend the map validator with anchor checking when
  fragment links first appear in real use

## E-007 — Machinery has no committed self-tests

- First observed: 2026-07-04, when the negative tests proving the validators fire had to
  be re-run ad hoc after a failed verification workflow
- Where: `.seed/checks/` — verified by session-run negative tests whose transcripts live
  in [plan 0001](active/0001-germination.md), not by anything in CI
- Interest rate: medium (every validator change until then is verified only by whoever
  remembers to re-run the ad-hoc script; regressions land silently)
- Price: medium — a committed structural test that seeds each violation class in a temp
  copy and asserts the right check fires with a law-naming message
- Conversion path: invariant — Stage 1 ("first structural lints on your own machinery"),
  folding in the E-005 git-diff gate

## E-008 — Gardening cadence is manual until scheduled automation exists

- First observed: 2026-07-04, while adopting the cadence policy (ring
  [0007](../rings/0007-gardening-cadence-automerge.md))
- Where: the weekly gardening pass and the automerge class restrictions depend on an
  agent being invoked and on rules no CI gate checks yet
- Interest rate: medium (if no session opens, no gardening happens — drift accumulates
  exactly when nobody is looking)
- Price: medium — a scheduled agent invoking the gardening pass, plus a path-based CI
  gate encoding the automerge classes
- Conversion path: invariant — Stage 1 automation alongside doc-gardener and the
  machinery structural tests (E-005, E-007)

## Paid

*(nothing paid yet — germination is day one)*
