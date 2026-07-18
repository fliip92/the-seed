# judge

The seed's first **inferential** control (ring
[0030](../../docs/rings/0030-inferential-control-judge.md);
[E-013](../../docs/plans/entropy-ledger.md)). Every other control the seed owns is a deterministic
structural gate in [.seed/checks/](../../.seed/README.md) — a *computational* control. Those catch
*fabrication* (a broken link, a stale path, a quote nowhere in its source) but they cannot judge a
*behavioral* property: whether an agent's synthesis stayed **faithful** to its source, whether a grill
elicited completely, whether a generated doc quietly over-claimed. That is what a judge is for — an
**LLM-as-judge** that scores an artifact against a stated [rubric](rubrics/faithfulness.md).

judge is one of the **intake family** — skills sharing one engine (*assemble grounded context → judge
→ record → the Gardener ratifies*): [intake](../intake/SKILL.md) points it at external sources,
[grill-the-gardener](../grill-the-gardener/SKILL.md) at architecture; judge points it at an
already-composed artifact and asks *is this faithful?* Like [feedback](../feedback/SKILL.md) and
intake, it **composes but does not commit** — the agent proposes a verdict; the Gardener ratifies
(SEED.md §5; ring [0021](../../docs/rings/0021-feedback-composes-upstream-issue.md)).

**The seed carries no model.** The judgment is probabilistic, so the model call is a **host act
outside the genome**, never baked into the machinery — the seed is network-free and zero-dependency
(rings [0002](../../docs/rings/0002-germination-implementation-defaults.md) /
[0024](../../docs/rings/0024-intake-network-free-metabolizer.md)), and a probabilistic call inside
`run-all` would break CI reproducibility. What the seed owns is the **deterministic envelope**: it
assembles the pinned inputs, and it gates the recorded verdict. This is the design's whole idea — *a
deterministic envelope around a probabilistic core* — the honest way to make an inferential control
legible and enforceable (LAW-2) without pretending it is deterministic.

## When to run

- An inferential artifact has landed or changed and its **faithfulness** is a claim, not a checked
  fact — most naturally a [distilled reference](../../docs/references/README.md) (intake's output),
  where validate-references proves provenance and quote-match but the paraphrase's faithfulness is the
  residual it explicitly leaves to the judge.
- You edited an already-judged artifact: `npm run check` now **fails** on the stale verdict (its pin
  no longer matches). Re-judge to clear it — a stale verdict is trust taken on faith (LAW-6).
- **Not** for an artifact a computational control already fully covers — a
  [generated](../../docs/generated/README.md) artifact is byte-exact-regenerated, so its faithfulness
  to its sources is guaranteed by construction, not judged.

## The loop

Four steps, each leaving a trace. The worked example is the standing verdict on
[harness-engineering.md](../../docs/references/harness-engineering.md), intake's own scout.

1. **Assemble.** `node .seed/checks/judge.ts prepare <artifact> --rubric faithfulness [--source
   <path>]`. It reads the artifact, the [rubric](rubrics/faithfulness.md), and — when the source is an
   in-repo file — the source; computes each one's content **pin** (a `sha256:` prefix); and prints the
   exact judge prompt plus a verdict **skeleton** with the pins and paths already filled. The helper
   writes nothing (its verification is that it is side-effect-free).
2. **Judge.** The host model reads *only* the assembled prompt — the artifact, its source, the rubric —
   blind to how the artifact was composed, so it is a fresh, rubric-scoped judgment, not self-judgment.
   It scores on the [1–5 scale](rubrics/faithfulness.md) and justifies the score concretely, citing the
   claims that earned or lost points.
3. **Record.** Fill the skeleton — the Score and the ## Rationale, leaving the pins and paths untouched
   — and land it as `docs/judgments/NNNN-<slug>.md` (numbered like rings). The verdict **pins its
   inputs** (artifact + source content hashes, the rubric version, the judging model, the date) so it
   is reproducible enough to trend (LAW-9): the dated, scored files *are* the trend record.
4. **Ratify.** The verdict is a proposal (compose-not-commit). The Gardener reads the rationale and
   ratifies; a low score is a finding to act on (re-metabolize the artifact), not a gate that blocks
   `main` on a probabilistic number.

## Verification (LAW-6)

A capability that cannot prove it worked is a claim. judge is controlled on two surfaces — the split
the whole design turns on:

- **The envelope (computational, gated).**
  [validate-judgments](../../.seed/checks/validate-judgments.ts) runs in `npm run check` and gates every
  verdict deterministically: well-formed (a score in range, a rationale, every pin present), pins resolve
  (the artifact + source exist, the rubric + version are known), and **fresh** — the pinned artifact hash
  equals its current content. A **stale** verdict fails `run-all`: the thing it judged changed, so the
  verdict must be re-earned. The [judge CLI](../../.seed/checks/judge.ts)'s side-effect-freeness and the
  envelope's violation classes are pinned by the self-tests (`npm test`, the E-007 harness).
- **The judgment (inferential, not gated).** The score itself is *not* mechanically enforced — that is
  the honest limit of an inferential control (ring 0011's advisory posture; LAW-2 without pretending
  determinism). Its controls are the rubric (a stated standard, so the judgment is legible and
  reproducible enough to trend) and compose-not-commit + Gardener ratification (the human on the loop).

The model — the verdict schema, the [rubric registry](../../.seed/lib/judge.ts), the content hash,
staleness, and the pinned-prompt renderers — lives once in
[.seed/lib/judge.ts](../../.seed/lib/judge.ts), read by the validator, the CLI, and this skill (LAW-3),
so what a verdict *is* cannot drift between them.
