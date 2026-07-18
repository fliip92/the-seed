# Rubric: faithfulness (v1)

Does a distilled or generated artifact stay **faithful** to its source — or did the paraphrase
outrun what the source actually supports? This is the residual
[grounded-or-ask](../../../docs/principles/grounded-or-ask.md) names and the machinery cannot
compute: provenance and quote-match catch *fabrication* structurally, but *faithfulness* is
behavioral — it needs a judge (ring
[0030](../../../docs/rings/0030-inferential-control-judge.md);
[E-013](../../../docs/plans/entropy-ledger.md)).

**Version 1.** The version is pinned by every verdict; changing a criterion below bumps it, so an
old verdict remains legible about which standard judged it.

## Criteria

Judge the artifact against its source on these five, weighting the first two highest:

1. **No claim outruns its source.** Every assertion the artifact makes about the field or the
   source is supported by what the source actually says. A paraphrase that quietly strengthens,
   generalizes, or sharpens a source claim beyond what the source supports is unfaithful — the
   most common and most dangerous failure, because it is fluent and plausible.
2. **The grounded/inference split is honest.** The seed's own inference connecting a source to
   itself is marked as inference (the **Seed reading:** convention), never presented as the
   source's own words. An unmarked inference smuggled in as a source's claim is unfaithful even
   when the inference is *correct*.
3. **No fabricated specificity.** No invented numbers, names, dates, quotations, or details that
   the source does not contain. A quoted span must be the source's actual words.
4. **Faithful by inclusion, not distortion by omission.** Distilling keeps only what is needed
   (that is the point), but an omission that changes the source's meaning — dropping a caveat,
   a scope limit, or a counter-point so the remaining claim reads stronger than the source — is
   unfaithful.
5. **Internal consistency.** The artifact's claims do not contradict one another or the source's
   own framing.

## Scale

Score `1`–`5`. The rationale must cite the specific claims that earned or lost points — a bare
number is not a judgment.

- **5 — Fully faithful.** Every claim is traceable to the source, the grounded/inference split is
  honest, nothing is over-claimed, nothing is fabricated. A reader could trust the artifact in
  place of the source for the distilled scope.
- **4 — Faithful, minor blemish.** One slightly loose paraphrase or an under-marked inference —
  nothing that would mislead a reader about what the source supports.
- **3 — Mostly faithful, a real gap.** At least one claim outruns its source, or an inference is
  presented as fact, in a way a careful reader could be misled by. Correctable without reworking
  the artifact.
- **2 — Partly unfaithful.** Several over-claims, some fabricated specificity, or a distorting
  omission. The artifact misrepresents its source in more than one place.
- **1 — Unfaithful.** The artifact misrepresents its source; a reader relying on it would come
  away with claims the source does not support.

## How to judge

You are handed only the pinned inputs — the artifact, its source (when in-repo), and this rubric —
blind to how the artifact was composed. Judge from that material alone; do not reach for outside
knowledge. When the source is external and not in context, judge what is still checkable: whether
the artifact over-claims beyond the framings it itself cites, whether the split is honest, and its
internal consistency — and say in the rationale that the source was not in hand. The verdict is a
**proposal**: compose it, do not commit it on your own authority; the Gardener ratifies (SEED.md
§5).
