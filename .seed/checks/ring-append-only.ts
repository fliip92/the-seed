// Enforces the append-only rule of docs/rings/README.md (converted from ledger E-005):
// once a ring lands, it is never modified or deleted — a changed decision gets a new
// ring that supersedes it. A silently rewritten decision poisons LAW-10 retrieval.
//
// This is a CI gate, not part of run-all.ts: it needs git history, and the content
// checks deliberately see only the working tree. Usage:
//
//   node .seed/checks/ring-append-only.ts [<base-ref>]
//
// CI passes the event's base (PR base branch, or the push's previous tip). With no
// argument it falls back to the merge base with origin/main, then HEAD~1. If the base
// cannot be resolved (branch-create push, shallow clone), the gate skips with a note —
// the pull-request run against the base branch still applies it.
import { execFileSync } from 'node:child_process';
import { REPO_ROOT, formatViolation } from '../lib/repo.ts';
import type { Violation } from '../lib/repo.ts';

const ID = 'seed/ring-append-only';
const LAW = 'LAW-10 — escalate scarce judgment; never ask twice';
const DIR = 'docs/rings';

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

// merge-base makes an arbitrary base commit safe: only changes on this branch count.
// A base with no shared history (orphan branch) has no rings to protect against —
// skip; pushes to main still gate against their previous tip.
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
  if (path === `${DIR}/README.md`) continue; // the index is not a ring; it gains a line per ring
  if (status === 'A') continue; // appending is the one permitted change
  violations.push({
    check: ID,
    law: LAW,
    problem: `${path} is an existing ring and was ${status === 'D' ? 'deleted' : 'modified'} since ${mergeBase.slice(0, 12)} (git status: ${status})`,
    fix: 'revert the change to the ring. If the decision changed, cut a NEW ring that supersedes it and note the supersession in both — procedure in docs/rings/README.md. Rings are append-only; history is the point.',
  });
}

if (violations.length > 0) {
  console.log(`✗ ${ID} — ${violations.length} violation(s)`);
  for (const v of violations) console.log(formatViolation(v));
  process.exit(1);
}
console.log(`✓ ${ID} — docs/rings append-only holds against ${base} (merge base ${mergeBase.slice(0, 12)})`);
