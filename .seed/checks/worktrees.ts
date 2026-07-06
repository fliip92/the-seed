// parallel-worktrees (plan 0003 scope item 4, ring 0019): decompose a large task across
// ISOLATED git worktrees — one booted instance of the system per worktree, torn down at task
// end (SEED.md §4, Stage 2). The genome ships only the HOST-AGNOSTIC lifecycle: create N
// isolated worktrees, boot an instance per worktree through a host-adapter contract, tear them
// all down, and prove isolation + cleanup held. Host-specific boot mechanics — simulators,
// dev-build caches keyed to main's hash, Metro/Orbit-style fast boot for mobile hosts — live in
// host adapters that implement the contract below, NOT in the genome (SEED.md §4).
//
// This file is also its own verification (LAW-6). `dry-run` runs the full
// create → isolate → boot → teardown → cleanup cycle against a HERMETIC scratch git repo it
// creates and owns under the OS temp dir, asserts isolation and cleanup, and removes every
// trace in a finally — so a run never touches the caller's working tree (the read-only-of-the-
// caller property, proven externally by the self-tests, like repo-fitness's non-mutation proof).
// A dry-run whose isolation/cleanup assertions can NEVER fail would be doc-only enforcement in a
// costume (LAW-2), so `--inject` forces each fault class and the self-tests prove the assertions
// have teeth.
//
// Run:  node .seed/checks/worktrees.ts dry-run [--count N]           (human report)
//       node .seed/checks/worktrees.ts dry-run [--count N] --json     ({ mode, count, scratch, ok, checks })
//   or:  npm run worktrees -- dry-run
//
// Exit 0 = isolation and cleanup held; 1 = a defect (an assertion fired, or an internal error);
// 2 = usage error. Unlike the advisory instruments (doc-drift, fitness), the dry-run is a
// self-asserting verification: a failing lifecycle is a broken capability, so it exits non-zero.
import { mkdtempSync, mkdirSync, rmSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const MAX_COUNT = 16;
const BRANCH_PREFIX = 'seed/wt-';

// --- git plumbing. Everything the dry-run does happens inside its own scratch repo; the caller's
// --- repository is never an argument, so a run cannot mutate it.
function git(cwd: string, ...args: string[]): void {
  const res = spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8' });
  if (res.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed in ${cwd}:\n${res.stdout ?? ''}${res.stderr ?? ''}`);
  }
}

function gitCapture(cwd: string, ...args: string[]): string {
  return `${spawnSync('git', ['-C', cwd, ...args], { encoding: 'utf8' }).stdout ?? ''}`.trim();
}

// Commit with signing/hooks disabled so the scratch repo behaves identically on any laptop and
// any CI runner (the self-test's gitCommitAll methodology).
function gitCommit(cwd: string, message: string): void {
  git(
    cwd,
    '-c', 'user.email=seed@worktrees',
    '-c', 'user.name=Seed Worktrees',
    '-c', 'commit.gpgsign=false',
    'commit', '--quiet', '--no-verify', '-m', message,
  );
}

/** Number of registered worktrees (the main worktree plus any added), from the porcelain list. */
function worktreeCount(repo: string): number {
  return gitCapture(repo, 'worktree', 'list', '--porcelain')
    .split('\n')
    .filter((l) => l.startsWith('worktree ')).length;
}

// --- the host-adapter contract. This is the boundary SEED.md §4 draws: the genome owns the git
// --- lifecycle; a host adapter owns what "boot an instance" means for a given host.
export interface WorktreeInstance {
  worktree: string; // absolute path of the isolated checkout
  branch: string;   // the branch the worktree is on
  handle: string;   // the host's handle for the booted instance (queryable by the agent)
}

export interface HostAdapter {
  /** Boot one fully isolated instance of the system for this worktree. */
  boot(worktree: string, branch: string): WorktreeInstance;
  /** Release whatever boot() acquired. Called once per instance at task end. */
  teardown(instance: WorktreeInstance): void;
}

// The genome's default adapter is host-AGNOSTIC: "boot an instance" here means only that the
// worktree is a self-contained checkout the agent can query on its own (SEED.md §4: "its own
// logs and metrics, queryable by you"), so the handle is the worktree's independent HEAD and
// there is no host-specific resource to release. A real host adapter (an iOS-simulator boot, a
// dev-build cache keyed to main's hash, a Metro/Orbit fast boot) implements this same contract
// and lives OUTSIDE the genome — the whole point of the boundary.
export const genomeAdapter: HostAdapter = {
  boot(worktree, branch) {
    return { worktree, branch, handle: gitCapture(worktree, 'rev-parse', 'HEAD') };
  },
  teardown() {
    /* no host-specific resource to release in the genome */
  },
};

// --- the dry-run.

type Fault = 'none' | 'leak' | 'skip-teardown';

interface CheckLine {
  name: string;
  ok: boolean;
  detail: string;
}

export interface DryRunResult {
  count: number;
  scratch: string;
  ok: boolean;
  checks: CheckLine[];
}

/**
 * Create → isolate → boot → teardown → cleanup, in a hermetic scratch repo. Returns the checks
 * and an overall verdict. `fault` (test-only, driven by --inject) forces a specific defect so the
 * self-tests can prove the isolation/cleanup assertions actually fire — a dry-run whose checks
 * can never go red proves nothing (LAW-2). The scratch tree is removed in the finally regardless
 * of outcome, so even an injected failure leaves no trace.
 */
export function dryRun(count: number, fault: Fault, adapter: HostAdapter = genomeAdapter): DryRunResult {
  const checks: CheckLine[] = [];
  const record = (name: string, ok: boolean, detail = ''): void => {
    checks.push({ name, ok, detail });
  };
  const scratch = mkdtempSync(join(tmpdir(), 'seed-worktrees-dryrun-'));
  try {
    // A base repo with one commit — worktree add needs a commit to branch from.
    const base = join(scratch, 'base');
    mkdirSync(base);
    git(base, 'init', '--quiet', '-b', 'main');
    writeFileSync(join(base, 'base.txt'), 'base\n');
    git(base, 'add', 'base.txt');
    gitCommit(base, 'base commit');
    const baseHead = gitCapture(base, 'rev-parse', 'HEAD');
    const baselineWorktrees = worktreeCount(base); // the main worktree only → 1

    // Count boot/teardown dispatches through the adapter so BOTH halves of the host-adapter
    // contract are observable and teeth-tested — not just the git worktree removal. Wrapping the
    // adapter here (rather than asserting on the no-op genomeAdapter, which releases nothing
    // observable) means dropping either dispatch turns the dry-run red, and `skip-teardown` forces
    // the teardown-dispatch check to fire. Without this, deleting the per-instance teardown call
    // would ship green — the "torn down at task end" guarantee (SEED.md §4) unverified.
    let bootDispatched = 0;
    let teardownDispatched = 0;
    const dispatch: HostAdapter = {
      boot: (worktree, branch) => {
        bootDispatched++;
        return adapter.boot(worktree, branch);
      },
      teardown: (instance) => {
        teardownDispatched++;
        adapter.teardown(instance);
      },
    };

    // Create N isolated worktrees, each on its own branch, and boot an instance in each.
    const wtRoot = join(scratch, 'worktrees');
    mkdirSync(wtRoot);
    const instances: WorktreeInstance[] = [];
    for (let i = 1; i <= count; i++) {
      const path = join(wtRoot, `wt-${i}`);
      const branch = `${BRANCH_PREFIX}${i}`;
      git(base, 'worktree', 'add', '--quiet', path, '-b', branch);
      // Distinct working-tree content, committed on this worktree's own branch — so isolation is
      // provable both in the working tree (distinct files) and in history (divergent branches).
      writeFileSync(join(path, 'marker.txt'), `worktree ${i}\n`);
      git(path, 'add', 'marker.txt');
      gitCommit(path, `work in worktree ${i}`);
      instances.push(dispatch.boot(path, branch));
    }

    // Fault injection (test-only): simulate one worktree's work leaking into the base tree, which
    // the "no leak" isolation assertion must catch.
    if (fault === 'leak') writeFileSync(join(base, 'marker.txt'), 'worktree 1\n');

    // --- isolation assertions ---
    record(
      `worktree count rose to ${count + 1} (base + ${count})`,
      worktreeCount(base) === count + 1,
      `expected ${count + 1}, got ${worktreeCount(base)}`,
    );

    const seen = new Set<string>();
    let onOwnBranch = true;
    let distinctContent = true;
    for (let i = 1; i <= count; i++) {
      const path = join(wtRoot, `wt-${i}`);
      if (gitCapture(path, 'rev-parse', '--abbrev-ref', 'HEAD') !== `${BRANCH_PREFIX}${i}`) onOwnBranch = false;
      const content = readFileSync(join(path, 'marker.txt'), 'utf8');
      if (seen.has(content)) distinctContent = false;
      seen.add(content);
    }
    record('each worktree is checked out on its own branch', onOwnBranch, 'a worktree was not on seed/wt-<i>');
    record('each worktree holds distinct working-tree content', distinctContent, 'two worktrees shared content');
    // The base branch never saw any worktree's committed marker — commits stay on their branch.
    const noLeak = !existsSync(join(base, 'marker.txt'));
    record("no worktree's work leaked into the base tree", noLeak, 'base/marker.txt exists — isolation broke');
    record(
      'the base branch HEAD is unchanged (per-branch commit isolation)',
      gitCapture(base, 'rev-parse', 'HEAD') === baseHead,
      'base HEAD moved',
    );
    record(
      `all ${count} instances booted with a queryable handle`,
      instances.length === count && instances.every((x) => x.handle.length > 0),
      'an instance booted without a handle',
    );
    record(
      `boot dispatched once per worktree (${count})`,
      bootDispatched === count,
      `expected ${count} boot dispatch(es), got ${bootDispatched}`,
    );

    // --- teardown through the adapter + git. The whole per-instance teardown (adapter release +
    // git removal) sits under the guard, so `skip-teardown` skips the adapter.teardown dispatch
    // too — that is what gives the teardown-dispatch check below its teeth. ---
    for (const instance of instances) {
      if (fault !== 'skip-teardown') {
        dispatch.teardown(instance);
        git(base, 'worktree', 'remove', '--force', instance.worktree);
        git(base, 'branch', '-D', instance.branch);
      }
    }
    git(base, 'worktree', 'prune');

    // --- cleanup assertions ---
    record(
      'worktree count returned to baseline after teardown',
      worktreeCount(base) === baselineWorktrees,
      `expected ${baselineWorktrees}, got ${worktreeCount(base)} — a worktree was not torn down`,
    );
    record(
      `no ${BRANCH_PREFIX}* branches remain`,
      gitCapture(base, 'branch', '--list', `${BRANCH_PREFIX}*`) === '',
      'a task branch survived teardown',
    );
    let dirsGone = true;
    for (let i = 1; i <= count; i++) if (existsSync(join(wtRoot, `wt-${i}`))) dirsGone = false;
    record('every worktree directory was removed', dirsGone, 'a worktree directory survived teardown');
    record(
      `teardown dispatched once per booted instance (${count})`,
      teardownDispatched === count,
      `expected ${count} teardown dispatch(es), got ${teardownDispatched} — an instance was not torn down (SEED.md §4: torn down at task end)`,
    );

    return { count, scratch, ok: checks.every((c) => c.ok), checks };
  } finally {
    // Hermetic: leave no trace, even when an assertion (or an injected fault) failed.
    rmSync(scratch, { recursive: true, force: true });
  }
}

// --- CLI ---

function usage(message: string): never {
  console.error(`worktrees: ${message}`);
  console.error('usage: node .seed/checks/worktrees.ts dry-run [--count N] [--json]');
  process.exit(2);
}

function humanReport(r: DryRunResult): void {
  console.log('parallel-worktrees — dry-run (LAW-6: every capability ships verification)\n');
  console.log(`created, isolated, booted, and tore down ${r.count} worktree(s) in a hermetic scratch repo\n`);
  for (const c of r.checks) console.log(c.ok ? `✓ ${c.name}` : `✗ ${c.name}\n    ${c.detail}`);
  console.log(
    r.ok
      ? '\n✓ isolation and cleanup held — the scratch repo was removed, leaving no trace'
      : '\n✗ dry-run FAILED — a worktree-lifecycle assertion did not hold (see above). The capability is broken (LAW-6).',
  );
}

function main(): void {
  const args = process.argv.slice(2);
  const mode = args[0];
  if (mode === undefined) usage('missing mode — the only mode is `dry-run`');
  if (mode !== 'dry-run') usage(`unknown mode: ${mode} — the only mode is \`dry-run\``);

  const flags = args.slice(1);
  const json = flags.includes('--json');

  let count = 3;
  const ci = flags.indexOf('--count');
  if (ci !== -1) {
    const v = Number(flags[ci + 1]);
    if (!Number.isInteger(v) || v < 1 || v > MAX_COUNT) usage(`--count must be an integer in 1..${MAX_COUNT}`);
    count = v;
  }

  // --inject is a test-only affordance: it forces a fault so the self-tests can prove the
  // dry-run's assertions have teeth. Documented in the header and ring 0019; kept off the usage
  // line because it is not a user-facing knob.
  let fault: Fault = 'none';
  const fi = flags.indexOf('--inject');
  if (fi !== -1) {
    const f = flags[fi + 1];
    if (f !== 'leak' && f !== 'skip-teardown') usage(`unknown --inject fault: ${f}`);
    fault = f;
  }

  const result = dryRun(count, fault);
  if (json) console.log(JSON.stringify({ mode: 'dry-run', count: result.count, scratch: result.scratch, ok: result.ok, checks: result.checks }));
  else humanReport(result);
  process.exit(result.ok ? 0 : 1);
}

try {
  main();
} catch (e) {
  // A thrown error (e.g. git unavailable) is a broken capability, not a passing dry-run.
  console.error(`worktrees: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
}
