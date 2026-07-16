// The release / graft CLI (plan 0005 scope item 2, ring 0027; E-015). A thin orchestrator over the
// already-built organs, owned in .seed/ (portable, so a descendant carries it and cuts its OWN pollen
// — self-carrying, E-015). It implements founding ring 0026's model: pollen is semver, the impact
// class is DECLARED and checked, the next version is a pure function of the max declared impact, and a
// major forces a migration.
//
// Verbs:
//   sense [<repo>]                 report a target's pollen version, released history, and the pending
//                                  next release (the read side a descendant runs against its mother).
//   cut-release --date D [...]     the git-aware, side-effecting release step (OUT of run-all): fold the
//                                  pending intents into a dated release, bump the pollen version, clear
//                                  pending, regenerate the notes. --dry-run computes and prints, writing
//                                  NOTHING — its verification (the worktrees/feedback dry-run shape).
//   verify [<repo>]                prove a (grafted) seed holds its invariants — delegates to its own
//                                  run-all.ts.
//   feedback ...                   compose an upstream issue — delegates to the feedback composer.
//   graft <target> [...]           install this seed's portable subset into <target> (SEED.md §4 step
//                                  4: the map, the plan structure, the first lints — no behavior changes
//                                  yet). Purely additive: it refuses to overwrite (LAW-2). --planted is
//                                  a recorded fact (ring 0020). Model: .seed/lib/graft.ts (ring 0028).
//   uninstall <target>             reverse a graft: remove exactly the graft set and prune the
//                                  directories it emptied, restoring the target byte-identical (SEED.md
//                                  §4: an uninstall path must exist).
//
// The determinism split (ring 0020): the pending-release NOTES are pure + byte-exact-gated
// (docs/generated/pending-release.md, via validate-generated); the release HISTORY is append-only +
// dated (pollen/releases/, via release-append-only.ts); and THIS step — cut-release — is the git-aware,
// side-effecting half, kept out of run-all and pinned by the self-tests as a dry-run. A release date is
// a recorded fact, so --date is required and no wall-clock is read.
//
// Exit: 0 ok; 1 the operation could not complete (nothing to release, a missing migration, a graft that
// would clobber, a target that is not a seed); 2 usage. verify / feedback pass their child's exit through.
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { REPO_ROOT } from '../lib/repo.ts';
import {
  type Impact,
  type Intent,
  PENDING_PATH,
  RELEASES_DIR,
  bump,
  latestReleased,
  nextRelease,
  readReleases,
  renderEmptyPending,
  renderReleaseFile,
} from '../lib/release.ts';
import {
  type GraftVars,
  COPY_ROOTS,
  TEMPLATES,
  applyGraft,
  applyUninstall,
  conflicts,
  defaultVars,
  graftFiles,
} from '../lib/graft.ts';

const POLLEN_TS = '.seed/lib/pollen.ts';
const LINEAGE_PATH = 'pollen/lineage.json';
const RELEASES_README = `${RELEASES_DIR}/README.md`;

// --- usage ---

const VERBS = ['sense', 'cut-release', 'verify', 'feedback', 'graft', 'uninstall'] as const;

function usage(message: string): never {
  console.error(`release: ${message}`);
  console.error(`usage: node .seed/checks/release.ts <verb> [args]   verbs: ${VERBS.join(' | ')}`);
  console.error('  sense [<repo>] [--json]                         report version, history, and the pending release');
  console.error('  cut-release --date YYYY-MM-DD [--migration F] [--dry-run] [--json]');
  console.error('  graft <target> --planted YYYY-MM-DD [--parent owner/repo] [--repo owner/repo] [--dry-run] [--json]');
  console.error('  uninstall <target> [--dry-run] [--json]         reverse a graft, byte-identical');
  console.error('  verify [<repo>]                                 run the target seed\'s own run-all');
  console.error('  feedback ...                                    forward to the feedback composer');
  process.exit(2);
}

function flagValue(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const v = args[i + 1];
  if (v === undefined || v.startsWith('--')) usage(`${name} needs a value`);
  return v;
}

