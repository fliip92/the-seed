# intake

Metabolizing the field. When knowledge from outside — a curated link list, a paper, a blog
post, a community write-up — is worth keeping, you do not paraphrase it from memory and you
do not fetch it live: you **metabolize a copy already in front of you**, entry by entry, into
the seed's structure, under one discipline — **grounded-or-ask**: every distilled claim cites
the source it came from, and every gap the source leaves is raised as a question, never filled
with a confident guess ([grounded-or-ask](../../docs/principles/grounded-or-ask.md); SEED.md
§0, §5). This extends the seed's food supply from the entropy it senses *inside* a repo to
knowledge *from the field* — a seed that keeps learning goes out into the world sturdier than
one frozen at its planting-day knowledge.

intake is one of the **intake family** — skills sharing a single engine (*assemble grounded
context → surface the gaps as questions, never guesses → compose a proposal → the Gardener
ratifies*): [grill-the-gardener](../grill-the-gardener/SKILL.md) points that engine at
architecture; intake points it at external sources; a PRD-authoring sibling (deferred) will
point it at product intent. Like [feedback](../feedback/SKILL.md), it **composes but does not
commit** — the agent proposes, the Gardener ratifies (SEED.md §5; ring
[0021](../../docs/rings/0021-feedback-composes-upstream-issue.md)).

**Network-free (v0).** intake operates on corpus content already present in the session — a
link list or document saved into the repository, or provided in-context. It never fetches.
Pulling the underlying URLs, and saving what it pulls, is phase 2 (a deferred ring — the "the
genome composes, a host performs the outward act" boundary, ring
[0021](../../docs/rings/0021-feedback-composes-upstream-issue.md)).

## When to run

- You are holding a body of external knowledge — most naturally a curated, annotated link
  list — and the same knowledge will be wanted again by a fresh agent. A reference a fresh
  agent cannot find is tribal knowledge, and tribal knowledge is entropy
  ([docs/references/README.md](../../docs/references/README.md); SEED.md §0).
- Sensing (SEED.md §3, step 1) turned up a field source that bears on the seed's own method —
  how harnesses like it are built, an invariant worth adopting, a capability the seed lacks.
  Metabolizing it is how that source becomes structure instead of a browser tab.
- **Not** for knowledge about *this repo's own code* — that is a
  [ring](../../docs/rings/README.md) or a [ledger entry](../../docs/plans/entropy-ledger.md),
  not a distilled external reference.

## The loop

Five steps, each leaving a trace. The scout that proved this loop end-to-end is
[harness-engineering.md](../../docs/references/harness-engineering.md) (commit `6c732ff`) —
read it as the worked example.

1. **Parse.** Point at the saved corpus and split it into its **entries** — one per source (a
   link with its annotation, a paper, a section). State the corpus's own provenance up front:
   its URL, the retrieval date, and — for a source GitHub can pin — the commit it was read at.
   An undated distillation rots silently.
2. **Classify.** Sort **every** entry into exactly one outcome (below). No entry is silently
   dropped — completeness is the anti-drop guard
   ([parallel-worktrees](../parallel-worktrees/SKILL.md), [feedback](../feedback/SKILL.md)
   precedent); an entry judged not worth keeping is *discarded with a stated reason*, which is
   itself a record.
3. **Compose.** Write the distillation, carrying the grounded/inference split in the output: a
   source's own claim is stated and cited; the seed's *own* inference connecting it to the seed
   is marked **Seed reading:** — separated explicitly, never smuggled in as the source's words
   (the convention the scout established). Distill, don't mirror — keep only what agents here
   will actually need (LAW-7).
4. **Ratify.** Compose, do not commit. The distillation and any proposed rings, ledger
   entries, or skill-seeds are a *proposal*; the Gardener ratifies before it lands (SEED.md
   §5). This is v0's control over the one thing the machinery cannot yet judge — whether a
   paraphrase stayed *faithful* to its source
   ([E-013](../../docs/plans/entropy-ledger.md)).
