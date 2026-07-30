// The generation manifest (converting ledger E-001) and the generators it registers.
//
// docs/generated/ holds artifacts PRODUCED BY SCRIPTS, NEVER BY HAND (SEED.md §2): a
// hand-edit is a lint error, and the fix always goes into the generator, then regenerate.
// This module is that discipline made mechanical. Every generated artifact is one MANIFEST
// entry naming (a) the artifact path under docs/generated/, (b) the source files it derives
// from, (c) the command that regenerates it, and (d) a PURE `generate(root)` function — the
// single definition of what the artifact IS (LAW-3), shared by the generator CLI
// (.seed/checks/generate.ts) and the check that guards it (.seed/checks/validate-generated.ts).
//
// A generator MUST be a pure function of repo files: no wall-clock, no randomness, no
// environment. That is the whole point — the check regenerates from source and fails if the
// committed file differs, so the artifact cannot silently drift from the state it summarizes
// (a stale briefing is the exact drift class postmortem 0001 records). Embedding "generated
// on <date>" would make every regeneration differ from the last and fabricate drift; provenance
// is stated structurally ("generated from repo state — do not hand-edit"), never temporally.
//
// Ring 0020.
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, readRepoFile, extractLocalLinks, ledgerCounts, numberedFilenames } from './repo.ts';
import { renderPendingNotes } from './release.ts';

export interface GeneratedArtifact {
  /** Repo-relative path under docs/generated/ the generator writes. */
  artifact: string;
  /** Repo-relative sources the artifact derives from, named in the check's failure message: the
   *  anchor(s) the generator reads directly — a file, or a directory whose CONTENTS are the source
   *  (a count is a function of what an organ holds, not of any one file). Secondary sources
   *  discovered through them (the active plans the map links) are guarded in the generator. */
  sources: string[];
  /** How a human (or agent) regenerates it. */
  command: string;
  /** Pure function producing the artifact's exact bytes from the repo at `root`. */
  generate: (root: string) => string;
}

/** The Stage from AGENTS.md's Current state: `- **Stage:** N — Name`. The map (LAW-4) is the
 *  authoritative statement of current state, so the briefing derives from it, not from a
 *  second copy that could drift (E-011 is exactly two stage sources disagreeing). */
function stageFrom(root: string): { num: string; name: string } {
  const m = readRepoFile('AGENTS.md', root).match(/\*\*Stage:\*\*\s*(\d+)\s*—\s*([A-Za-z]+)/);
  if (!m) throw new Error('AGENTS.md has no `- **Stage:** N — Name` line to derive current state from');
  return { num: m[1], name: m[2] };
}

/** The first paragraph under `## Goal`, newlines collapsed and inline markdown links
 *  flattened to their text — so the imported prose carries no relative links that would
 *  dangle when embedded in a docs/generated/ artifact (its links resolve from a different
 *  directory than the plan's). */
