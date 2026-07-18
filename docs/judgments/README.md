# docs/judgments/ — the inferential-verdict record

The local record of every **inferential verdict** the [judge](../../skills/judge/SKILL.md) skill
produces — an LLM-as-judge's score of an artifact against a stated rubric (ring
[0030](../rings/0030-inferential-control-judge.md); [E-013](../plans/entropy-ledger.md)). This is
**local history** — each seed judges its *own* artifacts, so verdicts are never portable (the
ring-[0026](../rings/0026-pollen-boundary-versioning-lineage.md) `local` tier); the judge skill,
the rubrics, and the envelope check *are* portable, so a descendant grows its own judgments here.

The judgment is probabilistic, but its **envelope is deterministic**: every verdict below is gated
by [validate-judgments](../../.seed/checks/validate-judgments.ts) in `npm run check` — well-formed,
its pins resolve, and **fresh** (a verdict whose judged artifact changed since it was scored fails
`run-all` until re-judged). The score itself is trended, never gated (ring
[0011](../rings/0011-drift-advisory.md)); the dated, scored files here are the trend record (LAW-9).

## Format (enforced by `.seed/checks/validate-judgments.ts`)

- Filename: `NNNN-slug.md` — four digits (numbered like rings), lowercase-kebab slug.
- Title: `# Judgment NNNN — <what was judged>` (number matches the filename).
- Required bullets: `- Rubric:` (`<name> v<version>`, a registry rubric); `- Artifact:` (a markdown
  link to the judged file **plus** its `— content sha256:…` pin); `- Source:` (an in-repo link plus a
  `sha256:` pin, or `external — …` when not mirrored, ring
  [0024](../rings/0024-intake-network-free-metabolizer.md)); `- Model:` (the model that judged — a
  recorded fact); `- Date:` (YYYY-MM-DD, a recorded fact); `- Score:` (`<n> / 5`, on the rubric's
  scale).
- A `## Rationale` section justifying the score against the rubric, citing the claims that earned or
  lost points. The rationale *is* the inferential verdict — a bare number is not a judgment.

Assemble a judgment with `node .seed/checks/judge.ts prepare <artifact> --rubric <name>` (it computes
the pins and prints the skeleton); the host model fills the Score + Rationale and lands it here.
Verdicts are records that accumulate as artifacts are judged, so numbers may have gaps (they are not
an append-only decision log the way rings are); duplicates are not allowed.

## Verdicts

- [0001 — faithfulness of harness-engineering.md](0001-faithfulness-harness-engineering.md) — the
  standing evidence the judge works (intake's own scout, ring 0030).
