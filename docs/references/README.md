# docs/references/ — distilled external docs

Curated, agent-oriented distillations of external documentation (`llms.txt` style). When
work repeatedly needs the same external knowledge, distill it here once — a reference a
fresh agent cannot find is tribal knowledge, and tribal knowledge is entropy (SEED.md §0).

## Rules

- Each reference is one file, named for its subject (`<subject>.md`), listed below.
- State the source and retrieval date at the top — undated distillations rot silently.
- Distill, don't mirror: keep only what agents here actually need (LAW-7).
- The format is enforced by [validate-references](../../.seed/checks/validate-references.ts) (in
  `npm run check`): a **Source** line with a retrieval date (and a commit pin for a repo GitHub can
  pin), every claim cited, and the grounded/inference split (`**Seed reading:**`) present — with
  quote-match + completeness teeth where the cited corpus is saved in-repo. The [intake](../../skills/intake/SKILL.md)
  skill is how a reference is produced (grounded-or-ask; pin, don't mirror — ring [0024](../rings/0024-intake-network-free-metabolizer.md)).

## References

- [harness-engineering.md](harness-engineering.md) — distilled foundations of harness
  engineering (the discipline the seed is an instance of), metabolized from the
  [awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering)
  `Foundations` section (plan [0003](../plans/active/0003-growth.md); the first external-corpus
  intake). Grounded-or-ask: every claim cites its source, every seed-connection is marked as
  inference.
