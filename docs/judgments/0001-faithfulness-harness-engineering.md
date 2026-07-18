# Judgment 0001 — faithfulness of docs/references/harness-engineering.md

- Rubric: faithfulness v1
- Artifact: [docs/references/harness-engineering.md](../references/harness-engineering.md) — content sha256:9a1c0d61e3addfe7
- Source: external — the 29 corpus sources are not mirrored in-repo, so unpinnable (ring 0024); judged on what is checkable network-free
- Model: claude-opus-4-8
- Date: 2026-07-17
- Score: 4 / 5

## Rationale

The standing evidence the judge works, produced on intake's own scout. Judged network-free: the
corpus's 29 sources are external and not in context (the ring-0024 boundary), so this scores what a
judge *can* check without the sources in hand — over-claiming beyond cited framing, the honesty of
the grounded/inference split, and internal consistency — and names the one criterion it cannot close.

**What earns the score.**

- **Criterion 2 (honest grounded/inference split) — strong, the artifact's core discipline.** Every
  seed-specific inference is a marked `**Seed reading:**` sub-bullet, structurally separated from the
  source's own claim, without exception — the computational/entropy/context-engineering mapping onto
  the seed's own organs, the "assumption-expiry is the ring's Revisit-when field" reading, the
  "seed has only computational controls" reading that surfaced E-013 itself. No inference is smuggled
  in as a source's words. This is the strongest faithfulness property in the document.
- **Criterion 1 (no claim outruns its source) — holds structurally.** Every field claim is attributed
  to a named source and framed as *that source's* claim, not asserted as universal truth; the four
  Design-principles claims, the portability thesis, and the evals claim each carry their citation and
  their source's framing.
- **Criterion 5 (internal consistency) — holds.** The Böckeler computational-vs-inferential-controls
  distinction threads coherently into the E-013 framing and the "the seed has only computational
  controls" reading with no contradiction; the four-elements and three-interlocking-systems framings
  do not collide.

**Why 4 and not 5 — the blemish, which is a boundary limit, not a fabrication.**

- **Criterion 3 (no fabricated specificity), unverifiable network-free.** The artifact carries crisp
  quantitative claims — "harness-only changes moved agents 20+ ranking positions without swapping the
  model", "harness setup alone can swing benchmarks 5+ points", the Azure SRE agent's "Intent Met"
  45%→75%. Each is cited to a specific source, so none is *invented by the seed*; but each is stated
  more crisply than a research finding usually warrants, and — the sources being external and not
  mirrored — a judge cannot verify the figures were transcribed faithfully from their originals. This
  is precisely the residual the judge exists to surface and the residual it cannot fully close without
  the source in context. A couple of one-sentence compressions ("Reliability is a harness problem, not
  only a model one") read slightly stronger than a hedged abstract would, though they stay attributed.

**Net.** Faithful with a minor blemish: the split is honest, nothing over-claims beyond its cited
framing, and the document is internally consistent — the only real gap is unverifiable external
specificity, a network-free boundary limit (ring 0024), not a misrepresentation. To reach a 5 the
quantitative claims would need their sources in context to verify against — which is intake phase 2
(fetching), at which point the judge's faithful-judgment domain widens (ring 0030's Revisit-when).
This verdict is a proposal; the Gardener ratifies (compose-not-commit, SEED.md §5).
