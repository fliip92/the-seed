// Enforces LAW-5 (plans are first-class artifacts) and LAW-8 (entropy is paid
// continuously): plan files carry the sections a hand-off needs, numbering is sequential
// across active+completed, and every ledger entry is priced with a conversion path.
import { readRepoFile } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const ID = 'seed/validate-plans';
const PLAN_LAW = 'LAW-5 — plans are first-class artifacts';
const LEDGER_LAW = 'LAW-8 — entropy is paid continuously';
const PLAN_DIRS = ['docs/plans/active', 'docs/plans/completed'];
const LEDGER = 'docs/plans/entropy-ledger.md';
const FILENAME_RE = /^(\d{4})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

const REQUIRED_SECTIONS = ['## Goal', '## Progress log', '## Decision log', '## Next actions'];

const LEDGER_FIELDS: Array<{ re: RegExp; name: string; hint: string }> = [
  { re: /^- First observed: .+/m, name: 'First observed', hint: '`- First observed: <date, context>`' },
  { re: /^- Where: .+/m, name: 'Where', hint: '`- Where: <file/place the entropy lives>`' },
  { re: /^- Interest rate: (high|medium|low)\b/m, name: 'Interest rate', hint: '`- Interest rate: high | medium | low` (how fast it compounds if ignored)' },
  { re: /^- Price: .+/m, name: 'Price', hint: '`- Price: <estimated effort to convert>`' },
  { re: /^- Conversion path: .+/m, name: 'Conversion path', hint: '`- Conversion path: invariant | ring | deletion — and the concrete step`' },
];

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const violations: Violation[] = [];

    // --- plans ---
    const planFiles = files
      .filter(
        (f) =>
          PLAN_DIRS.some((d) => f.startsWith(d + '/')) && !f.endsWith('/README.md'),
      )
      .sort();

    const numbers: number[] = [];
    for (const file of planFiles) {
      const base = file.split('/').pop() as string;
      const nameMatch = base.match(FILENAME_RE);
      if (!nameMatch) {
        violations.push({
          check: ID,
          law: PLAN_LAW,
          problem: `${file} does not match the plan filename format NNNN-slug.md`,
          fix: 'rename to a four-digit number (sequential across active/ and completed/ combined) plus a lowercase-kebab slug — format in docs/plans/README.md.',
        });
        continue;
      }
      numbers.push(Number(nameMatch[1]));

      const content = readRepoFile(file);
      const title = content.split('\n').find((l) => l.trim() !== '') ?? '';
      const titleMatch = title.match(/^# Plan (\d{4}) — .+/);
      if (!titleMatch || Number(titleMatch[1]) !== Number(nameMatch[1])) {
        violations.push({
          check: ID,
          law: PLAN_LAW,
          problem: `${file} must start with \`# Plan ${nameMatch[1]} — <title>\` (found: ${JSON.stringify(title)})`,
          fix: 'fix the title line so the plan is citable by number — format in docs/plans/README.md.',
        });
      }
      if (!/^- Status: .+/m.test(content)) {
        violations.push({
          check: ID,
          law: PLAN_LAW,
          problem: `${file} has no \`- Status:\` line`,
          fix: 'add `- Status: active` / `- Status: blocked: <on what>` / `- Status: completed YYYY-MM-DD` near the top. The next agent decides what to do from this line.',
        });
      }
      for (const section of REQUIRED_SECTIONS) {
        if (!new RegExp(`^${section}\\s*$`, 'm').test(content)) {
          violations.push({
            check: ID,
            law: PLAN_LAW,
            problem: `${file} is missing required section: ${section}`,
            fix: `add a ${section} section — a plan without it is not a hand-off. Full format in docs/plans/README.md.`,
          });
        }
      }
    }

    numbers.sort((a, b) => a - b);
    numbers.forEach((n, i) => {
      const expected = i + 1;
      if (n !== expected && (i === 0 || numbers[i - 1] !== n)) {
        violations.push({
          check: ID,
          law: PLAN_LAW,
          problem: `plan numbering broken at ${String(n).padStart(4, '0')}: expected ${String(expected).padStart(4, '0')} (sequential across active/ and completed/ combined)`,
          fix: 'renumber the offending plan to the next free number across both directories.',
        });
      }
    });

    // --- entropy ledger ---
    let ledgerEntries = 0;
    if (files.includes(LEDGER)) {
      const content = readRepoFile(LEDGER);
      for (const heading of ['## Open', '## Paid']) {
        if (!new RegExp(`^${heading}\\s*$`, 'm').test(content)) {
          violations.push({
            check: ID,
            law: LEDGER_LAW,
            problem: `${LEDGER} is missing its \`${heading}\` section`,
            fix: `restore the ${heading} section — the ledger records both live debt and paid-off debt (digestion history).`,
          });
        }
      }

      const entryBlocks = content.split(/^## /m).slice(1);
      const entryNumbers: number[] = [];
      for (const block of entryBlocks) {
        const headingLine = block.split('\n')[0].trim();
        const m = headingLine.match(/^E-(\d{3}) — .+/);
        if (!m) {
          if (!/^E-/.test(headingLine)) continue; // "Open" / "Paid" structural headings
          violations.push({
            check: ID,
            law: LEDGER_LAW,
            problem: `${LEDGER} entry heading malformed: "## ${headingLine}"`,
            fix: 'use `## E-NNN — <short description>` (three digits, em dash) — format in docs/plans/README.md.',
          });
          continue;
        }
        ledgerEntries++;
        entryNumbers.push(Number(m[1]));
        for (const field of LEDGER_FIELDS) {
          if (!field.re.test(block)) {
            violations.push({
              check: ID,
              law: LEDGER_LAW,
              problem: `${LEDGER} entry E-${m[1]} is missing or malforms field: ${field.name}`,
              fix: `add ${field.hint}. Unpriced debt is not a ledger entry — it is just entropy with a name.`,
            });
          }
        }
      }
      entryNumbers.sort((a, b) => a - b);
      entryNumbers.forEach((n, i) => {
        if (n !== i + 1 && (i === 0 || entryNumbers[i - 1] !== n)) {
          violations.push({
            check: ID,
            law: LEDGER_LAW,
            problem: `ledger numbering broken at E-${String(n).padStart(3, '0')}: expected E-${String(i + 1).padStart(3, '0')} (sequential, no gaps or duplicates, across Open and Paid)`,
            fix: 'renumber the entry to the next free E-number; paid entries keep their numbers forever.',
          });
        }
      });
    }

    return {
      summary: `${planFiles.length} plan(s), ${ledgerEntries} ledger entr${ledgerEntries === 1 ? 'y' : 'ies'} valid`,
      violations,
    };
  },
};
