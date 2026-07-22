# Ring 0047 — third entropy-sensing pass on dither; deeper surfaces clean, E-013 (map-completeness script) converted, E-012 (architecture.md stack drift) priced Open

- Date: 2026-07-21
- Stage: 4 — Pollination
- Raised-by: seed (the Gardener directed another sensing pass on dither; [plan 0009](../plans/active/0009-dither-metabolize.md)
  refactor track, whose default is now *sense new entropy* — [AGENTS.md](../../AGENTS.md) §"Nothing active?", SEED.md §3)
- Question: dither is byte-identical to [ring 0046](0046-dither-map-completeness-gate.md) (HEAD still
  `1274d48`, no owner commits since), and the first two passes found the surfaces they examined clean.
  So new entropy can only live in surfaces those passes did not reach, or in drift that accrues without a
  dither commit. What does the third pass find there — without manufacturing debt to look busy?
- Decision:
  - **Four surfaces the prior two passes did not audit against code were swept** (read-only, four parallel
    investigators, each finding cross-checked directly by the main agent): **ADR bodies vs code**,
    **dependency/config hygiene**, **map claims vs code** (beyond the now-gated workspace layout), and the
    **gate tooling's own consistency**. Two genuine findings; everything else held clean or genre-expected.
  - **Re-verified clean:** fitness nominal (`drift_count` 0, `enforcement_ratio` 8/8, `map_reachability`
    48.8%, `ledger_trend` +4 at entry); the **copied engine byte-identical** to the seed's canonical
    ([`repo.ts`](../../.seed/lib/repo.ts), [`validate-map.ts`](../../.seed/checks/validate-map.ts) — the
    "verbatim engine" invariant holds, no stale-copy drift); `ci.yml` fully wired (7 gate steps +
    install/lint/typecheck/test, no dead steps); **0 genuine markers/stubs** (644 raw `todo` hits all the
    phone's `todo_*` product feature), **0 `@ts-ignore`/`as any`/`: any`-in-production** (24 in test/helper,
    eslint-justified), **0 bare empty catch**; the risk register unchanged + fully accounted (2
    pending-action entries priced E-003/E-004, 3 mitigated-by-decision excluded); the ADR **index**
    consistent; **CLAUDE.md and CONTEXT-MAP.md accurate** against the code.
  - **E-013 — converted this pass (Paid).** The map-completeness gate ([ring 0046](0046-dither-map-completeness-gate.md))
    had a `ci.yml` step but **no `check:*` script**, unlike the other six gates (`check:map`, `check:adr`,
    `check:imports`, `check:ledger`, `check:principles`, `check:gates`) — a residual of E-011 exactly as
    E-009 was a residual of E-001. Enforcement was never at risk (CI runs the gate directly via `node`), so
    the gap was local-script convention parity only. Added `check:mapcomplete` to dither's `package.json`,
    restoring one-script-per-gate parity (7 gate steps, 7 `check:*` scripts). Ungated (no fork) → converted;
    **no eighth-and-a-half principle** — a script wrapper is not a norm (`enforcement_ratio` held 8/8),
    `drift_count` held 0.
  - **E-012 — priced Open, held for the owner (not converted).** [architecture.md](https://github.com/fliip92/dither/blob/main/docs/architecture.md)'s
    stack descriptions have drifted from the built code: the Decision register's **Phone stack** (line 59)
    names `Zustand` and `react-native-unistyles`, but the phone declares neither and uses React hooks
    (`useChat` / `useBrainChoice`) + React Native `StyleSheet`; the topology (line 10) and Repo layout
    (line 30) describe the **workshop** as a `react-three-fiber` SPA, but no `three`/`react-three-fiber`
    dependency exists — the workshop renders via the shared WebGPU matrix canvas, and `react-three-fiber`
    is the *deferred* 3D-bust tech (build order step 4b) stated as current; and the package name
    `react-native-wgpu` (lines 59/100/108, ADR-0005, and the ledger's own E-003) was renamed upstream to
    `react-native-webgpu` (which `PRD.md` already uses). This is **the E-001 pattern recurring on the stack
    rows** — architecture.md, the canonical current-state map, drifted from the code. It carries an **owner
    fork** the sensing agent does not decide (grounded-or-ask, LAW-10; the [E-001 precedent](0041-dither-import-boundary-gate.md),
    which presented the fork and awaited the go rather than baking a silent assumption into a doc rewrite —
    SEED.md §5): **(A)** fix the docs to the code (recommended — the phone and workshop are built, so the
    code is the truth), or **(B)** the stated libraries are the intended decision the code should adopt
    (unlikely for a built POC). So E-012 is priced Open and held; `ledger_trend` **+4 → +5** — the one net
    new open debt, the honest reflection of a genuine finding whose conversion is owner-gated.
- Alternatives considered:
  - **Manufacture entropy to fill the (drained) structural queue.** Rejected (as in [ring 0045](0045-dither-sensing-pass-theme-layout.md)):
    a pass whose output is "deeper surfaces clean, one real fix, one real finding priced" is a valid
    metabolism. Inventing debt violates SEED.md §0/§3.
  - **Convert E-012 unilaterally (rewrite architecture.md's stack rows now).** Rejected — E-012 touches the
    **Decision register**, and which of code-or-decision is authoritative is the owner's call. The E-001
    fork precedent is exact: the seed *senses and prices* architecture.md drift and *presents the fork*; it
    does not pick truth for the owner (SEED.md §5 routes the ambiguity to a decision, not a silent lint).
  - **Price the three ADR-body discrepancies.** The ADR audit found all 9 core decisions verified but three
    aged *secondary* details: `react-three-fiber`/`three.js` named in ADR-0005/0006 (the deferred 3D bust),
    ADR-0008 citing an `app/visit/[droidId]` route, and ADR-0009 citing a `ChatErrorKind` symbol (now
    `BrainErrorKind`). **Rejected** — dither's own [`adr-gate.ts`](https://github.com/fliip92/dither/blob/main/.seed/checks/adr-gate.ts)
    documents that ADRs are *effectively append-only* decision records whose citations, valid when their
    commit landed, stay valid; a decided-but-deferred technology and aged-but-fulfilled references are what
    decision records *are*, not drift. Pricing them would manufacture entropy from the nature of ADRs.
    (Where the *same* `react-three-fiber` claim appears in the **live** architecture.md — not the ADRs — it
    **is** priced, as E-012, because architecture.md is the current-state map.)
  - **Price the `react`/`eslint` version skews.** The phone (React Native, exact-pinned `react` via
    `react-native`) and workshop (web/Vite) hold different `react` versions, and the phone runs Expo's
    eslint-9 toolchain while the root uses eslint-10. **Rejected** — separate React instances and Expo's
    pinned lint config are framework-managed realities, not pending actions (the branch-protection stance
    from ring 0045: don't price an inherited reality).
  - **Price the `console.*` usage / `eslint-disable` count.** 15 `console.*` in app source (mostly
    error-path, the parked local-brain's progress logging, and the POC digest seam) and 6 rule-scoped
    `eslint-disable`. **Rejected** — normal POC hygiene, all intentional or on error paths; not pending
    actions.
  - **Build a gate for gate↔script parity now** (E-013's class). Rejected for a single occurrence (LAW-7);
    named as E-013's Revisit candidate.
- Enforcement: **E-013** is a tooling fix (a `check:*` script wrapper) with no new gate or principle — its
  correctness is that `pnpm check:mapcomplete` runs the map-completeness gate green and the 7 gate steps
  now have 7 `check:*` scripts, verified on the tree. **E-012** is *not* converted (priced Open, owner
  fork pending). All **six** dither gates + the gates self-test are **green on the landing range
  `1274d48..8959b3e`** (dither `8959b3e`, local; push Gardener-gated): the ledger gate reads **13 entries
  all priced**, import-boundary 228 source files across 5 packages + 3 apps, map-completeness 8 workspaces
  × 3 maps, and the self-test **18/18**. dither `lint`/`typecheck`/`test` unaffected (`.seed/` is outside
  the pnpm workspace; a `package.json` script key + a ledger doc touch no product code). `ledger_trend`
  +4 → +5, `enforcement_ratio` 8/8, `drift_count` 0, `map_reachability` 48.8%. Seed-side `npm run check` +
  `npm test` + `npm run garden` green — **no seed code change** (this is dither-side metabolism over the
  verbatim engine).
- Revisit-when: the Gardener resolves E-012's fork — on **fork A**, a docs-to-code reconciliation converts
  E-012 (→ Paid; `ledger_trend` back to +4); or gate↔script parity drifts again (E-013's class recurs),
  making a "every `ci.yml` gate step has a paired `check:*` script" check a candidate invariant (LAW-7 —
  once, not now).
