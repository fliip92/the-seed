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

export interface MdLink {
  target: string;      // repo-relative posix path of the link target (fragment stripped)
  line: number;        // 1-based line number in the source file
  raw: string;         // the target exactly as written
}

/**
 * Extract local markdown link targets from a file, resolved repo-relative.
 * Skips external links (http/https/mailto), pure fragments, fenced code blocks,
 * and inline code spans.
 */
export function extractLocalLinks(repoRelPath: string): MdLink[] {
  const lines = readRepoFile(repoRelPath).split('\n');
  const links: MdLink[] = [];
  const linkRe = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let inFence = false;

  lines.forEach((rawLine, i) => {
    if (/^\s*(```|~~~)/.test(rawLine)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    const line = rawLine.replace(/`[^`]*`/g, ''); // drop inline code spans
    for (const match of line.matchAll(linkRe)) {
      const raw = match[1];
      if (/^(https?:|mailto:)/.test(raw) || raw.startsWith('#')) continue;
      const noFragment = raw.split('#')[0];
      if (noFragment === '') continue;
      const abs = posix.normalize(posix.join(toPosix(dirname(repoRelPath)), noFragment));
      links.push({ target: abs, line: i + 1, raw });
    }
  });
  return links;
}

export function formatViolation(v: Violation): string {
  return [
    `✗ [${v.check}] ${v.problem}`,
    `    law: ${v.law}`,
    `    fix: ${v.fix}`,
  ].join('\n');
}
