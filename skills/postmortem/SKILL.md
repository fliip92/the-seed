# postmortem

A failure is food (SEED.md §0: *failures nobody owns* are entropy). When something breaks —
a check that should have fired and didn't, a wrong assumption baked into code, a run that
flailed — you do not just fix it and move on. You **metabolize** it into three artifacts,
never one (SEED.md §4, Stage 2):

1. **The fix** — the change that resolves the immediate failure.
2. **The invariant** — the rule that prevents its recurrence, *made enforceable*. "When
   something fails, the fix is never 'try harder' — it is always a missing capability, made
   legible and made enforceable" (LAW-2). A lint, a structural test, a CI gate, a principle:
   something mechanical, so the same failure cannot recur silently.
3. **The ring** — the decision trail: why it failed, why this fix, why this invariant, so the
   question stays retired (LAW-10).

One artifact is a patch. Three is a repository that gets harder to break over time. The
output is one **postmortem entry** at
[`docs/postmortems/<NNNN>-<slug>.md`](../../docs/postmortems/README.md) that links all three.

## When to run

- **A check missed something it should have caught** — a validator that didn't fire, a gate a
  change slipped past. The fix is the change; the invariant is the tightened check *plus its
  self-test* (a validator that does not fire on its class is doc-only enforcement in costume);
  the ring records why the class was missed.
- **A wrong assumption surfaced in code or docs** — drift, a boundary violation, a stale
  reference that caused real confusion. Convert it (SEED.md §0) and write it up.
- **A run flailed** — you struggled, backtracked, or asked something a ring already answered.
  *When you struggle, that is data* (SEED.md §3): what tool, guardrail, or document was
  missing? The invariant grows it.

Not every fix needs a postmortem — a one-line typo does not. A postmortem is for a failure
worth preventing structurally: one whose *class* could recur.

## The three artifacts

Work them in order; the entry is complete only when all three exist and are linked.

1. **Fix it.** Make the change that resolves the failure and land it (traceably — the
   [traceability gate](../../.seed/checks/plan-traceability.ts) already requires a plan/ring).
   In the entry, `Fix:` links the changed artifact, or the plan/ring that carried it.
2. **Prevent it.** Ask the LAW-2 question: *how would CI catch this next time?* Build that —
   an [invariant](../../docs/principles/README.md), a check, a self-test — and ship its own
   verification (LAW-6). `Invariant:` names the mechanism in an `Enforcement:` clause and links
   the enforcing artifact. If the honest answer is *no mechanical enforcement is worth it yet*,
   say so (`doc-only`, justified) and price the residual into the
   [entropy ledger](../../docs/plans/entropy-ledger.md) — an unenforced rule is itself entropy.
3. **Record it.** Cut a [ring](../../docs/rings/README.md) recording the decision trail, and
   link it from `Ring:`. The ring is the *why*; the postmortem is the *what happened, and the
   three things it produced*.

## The artifact

Write the result to `docs/postmortems/<NNNN>-<slug>.md` in the format
[docs/postmortems/README.md](../../docs/postmortems/README.md) defines and
[`.seed/checks/validate-postmortems.ts`](../../.seed/checks/validate-postmortems.ts) enforces:
a `# Postmortem NNNN — <title>` title (next free number), `- Date:`, `- Stage:`, `- Failure:`,
and the three linked artifacts `- Fix:`, `- Invariant:`, `- Ring:`. Links are local markdown
links so they live in the graph the [map](../../AGENTS.md) walks.

## Verification (LAW-6)

A skill that cannot prove it worked is a claim, not a capability. The entry is verified
structurally by
[`.seed/checks/validate-postmortems.ts`](../../.seed/checks/validate-postmortems.ts) (part of
`npm run check`), which binds every postmortem: sequential filename and matching title (the
ring-numbering discipline), all six fields present with a real `Date`, and — the load-bearing
rule — **all three artifacts linked**: the `Fix` links a change, the `Invariant` names an
enforcement mechanism *and* links the artifact that enforces it, and the `Ring` links an
**existing** ring. A postmortem that fixes without preventing, or prevents with only prose,
fails. The check's own firing is pinned by
[`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts) (`npm test`) with the
machinery's temp-copy methodology: a valid linked entry passes, and a missing field, an
unlinked fix, an invariant that names no mechanism, an invariant with no link, a
non-ring `Ring` link, a title/number mismatch, a bad filename, and a duplicate and a gap in
numbering are each seeded and proven to fire with a law-naming message. Ring
[0017](../../docs/rings/0017-postmortem-three-artifacts-linked.md) records the build decision.
