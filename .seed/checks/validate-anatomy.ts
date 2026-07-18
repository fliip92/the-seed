// Enforces SEED.md §2: the anatomy exists and every organ directory carries a README
// stating its purpose. Also bans symbolic links repo-wide: checks read through a
// symlink while git diffs track only its target path, so linked content can change
// with no diff at the linked path — the bypass class the E-005 gate review surfaced.
import { lstatSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const LAW = 'LAW-2 — legible and enforceable, or it doesn\'t exist';
const ID = 'seed/validate-anatomy';

const REQUIRED_FILES: Array<{ path: string; purpose: string }> = [
  { path: 'SEED.md', purpose: 'the genome' },
  { path: 'AGENTS.md', purpose: 'the map (LAW-4)' },
  { path: 'README.md', purpose: 'human-facing front door for the public repo (ring 0004)' },
  { path: 'LICENSE', purpose: 'MIT (ring 0005)' },
  { path: 'package.json', purpose: 'machinery manifest (npm run check)' },
  { path: '.gitignore', purpose: 'repository hygiene' },
  { path: '.github/workflows/seed-ci.yml', purpose: 'CI shim delegating to .seed/ (ring 0002)' },
  { path: 'docs/rings/README.md', purpose: 'decision log index + ring format' },
  { path: 'docs/plans/README.md', purpose: 'plan formats + procedure' },
  { path: 'docs/plans/active/README.md', purpose: 'index of plans in flight' },
  { path: 'docs/plans/completed/README.md', purpose: 'index of finished plans' },
  { path: 'docs/plans/entropy-ledger.md', purpose: 'priced debt' },
  { path: 'docs/principles/README.md', purpose: 'principle format + index' },
  { path: 'docs/architecture/README.md', purpose: 'architecture-doc format + index (grill-the-gardener, plan 0003)' },
  { path: 'docs/postmortems/README.md', purpose: 'postmortem-entry format + index (postmortem, plan 0003)' },
  { path: 'docs/assessments/README.md', purpose: 'foreign-repo assessment format + index (Stage 2 exit criterion, plan 0003)' },
  { path: 'docs/fitness/FITNESS.md', purpose: 'current fitness + metric definitions' },
  { path: 'docs/fitness/history/README.md', purpose: 'snapshot rules' },
  { path: 'docs/references/README.md', purpose: 'distilled external docs index' },
  { path: 'docs/judgments/README.md', purpose: 'inferential-verdict record + format (judge, ring 0030, E-013)' },
  { path: 'docs/generated/README.md', purpose: 'regenerated-only artifacts rules' },
  { path: 'skills/README.md', purpose: 'skill garden index' },
  { path: 'pollen/README.md', purpose: 'portable distribution rules' },
  { path: '.seed/README.md', purpose: 'machinery index' },
  { path: '.seed/checks/run-all.ts', purpose: 'check runner CI executes' },
  { path: '.seed/checks/ring-append-only.ts', purpose: 'ring append-only CI gate (E-005)' },
  { path: '.seed/checks/release-append-only.ts', purpose: 'release history append-only CI gate (ring 0027)' },
  { path: '.seed/checks/release.ts', purpose: 'the release / graft CLI (plan 0005 scope item 2, E-015)' },
  { path: '.seed/checks/validate-judgments.ts', purpose: 'the inferential-control envelope gate (ring 0030, E-013)' },
  { path: '.seed/checks/judge.ts', purpose: 'the judge CLI — assembles the pinned prompt (ring 0030, E-013)' },
  { path: 'pollen/pending.md', purpose: 'the committed release intents (ring 0027)' },
  { path: 'pollen/releases/README.md', purpose: 'the append-only release history index (ring 0027)' },
  { path: '.seed/checks/doc-drift.ts', purpose: 'doc-gardener drift detector, source of drift_count (plan 0002)' },
  { path: '.seed/checks/fitness.ts', purpose: 'fitness v0 snapshot computation, SEED.md §6 (plan 0002)' },
  { path: '.seed/tests/self-test.ts', purpose: 'machinery self-tests (E-007, LAW-6)' },
];

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const present = new Set(files);
    const violations: Violation[] = [];
    for (const req of REQUIRED_FILES) {
      if (!present.has(req.path)) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `required anatomy file missing: ${req.path} (${req.purpose})`,
          fix: `create ${req.path} — SEED.md §2 defines the anatomy; every organ directory carries a README stating its purpose. If this organ was deliberately removed, that is a genome amendment: Gardener-approved PR plus a ring.`,
        });
      }
    }
    for (const file of files) {
      if (lstatSync(join(REPO_ROOT, file)).isSymbolicLink()) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} is a symbolic link`,
          fix: 'replace the symlink with a regular file. Checks read through a symlink while git tracks only its target path, so the content here can change with no diff at this path — that bypasses path-scoped gates like ring-append-only (E-005).',
        });
      }
    }
    return {
      summary: `${REQUIRED_FILES.length} required anatomy paths present, no symlinks`,
      violations,
    };
  },
};
