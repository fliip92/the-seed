// Computes the SEED.md §6 fitness v0 metrics and prints a dated snapshot (plan 0002 scope
// item 4). Fitness is a trend, not a grade (LAW-9): this is a reporting instrument, not a
// gate, so it never fails on the numbers it computes — only a thrown error (a genuinely
// broken instrument) exits non-zero, the same contract as doc-drift.ts.
//
// Run:  node .seed/checks/fitness.ts           (human report)
//       node .seed/checks/fitness.ts --json     (the exact snapshot shape — redirect
//                                                 straight into docs/fitness/history/)
//
// Five of the six SEED.md §6 metrics are computable today; `escalation_rate` needs run-log
// infrastructure that does not exist yet and is recorded null, per the schema in
// docs/fitness/FITNESS.md.
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { REPO_ROOT, listRepoFiles, readRepoFile, extractPlanRingRefs, numberedFilenames } from '../lib/repo.ts';
import { analyzeReachability } from './validate-map.ts';

// Bumped by hand alongside the next stage-transition ring (SEED.md §4) — stage changes are
// rare, deliberate, Gardener-approved events, not something worth deriving mechanically.
const CURRENT_STAGE = 2; // Stage 2 — Growth (ring 0014). Agreement with AGENTS.md is unchecked — E-011.

const PRINCIPLES_DIR = 'docs/principles';
const LEDGER = 'docs/plans/entropy-ledger.md';

const git = (...args: string[]): string =>
  execFileSync('git', ['-C', REPO_ROOT, ...args], { encoding: 'utf8' }).trim();

function mapReachability(files: string[]): number {
  return analyzeReachability(files).fraction;
}

// Reuses doc-drift.ts as a subprocess (its own documented --json contract, plan 0002 scope
// item 4) rather than importing scanDrift directly: doc-drift.ts unconditionally runs its
// own main() at module scope, so importing it would also print its human report as a side
// effect. Keeping checks decoupled (no check file imports another) also matches how every
// other check here is composed only by run-all.ts, never by each other.
function driftCount(): number {
  const out = execFileSync(
    process.execPath,
    [join(REPO_ROOT, '.seed/checks/doc-drift.ts'), '--json'],
    { encoding: 'utf8' },
  );
  return (JSON.parse(out) as { drift_count: number }).drift_count;
}

// enforced ÷ stated, over one-file-per-principle in docs/principles/ (README excluded —
// it is the format doc, not a principle). Vacuously 1 (fully enforced) when zero
// principles are stated yet, matching the same zero-denominator convention validate-map.ts
// already uses for map_reachability — an empty set has nothing unenforced in it.
function enforcementRatio(files: string[]): number {
  const principleFiles = files.filter(
    (f) => f.startsWith(`${PRINCIPLES_DIR}/`) && f !== `${PRINCIPLES_DIR}/README.md`,
  );
  if (principleFiles.length === 0) return 1;
  const enforced = principleFiles.filter((f) => {
    const m = readRepoFile(f).match(/^-\s*Enforcement:\s*(.+)$/m);
    return m !== null && m[1].trim() !== '' && !/^none$/i.test(m[1].trim());
  }).length;
  return enforced / principleFiles.length;
}

// % of the repo's entire non-merge commit history whose message traces to a plan or ring
// that exists today — the trend `plan-traceability.ts` gates one push at a time.
// Independent computation, sharing only the reference grammar (lib/repo.ts): the gate
// judges commits since a base ref and fails CI; this walks all of history and never fails.
function planTraceability(): number {
  const ringNums = new Set(numberedFilenames('docs/rings'));
  const planNums = new Set([...numberedFilenames('docs/plans/active'), ...numberedFilenames('docs/plans/completed')]);
  const shas = git('rev-list', '--no-merges', 'HEAD').split('\n').filter((s) => s !== '');
  if (shas.length === 0) return 1;
  const traced = shas.filter((sha) => {
    const message = git('show', '-s', '--format=%B', sha);
    return extractPlanRingRefs(message).some((r) => (r.kind === 'plan' ? planNums : ringNums).has(r.num));
  }).length;
  return traced / shas.length;
}