5. **Land.** On ratification, the reference lands in
   [docs/references/](../../docs/references/README.md) and each secondary outcome in its organ;
   the reference is added to that directory's index (reachability, LAW-4).

## Classifying an entry

Every entry resolves to exactly one outcome — a closed vocabulary, so a checker can prove none
was dropped:

| Outcome | Where it lands | Note |
|---|---|---|
| `reference` | a `docs/references/<subject>.md` distillation | the primary v0 output |
| `ledger` | a priced [entropy-ledger](../../docs/plans/entropy-ledger.md) entry | a capability gap the source reveals about the seed (E-013, E-014 came out this way) |
| `ring` | a proposed [ring](../../docs/rings/README.md) | a decision the source settles or forces; v0 *may* propose, need not |
| `skill-seed` | a named seed for a future plan | the source motivates a new skill; v0 *may* propose, need not |
| `discard` | nowhere — but **with a stated reason** | out of scope, redundant, or low-value; a silent drop is the defect |

These are the shapes external knowledge takes when metabolized — a sibling of SEED.md §0's four
products of *entropy*: `ledger`→priced debt, `ring`→a ring, `skill-seed`→a future invariant,
`discard`→a deletion; `reference` is the metabolized structure itself.

## Provenance — pin, don't mirror

v0 **cites, it does not copy.** A distilled claim names its source by link, retrieval date,
and — where the source is a repo GitHub can pin — a commit. Raw corpora are not mirrored into
the repo: the references organ is *distilled, not mirrored* (LAW-7), and a dump would bloat
`map_reachability` (SEED.md §6) and demand anatomy READMEs for raw text. So a quoted span can
be machine-verified against its source in exactly one v0 case — when the cited source is
*itself an already-committed in-repo file* (the self-hosting case: intake pointed at the seed's
own docs). For an externally-pinned source, provenance (date + commit) plus completeness plus
the Gardener's ratification carry the weight; verbatim quote-checking arrives with fetching, in
phase 2 (a saved fetch *is* a mirror — both land together or not at all). Ring
[0024](../../docs/rings/0024-intake-network-free-metabolizer.md) records this decision.

## Verification (LAW-6)

A skill that cannot prove it worked is a claim, not a capability. intake's output is controlled
on two surfaces:

- **Fabrication (structural).** The distilled-reference format is bound by
  [validate-references](../../.seed/checks/validate-references.ts) — a `run-all` check
  ([plan 0004](../../docs/plans/active/0004-intake.md) scope item 3): each source line carries a
  retrieval date and, where pinnable, a commit; every distilled claim cites a source; the
  grounded/inference split is structurally present; and its teeth, where the corpus is saved
  in-repo, are **completeness** (every entry classified or discarded-with-reason — no silent
  truncation; an in-repo `discard` is recorded in the reference itself, a bullet naming the entry
  with its reason, so completeness is machine-checkable) and **quote-match** (a quoted span must
  appear in the cited saved source). It passes on the already-landed
  [harness-engineering.md](../../docs/references/harness-engineering.md) — all-external, so the
  teeth are vacuous there and provenance + citation + the split carry the weight.
- **Faithfulness (inferential).** Whether a paraphrase stays true to its source is *not*
  computationally checkable — it needs a judge the seed does not yet have
  ([E-013](../../docs/plans/entropy-ledger.md)). v0's control is
  [grounded-or-ask](../../docs/principles/grounded-or-ask.md)'s doc-only half —
  compose-not-commit plus Gardener ratification (step 4) — which keeps every unfaithful claim
  visible and gated rather than committed on the agent's authority. The judge is deferred,
  named not dropped (plan 0004 scope item 4).

The committed scout — [harness-engineering.md](../../docs/references/harness-engineering.md) —
is the standing evidence the loop already produces a faithful, useful artifact (it is what
surfaced E-013 and E-014). Ring
[0024](../../docs/rings/0024-intake-network-free-metabolizer.md) records the build decision: the
name, the pin-not-mirror provenance rule, and the closed outcome vocabulary.
