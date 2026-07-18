// The judge model — the SINGLE source of truth (LAW-3) for the seed's first INFERENTIAL control
// (E-013, ring 0030). Every other control in .seed/checks/ is a deterministic structural gate (a
// COMPUTATIONAL control); this instrument judges a behavioral property no structural gate can —
// whether an agent's synthesis stayed FAITHFUL to its source. The judgment itself is probabilistic
// (an LLM-as-judge), so the design is a DETERMINISTIC ENVELOPE around a PROBABILISTIC CORE: this
// module owns the envelope — the verdict schema, the rubric registry, content hashing, staleness, and
// the pinned-prompt renderers — and three organs read this one module so what a verdict IS cannot
// drift between them (the release.ts precedent):
//   - .seed/checks/validate-judgments.ts — gates the envelope in run-all (well-formed + pins resolve
//                                          + FRESH); the probabilistic score is never a gate (ring 0011)
//   - .seed/checks/judge.ts              — the CLI (`prepare`): assembles the pinned prompt, writes nothing
//   - skills/judge/SKILL.md              — the compose-not-commit loop the host model performs
//
// The seed carries NO LLM client, no secret, no network call: the model call is a HOST act outside the
// genome (ring 0021's "the genome composes, a host performs the outward act"; ring 0024's network-free
// intake), so the zero-dependency clause (ring 0002) and CI reproducibility hold and the instrument stays
// harness-portable (SEED.md §8). The only "dependency" here is node's own `createHash` — a builtin, not a
// third-party package. Every function is a pure function of the working tree (no clock, no network), the
// property that lets validate-judgments gate in run-all.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, posix } from 'node:path';
import { REPO_ROOT, readRepoFile, sectionBody } from './repo.ts';

export const JUDGMENTS_DIR = 'docs/judgments';

// The score scale, shared by every rubric (ring 0030): 1 = the artifact is unfaithful, 5 = fully
// faithful. Held here so the validator's range check and a rubric's prose cannot disagree.
export const SCORE_MIN = 1;
export const SCORE_MAX = 5;

// A content pin: a labeled sha256 prefix. 16 hex chars (64 bits) is ample to detect a STALE verdict —
// this is drift detection, not an adversarial setting — and short enough to read in a bullet. The label
// makes the pin self-describing in the artifact.
export const HASH_LABEL = 'sha256';
const HASH_LEN = 16;

/** The content pin for a string — `sha256:<16 hex>`. The single definition the renderer stamps and the
 *  validator recomputes, so a pin is compared against itself by construction. */
export function pin(content: string): string {
  return `${HASH_LABEL}:${createHash('sha256').update(content, 'utf8').digest('hex').slice(0, HASH_LEN)}`;
}

/** The content pin for a repo file, or null when it is absent (a dangling pin — the validator's concern). */
export function pinFile(repoRelPath: string, root: string = REPO_ROOT): string | null {
  const abs = join(root, repoRelPath);
  return existsSync(abs) ? pin(readFileSync(abs, 'utf8')) : null;
}

// --- the rubric registry (ring 0030). A rubric is portable method — every descendant judges the same
// --- standard — so each is a real, reachable file under the judge skill (skills/ is portable), and this
// --- registry is the single index the CLI and validator resolve a verdict's `Rubric: <name> v<version>`
// --- against. A second rubric (elicitation-completeness, PRD-fidelity) is a new entry here and needs no
// --- rework (ring 0030's Revisit-when).
export interface Rubric {
  name: string; // lowercase-kebab, the token a verdict pins
  version: number; // bumped when the rubric's criteria change, so a verdict pins WHICH rubric judged it
  path: string; // repo-relative path to the versioned rubric artifact (portable, under skills/judge/)
  title: string; // human title, for the assembled prompt
}

export const RUBRICS: Rubric[] = [
  {
    name: 'faithfulness',
    version: 1,
    path: 'skills/judge/rubrics/faithfulness.md',
    title: 'Faithfulness — did the artifact stay true to its source?',
  },
];

/** The registry entry for a name (+ optional version), or undefined when unknown — a verdict naming an
 *  unknown rubric or version is a dangling pin (validate-judgments). */
export function rubricFor(name: string, version?: number): Rubric | undefined {
  return RUBRICS.find((r) => r.name === name && (version === undefined || r.version === version));
}

