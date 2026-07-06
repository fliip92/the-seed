# Ring 0021 — feedback ships the upstream-issue composer; posting is a Gardener-gated host act outside the genome, verified by a side-effect-free dry-run

- Date: 2026-07-05
- Stage: 2 — Growth
- Raised-by: seed
- Question: Building [plan 0003](../plans/active/0003-growth.md) scope item 6 (feedback) — open an
  issue upstream against the mother seed from any repository (LAW-11; SEED.md §7), verified by a
  dry-run that composes a well-formed upstream issue *without posting*. What does the genome ship
  versus a host: does the tool post, or only compose? What makes an issue "well-formed", and where
  does the mother seed's identity (the parent it is addressed to) come from when the tool runs in a
  descendant? How is "without posting" given teeth (LAW-6) — a real property, not a flag the tool
  merely declines to pass — and how does the tool behave when run in the mother seed itself, which
  has no upstream?
- Decision:
  - **The genome ships the composer, not a poster — and "without posting" is a capability it does
    not contain, not a mode it declines.** [`.seed/checks/feedback.ts`](../../.seed/checks/feedback.ts)
    (`npm run feedback -- dry-run …`) composes a well-formed upstream issue — a title, a body, and
    the parent it is addressed to — and emits the exact `gh issue create` command a human runs to
    post it. It has **no network code and no exec-of-`gh` path at all**. Posting an upstream issue
    needs a network, auth, and a live upstream — host-specific mechanics SEED.md §4 keeps out of the
    genome (the ring [0019](0019-parallel-worktrees-host-agnostic-lifecycle.md) "boot lives in host
    adapters" line) — and it is an outward-facing publish the Gardener gates (LAW-1). So the tool
    composes; a human posts, with the emitted command, once they approve. This is the sharpest
    reading of the verification's "without posting": the tool cannot post, so a dry-run is its only
    mode, and the [skill](../../skills/feedback/SKILL.md) documents the compose → review → human-post
    workflow.
  - **A well-formed issue is a fixed five-section body plus lineage.** The composer requires a
    complete **learning** — `kind`, `title`, `observation`, `generalizes` (why it belongs upstream,
    not in a local ring — the LAW-11 test), and `conversion` — and renders the ordered sections
    Lineage / Kind / What happened / Why this is upstream / Proposed conversion, a `[seed-feedback]`
    title prefix (so the mother seed can filter, the gardening-pass title convention), and a footer
    stating it was composed and NOT auto-posted. `kind` (`defect | friction | capability-gap |
    proposal`) and `conversion` are **closed vocabularies** — an out-of-vocabulary value is rejected
    (the [automerge](../../.seed/checks/automerge-scope.ts) unknown-class precedent); `conversion` is
    exactly SEED.md §0's four products, so an upstream learning proposes one of them and no other.
  - **The mother seed's identity (the parent) is read from the target's lineage, `--parent`, or
    refused.** The tool runs against *any* repository (the [repo-fitness](0016-repo-fitness-generalizes-the-metric-engine.md)
    shape) and reads the descendant's lineage — `seed version, parent, date planted` (SEED.md §7) —
    from an optional `pollen/lineage.json`, addressing the issue to `parent`. Absent lineage,
    `--parent <owner/repo>` supplies the upstream and the unknown fields degrade honestly to
    `unrecorded` — **stated, never fabricated** (the ring [0020](0020-onboard-human-generated-briefing.md)
    determinism discipline: the body carries no wall-clock, so a given learning composes
    byte-identically). If the target is a **root seed** (SEED.md present, no recorded parent, no
    `--parent`), the tool **refuses**: feedback flows *upstream* (LAW-11), so a learning about the
    method at the root is a ring or a ledger entry, not an upstream issue to yourself — this is the
    behavior when the tool is run in the mother seed itself.
  - **The verification is a side-effect-free dry-run with teeth (LAW-6).** The composer self-validates
    the learning; [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts) pins the three-binding
    shape repo-fitness and worktrees use. **It works:** a descendant's complete learning composes a
    well-formed issue to its parent, with the **exact ordered section set** pinned (the worktrees
    anti-costume guard — no section can be silently dropped, reordered, or renamed, even though no
    bad-input case forces the happy-path structure red), and composition is deterministic. **Its
    validation has teeth:** a missing required field, an unknown `kind`, an unknown `conversion`, a
    malformed `pollen/lineage.json`, and a rootless seed each exit 1 with a legible reason — a
    composer that waved an ill-formed learning through would produce the very malformed issue
    "well-formed" forbids (LAW-2). **It is side-effect-free:** composing leaves the target
    byte-identical (tree hash + git HEAD + status — the repo-fitness non-mutation proof) and posts
    nothing (the command is emitted as text; a clean exit 0 with the command present, against a
    parent the run never contacts, is the proof it did not post).
  - **No new CI step, no new required-anatomy entry** — the ring
    [0016](0016-repo-fitness-generalizes-the-metric-engine.md)/[0019](0019-parallel-worktrees-host-agnostic-lifecycle.md)/[0020](0020-onboard-human-generated-briefing.md)
    precedent. The tool reads arbitrary targets and is not a per-commit invariant of the seed's own
    tree, so it stays out of `run-all.ts`; it and its skill are reached through the map
    (`.seed/README.md`, `skills/README.md`) and covered by `validate-map`'s reachability rather than
    added to `validate-anatomy`'s `REQUIRED_FILES`.
- Alternatives considered:
  - *Ship a `--post` mode that the dry-run omits* — rejected: it would pull a network, auth, and a
    live upstream into the genome, exactly the host-specific mechanics SEED.md §4 reserves for
    adapters, and would make "without posting" a discipline (remember to pass dry-run) rather than a
    property (the tool cannot post). The genome composes; the host/human posts. A future host adapter
    that wraps `gh` lives outside the genome, like the deferred worktrees `adapters/` organ.
  - *Read the mother seed's identity from a hardcoded constant (`fliip92/the-seed`)* — rejected: it
    would bake this lineage's parent into the genome, breaking for forks (a fork's parent is its own
    fork point, not this repo) — the dogma-not-method failure Stage 4 warns against. The parent is
    the descendant's recorded lineage, or `--parent`; the genome knows the *shape* of lineage, never
    a specific value.
  - *Compose free-text `kind`/`conversion`* — rejected: closed vocabularies let the mother seed
    triage and let the composer reject nonsense (teeth); `conversion` anchored to SEED.md §0's four
    products keeps feedback proposing a real conversion, not an unbounded wish.
  - *Define a live `pollen/lineage.json` in the seed now, or a whole lineage/installer organ* —
    deferred: this repo is the root and has no parent, so a hand-authored lineage would fabricate one
    (the ring [0015](0015-grill-the-gardener-architecture-doc.md) "don't hand-author the seed's own
    architecture doc" / ring 0020 "no fabricated timestamp" discipline). The tool ships a
    forward-compatible *reader* of the SEED.md §7 shape; the installer that *writes* lineage into a
    grafted host lands at Flowering/Pollination, priced nowhere because nothing needs it yet (the
    ring 0019 `adapters/`-deferral).
  - *Make composing write the body to a file (so the `gh` command is copy-paste ready)* — rejected:
    writing a file is a side effect, and side-effect-freeness is the sharp point of "without posting".
    The tool prints the body; the human (or the agent driving the skill) saves it and posts — the
    same human-does-the-outward-act split the emitted command embodies.
- Enforcement: structural test — the composer
  [`.seed/checks/feedback.ts`](../../.seed/checks/feedback.ts) is self-asserting (exit 1 on any
  ill-formed learning or absent upstream), and [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts)
  (`npm test`) pins it: it works (a descendant composes a well-formed issue with the exact ordered
  section set, all green, and deterministically), its validation has teeth (a missing field, an
  unknown kind, an unknown conversion, a malformed lineage file, and a rootless seed each exit 1 with
  a legible message), and it is side-effect-free (composing against a git target leaves it
  byte-identical and posts nothing — the command emitted as text). `npm run check` stays green — the
  two new files (`feedback.ts`, `skills/feedback/SKILL.md`) are map-reachable through
  [`.seed/README.md`](../../.seed/README.md) and [`skills/README.md`](../../skills/README.md).
- Revisit-when: a host adapter that actually posts (wrapping `gh`, or a GitHub API call with auth)
  becomes worth a home outside the genome (the deferred `adapters/` organ, shared with worktrees); or
  the installer lands and writes `pollen/lineage.json` into grafted hosts (then the reader's shape is
  exercised by a real writer, not only `--parent` and fixtures); or a learning class recurs often
  enough that a richer `kind` vocabulary or a structured template earns its complexity.
