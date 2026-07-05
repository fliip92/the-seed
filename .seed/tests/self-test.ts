// Machinery self-tests (converted from ledger E-007, folding in the E-005 gate): every
// violation class the checks claim to catch is seeded into a temp copy of this very
// repository, the copy's own run-all.ts is executed, and the output must name the right
// check, the law, and a usable message (LAW-6: every capability ships verification —
// this is the verification of the verifiers).
//
// Run: npm test  (or: node .seed/tests/self-test.ts)
//
// Each case copies the working tree (minus .git/node_modules) to a fresh temp dir,
// mutates it, and asserts on the real end-to-end path CI runs — exit code included.
// The append-only gate cases additionally `git init` the copy, so gate history is real.
import { cpSync, mkdtempSync, rmSync, writeFileSync, readFileSync, appendFileSync, readdirSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { REPO_ROOT } from '../lib/repo.ts';

const ANATOMY = 'seed/validate-anatomy';
const MAP = 'seed/validate-map';
const RINGS = 'seed/validate-rings';
const PLANS = 'seed/validate-plans';
const GATE = 'seed/ring-append-only';
const TRACE = 'seed/plan-traceability';

const LAW2 = "LAW-2 — legible and enforceable, or it doesn't exist";
const LAW4 = 'LAW-4 — the map is the entry point';
const LAW5 = 'LAW-5 — plans are first-class artifacts';
const LAW8 = 'LAW-8 — entropy is paid continuously';
const LAW10 = 'LAW-10 — escalate scarce judgment; never ask twice';

const COPY_SKIP = new Set(['.git', 'node_modules', '.DS_Store']);

// Fixture numbers are derived from the repository's current maxima, never hardcoded:
// cutting the next real ring/plan/ledger entry must not turn a seeded gap into a valid
// sequence and fail CI on a correct commit.
const pad4 = (n: number): string => String(n).padStart(4, '0');
const pad3 = (n: number): string => String(n).padStart(3, '0');
const maxOf = (values: string[], re: RegExp): number =>
  values.reduce((max, v) => Math.max(max, Number(v.match(re)?.[1] ?? 0)), 0);

const ringMax = maxOf(readdirSync(join(REPO_ROOT, 'docs/rings')), /^(\d{4})-/);
const planMax = maxOf(
  [
    ...readdirSync(join(REPO_ROOT, 'docs/plans/active')),
    ...readdirSync(join(REPO_ROOT, 'docs/plans/completed')),
  ],
  /^(\d{4})-/,
);
const ledgerMax = maxOf(
  readFileSync(join(REPO_ROOT, 'docs/plans/entropy-ledger.md'), 'utf8').split('\n'),
  /^## E-(\d{3}) /,
);

// DUP duplicates the current max (which exists forever — artifacts are append-only),
// NEXT is the first free number (a valid fixture), GAP skips exactly one.
const RING_DUP = pad4(ringMax);
const RING_NEXT = pad4(ringMax + 1);
const RING_GAP = pad4(ringMax + 2);
const PLAN_DUP = pad4(planMax);
const PLAN_NEXT = pad4(planMax + 1);
const PLAN_GAP = pad4(planMax + 2);
const LEDGER_DUP = pad3(ledgerMax);
const LEDGER_NEXT = pad3(ledgerMax + 1);
const LEDGER_GAP = pad3(ledgerMax + 2);

function copyRepo(): string {
  const root = mkdtempSync(join(tmpdir(), 'seed-selftest-'));
  cpSync(REPO_ROOT, root, {
    recursive: true,
    filter: (src) => !COPY_SKIP.has(basename(src)),
  });
  return root;
}

interface RunResult {
  status: number | null;
  output: string;
}

function runNode(root: string, script: string, args: string[] = []): RunResult {
  const res = spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: 'utf8' });
  return { status: res.status, output: `${res.stdout ?? ''}${res.stderr ?? ''}` };
}

