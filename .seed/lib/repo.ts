// Shared machinery helpers. Zero dependencies (ring 0002, LAW-7): the needed subset —
// walking the repo, extracting markdown links, formatting violations — is small enough
// to own outright.
import { readdirSync, readFileSync } from 'node:fs';
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

/** All repo files as sorted repo-relative posix paths, minus .git/node_modules/OS noise. */
export function listRepoFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRS.has(entry.name)) walk(abs);
      } else if (!EXCLUDED_FILES.has(entry.name)) {
        out.push(toPosix(relative(REPO_ROOT, abs)));
      }
    }
  };
  walk(REPO_ROOT);
  return out.sort();
}

export function readRepoFile(repoRelPath: string): string {
  return readFileSync(join(REPO_ROOT, repoRelPath), 'utf8');
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
export function visibleMarkdownLines(repoRelPath: string): MdLine[] {
  const lines = readRepoFile(repoRelPath).split('\n');
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
export function inlineCodeSpans(repoRelPath: string): InlineCode[] {
  const lines = readRepoFile(repoRelPath).split('\n');
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
export function extractLocalLinks(repoRelPath: string): MdLink[] {
  const links: MdLink[] = [];
  const linkRe = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  for (const { n, text } of visibleMarkdownLines(repoRelPath)) {
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
