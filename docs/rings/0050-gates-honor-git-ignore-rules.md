# Ring 0050 — the working-tree gates take their file set from git: "what is in this repository" gets one definition (E-021 paid)

- Date: 2026-07-27
- Stage: 4 — Pollination
- Raised-by: seed (the Gardener: *"fix E-021"* — the entry priced one pass earlier in
  [ring 0049](0049-dither-pollination-proof-exit-criterion-half-met.md), where the defect surfaced
  by breaking that pass's own verification run)
- Question: an agent tool wrote `.claude/settings.local.json` into the working tree and the repo's
  two done-criteria collapsed — **3 `npm run check` violations and 26 of 241 self-tests** — while
  `git status` reported a **clean tree**, because the file is git-ignored. The gates were answering
  "what is in this repository" from a hardcoded skip list instead of from git. What is the fix, and
  how far does it reach?
- Decision:
  - **git is the single definition of what belongs to the repository (LAW-3).**
    [`listRepoFiles`](../../.seed/lib/repo.ts) still walks the tree to find files, but now filters
    them through `git ls-files --cached --others --exclude-standard` — tracked files plus untracked
    ones no ignore rule covers. Repo `.gitignore`, the user's global `core.excludesFile`, and
    `.git/info/exclude` are all honored, because git honors them; the seed no longer maintains a
    second, silently-drifting opinion. The old hardcoded set survives only as the **non-git
    fallback** (and to spare the walk the cost of descending into `node_modules`): a target that is
    not a git repository root has no ignore rules to consult, so the unfiltered walk is the only
    honest listing there is.
  - **The gates' set is deliberately NOT the metrics' set.** [E-012](../plans/entropy-ledger.md)
    scoped the *metrics* to the committed repository (`git ls-files`) and explicitly left the gates
    on the working tree, "which must still validate uncommitted files" — that is the whole point of
    running them **before** you commit. So the two differ by design and now say so in code: metrics
    count what is committed; gates judge the working tree **minus what git ignores**. An uncommitted
    file is gated; an ignored one is not repo content at all.
  - **A tracked file is never ignored.** Ignore rules do not apply to files git already tracks, and
    `--cached` reproduces that exactly — so adding a pattern cannot silence a gate on a file already
    in the index. This is pinned by the self-test rather than left as an implementation detail,
    because it is the one place where "consult git" and "read `.gitignore`" would diverge.
  - **The self-test fixtures had the same defect, and it was the larger half.**
    [`copyRepo`](../../.seed/tests/self-test.ts) built each fixture with a raw directory copy, so
    every case inherited whatever local state the machine held — one ignored file broke **26 cases
    at once**. It now assembles the fixture from `listRepoFiles`, sharing the gates' definition: the
    copy is by construction the same set the gates judge, and if that definition ever breaks these
    cases break with it. Fixing only the gates would have left `npm test` red.
  - **`.claude/settings.local.json` is named in the repo's own [`.gitignore`](../../.gitignore).**
    The exclusion was working only through *this machine's* global ignore file; a second Gardener
    cloning the repo would have hit the identical failure. Scoped to the `.local.json` — a shared
    `.claude/settings.json` is repo content and stays gated like anything else.
  - **The mother was the one carrying this defect; the host was already right.** dither's grafted
    runners (`map-gate`, `ledger-gate`, `import-boundary`, `map-completeness`, …) each list via
    `git ls-files -z` directly, chosen deliberately at graft time "so gitignored build output never
    enters the gate" (rings [0037](0037-dither-map-gate-graft.md)–[0040](0040-dither-ledger-graft.md),
    [0041](0041-dither-import-boundary-gate.md), [0046](0046-dither-map-completeness-gate.md)). **dither
    is not affected by E-021**, and needs no mutation. The mother has converged on the practice her
    own host was already following — worth recording plainly, because it is the first case of the
    graft's *local* implementation being more correct than the canonical engine it was grafted from.
  - **It ships to descendants as a pollen release, not a hand-copy.** `.seed/` is portable, so this
    change is declared as a `patch` intent in [pollen/pending.md](../../pollen/pending.md) (ring
    [0026](0026-pollen-boundary-versioning-lineage.md)). dither's copied `.seed/lib/repo.ts`
    therefore now **lags** the mother's by this fix — the first divergence since the graft — and that
    is the designed propagation model: descendants upgrade through versioned releases, not
    continuous mirroring. The "verbatim engine" invariant means *verbatim of the version grafted*,
    and the check that matters is unchanged: dither's copy is still byte-identical to pollen v0.1.0.
- Alternatives considered:
  - **Add `.claude` to the hardcoded `EXCLUDED_DIRS`.** Rejected — it fixes the instance and leaves
    the class: the next tool that writes local state (an editor directory, a coverage dir, a
    worktree snapshot) breaks the gates again, and the seed keeps a second definition of repo
    membership that drifts from git's. The hardcoded set already duplicated `.gitignore`'s
    `node_modules/` and `.DS_Store` — that duplication *is* the bug, in miniature.
  - **Switch the gates to `git ls-files` (tracked only), matching the metrics.** Rejected — it would
    make the gates blind to new, uncommitted work, so a file added and not yet committed could never
    fail a check before it landed. That inverts what a pre-commit gate is for, and would undo
    E-012's deliberate scoping.
  - **Walk on-disk, then filter through `git check-ignore --stdin`.** Rejected in favor of the
    positive `--cached --others --exclude-standard` listing: one invocation instead of a per-path
    protocol, no exit-code-1-means-no-match handling, and it expresses the intended set directly
    ("the files git considers this repository's") rather than deriving it by subtraction.
  - **Gitignore the whole `.claude/` directory.** Rejected — `settings.json` is shared, committed
    project config by convention; excluding the directory wholesale would silently hide a real repo
    file from every gate. Only the machine-local `.local.json` is excluded.
  - **Leave the fixtures alone and just fix the gates.** Rejected — measured: with the gates fixed
    and `copyRepo` untouched, 26 self-tests still failed. The fixture builder was the larger half of
    the defect.
  - **Propagate the fix into dither now.** Rejected — dither is provably unaffected (its runners
    already list via git), so a mutation would buy nothing and would bypass the release model. It
    rides the next pollen release.
- Enforcement: **structural test** — three new cases in
  [self-test.ts](../../.seed/tests/self-test.ts) (244 total, was 241): a four-step contrast on one
  file proving it is the ignore *rule* and not the filename that decides (an unreachable
  `stray-local.md` is gated while merely uncommitted → silent once `.gitignore` covers it → gated
  again once tracked); a case pinning `core.excludesFile` — *the source that actually bit*, so a fix
  reading only `.gitignore` would fail it; and a case pinning the non-git fallback (a `.gitignore`
  in a non-git tree must not silence a gate, or a target could hide files from the seed with a file
  git never reads). **Test-of-the-test:** neutering the filter turns the first two red and correctly
  leaves the third green (it pins the fallback, which the neuter makes universal) — and the 26
  fixture failures return, confirming both halves are load-bearing. Verified with
  `.claude/settings.local.json` **present** in the working tree, the condition that broke everything:
  `npm run check` (18 checks), `npm test` (244), `npm run garden` (`drift_count` 0) all green. No
  dither mutation (dither is unaffected).
- Revisit-when: a gate needs to judge a file git ignores (none does today — if one ever must, it
  should take an explicit path, not re-broaden the listing for everyone); or a host is grafted whose
  working tree is not a git repository, where the fallback becomes the live path rather than a
  degradation; or `EXCLUDED_DIRS` grows a third entry, which would mean the fallback is being used
  as a policy surface again and the two-definition problem is re-forming.
