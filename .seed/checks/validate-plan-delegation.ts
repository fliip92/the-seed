// Enforces that a plan which delegates live work to another plan POINTS at it and does not
// RESTATE its state (E-009, ring 0058 — the Gardener's prevention ruling).
//
// The shape this pays: plan 0006 delegated Pollination step 5 to plan 0009 and then summarized
// plan 0009's queue — which rotted the moment 0009 moved on, naming landed work as "Next" in the
// section AGENTS.md § Start here point 2 routes every returning agent to. E-009 had priced a
// DETECTOR for this ("a plan's Next actions naming work its own progress log records as done"),
// and ring 0057 falsified it while converting E-006: the two halves were never in one file (0006's
// progress log never mentioned that work — plan 0009's did), and the CORRECTED text still names all
// four tokens, because naming landed work as history is correct. Only prose grammar separated the
// bug from the fix, which is the same ~19-false-positive trap ring 0054 measured and rejected for
// the stage scan. So this is prevention, not detection: it reads STRUCTURE, never grammar.
//
// The invariant: a block in an active plan's `## Next actions` that links ANOTHER ACTIVE plan is a
// pointer, and a pointer is small. Restating the other plan's state is then not "discouraged" but
// mechanically out of budget — the ring-0055 move that already paid this shape on AGENTS.md.
//
// THREE EXEMPTIONS, each forced by measuring the real corpus rather than assuming (the corpus is
// small enough to read in full, and a section-scoped cap — the first design — was wrong on it):
//
//   1. `## Progress log` is NOT bound, though it is where most plan→plan links actually live (96,
//      448 and 184 non-blank lines in the three plans that have them). A progress log is dated
//      history; its size is its job, and a dated line cannot rot into an instruction.
//   2. A COMPLETED plan is not bound. Its `Next actions` is a record of what was next when it
//      closed, it carries `- Status: completed YYYY-MM-DD`, and § Start here routes agents to
//      docs/plans/active/. Binding it would demand editing closed plans to no reader's benefit.
//   3. A link to a COMPLETED plan is not a delegation. Frozen state cannot go stale, so restating
//      it is merely redundant, not a trap. Both halves must be live for the rot to be live.
//
// Resolution goes through resolveLinkTarget, so the active/⇄completed/ flex of ring 0013 is
// honored: a plan cannot fall out of budget by writing the link the other way round (plan 0007
// links plan 0009 as `../completed/0009-…`, which resolves to the active plan).
//
// Silent when a plan carries no `## Next actions`, and when nothing delegates — a descendant whose
// plans never point at each other is unbound (the ring-0035 fire-only-when-present shape).
import {
  readRepoFile,
  sectionBody,
  extractLocalLinks,
  resolveLinkTarget,
} from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const LAW = 'LAW-5 — plans are first-class artifacts';
const ID = 'seed/validate-plan-delegation';
const ACTIVE = 'docs/plans/active';
const SECTION = '## Next actions';

/** A numbered plan under a plans directory — never that directory's README.md index. */
const ACTIVE_PLAN_RE = /^docs\/plans\/active\/\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

// Calibrated against the corpus the way ring 0055 calibrated the map budget — on the part that
// does the same job well. In plan 0006, the one plan that delegates, the six blocks describing its
// OWN six steps run 3–10 non-blank lines and 42–98 words; the delegating block was 11 lines / 137
// words — the LARGEST block in the section. A pointer bigger than everything it sits among is not
// a pointer, it is a second copy of the other plan's state. So a delegating block may be as large
// as the largest block about the plan's own work, and no larger.
const MAX_LINES = 10;
const MAX_WORDS = 100;

// Two proxies, the validate-architecture / validate-map-budget shape (rings 0015, 0055): a line cap
// alone waves through a few very long wrapped lines, a word cap alone waves through a tall list.
interface Block {
  line: number; // 1-based line of the block's first line
  lines: string[];
}

