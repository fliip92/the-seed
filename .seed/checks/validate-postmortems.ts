// Enforces the postmortem-entry format the postmortem skill
// (skills/postmortem/SKILL.md) produces: a failure yields three artifacts, never one — the
// fix, the invariant that prevents recurrence, and the ring recording the decision trail
// (SEED.md §4, Stage 2). "When something fails, the fix is never 'try harder' — it is always
// a missing capability, made legible and made enforceable" (LAW-2). So this binds every
// entry to link ALL THREE: the Fix links the change that resolved it, the Invariant names a
// real enforcement mechanism AND links the artifact that enforces it (not resolve to prose),
// and the Ring links an existing ring. A half-metabolized failure — a fix with no invariant,
// an invariant that is only a promise to be careful, a decision with no trail — cannot pass.
// Ring 0017.
//
// Vacuous while docs/postmortems/ holds only its README (the docs/architecture/ and
// docs/principles/ pattern): the format is defined and enforced-when-present, binding the
// moment the skill lands a postmortem. Entries are numbered NNNN-slug.md — a postmortem is a
// dated incident in a sequential record, like a ring — indexed by the README.
import { readRepoFile, extractLocalLinks, findSequenceIssues } from '../lib/repo.ts';
import type { Check, CheckResult, Violation, MdLink } from '../lib/repo.ts';

const LAW = 'LAW-2 — legible and enforceable, or it doesn\'t exist';
const ID = 'seed/validate-postmortems';
const DIR = 'docs/postmortems';
const FILENAME_RE = /^(\d{4})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

// The six required fields. Date/Stage/Failure are narrative (presence-checked); Fix,
// Invariant, and Ring are the three artifacts whose linkage is the whole point of the
// discipline (SEED.md §4: "three artifacts, never one").
const REQUIRED_FIELDS = ['Date', 'Stage', 'Failure', 'Fix', 'Invariant', 'Ring'] as const;
const DATE_RE = /^- Date: \d{4}-\d{2}-\d{2}\s*$/;

// The enforcement-mechanism vocabulary, identical to validate-architecture (and stricter than
// validate-rings, which also accepts bare `structural`): an enforcement clause naming none of
// these is a wish, not an invariant (LAW-2). Bare `structural` is omitted deliberately (see
// validate-architecture.ts) — `structural test` is the mechanism; `structural` alone waves
// prose through.
const MECHANISM_RE = /(lint|structural test|CI gate|doc-only)/i;

// An inline markdown link, stripped from the Enforcement clause before the mechanism test.
// The clause is followed by the enforcing-artifact link (README format), so a mechanism word
// in the link *text* — the natural `[the dep-direction lint](...)` phrasing — must NOT satisfy
// the requirement; the mechanism has to be named in the Enforcement prose itself.
const MD_LINK_RE = /\[[^\]]*\]\([^)]*\)/g;

// A ring the decision trail must point at: an existing docs/rings/NNNN-slug.md file. A link
// that merely looks like prose, or points elsewhere, does not record a decision trail.
const RING_TARGET_RE = /^docs\/rings\/\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

interface FieldRange {
  start: number; // 1-based line of the `- Field:` bullet
  end: number;   // 1-based line just past the field (exclusive): next top-level bullet / `## ` / EOF
}

/** First occurrence of each required top-level `- Field:` bullet, spanning to the next
 *  top-level bullet or `## ` heading (wrapped lines and sub-bullets folded in) — mirrors how
 *  validate-rings reads the Enforcement field and validate-architecture reads a rule. */
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

const linksInField = (links: MdLink[], range: FieldRange): MdLink[] =>
  links.filter((l) => l.line >= range.start && l.line < range.end);

