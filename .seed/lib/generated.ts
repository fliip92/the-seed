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
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, readRepoFile, extractLocalLinks } from './repo.ts';

export interface GeneratedArtifact {
  /** Repo-relative path under docs/generated/ the generator writes. */
  artifact: string;
  /** Repo-relative source files whose existence the check verifies. The anchor(s) the
   *  generator reads directly; secondary sources it discovers through them (the active plans
   *  the map links) are guarded in the generator, so they need not be listed here. */
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

export const MANIFEST: GeneratedArtifact[] = [
  {
    artifact: 'docs/generated/onboarding.md',
    sources: ['AGENTS.md'],
    command: 'npm run generate',
    generate: (root) => generateOnboarding(root),
  },
];