/** The single positional (a target repo path), or undefined. Rejects a second positional. */
function positional(args: string[]): string | undefined {
  const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && VALUE_FLAGS.has(args[i - 1])));
  if (pos.length > 1) usage(`expected at most one target repo path, got ${pos.length}`);
  return pos[0];
}
const VALUE_FLAGS = new Set(['--date', '--migration', '--parent', '--planted', '--repo']);

function targetRoot(args: string[]): string {
  const target = resolve(process.cwd(), positional(args) ?? '.');
  if (!existsSync(target) || !statSync(target).isDirectory()) usage(`target is not a directory: ${target}`);
  return target;
}

// --- sense ---

interface SenseReport {
  target: string;
  version: string; // latest released (0.0.0 before the first release)
  releases: Array<{ version: string; date: string | null; impact: Impact | null; rings: string[] }>;
  pending: { next: string; impact: Impact; migrationRequired: boolean; intents: Intent[] } | null;
}

function sense(root: string): SenseReport {
  const releases = readReleases(root).map((r) => ({ version: r.version, date: r.date, impact: r.impact, rings: r.rings }));
  const pr = nextRelease(root);
  return {
    target: root,
    version: latestReleased(root),
    releases,
    pending: pr === null ? null : { next: pr.next, impact: pr.impact, migrationRequired: pr.migrationRequired, intents: pr.intents },
  };
}

function senseReport(r: SenseReport): void {
  console.log('release — sense (LAW-11: propagation is re-metabolization; propose, never force)\n');
  console.log(`Target: ${r.target}`);
  console.log(`Current pollen version: v${r.version}\n`);
  console.log(r.releases.length === 0 ? 'Released history: none yet.' : 'Released history:');
  for (const rel of r.releases) console.log(`  - v${rel.version} (${rel.impact ?? '?'}) — ${rel.date ?? 'undated'} — composed ${rel.rings.map((n) => `ring ${n}`).join(', ') || 'nothing'}`);
  console.log('');
  if (r.pending === null) {
    console.log('Pending release: none — no committed intents. The pollen line rests.');
  } else {
    console.log(`Pending release: v${r.pending.next} (${r.pending.impact})${r.pending.migrationRequired ? ' — MIGRATION REQUIRED' : ''}, composing:`);
    for (const i of r.pending.intents) console.log(`  - ${i.impact} — ring ${i.ring} — ${i.summary}`);
    console.log('\nAdopting a release is re-metabolization (ring 0026): the change becomes YOUR ring, never a forced merge.');
  }
}

// --- cut-release: the shared plan, computed once for dry-run and the real cut so they cannot diverge ---

interface CutPlan {
  version: string;
  date: string;
  impact: Impact;
  intents: Intent[];
  migration: string | null; // repo-relative migration path (major), else null
  releaseFile: string; // repo-relative
  releaseContent: string;
  newPollenVersion: string;
  indexEntry: string; // the pollen/releases/README.md line this cut appends
}

/** Compute the cut, or throw a legible reason it cannot be composed (nothing pending, or a major with
 *  no migration — the migration-required tooth's cut-time half). Pure; writes nothing. */
function computeCutPlan(date: string, migrationArg: string | undefined): CutPlan {
  const pr = nextRelease(REPO_ROOT);
  if (pr === null) {
    throw new Error(`nothing to release — ${PENDING_PATH} declares no pending intents. Declare a portable change there first (ring 0027).`);
  }
  let migration: string | null = null;
  if (pr.migrationRequired) {
    if (migrationArg === undefined) {
      throw new Error(
        `v${pr.next} is a MAJOR (breaking) release — it cannot be adopted as a pure additive graft, so it must carry a migration (ring 0026). Re-run with --migration <path-to-migration-doc>.`,
      );
    }
    const abs = isAbsolute(migrationArg) ? migrationArg : resolve(process.cwd(), migrationArg);
    if (!existsSync(abs)) throw new Error(`--migration path does not exist: ${migrationArg}`);
    migration = relative(REPO_ROOT, abs).split('\\').join('/');
  } else if (migrationArg !== undefined) {
    throw new Error(`v${pr.next} is a ${pr.impact} release and needs no migration — drop --migration (only a major carries one, ring 0026).`);
  }
  const version = pr.next;
  const indexEntry = `- [v${version}](v${version}.md) — ${date} — ${pr.impact}: composed ${pr.intents.map((i) => `ring ${i.ring}`).join(', ')}.`;
  return {
    version,
    date,
    impact: pr.impact,
    intents: pr.intents,
    migration,
    releaseFile: `${RELEASES_DIR}/v${version}.md`,
    releaseContent: renderReleaseFile(version, date, pr.impact, pr.intents, migration, REPO_ROOT),
    newPollenVersion: version,
    indexEntry,
  };
}

