# Ring 0033 — dither grill: canonical map, decision record, context-doc coverage, skills coexistence

- Date: 2026-07-18
- Stage: 4 — Pollination
- Raised-by: seed
- Question: The Stage 4 Grill of the first external host, dither (SEED.md §4 step 2), surfaced
  four seed-organ decisions the Scout ([assessment 0002](../assessments/0002-dither.md)) left to
  the owner — none answerable by the seed alone, each gating a graft lint:
  - Which file is dither's canonical entry map, given both a root `CLAUDE.md` and
    `apps/phone/AGENTS.md` exist?
  - Between nine in-repo ADRs and external GitHub Issues, which is the authoritative decision
    record commits must cite?
  - `CONTEXT-MAP.md` names six contexts with two `CONTEXT.md` written (a stated lazy convention)
    — enforce coverage or leave it lazy?
  - dither vendors `mattpocock/skills` into `.agents/skills/` (pinned) — how do the seed's skills
    coexist?
- Decision:
  - **Canonical map: root `CLAUDE.md`.** The seed teaches `map_reachability` dither's filename
    rather than imposing `AGENTS.md` (method, not dogma) — the concrete target for
    [E-016](../plans/entropy-ledger.md).
  - **Authoritative record: ADRs; commits cite ADRs.** In-repo and `git ls-files`-verifiable;
    Issues remain for work-tracking, not traceability.
  - **Context coverage stays lazy.** A context earns a `CONTEXT.md` only when needed; the
    dead-link gate ensures any *referenced* one resolves. No coverage gate.
  - **Skills: separate and namespaced.** The vendored library stays authoritative and pinned; the
    seed installs its skills in a separate path and excludes `.agents/skills/` from its own
    reachability/drift gates.
- Alternatives considered:
  - Map: a new root `AGENTS.md` (rejected — imposes a foreign filename on a well-tended host);
    `README.md` (rejected — the human front door, not the agent entry).
  - Record: Issues authoritative (rejected — no in-repo gate can verify an external citation);
    both (rejected — the issue half is only format-checkable, weaker).
  - Coverage: require all six before graft (rejected — ceremony a lazy, honest host does not need).
  - Skills: merge into `.agents/skills/` (rejected — collides the seed's skills with a pinned
    vendored library); unpin and interleave (rejected — presumes a divergence the owner has not
    chosen).
- Enforcement: CI gate / lint — each decision seeds a graft lint (the reachability + dead-link gate
  measuring from `CLAUDE.md`, paying [E-016](../plans/entropy-ledger.md); the commit→ADR
  traceability gate; the gate-scoping that excludes `.agents/skills/`), built at the Graft step
  (SEED.md §4 step 4) and gated on the owner's approval of the Propose step (step 3). Recorded
  doc-only in the interim and distilled into [docs/architecture/dither.md](../architecture/dither.md).
- Revisit-when: dither renames or consolidates its map; adopts an in-repo issue log (making Issues
  citable); a context's missing `CONTEXT.md` causes real confusion; or dither forks
  `mattpocock/skills` (unpinning it).
