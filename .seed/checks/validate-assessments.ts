// Enforces the assessment format the Stage 2 exit criterion produces (SEED.md §4, Stage 2):
// "assess a foreign repository without modifying it and produce a proposal its owners could
// judge ON EVIDENCE." An assessment is the artifact of exercising the two load-bearing organs
// end-to-end — the read-only repo-fitness Scout (SEED.md §4, Stage 4 step 1) and the
// grill-the-gardener architecture elicitation (step 2) — into a proposal (step 3). This check
// is what makes "evidence-judgeable proposal" legible and enforceable rather than prose
// (LAW-2): it binds every entry to (1) carry its Scout evidence — ALL SIX SEED.md §6 metrics,
// so the evidence cannot be cherry-picked; (2) convert every finding into exactly one of
// SEED.md §0's four products, so a finding is metabolized entropy, not free-form advice; (3)
// name the architecture questions it does NOT answer — the grill agenda — because you never
// guess a target's architecture, you elicit it (SEED.md §5); and (4) state the human/agent
// ownership split (the grill-the-gardener exit condition). Ring 0022.
//
// Vacuous while docs/assessments/ holds only its README (the docs/architecture/ and
// docs/postmortems/ pattern): the format is defined and enforced-when-present, binding the
// moment an assessment lands. Entries are numbered NNNN-slug.md — a dated assessment is an
// item in a sequential record, like a ring or a postmortem — indexed by the README.
import { readRepoFile, findSequenceIssues, sectionBody, topLevelBullets } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const LAW = 'LAW-2 — legible and enforceable, or it doesn\'t exist';
const ID = 'seed/validate-assessments';
const DIR = 'docs/assessments';
const FILENAME_RE = /^(\d{4})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

// Narrative fields (presence-checked) that anchor an assessment to its target and date.
const REQUIRED_FIELDS = ['Date', 'Target'] as const;
const DATE_RE = /^- Date: \d{4}-\d{2}-\d{2}\s*$/;

// The four sections that make a proposal judgeable on evidence. Scout is the read-only
// evidence; Findings are its conversion; Grill agenda is what the evidence could NOT settle;
// Ownership is the handoff. Missing any one leaves the proposal unjudgeable.
const REQUIRED_SECTIONS = ['## Scout', '## Findings', '## Grill agenda', '## Ownership'] as const;

// The six SEED.md §6 metric keys — the same set repo-fitness.ts reports (its METRIC_ORDER) and
// the fitness engine computes (FitnessMetrics). The Scout section must name every one, so a
// proposal carries the WHOLE read-only baseline (each metric computed or null-with-reason) and
// cannot present only the flattering readings. The §6 metric set is constitutional (changes
// only via a ring amending SEED.md §6), so pinning it here tracks a stable source.
const METRIC_KEYS = [
  'map_reachability',
  'enforcement_ratio',
  'drift_count',
  'plan_traceability',
  'escalation_rate',
  'ledger_trend',
] as const;

// SEED.md §0's four products: "every unit of detected entropy must be converted into exactly
// one of four products." A finding that names none is unmetabolized entropy (SEED.md §0), not
// a proposal step — the same closed-vocabulary discipline feedback.ts applies to a conversion.
// `priced[ -]debt` accepts the prose form and feedback.ts's hyphenated CLI form alike.
const PRODUCT_RE = /\b(invariant|ring|priced[ -]debt|deletion)\b/i;

// An inline markdown link, stripped from a finding's Product clause before the product test —
// so a product word appearing only in a link's TEXT (e.g. `[the drift ring](...)`) does not
// satisfy the requirement; the product must be named in the Product-clause prose itself. The
// same link-stripping validate-postmortems does for its enforcement-mechanism test.
const MD_LINK_RE = /\[[^\]]*\]\([^)]*\)/g;

interface FieldRange {
  start: number; // 1-based line of the `- Field:` bullet
  end: number;   // 1-based line just past the field (exclusive): next top-level bullet / `## ` / EOF
}

/** First occurrence of each required top-level `- Field:` bullet, spanning to the next
 *  top-level bullet or `## ` heading — mirrors validate-postmortems' fieldRanges. */
