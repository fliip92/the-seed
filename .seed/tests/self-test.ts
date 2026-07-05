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
const AUTOMERGE = 'seed/automerge-scope';

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
const runDrift = (root: string): RunResult => runNode(root, '.seed/checks/doc-drift.ts');
const runFitness = (root: string, args: string[] = []): RunResult => runNode(root, '.seed/checks/fitness.ts', args);
const runAutomergeGate = (root: string, args: string[]): RunResult =>
  runNode(root, '.seed/checks/automerge-scope.ts', args);
const runReport = (root: string, args: string[] = []): RunResult =>
  runNode(root, '.seed/checks/gardening-report.ts', args);

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

// Same as gitCommitAll, but with a controllable author/committer date — needed to put a
// commit outside fitness.ts's ledger_trend trailing-7-day window on purpose.
function gitCommitAllAt(root: string, message: string, iso: string): void {
  git(root, 'add', '-A');
  const res = spawnSync(
    'git',
    [
      '-C', root,
      '-c', 'user.email=self-test@seed',
      '-c', 'user.name=Seed Self-Test',
      '-c', 'commit.gpgsign=false',
      'commit', '--quiet', '--no-verify', '-m', message,
    ],
    { encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_DATE: iso, GIT_COMMITTER_DATE: iso } },
  );
  if (res.status !== 0) {
    throw new Error(`dated git commit failed in ${root}:\n${res.stdout}${res.stderr}`);
  }
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

function validPrinciple(name: string, opts: { enforcement?: string | null } = {}): string {
  const lines = [
    `# ${name}`,
    '',
    '- Statement: Self-test fixture principle.',
    '- Rationale: Exists only inside a self-test temp copy.',
  ];
  if (opts.enforcement !== null) lines.push(`- Enforcement: ${opts.enforcement ?? 'structural test — fixture'}`);
  lines.push('- Exceptions: none', '');
  return lines.join('\n');
}

