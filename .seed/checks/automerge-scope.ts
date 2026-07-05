// Enforces the automerge touched-paths restriction of ring 0007 (converting ledger E-008,
// the path-based half of scope item 5's cadence automation). Ring 0007 says a change may
// land automatically — without Gardener review — only when it is mechanical AND touches
// none of the Gardener-gated surfaces: SEED.md (the genome), existing ring content, or
// principle statements. That restriction was doc-only ("the touched-paths restriction is
// doc-only until a path-based gate exists — that gap is part of E-008's price"); this gate
// makes it mechanical, so an automerge *claim* can be trusted.
//
// How a commit claims automerge eligibility: an `Automerge: <class>` trailer in its message,
// where <class> is one of ring 0007's mechanical classes (see CLASSES). The gate then proves
// the claim: a marked commit must touch NONE of the protected paths. A commit with no marker
// is the Gardener-review path and is not constrained here (it is still bound by traceability
// and the append-only gate). A marker naming an unknown class is itself a violation — an
// automerge claim must name a real mechanical class, so `Automerge: anything` cannot buy a
// pass. See AGENTS.md § Protocols for the convention and ring 0012 for the mechanism decision.
//
// Scope boundary (honest): while solo (ring 0006) nothing forces a constitution-touching
// commit to carry — or omit — the marker; there is no mechanical "was this Gardener-reviewed"
// signal until branch protection arrives at Flowering. What this gate guarantees is bounded
// and real: whatever *declares* itself safe-to-automerge provably stayed inside the mechanical
// boundary. The residual is recorded with E-008 (Paid), the same shape as E-005's force-push
// residual.
//
// This is a CI gate, not part of run-all.ts: it needs git history, and its path checks read
// the commit diffs, not the working tree. Usage:
//
//   node .seed/checks/automerge-scope.ts [<base-ref>]
//
// Base-ref resolution matches ring-append-only.ts and plan-traceability.ts: CI passes the
// event's base (PR base branch, or the push's previous tip); the fallback is origin/main,
// then HEAD~1; when nothing resolves the gate skips with a note. Merge commits are exempt
// (machine-written subjects; the commits they carry are each checked individually), and
// history before the merge base is never re-judged.
import { execFileSync } from 'node:child_process';
import { REPO_ROOT, formatViolation } from '../lib/repo.ts';
import type { Violation } from '../lib/repo.ts';

const ID = 'seed/automerge-scope';
const LAW = 'LAW-8 — entropy is paid continuously';

// Ring 0007's mechanical automerge classes, one token each. This vocabulary is grounded in
// an append-only ring, so it cannot silently drift; a marker must name one of these:
//   link           — link/index fixes
//   format         — format compliance
//   typo           — typo cleanup
//   stale-reference — stale-reference cleanup (the doc-gardener's output)
//   regeneration   — regeneration of docs/generated/
//   ledger         — ledger bookkeeping
const CLASSES = new Set(['link', 'format', 'typo', 'stale-reference', 'regeneration', 'ledger']);

// The Gardener-gated surfaces an automerge-class change must never touch (ring 0007). README
// indices are exempt: they are not ring/principle *content* — "link/index fixes" is itself an
// allowed automerge class, and an index legitimately gains a line per ring/principle.
function isProtected(path: string): boolean {
  if (path === 'SEED.md') return true; // the genome — amended only by Gardener PR + ring
  if (path.startsWith('docs/rings/') && path !== 'docs/rings/README.md') return true; // ring content (cutting a ring is a LAW-10 decision, not mechanical)
  if (path.startsWith('docs/principles/') && path !== 'docs/principles/README.md') return true; // a principle statement is captured taste (LAW-9), not mechanical
  return false;
}

// An `Automerge:` trailer line anywhere in the message; captures the class token.
const AUTOMERGE_RE = /^[ \t]*Automerge:[ \t]*(\S+)[ \t]*$/im;

const git = (...args: string[]): string =>
  execFileSync('git', ['-C', REPO_ROOT, ...args], { encoding: 'utf8' });

