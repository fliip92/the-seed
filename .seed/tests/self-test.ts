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
import { cpSync, mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync, appendFileSync, readdirSync, symlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { REPO_ROOT } from '../lib/repo.ts';
import { pin } from '../lib/judge.ts';

const ANATOMY = 'seed/validate-anatomy';
const MAP = 'seed/validate-map';
const STAGE = 'seed/validate-stage';
const RINGS = 'seed/validate-rings';
const PLANS = 'seed/validate-plans';
const ARCH = 'seed/validate-architecture';
const POSTMORTEM = 'seed/validate-postmortems';
const ASSESS = 'seed/validate-assessments';
const PRINCIPLES = 'seed/validate-principles';
const GENERATED = 'seed/validate-generated';
const REFERENCES = 'seed/validate-references';
const POLLEN = 'seed/validate-pollen';
const RELEASE = 'seed/validate-release';
const JUDGMENTS = 'seed/validate-judgments';
const GATE = 'seed/ring-append-only';
const RELEASE_GATE = 'seed/release-append-only';
const TRACE = 'seed/plan-traceability';
const AUTOMERGE = 'seed/automerge-scope';

const LAW2 = "LAW-2 — legible and enforceable, or it doesn't exist";
const LAW3 = 'LAW-3 — invariants over implementations';
const LAW4 = 'LAW-4 — the map is the entry point';
const LAW5 = 'LAW-5 — plans are first-class artifacts';
const LAW6 = 'LAW-6 — every capability ships with its own verification';
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

// Postmortems (ring 0017) are numbered like rings but the organ starts empty (max 0), so a
// duplicate is seeded as two files both at NEXT — no pre-existing entry to collide with —
// while a gap seeds one file at GAP (leaving NEXT missing). Both stay valid as real
// postmortems land: [1..M, M+1, M+1] duplicates, [1..M, M+2] gaps.
const postmortemMax = maxOf(readdirSync(join(REPO_ROOT, 'docs/postmortems')), /^(\d{4})-/);
const POSTMORTEM_NEXT = pad4(postmortemMax + 1);
const POSTMORTEM_GAP = pad4(postmortemMax + 2);

// Assessments (ring 0022) are numbered like postmortems, but the organ ships non-empty (0001
// lands with the exit criterion), so a duplicate collides with a NEW file at NEXT (max+1) and
// a gap seeds one at GAP (max+2) — both stay valid as more assessments land, the derive-from-
// maxima discipline the other organs use.
const assessmentMax = maxOf(readdirSync(join(REPO_ROOT, 'docs/assessments')), /^(\d{4})-/);
const ASSESS_NEXT = pad4(assessmentMax + 1);
const ASSESS_GAP = pad4(assessmentMax + 2);

// Judgments (ring 0030) are numbered like assessments and the organ ships non-empty (0001 lands with
// the instrument), so a fixture verdict is seeded at NEXT (max+1) and a duplicate collides with a second
// file at NEXT — both stay valid as more verdicts land (the derive-from-maxima discipline).
const judgmentMax = maxOf(readdirSync(join(REPO_ROOT, 'docs/judgments')), /^(\d{4})-/);
const JUDGMENT_NEXT = pad4(judgmentMax + 1);

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

// Like runNode but with an explicit cwd and an absolute script path — for the worktrees
// caller-invariance case, which runs the seed copy's tool from INSIDE a separate git repo to prove
// the run does not touch the repository it is invoked from.
function runNodeIn(cwd: string, script: string, args: string[] = []): RunResult {
  const res = spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
  return { status: res.status, output: `${res.stdout ?? ''}${res.stderr ?? ''}` };
}

const runChecks = (root: string): RunResult => runNode(root, '.seed/checks/run-all.ts');
const runGate = (root: string, args: string[]): RunResult =>
  runNode(root, '.seed/checks/ring-append-only.ts', args);
const runTraceGate = (root: string, args: string[]): RunResult =>
  runNode(root, '.seed/checks/plan-traceability.ts', args);
const runDrift = (root: string): RunResult => runNode(root, '.seed/checks/doc-drift.ts');
const runFitness = (root: string, args: string[] = []): RunResult => runNode(root, '.seed/checks/fitness.ts', args);
const runRepoFitness = (root: string, args: string[]): RunResult => runNode(root, '.seed/checks/repo-fitness.ts', args);
const runAutomergeGate = (root: string, args: string[]): RunResult =>
  runNode(root, '.seed/checks/automerge-scope.ts', args);
const runReport = (root: string, args: string[] = []): RunResult =>
  runNode(root, '.seed/checks/gardening-report.ts', args);
const runWorktrees = (root: string, args: string[]): RunResult => runNode(root, '.seed/checks/worktrees.ts', args);

function git(root: string, ...args: string[]): void {
  const res = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  if (res.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed in ${root}:\n${res.stdout}${res.stderr}`);
  }
}

/** Read-only git query returning trimmed stdout — for the repo-fitness non-mutation proof
 *  (capturing HEAD and `status --porcelain` before/after a run). */
function gitCapture(root: string, ...args: string[]): string {
  return `${spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' }).stdout ?? ''}`.trim();
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

function validPlan(num: string, opts: { title?: string; status?: string | null; dropSection?: string; progress?: string[]; workUnits?: string[] } = {}): string {
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
    ...(opts.workUnits ? ['## Work units', '', ...opts.workUnits.flatMap((u) => [u, ''])] : []),
  ];
  return sections
    .filter((l) => (opts.dropSection === undefined ? true : l !== opts.dropSection))
    .join('\n');
}

// A valid work unit (ring 0036): the `### U<n> — <title>` heading + the five required fields
// (Status, Scope, Entry-context, Done-when, Owner). Each opt breaks exactly one completion
// condition — `heading` rewrites the H3 (e.g. an id-less heading), `drop` removes a required
// field, `status` overrides the Status VALUE (an invalid enum). Appended to a plan's optional
// `## Work units` section by validPlan({ workUnits }); an empty workUnits array seeds a
// present-but-empty section.
function validWorkUnit(id: string, opts: { heading?: string; drop?: string; status?: string } = {}): string {
  const fields = [
    `- Status: ${opts.status ?? 'todo'}`,
    '- Scope: A fixture unit that exists only inside a self-test temp copy.',
    '- Entry-context: this fixture; nothing else to read to start it cold.',
    '- Done-when: the self-test asserts on it.',
    '- Owner: agent',
  ].filter((f) => (opts.drop === undefined ? true : !f.startsWith(`- ${opts.drop}:`)));
  return [opts.heading ?? `### ${id} — Self-test fixture unit`, ...fields].join('\n');
}

// A valid principle (ring 0023): an H1 title, the four §2 fields, and an Enforcement clause that
// names a mechanism AND links an enforcer that exists in the temp copy (the check file itself, so
// a valid fixture passes validate-principles' enforcer-exists teeth). Each opt breaks exactly one
// completion condition: `title` rewrites the H1, `drop` removes a required field, `enforcement`
// overrides the Enforcement VALUE (null drops the whole line — the enforcement_ratio fixture's
// "missing field" case). Written to docs/principles/<name>.md, so `../../` reaches the repo root.
function validPrinciple(name: string, opts: { title?: string; drop?: string; enforcement?: string | null } = {}): string {
  const enforcement =
    opts.enforcement === undefined
      ? 'structural test — [the principle check](../../.seed/checks/validate-principles.ts) binds this format.'
      : opts.enforcement;
  const fields = [
    '- Statement: Self-test fixture principle.',
    '- Rationale: Exists only inside a self-test temp copy.',
    ...(enforcement === null ? [] : [`- Enforcement: ${enforcement}`]),
    '- Exceptions: none',
  ].filter((f) => (opts.drop === undefined ? true : !f.startsWith(`- ${opts.drop}:`)));
  return [`# ${opts.title ?? name}`, '', ...fields, ''].join('\n');
}

// Remove every stated principle from a temp copy (keeping the README), so a fitness fixture
// controls the exact principle set it measures. The real organ now ships grounded-or-ask (ring
// 0023), which a copy inherits — a test asserting a specific enforcement_ratio must start from a
// known-empty organ, not the seed's current one.
function clearPrinciples(root: string): void {
  const dir = join(root, 'docs/principles');
  for (const f of readdirSync(dir)) {
    if (f !== 'README.md') rmSync(join(dir, f));
  }
}

// A valid architecture doc (ring 0015): title, the three required sections, one rule naming
// an enforcement, and a two-sided ownership split — well under the one-page budget. Each opt
// breaks exactly one completion condition so a case fails for the one field it targets.
function validArchitecture(opts: {
  title?: string;
  dropSection?: string;
  ruleEnforcement?: string;
  rules?: string[] | null;
  ownership?: string[];
  filler?: string;
} = {}): string {
  const rules =
    opts.rules === undefined
      ? [`- Dependencies point inward, never outward. — Enforcement: ${opts.ruleEnforcement ?? 'lint — seed/dep-direction'}`]
      : opts.rules ?? [];
  const ownership = opts.ownership ?? [
    '- Human (Gardener): intent, priorities, taste, and gate approvals.',
    '- Agent (Seed): everything else — code, docs, lints, CI.',
  ];
  const sections = [
    `# Architecture — ${opts.title ?? 'Self-test fixture target'}`,
    '',
    '- One-liner: A fixture architecture that exists only inside a temp copy.',
    '',
    '## Shape',
    '',
    'One layer, one boundary; the fixture describes nothing real.',
    ...(opts.filler ? ['', opts.filler] : []),
    '',
    '## Rules',
    '',
    ...rules,
    '',
    '## Ownership',
    '',
    ...ownership,
    '',
  ];
  return sections.filter((l) => (opts.dropSection === undefined ? true : l !== opts.dropSection)).join('\n');
}

// A valid postmortem entry (ring 0017): title, the six fields, and the three artifacts each
// LINKED — Fix links a change, Invariant names a mechanism in an Enforcement clause and links
// its enforcer, Ring links an existing ring. Every default link points at a file that exists
// in the temp copy (the check file itself, and ring 0001), so a valid fixture resolves and
// each opt breaks exactly one completion condition. Written to docs/postmortems/<num>-*.md,
// so `../../` reaches the repo root and `../rings/` reaches the ring log.
function validPostmortem(num: string, opts: {
  title?: string;
  drop?: string;
  fix?: string;
  invariant?: string;
  ring?: string;
} = {}): string {
  const fields = [
    '- Date: 2026-07-05',
    '- Stage: 2 — Growth',
    '- Failure: A self-test fixture failure that exists only inside a temp copy.',
    opts.fix ?? '- Fix: Added the check — [the check](../../.seed/checks/validate-postmortems.ts).',
    opts.invariant ??
      '- Invariant: The format is enforced — Enforcement: structural test — [validate-postmortems](../../.seed/checks/validate-postmortems.ts).',
    opts.ring ?? '- Ring: The decision trail — [ring 0001](../rings/0001-founding-defaults.md).',
  ].filter((f) => (opts.drop === undefined ? true : !f.startsWith(`- ${opts.drop}:`)));
  return [`# Postmortem ${opts.title ?? `${num} — Self-test fixture`}`, '', ...fields, ''].join('\n');
}

// A valid assessment (ring 0022): title, the two fields, the four sections, a Scout naming all
// six §6 metric keys, one finding converting to a product, a grill question, and a two-sided
// ownership split — so a valid fixture passes and each opt breaks exactly one completion
// condition. Written to docs/assessments/<num>-*.md.
function validAssessment(num: string, opts: {
  title?: string;
  drop?: string;              // drop a required field: Date | Target
  dropSection?: string;       // drop a required section heading line
  scout?: string[];           // override the Scout body bullets (to omit a metric)
  findings?: string[] | null; // override finding bullets; null = present-but-empty section
  grill?: string[];           // override grill bullets
  ownership?: string[];       // override ownership bullets
} = {}): string {
  const scout = opts.scout ?? [
    '- map_reachability 0.0% — an AGENTS.md exists but reaches almost nothing',
    '- enforcement_ratio null — no docs/principles/ organ',
    '- drift_count 3',
    '- plan_traceability null — no plan/ring decision log',
    '- escalation_rate null — no run-log instrument',
    '- ledger_trend null — no entropy ledger',
  ];
  const findings =
    opts.findings === undefined
      ? ['- No legible entry point (map_reachability 0.0%) — Product: invariant — propose an AGENTS.md map plus a reachability gate.']
      : opts.findings ?? [];
  const grill = opts.grill ?? ['- Which module is the intended dependency root?'];
  const ownership = opts.ownership ?? [
    '- Owner (human): intent, priorities, taste, and gate approvals.',
    '- Seed (agent): everything else — the map, the lints, the CI.',
  ];
  const fields = [
    '- Date: 2026-07-05',
    '- Target: A synthetic foreign repo that exists only inside a self-test temp copy — read-only.',
  ].filter((f) => (opts.drop === undefined ? true : !f.startsWith(`- ${opts.drop}:`)));
  const sections = [
    `# Assessment ${opts.title ?? `${num} — Self-test fixture target`}`,
    '',
    ...fields,
    '',
    '## Scout',
    '',
    ...scout,
    '',
    '## Findings',
    '',
    ...findings,
    '',
    '## Grill agenda',
    '',
    ...grill,
    '',
    '## Ownership',
    '',
    ...ownership,
    '',
  ];
  return sections.filter((l) => (opts.dropSection === undefined ? true : l !== opts.dropSection)).join('\n');
}

// A valid distilled reference (intake, plan 0004 scope item 3, ring 0024). By default an
// EXTERNAL-corpus reference in the shape of harness-engineering.md: a **Source** with a retrieval
// date AND a commit pin (its github link makes the pin required), one cited claim, and a
// **Seed reading:** split — so the in-repo teeth stay vacuous and each opt breaks exactly one
// structural guard. `source: null` drops the Source line; `source` overrides it (e.g. to a LOCAL
// corpus link, which turns the teeth ON); `claims` overrides the claim bullets; `seedReading:
// false` drops the appended split marker (a claim may still carry one inline). Written to
// docs/references/<name>.md, so `../` reaches docs/ and a `../refs-corpus-fixture.md` source links
// a sibling corpus staged loose under docs/ (which validate-references does not scan as a reference).
function validReference(opts: {
  title?: string;
  source?: string | null;
  claims?: string[];
  seedReading?: boolean;
} = {}): string {
  const source =
    opts.source === undefined
      ? '- **Source:** [ai-boost/awesome](https://github.com/ai-boost/awesome), pinned at commit `a28cc8e` — retrieved 2026-07-08.'
      : opts.source;
  const claims = opts.claims ?? ['- A grounded claim, cited to its source ([Fowler](https://martinfowler.com/x)).'];
  const seedReading = opts.seedReading === false ? [] : ['  - **Seed reading:** this connects the source to the seed.'];
  const lines = [
    `# ${opts.title ?? 'Reference fixture'}`,
    '',
    ...(source === null ? [] : [source, '']),
    '## What it says',
    '',
    ...claims,
    ...seedReading,
    '',
  ];
  return lines.join('\n');
}

// A tiny curated corpus saved loose under docs/ — the in-repo case the teeth bind on (ring 0024:
// a quoted span is machine-verifiable only against an already-committed in-repo file). It carries
// two link entries and a quotable annotation, so a reference over it can exercise quote-match
// (does a quoted span appear here?) and completeness (is every entry cited or discarded?).
const CORPUS_FIXTURE =
  '# Corpus fixture\n\n- [entry A](https://example.com/a) — the seed is a harness.\n- [entry B](https://example.com/b) — a second entry.\n';

// --- release model fixtures (ring 0027). seedReleaseFile writes a well-formed release file and, so
// --- the release stays reachable (validate-map) and the version line consistent, appends the history
// --- index line; each opt breaks exactly one field. setPollenVersion moves BOTH the manifest's
// --- POLLEN_VERSION and the lineage seedVersion (validate-pollen cross-checks them) so a seeded
// --- release can be made version-consistent, isolating the ONE release invariant a case then breaks.
function seedReleaseFile(root: string, version: string, opts: { impact?: string; date?: string; composed?: string | null; migration?: string } = {}): void {
  const impact = opts.impact ?? 'minor';
  const date = opts.date ?? '2026-07-15';
  const composed =
    opts.composed === undefined
      ? '[ring 0026](../../docs/rings/0026-pollen-boundary-versioning-lineage.md)'
      : opts.composed;
  const migration = opts.migration ?? 'none';
  const lines = [
    `# Pollen v${version} — ${date}`,
    '',
    `- Impact: ${impact}`,
    `- Date: ${date}`,
    ...(composed === null ? [] : [`- Composed: ${composed}`]),
    `- Migration: ${migration}`,
    '',
    '## Notes',
    '',
    `- ${impact} — ring 0026 — self-test fixture release.`,
    '',
  ];
  write(root, `pollen/releases/v${version}.md`, lines.join('\n'));
  append(root, 'pollen/releases/README.md', `\n- [v${version}](v${version}.md) — ${date} — ${impact}: fixture.\n`);
}

function setPollenVersion(root: string, version: string): void {
  edit(root, '.seed/lib/pollen.ts', (c) => c.replace(/(POLLEN_VERSION\s*=\s*')[^']*(')/, `$1${version}$2`));
  const lineage = JSON.parse(readFileSync(join(root, 'pollen/lineage.json'), 'utf8'));
  lineage.seedVersion = version;
  write(root, 'pollen/lineage.json', JSON.stringify(lineage, null, 2) + '\n');
}

// Reset a temp copy to a pristine "nothing released yet" slate — no cut release files, the "## Releases"
// index body emptied, both version lines back at 0.0.0 — so a release-flow fixture composes
// deterministically regardless of the repo's live release history. Once the mother carries a real
// v0.1.0 (plan 0005 scope item 4, ring 0029), a fixture that assumes "no release yet" must seed that
// slate itself (E-007: normal growth must not invalidate a fixture). The releases/README intro is
// preserved (only the body after "## Releases" is reset); setPollenVersion moves both version lines.
function resetReleaseArea(root: string): void {
  for (const name of readdirSync(join(root, 'pollen/releases'))) {
    if (/^v\d+\.\d+\.\d+\.md$/.test(name)) rmSync(join(root, 'pollen/releases', name));
  }
  edit(root, 'pollen/releases/README.md', (c) => c.replace(/(## Releases\n)[\s\S]*$/, '$1\n_No release cut yet._\n'));
  setPollenVersion(root, '0.0.0');
}

/** Overwrite pollen/pending.md with exactly the given intent bullets (no fenced example), so a case
 *  controls the precise pending set. An empty list is the "nothing to release" state. */
function writePending(root: string, intents: string[]): void {
  write(root, 'pollen/pending.md', ['# Pending release intents', '', ...intents, ''].join('\n'));
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

// --- judge / inferential-control fixtures (ring 0030). A valid verdict pins an existing, reachable
// --- artifact (AGENTS.md) with its REAL content hash, so a valid fixture is FRESH; each opt breaks
// --- exactly one envelope field. The link shown and the file pinned are decoupled (artifactLink vs
// --- artifactPath), so a DANGLING-artifact case can point the link at a ghost while still pinning a
// --- real file — isolating the resolve failure from the pin.
function validVerdict(
  root: string,
  number: string,
  opts: {
    titleNumber?: string;
    drop?: 'Rubric' | 'Artifact' | 'Source' | 'Model' | 'Date' | 'Score';
    rubric?: string;
    artifactLink?: string; // the [text](target) shown on the Artifact line
    artifactPath?: string; // the real repo file whose content is pinned (default AGENTS.md)
    noPin?: boolean; // keep the link, drop the sha256 pin
    stalePin?: boolean; // write a pin that will not match the current content (staleness)
    score?: string;
    model?: string;
    source?: string;
    rationale?: string | null;
  } = {},
): string {
  const artifactPath = opts.artifactPath ?? 'AGENTS.md';
  const realPin = pin(readFileSync(join(root, artifactPath), 'utf8'));
  const pinText = opts.noPin ? '' : ` — content ${opts.stalePin ? 'sha256:0000000000000000' : realPin}`;
  const link = opts.artifactLink ?? `[${artifactPath}](../../${artifactPath})`;
  const fields: Array<[string, string]> = [
    ['Rubric', opts.rubric ?? 'faithfulness v1'],
    ['Artifact', `${link}${pinText}`],
    ['Source', opts.source ?? 'external — self-test fixture, unpinnable (ring 0024)'],
    ['Model', opts.model ?? 'claude-opus-4-8'],
    ['Date', '2026-07-17'],
    ['Score', opts.score ?? '4 / 5'],
  ];
  const bullets = fields.filter(([n]) => n !== opts.drop).map(([n, v]) => `- ${n}: ${v}`);
  const rationale =
    opts.rationale === undefined
      ? 'A self-test fixture verdict — it exists only inside a temp copy, judging the pinned fixture artifact.'
      : opts.rationale;
  return [
    `# Judgment ${opts.titleNumber ?? number} — self-test fixture`,
    '',
    ...bullets,
    '',
    ...(rationale === null ? [] : ['## Rationale', '', rationale]),
    '',
  ].join('\n');
}

function seedVerdict(root: string, number: string, opts: Parameters<typeof validVerdict>[2] = {}, slug = 'fixture'): void {
  write(root, `docs/judgments/${number}-${slug}.md`, validVerdict(root, number, opts));
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
    // Slug-exactness guard (ring 0013): a link with a REAL plan number but the WRONG slug
    // must stay dead — resolution keys on the exact NNNN-slug.md basename, never the number
    // alone. The ghost case above uses a number absent from both dirs, so it only pins
    // number-mismatch; this pins slug-mismatch, catching a regression to number-only
    // ("glob NNNN-*") matching that would silently resolve a misspelled slug.
    name: 'map: a plan link with a real number but a wrong slug is still dead',
    seed: (r) => append(r, 'AGENTS.md', `\nSee [wrong slug](docs/plans/completed/${PLAN_DUP}-wrong-slug.md).\n`),
    expect: { check: MAP, law: LAW4, contains: ['dead link', `docs/plans/completed/${PLAN_DUP}-wrong-slug.md`] },
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
  // --- work-unit format (ring 0036 / E-014): a plan carrying a `## Work units` section must hold
  // --- well-formed `### U<n>` units. Each writes an UNLINKED plan to active/, so validate-map also
  // --- fires (unreachable) — harmless: the assertion only requires the PLANS marker + message +
  // --- exit 1. The valid-units-pass and no-section-pass paths run as an exit-0 block below.
  {
    name: 'plans: a work unit missing a required field',
    seed: (r) => write(r, `docs/plans/active/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT, { workUnits: [validWorkUnit('U1', { drop: 'Done-when' })] })),
    expect: { check: PLANS, law: LAW5, contains: ['work unit U1 is missing field: Done-when'] },
  },
  {
    name: 'plans: a work unit with an id-less heading',
    seed: (r) => write(r, `docs/plans/active/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT, { workUnits: [validWorkUnit('U1', { heading: '### A unit with no id' })] })),
    expect: { check: PLANS, law: LAW5, contains: ['work unit heading is malformed'] },
  },
  {
    name: 'plans: a work unit with an invalid Status value',
    seed: (r) => write(r, `docs/plans/active/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT, { workUnits: [validWorkUnit('U1', { status: 'nearly there' })] })),
    expect: { check: PLANS, law: LAW5, contains: ['work unit U1 has no valid'] },
  },
  {
    name: 'plans: duplicate work unit ids',
    seed: (r) => write(r, `docs/plans/active/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT, { workUnits: [validWorkUnit('U1'), validWorkUnit('U1')] })),
    expect: { check: PLANS, law: LAW5, contains: ['duplicate work unit id U1'] },
  },
  {
    name: 'plans: a present-but-empty Work units section',
    seed: (r) => write(r, `docs/plans/active/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT, { workUnits: [] })),
    expect: { check: PLANS, law: LAW5, contains: ['section with no units'] },
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
  {
    // The growth stage is hand-bumped in two places — AGENTS.md's "- **Stage:** N" prose and
    // fitness.ts's CURRENT_STAGE — and bumping one but not the other must fire (E-011, ring 0035).
    // The mutation bumps fitness.ts by +1 relative to the map, derived from the current value, so it
    // stays a genuine disagreement as the real stage advances.
    name: 'stage: AGENTS.md and fitness.ts CURRENT_STAGE disagree',
    seed: (r) => edit(r, '.seed/checks/fitness.ts', (c) => c.replace(/(const CURRENT_STAGE = )(\d+)/, (_m, p, n) => `${p}${Number(n) + 1}`)),
    expect: { check: STAGE, law: LAW2, contains: ['growth stage disagrees', 'AGENTS.md', '.seed/checks/fitness.ts'] },
  },
  // --- architecture-doc format (grill-the-gardener, ring 0015). These write an
  // --- unreachable doc into docs/architecture/, so validate-map also fires — the assertion
  // --- only requires the architecture marker + message present, so the extra noise is
  // --- harmless. The valid-doc-passes and doc-only-passes paths need reachability and so
  // --- run as standalone exit-0 blocks below.
  {
    name: 'architecture: invalid title line',
    seed: (r) =>
      write(r, 'docs/architecture/fixture.md', validArchitecture().replace('# Architecture — Self-test fixture target', '# Arch fixture')),
    expect: { check: ARCH, law: LAW2, contains: ['is not a valid architecture title'] },
  },
  {
    name: 'architecture: missing ## Shape section',
    seed: (r) => write(r, 'docs/architecture/fixture.md', validArchitecture({ dropSection: '## Shape' })),
    expect: { check: ARCH, law: LAW2, contains: ['missing required section: ## Shape'] },
  },
  {
    // A different section than Shape, so the sectionBody(...) === null skip on ## Rules is
    // exercised (not just the emit path).
    name: 'architecture: missing ## Rules section',
    seed: (r) => write(r, 'docs/architecture/fixture.md', validArchitecture({ dropSection: '## Rules' })),
    expect: { check: ARCH, law: LAW2, contains: ['missing required section: ## Rules'] },
  },
  {
    // No `Enforcement:` clause at all, and the sentence contains 'lintable' — pins that the
    // mechanism is required in a real enforcement clause, not merely as a substring in prose.
    name: 'architecture: a rule with no Enforcement clause is caught',
    seed: (r) => write(r, 'docs/architecture/fixture.md', validArchitecture({ rules: ['- Boundaries stay explicit and lintable.'] })),
    expect: { check: ARCH, law: LAW2, contains: ['rule does not name an enforcement'] },
  },
  {
    name: "architecture: a rule's Enforcement clause names no mechanism",
    seed: (r) => write(r, 'docs/architecture/fixture.md', validArchitecture({ ruleEnforcement: 'we will be careful' })),
    expect: { check: ARCH, law: LAW2, contains: ["rule's enforcement names no mechanism"] },
  },
  {
    // A good first rule and a bad second — exercises the rule loop past index 0.
    name: 'architecture: one unenforced rule among several is caught',
    seed: (r) =>
      write(r, 'docs/architecture/fixture.md', validArchitecture({ rules: ['- Dependencies point inward. Enforcement: lint (seed/dep-direction)', '- Modules stay small and cohesive.'] })),
    expect: { check: ARCH, law: LAW2, contains: ['rule does not name an enforcement', 'Modules stay small'] },
  },
  {
    name: 'architecture: an empty rules section',
    seed: (r) => write(r, 'docs/architecture/fixture.md', validArchitecture({ rules: null })),
    expect: { check: ARCH, law: LAW2, contains: ['## Rules names no rules'] },
  },
  {
    name: 'architecture: ownership names only the human side',
    seed: (r) =>
      write(r, 'docs/architecture/fixture.md', validArchitecture({ ownership: ['- Human (Gardener): intent, priorities, taste, and gate approvals.'] })),
    expect: { check: ARCH, law: LAW2, contains: ['## Ownership does not name', 'the agent/Seed side'] },
  },
  {
    // The mirror branch: only the agent side named, so the human-side message fires.
    name: 'architecture: ownership names only the agent side',
    seed: (r) =>
      write(r, 'docs/architecture/fixture.md', validArchitecture({ ownership: ['- Agent (Seed): everything else, code, docs, lints, CI.'] })),
    expect: { check: ARCH, law: LAW2, contains: ['## Ownership does not name', 'the human/Gardener side'] },
  },
  {
    // A single bullet that mentions both sides is not a split — the whole-section-OR bypass.
    name: 'architecture: a single both-mentioning ownership bullet is not a split',
    seed: (r) =>
      write(r, 'docs/architecture/fixture.md', validArchitecture({ ownership: ["- Human (Gardener): intent, priorities, taste, not the seed's concern."] })),
    expect: { check: ARCH, law: LAW2, contains: ['both sides on separate bullets'] },
  },
  {
    name: 'architecture: over the one-page word budget',
    seed: (r) =>
      write(r, 'docs/architecture/fixture.md', validArchitecture({ filler: Array(480).fill('word').join(' ') })),
    expect: { check: ARCH, law: LAW2, contains: ['over the one-page word budget of 500'] },
  },
  {
    // Few words, many lines (a tall diagram) — the word cap misses it, the line cap catches it.
    name: 'architecture: over the one-page line budget',
    seed: (r) =>
      write(r, 'docs/architecture/fixture.md', validArchitecture({ filler: Array(90).fill('x').join('\n') })),
    expect: { check: ARCH, law: LAW2, contains: ['over the one-page line budget of 80'] },
  },
  // --- postmortem-entry format (postmortem, ring 0017). These write an unreachable entry into
  // --- docs/postmortems/, so validate-map also fires — the assertion only requires the
  // --- postmortem marker + message, so that noise is harmless. The valid-entry-passes and
  // --- mechanism-accepted paths need reachability and so run as standalone exit-0 blocks below.
  {
    name: 'postmortem: invalid title line',
    seed: (r) => write(r, `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`, validPostmortem(POSTMORTEM_NEXT, { title: 'without the required shape' })),
    expect: { check: POSTMORTEM, law: LAW2, contains: ['first line is not a valid postmortem title'] },
  },
  {
    name: 'postmortem: bad filename',
    seed: (r) => write(r, 'docs/postmortems/not-a-postmortem.md', validPostmortem(POSTMORTEM_NEXT)),
    expect: { check: POSTMORTEM, law: LAW2, contains: ['does not match the postmortem filename format'] },
  },
  {
    name: 'postmortem: title number != filename number',
    seed: (r) => write(r, `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`, validPostmortem(POSTMORTEM_NEXT, { title: `${POSTMORTEM_GAP} — Self-test fixture` })),
    expect: { check: POSTMORTEM, law: LAW2, contains: [`title number ${POSTMORTEM_GAP} does not match filename number ${POSTMORTEM_NEXT}`] },
  },
  {
    name: 'postmortem: missing required field',
    seed: (r) => write(r, `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`, validPostmortem(POSTMORTEM_NEXT, { drop: 'Failure' })),
    expect: { check: POSTMORTEM, law: LAW2, contains: ['missing required field: Failure'] },
  },
  {
    name: 'postmortem: Fix names no link to the fix',
    seed: (r) => write(r, `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`, validPostmortem(POSTMORTEM_NEXT, { fix: '- Fix: We changed the code to handle it.' })),
    expect: { check: POSTMORTEM, law: LAW2, contains: ['Fix field links no fix'] },
  },
  {
    // No `Enforcement:` clause at all: the invariant is only prose — the "try harder" non-fix.
    name: 'postmortem: an invariant with no Enforcement clause is caught',
    seed: (r) => write(r, `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`, validPostmortem(POSTMORTEM_NEXT, { invariant: '- Invariant: We will review more carefully — [notes](../../.seed/checks/validate-postmortems.ts).' })),
    expect: { check: POSTMORTEM, law: LAW2, contains: ['Invariant does not name an enforcement'] },
  },
  {
    // A clause is present but names no mechanism — pins that the vocabulary is required, not
    // merely the word "Enforcement:".
    name: "postmortem: an invariant's Enforcement clause names no mechanism",
    seed: (r) => write(r, `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`, validPostmortem(POSTMORTEM_NEXT, { invariant: '- Invariant: Reviews happen — Enforcement: we will be careful — [notes](../../.seed/checks/validate-postmortems.ts).' })),
    expect: { check: POSTMORTEM, law: LAW2, contains: ["Invariant's enforcement names no mechanism"] },
  },
  {
    // A mechanism is named but nothing is linked: the invariant claims enforcement with no
    // enforcing artifact to point at.
    name: 'postmortem: an invariant naming a mechanism but linking nothing is caught',
    seed: (r) => write(r, `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`, validPostmortem(POSTMORTEM_NEXT, { invariant: '- Invariant: The format is enforced — Enforcement: structural test.' })),
    expect: { check: POSTMORTEM, law: LAW2, contains: ['Invariant links no enforcing artifact'] },
  },
  {
    // A link that is not a ring: the decision trail must point at docs/rings/NNNN-slug.md.
    name: 'postmortem: a Ring field linking a non-ring is caught',
    seed: (r) => write(r, `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`, validPostmortem(POSTMORTEM_NEXT, { ring: '- Ring: The decision trail — [the genome](../../SEED.md).' })),
    expect: { check: POSTMORTEM, law: LAW2, contains: ['Ring field links no ring'] },
  },
  {
    // A ring-shaped link to a ring that does not exist — the other Ring branch (hasShape).
    name: 'postmortem: a Ring field linking a nonexistent ring is caught',
    seed: (r) => write(r, `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`, validPostmortem(POSTMORTEM_NEXT, { ring: '- Ring: The decision trail — [ring 9999](../rings/9999-ghost.md).' })),
    expect: { check: POSTMORTEM, law: LAW2, contains: ['Ring field links a ring that does not exist'] },
  },
  {
    // Two entries at the same number — the organ starts empty, so a duplicate is two files at NEXT.
    name: 'postmortem: duplicate number',
    seed: (r) => {
      write(r, `docs/postmortems/${POSTMORTEM_NEXT}-a.md`, validPostmortem(POSTMORTEM_NEXT));
      write(r, `docs/postmortems/${POSTMORTEM_NEXT}-b.md`, validPostmortem(POSTMORTEM_NEXT));
    },
    expect: { check: POSTMORTEM, law: LAW2, contains: [`duplicate postmortem number ${POSTMORTEM_NEXT}`] },
  },
  {
    name: 'postmortem: numbering gap',
    seed: (r) => write(r, `docs/postmortems/${POSTMORTEM_GAP}-fixture.md`, validPostmortem(POSTMORTEM_GAP)),
    expect: { check: POSTMORTEM, law: LAW2, contains: [`postmortem numbering gap: found ${POSTMORTEM_GAP} where ${POSTMORTEM_NEXT} was expected`] },
  },
  {
    // A present-but-malformed Date pins the Date-format branch, distinct from the missing-field
    // branch — `July 5` keeps the field present (fieldRanges still resolves Date) while failing
    // DATE_RE. Without this case, deleting that branch or loosening DATE_RE would ship green.
    name: 'postmortem: a present-but-malformed Date is caught',
    seed: (r) => write(r, `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`, validPostmortem(POSTMORTEM_NEXT).replace('- Date: 2026-07-05', '- Date: July 5')),
    expect: { check: POSTMORTEM, law: LAW2, contains: ['Date field is not a YYYY-MM-DD date'] },
  },
  {
    // The mechanism must be named in the Enforcement PROSE, not smuggled in via the required
    // enforcing-artifact link's text: `[the dep-direction lint](...)` after a prose that names
    // no mechanism ("we will be careful") must still fail. Pins the link-stripping in the
    // mechanism test — without it, the 'lint' inside the link waves this prose-only invariant
    // through, the exact "try harder" non-fix the rule exists to reject.
    name: "postmortem: a mechanism word only in the Invariant's link does not satisfy it",
    seed: (r) => write(r, `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`, validPostmortem(POSTMORTEM_NEXT, { invariant: '- Invariant: Reviews happen — Enforcement: we will be careful — [the dep-direction lint](../../.seed/checks/validate-postmortems.ts).' })),
    expect: { check: POSTMORTEM, law: LAW2, contains: ["Invariant's enforcement names no mechanism"] },
  },
  // --- assessment format (Stage 2 exit criterion, ring 0022). Each writes an unreachable entry
  // --- into docs/assessments/, so validate-map also fires — the assertion only requires the
  // --- assessment marker + message, so that noise is harmless. The valid-entry-passes and
  // --- each-product-accepted paths need reachability and so run as standalone exit-0 blocks below.
  {
    name: 'assessment: invalid title line',
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, { title: 'without the required shape' })),
    expect: { check: ASSESS, law: LAW2, contains: ['first line is not a valid assessment title'] },
  },
  {
    name: 'assessment: bad filename',
    seed: (r) => write(r, 'docs/assessments/not-an-assessment.md', validAssessment(ASSESS_NEXT)),
    expect: { check: ASSESS, law: LAW2, contains: ['does not match the assessment filename format'] },
  },
  {
    name: 'assessment: title number != filename number',
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, { title: `${ASSESS_GAP} — Self-test fixture target` })),
    expect: { check: ASSESS, law: LAW2, contains: [`title number ${ASSESS_GAP} does not match filename number ${ASSESS_NEXT}`] },
  },
  {
    name: 'assessment: missing required field',
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, { drop: 'Target' })),
    expect: { check: ASSESS, law: LAW2, contains: ['missing required field: Target'] },
  },
  {
    // A present-but-malformed Date pins the Date-format branch, distinct from missing-field.
    name: 'assessment: a present-but-malformed Date is caught',
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT).replace('- Date: 2026-07-05', '- Date: July 5')),
    expect: { check: ASSESS, law: LAW2, contains: ['Date field is not a YYYY-MM-DD date'] },
  },
  {
    name: 'assessment: missing required section',
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, { dropSection: '## Findings' })),
    expect: { check: ASSESS, law: LAW2, contains: ['missing required section: ## Findings'] },
  },
  {
    // The whole-baseline teeth: a Scout that omits even one §6 metric cannot pass — a proposal
    // judged on evidence carries every metric, not a cherry-picked subset.
    name: 'assessment: a Scout omitting a §6 metric is caught',
    seed: (r) =>
      write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, {
        scout: [
          '- map_reachability 0.0% — an AGENTS.md exists but reaches almost nothing',
          '- enforcement_ratio null — no docs/principles/ organ',
          '- drift_count 3',
          '- plan_traceability null — no plan/ring decision log',
          '- escalation_rate null — no run-log instrument',
        ],
      })),
    expect: { check: ASSESS, law: LAW2, contains: ['does not report every SEED.md §6 metric', 'ledger_trend'] },
  },
  {
    // No `Product:` clause at all: the finding is sensed entropy left unconverted (SEED.md §0).
    name: 'assessment: a finding with no Product clause is caught',
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, { findings: ['- No legible entry point — someone should add a map.'] })),
    expect: { check: ASSESS, law: LAW2, contains: ['finding does not name a product'] },
  },
  {
    // A clause is present but names none of the four products — pins that the vocabulary is
    // required, not merely the word "Product:".
    name: "assessment: a finding's Product clause names no product",
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, { findings: ['- No legible entry point — Product: fix it eventually.'] })),
    expect: { check: ASSESS, law: LAW2, contains: ["finding's Product clause names no product"] },
  },
  {
    // A product word only in the finding's LINK text must not satisfy it — pins the
    // link-stripping (the same teeth validate-postmortems has for its Enforcement clause).
    name: "assessment: a product word only in the finding's link does not satisfy it",
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, { findings: ['- No legible entry point — Product: [propose the invariant](../rings/0001-founding-defaults.md) later.'] })),
    expect: { check: ASSESS, law: LAW2, contains: ["finding's Product clause names no product"] },
  },
  {
    name: 'assessment: an empty findings section',
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, { findings: null })),
    expect: { check: ASSESS, law: LAW2, contains: ['names no findings'] },
  },
  {
    // A grill agenda that asks nothing has silently guessed the architecture (SEED.md §5).
    name: 'assessment: a grill agenda with no question is caught',
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, { grill: ['- The architecture is self-evident.'] })),
    expect: { check: ASSESS, law: LAW2, contains: ['states no question'] },
  },
  {
    name: 'assessment: ownership names only the human side',
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, { ownership: ['- Owner (human): intent, priorities, taste, and gate approvals.'] })),
    expect: { check: ASSESS, law: LAW2, contains: ['does not name the agent/Seed side'] },
  },
  {
    name: 'assessment: ownership names only the agent side',
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, { ownership: ['- Seed (agent): everything else — the map, the lints, the CI.'] })),
    expect: { check: ASSESS, law: LAW2, contains: ['does not name the human/owner side'] },
  },
  {
    name: 'assessment: a single both-mentioning ownership bullet is not a split',
    seed: (r) => write(r, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, { ownership: ['- Owner (human) and Seed (agent): one bullet naming both.'] })),
    expect: { check: ASSESS, law: LAW2, contains: ['both sides on separate bullets'] },
  },
  {
    name: 'assessment: duplicate number',
    seed: (r) => {
      write(r, `docs/assessments/${ASSESS_NEXT}-a.md`, validAssessment(ASSESS_NEXT));
      write(r, `docs/assessments/${ASSESS_NEXT}-b.md`, validAssessment(ASSESS_NEXT));
    },
    expect: { check: ASSESS, law: LAW2, contains: [`duplicate assessment number ${ASSESS_NEXT}`] },
  },
  {
    name: 'assessment: numbering gap',
    seed: (r) => write(r, `docs/assessments/${ASSESS_GAP}-fixture.md`, validAssessment(ASSESS_GAP)),
    expect: { check: ASSESS, law: LAW2, contains: [`assessment numbering gap: found ${ASSESS_GAP} where ${ASSESS_NEXT} was expected`] },
  },
  // --- principle format (plan 0004 scope item 1, ring 0023 — the seed's first principle). Each
  // --- writes an unreachable principle into docs/principles/, so validate-map also fires — the
  // --- assertion only requires the principle marker + message, so that noise is harmless. The
  // --- valid-principle-passes path needs reachability and runs as a standalone exit-0 block below.
  {
    name: 'principle: invalid title line',
    seed: (r) => write(r, 'docs/principles/fixture.md', validPrinciple('Fixture').replace('# Fixture', 'Fixture without a hash')),
    expect: { check: PRINCIPLES, law: LAW2, contains: ['first line is not a valid principle title'] },
  },
  {
    name: 'principle: bad filename',
    seed: (r) => write(r, 'docs/principles/Not_A_Principle.md', validPrinciple('Fixture')),
    expect: { check: PRINCIPLES, law: LAW2, contains: ['does not match the principle filename format'] },
  },
  {
    name: 'principle: missing Statement field',
    seed: (r) => write(r, 'docs/principles/fixture.md', validPrinciple('Fixture', { drop: 'Statement' })),
    expect: { check: PRINCIPLES, law: LAW2, contains: ['missing required field: Statement'] },
  },
  {
    // The load-bearing field: an unenforced principle is entropy (LAW-2, SEED.md §2) — it belongs
    // in the ledger, not the organ.
    name: 'principle: missing Enforcement field',
    seed: (r) => write(r, 'docs/principles/fixture.md', validPrinciple('Fixture', { drop: 'Enforcement' })),
    expect: { check: PRINCIPLES, law: LAW2, contains: ['missing required field: Enforcement'] },
  },
  {
    name: 'principle: missing Exceptions field',
    seed: (r) => write(r, 'docs/principles/fixture.md', validPrinciple('Fixture', { drop: 'Exceptions' })),
    expect: { check: PRINCIPLES, law: LAW2, contains: ['missing required field: Exceptions'] },
  },
  {
    // Names no mechanism, but DOES link a real enforcer — so only the mechanism test fires,
    // isolating it from the enforcer-exists test.
    name: 'principle: Enforcement names no mechanism',
    seed: (r) => write(r, 'docs/principles/fixture.md', validPrinciple('Fixture', { enforcement: 'we will be careful — [the check](../../.seed/checks/validate-principles.ts).' })),
    expect: { check: PRINCIPLES, law: LAW2, contains: ['Enforcement names no mechanism'] },
  },
  {
    // A mechanism word ('lint') only in the link TEXT must not satisfy the requirement — pins the
    // link-stripping (the same teeth validate-postmortems has for its Enforcement clause).
    name: 'principle: a mechanism word only in the Enforcement link does not satisfy it',
    seed: (r) => write(r, 'docs/principles/fixture.md', validPrinciple('Fixture', { enforcement: 'we will be careful — [the dep-direction lint](../../.seed/checks/validate-principles.ts).' })),
    expect: { check: PRINCIPLES, law: LAW2, contains: ['Enforcement names no mechanism'] },
  },
  {
    // Names a mechanism but links no enforcer at all — the enforcer-exists test's no-link branch.
    name: 'principle: Enforcement names a mechanism but links no enforcer',
    seed: (r) => write(r, 'docs/principles/fixture.md', validPrinciple('Fixture', { enforcement: 'structural test — the format is checked.' })),
    expect: { check: PRINCIPLES, law: LAW2, contains: ['Enforcement links no enforcer'] },
  },
  {
    // A mechanism and a link, but the link points at a file that does not exist — the phantom
    // enforcer that would inflate enforcement_ratio (SEED.md §6) with a claim CI cannot back.
    name: 'principle: Enforcement links an enforcer that does not exist',
    seed: (r) => write(r, 'docs/principles/fixture.md', validPrinciple('Fixture', { enforcement: 'structural test — [ghost](../../.seed/checks/ghost.ts).' })),
    expect: { check: PRINCIPLES, law: LAW2, contains: ['links an enforcer that does not exist'] },
  },
  // --- generated-artifact discipline (onboard-human, ring 0020). validate-generated re-runs each
  // --- manifest generator and fails when a committed docs/generated/ artifact differs from its
  // --- regeneration (a hand-edit, or a source changed without regenerating), when the generator
  // --- cannot run (a source it reads is gone), or when a docs/generated/ file is unregistered. A
  // --- couple of these ALSO trip validate-map (an unreachable stray file, or a README link to a
  // --- removed artifact) — harmless, since each assertion only requires the GENERATED marker +
  // --- message. The valid pristine artifact passing is covered by the pristine case; the
  // --- generate-CLI fixpoint runs as a standalone exit-0 block below.
  {
    name: 'generated: a hand-edited artifact no longer matches its source',
    seed: (r) => append(r, 'docs/generated/onboarding.md', '\nA sneaky hand-edit.\n'),
    expect: { check: GENERATED, law: LAW2, contains: ['does not match its regeneration', 'docs/generated/onboarding.md'] },
  },
  {
    // The teeth case: a SOURCE changed without regenerating. It proves the check re-derives from
    // source, not merely re-reads the artifact — editing the map's stage line changes the
    // briefing's "Where the Seed is now" and nothing else a run-all check inspects. The stage line
    // is matched by pattern (not a hardcoded stage value) so a stage transition never silently
    // defangs this fixture — a stale literal would no-op the replace and the teeth would vanish.
    name: 'generated: a source changed without regenerating is caught (the check re-derives from source)',
    seed: (r) => edit(r, 'AGENTS.md', (c) => c.replace(/\*\*Stage:\*\* \d+ — \w+/, '**Stage:** 9 — Fixture')),
    expect: { check: GENERATED, law: LAW2, contains: ['does not match its regeneration', 'docs/generated/onboarding.md'] },
  },
  {
    // The generator's source anchor is gone (the `**Stage:**` token renamed): generate() throws,
    // and the check must convert that into a legible violation, not an uncaught crash.
    name: 'generated: a moved source anchor yields a "could not regenerate" violation, not a crash',
    seed: (r) => edit(r, 'AGENTS.md', (c) => c.replace('- **Stage:**', '- **Phase:**')),
    expect: { check: GENERATED, law: LAW2, contains: ['could not regenerate', 'docs/generated/onboarding.md'] },
  },
  {
    name: 'generated: an unregistered file in docs/generated/ is caught',
    seed: (r) => write(r, 'docs/generated/stray.md', '# Stray\n\nHand-authored where only generators may write.\n'),
    expect: { check: GENERATED, law: LAW2, contains: ['is not a registered generated artifact', 'docs/generated/stray.md'] },
  },
  {
    name: 'generated: a missing registered artifact is caught',
    seed: (r) => rmSync(join(r, 'docs/generated/onboarding.md')),
    expect: { check: GENERATED, law: LAW2, contains: ['registered generated artifact is missing', 'docs/generated/onboarding.md'] },
  },
  // --- distilled-reference format (intake, plan 0004 scope item 3, ring 0024). Each writes an
  // --- unreachable reference into docs/references/, so validate-map also fires — the assertion
  // --- only requires the reference marker + message, so that noise is harmless. The valid-external
  // --- and valid-in-repo paths need reachability and so run as standalone exit-0 blocks below. The
  // --- teeth cases also stage a loose corpus at docs/refs-corpus-fixture.md so the Source's local
  // --- link resolves to an in-repo file (which is what turns the teeth on).
  {
    // The Source line is the provenance anchor; without it a distillation has no traceable origin.
    name: 'reference: a missing Source line is caught',
    seed: (r) => write(r, 'docs/references/fixture.md', validReference({ source: null })),
    expect: { check: REFERENCES, law: LAW2, contains: ['has no Source line'] },
  },
  {
    // A Source with a commit pin but no retrieval date — an undated distillation rots silently.
    name: 'reference: a Source line with no retrieval date is caught',
    seed: (r) =>
      write(r, 'docs/references/fixture.md', validReference({
        source: '- **Source:** [ai-boost/awesome](https://github.com/ai-boost/awesome), pinned at commit `a28cc8e`.',
      })),
    expect: { check: REFERENCES, law: LAW2, contains: ['carries no retrieval date'] },
  },
  {
    // A github.com Source (pinnable) with a date but no commit pin — network-free intake stays
    // verifiable only via the pin (ring 0024, pin-not-mirror).
    name: 'reference: a pinnable (github) Source with no commit pin is caught',
    seed: (r) =>
      write(r, 'docs/references/fixture.md', validReference({
        source: '- **Source:** [ai-boost/awesome](https://github.com/ai-boost/awesome) — retrieved 2026-07-08.',
      })),
    expect: { check: REFERENCES, law: LAW2, contains: ['carries no commit pin'] },
  },
  {
    // A claim bullet whose grounded head carries no link — the uncited claim grounded-or-ask forbids.
    name: 'reference: a claim citing no source is caught',
    seed: (r) => write(r, 'docs/references/fixture.md', validReference({ claims: ['- A claim with no citation whatsoever.'] })),
    expect: { check: REFERENCES, law: LAW2, contains: ['claim cites no source'] },
  },
  {
    // No **Seed reading:** marker anywhere — the grounded/inference split is not structurally present.
    name: 'reference: a missing grounded/inference split is caught',
    seed: (r) => write(r, 'docs/references/fixture.md', validReference({ seedReading: false })),
    expect: { check: REFERENCES, law: LAW2, contains: ['the grounded/inference split is not structurally present'] },
  },
  {
    // Teeth (quote-match): the Source links an in-repo corpus, and a grounded claim quotes a span
    // that corpus does not contain — a fabricated quote. Corpus has exactly the one entry the claim
    // cites, so completeness stays satisfied and only quote-match fires.
    name: 'reference: a quoted span absent from the cited in-repo corpus is caught (quote-match tooth)',
    seed: (r) => {
      write(r, 'docs/refs-corpus-fixture.md', '# Corpus fixture\n\n- [entry A](https://example.com/a) — the seed is a harness.\n');
      write(r, 'docs/references/fixture.md', validReference({
        source: '- **Source:** [the corpus](../refs-corpus-fixture.md) — retrieved 2026-07-08.',
        claims: ['- The corpus says "the seed is a spaceship" ([entry A](https://example.com/a)).'],
      }));
    },
    expect: { check: REFERENCES, law: LAW2, contains: ['quotes a span not found in the cited in-repo source', 'the seed is a spaceship'] },
  },
  {
    // Teeth (completeness): entry B of the in-repo corpus is neither cited nor discarded — a silent
    // truncation. The claim quotes only text present in the corpus, so quote-match stays satisfied.
    name: 'reference: a silently-dropped in-repo corpus entry is caught (completeness tooth)',
    seed: (r) => {
      write(r, 'docs/refs-corpus-fixture.md', CORPUS_FIXTURE);
      write(r, 'docs/references/fixture.md', validReference({
        source: '- **Source:** [the corpus](../refs-corpus-fixture.md) — retrieved 2026-07-08.',
        claims: ['- The corpus says "the seed is a harness" ([entry A](https://example.com/a)).'],
      }));
    },
    expect: { check: REFERENCES, law: LAW2, contains: ['silently drops a source entry', 'https://example.com/b'] },
  },
  {
    // Teeth (anti-drop): entry B IS accounted for (a discard bullet links it, so completeness
    // passes) but the discard states no reason — a silent drop wearing a label. The **Seed reading:**
    // is inlined under the FIRST claim so it does not fold into the discard bullet and supply a reason.
    name: 'reference: a discard with no stated reason is caught (anti-drop teeth)',
    seed: (r) => {
      write(r, 'docs/refs-corpus-fixture.md', CORPUS_FIXTURE);
      write(r, 'docs/references/fixture.md', validReference({
        source: '- **Source:** [the corpus](../refs-corpus-fixture.md) — retrieved 2026-07-08.',
        seedReading: false,
        claims: [
          '- The corpus says "the seed is a harness" ([entry A](https://example.com/a)).\n  - **Seed reading:** the seed is such a harness.',
          '- Discarded [entry B](https://example.com/b).',
        ],
      }));
    },
    expect: { check: REFERENCES, law: LAW2, contains: ['discards a source entry with no stated reason'] },
  },
  // --- pollen boundary (founding ring 0026, plan 0005 scope item 1). The completeness cases write an
  // --- unclassified top-level entry (which also trips validate-map's reachability — harmless noise,
  // --- the assertion only requires the pollen marker + message); the version/lineage cases mutate the
  // --- manifest, SEED.md's genome line, or pollen/lineage.json in isolation. The valid pristine tree
  // --- passing is covered by the pristine case; a descendant-shaped lineage passing runs as a
  // --- standalone exit-0 block below.
  {
    // Completeness (c, the ownership boundary): a new top-level entry the manifest classifies in no
    // tier fails — the Stage 3 boundary must stay total (LAW-3).
    name: 'pollen: an unclassified top-level entry is caught',
    seed: (r) => write(r, 'stray-top-level.md', '# Stray\n\nA new top-level entry nobody classified.\n'),
    expect: { check: POLLEN, law: LAW3, contains: ['stray-top-level.md', 'classified by no pollen tier'] },
  },
  {
    // The mirror: a manifest path with nothing behind it — a boundary pointing at nothing.
    name: 'pollen: a manifest path absent from the tree is caught',
    seed: (r) => edit(r, '.seed/lib/pollen.ts', (c) => c.replace("'.gitattributes',", "'.gitattributes',\n  'ghost-local-dir',")),
    expect: { check: POLLEN, law: LAW3, contains: ['ghost-local-dir', 'absent from the tree'] },
  },
  {
    // The pollen version line must be semver (X.Y.Z).
    name: 'pollen: a non-semver pollen version is caught',
    seed: (r) => edit(r, '.seed/lib/pollen.ts', (c) => c.replace(/POLLEN_VERSION = '[^']*'/, "POLLEN_VERSION = '0.0'")),
    expect: { check: POLLEN, law: LAW2, contains: ['the pollen version', 'is not semver'] },
  },
  {
    // The manifest's genome copy must track SEED.md's declared genome version (the E-011 shape,
    // checked). Drift SEED.md's line; the manifest no longer matches its source.
    name: "pollen: the manifest's genome version drifting from SEED.md is caught",
    seed: (r) => edit(r, 'SEED.md', (c) => c.replace('genome v0.1', 'genome v0.2')),
    expect: { check: POLLEN, law: LAW2, contains: ['does not match', 'SEED.md'] },
  },
  {
    // Lineage (SEED.md §7): a required field absent.
    name: 'pollen: a lineage missing a required field is caught',
    seed: (r) => write(r, 'pollen/lineage.json', JSON.stringify({ seedVersion: '0.0.0', genomeVersion: '0.1', parent: null, repo: 'the-seed' })),
    expect: { check: POLLEN, law: LAW2, contains: ['missing planted'] },
  },
  {
    // A present-but-malformed date, distinct from the missing-field branch.
    name: 'pollen: a lineage with a malformed planted date is caught',
    seed: (r) => write(r, 'pollen/lineage.json', JSON.stringify({ seedVersion: '0.0.0', genomeVersion: '0.1', parent: null, planted: 'July 3', repo: 'the-seed' })),
    expect: { check: POLLEN, law: LAW2, contains: ['planted', 'YYYY-MM-DD'] },
  },
  {
    // No-drift cross-check: the seed's recorded seedVersion must match the pollen version it carries.
    name: 'pollen: a lineage seedVersion disagreeing with the manifest is caught',
    seed: (r) => write(r, 'pollen/lineage.json', JSON.stringify({ seedVersion: '9.9.9', genomeVersion: '0.1', parent: null, planted: '2026-07-03', repo: 'the-seed' })),
    expect: { check: POLLEN, law: LAW2, contains: ['9.9.9', 'disagrees with the manifest'] },
  },
  {
    // A non-null parent that is not "owner/repo" (null/absent is the valid root case, exercised by the
    // pristine tree).
    name: 'pollen: a lineage parent that is not owner/repo is caught',
    seed: (r) => write(r, 'pollen/lineage.json', JSON.stringify({ seedVersion: '0.0.0', genomeVersion: '0.1', parent: 'noslash', planted: '2026-07-03', repo: 'the-seed' })),
    expect: { check: POLLEN, law: LAW2, contains: ['parent', 'owner/repo'] },
  },
  {
    // Malformed JSON yields a legible violation, not a crash — and exercises the SHARED reader
    // (lib/lineage.ts), the same throw feedback catches.
    name: 'pollen: a malformed pollen/lineage.json yields a legible violation, not a crash',
    seed: (r) => write(r, 'pollen/lineage.json', 'not json{'),
    expect: { check: POLLEN, law: LAW2, contains: ['not valid JSON'] },
  },
  {
    // Absence is a violation: every seed records its lineage (SEED.md §7). Removing it also dangles
    // the pollen/README.md link (validate-map noise) — harmless; the assertion targets the pollen marker.
    name: 'pollen: an absent lineage is caught',
    seed: (r) => rmSync(join(r, 'pollen/lineage.json')),
    expect: { check: POLLEN, law: LAW2, contains: ['records no lineage'] },
  },
  // --- release model (ring 0027): the pure invariants validate-release gates in run-all. Intent
  // --- cases 1–2 APPEND a bad bullet — a malformed / out-of-vocabulary bullet is SKIPPED by the notes
  // --- generator (it never becomes a composing intent), so pending-release.md is unchanged and only
  // --- validate-release fires. The remaining cases touch the release history or the version line,
  // --- which the pure notes DO depend on, so they regenerate the notes (`generate.ts`) — the honest
  // --- "change source → regenerate" discipline — keeping validate-generated green so the assertion
  // --- isolates the release marker.
  {
    name: 'release: a malformed pending intent is caught',
    seed: (r) => append(r, 'pollen/pending.md', '\n- Impact: minor and nothing else\n'),
    expect: { check: RELEASE, law: LAW2, contains: ['malformed intent bullet'] },
  },
  {
    name: 'release: a pending intent with an out-of-vocabulary impact is caught',
    seed: (r) => append(r, 'pollen/pending.md', '\n- Impact: gigantic — [ring 0026](../docs/rings/0026-pollen-boundary-versioning-lineage.md) — fixture.\n'),
    expect: { check: RELEASE, law: LAW2, contains: ['declares impact "gigantic"'] },
  },
  {
    // The link resolves (a real ring file) so validate-map stays silent; the NUMBER in the link text
    // (9999) has no ring — isolating validate-release's intent-ring-exists branch. A valid-grammar
    // bullet DOES change the notes, so regenerate to keep validate-generated green.
    name: 'release: a pending intent naming a nonexistent ring is caught',
    seed: (r) => {
      append(r, 'pollen/pending.md', '\n- Impact: minor — [ring 9999](../docs/rings/0026-pollen-boundary-versioning-lineage.md) — fixture.\n');
      runNode(r, '.seed/checks/generate.ts');
    },
    expect: { check: RELEASE, law: LAW2, contains: ['references ring 9999', 'does not exist'] },
  },
  {
    // The version line must track history: a released version ahead of POLLEN_VERSION fails. The mother
    // now sits at v0.1.0, so seed a HIGHER release (v0.2.0) to put the version line behind the history.
    name: 'release: POLLEN_VERSION not tracking the latest release is caught',
    seed: (r) => {
      seedReleaseFile(r, '0.2.0');
      runNode(r, '.seed/checks/generate.ts');
    },
    expect: { check: RELEASE, law: LAW3, contains: ['POLLEN_VERSION is "0.1.0"', 'latest release is "0.2.0"'] },
  },
  {
    // The migration tooth (ring 0026): a major (breaking) release must carry a migration. POLLEN moved
    // to 1.0.0 so the version-tracking check passes and ONLY the tooth fires.
    name: 'release: a major release with no migration is caught (the tooth)',
    seed: (r) => {
      seedReleaseFile(r, '1.0.0', { impact: 'major' });
      setPollenVersion(r, '1.0.0');
      runNode(r, '.seed/checks/generate.ts');
    },
    expect: { check: RELEASE, law: LAW2, contains: ['MAJOR', 'carries no migration'] },
  },
  {
    // The tooth's other branch: a major names a migration file that does not exist.
    name: 'release: a major release whose migration is missing is caught',
    seed: (r) => {
      seedReleaseFile(r, '1.0.0', { impact: 'major', migration: '[migration](../migrations/ghost.md)' });
      setPollenVersion(r, '1.0.0');
      runNode(r, '.seed/checks/generate.ts');
    },
    expect: { check: RELEASE, law: LAW2, contains: ['names a migration that does not exist'] },
  },
  {
    // Release-file format: a present-but-invalid Date.
    name: 'release: a release file with no valid date is caught',
    seed: (r) => {
      seedReleaseFile(r, '0.1.0', { date: 'Julyish' });
      setPollenVersion(r, '0.1.0');
      runNode(r, '.seed/checks/generate.ts');
    },
    expect: { check: RELEASE, law: LAW2, contains: ['no valid YYYY-MM-DD Date'] },
  },
  {
    // Release-file format: a composing ring that does not exist (link resolves; number 9999 does not).
    name: 'release: a release file composing a nonexistent ring is caught',
    seed: (r) => {
      seedReleaseFile(r, '0.1.0', { composed: '[ring 9999](../../docs/rings/0026-pollen-boundary-versioning-lineage.md)' });
      setPollenVersion(r, '0.1.0');
      runNode(r, '.seed/checks/generate.ts');
    },
    expect: { check: RELEASE, law: LAW2, contains: ['composes ring 9999', 'does not exist'] },
  },
  {
    // Release-file format: no composing rings at all — a release with no changelog.
    name: 'release: a release file composing no rings is caught',
    seed: (r) => {
      seedReleaseFile(r, '0.1.0', { composed: null });
      setPollenVersion(r, '0.1.0');
      runNode(r, '.seed/checks/generate.ts');
    },
    expect: { check: RELEASE, law: LAW2, contains: ['composes no rings'] },
  },

  // --- judge / inferential control (ring 0030; E-013): the envelope's violation classes ---
  {
    name: 'judgments: a misfiled verdict (bad filename) is caught',
    seed: (r) => write(r, 'docs/judgments/not-a-number.md', '# Judgment\n\nnot a verdict.\n'),
    expect: { check: JUDGMENTS, law: LAW2, contains: ['does not match the verdict filename format'] },
  },
  {
    name: 'judgments: duplicate verdict number is caught',
    seed: (r) => {
      seedVerdict(r, JUDGMENT_NEXT, {}, 'one');
      seedVerdict(r, JUDGMENT_NEXT, {}, 'two');
    },
    expect: { check: JUDGMENTS, law: LAW2, contains: [`duplicate judgment number ${JUDGMENT_NEXT}`] },
  },
  {
    name: 'judgments: title number not matching the filename is caught',
    seed: (r) => seedVerdict(r, JUDGMENT_NEXT, { titleNumber: pad4(Number(JUDGMENT_NEXT) + 1) }),
    expect: { check: JUDGMENTS, law: LAW2, contains: ['does not match filename number'] },
  },
  {
    name: 'judgments: an unknown rubric or version is caught',
    seed: (r) => seedVerdict(r, JUDGMENT_NEXT, { rubric: 'faithfulness v9' }),
    expect: { check: JUDGMENTS, law: LAW2, contains: ['names an unknown rubric or version'] },
  },
  {
    name: 'judgments: a missing Rubric line is caught',
    seed: (r) => seedVerdict(r, JUDGMENT_NEXT, { drop: 'Rubric' }),
    expect: { check: JUDGMENTS, law: LAW2, contains: ['has no valid Rubric line'] },
  },
  {
    name: 'judgments: an unfilled Model placeholder is caught',
    seed: (r) => seedVerdict(r, JUDGMENT_NEXT, { model: '<the model id that judged>' }),
    expect: { check: JUDGMENTS, law: LAW2, contains: ['names no judging model'] },
  },
  {
    name: 'judgments: a missing Date is caught',
    seed: (r) => seedVerdict(r, JUDGMENT_NEXT, { drop: 'Date' }),
    expect: { check: JUDGMENTS, law: LAW2, contains: ['no valid YYYY-MM-DD Date'] },
  },
  {
    name: 'judgments: an off-scale Score is caught',
    seed: (r) => seedVerdict(r, JUDGMENT_NEXT, { score: '9 / 5' }),
    expect: { check: JUDGMENTS, law: LAW2, contains: ['Score 9 is outside'] },
  },
  {
    name: 'judgments: an unfilled Score placeholder is caught',
    seed: (r) => seedVerdict(r, JUDGMENT_NEXT, { score: '<1-5> / 5' }),
    expect: { check: JUDGMENTS, law: LAW2, contains: ['has no valid Score'] },
  },
  {
    name: 'judgments: a missing Rationale is caught',
    seed: (r) => seedVerdict(r, JUDGMENT_NEXT, { rationale: null }),
    expect: { check: JUDGMENTS, law: LAW2, contains: ['has no Rationale'] },
  },
  {
    name: 'judgments: an artifact pin with no hash is caught',
    seed: (r) => seedVerdict(r, JUDGMENT_NEXT, { noPin: true }),
    expect: { check: JUDGMENTS, law: LAW2, contains: ['pins no content hash'] },
  },
  {
    name: 'judgments: a verdict pinning a nonexistent artifact is caught',
    seed: (r) => seedVerdict(r, JUDGMENT_NEXT, { artifactLink: '[ghost](../../docs/ghost-artifact.md)' }),
    expect: { check: JUDGMENTS, law: LAW2, contains: ['pins an artifact that does not exist'] },
  },
  {
    name: 'judgments: a missing Source line is caught',
    seed: (r) => seedVerdict(r, JUDGMENT_NEXT, { drop: 'Source' }),
    expect: { check: JUDGMENTS, law: LAW2, contains: ['has no Source line'] },
  },
  {
    // The deterministic tooth: a verdict whose pinned artifact hash no longer matches the current
    // content is STALE and fails run-all (LAW-6) — the failure mode a probabilistic control must catch.
    name: 'judgments: a STALE verdict (pin no longer matches the artifact) is caught',
    seed: (r) => seedVerdict(r, JUDGMENT_NEXT, { stalePin: true }),
    expect: { check: JUDGMENTS, law: LAW6, contains: ['is STALE'] },
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

inTempCopy((root) => {
  // The reverse direction: a plan living in active/ linked by its completed/ path also
  // resolves — guards against narrowing PLAN_LINK_RE's (active|completed) alternation to
  // one side. A plan can move back to active/ (validate-plans documents that path), so a
  // completed/-written link must survive it too.
  write(root, `docs/plans/active/${PLAN_NEXT}-fixture.md`, validPlan(PLAN_NEXT));
  append(
    root,
    'docs/plans/active/README.md',
    `\n- [${PLAN_NEXT} fixture](../completed/${PLAN_NEXT}-fixture.md) — self-test fixture: an active plan linked by its completed/ path.\n`,
  );
  const { status, output } = runChecks(root);
  report(
    'map: an active plan linked by its completed/ path resolves — no dead link (ring 0013)',
    status === 0 && output.includes('all checks passed'),
    `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
  );
});

// --- work-unit format, the exit-0 side (ring 0036 / E-014): a plan carrying a well-formed
// --- `## Work units` section must pass all checks, so the fixture plan is linked from the active/
// --- README (reachability) and every unit honors the format. The pristine copy already proves both
// --- the vacuous path (the plans with no such section) and a real multi-unit plan (0008) passing.
inTempCopy((root) => {
  write(
    root,
    `docs/plans/active/${PLAN_NEXT}-fixture.md`,
    validPlan(PLAN_NEXT, { workUnits: [validWorkUnit('U1'), validWorkUnit('U2', { status: 'in progress (agent)' })] }),
  );
  append(
    root,
    'docs/plans/active/README.md',
    `\n- [${PLAN_NEXT} fixture](${PLAN_NEXT}-fixture.md) — self-test fixture: a plan with well-formed work units.\n`,
  );
  const { status, output } = runChecks(root);
  report(
    'plans: a plan with well-formed work units passes all checks (ring 0036)',
    status === 0 && output.includes('all checks passed'),
    `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
  );
});

// --- architecture-doc format, the exit-0 side (ring 0015): a valid doc must pass all
// --- checks, so it is linked from the docs/architecture/ README (reachability) and its
// --- content honors every completion condition. The pristine copy already proves the check
// --- is vacuous with zero docs (docs/architecture/ holds only its README).

inTempCopy((root) => {
  write(root, 'docs/architecture/fixture.md', validArchitecture());
  append(root, 'docs/architecture/README.md', '\n- [fixture](fixture.md) — self-test fixture architecture doc.\n');
  const { status, output } = runChecks(root);
  report(
    'architecture: a valid, linked architecture doc passes all checks',
    status === 0 && output.includes('all checks passed'),
    `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
  );
});

// Every enforcement mechanism in the vocabulary (besides the default `lint`) must be
// accepted — pins MECHANISM_RE against a regression that narrows it and wrongly rejects a
// legitimately-enforced rule. doc-only especially: a rule may name it when no lint exists yet.
for (const mech of [
  'doc-only, justified: the target has no CI yet, priced as debt.',
  'CI gate (the hosted workflow)',
  'structural test (a machinery check)',
]) {
  inTempCopy((root) => {
    write(root, 'docs/architecture/fixture.md', validArchitecture({ ruleEnforcement: mech }));
    append(root, 'docs/architecture/README.md', '\n- [fixture](fixture.md) — self-test fixture architecture doc.\n');
    const { status, output } = runChecks(root);
    report(
      `architecture: a rule enforced by "${mech.split(/[ ,(]/)[0]}" passes`,
      status === 0 && output.includes('all checks passed'),
      `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
    );
  });
}

// --- postmortem-entry format, the exit-0 side (ring 0017): a valid three-artifact entry must
// --- pass all checks, so it is linked from the docs/postmortems/ README (reachability) and its
// --- three artifacts all resolve. The pristine copy already proves the check is vacuous with
// --- zero entries (docs/postmortems/ holds only its README).

inTempCopy((root) => {
  write(root, `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`, validPostmortem(POSTMORTEM_NEXT));
  append(root, 'docs/postmortems/README.md', `\n- [fixture](${POSTMORTEM_NEXT}-fixture.md) — self-test fixture postmortem.\n`);
  const { status, output } = runChecks(root);
  report(
    'postmortem: a valid, linked three-artifact entry passes all checks',
    status === 0 && output.includes('all checks passed'),
    `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
  );
});

// Every enforcement mechanism in the vocabulary must be accepted for an invariant — pins
// MECHANISM_RE against a regression that narrows it and wrongly rejects a real invariant.
// doc-only especially: an entry may name it when the host has no CI yet, pricing the residual.
for (const mech of [
  'doc-only, justified: the host has no CI yet, priced as debt.',
  'CI gate (the hosted workflow)',
  'lint (seed/some-rule)',
]) {
  inTempCopy((root) => {
    write(
      root,
      `docs/postmortems/${POSTMORTEM_NEXT}-fixture.md`,
      validPostmortem(POSTMORTEM_NEXT, {
        invariant: `- Invariant: The rule holds — Enforcement: ${mech} — [enforcer](../../.seed/checks/validate-postmortems.ts).`,
      }),
    );
    append(root, 'docs/postmortems/README.md', `\n- [fixture](${POSTMORTEM_NEXT}-fixture.md) — self-test fixture postmortem.\n`);
    const { status, output } = runChecks(root);
    report(
      `postmortem: an invariant enforced by "${mech.split(/[ ,(]/)[0]}" passes`,
      status === 0 && output.includes('all checks passed'),
      `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
    );
  });
}

// --- assessment format, the exit-0 side (Stage 2 exit criterion, ring 0022): a valid
// --- assessment must pass all checks, so it is linked from the docs/assessments/ README
// --- (reachability) and its content honors every completion condition. The pristine copy
// --- already covers the real 0001 assessment passing; this pins a synthetic fixture.

inTempCopy((root) => {
  write(root, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT));
  append(root, 'docs/assessments/README.md', `\n- [fixture](${ASSESS_NEXT}-fixture.md) — self-test fixture assessment.\n`);
  const { status, output } = runChecks(root);
  report(
    'assessment: a valid, four-section assessment passes all checks',
    status === 0 && output.includes('all checks passed'),
    `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
  );
});

// Every product in SEED.md §0's closed vocabulary must be accepted for a finding — pins
// PRODUCT_RE against a regression that narrows it and wrongly rejects a real conversion.
// `priced-debt` (feedback.ts's hyphenated form) is accepted alongside the prose `priced debt`.
for (const product of ['invariant', 'ring', 'priced debt', 'priced-debt', 'deletion']) {
  inTempCopy((root) => {
    write(root, `docs/assessments/${ASSESS_NEXT}-fixture.md`, validAssessment(ASSESS_NEXT, {
      findings: [`- Sensed entropy in the fixture — Product: ${product} — the concrete conversion step.`],
    }));
    append(root, 'docs/assessments/README.md', `\n- [fixture](${ASSESS_NEXT}-fixture.md) — self-test fixture assessment.\n`);
    const { status, output } = runChecks(root);
    report(
      `assessment: a finding converting to "${product}" passes`,
      status === 0 && output.includes('all checks passed'),
      `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
    );
  });
}

// --- principle format, the exit-0 side (plan 0004 scope item 1, ring 0023): a valid principle
// --- must pass all checks, so it is linked from the docs/principles/ README (reachability) and its
// --- Enforcement names a mechanism + links an enforcer that exists. The pristine copy already
// --- proves the REAL first principle (grounded-or-ask) passes; this pins a synthetic fixture.
inTempCopy((root) => {
  write(root, 'docs/principles/fixture.md', validPrinciple('Fixture principle'));
  append(root, 'docs/principles/README.md', '\n- [fixture](fixture.md) — self-test fixture principle.\n');
  const { status, output } = runChecks(root);
  report(
    'principle: a valid, linked principle passes all checks',
    status === 0 && output.includes('all checks passed'),
    `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
  );
});

// --- distilled-reference format, the exit-0 side (intake, plan 0004 scope item 3, ring 0024): a
// --- valid reference must pass all checks, so it is linked from the docs/references/ README
// --- (reachability). The pristine copy already proves the REAL first reference
// --- (harness-engineering.md, all-external corpus) passes; these pin a synthetic external-corpus
// --- fixture AND — the sharp one — an in-repo-corpus reference whose teeth are ACTIVE, so the
// --- teeth are shown not to false-fire on a well-formed distillation.
inTempCopy((root) => {
  write(root, 'docs/references/fixture.md', validReference());
  append(root, 'docs/references/README.md', '\n- [fixture](fixture.md) — self-test fixture reference.\n');
  const { status, output } = runChecks(root);
  report(
    'reference: a valid external-corpus reference passes all checks',
    status === 0 && output.includes('all checks passed'),
    `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  // The in-repo case: the Source links a loose corpus, so quote-match and completeness both bind.
  // The claim quotes text the corpus contains (quote-match satisfied), entry A is cited and entry
  // B is discarded with a reason (completeness satisfied), and the split is inlined — so a
  // well-formed in-repo distillation passes with the teeth fully active.
  write(root, 'docs/refs-corpus-fixture.md', CORPUS_FIXTURE);
  write(root, 'docs/references/fixture.md', validReference({
    source: '- **Source:** [the corpus](../refs-corpus-fixture.md) — retrieved 2026-07-08.',
    seedReading: false,
    claims: [
      '- The corpus says "the seed is a harness" ([entry A](https://example.com/a)).\n  - **Seed reading:** the seed is such a harness.',
      '- Discarded [entry B](https://example.com/b) — out of scope for this fixture.',
    ],
  }));
  append(root, 'docs/references/README.md', '\n- [fixture](fixture.md) — self-test fixture reference (in-repo corpus).\n');
  const { status, output } = runChecks(root);
  report(
    'reference: a valid in-repo-corpus reference passes with the teeth active (no false positive)',
    status === 0 && output.includes('all checks passed'),
    `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
  );
});

// --- generated-artifact discipline, the exit-0 side (onboard-human, ring 0020): `npm run
// --- generate` actually rewrites the artifact, deterministically, to the committed bytes.
// --- CORRUPT the artifact first so the regeneration WRITE is observable (a no-op or crashing CLI
// --- can no longer pass by leaving the already-correct file untouched), assert the CLI exits 0,
// --- assert the file is restored byte-for-byte to the committed content (determinism: the
// --- generator reproduces exactly what is committed — no wall-clock, no environment), and assert
// --- run-all is green after. This is the ONLY test that runs generate.ts, so it must prove the
// --- CLI runs, writes, and is a stable fixpoint — not merely "if it wrote, it wrote identically".
inTempCopy((root) => {
  const artifact = join(root, 'docs/generated/onboarding.md');
  const committed = readFileSync(artifact, 'utf8');
  writeFileSync(artifact, committed + '\nHAND-EDIT that regeneration must overwrite.\n');
  const gen = runNode(root, '.seed/checks/generate.ts');
  const restored = readFileSync(artifact, 'utf8');
  const { status, output } = runChecks(root);
  report(
    'generated: `npm run generate` runs, deterministically rewrites the artifact to the committed bytes, and leaves the tree green',
    gen.status === 0 && restored === committed && status === 0 && output.includes('all checks passed'),
    `expected generate exit 0 + artifact restored to committed bytes + run-all green; genStatus ${gen.status}, restored ${restored === committed}, checkExit ${status}:\n${gen.output}\n---\n${output}`,
  );
});

// --- pollen boundary, the exit-0 side (ring 0026): the pristine copy already proves the mother's
// --- ROOT lineage (parent null) passes. This pins the other valid shape — a DESCENDANT's lineage
// --- recording a real "owner/repo" parent — so the parent-shape acceptance path is shown not to
// --- false-fire on a well-formed non-root lineage.
inTempCopy((root) => {
  write(
    root,
    'pollen/lineage.json',
    JSON.stringify({ seedVersion: '0.1.0', genomeVersion: '0.1', parent: 'fliip92/the-seed', planted: '2026-07-03', repo: 'the-seed' }, null, 2) + '\n',
  );
  const { status, output } = runChecks(root);
  report(
    'pollen: a lineage recording a non-null "owner/repo" parent (a descendant shape) passes',
    status === 0 && output.includes('all checks passed'),
    `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
  );
});

// --- release / graft CLI (plan 0005 scope item 2, ring 0027): the cut-release step is git-aware and
// --- side-effecting, so it lives OUT of run-all and its verification is its --dry-run, pinned here in
// --- the three-binding shape (works / has teeth / side-effect-free) — the worktrees / feedback
// --- precedent. The real cut is proven too (it bumps, clears, regenerates, and leaves run-all green —
// --- the generate.ts fixpoint shape), and the append-only gate is proven with real git history.
const runRelease = (root: string, args: string[]): RunResult => runNode(root, '.seed/checks/release.ts', args);
const runReleaseGate = (root: string, args: string[]): RunResult => runNode(root, '.seed/checks/release-append-only.ts', args);
function parseRelease(output: string): Record<string, unknown> | null {
  const line = output.split('\n').reverse().find((l) => l.trim().startsWith('{'));
  try {
    return line ? (JSON.parse(line) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

// Works + side-effect-free (one block), hermetic: the mother now carries a real v0.1.0, so the fixture
// resets to a pre-release slate and seeds the three founding intents — a dry-run then composes v0.1.0
// (minor, rings 0026 + 0027 + 0028) and writes NOTHING. The temp copy is not a git repo, so non-mutation
// is proven concretely: no release file appears and the three files a real cut would touch are byte-identical.
inTempCopy((root) => {
  resetReleaseArea(root);
  writePending(root, [
    '- Impact: minor — [ring 0026](../docs/rings/0026-pollen-boundary-versioning-lineage.md) — the pollen boundary (fixture).',
    '- Impact: minor — [ring 0027](../docs/rings/0027-release-graft-cli.md) — the release/graft CLI (fixture).',
    '- Impact: minor — [ring 0028](../docs/rings/0028-installer-uninstall.md) — the installer + uninstall (fixture).',
  ]);
  runNode(root, '.seed/checks/generate.ts');
  const pollenBefore = readFileSync(join(root, '.seed/lib/pollen.ts'), 'utf8');
  const pendingBefore = readFileSync(join(root, 'pollen/pending.md'), 'utf8');
  const notesBefore = readFileSync(join(root, 'docs/generated/pending-release.md'), 'utf8');
  const { status, output } = runRelease(root, ['cut-release', '--date', '2026-07-15', '--dry-run', '--json']);
  const p = parseRelease(output);
  const noWrite =
    !existsSync(join(root, 'pollen/releases/v0.1.0.md')) &&
    readFileSync(join(root, '.seed/lib/pollen.ts'), 'utf8') === pollenBefore &&
    readFileSync(join(root, 'pollen/pending.md'), 'utf8') === pendingBefore &&
    readFileSync(join(root, 'docs/generated/pending-release.md'), 'utf8') === notesBefore;
  report(
    'release: cut-release --dry-run composes v0.1.0 (minor, rings 0026+0027+0028) and writes nothing (works + side-effect-free)',
    status === 0 &&
      p?.ok === true &&
      p?.dryRun === true &&
      p?.version === '0.1.0' &&
      p?.impact === 'minor' &&
      JSON.stringify(p?.rings) === JSON.stringify(['0026', '0027', '0028']) &&
      noWrite,
    `expected v0.1.0 minor composing 0026+0027+0028, nothing written; got exit ${status}, noWrite ${noWrite}:\n${output}`,
  );
});

// Teeth: nothing to release. Clear the pending intents; cut-release refuses with a legible reason and
// exit 1 — it cannot compose a release from no intent.
inTempCopy((root) => {
  writePending(root, []);
  runNode(root, '.seed/checks/generate.ts'); // keep the notes consistent with the empty pending
  const { status, output } = runRelease(root, ['cut-release', '--date', '2026-07-15', '--dry-run', '--json']);
  const p = parseRelease(output);
  report(
    'release: cut-release with no pending intents refuses (teeth) — nothing to release',
    status === 1 && p?.ok === false && typeof p?.reason === 'string' && (p.reason as string).includes('nothing to release'),
    `expected exit 1 + "nothing to release", got exit ${status}:\n${output}`,
  );
});

// Teeth: the migration-required tooth (ring 0026). A pending MAJOR intent cannot be cut without a
// migration — cut-release refuses, naming the requirement.
inTempCopy((root) => {
  writePending(root, ['- Impact: major — [ring 0026](../docs/rings/0026-pollen-boundary-versioning-lineage.md) — a breaking fixture change.']);
  runNode(root, '.seed/checks/generate.ts');
  const { status, output } = runRelease(root, ['cut-release', '--date', '2026-07-15', '--dry-run', '--json']);
  const p = parseRelease(output);
  report(
    'release: a major with no --migration refuses (teeth) — the migration-required tooth',
    status === 1 && p?.ok === false && typeof p?.reason === 'string' && (p.reason as string).includes('MAJOR') && (p.reason as string).includes('migration'),
    `expected exit 1 + a MAJOR/migration refusal, got exit ${status}:\n${output}`,
  );
});

// The tooth's pass side: a major WITH an existing --migration composes (a v1.0.0 dry-run), so the
// tooth is shown not to block a well-formed major — teeth that only ever say no prove nothing.
inTempCopy((root) => {
  writePending(root, ['- Impact: major — [ring 0026](../docs/rings/0026-pollen-boundary-versioning-lineage.md) — a breaking fixture change.']);
  runNode(root, '.seed/checks/generate.ts');
  write(root, 'pollen/migrations-fixture.md', '# Migration fixture\n\nHow to adopt the breaking change.\n');
  const { status, output } = runRelease(root, ['cut-release', '--date', '2026-07-15', '--migration', 'pollen/migrations-fixture.md', '--dry-run', '--json']);
  const p = parseRelease(output);
  // The human dry-run prints the release file it would write; its migration link must be relative to
  // the release file's OWN directory (../migrations-fixture.md), not doubly-dotted — a link that would
  // dangle from pollen/releases/. Guards the render's link-depth against a regression.
  const human = runRelease(root, ['cut-release', '--date', '2026-07-15', '--migration', 'pollen/migrations-fixture.md', '--dry-run']).output;
  const linkOk = human.includes('[migration](../migrations-fixture.md)') && !human.includes('../../migrations-fixture.md');
  report(
    'release: a major WITH an existing --migration composes v1.0.0 with a correctly-rooted migration link (the tooth passes a well-formed major)',
    status === 0 && p?.ok === true && p?.version === '1.0.0' && p?.impact === 'major' && typeof p?.migration === 'string' && linkOk,
    `expected exit 0 + v1.0.0 major with a resolvable migration link, got exit ${status}, linkOk ${linkOk}:\n${output}\n---\n${human}`,
  );
});

// The REAL cut (the generate.ts fixpoint shape): run cut-release for real in a temp copy and prove the
// whole side-effecting path — the pollen version + lineage bump, the release file, the cleared pending,
// the regenerated notes — is internally consistent, i.e. run-all is GREEN afterward. This is the only
// test that runs a non-dry cut, so it must prove the writes happen AND leave a valid tree. Hermetic: it
// resets to a pre-release slate + seeds the founding intents, so it cuts v0.1.0 whatever the mother's
// live version (the mother has already cut her own v0.1.0 for real — plan 0005 scope item 4).
inTempCopy((root) => {
  resetReleaseArea(root);
  writePending(root, [
    '- Impact: minor — [ring 0026](../docs/rings/0026-pollen-boundary-versioning-lineage.md) — the pollen boundary (fixture).',
    '- Impact: minor — [ring 0027](../docs/rings/0027-release-graft-cli.md) — the release/graft CLI (fixture).',
    '- Impact: minor — [ring 0028](../docs/rings/0028-installer-uninstall.md) — the installer + uninstall (fixture).',
  ]);
  runNode(root, '.seed/checks/generate.ts');
  const cut = runRelease(root, ['cut-release', '--date', '2026-07-15']);
  const pollenTs = readFileSync(join(root, '.seed/lib/pollen.ts'), 'utf8');
  const lineage = JSON.parse(readFileSync(join(root, 'pollen/lineage.json'), 'utf8'));
  const pending = readFileSync(join(root, 'pollen/pending.md'), 'utf8');
  const notes = readFileSync(join(root, 'docs/generated/pending-release.md'), 'utf8');
  const releaseCut = existsSync(join(root, 'pollen/releases/v0.1.0.md'));
  const after = runChecks(root);
  report(
    'release: a real cut bumps the pollen version + lineage, writes the release, clears pending, regenerates the notes, and leaves run-all green',
    cut.status === 0 &&
      releaseCut &&
      pollenTs.includes("POLLEN_VERSION = '0.1.0'") &&
      lineage.seedVersion === '0.1.0' &&
      pending.includes('_No pending intents') &&
      notes.includes('No pending intents') &&
      after.status === 0 &&
      after.output.includes('all checks passed'),
    `expected a clean cut to v0.1.0 with run-all green; cut exit ${cut.status}, release ${releaseCut}, checks exit ${after.status}:\n${cut.output}\n---\n${after.output}`,
  );
});

// The append-only gate (ring 0027, the ring-append-only shape): a cut release is a published fact, so
// modifying or deleting one fails CI; appending a new one passes. Needs real git history, like the
// ring-append-only cases below.
inTempCopy((root) => {
  git(root, 'init', '--quiet');
  write(root, 'pollen/releases/v0.1.0.md', '# Pollen v0.1.0 — 2026-07-15\n\n- Impact: minor\n- Date: 2026-07-15\n- Composed: [ring 0026](../../docs/rings/0026-pollen-boundary-versioning-lineage.md)\n- Migration: none\n');
  gitCommitAll(root, 'base with a cut release');
  edit(root, 'pollen/releases/v0.1.0.md', (c) => c + '\nA silent rewrite of a published release.\n');
  gitCommitAll(root, 'tamper with a release');
  const { status, output } = runReleaseGate(root, ['HEAD~1']);
  const wanted = [`[${RELEASE_GATE}]`, `law: ${LAW2}`, 'modified'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'release gate: modifying a cut release fails',
    status === 1 && missing.length === 0,
    `expected exit 1 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  write(root, 'pollen/releases/v0.1.0.md', '# Pollen v0.1.0 — 2026-07-15\n\n- Impact: minor\n- Date: 2026-07-15\n- Composed: [ring 0026](../../docs/rings/0026-pollen-boundary-versioning-lineage.md)\n- Migration: none\n');
  gitCommitAll(root, 'base with a cut release');
  rmSync(join(root, 'pollen/releases/v0.1.0.md'));
  gitCommitAll(root, 'delete a release');
  const { status, output } = runReleaseGate(root, ['HEAD~1']);
  const wanted = [`[${RELEASE_GATE}]`, `law: ${LAW2}`, 'deleted'];
  const missing = wanted.filter((s) => !output.includes(s));
  report(
    'release gate: deleting a cut release fails',
    status === 1 && missing.length === 0,
    `expected exit 1 with ${JSON.stringify(wanted)}, got exit ${status}; missing: ${JSON.stringify(missing)}\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  resetReleaseArea(root); // the mother carries a real v0.1.0; reset so "base" genuinely has no releases
  gitCommitAll(root, 'base, no releases');
  write(root, 'pollen/releases/v0.1.0.md', '# Pollen v0.1.0 — 2026-07-15\n\n- Impact: minor\n- Date: 2026-07-15\n- Composed: [ring 0026](../../docs/rings/0026-pollen-boundary-versioning-lineage.md)\n- Migration: none\n');
  append(root, 'pollen/releases/README.md', '\n- [v0.1.0](v0.1.0.md) — 2026-07-15 — minor.\n');
  gitCommitAll(root, 'cut v0.1.0 (append a new release + index line)');
  const { status, output } = runReleaseGate(root, ['HEAD~1']);
  report(
    'release gate: appending a new release (and its index line) passes',
    status === 0 && output.includes('append-only holds'),
    `expected exit 0 + "append-only holds", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, 'only commit');
  const { status, output } = runReleaseGate(root, ['0000000000000000000000000000000000000000']);
  report(
    'release gate: unresolvable base skips with an explicit note',
    status === 0 && output.includes('gate skipped'),
    `expected exit 0 + "gate skipped", got exit ${status}:\n${output}`,
  );
});

// --- graft / uninstall (plan 0005 scope item 3, ring 0028): the installer + the mandated uninstall
// --- path. Side-effecting on a target tree, so — like cut-release and the worktrees lifecycle — they
// --- live OUT of run-all and their verification is a hermetic round-trip pinned here in the worktrees
// --- three-binding shape (works / has teeth / side-effect-free). The source is the temp copy (a seed
// --- grafts its OWN portable subset); the target is a fresh empty repo the case creates and owns.

// A hermetic, empty scratch git repo the case owns and removes — the graft target. treeHash skips .git,
// so its baseline is the empty tree, and a byte-identical uninstall returns it there.
function withEmptyRepo(fn: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'seed-graft-target-'));
  try {
    git(dir, 'init', '--quiet');
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Works + teeth + the exit proof, in one round-trip: a graft from the seed copy into an empty repo lands
// the method (the copied .seed/ + skills/ + SEED.md) and the local scaffold, records the lineage, and
// the target's OWN copied CLI runs (`release.ts sense` reports v0.0.0 against the grafted data —
// self-carrying, E-015); then uninstall restores the target byte-identical. The teeth are the CONTRAST:
// graft must CHANGE the tree (a no-op graft fails `before !== afterGraft`) and uninstall must RESTORE it
// (a no-op uninstall fails `before === afterUninstall`) — neither side can pass vacuously.
inTempCopy((root) => {
  withEmptyRepo((target) => {
    const before = treeHash(target);
    const g = runRelease(root, ['graft', target, '--planted', '2026-07-15', '--parent', 'fliip92/the-seed', '--json']);
    const gp = parseRelease(g.output);
    const afterGraft = treeHash(target);
    const landed = ['.seed/checks/run-all.ts', 'skills/README.md', 'SEED.md', 'AGENTS.md', 'docs/plans/README.md', 'pollen/lineage.json']
      .every((p) => existsSync(join(target, p)));
    let lineageOk = false;
    try {
      const l = JSON.parse(readFileSync(join(target, 'pollen/lineage.json'), 'utf8'));
      lineageOk = l.parent === 'fliip92/the-seed' && l.seedVersion === '0.1.0' && l.planted === '2026-07-15';
    } catch {
      /* lineageOk stays false */
    }
    // The target's own copied CLI runs against the grafted pollen data — the method is installed AND works.
    const sense = runNodeIn(target, join(target, '.seed/checks/release.ts'), ['sense', target, '--json']);
    const sp = parseRelease(sense.output);
    const senseRuns = sense.status === 0 && sp?.version === '0.0.0' && sp?.pending === null;
    const u = runRelease(root, ['uninstall', target, '--json']);
    const up = parseRelease(u.output);
    const afterUninstall = treeHash(target);
    report(
      "graft: installs the method + scaffold (the target's own release.ts sense runs), then uninstall restores it byte-identical (works + teeth: graft changed the tree, uninstall reversed it)",
      g.status === 0 &&
        gp?.ok === true &&
        landed &&
        lineageOk &&
        senseRuns &&
        before !== afterGraft &&
        u.status === 0 &&
        up?.ok === true &&
        before === afterUninstall,
      `expected graft to land+run and uninstall to restore byte-identical; graft ${g.status}/${gp?.ok} landed ${landed} ` +
        `lineage ${lineageOk} sense ${senseRuns} changed ${before !== afterGraft} uninstall ${u.status}/${up?.ok} ` +
        `restored ${before === afterUninstall}\n${g.output}\n---\n${sense.output}\n---\n${u.output}`,
    );
  });
});

// Teeth (refuse to clobber): a pre-existing target file at a graft path makes graft refuse with exit 1,
// naming the conflict — and the host's file is left byte-for-byte untouched, with nothing installed
// (purely additive, LAW-2). A graft that could overwrite would make the byte-identical-uninstall
// guarantee a lie, and a partial install would leave the target neither grafted nor clean.
inTempCopy((root) => {
  withEmptyRepo((target) => {
    write(target, 'AGENTS.md', "the host's own map — do not touch\n");
    const before = readFileSync(join(target, 'AGENTS.md'), 'utf8');
    const { status, output } = runRelease(root, ['graft', target, '--planted', '2026-07-15', '--json']);
    const p = parseRelease(output);
    const untouched = readFileSync(join(target, 'AGENTS.md'), 'utf8') === before;
    const noSeedInstalled = !existsSync(join(target, '.seed'));
    report(
      'graft: refuses to clobber an existing target path (exit 1, names the conflict, host file untouched, nothing installed) — the additive guarantee has teeth',
      status === 1 &&
        p?.ok === false &&
        Array.isArray(p?.conflicts) &&
        (p.conflicts as string[]).includes('AGENTS.md') &&
        untouched &&
        noSeedInstalled,
      `expected exit 1 + ok:false + AGENTS.md in conflicts + host file untouched + nothing installed; got exit ${status}, untouched ${untouched}, noSeed ${noSeedInstalled}\n${output}`,
    );
  });
});

// Side-effect-free preview: graft --dry-run computes the plan and writes NOTHING — the target tree hash
// is unchanged (the cut-release / worktrees dry-run precedent).
inTempCopy((root) => {
  withEmptyRepo((target) => {
    const before = treeHash(target);
    const { status, output } = runRelease(root, ['graft', target, '--planted', '2026-07-15', '--dry-run', '--json']);
    const p = parseRelease(output);
    const after = treeHash(target);
    report(
      'graft: --dry-run composes the plan and writes nothing (side-effect-free — the target is byte-identical after)',
      status === 0 && p?.ok === true && p?.dryRun === true && before === after,
      `expected exit 0 + ok:true + dryRun:true + unchanged tree, got exit ${status}, unchanged ${before === after}\n${output}`,
    );
  });
});

// --- the recursive self-upgrade EXIT PROOF (plan 0005 scope item 4, ring 0029): the seed is its own
// --- first host. This is the reproducible half of "the delta is the proof" (SEED.md §4): the mother's
// --- OWN repo-fitness (ring 0016) measures what her OWN installer (ring 0028) adds to a sacrificial
// --- repo, and uninstall reverses it. An empty repo has no map, so map_reachability reads NULL
// --- (repo-fitness's "null IS the finding"); the graft lays down the map + plan structure + first lints,
// --- making it COMPUTABLE; uninstall returns it to the null baseline. null → computable → null is the
// --- exit-proof shape. Side-effecting on a target tree + hermetic, so — like graft itself — it lives
// --- here, out of run-all. The recorded before/after fact is docs/fitness/recursive-upgrade.md.
inTempCopy((root) => {
  withEmptyRepo((target) => {
    const mapReach = (r: RunResult): unknown =>
      (parseRelease(r.output)?.metrics as Record<string, unknown> | undefined)?.map_reachability;
    const before = mapReach(runRepoFitness(root, [target, '--json']));
    runRelease(root, ['graft', target, '--planted', '2026-07-16', '--parent', 'fliip92/the-seed', '--json']);
    const afterGraft = mapReach(runRepoFitness(root, [target, '--json']));
    runRelease(root, ['uninstall', target, '--json']);
    const afterUninstall = mapReach(runRepoFitness(root, [target, '--json']));
    report(
      'recursive test (ring 0029): the sacrificial graft turns an unmeasurable repo measurable (map_reachability null → computable) and uninstall restores the null baseline — the exit-proof delta, reproducibly',
      before === null && typeof afterGraft === 'number' && afterGraft > 0 && afterUninstall === null,
      `expected map_reachability null → number>0 → null (graft makes the map measurable, uninstall reverts); got ${JSON.stringify(before)} → ${JSON.stringify(afterGraft)} → ${JSON.stringify(afterUninstall)}`,
    );
  });
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
  clearPrinciples(root); // the real organ now ships grounded-or-ask; this case measures zero
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
  clearPrinciples(root); // drop the inherited grounded-or-ask so this case measures exactly three
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
  // The twin of the case above: a SOURCE file no doc links. map_reachability is scoped to knowledge
  // artifacts (markdown docs, ring 0043) — source and config are navigated by code tooling, not the
  // doc map — so a stranded .ts must NOT drag the metric down the way a stranded .md does. Without
  // this, a product monorepo full of source reads a floored fraction that no amount of doc gardening
  // can lift (the dither E-007 finding). Every .md in the pristine copy stays reachable, so the
  // reading must remain a perfect 1 even with an unreachable source file present.
  mkdirSync(join(root, 'src'), { recursive: true }); // src/ isn't in the seed copy; write doesn't mkdir
  write(root, 'src/orphan.ts', 'export const stranded = 1;\n');
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: unreachable source file, all docs reachable`);
  const { output } = runFitness(root, ['--json']);
  const m = fitnessMetrics(output);
  report(
    'fitness: map_reachability ignores unreachable non-doc files (denominator is knowledge artifacts, ring 0043)',
    m.map_reachability === 1,
    `expected map_reachability 1 (a stranded .ts is not a doc), got:\n${output}`,
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

// --- repo-fitness (plan 0003 scope item 2, ring 0016): the read-only §6 assessment of ANY
// --- repository. It shares the metric engine with fitness.ts, so the seed measured through
// --- repo-fitness must equal the seed measured through fitness.ts (self is the target=self
// --- case); against a foreign repo the anatomy-dependent metrics degrade to null with a
// --- reason while drift_count still computes; and a run must not mutate the target. These
// --- cases run the seed COPY's repo-fitness.ts pointed at a SEPARATE foreign temp dir.

// A deterministic hash of a directory tree (excluding .git — git-internal churn is caught
// separately via HEAD + status). Independent of the code under test: a plain fs walk, so it
// cannot be fooled by a bug in the engine's own file walker.
function treeHash(dir: string): string {
  const h = createHash('sha256');
  const walk = (d: string, rel: string): void => {
    for (const entry of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      const r = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        h.update(`D:${r}\n`);
        walk(join(d, entry.name), r);
      } else {
        h.update(`F:${r}\n`);
        h.update(readFileSync(join(d, entry.name)));
      }
    }
  };
  walk(dir, '');
  return h.digest('hex');
}

// A synthetic FOREIGN repo: no seed anatomy (no AGENTS.md, no docs/principles, no plan/ring
// log, no ledger), but a top-level `lib/` so the backtick `lib/ghost.ts` in notes.md is a
// concrete stale path claim doc-drift fires on (its first segment must be an existing
// top-level entry). Optionally a git repo with one commit.
function withForeignRepo(opts: { git: boolean }, fn: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'seed-foreign-'));
  try {
    writeFileSync(join(dir, 'README.md'), '# Foreign project\n\nNo seed anatomy here.\n');
    mkdirSync(join(dir, 'lib'));
    writeFileSync(join(dir, 'lib', 'real.ts'), 'export const x = 1;\n');
    writeFileSync(join(dir, 'notes.md'), 'The helper is `lib/ghost.ts` — which does not exist.\n');
    if (opts.git) {
      git(dir, 'init', '--quiet');
      gitCommitAll(dir, 'initial import');
    }
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const repoFitnessMetrics = (output: string): Record<string, unknown> =>
  (JSON.parse(output) as { metrics: Record<string, unknown> }).metrics;

// Self-equivalence: repo-fitness pointed at the seed itself computes byte-identical metrics
// to fitness.ts — the proof that generalizing the engine did not change the self case.
inTempCopy((root) => {
  git(root, 'init', '--quiet');
  gitCommitAll(root, `Plan ${PLAN_DUP} fixture: repo-fitness self-equivalence base`);
  const rf = JSON.parse(runRepoFitness(root, [root, '--json']).output) as { stage: unknown; metrics: unknown };
  const ft = JSON.parse(runFitness(root, ['--json']).output) as { stage: unknown; metrics: unknown };
  report(
    'repo-fitness <seed> computes the same metrics as fitness.ts (self is the target=self case)',
    JSON.stringify(rf.metrics) === JSON.stringify(ft.metrics) && rf.stage === null && typeof ft.stage === 'number',
    `expected identical metrics with repo-fitness stage null / fitness stage number;\n` +
      `repo-fitness ${JSON.stringify(rf)}\nfitness      ${JSON.stringify(ft)}`,
  );
});

// Foreign git repo, no seed anatomy: the anatomy-dependent metrics are null (with a reason),
// drift_count still catches the seeded stale reference, and the --json envelope is well formed.
inTempCopy((root) => {
  withForeignRepo({ git: true }, (foreign) => {
    const { status, output } = runRepoFitness(root, [foreign, '--json']);
    let parsed: { date?: unknown; stage?: unknown; metrics?: Record<string, unknown>; notes?: Record<string, unknown> } | null;
    try {
      parsed = JSON.parse(output);
    } catch {
      parsed = null;
    }
    const m = parsed?.metrics ?? {};
    const notes = (parsed?.notes ?? {}) as Record<string, string>;
    const ok =
      status === 0 &&
      typeof parsed?.date === 'string' &&
      parsed?.stage === null &&
      m.map_reachability === null &&
      m.enforcement_ratio === null &&
      m.plan_traceability === null &&
      m.ledger_trend === null &&
      m.escalation_rate === null &&
      m.drift_count === 1 &&
      // every null names WHY — the reason is the finding, so a shape-only check is too weak.
      String(notes.map_reachability).includes('no AGENTS.md') &&
      String(notes.enforcement_ratio).includes('no docs/principles/') &&
      String(notes.plan_traceability).includes('no plans or rings') &&
      String(notes.ledger_trend).includes('no entropy ledger');
    report(
      'repo-fitness: a foreign git repo degrades anatomy metrics to null (each with its reason); drift_count still computes',
      ok,
      `expected nulls + drift_count 1 + a reason for each null + {date,stage:null,metrics,notes}, got exit ${status}:\n${output}`,
    );
  });
});

// E-016: a host mapped under a conventional non-AGENTS.md name (dither's is CLAUDE.md — ring 0033)
// is MEASURED, not read as a false null. map_reachability resolves the entry map to the first of
// AGENTS.md, CLAUDE.md the target carries, so a CLAUDE.md-rooted repo computes a real fraction and
// the note names the resolved file (the reading stays legible even when it computes — LAW-2).
inTempCopy((root) => {
  withForeignRepo({ git: true }, (foreign) => {
    writeFileSync(join(foreign, 'CLAUDE.md'), '# Map\n\nSee [notes](notes.md) and [real](lib/real.ts).\n');
    gitCommitAll(foreign, 'add a CLAUDE.md map so the host is legibly mapped under a non-AGENTS.md name');
    const { output } = runRepoFitness(root, [foreign, '--json']);
    const m = repoFitnessMetrics(output);
    const notes = (JSON.parse(output) as { notes: Record<string, string> }).notes;
    report(
      'repo-fitness (E-016): a CLAUDE.md-mapped host computes a real map_reachability, not a false null, and the note names the resolved map',
      typeof m.map_reachability === 'number' &&
        (m.map_reachability as number) > 0 &&
        String(notes.map_reachability).includes('CLAUDE.md'),
      `expected a numeric map_reachability resolved from CLAUDE.md with a naming note, got:\n${output}`,
    );
  });
});

// Foreign NON-git dir: BOTH git-history metrics report the not-a-git-repository reason
// (distinct from the git-but-no-plans / no-ledger reasons), proving the git-root guard fires
// for plan_traceability and — since ledgerTrend now checks git-root before ledger presence —
// for ledger_trend too, so that degrade branch is exercised.
inTempCopy((root) => {
  withForeignRepo({ git: false }, (foreign) => {
    const { output } = runRepoFitness(root, [foreign, '--json']);
    const notes = (JSON.parse(output) as { notes: Record<string, string> }).notes;
    const m = repoFitnessMetrics(output);
    report(
      'repo-fitness: a non-git target reports plan_traceability AND ledger_trend null "not a git repository"',
      m.plan_traceability === null &&
        m.ledger_trend === null &&
        String(notes.plan_traceability).includes('not a git repository') &&
        String(notes.ledger_trend).includes('not a git repository'),
      `expected both history metrics null with a not-a-git-repository reason, got:\n${output}`,
    );
  });
});

// Nested subdirectory of a git repo: the target is inside a git work tree but is NOT its
// root, so the history metrics must refuse to measure the ENCLOSING repo (ring 0016 review).
// `git rev-parse --git-dir` would say "yes, a repo"; only the --show-toplevel comparison
// catches that the target is not the root.
inTempCopy((root) => {
  withForeignRepo({ git: true }, (outer) => {
    const sub = join(outer, 'nested');
    mkdirSync(join(sub, 'docs', 'rings'), { recursive: true });
    writeFileSync(join(sub, 'docs', 'rings', '0001-x.md'), '# Ring 0001\n');
    gitCommitAll(outer, 'Ring 0001 fixture: nested subtree carrying its own ring');
    const { output } = runRepoFitness(root, [sub, '--json']);
    const notes = (JSON.parse(output) as { notes: Record<string, string> }).notes;
    const m = repoFitnessMetrics(output);
    report(
      'repo-fitness: a git subdirectory target refuses history metrics (measures the target, not the enclosing repo)',
      m.plan_traceability === null &&
        m.ledger_trend === null &&
        String(notes.plan_traceability).includes('not the git repository root'),
      `expected history metrics null with a not-the-root reason, got:\n${output}`,
    );
  });
});

// A target carrying a broken .md symlink (dangling, and pointing at a directory) must still
// produce an assessment: readFileSync would throw on both, so the engine skips symlinks
// rather than crash (ring 0016 review). An AGENTS.md is present so the reachability read path
// (which reads every .md) is exercised alongside the drift read path. The fixtures are
// COMMITTED: the metrics count the tracked repository (E-012), so an uncommitted symlink would
// simply be absent — the skip-filter is only exercised when the broken symlink is tracked
// (a foreign host that committed one is exactly the crash risk this guards).
inTempCopy((root) => {
  withForeignRepo({ git: true }, (foreign) => {
    writeFileSync(join(foreign, 'AGENTS.md'), '# Map\n\n[notes](notes.md) and [real](lib/real.ts).\n');
    mkdirSync(join(foreign, 'adir'));
    symlinkSync('does-not-exist.md', join(foreign, 'dangling.md')); // dangling → ENOENT on read
    symlinkSync('adir', join(foreign, 'todir.md')); // → directory → EISDIR on read
    gitCommitAll(foreign, 'commit the map and broken symlinks so the tracked-file listing includes them');
    const { status, output } = runRepoFitness(root, [foreign, '--json']);
    report(
      'repo-fitness: a target with a dangling / directory .md symlink still assesses (no uncaught fs crash)',
      status === 0 && repoFitnessMetrics(output).drift_count === 1,
      `expected exit 0 with drift_count 1 despite unreadable .md symlinks, got exit ${status}:\n${output}`,
    );
  });
});

// Read-only: a run leaves the target's working tree byte-identical and its git state (HEAD +
// porcelain status) untouched. The Scout step modifies nothing (SEED.md §4, Stage 4 step 1).
inTempCopy((root) => {
  withForeignRepo({ git: true }, (foreign) => {
    const treeBefore = treeHash(foreign);
    const headBefore = gitCapture(foreign, 'rev-parse', 'HEAD');
    runRepoFitness(root, [foreign, '--json']);
    runRepoFitness(root, [foreign]); // exercise the human path too
    const treeAfter = treeHash(foreign);
    const headAfter = gitCapture(foreign, 'rev-parse', 'HEAD');
    const statusAfter = gitCapture(foreign, 'status', '--porcelain');
    report(
      'repo-fitness: a run does not mutate the target (tree hash, HEAD, and status unchanged)',
      treeBefore === treeAfter && headBefore === headAfter && statusAfter === '',
      `expected byte-identical target after a run; tree ${treeBefore === treeAfter}, head ${headBefore === headAfter}, status ${JSON.stringify(statusAfter)}`,
    );
  });
});

// E-012 (plan 0006, Stage 4 step-1 pre-flight): the Scout counts the COMMITTED repository
// (`git ls-files`), not the on-disk working tree — an UNTRACKED file (build output, a stray
// `.claude/worktrees/` snapshot) must not inflate a metric (on mottainapp ~150 of 343 drift
// references came from ten untracked worktree snapshots). The proof is the CONTRAST: the same
// stray.md, whose stale `lib/phantom.ts` is a drift reference, is invisible while untracked and
// counted only once committed — so it is git-tracking, not the filename, that decides. This is
// the same file-listing basis the read-only case above proves does not mutate the target.
inTempCopy((root) => {
  withForeignRepo({ git: true }, (foreign) => {
    // withForeignRepo already committed notes.md, whose `lib/ghost.ts` is drift #1.
    writeFileSync(join(foreign, 'stray.md'), 'Stray output names `lib/phantom.ts`, which does not exist.\n');
    const untracked = repoFitnessMetrics(runRepoFitness(root, [foreign, '--json']).output).drift_count;
    gitCommitAll(foreign, 'track the stray file');
    const tracked = repoFitnessMetrics(runRepoFitness(root, [foreign, '--json']).output).drift_count;
    report(
      'repo-fitness: an untracked file does not inflate the count; the same file counts once committed (git ls-files, not the on-disk walk — E-012)',
      untracked === 1 && tracked === 2,
      `expected drift_count 1 while stray.md is untracked and 2 once committed; got untracked ${untracked}, tracked ${tracked}`,
    );
  });
});

// --- parallel-worktrees (plan 0003 scope item 4, ring 0019): the dry-run creates N ISOLATED
// --- git worktrees, boots an instance per worktree through the host-adapter contract, tears
// --- them all down, and asserts isolation + cleanup — all inside a HERMETIC scratch repo it
// --- owns under the OS temp dir and removes at the end, so a run never touches the caller's
// --- tree. These run the seed COPY's worktrees.ts (its scratch lives in tmpdir, not under the
// --- copy), with the same three-binding shape as repo-fitness: it works, its assertions have
// --- teeth, and it is hermetic.

interface WorktreeCheck {
  name: string;
  ok: boolean;
}
interface WorktreeReport {
  ok?: unknown;
  count?: unknown;
  scratch?: unknown;
  checks?: WorktreeCheck[];
}
function parseWorktrees(output: string): WorktreeReport | null {
  try {
    return JSON.parse(output) as WorktreeReport;
  } catch {
    return null;
  }
}
const firedChecks = (parsed: WorktreeReport | null): string[] =>
  (parsed?.checks ?? []).filter((c) => !c.ok).map((c) => c.name);

// The exact ordered set of checks the dry-run emits at --count 3. Pinning the WHOLE set (not just
// "every check ok") is the anti-costume guard the git-guaranteed isolation checks need: no
// assertion can be silently deleted, renamed, or made vacuously-true without turning this red,
// since no --inject fault can force own-branch / distinct-content / unmoved-base-HEAD red on its
// own. Keep this in lockstep with worktrees.ts's record() calls — that lockstep is the point.
const EXPECTED_WORKTREE_CHECKS = [
  'worktree count rose to 4 (base + 3)',
  'each worktree is checked out on its own branch',
  'each worktree holds distinct working-tree content',
  "no worktree's work leaked into the base tree",
  'the base branch HEAD is unchanged (per-branch commit isolation)',
  'all 3 instances booted with a queryable handle',
  'boot dispatched once per worktree (3)',
  'worktree count returned to baseline after teardown',
  'no seed/wt-* branches remain',
  'every worktree directory was removed',
  'teardown dispatched once per booted instance (3)',
];

// It works: the full lifecycle passes (exit 0, ok true), the EXACT check-set is present and all
// green (so no assertion can be silently dropped or stubbed), AND the tool removed its own scratch
// repo — the hermetic property proven externally (the reported scratch path is gone), the same way
// repo-fitness's non-mutation is proven by an external tree hash.
inTempCopy((root) => {
  const { status, output } = runWorktrees(root, ['dry-run', '--count', '3', '--json']);
  const parsed = parseWorktrees(output);
  const names = (parsed?.checks ?? []).map((c) => c.name);
  const setPinned = JSON.stringify(names) === JSON.stringify(EXPECTED_WORKTREE_CHECKS);
  const allOk = (parsed?.checks ?? []).length > 0 && (parsed?.checks ?? []).every((c) => c.ok);
  const scratchGone = typeof parsed?.scratch === 'string' && !existsSync(parsed.scratch);
  report(
    'worktrees: dry-run runs the full lifecycle, the exact 11-check set is present and all green, and it is hermetic',
    status === 0 && parsed?.ok === true && parsed?.count === 3 && setPinned && allOk && scratchGone,
    `expected exit 0 + ok:true + the exact 11-check set all green + scratch removed (setPinned=${setPinned}), got exit ${status}:\n${output}`,
  );
});

// Teeth (isolation): an injected cross-worktree leak into the base tree must make the isolation
// assertion fire and the run exit 1. A dry-run whose isolation check can never go red proves
// nothing (LAW-2). Still hermetic — the scratch is removed even on failure.
inTempCopy((root) => {
  const { status, output } = runWorktrees(root, ['dry-run', '--count', '3', '--inject', 'leak', '--json']);
  const parsed = parseWorktrees(output);
  const fired = firedChecks(parsed);
  const scratchGone = typeof parsed?.scratch === 'string' && !existsSync(parsed.scratch);
  report(
    'worktrees: an injected cross-worktree leak fires the isolation assertion (exit 1) — the dry-run has teeth',
    status === 1 && parsed?.ok === false && fired.some((n) => n.includes('leaked into the base')) && scratchGone,
    `expected exit 1 + ok:false + a fired isolation check + scratch removed, got exit ${status}:\n${output}`,
  );
});

// Teeth (cleanup + teardown dispatch): skipping teardown must make the cleanup assertions fire
// (count not back to baseline, branches survive, directories survive) AND the teardown-dispatch
// assertion fire (the adapter's teardown was not called per instance) and exit 1 — so both the git
// removal and the host-adapter teardown half of the contract are really checked, not just prose.
inTempCopy((root) => {
  const { status, output } = runWorktrees(root, ['dry-run', '--count', '3', '--inject', 'skip-teardown', '--json']);
  const parsed = parseWorktrees(output);
  const fired = firedChecks(parsed);
  const scratchGone = typeof parsed?.scratch === 'string' && !existsSync(parsed.scratch);
  report(
    'worktrees: skipping teardown fires the cleanup AND teardown-dispatch assertions (exit 1) — both halves checked',
    status === 1 &&
      parsed?.ok === false &&
      fired.some((n) => n.includes('returned to baseline')) &&
      fired.some((n) => n.includes('branches remain')) &&
      fired.some((n) => n.includes('directory was removed')) &&
      fired.some((n) => n.includes('teardown dispatched')) &&
      scratchGone,
    `expected exit 1 + ok:false + fired cleanup + teardown-dispatch checks + scratch removed, got exit ${status}:\n${output}`,
  );
});

// Caller-invariance: run the tool from INSIDE a git repo and prove that repo is byte-identical
// afterward — tree hash + `git worktree list` + porcelain status all unchanged. This is the
// read-only-of-the-caller property the tool header and SKILL claim, proven the same before/after
// way repo-fitness proves non-mutation; the dry-run's scratch lives in tmpdir, so a correct run
// touches this caller repo not at all.
inTempCopy((root) => {
  withForeignRepo({ git: true }, (caller) => {
    const treeBefore = treeHash(caller);
    const worktreesBefore = gitCapture(caller, 'worktree', 'list', '--porcelain');
    const { status, output } = runNodeIn(caller, join(root, '.seed/checks/worktrees.ts'), ['dry-run', '--count', '3', '--json']);
    const parsed = parseWorktrees(output);
    const treeAfter = treeHash(caller);
    const worktreesAfter = gitCapture(caller, 'worktree', 'list', '--porcelain');
    const statusAfter = gitCapture(caller, 'status', '--porcelain');
    report(
      'worktrees: running the dry-run from inside a git repo leaves it byte-identical (caller-invariance, like repo-fitness)',
      status === 0 &&
        parsed?.ok === true &&
        treeBefore === treeAfter &&
        worktreesBefore === worktreesAfter &&
        statusAfter === '',
      `expected the caller repo unchanged (tree ${treeBefore === treeAfter}, worktrees ${worktreesBefore === worktreesAfter}, status ${JSON.stringify(statusAfter)}), got exit ${status}:\n${output}`,
    );
  });
});

// --- feedback (plan 0003 scope item 6, ring 0021): compose a well-formed UPSTREAM issue against
// --- the mother seed from ANY repository (LAW-11), WITHOUT posting. These run the seed COPY's
// --- feedback.ts against a synthetic DESCENDANT temp dir (carrying pollen/lineage.json) and
// --- against the seed copy itself (a root seed → refuse). Same three-binding shape as repo-fitness
// --- / worktrees: it works (composes a well-formed issue, the exact ordered section set pinned so
// --- none can be silently dropped), its validation has teeth (a missing field / an unknown kind /
// --- an unknown conversion / a rootless seed each exit 1 with a legible message), and composing is
// --- side-effect-free (the target is byte-identical after a run — nothing is posted).

const runFeedback = (root: string, args: string[]): RunResult => runNode(root, '.seed/checks/feedback.ts', args);

interface FeedbackReport {
  ok?: unknown;
  target?: unknown;
  title?: unknown;
  body?: unknown;
  command?: unknown;
  violations?: unknown;
}
function parseFeedback(output: string): FeedbackReport | null {
  try {
    return JSON.parse(output) as FeedbackReport;
  } catch {
    return null;
  }
}
const feedbackViolations = (parsed: FeedbackReport | null): string[] =>
  Array.isArray(parsed?.violations) ? (parsed.violations as string[]) : [];

// A synthetic DESCENDANT repo: carries pollen/lineage.json naming its parent (the mother seed),
// like a host whose lineage was recorded at Independence (SEED.md §4 step 6). Optionally a git
// repo, so the non-mutation proof can also check HEAD/status.
function withDescendantRepo(opts: { git: boolean }, fn: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'seed-descendant-'));
  try {
    mkdirSync(join(dir, 'pollen'));
    writeFileSync(
      join(dir, 'pollen', 'lineage.json'),
      JSON.stringify({ parent: 'fliip92/the-seed', seedVersion: '0.1.0', planted: '2026-07-05', repo: 'acme-app' }),
    );
    writeFileSync(join(dir, 'README.md'), '# Acme app\n\nA descendant carrying the seed.\n');
    if (opts.git) {
      git(dir, 'init', '--quiet');
      gitCommitAll(dir, 'initial import');
    }
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// A complete, well-formed learning — each teeth case below drops or corrupts exactly one part of it.
const COMPLETE_LEARNING = [
  '--kind', 'capability-gap',
  '--title', 'Grill step needs a timeout',
  '--observation', 'The interview never terminated on an evasive owner.',
  '--generalizes', 'Any host grilling a distracted owner hits this — a method gap, not our app.',
  '--conversion', 'ring',
];

// The exact ORDERED set of body sections a well-formed issue carries — pinned so a section cannot
// be silently dropped, reordered, or renamed (the worktrees exact-check-set anti-costume guard),
// even though no bad-input case forces the happy-path structure red on its own. Keep in lockstep
// with feedback.ts's REQUIRED_SECTIONS.
const EXPECTED_FEEDBACK_SECTIONS = ['## Lineage', '## Kind', '## What happened', '## Why this is upstream', '## Proposed conversion'];

// It works: a descendant's complete learning composes a well-formed issue addressed to its parent,
// with the EXACT ordered section set, the [seed-feedback] title, the descendant's lineage, the
// not-auto-posted footer, and a post command naming the parent.
inTempCopy((root) => {
  withDescendantRepo({ git: false }, (desc) => {
    const { status, output } = runFeedback(root, ['dry-run', desc, ...COMPLETE_LEARNING, '--json']);
    const parsed = parseFeedback(output);
    const body = typeof parsed?.body === 'string' ? parsed.body : '';
    const headers = body.split('\n').filter((l) => l.startsWith('## '));
    const setPinned = JSON.stringify(headers) === JSON.stringify(EXPECTED_FEEDBACK_SECTIONS);
    const ok =
      status === 0 &&
      parsed?.ok === true &&
      parsed?.target === 'fliip92/the-seed' &&
      parsed?.title === '[seed-feedback] Grill step needs a timeout' &&
      setPinned &&
      body.includes('- From: acme-app') &&
      body.includes('- Parent (mother seed): fliip92/the-seed') &&
      body.includes('Not auto-posted') &&
      typeof parsed?.command === 'string' &&
      (parsed.command as string).includes('gh issue create --repo fliip92/the-seed') &&
      feedbackViolations(parsed).length === 0;
    report(
      'feedback: composes a well-formed upstream issue from a descendant (exact ordered section set, target = parent, not auto-posted)',
      ok,
      `expected exit 0 + a well-formed issue to the parent with the exact section set (setPinned=${setPinned}), got exit ${status}:\n${output}`,
    );
  });
});

// Deterministic (the ring 0020 no-wall-clock discipline): the same learning composes byte-identical
// body + command + title across two runs, so a compose can be trusted and diffed.
inTempCopy((root) => {
  withDescendantRepo({ git: false }, (desc) => {
    const a = parseFeedback(runFeedback(root, ['dry-run', desc, ...COMPLETE_LEARNING, '--json']).output);
    const b = parseFeedback(runFeedback(root, ['dry-run', desc, ...COMPLETE_LEARNING, '--json']).output);
    report(
      'feedback: composition is deterministic — the same learning composes byte-identically',
      !!a && !!b && a.body === b.body && a.command === b.command && a.title === b.title && a.ok === true,
      `expected identical composition across two runs`,
    );
  });
});

// Teeth (required field): a learning missing --generalizes is rejected — exit 1, a legible reason
// naming the missing flag. A composer that accepts an incomplete learning composes an ill-formed
// issue, the exact "well-formed" the verification exists to guarantee.
inTempCopy((root) => {
  withDescendantRepo({ git: false }, (desc) => {
    const args = ['dry-run', desc, '--kind', 'defect', '--title', 't', '--observation', 'o', '--conversion', 'ring', '--json'];
    const { status, output } = runFeedback(root, args);
    const parsed = parseFeedback(output);
    report(
      'feedback: a learning missing a required field is rejected (teeth) — exit 1, legible reason',
      status === 1 && parsed?.ok === false && parsed?.body === null && feedbackViolations(parsed).some((s) => s.includes('--generalizes')),
      `expected exit 1 + a violation naming --generalizes, got exit ${status}:\n${output}`,
    );
  });
});

// Teeth (kind vocabulary): an out-of-vocabulary --kind is rejected (the automerge unknown-class
// precedent) — a closed vocabulary the mother seed can triage on, not free text.
inTempCopy((root) => {
  withDescendantRepo({ git: false }, (desc) => {
    const args = ['dry-run', desc, '--kind', 'bogus', '--title', 't', '--observation', 'o', '--generalizes', 'g', '--conversion', 'ring', '--json'];
    const { status, output } = runFeedback(root, args);
    const parsed = parseFeedback(output);
    report(
      'feedback: an unknown --kind is rejected (teeth) — the vocabulary is closed',
      status === 1 && parsed?.ok === false && feedbackViolations(parsed).some((s) => s.includes('is not a feedback kind')),
      `expected exit 1 + a violation that "bogus" is not a feedback kind, got exit ${status}:\n${output}`,
    );
  });
});

// Teeth (conversion vocabulary): the proposed product must be one of SEED.md §0's four — an
// out-of-vocabulary --conversion is rejected.
inTempCopy((root) => {
  withDescendantRepo({ git: false }, (desc) => {
    const args = ['dry-run', desc, '--kind', 'defect', '--title', 't', '--observation', 'o', '--generalizes', 'g', '--conversion', 'whatever', '--json'];
    const { status, output } = runFeedback(root, args);
    const parsed = parseFeedback(output);
    report(
      'feedback: an unknown --conversion is rejected (teeth) — it must be one of SEED.md §0\'s four products',
      status === 1 && parsed?.ok === false && feedbackViolations(parsed).some((s) => s.includes('is not one of SEED.md')),
      `expected exit 1 + a violation that "whatever" is not one of the four products, got exit ${status}:\n${output}`,
    );
  });
});

// Teeth (no upstream to itself): the seed COPY is a root seed (SEED.md present) with no recorded
// parent — it must REFUSE, because feedback flows UPSTREAM (LAW-11) and a learning at the root is a
// ring or a ledger entry, not an issue to yourself. This is the run-against-the-seed-itself case.
inTempCopy((root) => {
  const { status, output } = runFeedback(root, ['dry-run', '.', ...COMPLETE_LEARNING, '--json']);
  const parsed = parseFeedback(output);
  report(
    'feedback: a root seed with no recorded parent refuses (feedback flows upstream — a ring, not an upstream issue)',
    status === 1 &&
      parsed?.ok === false &&
      parsed?.target === null &&
      feedbackViolations(parsed).some((s) => s.includes('root of its lineage') && s.includes('UPSTREAM')),
    `expected exit 1 + a refusal (root of its lineage / flows UPSTREAM), got exit ${status}:\n${output}`,
  );
});

// --parent addresses an upstream for a repo carrying NO recorded lineage (a pre-Flowering host, or
// an ad-hoc run): the lineage fields degrade honestly to "unrecorded" — stated, never fabricated.
inTempCopy((root) => {
  const plain = mkdtempSync(join(tmpdir(), 'seed-plain-'));
  try {
    writeFileSync(join(plain, 'README.md'), '# Plain project\n\nNo seed anatomy, no lineage.\n');
    const { status, output } = runFeedback(root, ['dry-run', plain, ...COMPLETE_LEARNING, '--parent', 'someone/seed', '--json']);
    const parsed = parseFeedback(output);
    const body = typeof parsed?.body === 'string' ? parsed.body : '';
    report(
      'feedback: --parent addresses an upstream for a repo with no recorded lineage (fields degrade to "unrecorded")',
      status === 0 &&
        parsed?.ok === true &&
        parsed?.target === 'someone/seed' &&
        body.includes('- Seed version: unrecorded') &&
        body.includes('- Planted: unrecorded'),
      `expected exit 0 + target someone/seed + unrecorded lineage, got exit ${status}:\n${output}`,
    );
  } finally {
    rmSync(plain, { recursive: true, force: true });
  }
});

// A malformed pollen/lineage.json yields a legible violation, not an uncaught crash (the
// repo-fitness dangling-symlink crash-guard discipline).
inTempCopy((root) => {
  const bad = mkdtempSync(join(tmpdir(), 'seed-badlineage-'));
  try {
    mkdirSync(join(bad, 'pollen'));
    writeFileSync(join(bad, 'pollen', 'lineage.json'), 'not json{');
    writeFileSync(join(bad, 'README.md'), '# x\n');
    const { status, output } = runFeedback(root, ['dry-run', bad, ...COMPLETE_LEARNING, '--json']);
    const parsed = parseFeedback(output);
    report(
      'feedback: a malformed pollen/lineage.json yields a legible violation, not a crash',
      status === 1 && parsed?.ok === false && feedbackViolations(parsed).some((s) => s.includes('not valid JSON')),
      `expected exit 1 + a "not valid JSON" violation, got exit ${status}:\n${output}`,
    );
  } finally {
    rmSync(bad, { recursive: true, force: true });
  }
});

// Side-effect-free (the sharp point of "without posting"): composing against a git descendant
// leaves it byte-identical (tree hash + HEAD + porcelain status — the repo-fitness non-mutation
// proof) and posts nothing — the post command is EMITTED as text, never run. If the tool had
// executed `gh` against this parent it would not exit 0 cleanly here (no gh/auth/upstream); a clean
// exit 0 with the command present as a string is the proof it composed and did not post.
inTempCopy((root) => {
  withDescendantRepo({ git: true }, (desc) => {
    const treeBefore = treeHash(desc);
    const headBefore = gitCapture(desc, 'rev-parse', 'HEAD');
    const { status, output } = runFeedback(root, ['dry-run', desc, ...COMPLETE_LEARNING, '--json']);
    runFeedback(root, ['dry-run', desc, ...COMPLETE_LEARNING]); // exercise the human path too
    const parsed = parseFeedback(output);
    const treeAfter = treeHash(desc);
    const headAfter = gitCapture(desc, 'rev-parse', 'HEAD');
    const statusAfter = gitCapture(desc, 'status', '--porcelain');
    const cmdEmitted = typeof parsed?.command === 'string' && (parsed.command as string).includes('gh issue create');
    report(
      'feedback: composing is side-effect-free — the target is byte-identical and nothing is posted (the command is emitted, not run)',
      status === 0 && cmdEmitted && treeBefore === treeAfter && headBefore === headAfter && statusAfter === '',
      `expected the target unchanged (tree ${treeBefore === treeAfter}, head ${headBefore === headAfter}, status ${JSON.stringify(statusAfter)}) with the command emitted as text, got exit ${status}:\n${output}`,
    );
  });
});

// Teeth (the emitted command must be shell-safe): a title with an apostrophe is POSIX
// single-quote-escaped in the emitted `gh issue create` command, so the command the tool hands the
// Gardener is not broken — or injectable — by an ordinary English title ("doesn't", "owner's"). The
// escaped form closes-escapes-reopens each quote (`'` → `'\''`); the unescaped bug would leave the
// title's apostrophe terminating the single-quoted word early. No such title existed in the suite
// before, so this closes a LAW-6 gap around the composer's own stated deliverable.
inTempCopy((root) => {
  withDescendantRepo({ git: false }, (desc) => {
    const args = ['dry-run', desc, '--kind', 'defect', '--title', "Owner's grill won't stop", '--observation', 'o', '--generalizes', 'g', '--conversion', 'ring', '--json'];
    const { status, output } = runFeedback(root, args);
    const parsed = parseFeedback(output);
    const cmd = typeof parsed?.command === 'string' ? parsed.command : '';
    const escaped = cmd.includes("Owner'\\''s") && cmd.includes("won'\\''t");
    report(
      'feedback: the emitted gh command POSIX-escapes an apostrophe in the title (shell-safe, not injectable)',
      status === 0 && parsed?.ok === true && escaped,
      `expected the emitted command to escape apostrophes (' -> '\\''), got exit ${status}:\n${output}`,
    );
  });
});

// Teeth (legibility): a seed whose pollen/lineage.json is PRESENT but records no parent must refuse
// with a message stating the file records no parent — not that it is absent. The rootless-seed
// branch fires for both absence and a parentless file, so the diagnosed cause must be the true one
// (LAW-2). This also exercises readLineage returning an object with parent undefined.
inTempCopy((root) => {
  const seedish = mkdtempSync(join(tmpdir(), 'seed-rootish-'));
  try {
    writeFileSync(join(seedish, 'SEED.md'), '# genome\n');
    mkdirSync(join(seedish, 'pollen'));
    writeFileSync(join(seedish, 'pollen', 'lineage.json'), JSON.stringify({ seedVersion: '0.1.0' }));
    const { status, output } = runFeedback(root, ['dry-run', seedish, ...COMPLETE_LEARNING, '--json']);
    const parsed = parseFeedback(output);
    report(
      'feedback: a seed with a parentless lineage file refuses with an accurate cause ("records no parent", not "absent")',
      status === 1 &&
        parsed?.ok === false &&
        feedbackViolations(parsed).some((s) => s.includes('records no parent') && !s.includes('no pollen/lineage.json')),
      `expected a refusal naming "records no parent" (not "no pollen/lineage.json"), got exit ${status}:\n${output}`,
    );
  } finally {
    rmSync(seedish, { recursive: true, force: true });
  }
});

// --- judge CLI (ring 0030; E-013): the seam between the deterministic envelope and the host model.
// --- Four proofs: a valid fixture verdict passes the envelope (so the negative cases isolate one
// --- field); `prepare` WORKS and is SIDE-EFFECT-FREE (assembles the pinned prompt + skeleton, writes
// --- nothing — the tree is byte-identical after, the cut-release/graft/feedback dry-run shape); it has
// --- TEETH (refuses an unknown rubric and an absent artifact); and the ROUND-TRIP — a filled skeleton
// --- validates — so the CLI and validate-judgments agree by construction (the generate.ts fixpoint shape).
const runJudge = (root: string, args: string[]): RunResult => runNode(root, '.seed/checks/judge.ts', args);
function parseJudge(output: string): Record<string, unknown> | null {
  const line = output.split('\n').reverse().find((l) => l.trim().startsWith('{'));
  try {
    return line ? (JSON.parse(line) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

inTempCopy((root) => {
  seedVerdict(root, JUDGMENT_NEXT, {});
  append(root, 'docs/judgments/README.md', `\n- [fixture](${JUDGMENT_NEXT}-fixture.md) — self-test fixture verdict.\n`);
  const { status, output } = runChecks(root);
  report(
    'judgments: a valid, fresh verdict passes the envelope (no false positive)',
    status === 0 && output.includes('all checks passed'),
    `expected exit 0 + "all checks passed", got exit ${status}:\n${output}`,
  );
});

inTempCopy((root) => {
  const before = treeHash(root);
  const { status, output } = runJudge(root, ['prepare', 'docs/references/harness-engineering.md', '--rubric', 'faithfulness', '--json']);
  const after = treeHash(root);
  const j = parseJudge(output);
  const ok =
    status === 0 &&
    j !== null &&
    j.ok === true &&
    typeof j.artifactPin === 'string' &&
    (j.artifactPin as string).startsWith('sha256:') &&
    j.source === null && // harness-engineering.md's 29 sources are all external
    typeof j.prompt === 'string' &&
    (j.prompt as string).includes('# Judge task') &&
    typeof j.skeleton === 'string' &&
    (j.skeleton as string).includes('- Score:') &&
    before === after;
  report(
    'judge: `prepare` assembles the pinned prompt + skeleton and writes nothing (works + side-effect-free)',
    ok,
    `expected exit 0, ok, a sha256 pin, external source, a prompt + skeleton, and a byte-identical tree; got exit ${status}, tree-unchanged ${before === after}:\n${output}`,
  );
});

inTempCopy((root) => {
  const bogus = runJudge(root, ['prepare', 'docs/references/harness-engineering.md', '--rubric', 'nope', '--json']);
  const ghost = runJudge(root, ['prepare', 'docs/nowhere.md', '--rubric', 'faithfulness', '--json']);
  const jb = parseJudge(bogus.output);
  const jg = parseJudge(ghost.output);
  report(
    'judge: `prepare` refuses an unknown rubric and an absent artifact (has teeth)',
    bogus.status === 1 && jb?.ok === false && ghost.status === 1 && jg?.ok === false,
    `expected both exit 1 + ok:false; bogus exit ${bogus.status}, ghost exit ${ghost.status}:\n${bogus.output}\n---\n${ghost.output}`,
  );
});

inTempCopy((root) => {
  const { output } = runJudge(root, ['prepare', 'docs/references/harness-engineering.md', '--rubric', 'faithfulness', '--json']);
  const j = parseJudge(output);
  const number = (j?.number as string) ?? JUDGMENT_NEXT;
  const filled = ((j?.skeleton as string) ?? '')
    .replace(/- Model: <[^>]*>/, '- Model: claude-opus-4-8')
    .replace(/- Date: <[^>]*>/, '- Date: 2026-07-17')
    .replace(/- Score: <[^>]*> \/ 5/, '- Score: 4 / 5')
    .replace(/<Concrete justification[\s\S]*?>/, 'A filled round-trip fixture rationale, judging the pinned artifact against the rubric.');
  write(root, `docs/judgments/${number}-roundtrip.md`, filled);
  append(root, 'docs/judgments/README.md', `\n- [roundtrip](${number}-roundtrip.md) — self-test round-trip fixture.\n`);
  const { status, output: checkOut } = runChecks(root);
  report(
    'judge: a filled `prepare` skeleton validates — the CLI and validate-judgments agree by construction',
    status === 0 && checkOut.includes('all checks passed'),
    `expected exit 0 + "all checks passed" after filling the skeleton; got exit ${status}:\n${filled}\n---\n${checkOut}`,
  );
});

console.log(
  failures > 0
    ? `\n${failures}/${ran} self-test(s) failed. A validator that does not fire on its violation class is doc-only enforcement wearing a costume (LAW-2).`
    : `\nall ${ran} self-tests passed — every violation class fires its check, the gate holds, and the pristine tree is green.`,
);
process.exit(failures > 0 ? 1 : 0);