const runChecks = (root: string): RunResult => runNode(root, '.seed/checks/run-all.ts');
const runGate = (root: string, args: string[]): RunResult =>
  runNode(root, '.seed/checks/ring-append-only.ts', args);
const runTraceGate = (root: string, args: string[]): RunResult =>
  runNode(root, '.seed/checks/plan-traceability.ts', args);

function git(root: string, ...args: string[]): void {
  const res = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  if (res.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed in ${root}:\n${res.stdout}${res.stderr}`);
  }
}

// Commit with everything a host machine might inject (signing, hooks) disabled — the
// scratch repo must behave identically on any laptop and any CI runner.
function gitCommitAll(root: string, message: string): void {
  git(root, 'add', '-A');
  git(
    root,
    '-c', 'user.email=self-test@seed',
    '-c', 'user.name=Seed Self-Test',
    '-c', 'commit.gpgsign=false',
    'commit', '--quiet', '--no-verify', '-m', message,
  );
}

const edit = (root: string, relPath: string, fn: (content: string) => string): void =>
  writeFileSync(join(root, relPath), fn(readFileSync(join(root, relPath), 'utf8')));
const append = (root: string, relPath: string, text: string): void =>
  appendFileSync(join(root, relPath), text);
const write = (root: string, relPath: string, text: string): void =>
  writeFileSync(join(root, relPath), text);

// --- valid fixtures: each helper produces content the corresponding check accepts, so a
// --- case fails for exactly the one field it then breaks.

function validRing(num: string, opts: { title?: string; drop?: string; enforcement?: string } = {}): string {
  const fields = [
    '- Date: 2026-07-04',
    '- Stage: 1 — Rooting',
    '- Raised-by: seed',
    '- Question: Is this self-test fixture valid?',
    '- Decision: Yes — it exists only inside a temp copy.',
    '- Alternatives considered: None — fixture.',
    opts.enforcement ?? '- Enforcement: structural test — fixture of .seed/tests/self-test.ts.',
    '- Revisit-when: Never — fixture.',
  ].filter((f) => (opts.drop === undefined ? true : !f.startsWith(`- ${opts.drop}:`)));
  return [`# Ring ${opts.title ?? `${num} — Self-test fixture`}`, '', ...fields, ''].join('\n');
}

function validPlan(num: string, opts: { title?: string; status?: string | null; dropSection?: string; progress?: string[] } = {}): string {
  const sections: string[] = [
    `# Plan ${opts.title ?? `${num} — Self-test fixture`}`,
    '',
    ...(opts.status === null ? [] : [opts.status ?? '- Status: active', '']),
    '## Goal',
    '',
    'Exist only inside a self-test temp copy.',
    '',
    '## Progress log',
    '',
    ...(opts.progress ?? ['- **2026-07-04** — Fixture created.']),
    '',
    '## Decision log',
    '',
    '- None.',
    '',
    '## Next actions',
    '',
    '1. None — fixture.',
    '',
  ];
  return sections
    .filter((l) => (opts.dropSection === undefined ? true : l !== opts.dropSection))
    .join('\n');
}

function validLedgerEntry(num: string, opts: { drop?: string } = {}): string {
  const fields = [
    '- First observed: 2026-07-04, self-test fixture',
    '- Where: nowhere — this entry exists only inside a self-test temp copy',
    '- Interest rate: low (fixture)',
    '- Price: trivial — fixture',
    '- Conversion path: deletion — fixture entry, delete on sight',
  ].filter((f) => (opts.drop === undefined ? true : !f.startsWith(`- ${opts.drop}:`)));
  return ['', `## E-${num} — Self-test fixture debt`, '', ...fields, ''].join('\n');
}

// --- cases ---

interface ViolationCase {
  name: string;
  seed: (root: string) => void;
  expect: { check: string; law: string; contains: string[] };
}

const CASES: ViolationCase[] = [
  {
    name: 'anatomy: required file missing',
    seed: (r) => rmSync(join(r, 'LICENSE')),
    expect: { check: ANATOMY, law: LAW2, contains: ['required anatomy file missing: LICENSE'] },
  },
  {
    name: 'map: dead link',
    seed: (r) => append(r, 'AGENTS.md', '\nSee [ghost](docs/ghost.md).\n'),
    expect: { check: MAP, law: LAW4, contains: ['dead link', 'docs/ghost.md'] },
  },
  {
    name: 'map: link to a directory',
    seed: (r) => append(r, 'AGENTS.md', '\nSee [the rings](docs/rings).\n'),
    expect: { check: MAP, law: LAW4, contains: ['links to a directory'] },
  },
  {
    name: 'map: reference-style link definition',
    seed: (r) => append(r, 'AGENTS.md', '\n[genome]: SEED.md\n'),
    expect: { check: MAP, law: LAW4, contains: ['reference-style link definition'] },
  },
  {
    name: 'map: HTML link',
    seed: (r) => append(r, 'AGENTS.md', '\nSee <a href="SEED.md">the genome</a>.\n'),
    expect: { check: MAP, law: LAW4, contains: ['HTML link'] },
  },
  {
    name: 'map: unreachable file',
    seed: (r) => write(r, 'docs/orphan.md', '# Orphan\n\nNothing links here.\n'),
    expect: { check: MAP, law: LAW4, contains: ['docs/orphan.md is not reachable within 3 hops'] },
  },
  {
    name: 'map: dead link inside an unreachable file (sweep path)',
    seed: (r) => write(r, 'docs/orphan.md', '# Orphan\n\n[gone](gone.md)\n'),
    expect: { check: MAP, law: LAW4, contains: ['docs/orphan.md:3 dead link'] },
  },
  {
    name: 'rings: bad filename',
    seed: (r) => write(r, 'docs/rings/not-a-ring.md', validRing(RING_NEXT)),
    expect: { check: RINGS, law: LAW10, contains: ['does not match the ring filename format'] },
  },
  {
    name: 'rings: invalid title line',
    seed: (r) => write(r, `docs/rings/${RING_NEXT}-fixture.md`, validRing(RING_NEXT, { title: 'without the required shape' })),
    expect: { check: RINGS, law: LAW10, contains: ['first line is not a valid ring title'] },
  },
  {
    name: 'rings: title number != filename number',
    seed: (r) => write(r, `docs/rings/${RING_NEXT}-fixture.md`, validRing(RING_NEXT, { title: `${RING_GAP} — Self-test fixture` })),
    expect: { check: RINGS, law: LAW10, contains: [`title number ${RING_GAP} does not match filename number ${RING_NEXT}`] },
  },
  {
    name: 'rings: missing required field',
    seed: (r) => write(r, `docs/rings/${RING_NEXT}-fixture.md`, validRing(RING_NEXT, { drop: 'Revisit-when' })),
    expect: { check: RINGS, law: LAW10, contains: ['missing or malforms required field: Revisit-when'] },
  },
  {
    name: 'rings: Enforcement names no mechanism',
    seed: (r) => write(r, `docs/rings/${RING_NEXT}-fixture.md`, validRing(RING_NEXT, { enforcement: '- Enforcement: we will be careful' })),
    expect: { check: RINGS, law: LAW2, contains: ['Enforcement field names no mechanism'] },
  },
  {
    name: 'rings: duplicate number',
    seed: (r) => write(r, `docs/rings/${RING_DUP}-fixture.md`, validRing(RING_DUP)),
    expect: { check: RINGS, law: LAW10, contains: [`duplicate ring number ${RING_DUP}`] },
  },
  {
    name: 'rings: numbering gap',
    seed: (r) => write(r, `docs/rings/${RING_GAP}-fixture.md`, validRing(RING_GAP)),
    expect: { check: RINGS, law: LAW10, contains: [`ring numbering gap: found ${RING_GAP} where ${RING_NEXT} was expected`] },
  },
  {
    name: 'plans: plan file at docs/plans/ root',
    seed: (r) => write(r, `docs/plans/${PLAN_NEXT}-stray.md`, validPlan(PLAN_NEXT)),
    expect: { check: PLANS, law: LAW5, contains: ['sits directly in docs/plans/'] },
  },
  {
    name: 'plans: bad filename',
    seed: (r) => write(r, 'docs/plans/active/stray.md', validPlan(PLAN_NEXT)),
    expect: { check: PLANS, law: LAW5, contains: ['does not match the plan filename format'] },
  },
  {
    name: 'plans: invalid title line',
    seed: (r) => write(r, `docs/plans/active/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT, { title: 'three' })),
    expect: { check: PLANS, law: LAW5, contains: ['must start with'] },
  },
  {
    name: 'plans: missing Status line',
    seed: (r) => write(r, `docs/plans/active/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT, { status: null })),
    expect: { check: PLANS, law: LAW5, contains: ['has no valid'] },
  },
  {
    name: 'plans: in completed/ with non-completed status',
    seed: (r) => write(r, `docs/plans/completed/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT)),
    expect: { check: PLANS, law: LAW5, contains: ['is in completed/ but its status is "active"'] },
  },
  {
    name: 'plans: in active/ with completed status',
    seed: (r) => write(r, `docs/plans/active/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT, { status: '- Status: completed 2026-07-04' })),
    expect: { check: PLANS, law: LAW5, contains: ['is in active/ but its status'] },
  },
  {
    name: 'plans: missing required section',
    seed: (r) => write(r, `docs/plans/active/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT, { dropSection: '## Next actions' })),
    expect: { check: PLANS, law: LAW5, contains: ['missing required section: ## Next actions'] },
  },
  {
    name: 'plans: Progress log with no dated entries',
    seed: (r) => write(r, `docs/plans/active/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT, { progress: ['- An undated note.'] })),
    expect: { check: PLANS, law: LAW5, contains: ['Progress log has no dated entries'] },
  },
  {
    name: 'plans: Progress log dates out of order',
    seed: (r) =>
      write(r, `docs/plans/active/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT, {
        progress: ['- **2026-07-04** — Later entry first.', '- **2026-07-01** — Earlier entry last.'],
      })),
    expect: { check: PLANS, law: LAW5, contains: ['Progress log entries out of order'] },
  },
  {
    name: 'plans: duplicate number across active/ and completed/',
    seed: (r) => write(r, `docs/plans/active/${PLAN_DUP}-fixture.md`, validPlan(PLAN_DUP)),
    expect: { check: PLANS, law: LAW5, contains: [`duplicate plan number ${PLAN_DUP}`] },
  },
  {
    name: 'plans: numbering gap',
    seed: (r) => write(r, `docs/plans/active/${PLAN_GAP}-fixture.md`, validPlan(PLAN_GAP)),
    expect: { check: PLANS, law: LAW5, contains: [`plan numbering gap: found ${PLAN_GAP} where ${PLAN_NEXT} was expected`] },
  },
  {
    name: 'ledger: missing ## Paid section',
    seed: (r) => edit(r, 'docs/plans/entropy-ledger.md', (c) => c.replace(/^## Paid\s*$/m, '')),
    expect: { check: PLANS, law: LAW8, contains: ['is missing its', '## Paid'] },
  },
  {
    name: 'ledger: heading that is neither Open, Paid, nor an entry',
    seed: (r) => append(r, 'docs/plans/entropy-ledger.md', '\n## E-9 — malformed fixture heading\n'),
    expect: { check: PLANS, law: LAW8, contains: ['neither Open, Paid, nor a valid entry'] },
  },
  {
    name: 'ledger: entry missing a field',
    seed: (r) => append(r, 'docs/plans/entropy-ledger.md', validLedgerEntry(LEDGER_NEXT, { drop: 'Interest rate' })),
    expect: { check: PLANS, law: LAW8, contains: [`E-${LEDGER_NEXT} is missing or malforms field: Interest rate`] },
  },
  {
    name: 'ledger: duplicate entry number',
    seed: (r) => append(r, 'docs/plans/entropy-ledger.md', validLedgerEntry(LEDGER_DUP)),
    expect: { check: PLANS, law: LAW8, contains: [`duplicate ledger number E-${LEDGER_DUP}`] },
  },
  {
    name: 'ledger: numbering gap',
    seed: (r) => append(r, 'docs/plans/entropy-ledger.md', validLedgerEntry(LEDGER_GAP)),
    expect: { check: PLANS, law: LAW8, contains: [`ledger numbering gap: found E-${LEDGER_GAP} where E-${LEDGER_NEXT} was expected`] },
  },
  {
    name: 'anatomy: symlinked file',
    seed: (r) => symlinkSync('../SEED.md', join(r, 'docs/genome-link.md')),
    expect: { check: ANATOMY, law: LAW2, contains: ['docs/genome-link.md is a symbolic link'] },
  },
];

// --- runner ---

let failures = 0;
let ran = 0;

function report(name: string, ok: boolean, detail: string): void {
  ran++;
  if (ok) {
    console.log(`✓ ${name}`);
  } else {
    failures++;
    console.log(`✗ ${name}\n    ${detail.split('\n').join('\n    ')}`);
  }
}

function inTempCopy(fn: (root: string) => void): void {
  const root = copyRepo();
  try {
    fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

console.log('seed self-tests — LAW-6: every capability ships verification\n');

// The pristine copy must pass: a harness that cannot run the checks green cannot prove
// anything by seeing them go red.
inTempCopy((root) => {
  const { status, output } = runChecks(root);
  report(
    'pristine copy passes all checks',
    status === 0 && output.includes('all checks passed'),
    `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
  );
});