interface LedgerCounts {
  open: number;
  paid: number;
}

/** Counts `## E-NNN` entries under `## Open` vs `## Paid` in ledger content (mirrors the
 * heading-block parsing validate-plans.ts already does for format validation). */
function ledgerCounts(content: string): LedgerCounts {
  const blocks = content.split(/^## /m).slice(1);
  let section: 'open' | 'paid' | null = null;
  const counts: LedgerCounts = { open: 0, paid: 0 };
  for (const block of blocks) {
    const heading = block.split('\n')[0].trim();
    if (heading === 'Open') {
      section = 'open';
      continue;
    }
    if (heading === 'Paid') {
      section = 'paid';
      continue;
    }
    if (section !== null && /^E-\d{3} — /.test(heading)) counts[section]++;
  }
  return counts;
}

// Net change in open ledger entries over a trailing 7-day window — SEED.md §6's
// "entropy ledger net change per week". Baseline is the ledger's content right before the
// window began (git history is the diff). While the repo (or the ledger) is younger than
// the window, there is nothing before it to diff against, so the baseline is "nothing
// existed yet" (0 open) — honest for a young repo: everything currently open genuinely did
// appear within the last week, because the whole thing is younger than a week.
function ledgerTrend(): number {
  const current = ledgerCounts(readRepoFile(LEDGER));
  const allShas = git('log', '--format=%H', '--reverse', '--', LEDGER)
    .split('\n')
    .filter((s) => s !== '');
  if (allShas.length === 0) return 0;
  const windowShas = new Set(
    git('log', '--since=7 days ago', '--format=%H', '--', LEDGER)
      .split('\n')
      .filter((s) => s !== ''),
  );
  const oldestInWindowIdx = allShas.findIndex((sha) => windowShas.has(sha));
  if (oldestInWindowIdx === -1) return 0; // untouched this week: no change to report
  const baseline: LedgerCounts =
    oldestInWindowIdx === 0
      ? { open: 0, paid: 0 }
      : ledgerCounts(git('show', `${allShas[oldestInWindowIdx - 1]}:${LEDGER}`));
  return current.open - baseline.open;
}

export interface FitnessMetrics {
  map_reachability: number;
  enforcement_ratio: number;
  drift_count: number;
  plan_traceability: number;
  escalation_rate: number | null;
  ledger_trend: number;
}

export interface FitnessSnapshot {
  date: string;
  stage: number;
  metrics: FitnessMetrics;
}

// Local calendar date, not UTC: every other date in this repo (rings, plans, the ledger)
// is the Gardener's local date, and toISOString() would roll over early in timezones west
// of UTC. A CI runner's local timezone is UTC anyway, so this is a no-op there.
function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function computeSnapshot(): FitnessSnapshot {
  const files = listRepoFiles();
  return {
    date: localDateString(new Date()),
    stage: CURRENT_STAGE,
    metrics: {
      map_reachability: mapReachability(files),
      enforcement_ratio: enforcementRatio(files),
      drift_count: driftCount(),
      plan_traceability: planTraceability(),
      escalation_rate: null,
      ledger_trend: ledgerTrend(),
    },
  };
}

function main(): void {
  const json = process.argv.includes('--json');
  const snapshot = computeSnapshot();
  if (json) {
    console.log(JSON.stringify(snapshot));
    return;
  }
  const pct = (f: number): string => `${(f * 100).toFixed(1)}%`;
  const m = snapshot.metrics;
  console.log(`seed fitness v0 (SEED.md §6) — a trend, not a grade — ${snapshot.date}, stage ${snapshot.stage}\n`);
  console.log(`map_reachability   ${pct(m.map_reachability)}`);
  console.log(`enforcement_ratio  ${pct(m.enforcement_ratio)}`);
  console.log(`drift_count        ${m.drift_count}`);
  console.log(`plan_traceability  ${pct(m.plan_traceability)}`);
  console.log(`escalation_rate    ${m.escalation_rate === null ? 'null (no run-log instrument yet)' : m.escalation_rate}`);
  console.log(`ledger_trend       ${m.ledger_trend >= 0 ? '+' : ''}${m.ledger_trend} open entries (trailing 7 days)`);
}

main();