const resolves = (ref: string): boolean => {
  try {
    git('rev-parse', '--verify', '--quiet', `${ref}^{commit}`);
    return true;
  } catch {
    return false;
  }
};

const base = [process.argv[2], 'origin/main', 'HEAD~1'].find(
  (ref): ref is string => typeof ref === 'string' && ref !== '' && resolves(ref),
);
if (base === undefined) {
  console.log(
    `${ID}: no resolvable base ref (branch-create push or shallow clone) — gate skipped here; the pull-request run against the base branch still applies it.`,
  );
  process.exit(0);
}

let mergeBase: string;
try {
  mergeBase = git('merge-base', base, 'HEAD').trim();
} catch {
  console.log(
    `${ID}: ${base} shares no history with HEAD (orphan branch?) — gate skipped here; pushes to main still gate against their previous tip.`,
  );
  process.exit(0);
}

const commits = git('rev-list', '--no-merges', `${mergeBase}..HEAD`)
  .split('\n')
  .filter((sha) => sha !== '');

const violations: Violation[] = [];
let markedCount = 0;
for (const sha of commits) {
  const message = git('show', '-s', '--format=%B', sha);
  const subject = message.split('\n')[0];
  const marker = message.match(AUTOMERGE_RE);
  if (marker === null) continue; // not an automerge claim — Gardener-review path, not this gate's business
  markedCount++;
  const klass = marker[1];
  if (!CLASSES.has(klass)) {
    violations.push({
      check: ID,
      law: LAW,
      problem: `commit ${sha.slice(0, 12)} ("${subject}") declares "Automerge: ${klass}", which is not a mechanical class`,
      fix: `name one of ring 0007's mechanical classes — ${[...CLASSES].join(', ')} — or drop the Automerge trailer if the change is not mechanical. An automerge claim must name a real class (AGENTS.md § Protocols).`,
    });
    continue;
  }
  // Files this single commit changed (vs its parent; --root shows a root commit's adds).
  // -z is load-bearing, not cosmetic: git's default core.quotepath double-quotes and
  // octal-escapes any path with a non-ASCII byte (or a literal quote/backslash/control char),
  // and isProtected does raw prefix comparisons — so a quoted `"docs/rings/..."` would miss
  // every guard and let a marked commit ADD an oddly-named ring or principle (adversarial
  // review, scope item 5). Under -z git emits the raw repo-relative path, NUL-delimited, never
  // quoted. `-c core.quotepath=false` alone is insufficient (it still escapes quote/backslash/
  // control chars), so -z is the full close.
  const touched = git('diff-tree', '--no-commit-id', '--name-only', '-r', '--root', '-z', sha)
    .split('\0')
    .filter((p) => p !== '');
  const hit = touched.filter(isProtected);
  if (hit.length > 0) {
    violations.push({
      check: ID,
      law: LAW,
      problem: `commit ${sha.slice(0, 12)} ("${subject}") is marked "Automerge: ${klass}" but touches Gardener-gated path(s): ${hit.join(', ')}`,
      fix: 'an automerge-class change may touch none of SEED.md, existing ring content (docs/rings/, README index aside), or principle statements (docs/principles/, README index aside) — these need Gardener review (ring 0007). Drop the Automerge trailer and route the change through review, or split the mechanical part into its own marked commit.',
    });
  }
}

if (violations.length > 0) {
  console.log(`✗ ${ID} — ${violations.length} violation(s)`);
  for (const v of violations) console.log(formatViolation(v));
  process.exit(1);
}
console.log(
  markedCount === 0
    ? `✓ ${ID} — no automerge-marked commits since ${base} (merge base ${mergeBase.slice(0, 12)}); ${commits.length} commit(s) on the Gardener-review path`
    : `✓ ${ID} — all ${markedCount} automerge-marked commit(s) since ${base} stay within ring 0007's mechanical scope (merge base ${mergeBase.slice(0, 12)})`,
);
