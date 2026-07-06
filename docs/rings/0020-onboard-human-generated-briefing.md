# Ring 0020 — onboard-human generates a deterministic briefing; the generation manifest + regeneration check land with it, converting E-001

- Date: 2026-07-05
- Stage: 2 — Growth
- Raised-by: seed
- Question: Building [plan 0003](../plans/active/0003-growth.md) scope item 5 (onboard-human) —
  brief a new human, current state → goal, as conversation *plus* a generated md/html artifact,
  verified by deterministic regeneration from repo state (the `docs/generated/` discipline). This
  is the **first** artifact in `docs/generated/`, so it must also build E-001's conversion path
  (the generation manifest + a CI check that artifacts match regeneration). What ships: md or
  html; where does the manifest live; is the check a `run-all.ts` gate or an advisory number; what
  sources does the generator read so the briefing is both useful and not spuriously fragile; and
  how is "regenerates deterministically from repo state" given teeth (LAW-6)?
- Decision:
  - **One markdown artifact, [`docs/generated/onboarding.md`](../generated/onboarding.md) — md,
    not html.** Markdown lives in the doc graph the map already walks, so the dead-link and
    ≤3-hop reachability gates ([`validate-map`](../../.seed/checks/validate-map.ts)) cover the
    briefing for free; an html render would double the determinism surface (a second byte-exact
    output to keep clock-free) for no verification gain and would not be walkable the same way. The
    genome's "md/html" is a menu, not a mandate (the plan's "menu, not a frozen build order"
    framing); md is picked, html deferred — the manifest is a list, so a host that wants a rendered
    page adds a second entry, priced nowhere because nothing needs it yet (the ring 0019
    `adapters/`-deferral shape).
  - **The manifest is machinery: [`.seed/lib/generated.ts`](../../.seed/lib/generated.ts), a typed
    registry of `{ artifact, sources, command, generate(root) }`.** It does not live in
    `docs/generated/` — that directory is regenerated-only, and a hand-authored manifest does not
    belong in it. Each entry names the artifact, the source files whose existence the check
    verifies, the regeneration command, and a **pure** `generate(root)` function that is the single
    definition of what the artifact is (LAW-3), shared by the generator CLI
    ([`.seed/checks/generate.ts`](../../.seed/checks/generate.ts), `npm run generate`) and the
    guarding check. This is the home every future generated artifact registers in.
  - **The check is a `run-all.ts` gate, not an advisory number and not git-aware.** The generator
    is a pure function of the working tree (reads files, emits a string — no git, no clock, no
    environment), so "the committed artifact equals its regeneration" is checkable inline in
    [`validate-generated.ts`](../../.seed/checks/validate-generated.ts) exactly like the other
    content checks — and being a hard gate is correct: a stale or hand-edited generated artifact is
    a LAW-2 correctness defect, not a trend the cadence digests (contrast doc-drift/fitness, which
    are advisory per ring [0011](0011-drift-advisory.md), and worktrees/repo-fitness, which stay out
    of `run-all.ts` only because they need git/filesystem side effects — this needs neither).
  - **Determinism means no wall-clock, no environment — provenance is structural, not temporal.**
    The artifact derives solely from repo files and embeds no "generated on <date>": a timestamp
    would make every regeneration differ from the last and fabricate drift, defeating the check.
    Provenance is stated structurally ("generated from repo state — do not hand-edit"). The
    coupling that remains is the healthy one: the briefing summarizes current state, so changing
    that state (the stage, the active plan) forces a regeneration in the same commit — the briefing
    cannot silently go stale, the exact drift [postmortem 0001](../postmortems/0001-agents-current-state-drift.md)
    is about.
  - **The generator sources from the map (AGENTS.md), not a directory listing.** It reads the
    `- **Stage:**` line and the active-plan links AGENTS.md carries, then each linked plan's title
    and `## Goal`. Sourcing from the map keeps the briefing anchored to the entry point (LAW-4) and
    makes it deterministic against stray files: a ghost or unlinked plan in `docs/plans/active/`
    never perturbs the output (a directory listing would have — and would have made the self-test's
    fixture plans spuriously fail the gate). Imported goal prose is flattened (inline links → text,
    newlines → spaces) so the briefing carries no relative link that would dangle from
    `docs/generated/`.
  - **Teeth (the sharp LAW-2 point), pinned by the self-tests.** A check that only ever passes
    proves nothing. [`self-test.ts`](../../.seed/tests/self-test.ts) pins that the pristine artifact
    matches its regeneration; that regeneration is a deterministic **fixpoint** (regenerate → the
    bytes are identical and the tree stays green); and that each defect fires: a **hand-edited**
    artifact, a **source changed** without regenerating (proving the check re-derives from source,
    not merely re-reads the file — the anti-costume guard), a **moved source anchor** (the generator
    throws → a legible "could not regenerate" violation, not a stack trace), an **unregistered file**
    in `docs/generated/`, and a **missing** registered artifact.
  - **Closes E-001.** The manifest + check is exactly E-001's stated conversion path ("build the
    manifest + check alongside the first generated artifact"); the entry moves to Paid.
