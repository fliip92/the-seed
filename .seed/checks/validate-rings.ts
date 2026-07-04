// Enforces the ring format of SEED.md §2 and docs/rings/README.md: sequential numbering,
// matching titles, and every required field present. Rings are how questions stay retired
// (LAW-10).
import { readRepoFile, findSequenceIssues } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const LAW = 'LAW-10 — escalate scarce judgment; never ask twice';
const ID = 'seed/validate-rings';
const DIR = 'docs/rings';
const FILENAME_RE = /^(\d{4})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

const REQUIRED_FIELDS: Array<{ re: RegExp; name: string; hint: string }> = [
  { re: /^- Date: \d{4}-\d{2}-\d{2}\s*$/m, name: 'Date', hint: '`- Date: YYYY-MM-DD`' },
  { re: /^- Stage: .+/m, name: 'Stage', hint: '`- Stage: <stage number — name>`' },
  { re: /^- Raised-by: (gardener|seed)\b/m, name: 'Raised-by', hint: '`- Raised-by: gardener` or `- Raised-by: seed`' },
  { re: /^- Question: .+/m, name: 'Question', hint: '`- Question: <what was ambiguous>`' },
  { re: /^- Decision:/m, name: 'Decision', hint: '`- Decision: <what was decided>` (sub-bullets allowed)' },
  { re: /^- Alternatives considered:/m, name: 'Alternatives considered', hint: '`- Alternatives considered: <and why rejected>`' },
  { re: /^- Enforcement: .+/m, name: 'Enforcement', hint: '`- Enforcement: lint | structural test | CI gate | doc-only (justify why not mechanical)`' },
  { re: /^- Revisit-when: .+/m, name: 'Revisit-when', hint: '`- Revisit-when: <the condition that reopens this>`' },
];

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const violations: Violation[] = [];
    const ringFiles = files
      .filter((f) => f.startsWith(DIR + '/') && f !== `${DIR}/README.md`)
      .sort();

    const numbers: number[] = [];
    for (const file of ringFiles) {
      const base = file.slice(DIR.length + 1);
      const nameMatch = base.match(FILENAME_RE);
      if (!nameMatch) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} does not match the ring filename format NNNN-slug.md`,
          fix: 'rename to a four-digit sequential number plus a lowercase-kebab slug, e.g. 0003-license-choice.md — format in docs/rings/README.md.',
        });
        continue;
      }
      const num = Number(nameMatch[1]);
      numbers.push(num);

      const content = readRepoFile(file);
      const title = content.split('\n').find((l) => l.trim() !== '') ?? '';
      const titleMatch = title.match(/^# Ring (\d{4}) — .+/);
      if (!titleMatch) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} first line is not a valid ring title: ${JSON.stringify(title)}`,
          fix: 'start the file with `# Ring NNNN — <title>` (em dash), NNNN matching the filename — format in docs/rings/README.md.',
        });
      } else if (Number(titleMatch[1]) !== num) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} title number ${titleMatch[1]} does not match filename number ${nameMatch[1]}`,
          fix: 'make the title number and filename number agree — rings are cited as `Ring NNNN`; an ambiguous citation retires nothing.',
        });
      }

      for (const field of REQUIRED_FIELDS) {
        if (!field.re.test(content)) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} is missing or malforms required field: ${field.name}`,
            fix: `add ${field.hint} — full format in docs/rings/README.md. A ring missing fields retires its question only partially, so it will get asked again.`,
          });
        }
      }

      // The Enforcement field must name its mechanism, not just say something. The
      // field spans from its bullet to the next top-level bullet (sub-bullets and
      // wrapped lines included).
      const contentLines = content.split('\n');
      const enfStart = contentLines.findIndex((l) => l.startsWith('- Enforcement:'));
      if (enfStart !== -1) {
        let fieldEnd = enfStart + 1;
        while (fieldEnd < contentLines.length && !/^- \S/.test(contentLines[fieldEnd])) fieldEnd++;
        const fieldText = contentLines.slice(enfStart, fieldEnd).join('\n');
        if (!/(lint|structural test|structural|CI gate|doc-only)/i.test(fieldText)) {
          violations.push({
            check: ID,
            law: 'LAW-2 — legible and enforceable, or it doesn\'t exist',
            problem: `${file} Enforcement field names no mechanism: ${JSON.stringify(contentLines[enfStart])}`,
            fix: 'state the mechanism: lint | structural test | CI gate | doc-only (doc-only must justify why not mechanical).',
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
              problem: `duplicate ring number ${n}: two rings claim the same citation`,
              fix: 'renumber one of them to the next free number (max+1). Rings are cited as `Ring NNNN`; an ambiguous citation retires nothing.',
            }
          : {
              check: ID,
              law: LAW,
              problem: `ring numbering gap: found ${n} where ${String(issue.expected).padStart(4, '0')} was expected (rings are sequential, no gaps)`,
              fix: `renumber ring ${n} to ${String(issue.expected).padStart(4, '0')}, or restore the missing ring. Rings are append-only: take max+1, never reuse or reorder.`,
            },
      );
    }

    return { summary: `${ringFiles.length} ring(s) valid`, violations };
  },
};
