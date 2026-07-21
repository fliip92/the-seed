# Ring 0043 — map_reachability counts knowledge artifacts, not all files

- Date: 2026-07-20
- Stage: 4 — Pollination
- Raised-by: seed (the E-007 map-reachability-sweep pre-flight on dither, [plan 0009](../plans/active/0009-dither-metabolize.md) refactor track). The pre-flight surfaced three options; the Gardener chose the direction ("scope the denominator to docs").
- Question: `map_reachability` (SEED.md §6) was computed over every tracked file
  (`reachableCount / files.length`). On the seed — almost entirely `.md` plus machinery indexed by
  `.seed/README.md` — that reads a true 100%. But the E-007 sweep pre-flight measured it on dither and
  found it **structurally floored**: 283 of dither's 386 tracked files are source code, which the doc
  map is not answerable for, so the fraction caps near ~15% however well the docs are tended — linking
  every stranded dither doc moves it only 11.9% → ~15%. The one metric meant to prove doc-gardening
  value on a host (the pollination before/after) had gone nearly insensitive to doc gardening. Should
  the denominator be rescoped, and how?
- Decision:
  - `map_reachability` counts only **knowledge artifacts** — markdown docs (`.md`, which is every agent
    map). `analyzeReachability` now derives `reachableCount` / `knowledgeTotal` (and thus the fraction)
    from the `.md` files reachable ≤3 hops from the map, not from `files.length`. Source and config are
    navigated by code tooling, not the doc map, so their count no longer floors the metric.
  - Scoped over docs the number becomes a real navigability signal. The **seed reads 100% (94/94
    docs)** — unchanged in value, denominator narrowed from 139 files to 94 docs. **dither reads 11.9%
    → 32.9% (28/85 docs)** the moment the rescoped engine is re-copied (source out of the denominator),
    the honest doc-navigability the E-007 gardening then raises toward ~48% (linking dither's own
    stranded docs; the residual is 43 vendored `.agents/skills/*.md` + a test fixture — see Revisit).
  - **The GATE is untouched.** Only the reported metric (the `fraction` and the two counts it reports)
    is rescoped; the unreachable-file VIOLATIONS still fire over every non-covered file. So each host
    keeps exactly its own reachability policy: the seed's `validate-map` GATE still enforces **total**
    reachability over every tracked file (a stray unreachable `.ts` still fails the seed's CI), and
    dither still gates only broken links and measures the rest. Metric and gate now answer different
    questions — "what fraction of the docs are navigable" vs "is anything stranded" — and decoupling
    them is what lets one comparable number survive on a product repo that can never gate total
    reachability.
  - This is the [E-016](../plans/entropy-ledger.md) lineage — a Scout instrument systematically
    under-reading a real host, surfaced by pointing it at one. E-016 fixed the map *filename*
    resolution (false null → measurable); this fixes the *denominator* (floored → sensitive). Priced as
    [E-019](../plans/entropy-ledger.md), paid by this ring.
- Alternatives considered:
  - **Exclude only vendored tooling (`.agents/skills/**`) from the all-files denominator, host-side in
    dither's `map-gate.ts`.** dither's 43 vendored skill docs dominate its stranded set. Rejected as
    the primary fix: it is dither-local (helps no other host, not the seed's own metric) and leaves the
    deeper flooring (283 source files) in place — dither would still read ~13–15%. Knowledge-artifact
    scoping is the general fix; the vendored-`.md` residual it leaves is a smaller, separate question
    (Revisit-when), not folded in here to keep this change one idea.
  - **Garden only, leave the metric.** Link dither's stranded docs and accept ~15%, documenting the
    metric as source-floored by design. Rejected: it abandons the metric's purpose (proving pollination
    value) rather than fixing the definition — SEED.md §6 says the metric that stops tracking real
    health gets replaced, and this one had.
  - **Redefine the denominator per-repo (e.g. exclude by extension list).** Rejected as fiddly and
    non-portable; `.md` is exactly the set the BFS already traverses (`file.endsWith('.md')`), so
    scoping to it aligns the metric with the graph it is computed over — one honest definition (LAW-3).
- Enforcement: structural test — [self-test.ts](../../.seed/tests/self-test.ts) gains a case pinning
  that an unreachable **non-doc** file (a stranded `src/orphan.ts`) leaves `map_reachability` at 1.0,
  the twin of the existing unreachable-`.md`-drops-it-below-1 case; the two together fix the denominator
  as docs-only. SEED.md §6's one-line metric definition is updated to match ("% of files" → "% of
  knowledge artifacts (docs)"). `npm run check` + `npm test` green.
- Revisit-when: a host carries substantial knowledge in a non-`.md` doc format (`.mdx`, `.rst`,
  `.adoc`, `.ipynb`) — the metric under-counts it, so extend the knowledge-artifact predicate then; or
  the vendored-doc residual bites (dither's 43 `.agents/skills/*.md` are counted as stranded, halving
  its reading) — if worth excluding, price it and decide separately, host-side, rather than widening
  this metric change.
