// Enforces SEED.md §2: the anatomy exists and every organ directory carries a README
// stating its purpose.
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
  { path: 'docs/fitness/FITNESS.md', purpose: 'current fitness + metric definitions' },
  { path: 'docs/fitness/history/README.md', purpose: 'snapshot rules' },
  { path: 'docs/references/README.md', purpose: 'distilled external docs index' },
  { path: 'docs/generated/README.md', purpose: 'regenerated-only artifacts rules' },
  { path: 'skills/README.md', purpose: 'skill garden index' },
  { path: 'pollen/README.md', purpose: 'portable distribution rules' },
  { path: '.seed/README.md', purpose: 'machinery index' },
  { path: '.seed/checks/run-all.ts', purpose: 'check runner CI executes' },
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
    return {
      summary: `${REQUIRED_FILES.length} required anatomy paths present`,
      violations,
    };
  },
};
