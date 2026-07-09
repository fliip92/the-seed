// Shared machinery helpers. Zero dependencies (ring 0002, LAW-7): the needed subset —
// walking the repo, extracting markdown links, formatting violations — is small enough
// to own outright.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve, dirname, posix } from 'node:path';

export const REPO_ROOT = resolve(import.meta.dirname, '..', '..');

const EXCLUDED_DIRS = new Set(['.git', 'node_modules']);
const EXCLUDED_FILES = new Set(['.DS_Store']);

export interface Violation {
  check: string;   // e.g. "seed/validate-map"
  law: string;     // e.g. "LAW-4 — the map is the entry point"
  problem: string; // what is wrong, with file:line where applicable
  fix: string;     // concretely how to comply — written for the agent reading the failure
}

export interface CheckResult {
  summary: string; // one line shown on success, e.g. "2 rings valid"
  violations: Violation[];
}

export interface Check {
  id: string;
  run(files: string[]): CheckResult;
}

export function toPosix(p: string): string {
  return p.split('\\').join('/');
}

// Every file-reading helper below takes an optional `root`, defaulting to REPO_ROOT.
// With the default, all existing callers (the run-all checks) see the seed's own tree,
// unchanged. Passing a different root points the exact same analysis at any other
// repository — the one capability repo-fitness needs (plan 0003 scope item 2, ring 0016):
// the seed measures a foreign repo by running its own instruments against that repo's
// root, so "what a metric means" has a single implementation (LAW-3).

/** All files under `root` as sorted root-relative posix paths, minus .git/node_modules/OS noise. */
export function listRepoFiles(root: string = REPO_ROOT): string[] {
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRS.has(entry.name)) walk(abs);
      } else if (!EXCLUDED_FILES.has(entry.name)) {
        out.push(toPosix(relative(root, abs)));
      }
    }
  };
  walk(root);
  return out.sort();
}

export function readRepoFile(repoRelPath: string, root: string = REPO_ROOT): string {
  return readFileSync(join(root, repoRelPath), 'utf8');
}

export interface MdLine {
  n: number;    // 1-based line number
  text: string; // line content with inline code spans blanked
}

/**
 * Markdown lines that carry meaning for link analysis: fenced code blocks are removed
 * (fences close only on a matching marker — same character, at least the opening length)
 * and inline code spans (any backtick run) are blanked.
 */
export function visibleMarkdownLines(repoRelPath: string, root: string = REPO_ROOT): MdLine[] {
  const lines = readRepoFile(repoRelPath, root).split('\n');
  const out: MdLine[] = [];
  let fence: { char: string; len: number } | null = null;
  lines.forEach((raw, i) => {
    const marker = raw.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      const char = marker[1][0];
      const len = marker[1].length;
      if (fence === null) {
        fence = { char, len };
      } else if (fence.char === char && len >= fence.len) {
        fence = null;
      }
      return; // fence markers and non-closing markers inside a fence are never content
    }
    if (fence !== null) return;
    out.push({ n: i + 1, text: raw.replace(/(`+)[^`]*?\1/g, '') });
  });
  return out;
}

export interface InlineCode {
  n: number;    // 1-based line number
  code: string; // inner text of one inline code span (backtick delimiters stripped)
}

/**
 * Every inline code span (any backtick run) sitting OUTSIDE a fenced code block, one
 * entry per span, with its line number. This is the exact complement of the blanking
 * `visibleMarkdownLines` does: link analysis wants prose with code removed, drift
 * analysis wants the code spans themselves — a doc names repo paths inside backticks
 * (`` `.seed/checks/run-all.ts` ``), so that is where stale references hide. Fence
 * tracking is identical to `visibleMarkdownLines` so the two agree on what is code.
 */
export function inlineCodeSpans(repoRelPath: string, root: string = REPO_ROOT): InlineCode[] {
  const lines = readRepoFile(repoRelPath, root).split('\n');
  const out: InlineCode[] = [];
  let fence: { char: string; len: number } | null = null;
  lines.forEach((raw, i) => {
    const marker = raw.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      const char = marker[1][0];
      const len = marker[1].length;
      if (fence === null) fence = { char, len };
      else if (fence.char === char && len >= fence.len) fence = null;
      return;
    }
    if (fence !== null) return;
    for (const m of raw.matchAll(/(`+)([^`]*?)\1/g)) out.push({ n: i + 1, code: m[2] });
  });
  return out;
}

export interface MdLink {
  target: string; // repo-relative posix path of the link target (fragment stripped)
  line: number;   // 1-based line number in the source file
  raw: string;    // the target exactly as written
}