/**
 * The blocks of a section body: separated by blank lines, except that a top-level list marker
 * always starts a new one (the numbered steps of a `Next actions` list carry no blank lines
 * between them, so blank-line splitting alone would fuse the whole list into one block).
 *
 * Local to this check rather than in repo.ts: `topLevelBullets` answers a different question — it
 * reads only `- ` bullets and deliberately DROPS leading prose, and the leading prose is exactly
 * where plan 0006's other delegation lives.
 */
export function sectionBlocks(body: string[], offset: number): Block[] {
  const isItem = (l: string) => /^(?:[-*+] |\d+[.)] )\S/.test(l);
  const blocks: Block[] = [];
  let current: Block | null = null;
  body.forEach((line, i) => {
    if (line.trim() === '') {
      if (current) blocks.push(current);
      current = null;
      return;
    }
    if (isItem(line) || current === null) {
      if (current) blocks.push(current);
      current = { line: offset + i, lines: [line] };
    } else {
      current.lines.push(line);
    }
  });
  if (current) blocks.push(current);
  return blocks;
}

const measure = (b: Block) => ({
  lines: b.lines.filter((l) => l.trim() !== '').length,
  words: b.lines.join(' ').trim().split(/\s+/).filter(Boolean).length,
});

const fixFor = (target: string) =>
  `state this plan's own next action and POINT at ${target} — do not restate its state. Whatever ` +
  `is over budget here is already recorded in that plan's \`Progress log\`, the entropy ledger's ` +
  `Paid notes, or a ring, and it goes stale here the moment that plan moves on (E-009, ring 0058). ` +
  `A pointer is a sentence: what the other plan owns, and that the reader continues from it.`;

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const present = new Set(files);
    const activePlans = files.filter((f) => ACTIVE_PLAN_RE.test(f)).sort();

    const violations: Violation[] = [];
    let delegating = 0;
    let maxLines = 0;
    let maxWords = 0;

    for (const plan of activePlans) {
      const lines = readRepoFile(plan).split('\n');
      const body = sectionBody(lines, SECTION);
      if (body === null) continue; // validate-plans owns "the section must exist"
      const heading = lines.findIndex((l) => l.trim() === SECTION);
      const blocks = sectionBlocks(body, heading + 2); // 1-based line of body[0]

      // Delegations are links, inside this section, to a DIFFERENT plan that is still active.
      const delegated = new Map<number, string>(); // block index -> target plan
      for (const link of extractLocalLinks(plan)) {
        const resolved = resolveLinkTarget(link.target, present);
        if (resolved === null || resolved === plan || !ACTIVE_PLAN_RE.test(resolved)) continue;
        const index = blocks.findIndex(
          (b) => link.line >= b.line && link.line < b.line + b.lines.length,
        );
        if (index !== -1 && !delegated.has(index)) delegated.set(index, resolved);
      }

      for (const [index, target] of delegated) {
        const block = blocks[index];
        const size = measure(block);
        delegating++;
        maxLines = Math.max(maxLines, size.lines);
        maxWords = Math.max(maxWords, size.words);
        const where = `${plan}:${block.line} (${SECTION}) delegates to ${target}`;
        if (size.lines > MAX_LINES) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${where} in ${size.lines} non-blank lines, over the budget of ${MAX_LINES}`,
            fix: fixFor(target),
          });
        }
        if (size.words > MAX_WORDS) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${where} in ${size.words} words, over the budget of ${MAX_WORDS}`,
            fix: fixFor(target),
          });
        }
      }
    }

    if (delegating === 0) {
      return { summary: 'no active plan delegates to another active plan', violations };
    }
    return {
      summary:
        violations.length === 0
          ? `${delegating} delegating block(s) point rather than restate (max ${maxLines}/${MAX_LINES} lines, ${maxWords}/${MAX_WORDS} words)`
          : `${delegating} delegating block(s), over budget (max ${maxLines}/${MAX_LINES} lines, ${maxWords}/${MAX_WORDS} words)`,
      violations,
    };
  },
};
