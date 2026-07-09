// Enforces the golden-principle format SEED.md §2 defines and docs/principles/README.md
// renders: a principle states its Statement, its Rationale, its ENFORCEMENT, and its allowed
// Exceptions. "A principle without an enforcement line is itself entropy" (LAW-2, SEED.md §2) —
// and a principle naming a mechanism whose enforcer does not exist is worse: a principle IS the
// numerator of `enforcement_ratio` (SEED.md §6), so a phantom enforcer inflates that fitness
// reading with a claim CI cannot back. So this binds every docs/principles/*.md to (1) the four
// fields, and (2) an Enforcement clause that names a mechanism from the ring vocabulary AND links
// an enforcing artifact that EXISTS in the tree — the validate-postmortems Invariant discipline
// (name a mechanism + link its enforcer), applied to the principle itself. The organ's own README
// routes "cannot enforce it yet" to the entropy ledger, so a principle here is mechanically
// anchored taste, never a wish. Plan 0004 scope item 1; the seed's first principle is
// grounded-or-ask.
//
// Vacuous while docs/principles/ holds only its README (the docs/architecture / docs/postmortems /
// docs/assessments pattern): the format is defined and enforced-when-present, binding the moment
// the first principle lands. Principles live at docs/principles/<name>.md — one per principle,
// named not numbered (cited by name and by its enforcer, not a sequence position), indexed by the
// README, so there is no sequence check.
import { readRepoFile, extractLocalLinks } from '../lib/repo.ts';
import type { Check, CheckResult, Violation, MdLink } from '../lib/repo.ts';

const LAW = 'LAW-2 — legible and enforceable, or it doesn\'t exist';
const ID = 'seed/validate-principles';
const DIR = 'docs/principles';
const FILENAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

// The four fields of the §2 principle format. Statement/Rationale/Exceptions are narrative
// (presence-checked); Enforcement is the load-bearing one whose linkage is checked below.
const REQUIRED_FIELDS = ['Statement', 'Rationale', 'Enforcement', 'Exceptions'] as const;

// The enforcement-mechanism vocabulary, identical to validate-architecture and
// validate-postmortems (a single definition of what counts as a mechanism, LAW-3): a clause
// naming none of these is a wish, not an enforcement (LAW-2). Bare `structural` is omitted
// deliberately (see validate-architecture.ts) — `structural test` is the mechanism.
const MECHANISM_RE = /(lint|structural test|CI gate|doc-only)/i;

// An inline markdown link, stripped from the Enforcement clause before the mechanism test — so a
// mechanism word appearing only in a link's TEXT (the natural `[the dep lint](...)` phrasing) does
// NOT satisfy the requirement; the mechanism has to be named in the Enforcement prose itself. The
// same teeth validate-postmortems and validate-assessments apply.
const MD_LINK_RE = /\[[^\]]*\]\([^)]*\)/g;

interface FieldRange {
  start: number; // 1-based line of the `- Field:` bullet
  end: number;   // 1-based line just past the field (exclusive): next top-level bullet / `## ` / EOF
}

/** First occurrence of each required top-level `- Field:` bullet, spanning to the next top-level
 *  bullet or `## ` heading (wrapped lines folded in) — mirrors validate-postmortems' fieldRanges. */
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
      .filter((f) => f.startsWith(DIR + '/') && f !== `${DIR}/README.md` && f.endsWith('.md'))
      .sort();

    for (const file of docs) {
      const base = file.slice(DIR.length + 1);
      if (!FILENAME_RE.test(base)) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} does not match the principle filename format <name>.md`,
          fix: 'name a principle in lowercase-kebab, e.g. grounded-or-ask.md — a principle is cited by name; format in docs/principles/README.md.',
        });
        continue;
      }

      const content = readRepoFile(file);
      const lines = content.split('\n');

      const title = lines.find((l) => l.trim() !== '') ?? '';
      if (!/^# \S/.test(title)) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} first line is not a valid principle title: ${JSON.stringify(title)}`,
          fix: 'start the file with `# <principle name>` — one H1 naming the principle. Format in docs/principles/README.md.',
        });
      }

      const ranges = fieldRanges(lines);
      for (const name of REQUIRED_FIELDS) {
        if (!ranges.has(name)) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} is missing required field: ${name}`,
            fix: `add a \`- ${name}:\` bullet — a principle states its Statement, Rationale, Enforcement, and Exceptions (SEED.md §2). Full format in docs/principles/README.md.`,
          });
        }
      }

      // Enforcement is the load-bearing field: it must name a real enforcement mechanism in the
      // clause AND link the artifact that enforces it. This is the sharp LAW-2 point for a
      // principle — an Enforcement line that is only prose ("we will be careful"), or that names a
      // mechanism whose enforcer does not exist, would count toward `enforcement_ratio` (SEED.md
      // §6) as enforced while enforcing nothing. Mirrors validate-postmortems' Invariant check.
      const enfRange = ranges.get('Enforcement');
      if (enfRange) {
        const text = fieldText(lines, enfRange);
        const enf = text.match(/Enforcement:\s*([\s\S]*)$/i);
        const value = enf ? enf[1] : '';
        if (!MECHANISM_RE.test(value.replace(MD_LINK_RE, ''))) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} Enforcement names no mechanism`,
            fix: 'name a mechanism after `Enforcement:` — one of lint | structural test | CI gate | doc-only. A principle CI cannot verify is itself entropy (LAW-2, SEED.md §2); if you cannot enforce it yet, price it in the entropy ledger instead of stating it here.',
          });
        }
        const links = extractLocalLinks(file);
        const enfLinks = linksInField(links, enfRange);
        if (!enfLinks.some((l) => present.has(l.target))) {
          const hasLink = enfLinks.length > 0;
          violations.push({
            check: ID,
            law: LAW,
            problem: hasLink
              ? `${file} Enforcement links an enforcer that does not exist: ${enfLinks.map((l) => l.raw).join(', ')}`
              : `${file} Enforcement links no enforcer`,
            fix: 'link the artifact that enforces the principle — the check, lint, CI gate, or self-test — as a `[text](relative/path)` link pointing at a file that EXISTS. "Enforceable, or it doesn\'t exist" (LAW-2): a principle is the numerator of enforcement_ratio (SEED.md §6), so its enforcer must be real, not a phantom.',
          });
        }
      }
    }

    return { summary: `${docs.length} principle(s) valid`, violations };
  },
};
