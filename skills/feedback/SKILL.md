# feedback

Open an issue **upstream** against the mother seed, from any repository (LAW-11; SEED.md §7).
A descendant repo that learns something about the *method* — a defect in the genome, a rough
edge, a missing capability, a proposed invariant — sends that learning back, so the mother seed
accumulates it and carries it out in the next pollen release. Forks are lineages, not defections:
their learnings flow home.

The genome ships only the **composer**: given a learning, it composes a well-formed upstream issue
(a title, a body, and the parent it is addressed to) and emits the exact `gh issue create` command
a human runs to post it. **It never posts** — and "without posting" is not a flag the tool declines
to pass, it is a capability the genome does not contain. Posting an upstream issue needs a network,
auth, and a live upstream (host-specific mechanics the genome keeps out — the
[parallel-worktrees](../parallel-worktrees/SKILL.md) "boot lives in host adapters" line, SEED.md §4)
and it is an outward-facing publish the Gardener gates (LAW-1). So the tool composes; a human posts,
with the emitted command, once they approve.

## When to run

- You are working in a **descendant** repo (a host carrying the seed) and you sense a unit of
  entropy about the *seed itself* — the genome is wrong or unclear, a skill has a gap, a lint's
  message misleads, the method has friction. That is upstream feedback (LAW-11).
- The test for *upstream vs. local*: does the learning **generalize beyond this one host**? If yes,
  it belongs against the mother seed. If it is only about this host's own code, it is a local ring
  or ledger entry — not feedback. The composer makes you state that generalization; a learning that
  can't be stated as generalizing is not upstream.
- **Not** for a learning at the root. Run in the mother seed (a root seed with no recorded parent)
  and the tool refuses: feedback flows *upstream*, so a learning about the method here is a
  [ring](../../docs/rings/README.md) or a [ledger entry](../../docs/plans/entropy-ledger.md), not an
  issue to yourself.

## The learning

A well-formed upstream issue states five things — the composer requires all of them, and rejects an
incomplete learning (a well-formed issue is the whole point of the verification):

- **kind** — one of `defect`, `friction`, `capability-gap`, `proposal` (a closed vocabulary the
  mother seed triages on).
- **title** — a concise summary.
- **observation** — what happened.
- **generalizes** — why it belongs upstream, not in a local ring (the LAW-11 test above).
- **conversion** — the product you propose the mother seed weigh: one of SEED.md §0's four —
  `invariant`, `ring`, `priced-debt`, `deletion`.

## Lineage

The issue is addressed to the descendant's **parent** (the mother seed), and carries its lineage —
`seed version, parent, date planted` (SEED.md §7). The composer reads that from the target repo's
`lineage.json` (in `pollen/`) when present (a host records it at Independence, SEED.md §4 step 6). When it
is absent — a pre-Flowering host, or an ad-hoc run — pass `--parent <owner/repo>`; the unknown
fields degrade honestly to `unrecorded` (stated, never fabricated — the
[ring 0020](../../docs/rings/0020-onboard-human-generated-briefing.md) no-wall-clock discipline, so
a given learning composes byte-identically).

## The tool

[`.seed/checks/feedback.ts`](../../.seed/checks/feedback.ts) owns the composer
(`npm run feedback -- dry-run …`). Like [repo-fitness](../repo-fitness/SKILL.md) it runs against any
repository and is strictly read-only; like [parallel-worktrees](../parallel-worktrees/SKILL.md) it
is self-verifying and lives outside `run-all.ts` (it reads arbitrary targets, not the seed's own
tree), reached through the map.

```bash
npm run feedback -- dry-run <descendant-repo> \
  --kind capability-gap \
  --title "Grill step needs a timeout" \
  --observation "The interview never terminated on an evasive owner." \
  --generalizes "Any host grilling a distracted owner hits this — a method gap, not our app." \
  --conversion ring
# add --parent owner/repo when the target has no pollen/lineage.json; add --json for the envelope
```

It prints the composed issue and the `gh issue create` command. **To post it** (a human step, once
the Gardener approves): save the printed body to a file and run the emitted command. Exit 0 = a
well-formed issue was composed; 1 = it could not be (an ill-formed learning, or no upstream to
address — the message says which); 2 = a usage error.

## Verification (LAW-6)

A skill that cannot prove it worked is a claim, not a capability. The composer is its own
verification, pinned by [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts) (`npm test`)
with the machinery's temp-copy methodology and the same three-binding shape repo-fitness and
parallel-worktrees use:

- **It works.** A descendant's complete learning composes a well-formed issue addressed to its
  parent, with the **exact ordered section set** (Lineage, Kind, What happened, Why this is
  upstream, Proposed conversion — pinned so none can be silently dropped or renamed), the
  `[seed-feedback]` title, the descendant's lineage, the not-auto-posted footer, and a post command
  naming the parent — and composition is **deterministic** (the same learning composes
  byte-identically).
- **Its validation has teeth.** A learning missing a required field, an out-of-vocabulary `--kind`,
  an out-of-vocabulary `--conversion`, a malformed `lineage.json` (in `pollen/`), and a **root seed with no
  parent** each exit 1 with a legible, LAW-naming reason — a composer that waved an ill-formed
  learning through would produce exactly the malformed issue "well-formed" exists to forbid (LAW-2).
- **It is side-effect-free.** Composing against a target leaves it byte-identical (tree hash, git
  HEAD, and status unchanged — the repo-fitness non-mutation proof) and **posts nothing**: the post
  command is emitted as text, never run. That is the sharp reading of "without posting".

Ring [0021](../../docs/rings/0021-feedback-composes-upstream-issue.md) records the build decision:
the genome ships the composer, posting is a Gardener-gated host act outside it, and a side-effect-free
dry-run is the verification.