/** Apply the cut to the seed's OWN tree (REPO_ROOT): write the release file, clear pending, bump the
 *  pollen version + lineage, append the history index, regenerate the notes. The side-effecting half. */
function applyCut(plan: CutPlan): void {
  // 1. the release file (append-only history).
  writeFileSync(join(REPO_ROOT, plan.releaseFile), plan.releaseContent);
  // 2. clear the consumed intents.
  writeFileSync(join(REPO_ROOT, PENDING_PATH), renderEmptyPending());
  // 3. bump POLLEN_VERSION — the single pollen-version source (validate-release proves it tracks here).
  const pollenTs = readFileSync(join(REPO_ROOT, POLLEN_TS), 'utf8');
  const bumped = pollenTs.replace(/(POLLEN_VERSION\s*=\s*')[^']*(')/, `$1${plan.newPollenVersion}$2`);
  if (bumped === pollenTs) throw new Error(`could not find POLLEN_VERSION to bump in ${POLLEN_TS}`);
  writeFileSync(join(REPO_ROOT, POLLEN_TS), bumped);
  // 4. bump the lineage seedVersion (SEED.md §7: the seed version IS the pollen version it carries).
  const lineage = JSON.parse(readFileSync(join(REPO_ROOT, LINEAGE_PATH), 'utf8'));
  lineage.seedVersion = plan.newPollenVersion;
  writeFileSync(join(REPO_ROOT, LINEAGE_PATH), JSON.stringify(lineage, null, 2) + '\n');
  // 5. append the history index (README exempt from the append-only gate; it gains a line per release).
  const readme = readFileSync(join(REPO_ROOT, RELEASES_README), 'utf8');
  const marker = '## Releases';
  const idx = readme.indexOf(marker);
  if (idx === -1) throw new Error(`${RELEASES_README} has no "## Releases" section to append to`);
  const head = readme.slice(0, idx + marker.length);
  const body = readme.slice(idx + marker.length);
  const newBody = /_No release cut yet/.test(body) ? `\n\n${plan.indexEntry}\n` : body.replace(/\s*$/, '') + `\n${plan.indexEntry}\n`;
  writeFileSync(join(REPO_ROOT, RELEASES_README), head + newBody);
  // 6. regenerate the pending-release notes from the new state (a fresh process reads the new files).
  const gen = spawnSync(process.execPath, ['.seed/checks/generate.ts'], { cwd: REPO_ROOT, encoding: 'utf8' });
  if (gen.status !== 0) throw new Error(`regeneration failed after the cut:\n${gen.stdout ?? ''}${gen.stderr ?? ''}`);
}

function cutReport(plan: CutPlan, dryRun: boolean): void {
  console.log(`release — cut-release${dryRun ? ' (dry-run — writes nothing; LAW-6: every capability ships verification)' : ''}\n`);
  console.log(`Next release: v${plan.version} (${plan.impact}), dated ${plan.date}`);
  console.log(`Composing: ${plan.intents.map((i) => `ring ${i.ring}`).join(', ')}`);
  console.log(`Migration: ${plan.migration ?? 'none (a ' + plan.impact + ' release is a backward-compatible graft)'}\n`);
  console.log(`Would write ${plan.releaseFile}:\n`);
  console.log(plan.releaseContent);
  if (dryRun) {
    console.log(`And would bump POLLEN_VERSION → ${plan.newPollenVersion}, clear ${PENDING_PATH}, append ${RELEASES_README}, and regenerate the notes.`);
    console.log('\n✓ dry-run — nothing written (the release step is side-effecting; run without --dry-run to cut it).');
  } else {
    console.log(`✓ cut v${plan.version} — POLLEN_VERSION bumped, ${PENDING_PATH} cleared, ${RELEASES_README} appended, notes regenerated.`);
    console.log('  Commit the result; the release is now history (append-only, ring 0027).');
  }
}

// --- verify / feedback: thin orchestration over already-built organs ---

function passthrough(scriptRoot: string, script: string, args: string[]): never {
  const path = join(scriptRoot, script);
  if (!existsSync(path)) {
    console.error(`release: ${scriptRoot} carries no ${script} — is it a seed? (LAW-6: a seed carries its own verification.)`);
    process.exit(1);
  }
  const res = spawnSync(process.execPath, [path, ...args], { stdio: 'inherit' });
  process.exit(res.status ?? 1);
}

// --- graft / uninstall: the installer + the mandated uninstall path (ring 0028). Side-effecting on a
// --- target tree (like cut-release), so out of run-all; the source is THIS running seed (REPO_ROOT),
// --- which installs its own portable subset — self-carrying (E-015). ---

/** A target repo path is REQUIRED for graft/uninstall (unlike sense, which defaults to '.') — you must
 *  name where to install or reverse. Rejects a missing path or a non-directory. */
function requireTargetRoot(args: string[]): string {
  const pos = positional(args);
  if (pos === undefined) usage('this verb needs an explicit <target> repo path');
  const target = resolve(process.cwd(), pos);
  if (!existsSync(target) || !statSync(target).isDirectory()) usage(`target is not a directory: ${target}`);
  return target;
}

function graftReport(target: string, vars: GraftVars, fileCount: number, dryRun: boolean): void {
  console.log(`release — graft${dryRun ? ' (dry-run — writes nothing; LAW-6: every capability ships verification)' : ''}\n`);
  console.log(`Target: ${target}`);
  console.log(
    `Grafting pollen v${vars.version} (genome v${vars.genomeVersion}) — the map, the plan structure, and the first lints ` +
      '(SEED.md §4 step 4; no behavior changes yet).',
  );
  console.log(`Lineage: parent ${vars.parent ?? 'none (a lineage root)'}, seedVersion v${vars.version}, planted ${vars.planted}.`);
  console.log(`Copied verbatim (portable + sovereign): ${COPY_ROOTS.join(', ')}`);
  console.log(`Emitted as local scaffold: ${TEMPLATES.map((t) => t.path).join(', ')}`);
  console.log(`Total files: ${fileCount}.`);
  if (dryRun) {
    console.log('\n✓ dry-run — nothing written (graft is side-effecting; run without --dry-run to install).');
  } else {
    console.log(`\n✓ grafted — the method is installed. Verify with \`node .seed/checks/release.ts verify ${target}\`; reverse with \`uninstall ${target}\`.`);
    console.log('  Propagation is re-metabolization (ring 0026): the host adopts the method as its own — no behavior changes yet.');
  }
}

function graftCmd(flags: string[], rest: string[], json: boolean): never {
  const target = requireTargetRoot(flags);
  const planted = flagValue(flags, '--planted');
  if (planted === undefined || !/^\d{4}-\d{2}-\d{2}$/.test(planted)) {
    usage('graft needs --planted YYYY-MM-DD — the planting date is a recorded fact, never a wall-clock read (ring 0020).');
  }
  const vars = defaultVars(planted, flagValue(flags, '--parent') ?? null, flagValue(flags, '--repo') ?? null);
  const dryRun = rest.includes('--dry-run');
  const clash = conflicts(REPO_ROOT, target);
  if (clash.length > 0) {
    const shown = clash.slice(0, 8).join(', ') + (clash.length > 8 ? ', …' : '');
    if (json) console.log(JSON.stringify({ verb: 'graft', ok: false, dryRun, target, conflicts: clash }));
    else console.error(`release: graft would overwrite ${clash.length} existing path(s) — it refuses to clobber (LAW-2, purely additive): ${shown}`);
    process.exit(1);
  }
  if (!dryRun) applyGraft(REPO_ROOT, target, vars);
  const fileCount = graftFiles(REPO_ROOT).length;
  if (json) {
    console.log(JSON.stringify({ verb: 'graft', ok: true, dryRun, target, version: vars.version, genomeVersion: vars.genomeVersion, parent: vars.parent, planted: vars.planted, fileCount }));
  } else {
    graftReport(target, vars, fileCount, dryRun);
  }
  process.exit(0);
}

function uninstallReport(target: string, removed: string[], prunedDirs: string[], dryRun: boolean): void {
  console.log(`release — uninstall${dryRun ? ' (dry-run — writes nothing)' : ''}\n`);
  console.log(`Target: ${target}`);
  console.log(`${dryRun ? 'Would remove' : 'Removed'} ${removed.length} graft path(s): ${removed.join(', ')}`);
  if (!dryRun && prunedDirs.length > 0) console.log(`Pruned ${prunedDirs.length} emptied director${prunedDirs.length === 1 ? 'y' : 'ies'}: ${prunedDirs.join(', ')}`);
  console.log(
    dryRun
      ? '\n✓ dry-run — nothing removed (the graft set above would be removed and any directory it emptied pruned).'
      : '\n✓ uninstalled — the graft set was removed and emptied directories pruned; the target returns to its pre-graft state (an uninstall path must exist, SEED.md §4).',
  );
}

function uninstallCmd(flags: string[], rest: string[], json: boolean): never {
  const target = requireTargetRoot(flags);
  const dryRun = rest.includes('--dry-run');
  const present = [
    ...COPY_ROOTS.filter((r) => existsSync(join(target, r))),
    ...TEMPLATES.map((t) => t.path).filter((p) => existsSync(join(target, p))),
  ];
  if (present.length === 0) {
    if (json) console.log(JSON.stringify({ verb: 'uninstall', ok: true, dryRun, target, removed: [], prunedDirs: [] }));
    else console.log(`release — uninstall: ${target} carries no graft — nothing to remove.`);
    process.exit(0);
  }
  let removed = present;
  let prunedDirs: string[] = [];
  if (!dryRun) {
    const r = applyUninstall(target);
    removed = r.removed;
    prunedDirs = r.prunedDirs;
  }
  if (json) console.log(JSON.stringify({ verb: 'uninstall', ok: true, dryRun, target, removed, prunedDirs }));
  else uninstallReport(target, removed, prunedDirs, dryRun);
  process.exit(0);
}

// --- main ---

function main(): void {
  const argv = process.argv.slice(2);
  const verb = argv[0];
  const rest = argv.slice(1);
  const json = rest.includes('--json');
  const flags = rest.filter((a) => a !== '--json' && a !== '--dry-run');

  switch (verb) {
    case 'sense': {
      const r = sense(targetRoot(flags));
      if (json) console.log(JSON.stringify(r));
      else senseReport(r);
      process.exit(0);
      break;
    }
    case 'cut-release': {
      const date = flagValue(flags, '--date');
      if (date === undefined || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        usage('cut-release needs --date YYYY-MM-DD — the release date is a recorded fact, never a wall-clock read (ring 0020).');
      }
      const dryRun = rest.includes('--dry-run');
      let plan: CutPlan;
      try {
        plan = computeCutPlan(date, flagValue(flags, '--migration'));
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (json) console.log(JSON.stringify({ verb: 'cut-release', ok: false, dryRun, reason: msg }));
        else console.error(`release: ${msg}`);
        process.exit(1);
      }
      if (!dryRun) applyCut(plan);
      if (json) {
        console.log(JSON.stringify({ verb: 'cut-release', ok: true, dryRun, version: plan.version, impact: plan.impact, date: plan.date, migration: plan.migration, rings: plan.intents.map((i) => i.ring), releaseFile: plan.releaseFile }));
      } else {
        cutReport(plan, dryRun);
      }
      process.exit(0);
      break;
    }
    case 'verify':
      passthrough(targetRoot(flags), '.seed/checks/run-all.ts', []);
      break;
    case 'feedback':
      // Forward everything after the verb (including --json) to the composer, unchanged.
      passthrough(REPO_ROOT, '.seed/checks/feedback.ts', rest);
      break;
    case 'graft':
      graftCmd(flags, rest, json);
      break;
    case 'uninstall':
      uninstallCmd(flags, rest, json);
      break;
    case undefined:
      usage('missing verb');
      break;
    default:
      usage(`unknown verb: ${verb}`);
  }
}

try {
  main();
} catch (e) {
  console.error(`release: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
}
