// Enforces plan traceability (converted from ledger E-003): every commit landing on
// main must name the plan or ring governing it — "plan 0002", "ring 0010" — and the
// reference must resolve to an artifact that exists. This is what makes the SEED.md §6
// `plan_traceability` metric computable from CI history (§4 Stage 1: "merged PRs must
// trace to a plan or ring").
//
// This is a CI gate, not part of run-all.ts: it needs git history, and the content
// checks deliberately see only the working tree. Usage:
//
//   node .seed/checks/plan-traceability.ts [<base-ref>]
//
// Base-ref resolution matches ring-append-only.ts: CI passes the event's base (PR base
// branch, or the push's previous tip); the fallback is origin/main, then HEAD~1; when
// nothing resolves the gate skips with a note — the pull-request run against the base
// branch still applies it. Merge commits are exempt (machine-written subjects; the
// commits they carry are each checked individually), and history before the merge base
// is never re-judged.
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, formatViolation } from '../lib/repo.ts';
import type { Violation } from '../lib/repo.ts';

const ID = 'seed/plan-traceability';
const LAW = 'LAW-5 — plans are first-class artifacts';

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

// Existence is checked against HEAD's tree. Safe: plans are kept forever and rings are
// append-only (the sibling gate), so a reference that resolved when its commit landed
// cannot have gone stale.
const numbersIn = (dir: string): string[] =>
  readdirSync(join(REPO_ROOT, dir))
    .map((f) => f.match(/^(\d{4})-/)?.[1])
    .filter((n): n is string => n !== undefined);
const ringNums = new Set(numbersIn('docs/rings'));
const planNums = new Set([...numbersIn('docs/plans/active'), ...numbersIn('docs/plans/completed')]);

// "plan 0002", "Ring 0010", and ranges like "rings 0004-0007" (both endpoints count).
const REF_RE = /\b(plans?|rings?)\s+(\d{4})(?:\s*[-–]\s*(\d{4}))?/gi;

const commits = git('rev-list', '--no-merges', `${mergeBase}..HEAD`)
  .split('\n')
  .filter((sha) => sha !== '');

const violations: Violation[] = [];
for (const sha of commits) {
  const message = git('show', '-s', '--format=%B', sha);
  const subject = message.split('\n')[0];
  const refs: { kind: 'plan' | 'ring'; num: string }[] = [];
  for (const m of message.matchAll(REF_RE)) {
    const kind = m[1].toLowerCase().startsWith('plan') ? 'plan' : 'ring';
    refs.push({ kind, num: m[2] });
    if (m[3] !== undefined) refs.push({ kind, num: m[3] });
  }
  if (refs.length === 0) {
    violations.push({
      check: ID,
      law: LAW,
      problem: `commit ${sha.slice(0, 12)} ("${subject}") has no plan or ring reference in its message`,
      fix: 'reword the commit message to name the plan or ring governing the change, e.g. "plan 0002" or "ring 0010" (convention in AGENTS.md § Protocols). Work with no plan or ring behind it needs one first — procedure in docs/plans/README.md.',
    });
  } else if (!refs.some((r) => (r.kind === 'plan' ? planNums : ringNums).has(r.num))) {
    violations.push({
      check: ID,
      law: LAW,
      problem: `commit ${sha.slice(0, 12)} ("${subject}") references only ${refs.map((r) => `${r.kind} ${r.num}`).join(', ')} — none of these exist`,
      fix: 'reference a real plan (docs/plans/active/ or completed/) or ring (docs/rings/) by number, e.g. "plan 0002" or "ring 0010". A reference that resolves to nothing traces to nothing.',
    });
  }
}

if (violations.length > 0) {
  console.log(`✗ ${ID} — ${violations.length} violation(s)`);
  for (const v of violations) console.log(formatViolation(v));
  process.exit(1);
}
console.log(
  commits.length === 0
    ? `✓ ${ID} — no new commits since ${base} (merge base ${mergeBase.slice(0, 12)})`
    : `✓ ${ID} — all ${commits.length} new commit(s) since ${base} trace to a plan or ring (merge base ${mergeBase.slice(0, 12)})`,
);
