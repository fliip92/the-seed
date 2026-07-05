// The gardening cadence's report composer (ring 0007, converting ledger E-008 — plan 0002
// scope item 5, the scheduled half). The scheduled workflow
// (.github/workflows/gardening-cadence.yml) runs the sense/measure instruments weekly and
// calls this to compose the pass report; when there is drift to digest it files a durable
// gardening-pass issue, so sensed entropy surfaces on cadence even when no working session
// opens — E-008's exact risk ("if no session opens, no gardening happens — drift accumulates
// exactly when nobody is looking").
//
// It is a COMPOSER, not a gate and not a metric source: it shells out to the two existing
// instruments — doc-drift.ts and fitness.ts, each via its own documented --json contract —
// and renders their output as a markdown pass report plus the triage checklist. Composing by
// subprocess (rather than importing them) matches how fitness.ts already reuses doc-drift.ts:
// both instruments run their own main() at module scope, so importing would print their
// reports as a side effect, and "no check imports another" keeps the machinery decoupled. The
// CI-specific glue — actually filing the issue — stays in the workflow YAML.
//
// It is ADVISORY, like the instruments it composes (ring 0011): the report is a sensing
// record, never a gate. A thrown error (a broken instrument) still exits non-zero so CI
// notices. Usage:
//
//   node .seed/checks/gardening-report.ts          # markdown pass report to stdout
//   node .seed/checks/gardening-report.ts --json    # { date, has_findings, drift_count }
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { REPO_ROOT } from '../lib/repo.ts';
import type { Drift } from './doc-drift.ts';
import type { FitnessSnapshot } from './fitness.ts';

const node = (script: string, args: string[]): string =>
  execFileSync(process.execPath, [join(REPO_ROOT, script), ...args], { encoding: 'utf8' });

interface DriftReport {
  drift_count: number;
  findings: Drift[];
}

function driftReport(): DriftReport {
  return JSON.parse(node('.seed/checks/doc-drift.ts', ['--json'])) as DriftReport;
}

function fitnessSnapshot(): FitnessSnapshot {
  return JSON.parse(node('.seed/checks/fitness.ts', ['--json'])) as FitnessSnapshot;
}

// The pass is actionable when the doc-gardener senses drift — the signal this cadence exists
// to catch on the weeks nobody is looking. The fitness snapshot rides along as context but
// does not, in v0, trigger the pass on its own (a metric moving is a trend to read, not a
// discrete task); widening the trigger is a later, priced step, not a silent one.
function composeMarkdown(drift: DriftReport, fitness: FitnessSnapshot): string {
  const pct = (f: number): string => `${(f * 100).toFixed(1)}%`;
  const m = fitness.metrics;
  const out: string[] = [];
  out.push(`# Gardening pass — ${fitness.date}`);
  out.push('');
  out.push(
    'Weekly cadence (ring 0007), automated by scope item 5 (E-008). Advisory: this is the ' +
      'sense + measure record, not a gate. Triage each finding below, then close this issue.',
  );
  out.push('');

  out.push('## Drift (doc-gardener)');
  out.push('');
  if (drift.drift_count === 0) {
    out.push('✓ `drift_count 0` — every path named in current-state docs resolves.');
  } else {
    out.push(`\`drift_count ${drift.drift_count}\` — findings to digest:`);
    out.push('');
    for (const d of drift.findings) {
      out.push(`- **${d.problem}**`);
      out.push(`  - fix: ${d.fix}`);
    }
  }
  out.push('');

  out.push('## Fitness (SEED.md §6)');
  out.push('');
  out.push('| Metric | Value |');
  out.push('|---|---|');
  out.push(`| \`map_reachability\` | ${pct(m.map_reachability)} |`);
  out.push(`| \`enforcement_ratio\` | ${pct(m.enforcement_ratio)} |`);
  out.push(`| \`drift_count\` | ${m.drift_count} |`);
  out.push(`| \`plan_traceability\` | ${pct(m.plan_traceability)} |`);
  out.push(`| \`escalation_rate\` | ${m.escalation_rate === null ? 'null' : m.escalation_rate} |`);
  out.push(`| \`ledger_trend\` | ${m.ledger_trend >= 0 ? '+' : ''}${m.ledger_trend} |`);
  out.push('');

  out.push('## The pass (doc-gardener SKILL)');
  out.push('');
  out.push('1. **Sense** — `npm run garden`; read every finding above.');
  out.push(
    "2. **Triage** by ring 0007's automerge classes. A fix may land directly on `main` " +
      'only when **all** hold: checks green; it touches none of SEED.md, existing ring ' +
      'content, or principle statements; and it is mechanical. Mark such commits ' +
      '`Automerge: <class>` — the `seed/automerge-scope` gate proves the touched-paths half.',
  );
  out.push('3. **Escalate or price** everything else — a Gardener question or a ledger entry (SEED.md §0), never a silent guess.');
  out.push('4. **Record** — log the pass; if a decision was made, cut a ring (LAW-10).');
  out.push('');
  return out.join('\n');
}

function main(): void {
  const drift = driftReport();
  if (process.argv.includes('--json')) {
    const fitnessDate = fitnessSnapshot().date;
    console.log(
      JSON.stringify({
        date: fitnessDate,
        has_findings: drift.drift_count > 0,
        drift_count: drift.drift_count,
      }),
    );
    return;
  }
  console.log(composeMarkdown(drift, fitnessSnapshot()));
}

main();
