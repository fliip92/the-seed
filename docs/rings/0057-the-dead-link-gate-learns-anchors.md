# Ring 0057 — the dead-link gate learns anchors: a fragment is part of the link, not decoration (E-006 paid)

- Date: 2026-07-29
- Stage: 4 — Pollination
- Raised-by: seed (AGENTS.md § Start here point 3 — the highest-interest open entry whose conversion
  path is gated on neither a stage nor the Gardener, with [E-009](../plans/entropy-ledger.md) held by
  ring [0054](0054-prose-state-rots-where-work-stops-touching-it.md) as the Gardener's call,
  [E-017](../plans/entropy-ledger.md) needing a SEED.md §6 amendment, [E-022](../plans/entropy-ledger.md)
  owner-gated on the next dither commit, and [E-018](../plans/entropy-ledger.md) deferred to a live Scout)
- Question: [E-006](../plans/entropy-ledger.md) was priced on day one of germination and pre-registered
  its own trigger — *"when fragment links first appear in real use"*. Has it fired, and if so what does
  anchor checking actually cost a zero-dependency gate that must also run against foreign hosts?
- Decision:
  - **The trigger has fired, at n=1, and the one live instance is not the shape the entry
    described.** A sweep of every tracked markdown file found exactly two fragment links. One is
    E-006's own illustrative example inside the ledger, written in backticks — the link walker blanks
    inline code spans, so it was never a claim and is unaffected. The other is real:
    [pollination-dither.md](../fitness/pollination-dither.md) links `#the-exit-criterion` into its own
    body. It resolves today, which is the *only* reason nothing has broken.
  - **There were two blind spots, not one, and the priced one was the lesser.** The entry described a
    cross-file fragment (`file.md#anchor`) whose path was checked and whose anchor was not. Measurement
    found a second: a **pure** fragment (`#anchor`) was skipped by
    [`extractLocalLinks`](../../.seed/lib/repo.ts) outright — `raw.startsWith('#')` returned before the
    walker ever saw it — so the one form actually in use in this repository was not merely unchecked
    but invisible. A conversion that fixed only the priced half would have left the live instance
    unread.
  - **A pure fragment now resolves to its containing file, and that widens the dead-link sweep
    without touching reachability.** The target is the file already being walked, so it adds no hop and
    cannot change `map_reachability`; it only makes the anchor checkable. An anchor miss is reported as
    a `dead link anchor` and counts in the `deadLinks` tally, because that is what it is — a link that
    lands the reader somewhere other than the section it names.
  - **A gate, not an advisory drift class.** E-006 pre-registered `invariant — extend the map
    validator`, and ring [0011](0011-drift-advisory.md)'s split puts a class here when it is
    always-wrong and mechanically fixable. A dead anchor is both: there is no reading under which it is
    correct, and the fix is local to the line. This is the property [E-009](../plans/entropy-ledger.md)'s
    prose class conspicuously lacks, which is why that one is still open.
  - **The slugifier implements GitHub's common case and says so.** It unwraps what GitHub *renders*
    before slugging — code spans to their text, links to their text, emphasis markers dropped — then
    lowercases, drops punctuation rather than replacing it, and hyphenates spaces, with GitHub's
    duplicate suffixing (`slug`, `slug-1`, `slug-2`). It is deliberately not a CommonMark renderer.
  - **Intraword `_` is preserved, and measurement is why.** Stripping `_` as an emphasis marker
    slugged this repository's real heading ``### The one decline: `plan_traceability` …`` to
    `plantraceability`, which GitHub does not produce; CommonMark does not open emphasis intraword
    either. The marker is now dropped only at a word boundary. The bug was found by running the
    function over the actual corpus, not by reading the spec.
  - **A fragment on a non-markdown target is left alone rather than guessed at.** Only markdown
    defines headings, so `.seed/lib/repo.ts#L42` — a legitimate line reference — has no anchor set to
    check against. Guessing would fail a correct link form for no gain.
  - **The residual is named and made self-correcting instead of hidden.** Where this slugifier and
    GitHub disagree on an exotic heading, the failure message lists the target's *real* anchors, so the
    author sees the correct fragment in the error rather than a bare refusal (LAW-2). That is the whole
    mitigation for not owning a renderer.
- Alternatives considered:
  - **Wait for more fragment links before converting.** Rejected: the trigger was pre-registered at
    *first* appearance precisely so the judgment would not be re-litigated, and re-deciding a
    pre-registered trigger on arrival is how a ledger entry becomes permanent. The cost is also lowest
    now — one link to be correct about, so the gate cannot land red on a backlog.
  - **Fix only the cross-file half the entry priced.** Rejected on the measurement: the repository's
    sole real fragment link is a pure one. Converting the entry while leaving the only live instance
    unchecked would have paid the debt on paper.
  - **An advisory `dead-anchor` drift class instead of a gate.** Rejected — see the Decision. Advisory
    is for readings that need triage; this one has a single correct outcome, and ring 0011's own
    criterion selects the gate.
  - **Vendor or depend on a CommonMark/slug library.** Rejected: the zero-dependency clause and LAW-7
    (own the small subset). The delta between this ~10-line function and a renderer is exotic heading
    syntax this repository does not use, and the error message covers the gap when it appears.
  - **Also verify anchors in `docs/generated/` artifacts against their generators.** Rejected as
    scope: generated pages are byte-exact-gated already (ring
    [0020](0020-onboard-human-generated-briefing.md)), so a wrong anchor there is a generator bug the
    regeneration gate surfaces differently.
- Enforcement: **structural test + an existing `run-all` check, given a new tooth.**
  [validate-map](../../.seed/checks/validate-map.ts) now verifies every fragment against the resolved
  target's heading set ([`headingAnchors`](../../.seed/lib/repo.ts), anchors cached per file since the
  sweep revisits every link), failing with LAW-4 and listing the target's real anchors. Six new
  self-tests (**273** total, was 267): four fire — a dead cross-file anchor, a dead **pure** fragment,
  an anchor aimed at a heading inside a fenced code block (fence tracking is delegated to
  `visibleMarkdownLines`, so anchors and links agree on what is code — LAW-3), and a duplicate suffix
  beyond the repeat count — and two hold, which is the half the firing cases cannot state: all three
  resolvable shapes at once (cross-file, pure fragment, `-1` duplicate) stay green, and a `#L42`
  fragment on a script is not anchor-checked. **Test-of-the-test, both directions:** disabling the
  anchor check turns exactly the four firing cases red and leaves the rest green; dropping GitHub's
  duplicate suffixing turns exactly the green case red. `npm run check` (15) + `npm test` (273) +
  `npm run garden` (`drift_count` 0) green. Declared a `minor`
  [pollen intent](../../pollen/pending.md): a descendant's dead-link gate stops treating a fragment as
  decoration.
- Revisit-when: a heading whose GitHub slug this function computes differently appears and the listed
  anchors prove an insufficient mitigation — that is the trigger to own more of the renderer, or to
  vendor one; or fragment links become common enough that per-file anchor sets want caching across
  checks rather than within one walk; or [E-009](../plans/entropy-ledger.md)'s prose-state class lands
  and the question of *stale* anchors — a fragment that resolves to a heading whose meaning moved —
  becomes askable, which no structural gate reaches.
