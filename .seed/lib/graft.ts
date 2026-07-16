// The graft model — the SINGLE source of truth (LAW-3) for what the installer LAYS DOWN and what the
// uninstaller TAKES BACK, so the two can never disagree on the graft set. That agreement is the whole
// trick: because uninstall removes exactly what graft created, the round-trip is byte-identical (plan
// 0005 scope item 3, ring 0028).
//
// A graft is the SEED.md §4 Stage-4 step-4 BEACHHEAD: "the map, the plan structure, and the first
// lints. No behavior changes yet." The running seed installs its OWN portable subset into a target,
// mapping ring 0026's three ownership tiers onto two mechanisms:
//   - COPIED verbatim — the PORTABLE method (.seed/, skills/) and the SOVEREIGN genome (SEED.md). The
//     descendant carries the method AND the machinery that grafts the next seed — self-carrying (E-015).
//   - EMITTED as parameterized templates — the LOCAL scaffold each seed grows itself (ring 0026's local
//     tier): the map (AGENTS.md), the plan structure (docs/plans/ + the ledger), the decision log
//     (docs/rings/README.md), the release data (pollen/pending.md, pollen/releases/README.md), the
//     lineage (pollen/lineage.json — SEED.md §7), and the minimal plumbing (package.json, .gitignore)
//     that lets the lints run. The other organs (principles, architecture, fitness, …) are NOT grafted;
//     they grow through metabolization (Stage 4 step 5) — that is what "no behavior changes yet" means.
//
// Templates live HERE, as strings — not as .md files in the tree. A .md template carrying
// {{placeholders}} would be scanned by the mother's own validate-map / doc-drift as if it were a live
// doc (placeholder links → dead links, path strings → stale references). A .ts data module is invisible
// to those .md-only scanners and parameterizes cleanly; being in portable .seed/, it is carried onward.
//
// PURELY ADDITIVE: graft refuses to overwrite any existing path (a host's own files are never
// clobbered — LAW-2). That refusal is the invariant that makes uninstall a clean inverse: a SUCCESSFUL
// graft created every path in its set, so uninstall removes exactly that set and prunes the directories
// it emptied, restoring the target byte-identical. No install receipt is persisted — the graft plan IS
// the receipt (LAW-3, one source). Post-graft local work the host does is preserved, never destroyed (a
// non-empty directory is not pruned).
import { cpSync, existsSync, mkdirSync, readdirSync, rmdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { GENOME_VERSION, POLLEN_VERSION } from './pollen.ts';
import { renderEmptyPending } from './release.ts';

/** What a graft parameterizes into the local scaffold. `planted` is a recorded fact, never a
 *  wall-clock read (ring 0020), so a given graft reproduces byte-identically. */
export interface GraftVars {
  parent: string | null; // the mother's "owner/repo", or null at the root of a lineage
  planted: string; // date planted, YYYY-MM-DD (a recorded value)
  version: string; // the POLLEN version grafted (SEED.md §7 "seed version")
  genomeVersion: string; // the GENOME version grafted (the second, distinct line)
  repo: string | null; // the target seed's own "owner/repo", if known
}

/** The vars a graft from THIS running seed carries by default: it plants its own pollen + genome
 *  version. The CLI overrides parent / planted / repo from flags. */
export function defaultVars(planted: string, parent: string | null = null, repo: string | null = null): GraftVars {
  return { parent, planted, version: POLLEN_VERSION, genomeVersion: GENOME_VERSION, repo };
}

// The portable + sovereign roots copied verbatim from the source into the target. Whole subtrees /
// files: a descendant carries the method and the installer intact.
export const COPY_ROOTS = ['.seed', 'skills', 'SEED.md'] as const;

interface Template {
  path: string; // target-relative path the template is written to
  render(v: GraftVars): string;
}

const parentPhrase = (v: GraftVars): string => (v.parent ? `\`${v.parent}\`` : 'no parent (a lineage root)');

// --- the local scaffold: the map, the plan structure, the decision log, the release data, the
// --- lineage, and the minimal plumbing. Each is a coherent minimal instance; the copied portable
// --- subtrees provide the rest of the method.
export const TEMPLATES: Template[] = [
  {
    path: 'AGENTS.md',
    render: (v) =>
      [
        '# AGENTS.md — the map',
        '',
        `You are an agent working in a seed grafted from ${parentPhrase(v)} (pollen v${v.version},`,
        `planted ${v.planted}). This file is your entry point every session (LAW-4: everything`,
        'meaningful is reachable from here in three hops or fewer).',
        '',
        '## Start here',
        '',
        '1. **New here?** Read [SEED.md](SEED.md) — the genome — completely, once. It is the constitution.',
        '2. **Returning?** Open the active plan(s) in [docs/plans/active/](docs/plans/active/README.md)',
        '   and continue from the latest `Next actions` section.',
        '3. **Nothing active?** Run the metabolism (SEED.md §3): sense for entropy and price it into the',
        '   [entropy ledger](docs/plans/entropy-ledger.md), then convert the highest-interest entry.',
        '',
        '## Current state',
        '',
        `- **Freshly grafted beachhead.** The map, the plan structure, and the first lints were installed`,
        `  from ${parentPhrase(v)} at pollen v${v.version} on ${v.planted} (no behavior changes yet).`,
        '  This seed\'s lineage is recorded in [pollen/lineage.json](pollen/lineage.json). Grow from here:',
        '  open your first plan ([docs/plans/README.md](docs/plans/README.md)) and metabolize the method',
        '  into your own rings, plans, and fitness.',
        '',
        '## Territory',
        '',
        '| Path | What it is |',
        '|---|---|',
        '| [SEED.md](SEED.md) | The genome: laws, anatomy, stages, metabolism |',
        '| [docs/rings/](docs/rings/README.md) | Decision log, append-only, numbered |',
        '| [docs/plans/](docs/plans/README.md) | Execution plans + the entropy ledger |',
        '| [skills/](skills/README.md) | The skill garden (portable method) |',
        '| [pollen/](pollen/README.md) | Portable distribution + this seed\'s lineage |',
        '| [.seed/](.seed/README.md) | Machinery: checks, CI definitions, fitness scripts |',
        '',
        '## Protocols',
        '',
        '- **Verify everything:** run `npm run check` before claiming any change is done.',
        '- **Committing:** every commit names the plan or ring governing it (traceability).',
        '- **Make a decision durable:** cut a ring — format in [docs/rings/README.md](docs/rings/README.md).',
        '- **Start non-trivial work:** open a plan — format in [docs/plans/README.md](docs/plans/README.md).',
        '- **Feedback flows upstream** (LAW-11): a learning worth sending to your mother is composed with',
        '  `node .seed/checks/release.ts feedback` against your recorded parent, never forced.',
        '',
        '## Laws (summary — full text in SEED.md §1)',
        '',
        'LAW-1 seed writes itself · LAW-2 legible + enforceable or it doesn\'t exist · LAW-3 invariants',
        'over implementations · LAW-4 the map is the entry point · LAW-5 plans are first-class · LAW-6',
        'every capability ships verification · LAW-7 boring compounds · LAW-8 entropy is paid continuously',
        '· LAW-9 measure to judge · LAW-10 escalate scarce judgment, never ask twice · LAW-11 feedback',
        'flows upstream',
      ].join('\n') + '\n',
  },
  {
    path: 'docs/rings/README.md',
    render: () =>
      [
        '# docs/rings/ — the decision log',
        '',
        'Append-only, numbered record of every decision that retired a question (LAW-10: never ask',
        'twice; SEED.md §2 defines the format). Before asking anything, search this directory — if a',
        'ring answers it, asking again is drift.',
        '',
        '## Rings',
        '',
        '_No ring cut yet — cut the first decision this seed makes as `0001-slug.md`._',
        '',
        '## Format (enforced by `.seed/checks/validate-rings.ts`)',
        '',
        '- Filename: `NNNN-slug.md` — four digits, sequential, no gaps, lowercase-kebab slug.',
        '- Title line: `# Ring NNNN — <title>` (number must match the filename).',
        '- Required bullets: `- Date:` (YYYY-MM-DD), `- Stage:`, `- Raised-by:`, `- Question:`,',
        '  `- Decision:`, `- Alternatives considered:`, `- Enforcement:` (name a mechanism: lint |',
        '  structural test | CI gate | doc-only with justification), `- Revisit-when:`.',
        '',
        '## Procedure',
        '',
        '1. Take the next free number (check the list above — and add your ring to it).',
        '2. Write the ring using the format; state the enforcement mechanically wherever possible.',
        '3. Run `npm run check` — the ring validator must pass.',
        '4. Rings are append-only: never edit a ring\'s Decision after merge — supersede it with a new ring.',
      ].join('\n') + '\n',
  },
  {
    path: 'docs/plans/README.md',
    render: () =>
      [
        '# docs/plans/ — execution plans + the entropy ledger',
        '',
        'Plans are first-class artifacts (LAW-5): a plan is the hand-off to the next agent, who may be',
        'you with no memory. Live plans sit in [active/](active/README.md); finished ones move to',
        '[completed/](completed/README.md). Priced debt lives in the [entropy ledger](entropy-ledger.md)',
        '(LAW-8).',
        '',
        '## Plan format (enforced by `.seed/checks/validate-plans.ts`)',
        '',
        '- Filename: `NNNN-slug.md`, four digits sequential across active/ + completed/ combined.',
        '- Title line: `# Plan NNNN — <title>`; a `- Status:` line (`active` | `blocked: …` |',
        '  `completed YYYY-MM-DD`).',
        '- Required sections: `## Goal`, `## Progress log` (dated entries, newest last), `## Decision',
        '  log`, `## Next actions`.',
        '',
        '## Ledger format',
        '',
        'Headings are exactly `## Open`, `## Paid`, and `## E-NNN — <short description>`; each entry',
        'carries `- First observed:`, `- Where:`, `- Interest rate:` (high | medium | low), `- Price:`,',
        'and `- Conversion path:`. Unpriced debt is not a ledger entry — it is just entropy with a name.',
        '',
        '## Procedure',
        '',
        '1. Open a plan in active/ for any non-trivial work; log progress as you go.',
        '2. Close it by setting `- Status: completed YYYY-MM-DD` and `git mv`-ing it to completed/.',
      ].join('\n') + '\n',
  },
  {
    path: 'docs/plans/active/README.md',
    render: () =>
      [
        '# docs/plans/active/ — plans in flight',
        '',
        'Live plans. Open the one you are continuing and read its `Next actions`.',
        '',
        '_No plan active yet — open the first with `NNNN-slug.md` per [../README.md](../README.md)._',
      ].join('\n') + '\n',
  },
  {
    path: 'docs/plans/completed/README.md',
    render: () =>
      [
        '# docs/plans/completed/ — finished plans',
        '',
        'Closed plans, kept forever as record. A plan lands here (by `git mv`) when its status is',
        '`completed YYYY-MM-DD`.',
        '',
        '_None yet._',
      ].join('\n') + '\n',
  },
  {
    path: 'docs/plans/entropy-ledger.md',
    render: () =>
      [
        '# Entropy ledger',
        '',
        'Priced debt (LAW-8: entropy is paid continuously). Nothing ambiguous survives contact —',
        'invariant, ring, priced entry, or deletion (SEED.md §0). Each entry names where the entropy',
        'lives, how fast it compounds, its price, and its conversion path.',
        '',
        '## Open',
        '',
        '_No open debt yet._',
        '',
        '## Paid',
        '',
        '_Nothing digested yet._',
      ].join('\n') + '\n',
  },
  {
    path: 'pollen/README.md',
    render: (v) =>
      [
        '# pollen/ — the portable distribution',
        '',
        `This seed carries pollen v${v.version} (genome v${v.genomeVersion}), grafted from`,
        `${parentPhrase(v)}. Pollen is the versioned, installable subset of the method — the skills and`,
        'the machinery (`.seed/`) — plus the installer that grafts the next seed. The boundary, the two',
        'version lines, and the semver/migration model are defined by the [pollen manifest](../.seed/lib/pollen.ts).',
        '',
        '- **[lineage.json](lineage.json)** — this seed\'s lineage (SEED.md §7: seed version, parent,',
        '  date planted). Feedback flows upstream to the parent recorded here (LAW-11).',
        '- **[pending.md](pending.md)** — the committed intents awaiting this seed\'s next pollen release.',
        '- **[releases/](releases/README.md)** — the append-only, dated release history (once you cut one).',
        '',
        'Sense a target\'s pollen with `node .seed/checks/release.ts sense`; cut your own release with',
        '`cut-release`; graft onward with `graft` (self-carrying).',
      ].join('\n') + '\n',
  },
  {
    path: 'pollen/pending.md',
    render: () => renderEmptyPending(),
  },
  {
    path: 'pollen/releases/README.md',
    render: () =>
      [
        '# pollen/releases/ — the release history',
        '',
        'The append-only, dated record of every cut pollen release. Each release is one file `vX.Y.Z.md`,',
        'recording its impact class, its date (a recorded-once fact), the rings it composed (the decision',
        'log is the changelog), and its migration (for a major). Once cut, a release is never edited or',
        'deleted — [release-append-only.ts](../../.seed/checks/release-append-only.ts) enforces it (this',
        'index README excepted, which gains a line per release).',
        '',
        '## Releases',
        '',
        '_No release cut yet — the pollen line rests. Cut the first with',
        '`node .seed/checks/release.ts cut-release --date YYYY-MM-DD` once you declare an intent in',
        '[../pending.md](../pending.md)._',
      ].join('\n') + '\n',
  },
  {
    path: 'pollen/lineage.json',
    render: (v) =>
      JSON.stringify(
        {
          ...(v.repo ? { repo: v.repo } : {}),
          parent: v.parent, // null at a lineage root — readLineage reads a null parent as "no parent"
          seedVersion: v.version,
          genomeVersion: v.genomeVersion,
          planted: v.planted,
        },
        null,
        2,
      ) + '\n',
  },
  {
    path: 'package.json',
    render: (v) =>
      JSON.stringify(
        {
          name: v.repo ? v.repo.split('/').pop() : 'grafted-seed',
          private: true,
          version: '0.0.0',
          description: 'A seed grafted from the method. Entry point: AGENTS.md; constitution: SEED.md.',
          type: 'module',
          engines: { node: '>=22.18' },
          scripts: {
            check: 'node .seed/checks/run-all.ts',
            test: 'node .seed/tests/self-test.ts',
            garden: 'node .seed/checks/doc-drift.ts',
            fitness: 'node .seed/checks/fitness.ts',
            'repo-fitness': 'node .seed/checks/repo-fitness.ts',
            worktrees: 'node .seed/checks/worktrees.ts',
            generate: 'node .seed/checks/generate.ts',
            feedback: 'node .seed/checks/feedback.ts',
            release: 'node .seed/checks/release.ts',
          },
        },
        null,
        2,
      ) + '\n',
  },
  {
    path: '.gitignore',
    render: () => ['node_modules/', '.DS_Store', ''].join('\n'),
  },
];

// --- enumeration: the graft set. The single list graft writes and uninstall removes (LAW-3). ---

/** Every file path under a copy root, target-relative, walked from `source`. A file root (SEED.md)
 *  yields itself. */
function filesUnder(source: string, root: string): string[] {
  const abs = join(source, root);
  if (!existsSync(abs)) return [];
  if (statSync(abs).isFile()) return [root];
  const out: string[] = [];
  const walk = (relDir: string): void => {
    for (const entry of readdirSync(join(source, relDir), { withFileTypes: true })) {
      const rel = `${relDir}/${entry.name}`;
      if (entry.isDirectory()) walk(rel);
      else out.push(rel);
    }
  };
  walk(root);
  return out;
}

/** Every file path a graft from `source` would create in the target: the copied-root files plus the
 *  template paths. Sorted + deduped — deterministic. */
export function graftFiles(source: string): string[] {
  const copied = COPY_ROOTS.flatMap((r) => filesUnder(source, r));
  const templated = TEMPLATES.map((t) => t.path);
  return [...new Set([...copied, ...templated])].sort();
}

/** The graft-set paths that already exist in `target` — graft's refusal set (the clobber guard).
 *  Empty means the graft is purely additive and safe. */
export function conflicts(source: string, target: string): string[] {
  return graftFiles(source).filter((p) => existsSync(join(target, p)));
}

export interface GraftResult {
  created: string[]; // target-relative paths written
  copiedRoots: string[]; // the COPY_ROOTS actually present in the source and copied
}

/**
 * Perform the graft into `target`: refuse if any path would be clobbered (LAW-2 — purely additive),
 * then copy the portable + sovereign roots verbatim and write the parameterized local scaffold. Throws
 * a legible Error naming the conflicts rather than overwriting.
 */
export function applyGraft(source: string, target: string, vars: GraftVars): GraftResult {
  const clash = conflicts(source, target);
  if (clash.length > 0) {
    throw new Error(
      `graft would overwrite ${clash.length} existing path(s) in the target — it refuses to clobber (LAW-2, purely additive). ` +
        `Remove or relocate them first, or uninstall a prior graft: ${clash.slice(0, 8).join(', ')}${clash.length > 8 ? ', …' : ''}`,
    );
  }
  const copiedRoots: string[] = [];
  for (const root of COPY_ROOTS) {
    const from = join(source, root);
    if (!existsSync(from)) continue; // a source missing a portable root is its own problem, surfaced elsewhere
    cpSync(from, join(target, root), { recursive: true });
    copiedRoots.push(root);
  }
  for (const t of TEMPLATES) {
    const dest = join(target, t.path);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, t.render(vars));
  }
  return { created: graftFiles(source), copiedRoots };
}

