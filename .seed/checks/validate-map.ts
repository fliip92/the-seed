// Enforces LAW-4: AGENTS.md is the entry point; every meaningful artifact is reachable
// from it in three hops or fewer, and no markdown link is dead. Also reports the
// map_reachability metric (SEED.md §6).
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, extractLocalLinks } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const LAW = 'LAW-4 — the map is the entry point';
const ID = 'seed/validate-map';
const MAP = 'AGENTS.md';
const MAX_HOPS = 3;

// Directories whose non-README files are append-only data, covered by their README for
// reachability (see plan 0001 decision log). Keep this list painfully short.
const DIR_COVERED_BY_README = ['docs/fitness/history'];

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const present = new Set(files);
    const violations: Violation[] = [];

    // Hop 0 is the map itself; a link found in a file at hop d lands its target at d+1.
    const hop = new Map<string, number>([[MAP, 0]]);
    const queue: string[] = [MAP];

    while (queue.length > 0) {
      const file = queue.shift() as string;
      const depth = hop.get(file) as number;
      if (!file.endsWith('.md') || depth >= MAX_HOPS) continue;

      for (const link of extractLocalLinks(file)) {
        if (!present.has(link.target)) {
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
          continue;
        }
        if (!hop.has(link.target)) {
          hop.set(link.target, depth + 1);
          queue.push(link.target);
        }
      }
    }

    // Every md file's links are worth checking for deadness even if the file itself is
    // deeper than the map allows — a dead link is a lie wherever it lives.
    for (const file of files) {
      if (!file.endsWith('.md') || hop.has(file)) continue;
      for (const link of extractLocalLinks(file)) {
        if (!present.has(link.target)) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file}:${link.line} dead link: ${link.raw} (resolves to ${link.target}, which does not exist)`,
            fix: `point the link at an existing file, or create ${link.target}.`,
          });
        }
      }
    }

    const isCovered = (file: string): boolean =>
      DIR_COVERED_BY_README.some(
        (dir) => file.startsWith(dir + '/') && hop.has(dir + '/README.md'),
      );

    const unreachable = files.filter((f) => !hop.has(f) && !isCovered(f));
    for (const file of unreachable) {
      violations.push({
        check: ID,
        law: LAW,
        problem: `${file} is not reachable within ${MAX_HOPS} hops of ${MAP}`,
        fix: `link it from ${MAP} or from an index README already on the map (e.g. the README of its directory). If it should not exist, delete it — digest or delete (SEED.md §0).`,
      });
    }

    const reachableCount = files.length - unreachable.length;
    const pct = files.length === 0 ? 100 : (reachableCount / files.length) * 100;
    return {
      summary: `map_reachability ${pct.toFixed(1)}% (${reachableCount}/${files.length} files ≤${MAX_HOPS} hops), dead links: ${violations.filter((v) => v.problem.includes('dead link')).length}`,
      violations,
    };
  },
};