/**
 * Extract local inline-markdown link targets from a file, resolved repo-relative.
 * Skips external links (http/https/mailto) and pure fragments. Targets starting with
 * `/` resolve from the repo root. Reference-style and HTML links are deliberately not
 * parsed — validate-map forbids them so this parser stays the single source of truth.
 */
export function extractLocalLinks(repoRelPath: string, root: string = REPO_ROOT): MdLink[] {
  const links: MdLink[] = [];
  const linkRe = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  for (const { n, text } of visibleMarkdownLines(repoRelPath, root)) {
    for (const match of text.matchAll(linkRe)) {
      const raw = match[1];
      if (/^(https?:|mailto:)/.test(raw) || raw.startsWith('#')) continue;
      const noFragment = raw.split('#')[0];
      if (noFragment === '') continue;
      const target = noFragment.startsWith('/')
        ? posix.normalize(noFragment.slice(1))
        : posix.normalize(posix.join(toPosix(dirname(repoRelPath)), noFragment));
      links.push({ target, line: n, raw });
    }
  }
  return links;
}

/** The lines of a `## <Section>` block: from just after the heading to the next `## `
 *  heading (or EOF). Null when the section is absent. The single definition (LAW-3) shared by
 *  the section-structured validators (validate-architecture, validate-assessments). */
export function sectionBody(lines: string[], heading: string): string[] | null {
  const start = lines.findIndex((l) => l.trim() === heading);
  if (start === -1) return null;
  let end = start + 1;
  while (end < lines.length && !/^## /.test(lines[end])) end++;
  return lines.slice(start + 1, end);
}

/** Top-level `- ` bullets in a block, each spanning to the next top-level bullet (wrapped
 *  lines and sub-bullets folded in) — mirrors how validate-rings reads the Enforcement field.
 *  Shared by the bullet-structured validators (validate-architecture, validate-assessments). */
export function topLevelBullets(body: string[]): string[] {
  const bullets: string[] = [];
  let current: string[] | null = null;
  for (const line of body) {
    if (/^- \S/.test(line)) {
      if (current) bullets.push(current.join('\n'));
      current = [line];
    } else if (current && !/^## /.test(line)) {
      current.push(line);
    }
  }
  if (current) bullets.push(current.join('\n'));
  return bullets;
}

/** Four-digit numbers prefixing filenames directly inside `dir` (rings, plans/active, plans/completed).
 *  Returns [] when the directory does not exist under `root` — a foreign repo (repo-fitness) need
 *  not carry the seed's anatomy, so its absence is data, not an error. */
export function numberedFilenames(dir: string, root: string = REPO_ROOT): string[] {
  const abs = join(root, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .map((f) => f.match(/^(\d{4})-/)?.[1])
    .filter((n): n is string => n !== undefined);
}

export interface PlanRingRef {
  kind: 'plan' | 'ring';
  num: string;
}

/** Matches "plan 0002", "Ring 0010", "rings 0004-0007" (both endpoints count) in prose. */
export const PLAN_RING_REF_RE = /\b(plans?|rings?)\s+(\d{4})(?:\s*[-–]\s*(\d{4}))?/gi;

/** Every plan/ring reference named in free text — the single definition of what counts as
 * a traceable citation, shared by the plan-traceability gate and the fitness metric it
 * feeds, so the two cannot silently drift apart on what "traces" means. */
export function extractPlanRingRefs(text: string): PlanRingRef[] {
  const refs: PlanRingRef[] = [];
  for (const m of text.matchAll(PLAN_RING_REF_RE)) {
    const kind: 'plan' | 'ring' = m[1].toLowerCase().startsWith('plan') ? 'plan' : 'ring';
    refs.push({ kind, num: m[2] });
    if (m[3] !== undefined) refs.push({ kind, num: m[3] });
  }
  return refs;
}

export interface SequenceIssue {
  kind: 'duplicate' | 'gap';
  number: number;
  expected: number;
}

/** Numbers must be exactly 1..N — no gaps, no duplicates. Input may be unsorted. */
export function findSequenceIssues(numbers: number[]): SequenceIssue[] {
  const sorted = [...numbers].sort((a, b) => a - b);
  const issues: SequenceIssue[] = [];
  let expected = 1;
  sorted.forEach((n, i) => {
    if (i > 0 && n === sorted[i - 1]) {
      issues.push({ kind: 'duplicate', number: n, expected });
      return;
    }
    if (n !== expected) issues.push({ kind: 'gap', number: n, expected });
    expected = n + 1;
  });
  return issues;
}

export function formatViolation(v: Violation): string {
  return [
    `✗ [${v.check}] ${v.problem}`,
    `    law: ${v.law}`,
    `    fix: ${v.fix}`,
  ].join('\n');
}
