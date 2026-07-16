// The release model — the SINGLE source of truth (LAW-3) for how a pollen release is composed,
// versioned, and recorded. The model was fixed by founding ring 0026 (pollen is semver; the impact
// class is DECLARED and checked, not parsed from commit keywords; the next version is a pure function
// of the max declared impact; a major forces a migration; the decision log is the changelog); this
// build is ring 0027. Three organs import this one module, so the organ that COMPUTES a release, the
// one that VALIDATES it, and the one that CUTS it cannot drift on what a release IS:
//   - .seed/lib/generated.ts           — computes the pending-release notes (pure, byte-exact-gated)
//   - .seed/checks/validate-release.ts  — gates the pure release invariants in run-all
//   - .seed/checks/release.ts           — the CLI (sense / cut-release)
//
// The two version lines are never conflated (ring 0026): POLLEN_VERSION (.seed/lib/pollen.ts) is the
// single pollen-version source, and it TRACKS the release history — it equals the latest cut release
// (or 0.0.0 before the first). A release date is a recorded-once fact, never a wall-clock read
// (ring 0020): cut-release stamps it from a required --date, so THIS module reads no clock and every
// function here is a pure function of the working tree — the property that lets the pending notes be
// byte-exact-regenerated and validate-release gate in run-all.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, posix } from 'node:path';
import { REPO_ROOT } from './repo.ts';
import { POLLEN_VERSION } from './pollen.ts';

// --- the declared-impact vocabulary (ring 0026). major = breaking (forces a migration), minor =
// --- feature, patch = fix. Ranked so the next version is a pure function of the MAX across intents.
export const IMPACTS = ['major', 'minor', 'patch'] as const;
export type Impact = (typeof IMPACTS)[number];
const RANK: Record<Impact, number> = { major: 3, minor: 2, patch: 1 };

export const PENDING_PATH = 'pollen/pending.md';
export const RELEASES_DIR = 'pollen/releases';
export const MIGRATIONS_DIR = 'pollen/migrations';

// One committed intent: a portable-subtree change awaiting the next release, declaring its impact,
// the ring that decided it, and a one-line summary (ring 0027). Parsed from a top-level bullet of
// pollen/pending.md: `- Impact: <impact> — [ring NNNN](path) — <summary>`.
export interface Intent {
  impact: Impact;
  ring: string; // the four-digit ring number
  summary: string;
  raw: string; // the source bullet, for legible error messages
}

// One cut release, recorded once in pollen/releases/vX.Y.Z.md (append-only, the ring shape).
export interface Release {
  version: string; // semver, from the filename
  file: string; // repo-relative path
  date: string | null; // YYYY-MM-DD (a recorded fact)
  impact: Impact | null;
  rings: string[]; // the ring numbers this release composed
  migration: string | null; // repo-relative path of the migration doc, or null (minor/patch)
}

// A line starting `- Impact:` IS an intent declaration; it must then match the full grammar, so a
// malformed intent is caught (teeth) rather than silently treated as prose.
const INTENT_MARKER = /^- Impact:/;
const INTENT_RE = /^- Impact:\s+([A-Za-z]+)\s+—\s+\[ring (\d{4})\]\(([^)]+)\)\s+—\s+(.+?)\s*$/;

export interface PendingParse {
  intents: Intent[];
  errors: string[]; // legible reasons a marked bullet is not a well-formed intent
}

/** Parse the intent bullets of pollen/pending.md content. Pure (takes the text). Fenced code blocks
 *  are skipped, so the `- Impact: …` grammar EXAMPLE inside the file's own ``` fence is documentation,
 *  not a malformed intent (the repo.ts fence discipline, inlined to keep this pure over content). */
export function parseIntents(content: string): PendingParse {
  const intents: Intent[] = [];
  const errors: string[] = [];
  let fence: { char: string; len: number } | null = null;
  for (const raw of content.split('\n')) {
    const marker = raw.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      const char = marker[1][0];
      const len = marker[1].length;
      if (fence === null) fence = { char, len };
      else if (fence.char === char && len >= fence.len) fence = null;
      continue;
    }
    if (fence !== null) continue; // inside a code fence — an example, not an intent
    if (!INTENT_MARKER.test(raw)) continue; // prose, headings, the empty-state note
    const m = raw.match(INTENT_RE);
    if (!m) {
      errors.push(`malformed intent bullet (expected "- Impact: <${IMPACTS.join('|')}> — [ring NNNN](path) — <summary>"): ${raw.trim()}`);
      continue;
    }
    const impact = m[1].toLowerCase();
    if (!(IMPACTS as readonly string[]).includes(impact)) {
      errors.push(`intent declares impact "${m[1]}", not one of ${IMPACTS.join(', ')} (ring 0026): ${raw.trim()}`);
      continue;
    }
    intents.push({ impact: impact as Impact, ring: m[2], summary: m[4].trim(), raw: raw.trim() });
  }
  return { intents, errors };
}

