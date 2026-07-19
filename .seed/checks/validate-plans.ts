// Enforces LAW-5 (plans are first-class artifacts) and LAW-8 (entropy is paid
// continuously): plan files carry the sections a hand-off needs, numbering is sequential
// across active+completed, and every ledger entry is priced with a conversion path.
import { readRepoFile, findSequenceIssues } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const ID = 'seed/validate-plans';
const PLAN_LAW = 'LAW-5 — plans are first-class artifacts';
const LEDGER_LAW = 'LAW-8 — entropy is paid continuously';
const PLANS_ROOT = 'docs/plans';
const ACTIVE = 'docs/plans/active';
const COMPLETED = 'docs/plans/completed';
const LEDGER = 'docs/plans/entropy-ledger.md';
const FILENAME_RE = /^(\d{4})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const STATUS_RE = /^- Status: (active|blocked: .+|completed \d{4}-\d{2}-\d{2})\s*$/m;
const DATED_ENTRY_RE = /^- \*\*(\d{4}-\d{2}-\d{2})\*\*/;

const REQUIRED_SECTIONS = ['## Goal', '## Progress log', '## Decision log', '## Next actions'];

// Work units (optional, ring 0036 / E-014): a plan MAY decompose into `### U<n> — <title>`
// units under a `## Work units` section, each self-contained enough for a fresh session or a
// parallel-worktrees agent to pick up cold. Validated only when the section is present, so a
// small single-session plan is unconstrained (the ring-0035 fire-only-when-present shape).
const WORK_UNITS = '## Work units';
const WORK_UNITS_RE = /^## Work units\s*$/m;
const UNIT_HEADING_RE = /^### (U\d+) — .+/;
const UNIT_STATUS_RE = /^- Status: (todo|done|in progress\b.*|blocked: .+)\s*$/m;
const UNIT_FIELDS: Array<{ re: RegExp; name: string; hint: string }> = [
  { re: /^- Scope: .+/m, name: 'Scope', hint: '`- Scope: <what this unit changes, bounded>`' },
  { re: /^- Entry-context: .+/m, name: 'Entry-context', hint: '`- Entry-context: <the exact files/rings/units to read to start cold, without re-deriving>`' },
  { re: /^- Done-when: .+/m, name: 'Done-when', hint: '`- Done-when: <verifiable acceptance criterion — the check/test/command that proves it>`' },
  { re: /^- Owner: .+/m, name: 'Owner', hint: '`- Owner: human | agent` (optionally a `· seed/wt-<i>` worktree handle)' },
];

const LEDGER_FIELDS: Array<{ re: RegExp; name: string; hint: string }> = [
  { re: /^- First observed: .+/m, name: 'First observed', hint: '`- First observed: <date, context>`' },
  { re: /^- Where: .+/m, name: 'Where', hint: '`- Where: <file/place the entropy lives>`' },
  { re: /^- Interest rate: (high|medium|low)\b/m, name: 'Interest rate', hint: '`- Interest rate: high | medium | low` (how fast it compounds if ignored)' },
  { re: /^- Price: .+/m, name: 'Price', hint: '`- Price: <estimated effort to convert>`' },
  { re: /^- Conversion path: .+/m, name: 'Conversion path', hint: '`- Conversion path: invariant | ring | deletion — and the concrete step`' },
];

