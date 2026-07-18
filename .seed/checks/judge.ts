// The judge CLI (plan 0005, ring 0030; E-013). The seed's inferential control has a deterministic
// envelope owned in .seed/ and a probabilistic core performed by the HOST model — this CLI is the seam
// between them: it ASSEMBLES the pinned inputs (artifact + rubric + in-repo source) into the exact judge
// prompt and a verdict skeleton, and the host model fills the skeleton and lands it as a verdict. It is
// SIDE-EFFECT-FREE — it only reads and prints; writing the verdict is the agent's compose-not-commit act
// (ring 0021's "the genome composes, a host performs the outward act"). So, unlike the pure envelope
// gate (validate-judgments, in run-all), this is not a gate — but it reads no clock and writes nothing,
// so its verification (LAW-6) is simply that a `prepare` leaves the tree byte-identical (the cut-release
// / graft / feedback dry-run shape).
//
// Verbs:
//   prepare <artifact> [--rubric <name>] [--source <path>] [--json]
//                                  assemble the pinned prompt + verdict skeleton for a judgment. Default
//                                  rubric: faithfulness (the only one in v0's registry).
//   list                           list the recorded verdicts with their freshness (a read-only view).
//
// Exit: 0 ok; 1 the judgment cannot be assembled (unknown rubric, absent artifact/source); 2 usage.
import { relative, resolve } from 'node:path';
import { REPO_ROOT, toPosix } from '../lib/repo.ts';
import {
  RUBRICS,
  nextJudgmentNumber,
  pinnedInputs,
  readVerdicts,
  renderJudgePrompt,
  renderVerdictSkeleton,
  staleness,
} from '../lib/judge.ts';

const VERBS = ['prepare', 'list'] as const;

function usage(message: string): never {
  console.error(`judge: ${message}`);
  console.error(`usage: node .seed/checks/judge.ts <verb> [args]   verbs: ${VERBS.join(' | ')}`);
  console.error('  prepare <artifact> [--rubric <name>] [--source <path>] [--json]   assemble the pinned judge prompt + verdict skeleton');
  console.error('  list [--json]                                                     the recorded verdicts and their freshness');
  console.error(`  rubrics: ${RUBRICS.map((r) => `${r.name} v${r.version}`).join(', ')}`);
  process.exit(2);
}

function flagValue(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const v = args[i + 1];
  if (v === undefined || v.startsWith('--')) usage(`${name} needs a value`);
  return v;
}

const VALUE_FLAGS = new Set(['--rubric', '--source']);

/** The single positional (an artifact path), repo-relative. Rejects a second positional. */
function positional(args: string[]): string | undefined {
  const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && VALUE_FLAGS.has(args[i - 1])));
  if (pos.length > 1) usage(`expected at most one artifact path, got ${pos.length}`);
  return pos[0];
}

/** Resolve a path given on the command line (absolute or cwd-relative) to a repo-relative posix path —
 *  so `prepare docs/references/x.md` works from the repo root, the natural invocation. */
function toRepoRel(p: string): string {
  return toPosix(relative(REPO_ROOT, resolve(process.cwd(), p)));
}

function prepare(args: string[], json: boolean): never {
  const artifactArg = positional(args);
  if (artifactArg === undefined) usage('prepare needs an <artifact> path (the thing to judge)');
  const artifact = toRepoRel(artifactArg);
  const rubricName = flagValue(args, '--rubric') ?? 'faithfulness';
  const sourceArg = flagValue(args, '--source');
  const source = sourceArg === undefined ? null : toRepoRel(sourceArg);

  let inputs;
  try {
    inputs = pinnedInputs(artifact, rubricName, source, REPO_ROOT);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (json) console.log(JSON.stringify({ verb: 'prepare', ok: false, reason: msg }));
    else console.error(`judge: ${msg}`);
    process.exit(1);
  }

  const number = nextJudgmentNumber(REPO_ROOT);
  const prompt = renderJudgePrompt(inputs, REPO_ROOT);
  const skeleton = renderVerdictSkeleton(number, inputs, REPO_ROOT);

  if (json) {
    console.log(
      JSON.stringify({
        verb: 'prepare',
        ok: true,
        artifact: inputs.artifactPath,
        artifactPin: inputs.artifactPin,
        rubric: `${inputs.rubric.name} v${inputs.rubric.version}`,
        source: inputs.source ? inputs.source.path : null,
        sourcePin: inputs.source ? inputs.source.pin : null,
        number,
        prompt,
        skeleton,
      }),
    );
    process.exit(0);
  }

  console.log('judge — prepare (LAW-6: the seed composes the pinned inputs; the host model judges)\n');
  console.log(`Artifact: ${inputs.artifactPath} (pinned ${inputs.artifactPin})`);
  console.log(`Rubric:   ${inputs.rubric.name} v${inputs.rubric.version}`);
  console.log(`Source:   ${inputs.source ? `${inputs.source.path} (pinned ${inputs.source.pin})` : 'external (not mirrored in-repo, ring 0024)'}`);
  console.log(`Next verdict: ${nextVerdictPath(number)}\n`);
  console.log('─── judge prompt (give this to the model) ─────────────────────────────────────\n');
  console.log(prompt);
  console.log(`─── verdict skeleton (fill Score + Rationale, land at ${nextVerdictPath(number)}) ───\n`);
  console.log(skeleton);
  console.log('The verdict is a PROPOSAL — compose it, do not commit it on your own authority; the Gardener ratifies (SEED.md §5).');
  process.exit(0);
}

function nextVerdictPath(number: string): string {
  return `docs/judgments/${number}-<slug>.md`;
}

function list(json: boolean): never {
  const verdicts = readVerdicts(REPO_ROOT).map((v) => {
    const s = staleness(v, REPO_ROOT);
    return {
      number: v.number,
      file: v.file,
      rubric: v.rubricName && v.rubricVersion ? `${v.rubricName} v${v.rubricVersion}` : null,
      artifact: v.artifactPath,
      score: v.score !== null && v.scoreMax !== null ? `${v.score}/${v.scoreMax}` : null,
      date: v.date,
      model: v.model,
      fresh: !s.stale,
      staleReason: s.reason,
    };
  });
  if (json) {
    console.log(JSON.stringify({ verb: 'list', ok: true, verdicts }));
    process.exit(0);
  }
  console.log('judge — list (the recorded verdicts; the dated, scored files are the trend record, LAW-9)\n');
  if (verdicts.length === 0) {
    console.log('No verdicts yet. Assemble one with `node .seed/checks/judge.ts prepare <artifact>`.');
    process.exit(0);
  }
  for (const v of verdicts) {
    console.log(`  ${v.number}  ${v.fresh ? 'fresh' : 'STALE'}  ${v.score ?? '?'}  ${v.rubric ?? '?'}  ${v.artifact ?? '?'}  (${v.date ?? 'undated'}, ${v.model ?? 'no model'})`);
    if (!v.fresh) console.log(`        ↳ ${v.staleReason}`);
  }
  process.exit(0);
}

function main(): void {
  const argv = process.argv.slice(2);
  const verb = argv[0];
  const rest = argv.slice(1);
  const json = rest.includes('--json');
  const args = rest.filter((a) => a !== '--json');

  switch (verb) {
    case 'prepare':
      prepare(args, json);
      break;
    case 'list':
      list(json);
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
  console.error(`judge: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
}
