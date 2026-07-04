// Enforces LAW-4: AGENTS.md is the entry point; every meaningful artifact is reachable
// from it in three hops or fewer, and no markdown link is dead. Also reports the
// map_reachability metric (SEED.md §6).
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, extractLocalLinks, visibleMarkdownLines } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const LAW = 'LAW-4 — the map is the entry point';
const ID = 'seed/validate-map';
const MAP = 'AGENTS.md';
const MAX_HOPS = 3;

// Append-only data directories: files matching the pattern are covered by the
// directory's README for reachability, and excluded from the map_reachability
// denominator (they are data, not knowledge artifacts). Anything else in these
// directories must be linked like any other file. Keep this list painfully short.
const DATA_DIRS: Array<{ dir: string; pattern: RegExp; readme: string }> = [
  { dir: 'docs/fitness/history', pattern: /^\d{4}-\d{2}-\d{2}\.json$/, readme: 'docs/fitness/history/README.md' },
];

// The link parser (lib/repo.ts) follows inline [text](target) links only. Link forms it
// cannot see would silently escape both dead-link and reachability analysis, so they are
// forbidden outright.
const FORBIDDEN_LINK_FORMS: Array<{ re: RegExp; name: string }> = [
  { re: /^ {0,3}\[[^\]]+\]:\s+\S+/, name: 'reference-style link definition' },
  { re: /<(?:a|img)\s[^>]*(?:href|src)\s*=/i, name: 'HTML link' },
];

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const present = new Set(files);
    const violations: Violation[] = [];

    // Hop 0 is the map itself; a link found in a file at hop d lands its target at d+1.
    const hop = new Map<string, number>([[MAP, 0]]);
    const queue: string[] = [MAP];
    const linksExtracted = new Set<string>();

    const checkLinksOf = (file: string): ReturnType<typeof extractLocalLinks> => {
      linksExtracted.add(file);
      const links = extractLocalLinks(file);
      for (const link of links) {
        if (present.has(link.target)) continue;
        const abs = join(REPO_ROOT, link.target);
        const isDir = existsSync(abs) && statSync(abs).isDirectory();
        violations.push({
          check: ID,
          law: LAW,
          problem: isDir
            ? `${file}:${link.line} links to a directory: ${link.raw}`
            : `${file}:${link.line} dead link: ${link.raw} (resolves to ${link.target}, which does not exist)`,
          fix: isDir
            ? `link to the directory's README.md instead (e.g. ${link.target}/README.md) so reachability stays well-defined.`
            : `point the link at an existing file, or create ${link.target}. Knowledge that cannot be reached from the map is entropy (SEED.md §0).`,
        });
      }
      return links;
    };

    while (queue.length > 0) {
      const file = queue.shift() as string;
      const depth = hop.get(file) as number;
      if (!file.endsWith('.md') || depth >= MAX_HOPS) continue;
      for (const link of checkLinksOf(file)) {
        if (present.has(link.target) && !hop.has(link.target)) {
          hop.set(link.target, depth + 1);
          queue.push(link.target);
        }
      }
    }

    // A dead link is a lie wherever it lives: sweep every md file whose links the BFS
    // did not extract — unreachable files AND files sitting at exactly MAX_HOPS.
    for (const file of files) {
      if (file.endsWith('.md') && !linksExtracted.has(file)) checkLinksOf(file);
    }

    // Link forms the parser cannot follow are forbidden everywhere.
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      for (const { n, text } of visibleMarkdownLines(file)) {
        for (const form of FORBIDDEN_LINK_FORMS) {
          if (form.re.test(text)) {
            violations.push({
              check: ID,
              law: LAW,
              problem: `${file}:${n} uses a ${form.name}, which the map parser cannot follow`,
              fix: 'use an inline markdown link — [text](relative/path.md) — so dead-link and reachability analysis see it.',
            });
          }
        }
      }
    }

    const isCoveredData = (file: string): boolean =>
      DATA_DIRS.some(
        (d) =>
          file.startsWith(d.dir + '/') &&
          d.pattern.test(file.slice(d.dir.length + 1)) &&
          hop.has(d.readme),
      );

    const covered = files.filter((f) => !hop.has(f) && isCoveredData(f));
    const unreachable = files.filter((f) => !hop.has(f) && !isCoveredData(f));
    for (const file of unreachable) {
      violations.push({
        check: ID,
        law: LAW,
        problem: `${file} is not reachable within ${MAX_HOPS} hops of ${MAP}`,
        fix: `link it from ${MAP} or from an index README already on the map (e.g. the README of its directory). If it should not exist, delete it — digest or delete (SEED.md §0).`,
      });
    }

    const knowledgeTotal = files.length - covered.length;
    const reachableCount = knowledgeTotal - unreachable.length;
    const pct = knowledgeTotal === 0 ? 100 : (reachableCount / knowledgeTotal) * 100;
    const deadLinks = violations.filter((v) => v.problem.includes('dead link')).length;
    const coveredNote = covered.length > 0 ? `, ${covered.length} data file(s) covered by README` : '';
    return {
      summary: `map_reachability ${pct.toFixed(1)}% (${reachableCount}/${knowledgeTotal} files ≤${MAX_HOPS} hops${coveredNote}), dead links: ${deadLinks}`,
      violations,
    };
  },
};