// One parsed verdict (docs/judgments/NNNN-slug.md). Fields are nullable: parsing extracts what is
// present and the VALIDATOR decides what a violation is (the parseReleaseFile discipline), so a
// malformed verdict yields legible per-field violations rather than a crash.
export interface Verdict {
  file: string; // repo-relative
  number: string; // 4-digit, from the filename
  titleNumber: string | null; // the NNNN in the "# Judgment NNNN — …" title, for the match check
  rubricName: string | null;
  rubricVersion: number | null;
  artifactPath: string | null; // resolved repo-relative, from the Artifact line's link
  artifactPin: string | null; // the pinned content hash of the artifact at judgment time
  sourcePath: string | null; // resolved repo-relative when the source is in-repo, else null
  sourcePin: string | null; // the pinned source hash when in-repo, else null
  sourceExternal: boolean; // the Source line declared the source external (unpinnable, ring 0024)
  model: string | null; // the host model that judged — a recorded fact (LAW-9: a verdict names its judge)
  date: string | null; // YYYY-MM-DD, a recorded fact (ring 0020)
  score: number | null;
  scoreMax: number | null;
  rationale: string; // the ## Rationale body, trimmed
}

const TITLE_RE = /^# Judgment (\d{4})\b/;
const RUBRIC_RE = /^([a-z][a-z0-9-]*)\s+v(\d+)$/;
const SCORE_RE = /^(\d+)\s*\/\s*(\d+)$/;
const LINK_RE = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/;
const PIN_RE = new RegExp(`\\b${HASH_LABEL}:([0-9a-f]{8,64})\\b`, 'i');
const EXTERNAL_RE = /\bexternal\b/i;

/** Resolve a markdown link target written in `fromFile` to a repo-relative posix path (fragment
 *  stripped), the way extractLocalLinks does — so a verdict's Artifact/Source link resolves to the file
 *  it pins. `fromFile` is already a posix repo-relative path. */
function resolveLink(fromFile: string, rawTarget: string): string {
  const noFragment = rawTarget.split('#')[0];
  return noFragment.startsWith('/')
    ? posix.normalize(noFragment.slice(1))
    : posix.normalize(posix.join(posix.dirname(fromFile), noFragment));
}

/** Parse one verdict file's content. Pure (takes the text); the number comes from the filename. */
export function parseVerdict(file: string, number: string, content: string): Verdict {
  const lines = content.split('\n');
  const field = (name: string): string | null => {
    const m = content.match(new RegExp(`^- ${name}:\\s*(.+?)\\s*$`, 'm'));
    return m ? m[1] : null;
  };

  const titleLine = lines.find((l) => l.trim() !== '') ?? '';
  const titleNumber = titleLine.match(TITLE_RE)?.[1] ?? null;

  const rubricRaw = field('Rubric') ?? '';
  const rubricMatch = rubricRaw.match(RUBRIC_RE);
  const rubricName = rubricMatch ? rubricMatch[1] : null;
  const rubricVersion = rubricMatch ? Number(rubricMatch[2]) : null;

  const artifactRaw = field('Artifact') ?? '';
  const artifactLink = artifactRaw.match(LINK_RE)?.[1];
  const artifactPath = artifactLink ? resolveLink(file, artifactLink) : null;
  const artifactPin = artifactRaw.match(PIN_RE)?.[0].toLowerCase() ?? null;

  const sourceRaw = field('Source') ?? '';
  const sourceLink = sourceRaw.match(LINK_RE)?.[1];
  const sourcePath = sourceLink ? resolveLink(file, sourceLink) : null;
  const sourcePin = sourceRaw.match(PIN_RE)?.[0].toLowerCase() ?? null;
  // "external" with no in-repo link is a legitimate, honest source declaration (the ring-0024 boundary:
  // an external corpus is not mirrored, so it cannot be pinned) — distinct from a Source line that is
  // simply missing, which the validator flags.
  const sourceExternal = sourceLink === undefined && EXTERNAL_RE.test(sourceRaw);

  const scoreRaw = field('Score') ?? '';
  const scoreMatch = scoreRaw.match(SCORE_RE);
  const score = scoreMatch ? Number(scoreMatch[1]) : null;
  const scoreMax = scoreMatch ? Number(scoreMatch[2]) : null;

  const rationaleBody = sectionBody(lines, '## Rationale');
  const rationale = (rationaleBody ?? []).join('\n').trim();

  return {
    file,
    number,
    titleNumber,
    rubricName,
    rubricVersion,
    artifactPath,
    artifactPin,
    sourcePath,
    sourcePin,
    sourceExternal,
    model: field('Model'),
    date: field('Date'),
    score,
    scoreMax,
    rationale,
  };
}