export interface UninstallResult {
  removed: string[]; // target-relative paths removed (those that were present)
  prunedDirs: string[]; // directories the graft introduced that were emptied and removed
}

/**
 * Reverse a graft from `target`: remove the copy roots wholesale and every template file, then prune
 * the directories the graft introduced that are now empty (deepest first) — leaving host content that
 * predates or postdates the graft untouched. Because a successful graft refused to clobber, everything
 * removed here was graft-created, so the target returns byte-identical to its pre-graft state.
 */
export function applyUninstall(target: string): UninstallResult {
  const removed: string[] = [];
  // The copy roots are removed wholesale — a successful graft proved they did not pre-exist, so the
  // whole subtree is graft-created (this also catches any post-graft edits to copied files).
  for (const root of COPY_ROOTS) {
    const abs = join(target, root);
    if (existsSync(abs)) {
      rmSync(abs, { recursive: true, force: true });
      removed.push(root);
    }
  }
  for (const t of TEMPLATES) {
    const abs = join(target, t.path);
    if (existsSync(abs)) {
      rmSync(abs, { force: true });
      removed.push(t.path);
    }
  }
  // Prune the directories the graft introduced (ancestors of the template paths), deepest first, only
  // when empty — so a host's own sibling content in a shared directory (e.g. its pre-existing docs/) is
  // preserved, while a directory the graft created and filled returns to nothing.
  const dirs = new Set<string>();
  for (const t of TEMPLATES) {
    let d = dirname(t.path);
    while (d && d !== '.') {
      dirs.add(d);
      d = dirname(d);
    }
  }
  const prunedDirs: string[] = [];
  for (const d of [...dirs].sort((a, b) => b.length - a.length)) {
    const abs = join(target, d);
    if (existsSync(abs) && statSync(abs).isDirectory() && readdirSync(abs).length === 0) {
      rmdirSync(abs); // empty-only (guarded above) — rmSync without recursive throws EISDIR on a dir
      prunedDirs.push(d);
    }
  }
  return { removed, prunedDirs };
}
