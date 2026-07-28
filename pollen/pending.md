# Pending release intents

The unreleased portable-subtree changes awaiting the next pollen release. Each is one top-level
bullet:

```
- Impact: <major|minor|patch> — [<plan|ring> NNNN](../docs/rings/NNNN-slug.md) — <one-line summary>
```

Every portable-subtree change declares one, in the same commit that makes it — the
[pollen-intent gate](../.seed/checks/pollen-intent.ts) proves it (E-023, ring 0052). The
citation is the decision record governing the change, a ring or a plan (SEED.md §6).

The impact is DECLARED, not parsed from commits (ring 0026): major = breaking (forces a
migration), minor = feature, patch = fix. `node .seed/checks/release.ts cut-release --date
YYYY-MM-DD` folds these into a dated release under [releases/](releases/README.md), bumps the
pollen version, and clears this file. The pending-release notes
([docs/generated/pending-release.md](../docs/generated/pending-release.md)) are computed from
this file and byte-exact-gated by `npm run check`.

The first eight are the **backfill** that landed with the gate (ring
[0052](../docs/rings/0052-portable-changes-declare-their-intent.md)): portable changes that shipped
between the v0.1.0 cut and the discipline becoming enforceable, declared retroactively from git
rather than left out of the release that will carry them.

- Impact: minor — [ring 0030](../docs/rings/0030-inferential-control-judge.md) — the inferential-control judge: a scored LLM-as-judge organ (`npm run judge`), its verdict envelope, and the `intake` / `judge` skills, so a descendant can put a probabilistic reading under structural control
- Impact: patch — [ring 0032](../docs/rings/0032-stage-4-transition-first-host-dither.md) — the Stage-4 transition's machinery residue: the stage constant the fitness snapshot reports, and a stale plan path in the pending-release notes generator
- Impact: patch — [plan 0006](../docs/plans/active/0006-pollination.md) — the metrics engine counts the **committed** repository rather than the on-disk walk, so a descendant's fitness reading stops including untracked local state
- Impact: minor — [plan 0007](../docs/plans/completed/0007-dither-graft.md) — `map_reachability` resolves the target's map filename (`AGENTS.md`, `CONTEXT-MAP.md`, …) instead of assuming the seed's, so a host that names its map differently computes a real fraction instead of a false null
- Impact: minor — [ring 0035](../docs/rings/0035-stage-agreement-invariant.md) — `validate-stage`: a new `run-all` check proving the growth stage agrees across its two hand-bumped places, silent when the map states no stage so a grafted host is not bound by it
- Impact: minor — [ring 0036](../docs/rings/0036-work-unit-format.md) — `validate-plans` learns the optional context-scoped work-unit format, enforced only where a plan opts in, so it costs a descendant nothing until it wants the shape
- Impact: minor — [ring 0043](../docs/rings/0043-map-reachability-scoped-to-knowledge-artifacts.md) — `map_reachability`'s denominator is scoped to knowledge artifacts (`.md` docs), so the metric tracks doc navigability instead of flooring on a repo whose files are mostly source; the reachability GATE is untouched
- Impact: patch — [ring 0049](../docs/rings/0049-dither-pollination-proof-exit-criterion-half-met.md) — `fitness --json` emits the two-space-indented shape its own history directory documents, so its output can be redirected straight into a dated snapshot
- Impact: patch — [ring 0050](../docs/rings/0050-gates-honor-git-ignore-rules.md) — the working-tree gates take their file set from git, so a git-ignored file (an agent tool's local state, editor or build output) no longer fails every check and self-test on a working machine while CI stays green
- Impact: minor — [ring 0051](../docs/rings/0051-decision-log-shape-resolved-not-assumed.md) — `plan_traceability` resolves the target's decision-log shape (plans and rings, or numbered ADRs under `docs/adr/`) instead of assuming the seed's, so an ADR-governed host computes a real fraction instead of a false "no decision log" null
- Impact: minor — [ring 0052](../docs/rings/0052-portable-changes-declare-their-intent.md) — the `pollen-intent` gate: no portable change since the last cut may go undeclared, proved from git against the manifest; an intent may now cite a plan as well as a ring, matching the decision-record vocabulary the commit convention already permits