/** Every verdict under `root`, sorted ascending by number. Empty when the organ holds only its README
 *  (the enforced-when-present discipline of the sibling validators). */
export function readVerdicts(root: string = REPO_ROOT): Verdict[] {
  const dir = join(root, JUDGMENTS_DIR);
  if (!existsSync(dir)) return [];
  const verdicts: Verdict[] = [];
  for (const name of readdirSync(dir)) {
    const m = name.match(/^(\d{4})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/);
    if (!m) continue; // README.md and anything unnumbered is not a verdict
    verdicts.push(parseVerdict(`${JUDGMENTS_DIR}/${name}`, m[1], readFileSync(join(dir, name), 'utf8')));
  }
  return verdicts.sort((a, b) => Number(a.number) - Number(b.number));
}

export interface Staleness {
  stale: boolean;
  reason: string | null; // legible reason when stale (an artifact/source edited after judgment), else null
}

/** Whether a verdict's pins still match the current content — the deterministic teeth of the envelope.
 *  A verdict whose pinned artifact hash no longer equals the artifact's current hash is STALE: the thing
 *  it judged has changed, so the probabilistic verdict is trust taken on faith until re-judged (LAW-6).
 *  A dangling pin (artifact/source absent) is NOT staleness — it is a resolve failure the validator
 *  reports separately; here it simply cannot be fresh. */
export function staleness(v: Verdict, root: string = REPO_ROOT): Staleness {
  if (v.artifactPath && v.artifactPin) {
    const current = pinFile(v.artifactPath, root);
    if (current !== null && current !== v.artifactPin) {
      return { stale: true, reason: `${v.artifactPath} changed since it was judged (pinned ${v.artifactPin}, now ${current})` };
    }
  }
  if (v.sourcePath && v.sourcePin) {
    const current = pinFile(v.sourcePath, root);
    if (current !== null && current !== v.sourcePin) {
      return { stale: true, reason: `${v.sourcePath} (the source) changed since the artifact was judged against it (pinned ${v.sourcePin}, now ${current})` };
    }
  }
  return { stale: false, reason: null };
}

/** The next free judgment number under `root` (max + 1, 4-digit) — numbered like rings/assessments. */
export function nextJudgmentNumber(root: string = REPO_ROOT): string {
  const max = readVerdicts(root).reduce((hi, v) => Math.max(hi, Number(v.number)), 0);
  return String(max + 1).padStart(4, '0');
}

// --- rendering: the single source for the pinned PROMPT the host model judges, and the verdict
// --- SKELETON it fills — so the CLI and the self-tests agree on the exact bytes, and a verdict the
// --- skeleton produced validates by construction. ---

export interface PinnedInputs {
  rubric: Rubric;
  artifactPath: string;
  artifactContent: string;
  artifactPin: string;
  source: { path: string; content: string; pin: string } | null; // in-repo source, or null (external)
}

/** Assemble the pinned inputs for a judgment, or throw a legible reason it cannot be assembled (an
 *  unknown rubric, an absent artifact or rubric file, an absent named source). Pure over the tree. */
export function pinnedInputs(
  artifactPath: string,
  rubricName: string,
  sourcePath: string | null,
  root: string = REPO_ROOT,
): PinnedInputs {
  const rubric = rubricFor(rubricName);
  if (!rubric) throw new Error(`unknown rubric "${rubricName}" — known rubrics: ${RUBRICS.map((r) => `${r.name} v${r.version}`).join(', ')} (ring 0030; add one to the registry in .seed/lib/judge.ts).`);
  if (!existsSync(join(root, rubric.path))) throw new Error(`rubric file missing: ${rubric.path}`);
  if (!existsSync(join(root, artifactPath))) throw new Error(`artifact to judge does not exist: ${artifactPath}`);
  const artifactContent = readRepoFile(artifactPath, root);
  let source: PinnedInputs['source'] = null;
  if (sourcePath) {
    if (!existsSync(join(root, sourcePath))) throw new Error(`source does not exist: ${sourcePath}`);
    const content = readRepoFile(sourcePath, root);
    source = { path: sourcePath, content, pin: pin(content) };
  }
  return { rubric, artifactPath, artifactContent, artifactPin: pin(artifactContent), source };
}

