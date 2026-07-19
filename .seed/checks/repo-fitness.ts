// repo-fitness (plan 0003 scope item 2, ring 0016): a READ-ONLY fitness assessment of ANY
// repository, producing a report a stranger could evaluate. It is the seed's diagnostic
// instrument for hosts (SEED.md §4, Stage 2) and the load-bearing organ of the Stage 2 exit
// criterion — assess a foreign repository without modifying it and produce an
// evidence-judgeable proposal — now that grill-the-gardener supplies the target architecture
// a fitness verdict is judged against.
//
// It computes the SEED.md §6 metrics against the target by pointing the seed's own
// root-parameterized engine (.seed/lib/fitness-metrics.ts) at the target's root — the same
// implementation that assesses the seed itself (fitness.ts), so there is one definition of
// each metric (LAW-3). Metrics the target's anatomy does not define come back null with a
// stated reason (see the engine header); that null IS the finding.
//
// STRICTLY READ-ONLY (SEED.md §4, Stage 4 step 1 — "read-only fitness assessment"): it only
// reads files and runs read-only git subcommands against the target. The self-tests prove
// the target tree is byte-identical before and after a run (LAW-6).
//
// Run:  node .seed/checks/repo-fitness.ts <path-to-repo>            (human report)
//       node .seed/checks/repo-fitness.ts <path-to-repo> --json      ({date, stage, metrics, notes})
//   or:  npm run repo-fitness -- <path-to-repo>
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { computeMetrics, localDateString } from '../lib/fitness-metrics.ts';
import type { FitnessMetrics, MetricNotes } from '../lib/fitness-metrics.ts';

const METRIC_ORDER: Array<keyof FitnessMetrics> = [
  'map_reachability',
  'enforcement_ratio',
  'drift_count',
  'plan_traceability',
  'escalation_rate',
  'ledger_trend',
];

// Fraction-valued metrics render as percentages; counts render as-is. drift_count is a
// count (≥ 0); ledger_trend is a signed count; the rest are fractions in [0,1].
const IS_FRACTION: Partial<Record<keyof FitnessMetrics, boolean>> = {
  map_reachability: true,
  enforcement_ratio: true,
  plan_traceability: true,
};

function renderValue(key: keyof FitnessMetrics, value: number | null, notes: MetricNotes): string {
  if (value === null) return `null — ${notes[key] ?? 'not computable'}`;
  const base = IS_FRACTION[key]
    ? `${(value * 100).toFixed(1)}%`
    : key === 'ledger_trend'
      ? `${value >= 0 ? '+' : ''}${value} open entries (trailing 7 days)`
      : String(value);
  // A note on a COMPUTED metric (E-016: the resolved map filename) rides alongside the value so
  // the reading stays legible — which map was measured, not just the number (LAW-2).
  return notes[key] ? `${base} — ${notes[key]}` : base;
}

function humanReport(target: string, date: string, metrics: FitnessMetrics, notes: MetricNotes): string {
  const out: string[] = [];
  out.push(`repo-fitness (SEED.md §6) — read-only assessment — ${date}`);
  out.push(`target: ${target}`);
  out.push('');
  out.push('A trend, not a grade (LAW-9). A `null` means the target lacks the anatomy that');
  out.push('metric is defined over — that absence is itself the finding, not a broken reading.');
  out.push('');
  const width = Math.max(...METRIC_ORDER.map((k) => k.length));
  for (const key of METRIC_ORDER) {
    out.push(`${key.padEnd(width)}  ${renderValue(key, metrics[key], notes)}`);
  }
  return out.join('\n');
}

function fail(message: string): never {
  console.error(`repo-fitness: ${message}`);
  console.error('usage: node .seed/checks/repo-fitness.ts <path-to-repo> [--json]');
  process.exit(2);
}

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const positional = args.filter((a) => !a.startsWith('--'));
  if (positional.length === 0) fail('missing target repository path');
  if (positional.length > 1) fail(`expected exactly one target path, got ${positional.length}`);

  const target = resolve(process.cwd(), positional[0]);
  if (!existsSync(target) || !statSync(target).isDirectory()) {
    fail(`target is not a directory: ${target}`);
  }

  const date = localDateString(new Date());
  const { metrics, notes } = computeMetrics(target);

  if (json) {
    // stage is null: a foreign repo's seed growth-stage is unknown (it has not been grafted);
    // only the seed's own self-assessment (fitness.ts) claims a stage. Notes ride along so a
    // consumer can see why any metric is null without re-deriving it.
    console.log(JSON.stringify({ date, stage: null, metrics, notes }));
    return;
  }
  console.log(humanReport(target, date, metrics, notes));
}

main();