/** The pending intents recorded under `root`, or an empty parse when pollen/pending.md is absent
 *  (its existence is validate-anatomy's concern; this module owns its CONTENT). */
export function readPending(root: string = REPO_ROOT): PendingParse {
  const path = join(root, PENDING_PATH);
  if (!existsSync(path)) return { intents: [], errors: [] };
  return parseIntents(readFileSync(path, 'utf8'));
}

/** The repo-relative path of the ring file for a four-digit number, or null if no such ring exists.
 *  Keyed on the number, not the link slug, so it agrees with validate-map's own dead-link check by
 *  a different route (belt and suspenders). */
export function ringFileFor(num: string, root: string = REPO_ROOT): string | null {
  const dir = join(root, 'docs/rings');
  if (!existsSync(dir)) return null;
  const f = readdirSync(dir).find((name) => name.startsWith(`${num}-`) && name.endsWith('.md'));
  return f ? `docs/rings/${f}` : null;
}

const VERSION_FILE_RE = /^v(\d+\.\d+\.\d+)\.md$/;

/** Parse one release file's content (its version comes from the filename). Pure. */
export function parseReleaseFile(file: string, version: string, content: string): Release {
  const field = (name: string): string | null => {
    const m = content.match(new RegExp(`^- ${name}:\\s*(.+?)\\s*$`, 'm'));
    return m ? m[1] : null;
  };
  const impactRaw = (field('Impact') ?? '').toLowerCase();
  const impact = (IMPACTS as readonly string[]).includes(impactRaw) ? (impactRaw as Impact) : null;
  const dateRaw = field('Date');
  const date = dateRaw && /^\d{4}-\d{2}-\d{2}$/.test(dateRaw) ? dateRaw : null;
  const composed = field('Composed') ?? '';
  const rings = [...composed.matchAll(/ring (\d{4})/g)].map((m) => m[1]);
  // Migration: "none" (minor/patch) or a markdown link to the migration doc (major).
  const migRaw = field('Migration') ?? '';
  const migLink = migRaw.match(/\[[^\]]*\]\(([^)]+)\)/);
  const migration = migLink ? posix.normalize(posix.join(RELEASES_DIR, migLink[1])) : null;
  return { version, file: `${RELEASES_DIR}/v${version}.md`, date, impact, rings, migration };
}

/** Every cut release under `root`, sorted ascending by semver. */
export function readReleases(root: string = REPO_ROOT): Release[] {
  const dir = join(root, RELEASES_DIR);
  if (!existsSync(dir)) return [];
  const releases: Release[] = [];
  for (const name of readdirSync(dir)) {
    const m = name.match(VERSION_FILE_RE);
    if (!m) continue; // README.md and anything else is not a release file
    releases.push(parseReleaseFile(`${RELEASES_DIR}/${name}`, m[1], readFileSync(join(dir, name), 'utf8')));
  }
  return releases.sort((a, b) => compareSemver(a.version, b.version));
}

/** -1 / 0 / 1 on the three semver components. */
export function compareSemver(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1;
  }
  return 0;
}

/** The highest released version, or "0.0.0" when nothing is released yet. */
export function latestReleased(root: string = REPO_ROOT): string {
  const releases = readReleases(root);
  return releases.length === 0 ? '0.0.0' : releases[releases.length - 1].version;
}

/** The next semver from a version and an impact class (ring 0026). */
export function bump(version: string, impact: Impact): string {
  const [maj, min, pat] = version.split('.').map(Number);
  if (impact === 'major') return `${maj + 1}.0.0`;
  if (impact === 'minor') return `${maj}.${min + 1}.0`;
  return `${maj}.${min}.${pat + 1}`;
}

/** The max declared impact across intents (the bump driver), or null when there are none. */
export function maxImpact(intents: Intent[]): Impact | null {
  return intents.reduce<Impact | null>((hi, i) => (hi === null || RANK[i.impact] > RANK[hi] ? i.impact : hi), null);
}

export interface PendingRelease {
  baseline: string; // the current pollen version (POLLEN_VERSION)
  next: string; // the version the next release would carry
  impact: Impact; // the max declared impact
  intents: Intent[];
  migrationRequired: boolean; // a major cannot land as a pure additive graft (ring 0026)
}

/**
 * The release the current pending intents would compose, or null when there are none pending. Bumps
 * from the latest RELEASED version (the release history is the ground truth of "current pollen
 * version"; validate-release proves POLLEN_VERSION equals it), so this is correct against any root —
 * a descendant sensing its mother bumps from the mother's history, not this seed's constant. Pure: a
 * function of pollen/pending.md and pollen/releases/, no clock.
 */
export function nextRelease(root: string = REPO_ROOT): PendingRelease | null {
  const { intents } = readPending(root);
  const impact = maxImpact(intents);
  if (impact === null) return null;
  const baseline = latestReleased(root);
  return {
    baseline,
    next: bump(baseline, impact),
    impact,
    intents,
    migrationRequired: impact === 'major',
  };
}

// --- rendering (single source for what the ARTIFACTS look like, so cut-release and the self-tests
// --- agree on the exact bytes) ---

