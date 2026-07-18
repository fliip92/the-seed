# Ring 0030 — the inferential-control instrument: a compose-not-commit judge whose probabilistic verdict rides in a deterministic, staleness-gated envelope

- Date: 2026-07-17
- Stage: 3 — Flowering
- Raised-by: seed
- Question: How does the seed grow its first *inferential* control — an LLM-as-judge that scores
  whether an agent's synthesis stayed faithful to its source — inside a repository whose every existing
  control is a deterministic structural gate, whose machinery is network-free and zero-dependency
  (ring [0002](0002-germination-implementation-defaults.md)), and whose CI must stay reproducible? This
  is [E-013](../plans/entropy-ledger.md), a Stage 3 → 4 gating prerequisite (plan
  [0005](../plans/active/0005-flowering.md)): the seed today can catch *fabrication* mechanically
  (validate-references' provenance + quote-match) but cannot judge *faithfulness* — whether a paraphrase
  outran what its source supports — because faithfulness is a behavioral property, not a structural one.
  The price ledger names the hard part exactly: "making a probabilistic control legible and enforceable
  (LAW-2) without pretending it is deterministic."
- Decision: Build the instrument as **a deterministic envelope around a probabilistic core** — the seed
  owns the computational shell that makes an inferential judgment legible, enforceable, and trendable,
  and never pretends the judgment itself is deterministic. Five parts, placed by the three ownership
  tiers ring [0026](0026-pollen-boundary-versioning-lineage.md) fixed:
  - **The judge is a compose-not-commit skill, performed by the host's model — the seed bakes in no LLM
    client.** [skills/judge/SKILL.md](../../skills/judge/SKILL.md) (portable method) points the
    intake-family engine — *assemble grounded context → judge → record → the Gardener ratifies* — at an
    already-composed artifact. The model call is a **host act outside the genome**, the exact boundary
    ring [0021](0021-feedback-composes-upstream-issue.md) drew for feedback ("the genome composes, a
    host performs the outward act") and ring
    [0024](0024-intake-network-free-metabolizer.md) drew for intake (network-free; it never fetches). So
    the seed carries **no** API client, no secret, no network call in `run-all` — the zero-dependency
    clause and CI reproducibility are preserved, and the instrument stays harness-portable (SEED.md §8:
    the genome outlives any given harness). The judge is given **only the pinned inputs** — the artifact,
    its source, and the rubric — blind to the composing context, so it is a fresh rubric-scoped judgment,
    not self-judgment.
  - **The rubric is a portable, versioned natural-language artifact.**
    [skills/judge/rubrics/faithfulness.md](../../skills/judge/rubrics/faithfulness.md) states the first
    rubric — criteria, a 1–5 scale, and what each score means — versioned so a verdict pins *which*
    rubric it was judged against. A rubric is method every descendant should judge the same way, so it
    lives with the skill (portable), not in local history; this is the field's own advice — "externalize
    control logic as portable natural-language artifacts"
    ([harness-engineering.md](../references/harness-engineering.md)) — applied to the seed's first
    inferential control.
  - **The verdict pins its inputs so it is reproducible enough to trend (LAW-9).** Each judgment is one
    dated file in [docs/judgments/](../judgments/README.md) (local history — each seed judges its own
    artifacts), pinning the artifact judged (path + content hash), the source (path + hash, when
    in-repo), the rubric (name + version), the model that judged, the date (a recorded fact, ring
    [0020](0020-onboard-human-generated-briefing.md)), the score, and the rationale. The dated, scored
    files **are** the trend record — LAW-9 is met by the judgments accumulating over time, not by a new
    fitness metric.
  - **The envelope is a deterministic run-all gate; the score never is.**
    [.seed/checks/validate-judgments.ts](../../.seed/checks/validate-judgments.ts) (in `npm run check`)
    hard-gates the *envelope*: every verdict is well-formed (a score in the rubric's range, a rationale,
    every pin present), its pins resolve (the artifact + source exist, the rubric + version are known),
    and it is **fresh** — the pinned artifact hash equals the artifact's current content. A **stale**
    verdict (the artifact was edited after it was judged) **fails** `run-all`: a probabilistic control's
    worst failure is a stale verdict silently trusted, and freshness is a deterministic property, so the
    envelope kills exactly that. The probabilistic **score is never a gate** (no "fail if score < 4") —
    hard-gating a probabilistic number would pretend it is deterministic, the precise error E-013 warns
    against. Coverage (which artifacts carry a verdict) is **advisory**, surfaced in the summary, not
    hard-required — the drift-signal posture of ring [0011](0011-drift-advisory.md).
  - **A side-effect-free CLI assembles the pinned prompt.**
    [.seed/checks/judge.ts](../../.seed/checks/judge.ts) (`npm run judge`, out of `run-all`) — verb
    `prepare <artifact> --rubric <name> [--source <path>]` reads the pinned inputs, computes their
    hashes, and prints the exact judge prompt plus a verdict skeleton for the host model to fill.
    Writing the verdict is the agent's compose-not-commit act; `prepare` writes nothing, so its
    verification is that it is side-effect-free (the cut-release / graft / feedback dry-run shape).
  - **One model, three readers (LAW-3).** [.seed/lib/judge.ts](../../.seed/lib/judge.ts) is the single
    source of truth — the verdict schema, the rubric registry, the zero-dependency content hash (node's
    `createHash`, a builtin), staleness, the score scale, and the prompt/skeleton renderers — read by
    the validator, the CLI, and the skill, so what a verdict *is* cannot drift between them. All of
    `skills/` and `.seed/` are portable subtrees (ring 0026), and `docs/judgments/` sits under the
    already-`local` `docs/` tree, so the boundary needs no manifest change — the instrument is portable
    by construction and a descendant judges with its own copy.
  - **Intake's faithfulness residual now routes to the judge.** [intake](../../skills/intake/SKILL.md)
    and [grounded-or-ask](../principles/grounded-or-ask.md) said the faithfulness residual was held
    doc-only, deferred to E-013; it now has its instrument. The two surfaces compose: validate-references'
    structural teeth catch fabrication, the judge scores faithfulness. The standing evidence (LAW-6) is a
    real faithfulness verdict on [harness-engineering.md](../references/harness-engineering.md), the loop's
    own scout.
- Alternatives considered:
  - **Bake an LLM API client into a run-all check (call the model in CI).** Rejected: it violates the
    zero-dependency clause (ring 0002), the network-free posture (ring 0024), and CI reproducibility, and
    needs a secret — a flaky, rate-limited, or absent judge would break `main` on a green change. The
    model call belongs to the host, not the genome (ring 0021).
  - **Hard-gate the score (fail `run-all` when a verdict scores below a threshold).** Rejected: it
    pretends a probabilistic verdict is deterministic — exactly what E-013's price forbids — and lets a
    flaky judge block a correct change. The envelope is gated (freshness/well-formedness are
    deterministic); the score is trended and, if low, surfaced for the Gardener (ring 0011's advisory
    posture).
  - **A seventh SEED.md §6 fitness metric for inferential coverage.** Rejected for v0: the six-metric
    interface, the dated history-snapshot schema, and repo-fitness (a foreign repo has no judgments)
    would all ripple, and a metric whose value is one until the second rubric lands is premature. The
    dated verdict files are the trend; first-classing coverage as a metric is a Revisit-when.
  - **Carry the rubric in local history (`docs/`) or as a hidden `.ts` string.** Rejected: a rubric is
    portable method (every descendant judges the same standard) and must be legible and readable by the
    CLI, so it lives as a real, reachable file with the skill (portable) — not buried where the map
    cannot reach it, and not duplicated between prose and code.
  - **Let the composing agent judge its own output.** Rejected: self-judgment inside the composing
    context is weak. The judge is handed only the pinned inputs, blind to how the artifact was written —
    a fresh, rubric-scoped evaluation.
- Enforcement: structural test — [.seed/checks/validate-judgments.ts](../../.seed/checks/validate-judgments.ts)
  runs in `run-all` (`npm run check`) and gates the verdict envelope: a malformed verdict, an
  out-of-range score, a missing rationale, a dangling pin (artifact/source/rubric absent), an
  unknown rubric or version, or a **stale** verdict (pinned hash ≠ current content) fails with a
  law-naming remediation message; coverage is reported advisorily, not gated (ring 0011). The
  probabilistic judgment itself is **not** mechanically gated — that is the honest limit of an
  inferential control (LAW-2 without pretending determinism), and the compose-not-commit skill +
  Gardener ratification is its human-on-the-loop half. The CLI's side-effect-freeness and the
  envelope's violation classes are pinned by the self-tests (`npm test`, the E-007 harness, LAW-6).
- Revisit-when: a second rubric is needed (e.g. elicitation-completeness for
  [grill-the-gardener](../../skills/grill-the-gardener/SKILL.md), or PRD-fidelity for the deferred PRD
  sibling) — add it to the rubric registry in `.seed/lib/judge.ts`, which exists precisely so a new
  rubric needs no rework; OR inferential coverage proves worth first-classing as a SEED.md §6 fitness
  metric; OR intake phase 2 (fetching, ring 0024) lands and external sources become in-repo, widening
  the domain where faithfulness is judgeable against a saved source; OR the harness gains a native,
  reproducible model-call capability, at which point the assumption behind compose-not-commit expires
  (the "controls expire — design them to be removed" reading,
  [harness-engineering.md](../references/harness-engineering.md)) and the boundary can move.