/** Lines of the named `## section` only (up to the next `## ` heading). */
function sectionLines(content: string, heading: string): string[] {
  const lines = content.split('\n');
  const start = lines.findIndex((l) => l.trim() === heading);
  if (start === -1) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => l.startsWith('## '));
  return end === -1 ? rest : rest.slice(0, end);
}

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const violations: Violation[] = [];

    // Plans live only in active/ or completed/ — a plan at docs/plans/ root would
    // silently escape all format and sequence validation.
    for (const file of files) {
      if (!file.startsWith(PLANS_ROOT + '/')) continue;
      const rest = file.slice(PLANS_ROOT.length + 1);
      if (!rest.includes('/') && file !== LEDGER && rest !== 'README.md') {
        violations.push({
          check: ID,
          law: PLAN_LAW,
          problem: `${file} sits directly in ${PLANS_ROOT}/ — only README.md and the entropy ledger live there`,
          fix: `move it into ${ACTIVE}/ or ${COMPLETED}/ so it is validated and indexed, or delete it.`,
        });
      }
    }

    // --- plans ---
    const planFiles = files
      .filter(
        (f) =>
          (f.startsWith(ACTIVE + '/') || f.startsWith(COMPLETED + '/')) &&
          !f.endsWith('/README.md'),
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

      const status = content.match(STATUS_RE);
      if (!status) {
        violations.push({
          check: ID,
          law: PLAN_LAW,
          problem: `${file} has no valid \`- Status:\` line`,
          fix: 'add `- Status: active` / `- Status: blocked: <on what>` / `- Status: completed YYYY-MM-DD` near the top. The next agent decides what to do from this line.',
        });
      } else {
        const isCompletedStatus = status[1].startsWith('completed');
        const inCompletedDir = file.startsWith(COMPLETED + '/');
        if (inCompletedDir && !isCompletedStatus) {
          violations.push({
            check: ID,
            law: PLAN_LAW,
            problem: `${file} is in completed/ but its status is "${status[1]}"`,
            fix: 'set `- Status: completed YYYY-MM-DD`, or move the plan back to active/ — the directory and the status line must tell the same story.',
          });
        }
        if (!inCompletedDir && isCompletedStatus) {
          violations.push({
            check: ID,
            law: PLAN_LAW,
            problem: `${file} is in active/ but its status is "${status[1]}"`,
            fix: '`git mv` the plan to docs/plans/completed/ and update links to it — completed plans do not linger among live work.',
          });
        }
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

      // Progress log: at least one dated entry, dates non-decreasing (newest last).
      const dates = sectionLines(content, '## Progress log')
        .map((l) => l.match(DATED_ENTRY_RE)?.[1])
        .filter((d): d is string => d !== undefined);
      if (dates.length === 0) {
        violations.push({
          check: ID,
          law: PLAN_LAW,
          problem: `${file} Progress log has no dated entries`,
          fix: 'log progress as `- **YYYY-MM-DD** — <what happened>`, newest last. The progress log is the hand-off to the next agent, who may be you with no memory.',
        });
      } else {
        for (let i = 1; i < dates.length; i++) {
          if (dates[i] < dates[i - 1]) {
            violations.push({
              check: ID,
              law: PLAN_LAW,
              problem: `${file} Progress log entries out of order: ${dates[i]} appears after ${dates[i - 1]}`,
              fix: 'keep progress entries in chronological order, newest last — an agent reads the log bottom-up for the latest state.',
            });
            break;
          }
        }
      }

      // Work units (optional, ring 0036): when a plan carries a `## Work units` section, each
      // `### U<n> — <title>` unit must hold the fields a cold hand-off needs (E-014). A plan
      // without the section is unconstrained — the fire-only-when-present shape of ring 0035.
      if (WORK_UNITS_RE.test(content)) {
        const unitBlocks: Array<{ heading: string; body: string }> = [];
        for (const line of sectionLines(content, WORK_UNITS)) {
          if (line.startsWith('### ')) unitBlocks.push({ heading: line.trim(), body: '' });
          else if (unitBlocks.length > 0) unitBlocks[unitBlocks.length - 1].body += line + '\n';
        }
        if (unitBlocks.length === 0) {
          violations.push({
            check: ID,
            law: PLAN_LAW,
            problem: `${file} has a "${WORK_UNITS}" section with no units`,
            fix: 'add at least one `### U<n> — <title>` unit, or remove the empty section — work units are optional, but an empty section is not a decomposition. Format in docs/plans/README.md.',
          });
        }
        const ids = new Set<string>();
        for (const unit of unitBlocks) {
          const m = unit.heading.match(UNIT_HEADING_RE);
          if (!m) {
            violations.push({
              check: ID,
              law: PLAN_LAW,
              problem: `${file} work unit heading is malformed: ${JSON.stringify(unit.heading)}`,
              fix: 'each work unit is `### U<n> — <title>` (e.g. `### U1 — cut the ring`) so it is citable across sessions — format in docs/plans/README.md.',
            });
            continue;
          }
          const id = m[1];
          if (ids.has(id)) {
            violations.push({
              check: ID,
              law: PLAN_LAW,
              problem: `${file} has a duplicate work unit id ${id}`,
              fix: 'give each work unit a unique id (U1, U2, …); ids need not be gapless, but a duplicate makes a unit uncitable.',
            });
          }
          ids.add(id);
          if (!UNIT_STATUS_RE.test(unit.body)) {
            violations.push({
              check: ID,
              law: PLAN_LAW,
              problem: `${file} work unit ${id} has no valid \`- Status:\` line`,
              fix: 'add `- Status: todo | in progress (<owner>) | done | blocked: <on what>` — a resuming agent reads it to see what is still open.',
            });
          }
          for (const field of UNIT_FIELDS) {
            if (!field.re.test(unit.body)) {
              violations.push({
                check: ID,
                law: PLAN_LAW,
                problem: `${file} work unit ${id} is missing field: ${field.name}`,
                fix: `add ${field.hint} — a unit without it cannot be picked up cold (ring 0036).`,
              });
            }
          }
        }
      }
    }

    for (const issue of findSequenceIssues(numbers)) {
      const n = String(issue.number).padStart(4, '0');
      violations.push(
        issue.kind === 'duplicate'
          ? {
              check: ID,
              law: PLAN_LAW,
              problem: `duplicate plan number ${n} (numbering is shared across active/ and completed/)`,
              fix: 'renumber one of the duplicates to the next free number (max+1) and update links to it.',
            }
          : {
              check: ID,
              law: PLAN_LAW,
              problem: `plan numbering gap: found ${n} where ${String(issue.expected).padStart(4, '0')} was expected (sequential across active/ and completed/ combined)`,
              fix: `renumber plan ${n} to ${String(issue.expected).padStart(4, '0')}, or restore the missing plan.`,
            },
      );
    }

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
        if (headingLine === 'Open' || headingLine === 'Paid') continue;
        const m = headingLine.match(/^E-(\d{3}) — .+/);
        if (!m) {
          violations.push({
            check: ID,
            law: LEDGER_LAW,
            problem: `${LEDGER} has a heading that is neither Open, Paid, nor a valid entry: "## ${headingLine}"`,
            fix: 'ledger headings are exactly `## Open`, `## Paid`, and `## E-NNN — <short description>` (three digits, em dash) — format in docs/plans/README.md.',
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
      for (const issue of findSequenceIssues(entryNumbers)) {
        const n = `E-${String(issue.number).padStart(3, '0')}`;
        violations.push(
          issue.kind === 'duplicate'
            ? {
                check: ID,
                law: LEDGER_LAW,
                problem: `duplicate ledger number ${n}`,
                fix: 'renumber one of the duplicates to the next free E-number; paid entries keep their numbers forever.',
              }
            : {
                check: ID,
                law: LEDGER_LAW,
                problem: `ledger numbering gap: found ${n} where E-${String(issue.expected).padStart(3, '0')} was expected (sequential, across Open and Paid)`,
                fix: `renumber ${n} to E-${String(issue.expected).padStart(3, '0')}, or restore the missing entry.`,
              },
        );
      }
    }

    return {
      summary: `${planFiles.length} plan(s), ${ledgerEntries} ledger entr${ledgerEntries === 1 ? 'y' : 'ies'} valid`,
      violations,
    };
  },
};