/** The judge prompt: rubric + the pinned artifact (and its in-repo source, when present) + the output
 *  instruction. The host model reads ONLY what is embedded here — a fresh, rubric-scoped judgment blind
 *  to how the artifact was composed (ring 0030). Deterministic bytes from the tree. */
export function renderJudgePrompt(inputs: PinnedInputs, root: string = REPO_ROOT): string {
  const rubricText = readRepoFile(inputs.rubric.path, root);
  const lines: string[] = [
    `# Judge task — ${inputs.rubric.title} (rubric ${inputs.rubric.name} v${inputs.rubric.version})`,
    '',
    'You are an INFERENTIAL control (ring 0030). Judge ONLY from the material embedded below — the',
    'rubric, the artifact, and (when present) its source. Do not use outside knowledge, and do not',
    'consider how the artifact was written; you were handed a fixed, minimal input set on purpose. Score',
    `the artifact against the rubric on the ${SCORE_MIN}–${SCORE_MAX} scale and justify the score`,
    'concretely, citing the specific claims that earned or lost points.',
    '',
    '## Rubric',
    '',
    rubricText.trim(),
    '',
    `## Artifact under judgment — ${inputs.artifactPath} (pinned ${inputs.artifactPin})`,
    '',
    '````````',
    inputs.artifactContent.trim(),
    '````````',
    '',
  ];
  if (inputs.source) {
    lines.push(
      `## Source the artifact must stay faithful to — ${inputs.source.path} (pinned ${inputs.source.pin})`,
      '',
      '````````',
      inputs.source.content.trim(),
      '````````',
      '',
    );
  } else {
    lines.push(
      '## Source',
      '',
      'The source is EXTERNAL — not mirrored in the repository (the network-free boundary, ring 0024). Judge',
      'faithfulness on what is checkable without the source in hand: whether the artifact over-claims beyond',
      'the framings it itself cites, whether its grounded/inference split is honest, and its internal',
      'consistency. If the host has the external source in context, judge against it and say so.',
      '',
    );
  }
  lines.push(
    '## Output',
    '',
    `Emit a verdict file for ${JUDGMENTS_DIR}/ in EXACTLY the skeleton you were given (\`npm run judge`,
    'prepare\` printed it): fill the Score and the ## Rationale, leave the pins and paths untouched. The',
    'verdict is a PROPOSAL — compose it, do not commit it on your own authority; the Gardener ratifies',
    '(grounded-or-ask, SEED.md §5).',
  );
  return lines.join('\n') + '\n';
}

/** The verdict skeleton — the exact file the host model fills and lands in docs/judgments/. Pins and
 *  paths are precomputed (so a filled skeleton validates by construction); Score and Rationale are the
 *  two blanks. `<slug>` names the file docs/judgments/NNNN-<slug>.md. */
export function renderVerdictSkeleton(number: string, inputs: PinnedInputs, root: string = REPO_ROOT): string {
  const rel = (p: string): string => posix.relative(JUDGMENTS_DIR, p);
  const artifactLink = `[${inputs.artifactPath}](${rel(inputs.artifactPath)})`;
  const sourceField = inputs.source
    ? `[${inputs.source.path}](${rel(inputs.source.path)}) — content ${inputs.source.pin}`
    : 'external — not mirrored in-repo, so unpinnable (ring 0024)';
  return (
    [
      `# Judgment ${number} — ${inputs.rubric.name} of ${inputs.artifactPath}`,
      '',
      `- Rubric: ${inputs.rubric.name} v${inputs.rubric.version}`,
      `- Artifact: ${artifactLink} — content ${inputs.artifactPin}`,
      `- Source: ${sourceField}`,
      '- Model: <the model id that judged, e.g. claude-opus-4-8 — a recorded fact>',
      '- Date: <YYYY-MM-DD — a recorded fact>',
      `- Score: <${SCORE_MIN}-${SCORE_MAX}> / ${SCORE_MAX}`,
      '',
      '## Rationale',
      '',
      '<Concrete justification: which claims earned or lost points against the rubric. This is the',
      'inferential verdict — the one thing the machinery cannot compute (E-013); make it legible.>',
    ].join('\n') + '\n'
  );
}