const GEN_HEADER =
  '> This page is **generated from repo state** by' +
  ' [`.seed/checks/generate.ts`](../../.seed/checks/generate.ts) — do not hand-edit it (see' +
  ' [docs/generated/README.md](README.md)). It is a pure function of' +
  ' [`pollen/pending.md`](../../pollen/pending.md), the pollen version, and the release history;' +
  ' `npm run check` fails the moment it drifts.';

/** The pending-release notes (docs/generated/pending-release.md) — pure bytes from `root`. Ring
 *  references render as plain text (not links), so the generated artifact carries no relative links
 *  that would dangle from docs/generated/ (the onboarding.md discipline, ring 0020). */
export function renderPendingNotes(root: string = REPO_ROOT): string {
  const pending = nextRelease(root);
  const lines: string[] = [
    '# Pending pollen release — generated from committed intent',
    '',
    GEN_HEADER,
    '',
    `The pollen line currently rests at **v${POLLEN_VERSION}** (the latest cut release; the two`,
    'version lines — genome and pollen — are never conflated, ring 0026).',
    '',
    '## Next release',
    '',
  ];
  if (pending === null) {
    lines.push(
      '- **No pending intents.** Declare a portable-subtree change in' +
        ' [`pollen/pending.md`](../../pollen/pending.md) — `- Impact: <major|minor|patch> — [ring NNNN](…) — <summary>` —',
      '  to compose the next release.',
    );
  } else {
    lines.push(
      `- **Version:** v${pending.next} (${pending.impact}) — bumped from v${pending.baseline} by the maximum declared impact.`,
      `- **Migration required:** ${pending.migrationRequired ? 'YES — a major release cannot be adopted as a pure additive graft; it must carry a migration (ring 0026).' : 'no — a ' + pending.impact + ' release is a backward-compatible graft.'}`,
      '- **Composing:**',
      ...pending.intents.map((i) => `  - ${i.impact} — ring ${i.ring} — ${i.summary}`),
      '',
      `Cut it with \`node .seed/checks/release.ts cut-release --date YYYY-MM-DD\` — the first real cut is`,
      'the recursive self-upgrade test ([plan 0005](../plans/active/0005-flowering.md) scope item 4).',
    );
  }
  lines.push(
    '',
    '---',
    '',
    'Generated by `npm run generate` from pollen/pending.md and the release history; regenerates',
    'deterministically from repo state (the docs/generated/ discipline).',
  );
  return lines.join('\n') + '\n';
}

/** The bytes of a release file (pollen/releases/vX.Y.Z.md) for a cut. Ring links are rebased to the
 *  releases directory; a migration link is embedded for a major, else "none". Single source shared by
 *  cut-release and the self-tests. */
export function renderReleaseFile(
  version: string,
  date: string,
  impact: Impact,
  intents: Intent[],
  migration: string | null,
  root: string = REPO_ROOT,
): string {
  const composed = intents
    .map((i) => {
      const path = ringFileFor(i.ring, root);
      return path ? `[ring ${i.ring}](../../${path})` : `ring ${i.ring}`;
    })
    .join(', ');
  // The migration link is relative to the release file's own directory (RELEASES_DIR): posix.relative
  // already yields that path (e.g. ../migrations/x.md), so it is NOT prefixed further — and it round-
  // trips through parseReleaseFile, which re-joins it against RELEASES_DIR to recover the repo path.
  const migField = migration ? `[migration](${posix.relative(RELEASES_DIR, migration)})` : 'none';
  return (
    [
      `# Pollen v${version} — ${date}`,
      '',
      `- Impact: ${impact}`,
      `- Date: ${date}`,
      `- Composed: ${composed}`,
      `- Migration: ${migField}`,
      '',
      '## Notes',
      '',
      ...intents.map((i) => `- ${i.impact} — ring ${i.ring} — ${i.summary}`),
    ].join('\n') + '\n'
  );
}

/** The pending.md content once its intents are consumed by a cut — the empty state. */
export function renderEmptyPending(): string {
  return (
    [
      '# Pending release intents',
      '',
      'The unreleased portable-subtree changes awaiting the next pollen release. Each is one top-level',
      'bullet:',
      '',
      '```',
      '- Impact: <major|minor|patch> — [ring NNNN](../docs/rings/NNNN-slug.md) — <one-line summary>',
      '```',
      '',
      'The impact is DECLARED, not parsed from commits (ring 0026): major = breaking (forces a',
      'migration), minor = feature, patch = fix. `node .seed/checks/release.ts cut-release --date',
      'YYYY-MM-DD` folds these into a dated release under [releases/](releases/README.md), bumps the',
      'pollen version, and clears this file. The pending-release notes',
      '([docs/generated/pending-release.md](../docs/generated/pending-release.md)) are computed from',
      'this file and byte-exact-gated by `npm run check`.',
      '',
      '_No pending intents — the pollen line rests. Declare one above to compose the next release._',
    ].join('\n') + '\n'
  );
}
