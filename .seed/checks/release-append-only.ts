// Enforces the append-only rule of pollen/releases/ (ring 0027, the ring-append-only shape): once a
// pollen release is cut it is a published, dated fact — descendants graft against "v0.1.0" — so it is
// never modified or deleted. Rewriting a released file silently changes what a version MEANS for every
// seed that already grafted it, making the pollen version line a lie (LAW-2). A wrong release is
// corrected by cutting a NEW release that supersedes it, never by editing history.
//
// A CI gate, not part of run-all.ts: it needs git history, and the content checks deliberately see
// only the working tree. It is release.ts's twin gate to ring-append-only.ts, sharing that gate's
// base-ref resolution and merge-base safety exactly. Usage:
//
//   node .seed/checks/release-append-only.ts [<base-ref>]
//
// CI passes the event's base (PR base branch, or the push's previous tip). With no argument it falls
// back to origin/main, then HEAD~1. An unresolvable base (branch-create push, shallow clone) or an
// orphan base (no shared history) skips with a note — the pull-request run against the base still
// applies it.
import { execFileSync } from 'node:child_process';
import { REPO_ROOT, formatViolation } from '../lib/repo.ts';
import type { Violation } from '../lib/repo.ts';

const ID = 'seed/release-append-only';
const LAW = "LAW-2 — legible and enforceable, or it doesn't exist";
const DIR = 'pollen/releases';

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

// merge-base makes an arbitrary base commit safe: only changes on this branch count. A base with no
// shared history (orphan branch) has no releases to protect against — skip; pushes to main still gate
// against their previous tip.
let mergeBase: string;
try {
  mergeBase = git('merge-base', base, 'HEAD').trim();
} catch {
  console.log(
    `${ID}: ${base} shares no history with HEAD (orphan branch?) — gate skipped here; pushes to main still gate against their previous tip.`,
  );
  process.exit(0);
}
const diff = git('diff', '--name-status', '--no-renames', mergeBase, 'HEAD', '--', `${DIR}/`);

const violations: Violation[] = [];
for (const line of diff.split('\n')) {
  if (line.trim() === '') continue;
  const [status, path] = line.split('\t');
  if (path === `${DIR}/README.md`) continue; // the index is not a release; it gains a line per release
  if (status === 'A') continue; // appending a new release is the one permitted change
  violations.push({
    check: ID,
    law: LAW,
    problem: `${path} is a cut release and was ${status === 'D' ? 'deleted' : 'modified'} since ${mergeBase.slice(0, 12)} (git status: ${status})`,
    fix: 'revert the change to the release file. A cut release is a published, dated fact descendants graft against — rewriting it makes the pollen version line mean two different things. If the release was wrong, cut a NEW release that supersedes it (ring 0027). Releases are append-only; the history is the point.',
  });
}

if (violations.length > 0) {
  console.log(`✗ ${ID} — ${violations.length} violation(s)`);
  for (const v of violations) console.log(formatViolation(v));
  process.exit(1);
}
console.log(`✓ ${ID} — ${DIR} append-only holds against ${base} (merge base ${mergeBase.slice(0, 12)})`);
