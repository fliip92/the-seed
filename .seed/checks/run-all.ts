// The single entry point CI and agents run: `node .seed/checks/run-all.ts`
// (or `npm run check`). Exit 0 = the repository holds its own invariants (LAW-2).
import { listRepoFiles, formatViolation } from '../lib/repo.ts';
import type { Check } from '../lib/repo.ts';
import { check as anatomy } from './validate-anatomy.ts';
import { check as map } from './validate-map.ts';
import { check as rings } from './validate-rings.ts';
import { check as plans } from './validate-plans.ts';
import { check as architecture } from './validate-architecture.ts';

const CHECKS: Check[] = [anatomy, map, rings, plans, architecture];

const files = listRepoFiles();
let failed = 0;

console.log('seed checks — LAW-2: legible and enforceable, or it doesn\'t exist\n');

for (const check of CHECKS) {
  const result = check.run(files);
  if (result.violations.length === 0) {
    console.log(`✓ ${check.id} — ${result.summary}`);
  } else {
    failed += result.violations.length;
    console.log(`✗ ${check.id} — ${result.violations.length} violation(s)`);
    for (const v of result.violations) console.log(formatViolation(v));
  }
}

if (failed > 0) {
  console.log(`\n${failed} violation(s). Nothing ambiguous survives contact: fix, or convert to a ledger entry with a conversion path (SEED.md §0).`);
  process.exit(1);
}
console.log('\nall checks passed');
