# Ring 0011 — Drift detection is an advisory trend signal, not a gate

- Date: 2026-07-04
- Stage: 1 — Rooting
- Raised-by: seed
- Question: The doc-gardener (plan 0002 scope item 3) detects doc↔code drift. Should a
  drift finding fail CI like a dead link does, or be reported and counted without
  blocking? Asked while building the detector; every future drift class re-asks it
  otherwise, and plan 0002 scope item 4 (wiring `drift_count` into fitness) depends on the
  answer.
- Decision: Drift detection is **advisory** — the detector
  (`.seed/checks/doc-drift.ts`) reports findings and a `drift_count`, then exits 0. It is
  not part of `run-all.ts` and does not gate `main`.
  - Rationale: drift differs in kind from the hard invariants in `run-all.ts`. A dead link
    or a malformed ring is always wrong and mechanically fixable, so it is gated. A doc↔code
    divergence is introduced continuously by ordinary editing, and reconciling it often
    needs judgment (which of two files is canonical? should the doc or the code move?) — so
    ring [0007](0007-gardening-cadence-automerge.md) digests drift on a cadence, async and
    automerged only when the fix is mechanical. A hard gate would block routine merges on
    that non-mechanical reconciliation, contradicting the cadence model. SEED.md §6 also
    reads `drift_count` as a trend to watch: a transient non-zero count — a divergence
    introduced but not yet digested — is the expected, healthy state, not a merge failure.
    (Gating is not incompatible with a metric as such — `map_reachability` is both gated and
    trended — but it is incompatible with *this* metric's continuous, judgment-laden nature.)
  - A genuine crash of the instrument still exits non-zero, so CI notices a broken
    detector — advisory covers *findings*, not *failures to run*.
  - This is distinct from the hard invariants in `run-all.ts` (a dead link, a malformed
    ring) which must never be true and are deterministically fixable. A drift class that
    proves, over time, to be always-wrong-and-mechanically-fixable may be **promoted** to
    a hard invariant in `run-all.ts` — but only via a superseding ring, never silently.
- Alternatives considered: Make stale-path-reference a hard gate in `run-all.ts` —
  rejected: it reads as a coherence invariant, but gating it prevents landing any commit
  mid-refactor that momentarily dangles a reference, and it degenerates `drift_count` to a
  constant zero (no trend to measure). Fold drift cases only into the plan's decision log
  instead of a ring — rejected: the advisory/gate split governs every future drift class
  and the fitness wiring, so it outlives plan 0002 and must be retrievable by LAW-10.
- Enforcement: structural test — [`.seed/tests/self-test.ts`](../../.seed/tests/self-test.ts)
  drift cases prove the detector fires on its violation class (exit reporting, law
  naming, precision guards) and that a pristine copy is clean; the advisory contract (the
  instrument exits 0 on findings) is asserted directly. Deliberately **not** a CI gate —
  that is the decision itself, justified above, not an enforcement gap.
- Revisit-when: A drift class is promoted to a hard invariant (cut the superseding ring),
  or fitness trends (`drift_count`) show the advisory model lets drift accumulate faster
  than the cadence digests it — at which point tighten toward gating for that class.
