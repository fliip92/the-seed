// Shared machinery helpers. Zero dependencies (ring 0002, LAW-7): the needed subset —
// walking the repo, extracting markdown links, formatting violations — is small enough
// to own outright.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { join, relative, resolve, dirname, posix } from 'node:path';

export const REPO_ROOT = resolve(import.meta.dirname, '..', '..');

// The on-disk walk's own skip list. With a git root, git's ignore rules are the authority
// (see listRepoFiles) and this set only spares the walk the cost of descending into
// node_modules; without one it is the whole exclusion policy — the honest fallback for a
// target that has not told us what it considers its own.
const EXCLUDED_DIRS = new Set(['.git', 'node_modules']);
const EXCLUDED_FILES = new Set(['.DS_Store']);

/** One read-only git invocation against `root`. Null when git fails for any reason (not a
 *  repository, unknown ref, git absent) — every caller treats null as "not computable here"
 *  rather than crashing, so a non-git target degrades cleanly. */
export function git(root: string, args: string[]): string | null {
  try {
    return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

export type GitRootStatus = { ok: true } | { ok: false; note: string };

/** Whether `root` IS a git repository's top level. A nested subdirectory answers git questions
 *  about the ENCLOSING repository — the wrong repository, and a plausible-but-wrong answer
 *  attributed to the target — so callers degrade rather than measure the wrong tree (ring 0016). */
export function gitRootStatus(root: string): GitRootStatus {
  const top = git(root, ['rev-parse', '--show-toplevel']);
  if (top === null) return { ok: false, note: 'not a git repository — no commit history' };
  let sameRoot: boolean;
  try {
    sameRoot = realpathSync(top) === realpathSync(root);
  } catch {
    sameRoot = top === root;
  }
  if (!sameRoot) {
    return {
      ok: false,
      note: `not the git repository root (its root is ${top}) — a nested subdirectory's history would measure the enclosing repo`,
    };
  }
  return { ok: true };
}

// The paths git does NOT ignore: tracked files plus untracked ones no ignore rule covers
// (`--cached --others --exclude-standard`). Null when `root` is not a git repository root, or
// git cannot answer — the caller then keeps its unfiltered walk.
//
// Deliberately NOT `git ls-files` alone. The metrics engine counts the COMMITTED repository
// (E-012), but the GATES must still judge work that is written and not yet committed — that is
// the whole point of running them before you commit. So the set is "the working tree, minus what
// git has been told to ignore": an uncommitted file is gated; an ignored one is not repo content
// at all. Ignore rules never apply to a tracked file, and `--cached` reflects that — a file that
// matches an ignore pattern but IS tracked stays in the set, exactly as git treats it.
//
// No unborn-HEAD guard (unlike the metrics engine's `trackedFiles`, which has nothing committed
// to match): ignore rules are fully meaningful in a freshly `git init`'d repository, and the
// recursive-upgrade proof grafts into exactly such a target.
function notIgnored(root: string): Set<string> | null {
  if (!gitRootStatus(root).ok) return null;
  const out = git(root, ['ls-files', '-z', '--cached', '--others', '--exclude-standard']);
  if (out === null) return null;
  return new Set(out.split('\0').filter((f) => f !== ''));
}

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

/**
 * The repository's own files under `root`, as sorted root-relative posix paths: the working tree
 * minus everything git ignores.
 *
 * "What is in this repository" has ONE definition, and it is git's (LAW-3). The walk finds the
 * files; `.gitignore` — repo, global (`core.excludesFile`), and `.git/info/exclude` alike —
 * decides which of them are the repository's. Before E-021 the walk answered on its own from a
 * hardcoded skip list, so any tool that wrote local state into the tree (an editor directory, an
 * agent's `.claude/settings.local.json`, a worktree snapshot) became a file every gate demanded be
 * mapped and classified: on a real machine `git status` read clean while `npm run check` failed
 * and 26 of 241 self-tests broke — and CI, which clones and therefore carries no ignored local
 * state, stayed green and never saw it.
 *
 * A target that is not a git repository root keeps the unfiltered walk (the EXCLUDED_* skip list
 * is then the whole policy) — it has no ignore rules to consult, so the walk is the only honest
 * listing there is.
 */
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
  const own = notIgnored(root);
  return (own === null ? out : out.filter((f) => own.has(f))).sort();
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

/**
 * GitHub's heading → anchor slug, for the common case (E-006). The input is a heading's
 * RAW markdown text; GitHub slugifies what it *renders*, so inline markup is unwrapped to
 * the text it displays (`` `code` `` → code, `[text](url)` → text, `**bold**` → bold)
 * before punctuation is dropped, letters are lowercased, and spaces become hyphens.
 * Letters/digits are matched by Unicode class, so a non-ASCII heading keeps its characters
 * the way GitHub does.
 *
 * Deliberately not a full CommonMark renderer: it covers the inline forms this repository's
 * headings actually use. A heading whose slug this computes differently from GitHub's fails
 * the anchor check with the target's real anchors listed in the message, so a mismatch is
 * self-correcting rather than silent (LAW-2).
 */
export function slugifyHeading(text: string): string {
  return text
    .replace(/`+([^`]*)`+/g, '$1')            // code spans render as their text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')     // images render as nothing
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')  // links render as their text
    .replace(/[*~]/g, '')                     // emphasis / strike markers
    // `_` is an emphasis marker only at a word boundary: CommonMark does not open emphasis
    // intraword, and GitHub keeps the underscore in the anchor — `plan_traceability` slugs
    // to `plan_traceability`, not `plantraceability`.
    .replace(/_+/g, (run, offset: number, whole: string) => {
      const isWordChar = (c: string | undefined): boolean => c !== undefined && /[\p{L}\p{N}]/u.test(c);
      return isWordChar(whole[offset - 1]) && isWordChar(whole[offset + run.length]) ? run : '';
    })
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N} _-]/gu, '')        // punctuation is dropped, not replaced
    .replace(/ /g, '-');
}

/**
 * The anchors a markdown file defines — one per ATX heading, slugified the GitHub way,
 * with GitHub's duplicate suffixing (a repeated slug becomes `slug-1`, `slug-2`, …).
 *
 * Fence tracking is delegated to `visibleMarkdownLines` so a `#` line inside a fenced code
 * block is not mistaken for a heading (one definition of what is code, LAW-3), but the slug
 * is computed from the RAW line: that function BLANKS inline code spans, and GitHub keeps
 * their rendered text in the anchor — `## The \`judge\` organ` is `#the-judge-organ`, not
 * `#the-organ`.
 */
export function headingAnchors(repoRelPath: string, root: string = REPO_ROOT): Set<string> {
  const raw = readRepoFile(repoRelPath, root).split('\n');
  const anchors = new Set<string>();
  const seen = new Map<string, number>();
  for (const { n } of visibleMarkdownLines(repoRelPath, root)) {
    const heading = raw[n - 1]?.match(/^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;
    const slug = slugifyHeading(heading[1]);
    if (slug === '') continue;
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    anchors.add(count === 0 ? slug : `${slug}-${count}`);
  }
  return anchors;
}

export interface MdLink {
  target: string; // repo-relative posix path of the link target (fragment stripped)
  line: number;   // 1-based line number in the source file
  raw: string;    // the target exactly as written
  fragment: string | null; // the `#anchor` part, decoded, without the `#`; null when absent
}

/**
 * Extract local inline-markdown link targets from a file, resolved repo-relative.
 * Skips external links (http/https/mailto). Targets starting with `/` resolve from the
 * repo root. Reference-style and HTML links are deliberately not parsed — validate-map
 * forbids them so this parser stays the single source of truth.
 *
 * A PURE fragment (`[x](#section)`) resolves to the containing file rather than being
 * skipped (E-006): it is a link like any other, and its anchor is checkable. It adds no
 * reachability — the target is the file already being walked — so this only widens what the
 * dead-link sweep sees, never what counts as reachable.
 */
export function extractLocalLinks(repoRelPath: string, root: string = REPO_ROOT): MdLink[] {
  const links: MdLink[] = [];
  const linkRe = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const self = toPosix(repoRelPath);
  for (const { n, text } of visibleMarkdownLines(repoRelPath, root)) {
    for (const match of text.matchAll(linkRe)) {
      const raw = match[1];
      if (/^(https?:|mailto:)/.test(raw)) continue;
      const hash = raw.indexOf('#');
      const noFragment = hash === -1 ? raw : raw.slice(0, hash);
      const fragment = hash === -1 ? null : decodeFragment(raw.slice(hash + 1));
      if (noFragment === '') {
        // Pure fragment: an anchor into this same file.
        if (fragment !== null && fragment !== '') links.push({ target: self, line: n, raw, fragment });
        continue;
      }
      const target = noFragment.startsWith('/')
        ? posix.normalize(noFragment.slice(1))
        : posix.normalize(posix.join(toPosix(dirname(repoRelPath)), noFragment));
      links.push({ target, line: n, raw, fragment: fragment === '' ? null : fragment });
    }
  }
  return links;
}

/** A fragment may be percent-encoded in a written link; compare against the decoded form.
 *  A malformed escape is left as written rather than throwing — the anchor check then
 *  reports it as missing, which is the honest reading of an unresolvable fragment. */
function decodeFragment(fragment: string): string {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment;
  }
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

// ---------------------------------------------------------------------------------------------
// Link resolution + index completeness for the numbered organs (rings, plans, postmortems,
// assessments, judgments).

// A plan is a stable artifact identified by its number; its filing location — active/ vs
// completed/ — is mutable state (a plan is `git mv`d to completed/ when it closes;
// docs/plans/README.md § Procedure). A link written to one path therefore stays valid when
// the plan moves to the other, so a plan link's existence is checked against the plan
// wherever it currently lives. This closes the one place literal-path resolution collided
// with append-only rings: ring 0009 links plan 0002 by its active/ path, and 0002 closes
// into completed/, which no ring may be edited to follow (ring 0013). Only the
// active/⇄completed/ segment flexes — the four-digit number and slug must still match
// exactly, so a genuine typo stays a dead link. Mirrors the traceability rule that a prose
// "plan NNNN" resolves against either directory (extractPlanRingRefs, plan-traceability.ts).
const PLAN_LINK_RE = /^docs\/plans\/(?:active|completed)\/(\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*\.md)$/;

/**
 * The existing repo file a link target resolves to — honoring the active/⇄completed/
 * relocation of plans — or null if nothing exists at either location. Non-plan targets
 * resolve iff they exist literally.
 *
 * Lives here rather than in validate-map because "does this link point at that file" now has
 * two askers: the map's reachability walk and the index-completeness clause below (LAW-3 —
 * one definition, so the two cannot disagree about whether a plan is linked).
 */
export function resolveLinkTarget(target: string, present: Set<string>): string | null {
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

/** The filename shape every numbered organ shares — the same NNNN-slug.md its own validator
 *  enforces. Matched against the basename, so a nested file never counts as an entry. */
const NUMBERED_ENTRY_RE = /^\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

const INDEX_LAW = 'LAW-4 — the map is the entry point';

/**
 * Every `NNNN-slug.md` under `dir` must be linked from that organ's `README.md` — the index the
 * map itself points at (AGENTS.md § Territory names one per organ).
 *
 * The hole this closes (E-024, ring 0053): an entry stays *reachable* through whatever plan or
 * ring happens to cite it, so validate-map reads 100% while the index is stale — three
 * consecutive rings (0049–0051) had never been added to docs/rings/README.md, and nothing failed.
 * Each miss is invisible and permanent unless someone notices, so the index degrades
 * monotonically — and it is the artifact an agent is told to read to take the next free number
 * and to see what has already been decided (LAW-10). It is the same invariant the seed grafted
 * into dither as `maps-are-complete` (ring 0046), turned on the mother's own organs.
 *
 * Silent when the organ has no README (a foreign repo need not carry the seed's anatomy) and
 * vacuous when it has no numbered entries yet.
 */
export function indexCompletenessViolations(
  files: string[],
  opts: { check: string; dir: string; entry: string },
  root: string = REPO_ROOT,
): Violation[] {
  const readme = `${opts.dir}/README.md`;
  const present = new Set(files);
  if (!present.has(readme)) return [];

  const linked = new Set<string>();
  for (const link of extractLocalLinks(readme, root)) {
    const resolved = resolveLinkTarget(link.target, present);
    if (resolved !== null) linked.add(resolved);
  }

  return files
    .filter((f) => {
      if (!f.startsWith(`${opts.dir}/`)) return false;
      return NUMBERED_ENTRY_RE.test(f.slice(opts.dir.length + 1)) && !linked.has(f);
    })
    .map((f) => ({
      check: opts.check,
      law: INDEX_LAW,
      problem: `${f} is not listed in ${readme} — the ${opts.entry} index is incomplete`,
      fix: `add a line to ${readme} linking ${f.slice(opts.dir.length + 1)}. An index that silently omits an entry sends the reader who needs it to the wrong answer — and the omission is permanent, because nothing else looks.`,
    }));
}

export interface LedgerCounts {
  open: number;
  paid: number;
}

/**
 * `## E-NNN` entries under `## Open` vs `## Paid` in entropy-ledger content (mirrors the
 * heading-block parsing validate-plans.ts does for format validation).
 *
 * Lives here because two organs now ask: `ledger_trend` (fitness-metrics.ts) diffs the open count
 * against history, and the generated state block (generated.ts) states it to the front door. One
 * definition of what an open entry IS, so the metric and the public number cannot disagree (LAW-3).
 */
export function ledgerCounts(content: string): LedgerCounts {
  const blocks = content.split(/^## /m).slice(1);
  let section: 'open' | 'paid' | null = null;
  const counts: LedgerCounts = { open: 0, paid: 0 };
  for (const block of blocks) {
    const heading = block.split('\n')[0].trim();
    if (heading === 'Open') {
      section = 'open';
      continue;
    }
    if (heading === 'Paid') {
      section = 'paid';
      continue;
    }
    if (section !== null && /^E-\d{3} — /.test(heading)) counts[section]++;
  }
  return counts;
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

// ---------------------------------------------------------------------------------------------
// The decision log a commit can trace to (E-020, ring 0051). The seed records decisions as
// numbered plans and rings; a foreign host commonly records them as numbered ADRs. Both are
// decision logs, so `plan_traceability` RESOLVES the target's shape instead of assuming the
// seed's — the E-016 `resolveMapFilename` move one level up: from "which file is the map" to
// "which artifacts are the decision record".
//
// This lives here, not beside the plan-traceability GATE, because that gate is an executable
// script (top-level side effects — importing it would run it), unlike validate-map.ts which
// exports its resolver. repo.ts already owns extractPlanRingRefs for exactly this reason: one
// definition of what "traces" means, shared by every organ that asks (LAW-3).
//
// The seed's own gate stays plan/ring-strict and is untouched: it enforces the seed's law
// (LAW-5), not a host convention — the same split E-016 drew between the metric's name set and
// the AGENTS.md-strict validate-map gate.

/** Where a repository keeps numbered decision records, in resolution order. `plan`/`ring` is the
 *  seed's own shape and wins when both are present; `adr` is the common convention among repos
 *  that record decisions at all (dither's, ring 0038). Kept painfully short and evidence-driven:
 *  a shape enters this list when a real host is found keeping decisions that way, never
 *  speculatively (LAW-7). */
export const DECISION_LOG_SHAPES: ReadonlyArray<{ kind: DecisionKind; dirs: string[]; label: string }> = [
  { kind: 'plan', dirs: ['docs/plans/active', 'docs/plans/completed'], label: 'plans' },
  { kind: 'ring', dirs: ['docs/rings'], label: 'rings' },
  { kind: 'adr', dirs: ['docs/adr'], label: 'ADRs (docs/adr/)' },
];

export type DecisionKind = 'plan' | 'ring' | 'adr';

export interface DecisionRef {
  kind: DecisionKind;
  num: string;
}

/** Matches "ADR-0009", "ADR 0009", a slash-list "ADR-0003/0007", or a `docs/adr/0009-` path
 *  mention. Deliberately a SUPERSET of the citation forms dither's grafted commit→ADR gate
 *  recognizes (`ADR-NNNN`, slash lists, `docs/adr/NNNN-` paths — ring 0038): a metric stricter
 *  than the gate enforcing the same norm would under-read the host it is measuring, which is the
 *  E-020 defect itself. `#47`-style issue refs never match — they are prose, not citations. */
export const ADR_REF_RE = /\bADRs?[-\s]?(\d{4}(?:\s*\/\s*\d{4})*)|\bdocs\/adr\/(\d{4})-/gi;

/** Every decision-record reference named in free text, across all shapes. */
export function extractDecisionRefs(text: string): DecisionRef[] {
  const refs: DecisionRef[] = extractPlanRingRefs(text);
  for (const m of text.matchAll(ADR_REF_RE)) {
    if (m[2] !== undefined) {
      refs.push({ kind: 'adr', num: m[2] });
      continue;
    }
    for (const num of m[1].split('/')) refs.push({ kind: 'adr', num: num.trim() });
  }
  return refs;
}

export interface DecisionLog {
  /** The numbers the target actually carries, per shape — a citation resolves against these. */
  nums: Map<DecisionKind, Set<string>>;
  /** The resolved shape, named for the metric note so the reading stays legible (LAW-2). */
  label: string;
}

/** The target's decision log, or null when it keeps none — the honest "no decision record to
 *  trace commits to" finding. Every shape present is resolved (a repo may keep both, and a
 *  citation of either traces); the label names them in resolution order. */
export function resolveDecisionLog(root: string): DecisionLog | null {
  const nums = new Map<DecisionKind, Set<string>>();
  const present: string[] = [];
  for (const shape of DECISION_LOG_SHAPES) {
    const found = new Set(shape.dirs.flatMap((dir) => numberedFilenames(dir, root)));
    if (found.size === 0) continue;
    nums.set(shape.kind, new Set([...(nums.get(shape.kind) ?? []), ...found]));
    present.push(`${found.size} ${shape.label}`);
  }
  if (nums.size === 0) return null;
  return { nums, label: present.join(' + ') };
}

/** Whether a commit message cites a decision record that EXISTS in `log`. A reference that
 *  resolves to nothing traces to nothing — the same clause the plan-traceability gate applies. */
export function tracesToDecisionLog(message: string, log: DecisionLog): boolean {
  return extractDecisionRefs(message).some((r) => log.nums.get(r.kind)?.has(r.num) === true);
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
