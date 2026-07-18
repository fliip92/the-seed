// The SEED.md §6 fitness metric engine, root-parameterized (plan 0003 scope item 2, ring
// 0016). Given any repository root it computes the six fitness v0 metrics, so there is ONE
// implementation of what a metric means (LAW-3): the seed's self-assessment
// (.seed/checks/fitness.ts) is the target=self case, and repo-fitness
// (.seed/checks/repo-fitness.ts) is the target=any-repo case. Both call in here.
//
// The metrics are defined over the seed's anatomy (an AGENTS.md map, docs/principles/, a
// plan/ring decision log, an entropy ledger). A foreign repository that has not been grafted
// carries little of it, so each metric DEGRADES TO null with a stated reason when the target
// lacks the structure that metric is defined over — the same null-when-absent contract
// escalation_rate already uses (no run-log instrument → null). The null and its reason ARE
// the diagnostic finding a stranger evaluates: "map_reachability null — no AGENTS.md" is the
// assessment, not a gap in the instrument. drift_count is the one universal metric: a doc
// naming a path that does not exist is drift in any repository.
//
// STRICTLY READ-ONLY. It reads files and runs only read-only git subcommands (rev-parse,
// ls-files, rev-list, log, show) against the target with `git -C <root>`; it never writes,
// inits, stages, or commits. For a git target the metrics are computed over the TRACKED files
// (`git ls-files` — the committed repository), so untracked build output and stray worktree
// snapshots never inflate a metric denominator (E-012); a non-git target — or a git repo with
// no commit yet — degrades to the on-disk walk. repo-fitness's verification proves the target
// tree is byte-identical before and after (LAW-6).
import { execFileSync } from 'node:child_process';
import { lstatSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { listRepoFiles, readRepoFile, numberedFilenames, extractPlanRingRefs } from './repo.ts';
import { analyzeReachability } from '../checks/validate-map.ts';
import { scanDrift } from '../checks/doc-drift.ts';

const PRINCIPLES_DIR = 'docs/principles';
const LEDGER = 'docs/plans/entropy-ledger.md';
const MAP = 'AGENTS.md';

/** Each metric is a number when computable, or null when the target lacks the anatomy that
 *  defines it (see the module header). One key per SEED.md §6 metric. */
export interface FitnessMetrics {
  map_reachability: number | null;
  enforcement_ratio: number | null;
  drift_count: number | null;
  plan_traceability: number | null;
  escalation_rate: number | null;
  ledger_trend: number | null;
}

/** For every metric that came back null, why — a legible reason rendered in the report and
 *  the repo-fitness JSON, so a null is never mistaken for a broken instrument. */
export type MetricNotes = Partial<Record<keyof FitnessMetrics, string>>;

export interface MetricsResult {
  metrics: FitnessMetrics;
  notes: MetricNotes;
}

export interface FitnessSnapshot {
  date: string;
  stage: number | null; // the seed's own hand-bumped stage for self; null for a foreign repo
  metrics: FitnessMetrics;
}

// One read-only git invocation against `root`. Returns null when git fails for any reason
// (not a repository, no commits yet, unknown ref) — every history metric treats null as
// "not computable here" rather than crashing, so a non-git target degrades cleanly.
function git(root: string, args: string[]): string | null {
  try {
    return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

// Whether `root` is the TOP LEVEL of a git work tree — not merely somewhere inside one.
// `git rev-parse --git-dir` succeeds from any subdirectory by walking up to the enclosing
// .git, so gating on it would make a nested subdirectory look like a repo and compute the
// history metrics (plan_traceability, ledger_trend) over the ENCLOSING repo's commits — the
// wrong repository, and a plausible-but-wrong number attributed to the target. So compare the
// git top-level to the target: the history metrics describe the target only when they are the
// same directory; otherwise they degrade to null with an honest reason (ring 0016).
type GitRootStatus = { ok: true } | { ok: false; note: string };

function gitRootStatus(root: string): GitRootStatus {
  const top = git(root, ['rev-parse', '--show-toplevel']);
  if (top === null) return { ok: false, note: 'not a git repository — no commit history' };
  let sameRoot: boolean;
  try {
    sameRoot = realpathSync(top) === realpathSync(root);
  } catch {
    sameRoot = top === root;
  }
  if (!sameRoot) {
    return {
      ok: false,
      note: `not the git repository root (its root is ${top}) — a nested subdirectory's history would measure the enclosing repo`,
    };
  }
  return { ok: true };
}

// The file set the metrics are computed over, for a git target: its TRACKED files, listed via
// `git ls-files` (read-only — it consults the index, so the Scout's byte-identical contract
// holds). This is "the committed repository", so untracked files — build output, stray
// `.claude/worktrees/` snapshots — never reach map_reachability's denominator or drift_count
// (E-012: on mottainapp the on-disk walk saw 18,736 files against 691 tracked, and ~150 of 343
// drift references came from ten untracked worktree snapshots git tracks zero files under).
//
// Null (→ the caller falls back to the on-disk walk, listRepoFiles) in the three cases where no
// committed repository is defined to match:
//   • not a git repository at its ROOT — the SAME gitRootStatus guard the history metrics use,
//     so a nested subdirectory measures itself, not the enclosing repo;
//   • a git repository with no commit yet (unborn HEAD) — nothing is committed to match, so the
//     working tree is the only listing there is (a real Scout target always has history; this is
//     the freshly-`git init`'d case);
//   • git cannot list the tracked files for any other reason.
// `-z` NUL-delimits so a newline in a path cannot split one entry into two; the sort matches
// listRepoFiles' ordering.
function trackedFiles(root: string): string[] | null {
  if (!gitRootStatus(root).ok) return null;
  if (git(root, ['rev-parse', '--verify', 'HEAD']) === null) return null;
  const out = git(root, ['ls-files', '-z']);
  if (out === null) return null;
  return out.split('\0').filter((f) => f !== '').sort();
}

// % files reachable ≤3 hops from AGENTS.md. Null when the target has no AGENTS.md at all —
// LAW-4's entry point is absent, so reachability from it is undefined (and the absence is
// itself the finding). analyzeReachability's own vacuous-1 convention is for a present map
// with nothing to reach, a distinct case.
function mapReachability(files: string[], root: string): { value: number | null; note?: string } {
  if (!files.includes(MAP)) return { value: null, note: `no ${MAP} — LAW-4's map entry point is absent` };
  return { value: analyzeReachability(files, root).fraction };
}

// enforced ÷ stated principles. Null when there is no docs/principles/ organ at all (a
// foreign repo need not have one); vacuously 1 when the organ exists but states no principle
// yet (the seed's current state) — the same zero-denominator convention as map_reachability.
function enforcementRatio(files: string[], root: string): { value: number | null; note?: string } {
  const organPresent = files.some((f) => f.startsWith(`${PRINCIPLES_DIR}/`));
  if (!organPresent) return { value: null, note: `no ${PRINCIPLES_DIR}/ organ — no stated principles to enforce` };
  const principleFiles = files.filter(
    (f) => f.startsWith(`${PRINCIPLES_DIR}/`) && f !== `${PRINCIPLES_DIR}/README.md`,
  );
  if (principleFiles.length === 0) return { value: 1 };
  const enforced = principleFiles.filter((f) => {
    const m = readRepoFile(f, root).match(/^-\s*Enforcement:\s*(.+)$/m);
    return m !== null && m[1].trim() !== '' && !/^none$/i.test(m[1].trim());
  }).length;
  return { value: enforced / principleFiles.length };
}

// Open doc↔code divergences — the universal metric: a current-state doc naming a repo path
// that no longer exists is drift in ANY repository, so this always computes (≥ 0).
function driftCount(files: string[], root: string): number {
  return scanDrift(files, root).length;
}

// % of the target's entire non-merge commit history whose message traces to a plan or ring
// that exists today. Null when the target is not a git repo (no history) or has no
// plan/ring decision log to trace to — a repo without that system is not failing
// traceability, the metric simply does not apply.
function planTraceability(root: string): { value: number | null; note?: string } {
  const g = gitRootStatus(root);
  if (!g.ok) return { value: null, note: g.note };
  const ringNums = new Set(numberedFilenames('docs/rings', root));
  const planNums = new Set([
    ...numberedFilenames('docs/plans/active', root),
    ...numberedFilenames('docs/plans/completed', root),
  ]);
  if (ringNums.size === 0 && planNums.size === 0) {
    return { value: null, note: 'no plans or rings — no decision log to trace commits to' };
  }
  const revList = git(root, ['rev-list', '--no-merges', 'HEAD']);
  if (revList === null) return { value: null, note: 'no commits yet' };
  const shas = revList.split('\n').filter((s) => s !== '');
  if (shas.length === 0) return { value: 1 };
  const traced = shas.filter((sha) => {
    const message = git(root, ['show', '-s', '--format=%B', sha]) ?? '';
    return extractPlanRingRefs(message).some((r) => (r.kind === 'plan' ? planNums : ringNums).has(r.num));
  }).length;
  return { value: traced / shas.length };
}

interface LedgerCounts {
  open: number;
  paid: number;
}

/** Counts `## E-NNN` entries under `## Open` vs `## Paid` in ledger content (mirrors the
 * heading-block parsing validate-plans.ts does for format validation). */
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

// Net change in open ledger entries over a trailing 7-day window — SEED.md §6's "entropy
// ledger net change per week". Null when the target is not a git repo (no history to diff)
// or has no entropy ledger. Baseline is the ledger's content right before the window began;
// while the ledger is younger than the window, the baseline is "nothing existed yet" (0
// open) — honest for a young repo, everything open genuinely appeared this week.
function ledgerTrend(files: string[], root: string): { value: number | null; note?: string } {
  // Git-root first: a trend needs history to diff against, so a non-git (or nested) target
  // has no trend regardless of whether a ledger file happens to sit there — the more
  // fundamental reason. Only once history is available does a missing ledger become the story.
  const g = gitRootStatus(root);
  if (!g.ok) return { value: null, note: g.note };
  if (!files.includes(LEDGER)) return { value: null, note: 'no entropy ledger' };
  const current = ledgerCounts(readRepoFile(LEDGER, root));
  const allLog = git(root, ['log', '--format=%H', '--reverse', '--', LEDGER]);
  if (allLog === null) return { value: null, note: 'no commits yet' };
  const allShas = allLog.split('\n').filter((s) => s !== '');
  if (allShas.length === 0) return { value: 0 }; // ledger exists but untracked by git: no trend
  const windowLog = git(root, ['log', '--since=7 days ago', '--format=%H', '--', LEDGER]) ?? '';
  const windowShas = new Set(windowLog.split('\n').filter((s) => s !== ''));
  const oldestInWindowIdx = allShas.findIndex((sha) => windowShas.has(sha));
  if (oldestInWindowIdx === -1) return { value: 0 }; // untouched this week: no change to report
  const baseline: LedgerCounts =
    oldestInWindowIdx === 0
      ? { open: 0, paid: 0 }
      : ledgerCounts(git(root, ['show', `${allShas[oldestInWindowIdx - 1]}:${LEDGER}`]) ?? '');
  return { value: current.open - baseline.open };
}

/** Compute all six SEED.md §6 metrics against `root`, with a reason for every null. */
export function computeMetrics(root: string): MetricsResult {
  // Count the COMMITTED repository (tracked files) for a git target, not the on-disk working
  // tree — untracked output must not inflate map_reachability's denominator or drift_count
  // (E-012). A non-git target has only the on-disk walk. Skip symbolic links regardless of
  // source: a foreign target may contain them (the seed bans its own — validate-anatomy), and a
  // dangling link or a link to a directory would make the downstream readFileSync throw and
  // crash the whole read-only assessment. They are simply not counted (ring 0016 review). This
  // filter is local to metric computation, so validate-anatomy's own symlink ban — which relies
  // on symlinks appearing in its file list — is untouched; and the seed has no symlinks, so its
  // own metrics are unchanged.
  const files = (trackedFiles(root) ?? listRepoFiles(root)).filter((f) => {
    try {
      return !lstatSync(join(root, f)).isSymbolicLink();
    } catch {
      return false;
    }
  });
  const notes: MetricNotes = {};
  const record = (key: keyof FitnessMetrics, r: { value: number | null; note?: string }): number | null => {
    if (r.value === null && r.note) notes[key] = r.note;
    return r.value;
  };
  const metrics: FitnessMetrics = {
    map_reachability: record('map_reachability', mapReachability(files, root)),
    enforcement_ratio: record('enforcement_ratio', enforcementRatio(files, root)),
    drift_count: driftCount(files, root),
    plan_traceability: record('plan_traceability', planTraceability(root)),
    escalation_rate: null,
    ledger_trend: record('ledger_trend', ledgerTrend(files, root)),
  };
  notes.escalation_rate = 'no run-log instrument yet';
  return { metrics, notes };
}

// Local calendar date, not UTC: every other date in this repo (rings, plans, the ledger) is
// the Gardener's local date, and toISOString() would roll over early in timezones west of
// UTC. A CI runner's local timezone is UTC anyway, so this is a no-op there.
export function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** A dated {date, stage, metrics} snapshot — the exact shape stored in
 *  docs/fitness/history/*.json. `stage` is the caller's (the seed's own hand-bumped stage
 *  for self-fitness, null for a foreign repo). Notes are intentionally NOT part of the
 *  snapshot: the history schema stays {date, stage, metrics}. */
export function computeSnapshot(root: string, stage: number | null): FitnessSnapshot {
  return { date: localDateString(new Date()), stage, metrics: computeMetrics(root).metrics };
}
