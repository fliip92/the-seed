# Ring 0052 — a portable change declares its intent, or CI fails: the pollen-intent gate, the widened citation, and the backfill (E-023 paid)

- Date: 2026-07-27
- Stage: 4 — Pollination
- Raised-by: seed (the Gardener: *"fix E-023"* — the entry was sensed in-pass one unit earlier,
  [ring 0051](0051-decision-log-shape-resolved-not-assumed.md), while declaring that pass's own pollen
  intent)
- Question: the release model composes a release from **committed intent** (founding ring
  [0026](0026-pollen-boundary-versioning-lineage.md)): every change to the portable subtree declares its
  impact in [pollen/pending.md](../../pollen/pending.md), and the next version is a pure function of the
  maximum declared. Nothing enforced it. Portable-machinery changes had landed since the v0.1.0 cut
  without touching that file, so `pending.md` — the artifact whose whole job is to be the truthful
  unreleased delta — under-declared it, and the byte-exact-gated
  [pending-release notes](../generated/pending-release.md) inherited the omission and looked
  authoritative. A cut freezes that into append-only history. So: what invariant closes it, and what
  happens to the changes that already shipped undeclared?
- Decision:
  - **A new git-aware CI gate, [pollen-intent.ts](../../.seed/checks/pollen-intent.ts):** every commit
    since the last cut that touched the portable subtree must be declared in `pending.md`. Portability is
    read from the [pollen manifest](../../.seed/lib/pollen.ts) (`PORTABLE`), never a second list — the
    boundary has one definition (LAW-3), so a new file inside a portable root is covered the day it
    lands. E-023 Open→**Paid**.
  - **It asserts a STATE, not a diff — and that is the point.** Its three git-aware siblings
    (ring-append-only, release-append-only, plan-traceability) judge what a push changed and take the
    event's base ref; this gate takes **no** base ref and re-judges the whole window every run, because
    the window is fixed by the release history — the commit that added the newest
    `pollen/releases/vX.Y.Z.md` — not by the event. What that buys is precisely the protection E-023
    asked for: **a green run is the precondition for a cut**, so the cut cannot freeze an omission CI has
    already passed. A diff gate would have been cheaper and would have left every pre-existing omission
    permanently invisible.
  - **What accounts for a commit is the decision record it cites**, and the intent grammar is therefore
    **widened to `[plan NNNN]` as well as `[ring NNNN]`**. Ring 0026 wrote it ring-only; building the
    gate showed that assumption is narrower than the seed's own commit convention, which permits a
    commit to cite a plan alone (AGENTS.md § Protocols, enforced by
    [plan-traceability.ts](../../.seed/checks/plan-traceability.ts)) — and one real commit does exactly
    that (`99ecc96`, the metrics-engine fix, cites only *plan 0006*), so it could not be declared **at
    all** under the old grammar. The widening is not a loosening: the citation must still resolve to a
    record that exists, and it aligns the release model with SEED.md §6's own definition of a decision
    record as amended one unit ago (*"a plan or ring, or an ADR"*, ring 0051) — ADRs excepted, which are
    a foreign host's shape and never this seed's log. The two gates now compose: traceability guarantees
    every commit names a decision record; this gate guarantees a portable one's record is declared.
  - **The backfill: declare all eight retroactively (the entry's fork A), in this commit.** Every
    undeclared portable change since the cut is now an intent in `pending.md` with its impact class
    assigned from what it actually did, so v0.2.0 will credit **eleven** decisions instead of two. The
    fork the entry left open (declare now, or record them in the release as *"composed before the intent
    discipline was enforced"*) resolves itself the moment you try to build the second option: it requires
    a grandfather boundary living **inside portable machinery**, shipped to every descendant forever, to
    remember one mother's one-time omission — the opposite of LAW-7. Declaring costs nothing but honesty:
    `pending.md` is not append-only, it is *consumed* at the cut. The version outcome is unchanged
    (ring 0051's `minor` already set v0.2.0); what changes is that the release will describe what it
    ships.
  - **The entry priced three; git found eight.** E-023 named the three changes a reading pass had
    noticed by eye (E-012, E-016, E-019). The gate, counting what the manifest says is portable, found
    **ten** portable-touching commits since the cut, **eight** of them undeclared — the judge organ
    (ring 0030), the Stage-4 machinery residue (ring 0032), `validate-stage` (ring 0035), the work-unit
    format (ring 0036), and the fitness JSON shape (ring 0049) had all gone unnoticed. Pricing by eye
    under-read the debt by five of eight, which is the instrument-over-eye lesson of
    [E-016](../plans/entropy-ledger.md)/[E-019](../plans/entropy-ledger.md)/[E-020](../plans/entropy-ledger.md)
    recurring one more time — this time about the seed's own release history rather than a host's.
  - **It is a CI gate, not a `run-all` check.** `run-all` is a pure function of the working tree by
    construction (no git, no clock) and the content checks must stay that way; a commit's message and the
    release window are history. The pure half — the intents are well-formed and their citations resolve —
    stays in [validate-release.ts](../../.seed/checks/validate-release.ts), which now also names its
    sibling so the split is legible at both ends.
  - **It degrades, it does not guess.** Not a git repository root, or a shallow clone whose history
    omits the cut commit → skip with an explicit note, the same discipline the sibling gates use for an
    unresolvable base. A descendant that grafted the machinery but not this seed's history must degrade
    cleanly.
  - **One residue fixed in passing:** the pending-release notes closed with *"the first real cut is the
    recursive self-upgrade test"* — true when ring 0027 wrote it, stale since v0.1.0 was cut. It now
    states what the gate guarantees instead: the list above is complete against git.
  - **dither needs no mutation.** The graft copied a *scoped* engine (`.seed/lib/repo.ts`,
    `validate-map.ts`, and its six host-owned gates); it carries no `pollen/`, no release model, and
    therefore nothing for this gate to judge. The change reaches descendants that *do* carry the release
    model as part of the next release — declared, of course, as a `minor`
    [pollen intent](../../pollen/pending.md) under this ring: a descendant gains an enforcement it did not
    have.
- Alternatives considered:
  - **A diff gate on the pushed range** (*"a commit touching a portable path must also touch
    pending.md"*). Rejected — it is mechanically simpler and it never sees an omission that already
    landed, so the ten-commit backlog would have stayed invisible and a cut could still freeze it. It
    also cannot be satisfied retroactively at all: no amount of new work makes an old commit touch
    `pending.md`.
  - **Enforce it only at cut time**, inside `cut-release`. Rejected as the *primary* mechanism — it fails
    at the worst moment, when the release is being composed and the fix is eight commits of
    archaeology. The state-assertion shape means CI has already answered the question by then; that is
    strictly better than asking it once, late.
  - **Require every portable-touching commit to cite a ring** (rather than widening the intent grammar
    to plans). Rejected — it legislates a stricter commit convention than AGENTS.md states, as a side
    effect of a release-model gate, and it would leave `99ecc96` permanently non-compliant. If
    *"portable changes deserve a ring"* is a norm worth having, it belongs in its own ring, argued on its
    merits.
  - **Count only "real" portable changes** (behavior, not comments or docs inside `.seed/`/`skills/`).
    Rejected — it re-opens by hand the boundary question the manifest answers, and a `SKILL.md` edit *is*
    what a descendant receives. The impact vocabulary already carries that distinction: such a change is
    a `patch`, declared in one line, not an exemption.
  - **Leave the backfill for the Gardener at cut time.** Rejected — the entry called the backfill a
    Gardener call, but the call it named is between "declare now" and a mechanism that cannot be built
    without permanent portable grandfathering (see Decision). Declaring is reversible until the cut and
    is visible in this ring; holding would leave the gate red on `main`, which is the one state a gate
    must never land in.
- Enforcement: **CI gate + structural test.** The gate is
  [pollen-intent.ts](../../.seed/checks/pollen-intent.ts), wired into
  [seed-ci.yml](../../.github/workflows/seed-ci.yml) alongside the other git-aware gates, and it is green
  on this repository's real history (10 portable-subtree commits since `c514a6ce929b`, 11 intents). Six
  new cases in [self-test.ts](../../.seed/tests/self-test.ts) (**252** total, was 246) pin the pair that
  matters and its edges: a portable change with no intent **fails** (naming the commit, its portable
  files, and what it cites); the same change with a ring-cited intent **passes**; a plan-cited intent
  also passes (the widened grammar, the `99ecc96` shape); a non-portable change with no intent **passes**
  (the precision guard that keeps the gate from taxing local work); and a non-git tree **skips** with a
  note. The sixth is in the pure half: an intent citing a plan that does not exist is caught, the
  dangling-ring branch extended to the new vocabulary. **Test-of-the-test:** neutering the gate's
  accounting (treating every commit as accounted) turns exactly the fail case red and leaves the other
  251 green; narrowing the intent grammar back to ring-only turns the plan-cited case red **and 27
  others with it** — because this repository's own `pending.md` then holds two malformed intents, which
  is the widening being load-bearing rather than decorative. `npm run check` (14 checks) + `npm test`
  (252) + `npm run garden` (`drift_count` 0) green, and the gate itself green on real history. The
  git-aware gate set grows from four to **five**.
- Revisit-when: the **first cut after this gate** (v0.2.0) — the moment to confirm the window
  re-anchors on the new release file and the backfilled intents are consumed exactly once; or a portable
  change legitimately needs *no* intent and the vocabulary cannot express it (the pressure that would
  justify an explicit "no user-visible change" impact class rather than an exemption); or a **descendant**
  that carries the release model reports the gate firing on its own history, which is the evidence that
  the window resolution needs to handle a graft's first commit; or `pending.md` grows past the point where
  a human can read the next release from it, which is when the notes should compose by impact class rather
  than by declaration order.