// A minimal synthetic ledger for fitness.ts's ledger_trend: only the heading structure
// ledgerCounts() parses matters here, not validate-plans.ts's full field set (these cases
// run fitness.ts directly, never through run-all.ts).
function minimalLedger(openEntries: number, paidEntries: number): string {
  const lines: string[] = ['# Entropy ledger', '', '## Open', ''];
  let n = 1;
  for (let i = 0; i < openEntries; i++) lines.push(`## E-${pad3(n++)} — Self-test fixture debt`, '');
  lines.push('## Paid', '');
  for (let i = 0; i < paidEntries; i++) lines.push(`## E-${pad3(n++)} — Self-test fixture debt`, '');
  return lines.join('\n');
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
    // Guards the ring-0013 plan-link resolver against over-resolving: a well-formed plan
    // path whose plan exists in NEITHER active/ nor completed/ must still be a dead link.
    name: 'map: a plan-shaped link resolving to no plan in either directory is still dead',
    seed: (r) => append(r, 'AGENTS.md', `\nSee [ghost plan](docs/plans/active/${PLAN_GAP}-ghost.md).\n`),
    expect: { check: MAP, law: LAW4, contains: ['dead link', `docs/plans/active/${PLAN_GAP}-ghost.md`] },
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

// --- plan links resolve across the active/⇄completed/ move (ring 0013). A plan closes by
// --- `git mv` into completed/, but append-only rings link it by its active/ path and cannot
// --- be repointed; validate-map must resolve the link to the plan wherever it now lives,
// --- without weakening dead-link detection (the still-dead guard is a CASES entry above).
inTempCopy((root) => {
  write(
    root,
    `docs/plans/completed/${PLAN_NEXT}-fixture.md`,
    validPlan(PLAN_NEXT, { status: '- Status: completed 2026-07-04' }),
  );
  append(
    root,
    'docs/plans/completed/README.md',
    `\n- [${PLAN_NEXT} fixture](../active/${PLAN_NEXT}-fixture.md) — self-test fixture: a completed plan linked by its active/ path.\n`,
  );
  const { status, output } = runChecks(root);
  report(
    'map: a completed plan linked by its active/ path resolves — no dead link (ring 0013)',
    status === 0 && output.includes('all checks passed'),
    `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
  );
});

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

// --- doc-gardener drift detector (plan 0002 scope item 3). It is ADVISORY (ring 0011):
// --- it reports drift_count and exits 0 even with findings, so these assert on output and
// --- on the exit code staying 0. A stale reference in a scanned current-state doc must
// --- fire; a template placeholder and a reference inside an excluded append-only region
// --- must stay silent — the precision guards that keep drift_count trustworthy. Pristine
// --- must be exactly 0, so a single seeded reference reads as drift_count 1.

inTempCopy((root) => {
  const { status, output } = runDrift(root);
  report(
    'drift: pristine copy reports drift_count 0',
    status === 0 && output.includes('drift_count 0'),
    `expected exit 0 + "drift_count 0", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  append(root, 'docs/references/README.md', '\nSee `.seed/checks/ghost-check.ts` for details.\n');
  const { status, output } = runDrift(root);
  const wanted = ['[doc-drift/stale-path-reference]', `law: ${LAW2}`, '.seed/checks/ghost-check.ts', 'drift_count 1'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'drift: a stale path reference in a current-state doc is detected and counted (advisory, exit 0)',
    status === 0 && missing.length === 0,
    `expected exit 0 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

inTempCopy((root) => {
  // Placeholders (<name>, NNNN) and every glob form (*, ?, [..], {..}) are patterns, not
  // path claims — all must be skipped, or drift_count becomes noise. Pins the PLACEHOLDER
  // guard including the [ ] ? classes a review found initially missing.
  append(
    root,
    'docs/references/README.md',
    '\nPatterns, not paths: `docs/rings/NNNN-slug.md`, `docs/principles/<name>.md`, `docs/rings/[0-9].md`, `docs/rings/000?-x.md`, `docs/fitness/history/*.json`.\n',
  );
  const { status, output } = runDrift(root);
  report(
    'drift: template placeholders and glob patterns are not flagged',
    status === 0 && output.includes('drift_count 0'),
    `expected exit 0 + "drift_count 0" (placeholders and globs skipped), got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  append(root, 'docs/rings/0001-founding-defaults.md', '\nA stale `.seed/checks/ghost-check.ts` inside an append-only ring.\n');
  const { status, output } = runDrift(root);
  report(
    'drift: a reference inside an excluded append-only region is not flagged',
    status === 0 && output.includes('drift_count 0'),
    `expected exit 0 + "drift_count 0" (rings excluded from the scan), got exit ${status}:\n${output}`,
  );
});

// A leading ./ is stripped to the repo-relative path — pins that normalization: without
// it the token starts with `.` (not a top-level entry) and would be silently missed.
inTempCopy((root) => {
  append(root, 'docs/references/README.md', '\nRelative form `./.seed/checks/ghost-check.ts` is the same repo-relative file.\n');
  const { status, output } = runDrift(root);
  const wanted = ['[doc-drift/stale-path-reference]', '.seed/checks/ghost-check.ts', 'drift_count 1'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'drift: a ./-prefixed stale reference is normalized and detected',
    status === 0 && missing.length === 0,
    `expected exit 0 with ${JSON.stringify(wanted)} (leading ./ stripped), got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

// A trailing :line / #fragment is stripped before the existence check — pins that
// normalization: without it the token fails the extension test and would be missed.
inTempCopy((root) => {
  append(root, 'docs/references/README.md', '\nWith a line anchor `.seed/checks/ghost-check.ts:42` names the same missing file.\n');
  const { status, output } = runDrift(root);
  const wanted = ['[doc-drift/stale-path-reference]', '.seed/checks/ghost-check.ts', 'drift_count 1'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'drift: a :line-decorated stale reference is normalized and detected',
    status === 0 && missing.length === 0 && !output.includes('ghost-check.ts:42'),
    `expected exit 0 with ${JSON.stringify(wanted)} (":42" stripped), got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

// The scan-surface INCLUSION side: detection must fire in a different scanned family than
// the docs/references case above — here the top-level README. Pins isScanned() against a
// regression that narrows the surface and silently stops detecting real drift.
inTempCopy((root) => {
  append(root, 'README.md', '\nBroken machinery pointer: `.seed/checks/ghost-check.ts`.\n');
  const { status, output } = runDrift(root);
  const wanted = ['[doc-drift/stale-path-reference]', 'README.md:', '.seed/checks/ghost-check.ts', 'drift_count 1'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'drift: a stale reference in a different scanned family (top-level README) is detected',
    status === 0 && missing.length === 0,
    `expected exit 0 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

// --- fitness v0 (plan 0002 scope item 4): computes the SEED.md §6 metrics and prints a
// --- dated snapshot. It is ADVISORY, like doc-drift — these cases assert on the computed
// --- numbers in its --json output, not on exit code alone. Two of its five metrics need
// --- real git history, so these cases init a scratch repo, like the gate tests above.

function fitnessMetrics(output: string): Record<string, unknown> {
  return (JSON.parse(output) as { metrics: Record<string, unknown> }).metrics;
}

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: base for fitness JSON shape`);
  const { status, output } = runFitness(root, ['--json']);
  let parsed: { date?: unknown; stage?: unknown; metrics?: Record<string, unknown> } | null = null;
  try {
    parsed = JSON.parse(output);
  } catch {
    parsed = null;
  }
  const wantedKeys = ['drift_count', 'enforcement_ratio', 'escalation_rate', 'ledger_trend', 'map_reachability', 'plan_traceability'];
  const gotKeys = parsed?.metrics ? Object.keys(parsed.metrics).sort() : [];
  report(
    'fitness: --json emits a {date, stage, metrics} snapshot with escalation_rate null',
    status === 0 &&
      typeof parsed?.date === 'string' &&
      typeof parsed?.stage === 'number' &&
      JSON.stringify(gotKeys) === JSON.stringify(wantedKeys) &&
      parsed?.metrics?.escalation_rate === null,
    `expected a well-formed snapshot with escalation_rate null, got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: base, no principles stated`);
  const { output } = runFitness(root, ['--json']);
  const m = fitnessMetrics(output);
  report(
    'fitness: enforcement_ratio is vacuously 1 with zero stated principles',
    m.enforcement_ratio === 1,
    `expected enforcement_ratio 1, got:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  write(root, 'docs/principles/enforced-example.md', validPrinciple('Enforced example'));
  write(root, 'docs/principles/missing-field-example.md', validPrinciple('Missing field example', { enforcement: null }));
  write(root, 'docs/principles/explicit-none-example.md', validPrinciple('Explicit none example', { enforcement: 'none' }));
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: three principles, two unenforced`);
  const { output } = runFitness(root, ['--json']);
  const m = fitnessMetrics(output);
  report(
    'fitness: enforcement_ratio counts a missing Enforcement field and an explicit "none" as unenforced',
    m.enforcement_ratio === 1 / 3,
    `expected enforcement_ratio 1/3, got:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  append(root, 'docs/references/README.md', '\nSee `.seed/checks/ghost-check.ts` for details.\n');
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: stale reference for fitness`);
  const { output } = runFitness(root, ['--json']);
  const m = fitnessMetrics(output);
  report(
    'fitness: drift_count matches the doc-gardener scan',
    m.drift_count === 1,
    `expected drift_count 1, got:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  write(root, 'docs/orphan.md', '# Orphan\n\nNothing links here.\n');
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: unreachable file for fitness`);
  const { output } = runFitness(root, ['--json']);
  const m = fitnessMetrics(output);
  report(
    'fitness: map_reachability drops below 1 when a file is unreachable',
    typeof m.map_reachability === 'number' && m.map_reachability < 1,
    `expected map_reachability < 1, got:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: a change that names its plan`);
  const { output } = runFitness(root, ['--json']);
  const m = fitnessMetrics(output);
  report(
    'fitness: plan_traceability is 1.0 across full history when every commit traces',
    m.plan_traceability === 1,
    `expected plan_traceability 1, got:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: base (traced)`);
  append(root, 'AGENTS.md', '\n');
  gitCommitAll(root, 'a change that references nothing at all');
  const { output } = runFitness(root, ['--json']);
  const m = fitnessMetrics(output);
  report(
    'fitness: plan_traceability is a fraction when one of two commits does not trace',
    m.plan_traceability === 0.5,
    `expected plan_traceability 0.5, got:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  write(root, 'docs/plans/entropy-ledger.md', minimalLedger(1, 0));
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: fresh ledger, whole history inside the window`);
  const { output } = runFitness(root, ['--json']);
  const m = fitnessMetrics(output);
  report(
    "fitness: ledger_trend baselines at zero when the ledger's whole history is younger than the window",
    m.ledger_trend === 1,
    `expected ledger_trend 1 (1 open entry, nothing existed before it), got:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  write(root, 'docs/plans/entropy-ledger.md', minimalLedger(1, 0));
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  gitCommitAllAt(root, `Plan ${PLAN_DUP} fixture: ledger baseline`, thirtyDaysAgo);
  write(root, 'docs/plans/entropy-ledger.md', minimalLedger(2, 0));
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: one more open entry this week`);
  const { output } = runFitness(root, ['--json']);
  const m = fitnessMetrics(output);
  report(
    'fitness: ledger_trend diffs against the state just before the trailing window (old baseline outside it)',
    m.ledger_trend === 1,
    `expected ledger_trend 1 (2 open now, 1 open a month ago), got:\n${output}`,
  );
});

// --- automerge-scope gate (E-008, plan 0002 scope item 5): a commit that DECLARES itself
// --- automerge-class (an `Automerge: <class>` trailer) must touch none of the Gardener-gated
// --- paths (SEED.md, existing ring content, principle statements). Unmarked commits are the
// --- Gardener-review path and are not this gate's business. Same scratch-git methodology as
// --- the two gates above. Markers ride in the commit-message body.

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  append(root, 'docs/references/README.md', '\nA mechanical link fix.\n');
  gitCommitAll(root, 'fix a link\n\nAutomerge: link');
  const { status, output } = runAutomergeGate(root, ['HEAD~1']);
  report(
    'automerge: marked commit touching only an allowed path passes',
    status === 0 && output.includes("stay within ring 0007's mechanical scope"),
    `expected exit 0 + "stay within ...", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  append(root, 'SEED.md', '\nA quiet edit to the genome.\n');
  gitCommitAll(root, 'touch the genome\n\nAutomerge: typo');
  const { status, output } = runAutomergeGate(root, ['HEAD~1']);
  const wanted = [`[${AUTOMERGE}]`, `law: ${LAW8}`, 'Gardener-gated path', 'SEED.md'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'automerge: marked commit touching SEED.md fails',
    status === 1 && missing.length === 0,
    `expected exit 1 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  // Cutting a ring is a LAW-10 decision, not mechanical — so adding a ring file under an
  // automerge marker must fail, independent of the append-only gate (which permits adds).
  write(root, `docs/rings/${RING_NEXT}-fixture.md`, validRing(RING_NEXT));
  gitCommitAll(root, 'slip in a ring\n\nAutomerge: ledger');
  const { status, output } = runAutomergeGate(root, ['HEAD~1']);
  const wanted = [`[${AUTOMERGE}]`, `law: ${LAW8}`, 'Gardener-gated path', `docs/rings/${RING_NEXT}-fixture.md`];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'automerge: marked commit adding a ring fails (cutting a ring is not mechanical)',
    status === 1 && missing.length === 0,
    `expected exit 1 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  write(root, 'docs/principles/example.md', validPrinciple('Example principle'));
  gitCommitAll(root, 'state a principle\n\nAutomerge: format');
  const { status, output } = runAutomergeGate(root, ['HEAD~1']);
  const wanted = [`[${AUTOMERGE}]`, `law: ${LAW8}`, 'Gardener-gated path', 'docs/principles/example.md'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'automerge: marked commit adding a principle statement fails (captured taste, not mechanical)',
    status === 1 && missing.length === 0,
    `expected exit 1 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  // The README index is not ring *content*: "link/index fixes" is an allowed automerge class,
  // and the index legitimately gains a line per ring. Pins the README exemption so a regression
  // that over-broadly protects docs/rings/ cannot silently block a legitimate index fix.
  append(root, 'docs/rings/README.md', '\n- an index line fix\n');
  gitCommitAll(root, 'fix the ring index\n\nAutomerge: link');
  const { status, output } = runAutomergeGate(root, ['HEAD~1']);
  report(
    'automerge: marked commit touching only the ring index README passes',
    status === 0 && output.includes("stay within ring 0007's mechanical scope"),
    `expected exit 0 + "stay within ...", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  // The principles index README is exempt for the same reason as the ring index — pins that
  // second exemption independently (a regression dropping only this guard would otherwise ship
  // green, wrongly blocking a legitimate principles-index fix).
  append(root, 'docs/principles/README.md', '\n- an index line fix\n');
  gitCommitAll(root, 'fix the principles index\n\nAutomerge: link');
  const { status, output } = runAutomergeGate(root, ['HEAD~1']);
  report(
    'automerge: marked commit touching only the principles index README passes',
    status === 0 && output.includes("stay within ring 0007's mechanical scope"),
    `expected exit 0 + "stay within ...", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  // A protected file whose name carries a non-ASCII byte: git's default core.quotepath would
  // double-quote it, and a raw prefix match would miss it — so this pins the -z fix. Assert on
  // the exit code + the generic "Gardener-gated path" line, NOT the exact bytes, to sidestep
  // any filesystem Unicode normalization. Reverting -z flips this red (the gate would exit 0).
  write(root, 'docs/principles/café.md', validPrinciple('Accented example'));
  gitCommitAll(root, 'slip in an oddly-named principle\n\nAutomerge: ledger');
  const { status, output } = runAutomergeGate(root, ['HEAD~1']);
  const wanted = [`[${AUTOMERGE}]`, `law: ${LAW8}`, 'Gardener-gated path'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'automerge: a marked commit adding a non-ASCII-named principle still fails (path-quoting closed by -z)',
    status === 1 && missing.length === 0,
    `expected exit 1 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  // No marker → the Gardener-review path. This gate must NOT constrain it (touching the genome
  // under Gardener review is legitimate); traceability and Gardener judgment bind it instead.
  append(root, 'SEED.md', '\nA Gardener-reviewed genome amendment.\n');
  gitCommitAll(root, 'amend the genome under review (plan 0002)');
  const { status, output } = runAutomergeGate(root, ['HEAD~1']);
  report(
    'automerge: an unmarked commit touching SEED.md passes (gate only constrains automerge claims)',
    status === 0 && output.includes('no automerge-marked commits'),
    `expected exit 0 + "no automerge-marked commits", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'base');
  // An automerge claim must name a real mechanical class — `Automerge: anything` cannot buy a
  // pass on the protected-path check by naming a class the gate does not recognize.
  append(root, 'docs/references/README.md', '\nContent behind a bogus class token.\n');
  gitCommitAll(root, 'bogus class\n\nAutomerge: whatever');
  const { status, output } = runAutomergeGate(root, ['HEAD~1']);
  const wanted = [`[${AUTOMERGE}]`, `law: ${LAW8}`, 'not a mechanical class'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'automerge: a marker naming an unknown class fails',
    status === 1 && missing.length === 0,
    `expected exit 1 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet', '-b', 'main');
  gitCommitAll(root, 'base');
  git(root, 'checkout', '--quiet', '-b', 'topic');
  append(root, 'docs/references/README.md', '\nMechanical work on a branch.\n');
  gitCommitAll(root, 'branch link fix\n\nAutomerge: link');
  git(root, 'checkout', '--quiet', 'main');
  git(
    root,
    '-c', 'user.email=self-test@seed',
    '-c', 'user.name=Seed Self-Test',
    '-c', 'commit.gpgsign=false',
    'merge', '--quiet', '--no-ff', '--no-verify', '-m', 'Merge branch topic\n\nAutomerge: typo', 'topic',
  );
  // The merge commit is exempt (machine-written subject; its Automerge trailer is ignored),
  // and the carried marked commit is still checked on its own — and it is within scope. The
  // count assertion pins the exemption: drop --no-merges and the merge's own trailer counts,
  // flipping "all 1" → "all 2" and failing this case (the sibling traceability test's trick).
  const { status, output } = runAutomergeGate(root, ['HEAD^1']);
  report(
    'automerge: merge commit is exempt, carried marked commit still checked',
    status === 0 &&
      output.includes('all 1 automerge-marked commit(s)') &&
      output.includes("stay within ring 0007's mechanical scope"),
    `expected exit 0 + "all 1 automerge-marked commit(s)" + "stay within ...", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'only commit');
  const { status, output } = runAutomergeGate(root, ['0000000000000000000000000000000000000000']);
  report(
    'automerge: unresolvable base skips with an explicit note',
    status === 0 && output.includes('gate skipped'),
    `expected exit 0 + "gate skipped", got exit ${status}:\n${output}`,
  );
});

// --- gardening-report composer (E-008, plan 0002 scope item 5, the scheduled half). It
// --- shells to doc-drift.ts and fitness.ts (fitness needs real history), so these init a
// --- scratch repo. It is a composer, not a gate: the assertions are on has_findings / the
// --- rendered report, and the exit code staying 0.

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: pristine base for the gardening report`);
  const { status, output } = runReport(root, ['--json']);
  let parsed: { has_findings?: unknown; drift_count?: unknown; date?: unknown } | null = null;
  try {
    parsed = JSON.parse(output);
  } catch {
    parsed = null;
  }
  // Assert `date` too: the workflow builds the issue title from it (`Gardening pass — <date>`)
  // and dedupes by exact title, so a dropped/renamed date field would silently collapse every
  // week onto one `— null` issue. Pin it as a real YYYY-MM-DD here.
  const dateOk = typeof parsed?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(parsed.date as string);
  report(
    'gardening-report: pristine copy reports has_findings false, drift_count 0, and a valid date',
    status === 0 && parsed?.has_findings === false && parsed?.drift_count === 0 && dateOk,
    `expected has_findings false + drift_count 0 + a YYYY-MM-DD date, got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  append(root, 'docs/references/README.md', '\nSee `.seed/checks/ghost-check.ts` for details.\n');
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: a stale reference for the gardening report`);
  const json = runReport(root, ['--json']);
  const jsonParsed = JSON.parse(json.output) as { has_findings: boolean; drift_count: number };
  const md = runReport(root);
  const wantedMd = ['# Gardening pass', 'drift_count 1', '.seed/checks/ghost-check.ts', 'Fitness (SEED.md §6)'];
  const missingMd = wantedMd.filter((s) => !md.output.includes(s));
  report(
    'gardening-report: a seeded stale reference flips has_findings and renders in the report',
    json.status === 0 &&
      jsonParsed.has_findings === true &&
      jsonParsed.drift_count === 1 &&
      md.status === 0 &&
      missingMd.length === 0,
    `expected has_findings true + drift_count 1 + a report naming the finding; json exit ${json.status}, md exit ${md.status}; missing in md: ${JSON.stringify(missingMd)}\n${json.output}\n---\n${md.output}`,
  );
});

console.log(
  failures > 0
    ? `\n${failures}/${ran} self-test(s) failed. A validator that does not fire on its violation class is doc-only enforcement wearing a costume (LAW-2).`
    : `\nall ${ran} self-tests passed — every violation class fires its check, the gate holds, and the pristine tree is green.`,
);
process.exit(failures > 0 ? 1 : 0);
