# Ring 0039 — dither's principles gate (graft item 3): every norm CI enforces stated as a principle naming a command ci.yml runs; the Seed's enforcer-exists check adapted to dither's CI-step surface (stronger than link-exists); all five gates covered, not the plan's three; enforcement_ratio null→100%

- Date: 2026-07-19
- Stage: 4 — Pollination
- Raised-by: seed
- Question: [Plan 0007](../plans/active/0007-dither-graft.md) graft item 3 — the **principles
  organ + `enforcement_ratio`** — is the third organ grafted into dither, authorized under
  [ring 0034](0034-dither-graft-approved.md). The plan sets the shape ("state dither's CI-enforced
  norms as principles naming `ci.yml` — it runs lint + typecheck + test") and its verification
  ("`enforcement_ratio` computes a real ratio, no longer null; each principle names an enforcer that
  exists"). The build questions left to design time: **which** norms become principles — the plan's
  parenthetical named three, but graft items 1–2 have since added the map and ADR gates to dither's
  CI, so "every norm CI enforces" is now five? **What is the faithful analog, on dither's CI-step
  surface, of the Seed's `validate-principles` check** — which binds a principle's Enforcement clause
  to a linked check file that EXISTS — given dither's enforcer is a `ci.yml` step, not a check file?
  And **how does the gate keep `enforcement_ratio` honest** without importing the Seed's
  seed-specific principle machinery?
- Decision: Built and committed to dither (`8a9eec1`, local; the push stays Gardener-gated). The
  design:
  - **The verbatim-engine + host-owned-runner pattern extends (rings 0037/0038).**
    [`.seed/checks/principles-gate.ts`](https://github.com/fliip92/dither/blob/main/.seed/checks/principles-gate.ts)
    is dither's runner — the one file of host judgment; `.seed/lib/repo.ts` beside it is the Seed's
    engine, confirmed **byte-identical** to the Seed's this session (no re-copy). The runner composes
    the engine's `readRepoFile` / `formatViolation` / `Violation` with dither's principle vocabulary,
    reading the committed tree (`git ls-files`) so gitignored generated docs stay out.
  - **All FIVE CI-enforced norms are stated, not the plan's three.** "Every norm CI enforces is
    stated" ([dither.md](../architecture/dither.md) Rule 4) is a *completeness* claim; after graft
    items 1–2, dither's `ci.yml` enforces five steps — Map gate, ADR gate, Lint, Typecheck, Test — so
    a principles organ omitting the two grafted gates would make its own claim false on day one, and
    there is **no completeness gate** to catch the omission (see the soundness-only decision below).
    The plan's "(lint + typecheck + test)" described the *pre-graft* CI, not a cap. Stating all five
    also makes the two Seed-grafted gates legible in dither's **own** docs — they are otherwise
    recorded only in the Seed's rings, which dither's agents do not read (LAW-4, for dither). The five
    principles: [map-links-resolve](https://github.com/fliip92/dither/blob/main/docs/principles/map-links-resolve.md),
    [decisions-recorded-as-adrs](https://github.com/fliip92/dither/blob/main/docs/principles/decisions-recorded-as-adrs.md),
    [code-passes-lint](https://github.com/fliip92/dither/blob/main/docs/principles/code-passes-lint.md),
    code-typechecks, tests-pass.
  - **The enforcer-exists check is adapted, and made STRONGER: "names a command `ci.yml` RUNS," not
    "links a file that exists."** The Seed's [validate-principles](../../.seed/checks/validate-principles.ts)
    requires the Enforcement clause to link a check file present in the tree — because a Seed enforcer
    *is* a specific check file. dither's enforcer is a `ci.yml` step, so the faithful analog of "the
    enforcer exists" is **"`ci.yml` actually runs the named command,"** not merely "`ci.yml` exists"
    (a stale principle for a since-deleted step would still link an existing `ci.yml` and pass — the
    exact phantom the gate must catch). So the runner parses `ci.yml`'s `run:` bodies and requires each
    principle's Enforcement to quote in backticks at least one command `ci.yml` runs; a step that
    appends arguments matches as a **leading prefix** (the ADR gate's base-ref argument). This is
    SEED.md §4 *method, not dogma*: the same intent — the enforcer must be real — adapted to dither's
    uniform CI-step surface, and stronger for it, because it binds the principle to CI *reality*
    (delete the Lint step → `code-passes-lint` fails).
  - **The Seed's mechanism-vocabulary + link-exists pair collapses into that one check.** Because the
    enforcement check reads `ci.yml` and matches a real run command, it already rejects prose-only
    enforcement — "we will be careful" quotes no command `ci.yml` runs — so the Seed's separate
    `lint | structural test | CI gate | doc-only` vocabulary check is redundant on dither's surface
    and is **not ported** (that vocabulary is Seed-specific taste; dither's mechanism is uniformly
    `ci.yml`). The format checks are kept: kebab filename, one `# ` title, the four fields
    (Statement / Rationale / Enforcement / Exceptions). Link *resolution* and organ *reachability* are
    the map gate's job (item 1), not duplicated here.
  - **A `CLAUDE.md` pointer lands the organ on the map.** An organ unreachable from the entry map is
    half-built (LAW-4); a one-line "Enforced norms" section points `CLAUDE.md` at
    `docs/principles/README.md`, so the build's guarantees sit one hop from the map. This raised
    *measured* `map_reachability` **1.4% → 6.1%** as a cascade (architecture.md, the ADR index, and
    the ADRs became reachable) — a real gain, but incidental: reachability stays measured, never gated
    ([ring 0037](0037-dither-map-gate-graft.md)), and a full reachability sweep remains later
    Metabolize work.
  - **Not ring 0028's pure-additive beachhead (as items 1–2).** The graft modifies `ci.yml` (+ the
    Principles gate step), `package.json` (+ a `check:principles` script), and `CLAUDE.md` (+ the
    pointer), and adds the organ + runner. Reversibility is *revert the graft commit → byte-identical*,
    not *remove created paths only* ([ring 0037](0037-dither-map-gate-graft.md) established this for
    the into-an-existing-host case).
- Alternatives considered:
  - **State only the plan's three** (lint / typecheck / test), leaving the two grafted gates
    undocumented. Rejected — it makes the organ's "every norm CI enforces" claim false on day one,
    *silently* (no completeness gate), and hides the grafted gates from dither's own agents.
  - **Port the Seed's `validate-principles` verbatim** (mechanism-vocabulary + link-to-an-existing
    file). Rejected — "links a file that exists" is *weaker* on dither's surface: a principle for a
    deleted `ci.yml` step still links an existing `ci.yml` and passes — the exact phantom-enforcer the
    gate must catch. The command-in-`ci.yml` check is the faithful, stronger analog, and the Seed's
    mechanism vocabulary is Seed-specific.
  - **Gate completeness too** (every `ci.yml` step must have a principle). Not built — the Seed's own
    `validate-principles` checks *soundness* (a stated principle → its enforcer is real), not
    completeness; mapping `ci.yml` steps to principles is brittle (a step's identity is its name +
    command, both mutable) and the plan's verification is the soundness direction. Completeness stays
    authorship discipline; a revisit trigger if it drifts.
  - **A generalized principles engine in the Seed**, parameterized by enforcer-surface and copied to
    every host. Not built — LAW-7 / the [ring 0016](0016-repo-fitness-generalizes-the-metric-engine.md)
    bar: generalize when a **second** host needs it. The dither runner is self-contained; recorded as
    a revisit trigger.
- Enforcement: CI gate (LAW-6). dither's [`ci.yml`](https://github.com/fliip92/dither/blob/main/.github/workflows/ci.yml)
  runs `node .seed/checks/principles-gate.ts` as a fast, install-free step beside the map and ADR
  gates. Verified this session against the committed tree: **GREEN** — all 5 principles name a command
  `ci.yml` runs; `enforcement_ratio` **null → 100%** (Seed [repo-fitness](../../.seed/checks/repo-fitness.ts),
  read-only, dither byte-identical). **TEETH** — a phantom enforcer (`pnpm nonexistent-command`), a
  missing field, a prose-only Enforcement, and a non-kebab filename each FIRE with exit 1; and — the
  real failure mode — deleting the Lint step from `ci.yml` makes `code-passes-lint` FIRE, proving the
  principle and CI must agree. The landing range `95dd09a..8a9eec1` — exactly what hosted CI judges on
  push — is **green on all three gates** (map, ADR, principles). `.seed/` sits outside dither's pnpm
  workspace (`apps/*`, `packages/*`), so `pnpm lint/typecheck/test` are unaffected. The vendored engine
  is pinned to the Seed's by being byte-identical (confirmed this session).
- Revisit-when: a **second host** needs a principles organ (the generalized-engine alternative returns
  — extract the shared plumbing, re-copy to both); dither adds a CI enforcer whose "command" is not a
  single `run:` line the parser reads (a composite or matrix step) — `ciRunCommands` grows; a
  legitimate need arises to state a norm **not yet** in `ci.yml` (the organ's "state it once its step
  exists" rule needs an escape hatch — dither's entropy ledger, seeded at graft item 4, is it);
  completeness (every `ci.yml` step has a principle) starts drifting and warrants a gate; or dither's
  `.seed/` gate count grows enough to warrant a **committed self-test harness** — today these host
  gates' fire/hold is session-verified + ring-recorded, not a committed test (the item-1/2 gap, ring
  [0038](0038-dither-adr-gate-graft.md)), priced into dither's ledger at graft item 4.
