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

// The agent-entry-map filenames the `map_reachability` METRIC resolves a target's map to, in
// priority order (E-016). AGENTS.md is the seed's own canonical and wins for the seed; CLAUDE.md
// is the conventional agent entry a well-tended but un-grafted host uses (dither's, ring 0033).
// README.md is deliberately absent — it is a human front door, not an agent map (ring 0033
// rejected it for dither) — so a repo carrying only a README reads a null map_reachability, the
// honest "no agent entry point" finding. The seed's own validate-map GATE below stays
// AGENTS.md-strict (it enforces the seed's law); this set is only the metric's resolver for
// foreign targets (.seed/lib/fitness-metrics.ts).
export const MAP_FILENAMES = ['AGENTS.md', 'CLAUDE.md'] as const;

/** The target's canonical agent map: the first MAP_FILENAMES entry it carries at its root, or
 *  null when it carries none — the "no legible entry point" finding (E-016). */
export function resolveMapFilename(files: string[]): string | null {
  return MAP_FILENAMES.find((name) => files.includes(name)) ?? null;
}

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

// A plan is a stable artifact identified by its number; its filing location — active/ vs
// completed/ — is mutable state (a plan is `git mv`d to completed/ when it closes;
// docs/plans/README.md § Procedure). A link written to one path therefore stays valid when
// the plan moves to the other, so a plan link's existence is checked against the plan
// wherever it currently lives. This closes the one place literal-path resolution collided
// with append-only rings: ring 0009 links plan 0002 by its active/ path, and 0002 closes
// into completed/, which no ring may be edited to follow (ring 0013). Only the
// active/⇄completed/ segment flexes — the four-digit number and slug must still match
// exactly, so a genuine typo stays a dead link. Mirrors the traceability rule that a prose
// "plan NNNN" resolves against either directory (lib/repo.ts, plan-traceability.ts).
const PLAN_LINK_RE = /^docs\/plans\/(?:active|completed)\/(\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*\.md)$/;

/**
 * The existing repo file a link target resolves to — honoring the active/⇄completed/
 * relocation of plans — or null if nothing exists at either location. Non-plan targets
 * resolve iff they exist literally.
 */
function resolveLinkTarget(target: string, present: Set<string>): string | null {
  if (present.has(target)) return target;
  const plan = target.match(PLAN_LINK_RE);
  if (plan) {
    for (const dir of ['active', 'completed'] as const) {
      const alt = `docs/plans/${dir}/${plan[1]}`;
      if (present.has(alt)) return alt;
    }
  }
  return null;
}

export interface ReachabilityResult {
  violations: Violation[];
  reachableCount: number;
  knowledgeTotal: number;
  deadLinks: number;
  coveredCount: number;
  /** reachableCount / knowledgeTotal; 1 (vacuously fully reachable) when knowledgeTotal is 0. */
  fraction: number;
}

/**
 * The map_reachability computation (SEED.md §6): shared by this check's CI-facing
 * summary and by the fitness engine (.seed/lib/fitness-metrics.ts), which needs the raw
 * fraction, not a parsed summary string. `root` defaults to REPO_ROOT (this check's use);
 * repo-fitness passes a foreign repo's root to run the identical analysis there (ring 0016).
 */
export function analyzeReachability(files: string[], root: string = REPO_ROOT, mapFilename: string = MAP): ReachabilityResult {
  const present = new Set(files);
  const violations: Violation[] = [];

  // Hop 0 is the map itself; a link found in a file at hop d lands its target at d+1.
  const hop = new Map<string, number>([[mapFilename, 0]]);
  const queue: string[] = [mapFilename];
  const linksExtracted = new Set<string>();

  const checkLinksOf = (file: string): ReturnType<typeof extractLocalLinks> => {
    linksExtracted.add(file);
    const links = extractLocalLinks(file, root);
    for (const link of links) {
      if (resolveLinkTarget(link.target, present)) continue;
      const abs = join(root, link.target);
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
      const resolved = resolveLinkTarget(link.target, present);
      if (resolved && !hop.has(resolved)) {
        hop.set(resolved, depth + 1);
        queue.push(resolved);
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
    for (const { n, text } of visibleMarkdownLines(file, root)) {
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
      problem: `${file} is not reachable within ${MAX_HOPS} hops of ${mapFilename}`,
      fix: `link it from ${mapFilename} or from an index README already on the map (e.g. the README of its directory). If it should not exist, delete it — digest or delete (SEED.md §0).`,
    });
  }

  const knowledgeTotal = files.length - covered.length;
  const reachableCount = knowledgeTotal - unreachable.length;
  const fraction = knowledgeTotal === 0 ? 1 : reachableCount / knowledgeTotal;
  const deadLinks = violations.filter((v) => v.problem.includes('dead link')).length;

  return { violations, reachableCount, knowledgeTotal, deadLinks, coveredCount: covered.length, fraction };
}

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const { violations, reachableCount, knowledgeTotal, deadLinks, coveredCount, fraction } =
      analyzeReachability(files);
    const pct = fraction * 100;
    const coveredNote = coveredCount > 0 ? `, ${coveredCount} data file(s) covered by README` : '';
    return {
      summary: `map_reachability ${pct.toFixed(1)}% (${reachableCount}/${knowledgeTotal} files ≤${MAX_HOPS} hops${coveredNote}), dead links: ${deadLinks}`,
      violations,
    };
  },
};
