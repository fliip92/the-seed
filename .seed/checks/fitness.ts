// The seed's self-assessment: computes the SEED.md §6 fitness v0 metrics for THIS repository
// and prints a dated snapshot (plan 0002 scope item 4). Fitness is a trend, not a grade
// (LAW-9): this is a reporting instrument, not a gate, so it never fails on the numbers it
// computes — only a thrown error (a genuinely broken instrument) exits non-zero, the same
// contract as doc-drift.ts.
//
// Run:  node .seed/checks/fitness.ts           (human report)
//       node .seed/checks/fitness.ts --json     (the exact snapshot shape — redirect
//                                                 straight into docs/fitness/history/)
//
// The metric computation lives in the root-parameterized engine
// (.seed/lib/fitness-metrics.ts, ring 0016): this file is the target=self case, and
// repo-fitness.ts is the target=any-repo case, so "what a metric means" has one
// implementation (LAW-3). `escalation_rate` needs run-log infrastructure that does not
// exist yet and is recorded null, per the schema in docs/fitness/FITNESS.md.
import { REPO_ROOT } from '../lib/repo.ts';
import { computeSnapshot } from '../lib/fitness-metrics.ts';
export type { FitnessMetrics, FitnessSnapshot } from '../lib/fitness-metrics.ts';

// Bumped by hand alongside the next stage-transition ring (SEED.md §4) — stage changes are
// rare, deliberate, Gardener-approved events, not something worth deriving mechanically.
const CURRENT_STAGE = 2; // Stage 2 — Growth (ring 0014). Agreement with AGENTS.md is unchecked — E-011.

function main(): void {
  const json = process.argv.includes('--json');
  const snapshot = computeSnapshot(REPO_ROOT, CURRENT_STAGE);
  if (json) {
    console.log(JSON.stringify(snapshot));
    return;
  }
  const pct = (f: number | null): string => (f === null ? 'null' : `${(f * 100).toFixed(1)}%`);
  const m = snapshot.metrics;
  console.log(`seed fitness v0 (SEED.md §6) — a trend, not a grade — ${snapshot.date}, stage ${snapshot.stage}\n`);
  console.log(`map_reachability   ${pct(m.map_reachability)}`);
  console.log(`enforcement_ratio  ${pct(m.enforcement_ratio)}`);
  console.log(`drift_count        ${m.drift_count}`);
  console.log(`plan_traceability  ${pct(m.plan_traceability)}`);
  console.log(`escalation_rate    ${m.escalation_rate === null ? 'null (no run-log instrument yet)' : m.escalation_rate}`);
  console.log(`ledger_trend       ${m.ledger_trend === null ? 'null' : `${m.ledger_trend >= 0 ? '+' : ''}${m.ledger_trend} open entries (trailing 7 days)`}`);
}

main();