function goalOf(planContent: string): string {
  const lines = planContent.split('\n');
  const start = lines.findIndex((l) => l.trim() === '## Goal');
  if (start === -1) return '';
  const para: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') {
      if (para.length) break;
      continue;
    }
    if (/^## /.test(lines[i])) break;
    para.push(lines[i].trim());
  }
  return para
    .join(' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

interface ActivePlan {
  path: string; // repo-relative
  title: string; // "Plan 0003 — Growth (Stage 2)"
  goal: string;
}

/** The active plans the map (AGENTS.md) links, that actually exist — each with its title and
 *  goal, sorted by number and deduped. Sourcing from the map's own links (not a directory
 *  listing) keeps the briefing anchored to the entry point AND deterministic: a stray or
 *  ghost active-plan file that the map does not link never perturbs the output. */
function activePlansFrom(root: string): ActivePlan[] {
  const seen = new Set<string>();
  const plans: (ActivePlan & { num: number })[] = [];
  for (const link of extractLocalLinks('AGENTS.md', root)) {
    const m = link.target.match(/^docs\/plans\/active\/(\d{4})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/);
    if (!m || seen.has(link.target) || !existsSync(join(root, link.target))) continue;
    seen.add(link.target);
    const content = readRepoFile(link.target, root);
    const title = (content.split('\n').find((l) => /^# Plan /.test(l)) ?? '# Plan').replace(/^# /, '').trim();
    plans.push({ num: Number(m[1]), path: link.target, title, goal: goalOf(content) });
  }
  return plans
    .sort((a, b) => a.num - b.num)
    .map(({ path, title, goal }) => ({ path, title, goal }));
}

/** A repo-relative `docs/plans/...` path as a link relative to docs/generated/. */
const planLinkFromGenerated = (path: string): string => '../plans/' + path.slice('docs/plans/'.length);

/** The onboard-human briefing: current state → goal, derived deterministically from the map
 *  and the active plan it links (skill: skills/onboard-human/SKILL.md). */
export function generateOnboarding(root: string = REPO_ROOT): string {
  const stage = stageFrom(root);
  const plans = activePlansFrom(root);

  const planBlock =
    plans.length > 0
      ? plans.map((p) => `  - [${p.title}](${planLinkFromGenerated(p.path)}) — ${p.goal}`)
      : [
          '  - _No active plan. Run the metabolism (SEED.md §3): sense for entropy, price it into the' +
            ' entropy ledger, and convert the highest-interest entry whose path is not gated._',
        ];

  const lines = [
    '# Onboarding — The Seed',
    '',
    '> This page is **generated from repo state** by' +
      ' [`.seed/checks/generate.ts`](../../.seed/checks/generate.ts) — do not hand-edit it (see' +
      ' [docs/generated/README.md](README.md)). To change what it says, change the source it' +
      ' derives from and run `npm run generate`.',
    '',
    'You are looking at **the Seed**: a self-hosting agent system that maintains and grows itself',
    'under a small set of laws. This is a briefing for a human meeting it for the first time —',
    'where the Seed is now, and where it is going. Because every line below is derived from the',
    "repository's own state, `npm run check` fails the moment this page drifts from the truth.",
    '',
    '## Where the Seed is now',
    '',
    `- **Stage:** ${stage.num} — ${stage.name}.`,
    `- **Active plan${plans.length === 1 ? '' : 's'} — where it is going:**`,
    ...planBlock,
    '',
    '## How to get oriented',
    '',
    '1. Read [AGENTS.md](../../AGENTS.md) — the map, and your entry point every session.',
    '2. Read [SEED.md](../../SEED.md) — the genome: the laws, the anatomy, the stages.',
    '3. Before claiming any change is done, run `npm run check`.',
    '',
    "The first law you will feel: **legible and enforceable, or it doesn't exist** (LAW-2). The",
    'Seed does not accept a rule it cannot check — including this very page.',
    '',
    '---',
    '',
    'Generated by `npm run generate` from the map and the active plan; regenerates',
    'deterministically from repo state (the docs/generated/ discipline).',
  ];
  return lines.join('\n') + '\n';
}

// ---------------------------------------------------------------------------------------------
// The state block (E-026, ring 0056): the counts the public README used to restate by hand.
//
// Six of its claims were false when the fifth sensing pass read it — 21 rings against 53, seven
// skills against 9, "no principles stated yet" a week after the first one was. Every count drifts
// monotonically from the moment it is typed, and nothing read them: the drift scan checks backticked
// PATHS, validate-map checks links, so `drift_count 0` was correct and blind at the same time. The
// conversion is generate-don't-detect (the ring-0020 shape, not a `stale-count` prose regex): each
// number is a pure function of the tree, the README links this page instead of restating it, and the
// regeneration gate makes a stale count impossible rather than merely detectable.

/** Directories directly inside `dir` that carry `marker` — the `skills/<name>/SKILL.md` convention,
 *  so a stray file or a half-planted directory is not counted. 0 when the organ is absent (a
 *  descendant carrying this manifest need not have one — the numberedFilenames contract). */
function dirsCarrying(dir: string, marker: string, root: string): number {
  const abs = join(root, dir);
  if (!existsSync(abs)) return 0;
  return readdirSync(abs, { withFileTypes: true }).filter(
    (e) => e.isDirectory() && existsSync(join(abs, e.name, marker)),
  ).length;
}

/** Slugged (non-numbered) `.md` entries in an organ, excluding its index README — how
 *  docs/principles/ is shaped. 0 when the organ is absent. */
function sluggedCount(dir: string, root: string): number {
  const abs = join(root, dir);
  if (!existsSync(abs)) return 0;
  return readdirSync(abs).filter((f) => f.endsWith('.md') && f !== 'README.md').length;
}

interface Snapshot {
  date: string;
  stage: number | null;
  metrics: Record<string, number | null>;
}

const HISTORY_DIR = 'docs/fitness/history';

/** The newest dated snapshot in docs/fitness/history/ (`YYYY-MM-DD.json` — lexicographic max is
 *  chronological max for ISO dates), or null when the organ carries none. A malformed snapshot
 *  throws, which validate-generated reports as "could not regenerate": a legible violation naming
 *  the artifact, not a crash. */
function latestSnapshot(root: string): { file: string; snap: Snapshot } | null {
  const abs = join(root, HISTORY_DIR);
  if (!existsSync(abs)) return null;
  const dated = readdirSync(abs)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort();
  if (dated.length === 0) return null;
  const file = dated[dated.length - 1];
  return { file, snap: JSON.parse(readRepoFile(`${HISTORY_DIR}/${file}`, root)) as Snapshot };
}

/** One metric's reading, rendered the way `npm run fitness` prints it. The values are READ from the
 *  committed snapshot, never recomputed: `plan_traceability` is a function of git history and
 *  `ledger_trend` of history plus a trailing 7-day window (SEED.md §6), so a generator that computed
 *  them would change when nothing in the tree did — exactly what the byte-exact gate forbids. The
 *  three file-pure metrics are read from the same snapshot rather than recomputed for a second
 *  reason: `map_reachability` counts the link graph THIS page is part of, so computing it here would
 *  make the artifact a function of its own output. What a metric MEANS still has one definition
 *  (.seed/lib/fitness-metrics.ts); this is presentation over a landed number. */
function renderReading(key: string, value: number | null): string {
  if (key === 'escalation_rate' && value === null) return 'null — no run-log instrument yet';
  if (value === null) return 'null';
  if (key === 'drift_count') return String(value);
  if (key === 'ledger_trend') return `${value >= 0 ? '+' : ''}${value} open entries (trailing 7 days)`;
  return `${(value * 100).toFixed(1)}%`;
}

/** The generated state block: what the repository has grown, counted from the tree, plus the latest
 *  committed fitness snapshot. The public README links this instead of restating it (E-026). */
export function generateState(root: string = REPO_ROOT): string {
  const rings = numberedFilenames('docs/rings', root).length;
  const completed = numberedFilenames('docs/plans/completed', root).length;
  const active = numberedFilenames('docs/plans/active', root).length;
  const skills = dirsCarrying('skills', 'SKILL.md', root);
  const principles = sluggedCount('docs/principles', root);
  const ledgerPath = 'docs/plans/entropy-ledger.md';
  const ledger = existsSync(join(root, ledgerPath))
    ? ledgerCounts(readRepoFile(ledgerPath, root))
    : { open: 0, paid: 0 };
  const latest = latestSnapshot(root);

  const fitnessBlock = latest
    ? [
        `Snapshot [${latest.snap.date}](../fitness/history/${latest.file})` +
          `${latest.snap.stage === null ? '' : `, stage ${latest.snap.stage}`} — the newest in`,
        '[history/](../fitness/history/README.md). Fitness is a **trend, not a grade**: the method, the',
        'definitions, and the dated comparison live in [FITNESS.md](../fitness/FITNESS.md). These are the',
        'landed numbers, not a live recomputation: two of the six read git history, which a generated',
        'artifact may not (it must be a pure function of the tree, or it cannot be gated byte-exact).',
        '',
        '| Metric | Reading |',
        '|---|---|',
        ...Object.entries(latest.snap.metrics).map(([k, v]) => `| \`${k}\` | ${renderReading(k, v)} |`),
      ]
    : ['_No fitness snapshot committed yet — run `npm run fitness -- --json` and land one in_ `docs/fitness/history/`.'];

  const lines = [
    '# State — counted from the tree',
    '',
    '> This page is **generated from repo state** by' +
      ' [`.seed/checks/generate.ts`](../../.seed/checks/generate.ts) — do not hand-edit it (see' +
      ' [docs/generated/README.md](README.md)). To change a number here, change the repository and' +
      ' run `npm run generate`.',
    '',
    'Every count below is derived from the tree it is committed in, so a stale one is not merely',
    'detectable — it is impossible: [validate-generated](../../.seed/checks/validate-generated.ts)',
    'fails `npm run check` the moment a number stops matching what the generator produces. The public',
    '[README](../../README.md) links here rather than restating these, because a hand-typed count is',
    'wrong the moment the next ring lands (ring 0056, paying E-026).',
    '',
    '## Grown so far',
    '',
    '| What | Count |',
    '|---|---|',
    `| Decisions recorded — [rings](../rings/README.md) | ${rings} |`,
    `| [Plans](../plans/README.md) | ${completed} completed, ${active} active |`,
    `| [Skills](../../skills/README.md) planted | ${skills} |`,
    `| [Principles](../principles/README.md) stated | ${principles} |`,
    `| [Entropy ledger](../plans/entropy-ledger.md) | ${ledger.open} open, ${ledger.paid} paid |`,
    '',
    '## Fitness — the latest committed snapshot',
    '',
    ...fitnessBlock,
    '',
    'The portable distribution has its own generated page: what the next pollen release would be, and',
    'the version the line rests at, are in [pending-release.md](pending-release.md).',
    '',
    '---',
    '',
    'Generated by `npm run generate` from the organs themselves and the latest fitness snapshot;',
    'regenerates deterministically from repo state (the docs/generated/ discipline).',
  ];
  return lines.join('\n') + '\n';
}

export const MANIFEST: GeneratedArtifact[] = [
  {
    artifact: 'docs/generated/onboarding.md',
    sources: ['AGENTS.md'],
    command: 'npm run generate',
    generate: (root) => generateOnboarding(root),
  },
  {
    // The pending-release notes (ring 0027): what the next pollen release WOULD be, computed purely
    // from the committed intents in pollen/pending.md + the pollen version + the release history — the
    // ring-0020 determinism split's "pure pending notes, byte-exact-gated" half. The generator lives
    // in the release model (.seed/lib/release.ts), the single source of truth read by the check and
    // the CLI too. Its sources include pollen/pending.md; the generator reads the release history
    // (pollen/releases/) directly, guarded there, so it need not be listed as an anchor.
    artifact: 'docs/generated/pending-release.md',
    sources: ['pollen/pending.md'],
    command: 'npm run generate',
    generate: (root) => renderPendingNotes(root),
  },
  {
    // The state block (ring 0056, converting E-026): the counts the public front door restated by
    // hand and nothing read. Its sources are the ORGANS — a count is a function of what the
    // directory holds, not of any one file — plus the ledger and the latest committed snapshot.
    artifact: 'docs/generated/state.md',
    sources: [
      'docs/rings/',
      'docs/plans/',
      'skills/',
      'docs/principles/',
      'docs/plans/entropy-ledger.md',
      'docs/fitness/history/',
    ],
    command: 'npm run generate',
    generate: (root) => generateState(root),
  },
];