for (const c of CASES) {
  inTempCopy((root) => {
    c.seed(root);
    const { status, output } = runChecks(root);
    const marker = `[${c.expect.check}]`;
    const law = `law: ${c.expect.law}`;
    const missing = [marker, law, ...c.expect.contains].filter((s) => !output.includes(s));
    report(
      c.name,
      status === 1 && missing.length === 0,
      `expected exit 1 with ${JSON.stringify([marker, law, ...c.expect.contains])}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
    );
  });
}

// --- ring append-only gate (E-005): needs real git history, so these cases init a
// --- scratch repo inside the temp copy.

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  append(root, 'docs/rings/0001-founding-defaults.md', '\nA silent rewrite of history.\n');
  gitCommitAll(root, 'tamper with a ring');
  const { status, output } = runGate(root, ['HEAD~1']);
  const wanted = [`[${GATE}]`, `law: ${LAW10}`, 'modified'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'gate: modifying an existing ring fails',
    status === 1 && missing.length === 0,
    `expected exit 1 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  rmSync(join(root, 'docs/rings/0009-stage-1-transition-approved.md'));
  gitCommitAll(root, 'delete a ring');
  const { status, output } = runGate(root, ['HEAD~1']);
  const wanted = [`[${GATE}]`, `law: ${LAW10}`, 'deleted'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'gate: deleting an existing ring fails',
    status === 1 && missing.length === 0,
    `expected exit 1 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  write(root, `docs/rings/${RING_NEXT}-fixture.md`, validRing(RING_NEXT));
  append(root, 'docs/rings/README.md', '\n- appended index line for the fixture ring\n');
  gitCommitAll(root, 'append a ring and update the index');
  const { status, output } = runGate(root, ['HEAD~1']);
  report(
    'gate: appending a new ring (and updating the index) passes',
    status === 0 && output.includes('append-only holds'),
    `expected exit 0 + "append-only holds", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'only commit');
  const { status, output } = runGate(root, ['0000000000000000000000000000000000000000']);
  report(
    'gate: unresolvable base skips with an explicit note',
    status === 0 && output.includes('gate skipped'),
    `expected exit 0 + "gate skipped", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet', '-b', 'main');
  gitCommitAll(root, 'base');
  git(root, 'checkout', '--quiet', '--orphan', 'rootless');
  gitCommitAll(root, 'history with no common ancestor');
  const { status, output } = runGate(root, ['main']);
  report(
    'gate: base with no shared history skips with an explicit note',
    status === 0 && output.includes('gate skipped'),
    `expected exit 0 + "gate skipped", got exit ${status}:\n${output}`,
  );
});

// --- plan traceability gate (E-003): every non-merge commit since the base must
// --- reference an existing plan or ring in its message. The current maxima double as
// --- guaranteed-existing references (artifacts are append-only and kept forever).

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  append(root, 'AGENTS.md', '\n');
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: a change that names its plan`);
  const { status, output } = runTraceGate(root, ['HEAD~1']);
  report(
    'traceability: commit referencing an existing plan passes',
    status === 0 && output.includes('trace to a plan or ring'),
    `expected exit 0 + "trace to a plan or ring", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  append(root, 'AGENTS.md', '\n');
  gitCommitAll(root, `Fixture change decided by ring ${RING_DUP}`);
  const { status, output } = runTraceGate(root, ['HEAD~1']);
  report(
    'traceability: commit referencing an existing ring passes',
    status === 0 && output.includes('trace to a plan or ring'),
    `expected exit 0 + "trace to a plan or ring", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  append(root, 'AGENTS.md', '\n');
  gitCommitAll(root, 'a change that references nothing at all');
  const { status, output } = runTraceGate(root, ['HEAD~1']);
  const wanted = [`[${TRACE}]`, `law: ${LAW5}`, 'no plan or ring reference'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'traceability: commit with no reference fails',
    status === 1 && missing.length === 0,
    `expected exit 1 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  append(root, 'AGENTS.md', '\n');
  gitCommitAll(root, `a change blaming ring ${RING_GAP}, which does not exist`);
  const { status, output } = runTraceGate(root, ['HEAD~1']);
  const wanted = [`[${TRACE}]`, `law: ${LAW5}`, 'none of these exist'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'traceability: commit referencing a nonexistent ring fails',
    status === 1 && missing.length === 0,
    `expected exit 1 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet', '-b', 'main');
  gitCommitAll(root, 'base');
  git(root, 'checkout', '--quiet', '-b', 'topic');
  append(root, 'AGENTS.md', '\n');
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: traced work on a branch`);
  git(root, 'checkout', '--quiet', 'main');
  git(
    root,
    '-c', 'user.email=self-test@seed',
    '-c', 'user.name=Seed Self-Test',
    '-c', 'commit.gpgsign=false',
    'merge', '--quiet', '--no-ff', '--no-verify', '-m', 'Merge branch topic', 'topic',
  );
  const { status, output } = runTraceGate(root, ['HEAD^1']);
  report(
    'traceability: merge commit is exempt, carried commits still checked',
    status === 0 && output.includes('all 1 new commit(s)'),
    `expected exit 0 + "all 1 new commit(s)", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'only commit');
  const { status, output } = runTraceGate(root, ['0000000000000000000000000000000000000000']);
  report(
    'traceability: unresolvable base skips with an explicit note',
    status === 0 && output.includes('gate skipped'),
    `expected exit 0 + "gate skipped", got exit ${status}:\n${output}`,
  );
});

console.log(
  failures > 0
    ? `\n${failures}/${ran} self-test(s) failed. A validator that does not fire on its violation class is doc-only enforcement wearing a costume (LAW-2).`
    : `\nall ${ran} self-tests passed — every violation class fires its check, the gate holds, and the pristine tree is green.`,
);
process.exit(failures > 0 ? 1 : 0);