function fieldRanges(lines: string[]): Map<string, FieldRange> {
  const ranges = new Map<string, FieldRange>();
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^- ([A-Za-z-]+):/);
    if (!m || !REQUIRED_FIELDS.includes(m[1] as (typeof REQUIRED_FIELDS)[number])) continue;
    if (ranges.has(m[1])) continue; // a duplicate field bullet: the first defines the field
    let j = i + 1;
    while (j < lines.length && !/^- \S/.test(lines[j]) && !/^## /.test(lines[j])) j++;
    ranges.set(m[1], { start: i + 1, end: j + 1 });
  }
  return ranges;
}

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const violations: Violation[] = [];
    const docs = files
      .filter((f) => f.startsWith(DIR + '/') && f !== `${DIR}/README.md` && f.endsWith('.md'))
      .sort();

    const numbers: number[] = [];
    for (const file of docs) {
      const base = file.slice(DIR.length + 1);
      const nameMatch = base.match(FILENAME_RE);
      if (!nameMatch) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} does not match the assessment filename format NNNN-slug.md`,
          fix: 'rename to a four-digit sequential number plus a lowercase-kebab slug, e.g. 0001-acme-webapp.md — format in docs/assessments/README.md.',
        });
        continue;
      }
      const num = Number(nameMatch[1]);
      numbers.push(num);

      const content = readRepoFile(file);
      const lines = content.split('\n');

      const title = lines.find((l) => l.trim() !== '') ?? '';
      const titleMatch = title.match(/^# Assessment (\d{4}) — .+/);
      if (!titleMatch) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} first line is not a valid assessment title: ${JSON.stringify(title)}`,
          fix: 'start the file with `# Assessment NNNN — <target name>` (em dash), NNNN matching the filename — format in docs/assessments/README.md.',
        });
      } else if (Number(titleMatch[1]) !== num) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} title number ${titleMatch[1]} does not match filename number ${nameMatch[1]}`,
          fix: 'make the title number and filename number agree — an assessment is cited as `assessment NNNN`; an ambiguous citation records nothing.',
        });
      }

      const ranges = fieldRanges(lines);
      for (const name of REQUIRED_FIELDS) {
        if (!ranges.has(name)) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} is missing required field: ${name}`,
            fix: `add a \`- ${name}:\` bullet — full format in docs/assessments/README.md. An assessment names the target it scouted and the date it was taken.`,
          });
        }
      }

      const dateRange = ranges.get('Date');
      if (dateRange && !DATE_RE.test(lines[dateRange.start - 1])) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} Date field is not a YYYY-MM-DD date: ${JSON.stringify(lines[dateRange.start - 1])}`,
          fix: 'write `- Date: YYYY-MM-DD` — a fitness reading is a dated point in a trend (LAW-9); an undated Scout cannot be placed on one.',
        });
      }

      for (const heading of REQUIRED_SECTIONS) {
        if (sectionBody(lines, heading) === null) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} is missing required section: ${heading}`,
            fix: `add a \`${heading}\` section — an assessment needs Scout (the read-only §6 evidence), Findings (each converting to one of the four products), Grill agenda (the questions you do not guess), and Ownership (the human/agent split). Format in docs/assessments/README.md.`,
          });
        }
      }

      // Scout: the read-only evidence. It must name ALL SIX §6 metrics — a proposal judged
      // "on evidence" carries the whole baseline (each computed or null-with-reason), never a
      // cherry-picked subset. A metric that is null is not omitted: the null IS a finding
      // (repo-fitness's contract), so it belongs in the Scout too.
      const scoutBody = sectionBody(lines, '## Scout');
      if (scoutBody !== null) {
        const scoutText = scoutBody.join('\n');
        const missingMetrics = METRIC_KEYS.filter((k) => !scoutText.includes(k));
        if (missingMetrics.length > 0) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} ## Scout does not report every SEED.md §6 metric — missing: ${missingMetrics.join(', ')}`,
            fix: 'report all six §6 metrics in the Scout section, each by its key (map_reachability, enforcement_ratio, drift_count, plan_traceability, escalation_rate, ledger_trend). A null metric stays in — the null and its reason are the finding (repo-fitness). Paste the `npm run repo-fitness` report.',
          });
        }
      }

      // Findings: the conversion. At least one, and EVERY finding names one of SEED.md §0's
      // four products in its `Product:` clause. This is the load-bearing discipline — a
      // proposal is a set of four-products conversions of sensed entropy, not free-form
      // advice. Mirrors validate-architecture's per-rule enforcement check.
      const findingsBody = sectionBody(lines, '## Findings');
      if (findingsBody !== null) {
        const findings = topLevelBullets(findingsBody);
        if (findings.length === 0) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} ## Findings names no findings`,
            fix: 'state at least one finding as a `- <sensed entropy> — Product: <invariant | ring | priced debt | deletion> — <the conversion step>` bullet. A Scout with no findings converted is entropy sensed but not metabolized (SEED.md §0).',
          });
        }
        for (const finding of findings) {
          const firstLine = finding.split('\n')[0];
          const prod = finding.match(/Product:\s*([\s\S]*)$/i);
          if (!prod) {
            violations.push({
              check: ID,
              law: LAW,
              problem: `${file} finding does not name a product: ${JSON.stringify(firstLine)}`,
              fix: 'append `— Product: <invariant | ring | priced debt | deletion>` to the finding. Every unit of detected entropy converts into exactly one of the four products (SEED.md §0).',
            });
          } else if (!PRODUCT_RE.test(prod[1].replace(MD_LINK_RE, ''))) {
            violations.push({
              check: ID,
              law: LAW,
              problem: `${file} finding's Product clause names no product: ${JSON.stringify(firstLine)}`,
              fix: 'name one of the four products after `Product:` — invariant | ring | priced debt | deletion (SEED.md §0). A finding converting to none is unmetabolized entropy, not a proposal step.',
            });
          }
        }
      }

      // Grill agenda: what the evidence could not settle. At least one question — because a
      // target's architecture is elicited, never guessed (SEED.md §5). A proposal that names
      // the questions its owner must answer is honest about its own limits; one that silently
      // assumes the architecture has baked a guess into a recommendation.
      const grillBody = sectionBody(lines, '## Grill agenda');
      if (grillBody !== null && !grillBody.some((l) => l.includes('?'))) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} ## Grill agenda states no question`,
          fix: 'list at least one architecture question only the owner can answer, phrased as a question. You elicit a target architecture, you do not guess it (SEED.md §5); the grill agenda is the read-only Scout naming what it could not settle alone.',
        });
      }

      // Ownership: the handoff. Both sides named on SEPARATE top-level bullets — the
      // grill-the-gardener exit condition (SEED.md §4c). Identical rigor to
      // validate-architecture: scanning the section for two ubiquitous keywords is too weak,
      // so require two distinct bullets, one human, one agent.
      const ownershipBody = sectionBody(lines, '## Ownership');
      if (ownershipBody !== null) {
        const bullets = topLevelBullets(ownershipBody);
        const isHuman = (b: string): boolean => /\b(human|gardener|owner)s?\b/i.test(b);
        const isAgent = (b: string): boolean => /\b(agent|seed)s?\b/i.test(b);
        const humanIdx = bullets.findIndex(isHuman);
        const agentIdx = bullets.findIndex((b, i) => i !== humanIdx && isAgent(b));
        if (humanIdx === -1 || agentIdx === -1) {
          const anyHuman = bullets.some(isHuman);
          const anyAgent = bullets.some(isAgent);
          const missing =
            !anyHuman && !anyAgent
              ? 'the human/owner side and the agent/Seed side'
              : !anyHuman
                ? 'the human/owner side'
                : !anyAgent
                  ? 'the agent/Seed side'
                  : 'both sides on separate bullets (a single bullet mentioning both is not a split)';
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} ## Ownership does not name ${missing}`,
            fix: 'name both sides on separate bullets — e.g. `- Owner (human): intent, priorities, taste, gate approvals.` and `- Seed (agent): everything else.` The ownership split must be explicit (SEED.md §4c, §5); an unsplit proposal leaves the handoff ambiguous.',
          });
        }
      }
    }

    for (const issue of findSequenceIssues(numbers)) {
      const n = String(issue.number).padStart(4, '0');
      violations.push(
        issue.kind === 'duplicate'
          ? {
              check: ID,
              law: LAW,
              problem: `duplicate assessment number ${n}: two assessments claim the same citation`,
              fix: 'renumber one of them to the next free number (max+1). An assessment is cited as `assessment NNNN`; an ambiguous citation records nothing.',
            }
          : {
              check: ID,
              law: LAW,
              problem: `assessment numbering gap: found ${n} where ${String(issue.expected).padStart(4, '0')} was expected (assessments are sequential, no gaps)`,
              fix: `renumber assessment ${n} to ${String(issue.expected).padStart(4, '0')}, or restore the missing one. Assessments are a sequential record: take max+1, never reuse or skip.`,
            },
      );
    }

    return { summary: `${docs.length} assessment(s) valid`, violations };
  },
};