const fieldText = (lines: string[], range: FieldRange): string =>
  lines.slice(range.start - 1, range.end - 1).join('\n');

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const violations: Violation[] = [];
    const present = new Set(files);
    const docs = files
      .filter((f) => f.startsWith(DIR + '/') && f !== `${DIR}/README.md`)
      .sort();

    const numbers: number[] = [];
    for (const file of docs) {
      const base = file.slice(DIR.length + 1);
      const nameMatch = base.match(FILENAME_RE);
      if (!nameMatch) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} does not match the postmortem filename format NNNN-slug.md`,
          fix: 'rename to a four-digit sequential number plus a lowercase-kebab slug, e.g. 0001-stale-stage-reference.md — format in docs/postmortems/README.md.',
        });
        continue;
      }
      const num = Number(nameMatch[1]);
      numbers.push(num);

      const content = readRepoFile(file);
      const lines = content.split('\n');

      const title = lines.find((l) => l.trim() !== '') ?? '';
      const titleMatch = title.match(/^# Postmortem (\d{4}) — .+/);
      if (!titleMatch) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} first line is not a valid postmortem title: ${JSON.stringify(title)}`,
          fix: 'start the file with `# Postmortem NNNN — <title>` (em dash), NNNN matching the filename — format in docs/postmortems/README.md.',
        });
      } else if (Number(titleMatch[1]) !== num) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} title number ${titleMatch[1]} does not match filename number ${nameMatch[1]}`,
          fix: 'make the title number and filename number agree — a postmortem is cited as `postmortem NNNN`; an ambiguous citation records nothing.',
        });
      }

      const ranges = fieldRanges(lines);
      for (const name of REQUIRED_FIELDS) {
        if (!ranges.has(name)) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} is missing required field: ${name}`,
            fix: `add a \`- ${name}:\` bullet — full format in docs/postmortems/README.md. A postmortem missing a field is a failure only partly metabolized (SEED.md §4).`,
          });
        }
      }

      const dateRange = ranges.get('Date');
      if (dateRange && !DATE_RE.test(lines[dateRange.start - 1])) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} Date field is not a YYYY-MM-DD date: ${JSON.stringify(lines[dateRange.start - 1])}`,
          fix: 'write `- Date: YYYY-MM-DD` — a dated record is legible history (SEED.md §2).',
        });
      }

      const links = extractLocalLinks(file);

      // Fix — the change that resolved the failure — must be linked. The fix is a repo
      // artifact (the changed file, or the plan/ring that carried it); an external URL the
      // link parser cannot see does not count (validate-map forbids the forms it cannot follow).
      const fixRange = ranges.get('Fix');
      if (fixRange && linksInField(links, fixRange).length === 0) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} Fix field links no fix`,
          fix: 'link the fix — the changed artifact, or the plan/ring that carried it — as a `[text](relative/path)` link. A failure yields the fix as one of its three artifacts (SEED.md §4).',
        });
      }

      // Invariant — the rule that prevents recurrence — must name a real enforcement mechanism
      // in an `Enforcement:` clause AND link the artifact that enforces it. This is the sharp
      // LAW-2 point: an "invariant" that is only prose ("we will be careful") is exactly the
      // "try harder" non-fix the seed exists to kill. Mirrors validate-architecture's rule check.
      const invRange = ranges.get('Invariant');
      if (invRange) {
        const text = fieldText(lines, invRange);
        const enf = text.match(/Enforcement:\s*([\s\S]*)$/i);
        if (!enf) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} Invariant does not name an enforcement`,
            fix: 'append `— Enforcement: <lint | structural test | CI gate | doc-only (justify why not mechanical)>` to the Invariant. A rule CI cannot verify is not enforceable, so it does not exist (LAW-2).',
          });
        } else if (!MECHANISM_RE.test(enf[1].replace(MD_LINK_RE, ''))) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} Invariant's enforcement names no mechanism`,
            fix: 'state a mechanism after `Enforcement:` — one of lint | structural test | CI gate | doc-only. An invariant with no mechanical enforcement is a promise to try harder (LAW-2), not a prevention.',
          });
        }
        if (linksInField(links, invRange).length === 0) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} Invariant links no enforcing artifact`,
            fix: 'link the artifact that enforces the invariant — the check, lint, principle, or self-test — as a `[text](relative/path)` link. The invariant is one of the failure\'s three artifacts (SEED.md §4).',
          });
        }
      }

      // Ring — the decision trail — must link an existing ring. A postmortem records the
      // "why" of the fix and the invariant; that reasoning lives in a ring (LAW-10). A link
      // to no ring, or to a ring that does not exist, records no trail.
      const ringRange = ranges.get('Ring');
      if (ringRange) {
        const ringLinks = linksInField(links, ringRange).filter((l) => RING_TARGET_RE.test(l.target));
        if (!ringLinks.some((l) => present.has(l.target))) {
          const hasShape = ringLinks.length > 0;
          violations.push({
            check: ID,
            law: LAW,
            problem: hasShape
              ? `${file} Ring field links a ring that does not exist: ${ringLinks.map((l) => l.raw).join(', ')}`
              : `${file} Ring field links no ring`,
            fix: 'link the ring recording the decision trail as `[ring NNNN](../rings/NNNN-slug.md)`, pointing at an existing ring. A failure yields its decision trail as one of its three artifacts (SEED.md §4, LAW-10).',
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
              problem: `duplicate postmortem number ${n}: two postmortems claim the same citation`,
              fix: 'renumber one of them to the next free number (max+1). A postmortem is cited as `postmortem NNNN`; an ambiguous citation records nothing.',
            }
          : {
              check: ID,
              law: LAW,
              problem: `postmortem numbering gap: found ${n} where ${String(issue.expected).padStart(4, '0')} was expected (postmortems are sequential, no gaps)`,
              fix: `renumber postmortem ${n} to ${String(issue.expected).padStart(4, '0')}, or restore the missing one. Postmortems are a sequential record: take max+1, never reuse or skip.`,
            },
      );
    }

    return { summary: `${docs.length} postmortem(s) valid`, violations };
  },
};