- Alternatives considered:
  - *Generate html too (or instead)* — deferred: a second byte-exact output to keep clock-free for
    no new verification, and not map-walkable like md. The manifest already admits it as a future
    entry; add it when a host needs a rendered page.
  - *Store the manifest as data in `docs/generated/manifest.json`* — rejected: `docs/generated/` is
    regenerated-only, and a hand-authored manifest there contradicts the directory's own rule. The
    manifest is machinery; it lives in `.seed/lib/`.
  - *Make the check advisory (like doc-drift/fitness)* — rejected: those measure trends; a generated
    artifact that disagrees with its source is a defect, and the whole point of E-001 is a gate that
    refuses to merge a hand-edit or a stale artifact.
  - *Enumerate `docs/plans/active/` directly for the "active plan" section* — rejected: it couples
    the briefing to any file dropped in that directory (breaking the gate on stray/ghost fixtures)
    and drifts from the map. Sourcing from the map's links is both more robust and more faithful to
    LAW-4.
  - *Embed a generation timestamp for provenance* — rejected: it makes the artifact non-reproducible
    and the check meaningless (every run differs). Provenance is stated, not stamped.
- Enforcement: structural test — [`.seed/checks/validate-generated.ts`](../../.seed/checks/validate-generated.ts)
  runs in `npm run check` (`run-all.ts`) and fails when a committed artifact differs from its
  regeneration, when a `docs/generated/` file is unregistered, or when a generator cannot run (a
  missing source is caught there — the generator reads its own sources — rather than in a second,
  redundant existence check, LAW-7). Its firing and the determinism/fixpoint property (a corrupted
  copy regenerated by `npm run generate` exits 0 and is restored byte-for-byte to the committed
  bytes) are pinned by [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts) (`npm test`); a
  repo-wide [`.gitattributes`](../../.gitattributes) pins text to LF so the byte-exact gate holds on
  any platform. The new machinery and skill are map-reachable (`.seed/README.md`,
  `skills/README.md`, `docs/generated/README.md`), so `validate-map` keeps them ≤3 hops without a
  new `REQUIRED_FILES` entry (the ring
  [0016](0016-repo-fitness-generalizes-the-metric-engine.md)/[0019](0019-parallel-worktrees-host-agnostic-lifecycle.md)
  precedent).
- Revisit-when: a host needs the rendered html artifact (add the second manifest entry); or a
  generated artifact needs a source the pure-function-of-files model cannot express (a git-history
  or network-derived value — then it belongs with the advisory instruments, not this gate); or the
  briefing's map-sourced anchors prove too coupled and a more stable current-state source is worth
  cutting.
