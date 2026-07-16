// feedback (plan 0003 scope item 6, ring 0021): open an issue UPSTREAM against the mother seed
// from ANY repository — a descendant's learning flows back (LAW-11; SEED.md §7). The genome ships
// only the COMPOSER: given a learning, it composes a well-formed upstream issue (title + body +
// the parent it addresses) and emits the exact `gh issue create` command a human would run. It
// never posts — and "without posting" is not a flag it declines to pass, it is a capability the
// genome does not contain. Posting an upstream issue needs a network, auth, and a live upstream
// (host-specific mechanics the genome keeps out, the worktrees "boot lives in host adapters" line,
// SEED.md §4) and is an outward-facing publish the Gardener gates (LAW-1). So the tool composes;
// a human posts, with the emitted command, once they approve.
//
// It runs against ANY repository (the repo-fitness shape): it reads that repo's lineage from an
// optional pollen/lineage.json (a descendant records `seed version, parent, date planted`, SEED.md
// §7 / pollen/README.md) and, when absent, degrades honestly — provenance is stated "unrecorded",
// never fabricated (the ring 0020 no-wall-clock discipline: the body carries NO clock, so a given
// learning composes byte-identically). If the target is itself a root seed (SEED.md present, no
// recorded parent, no --parent), it REFUSES: feedback flows UPSTREAM, so a learning about the
// method at the root is a ring or a ledger entry, not an upstream issue to yourself.
//
// This file is its own verification (LAW-6). `dry-run` composes and self-validates the learning;
// the self-tests pin it composes a well-formed issue from a foreign descendant (the exact section
// set, so no section can be silently dropped — the worktrees anti-costume pin), that each required
// field and each vocabulary is enforced (teeth: a missing field / an unknown kind / an unknown
// conversion / a rootless seed each exit 1 with a legible message), that composing is
// side-effect-free (the target repo is byte-identical after a run — the repo-fitness non-mutation
// proof — and nothing is posted), and that composition is deterministic.
//
// Run:  node .seed/checks/feedback.ts dry-run [<repo>] --kind K --title T --observation O \
//                                    --generalizes G --conversion C [--parent owner/repo]
//       ... --json      ({ mode, ok, target, title, body, command, violations })
//   or:  npm run feedback -- dry-run [<repo>] --kind ... --title ... ...
//
// Exit 0 = a well-formed upstream issue was composed; 1 = it could not be (an ill-formed learning,
// or no upstream to address — the message says which); 2 = a usage error. Like repo-fitness and
// worktrees it is NOT a run-all.ts gate (it reads arbitrary targets and is not a per-commit
// invariant of the seed's own tree); it is reached through the map, and its proof is the self-tests.
import { existsSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { LINEAGE_PATH, readLineage, type Lineage } from '../lib/lineage.ts';

// The learning's class, and the proposed product — both named, closed vocabularies (the automerge
// -class precedent): an out-of-vocabulary value is rejected, not silently accepted. CONVERSIONS are
// exactly SEED.md §0's four products ("every unit of detected entropy must be converted into
// exactly one of four products"), so an upstream learning proposes one of them and no other.
const KINDS = ['defect', 'friction', 'capability-gap', 'proposal'] as const;
const CONVERSIONS = ['invariant', 'ring', 'priced-debt', 'deletion'] as const;
type Kind = (typeof KINDS)[number];
type Conversion = (typeof CONVERSIONS)[number];

const TITLE_PREFIX = '[seed-feedback]';

// The learning: the sensed unit of entropy about the seed/method a descendant sends upstream.
// Every field is required for a WELL-FORMED issue — the whole point of the verification.
export interface Learning {
  kind: Kind;
  title: string;
  observation: string; // what happened
  generalizes: string; // why it belongs upstream, not in a local ring (the LAW-11 test)
  conversion: Conversion; // the proposed product (SEED.md §0)
}

export interface ComposedIssue {
  target: string; // the parent repo the issue is addressed to
  title: string; // the gh issue title, including the [seed-feedback] prefix
  body: string; // the full markdown body
  command: string; // the exact `gh issue create` a human runs to post it — emitted, never executed
}

export interface ComposeResult {
  ok: boolean;
  issue: ComposedIssue | null;
  violations: string[]; // legible, LAW-naming reasons composition failed (empty on ok)
}

// The context the composer needs about the target repo — read by the caller (readContext), so
// composeIssue itself is a PURE function of its inputs: no fs, no clock, so a given (learning,
// lineage, context) composes byte-identically (the determinism the self-tests pin).
export interface RepoContext {
  repoName: string; // the descendant's name, for the Lineage section
  isSeed: boolean; // does the target carry SEED.md (is it a seed with no parent → a root)
}

// The exact, ordered set of body sections a well-formed issue carries — and the SINGLE source the
// composer builds the body's headers from (LAW-3): the body is assembled in this order (see
// composeIssue), so a section renamed or reordered here flows into the output (and a header with no
// matching content key throws rather than emitting a malformed issue) — the constant is load-bearing,
// not decoration. The self-test pins the EMITTED set against a lockstep duplicate
// (EXPECTED_FEEDBACK_SECTIONS), the worktrees exact-check-set guard — it likewise keeps a
// hand-maintained list in the test — so a dropped or reordered section turns the suite red.
export const REQUIRED_SECTIONS = [
  '## Lineage',
  '## Kind',
  '## What happened',
  '## Why this is upstream',
  '## Proposed conversion',
] as const;

function orNone(value: string | undefined, ifAbsent: string): string {
  const v = (value ?? '').trim();
  return v === '' ? ifAbsent : v;
}

/** POSIX single-quote a shell word: wrap in '…' and turn each embedded `'` into `'\''` (close the
 *  quote, an escaped literal quote, reopen). A free-form title with an apostrophe ("doesn't stop")
 *  must not break — or inject into — the command the tool hands the Gardener to run. */
function shSingleQuote(s: string): string {
  return `'${s.split("'").join("'\\''")}'`;
}

/**
 * Compose a well-formed upstream issue, or return the reasons it could not be composed. Pure: the
 * caller supplies the lineage and the repo context, so the same inputs always yield the same bytes.
 */
export function composeIssue(
  learning: Partial<Learning>,
  lineage: Lineage | null,
  ctx: RepoContext,
  parentOverride?: string,
): ComposeResult {
  const violations: string[] = [];
  const need = (name: keyof Learning, label: string): string => {
    const v = `${learning[name] ?? ''}`.trim();
    if (v === '') violations.push(`the learning is missing a non-empty ${label} (--${name}) — a well-formed upstream issue states it (LAW-11).`);
    return v;
  };

  const title = need('title', 'title');
  const observation = need('observation', 'observation of what happened');
  const generalizes = need('generalizes', 'reason this generalizes upstream');

  const kind = `${learning.kind ?? ''}`.trim();
  if (kind === '') violations.push(`the learning is missing a --kind — one of: ${KINDS.join(', ')} (LAW-11).`);
  else if (!(KINDS as readonly string[]).includes(kind)) violations.push(`--kind "${kind}" is not a feedback kind — use one of: ${KINDS.join(', ')} (LAW-11).`);

  const conversion = `${learning.conversion ?? ''}`.trim();
  if (conversion === '') violations.push(`the learning is missing a --conversion — one of SEED.md §0's four products: ${CONVERSIONS.join(', ')}.`);
  else if (!(CONVERSIONS as readonly string[]).includes(conversion)) violations.push(`--conversion "${conversion}" is not one of SEED.md §0's four products — use one of: ${CONVERSIONS.join(', ')}.`);

  // Resolve the upstream target. A root seed with no recorded parent has no upstream: feedback
  // flows UPSTREAM (LAW-11), so a learning here is a ring or a ledger entry, not an issue to self.
  const parent = (parentOverride ?? lineage?.parent ?? '').trim();
  if (parent === '') {
    // Distinguish "no lineage file" from "a lineage file present but recording no parent" — the
    // branch fires for both, so the diagnosed cause must be the true one (LAW-2 legibility).
    const lineageNote = lineage === null ? `no ${LINEAGE_PATH}` : `${LINEAGE_PATH} records no parent`;
    if (ctx.isSeed) {
      violations.push(
        `this repository is a seed (SEED.md present) with no recorded parent (${lineageNote}) — it is at the root of its lineage. ` +
          `Feedback flows UPSTREAM (LAW-11); a learning about the method at the root is a ring or a ledger entry, not an upstream issue to yourself. ` +
          `If this repo is actually a descendant, record its lineage in ${LINEAGE_PATH} or pass --parent <owner/repo>.`,
      );
    } else {
      violations.push(
        `${lineageNote} and no --parent given — there is no upstream to address. ` +
          `Pass --parent <owner/repo> naming the mother seed (LAW-11).`,
      );
    }
  }

  if (violations.length > 0) return { ok: false, issue: null, violations };

  const fullTitle = `${TITLE_PREFIX} ${title}`;
  // The body content, keyed by section. It is emitted in REQUIRED_SECTIONS order (below), so that
  // constant is the single source of which sections exist and in what order — a section renamed in
  // one place but not the other throws on the missing key rather than silently shipping a malformed
  // issue, which is what makes REQUIRED_SECTIONS a real pin and not decoration.
  const sectionBody: Record<(typeof REQUIRED_SECTIONS)[number], string[]> = {
    '## Lineage': [
      `- From: ${ctx.repoName}`,
      `- Seed version: ${orNone(lineage?.seedVersion, 'unrecorded')}`,
      `- Parent (mother seed): ${parent}`,
      `- Planted: ${orNone(lineage?.planted, 'unrecorded')}`,
    ],
    '## Kind': [kind],
    '## What happened': [observation],
    '## Why this is upstream': [generalizes],
    '## Proposed conversion': [
      `${conversion} — one of SEED.md §0's four products the mother seed should weigh: invariant, ring, priced debt, or deletion.`,
    ],
  };
  const body =
    [
      `# ${fullTitle}`,
      ...REQUIRED_SECTIONS.flatMap((h) => ['', h, '', ...sectionBody[h]]),
      '',
      '---',
      '',
      `_Composed by the feedback skill (LAW-11) from ${ctx.repoName}. Not auto-posted — a human posts it with the command below, once the Gardener approves (an upstream issue is an outward-facing act, LAW-1)._`,
    ].join('\n') + '\n';

  // The command is a TEMPLATE the human runs — the tool never executes it, and writes no file, so a
  // run has no side effects. The title is free-form text, so it is POSIX single-quote-escaped: an
  // apostrophe in a title must not break (or inject into) the command handed to the Gardener. Save
  // the body above to a file and fill in --body-file to post.
  const command = `gh issue create --repo ${parent} --title ${shSingleQuote(fullTitle)} --body-file <file-holding-the-body-above>`;

  return { ok: true, issue: { target: parent, title: fullTitle, body, command }, violations: [] };
}

// --- reading the target repo. The ONLY side of the tool that touches the filesystem; strictly
// --- read-only, so a compose never mutates the target (proven by the self-tests, repo-fitness style).

export function readContext(root: string, lineage: Lineage | null): RepoContext {
  return { repoName: orNone(lineage?.repo, basename(root)), isSeed: existsSync(join(root, 'SEED.md')) };
}

// --- CLI ---

function usage(message: string): never {
  console.error(`feedback: ${message}`);
  console.error(
    'usage: node .seed/checks/feedback.ts dry-run [<repo>] --kind K --title T --observation O --generalizes G --conversion C [--parent owner/repo] [--json]',
  );
  console.error(`  --kind        one of: ${KINDS.join(', ')}`);
  console.error(`  --conversion  one of: ${CONVERSIONS.join(', ')}`);
  process.exit(2);
}

function flagValue(flags: string[], name: string): string | undefined {
  const i = flags.indexOf(name);
  if (i === -1) return undefined;
  const v = flags[i + 1];
  if (v === undefined || v.startsWith('--')) usage(`${name} needs a value`);
  return v;
}

function humanReport(r: ComposeResult): void {
  console.log('feedback — dry-run (LAW-6: every capability ships verification)\n');
  if (r.ok && r.issue) {
    console.log(`Composed a well-formed upstream issue for ${r.issue.target}:\n`);
    console.log(r.issue.body);
    console.log('To post it (a human step, once the Gardener approves — the tool does not post):');
    console.log(`  ${r.issue.command}\n`);
    console.log('✓ composed — not posted (LAW-11: feedback flows upstream; LAW-1: the Gardener gates the outward act)');
  } else {
    console.log('✗ could not compose an upstream issue:\n');
    for (const v of r.violations) console.log(`  - ${v}`);
    console.log('\nFix the learning (or address the lineage) above and re-run.');
  }
}

function main(): void {
  const argv = process.argv.slice(2);
  const mode = argv[0];
  if (mode === undefined) usage('missing mode — the only mode is `dry-run`');
  if (mode !== 'dry-run') usage(`unknown mode: ${mode} — the only mode is \`dry-run\``);

  const rest = argv.slice(1);
  const json = rest.includes('--json');
  const flags = rest.filter((a) => a !== '--json');
  const positional = flags.filter((a, i) => !a.startsWith('--') && !(i > 0 && flags[i - 1].startsWith('--')));
  if (positional.length > 1) usage(`expected at most one target repo path, got ${positional.length}`);

  const target = resolve(process.cwd(), positional[0] ?? '.');
  if (!existsSync(target) || !statSync(target).isDirectory()) usage(`target is not a directory: ${target}`);

  const learning: Partial<Learning> = {
    kind: flagValue(flags, '--kind') as Kind | undefined,
    title: flagValue(flags, '--title'),
    observation: flagValue(flags, '--observation'),
    generalizes: flagValue(flags, '--generalizes'),
    conversion: flagValue(flags, '--conversion') as Conversion | undefined,
  };
  const parentOverride = flagValue(flags, '--parent');

  let result: ComposeResult;
  try {
    const lineage = readLineage(target);
    const ctx = readContext(target, lineage);
    result = composeIssue(learning, lineage, ctx, parentOverride);
  } catch (e) {
    // A malformed lineage file is a composition failure with a legible reason, not a crash.
    result = { ok: false, issue: null, violations: [e instanceof Error ? e.message : String(e)] };
  }

  if (json) {
    console.log(
      JSON.stringify({
        mode: 'dry-run',
        ok: result.ok,
        target: result.issue?.target ?? null,
        title: result.issue?.title ?? null,
        body: result.issue?.body ?? null,
        command: result.issue?.command ?? null,
        violations: result.violations,
      }),
    );
  } else {
    humanReport(result);
  }
  process.exit(result.ok ? 0 : 1);
}

try {
  main();
} catch (e) {
  console.error(`feedback: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
}
