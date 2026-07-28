// Enforces that the map's `## Current state` section stays a statement of STATE, by capping its
// size (E-027, ring 0055 — the Gardener's fork A+B). LAW-4 makes AGENTS.md the entry point every
// agent reads before doing anything; nothing made it stay READABLE. Each unit appended a paragraph
// and none removed one, so the section grew 9 → 214 non-blank lines in 23 days (72% of the file)
// while every other section stayed flat — a second progress log, restating what the active plan's
// Progress log, the entropy ledger's Paid notes, and the ring bodies each already record in full.
//
// A budget, not a content rule. What belongs in a state statement is taste (ring 0055 fixes the
// shape: stage, live work, correct first action, where the debt and the history are); what is
// mechanical is that the entry point cannot grow without bound. When this fires, the fix is never
// "trim a few words" — it is that the narrative being appended belongs in the plan, the ledger, or
// a ring, and the map should carry the pointer that already exists.
//
// Two proxies, the validate-architecture one-page shape (ring 0015): a line cap alone misses a few
// very long wrapped paragraphs, a word cap alone misses a tall bulleted list. Both are admitted
// mechanical proxies for "this is a state statement, not a log".
//
// Silent when the map carries no such section — run-all.ts is portable (ring 0026), and a grafted
// host names its own sections (dither's map is a CLAUDE.md with none). The graft template emits a
// six-line Current state, so a descendant inherits the budget with room to grow, not a red CI.
import { readRepoFile, sectionBody } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const LAW = 'LAW-4 — the map is the entry point';
const ID = 'seed/validate-map-budget';
const MAP = 'AGENTS.md';
const SECTION = '## Current state';

// Calibrated against the rest of the map, which is the part that does the LAW-4 navigational job:
// Start here + Territory + Protocols + Laws together are 64 non-blank lines / 667 words and have
// stayed flat for 23 days. The state statement gets a comparable budget — it may be as large as the
// navigation that carries it, and no larger. Ring 0055 landed it at 33 lines / 332 words, so the
// headroom is real but finite: roughly a dozen appended lines, then the gate asks where they belong.
const MAX_LINES = 60;
const MAX_WORDS = 650;

/** Non-blank lines and words of the section body — the two size proxies. */
export function measureCurrentState(content: string): { lines: number; words: number } | null {
  const body = sectionBody(content.split('\n'), SECTION);
  if (body === null) return null;
  return {
    lines: body.filter((l) => l.trim() !== '').length,
    words: body.join(' ').trim().split(/\s+/).filter(Boolean).length,
  };
}

const FIX =
  `move the narrative to where it is already recorded — the active plan's \`Progress log\`, the ` +
  `entropy ledger's Paid note, or the ring that decided it — and leave ${MAP} § Current state the ` +
  `state plus the pointer: stage, the live plan, the correct first action, where the debt is. A ` +
  `fresh agent reads this section before doing anything (LAW-4); it is not a second progress log ` +
  `(E-027, ring 0055). Raising the budget is a ring, not an edit.`;

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    if (!files.includes(MAP)) {
      return { summary: `map budget not applicable (no ${MAP})`, violations: [] };
    }
    const size = measureCurrentState(readRepoFile(MAP));
    if (size === null) {
      return { summary: `map budget not applicable (${MAP} has no \`${SECTION}\` section)`, violations: [] };
    }

    const violations: Violation[] = [];
    if (size.lines > MAX_LINES) {
      violations.push({
        check: ID,
        law: LAW,
        problem: `${MAP} ${SECTION} is ${size.lines} non-blank lines, over the budget of ${MAX_LINES}`,
        fix: FIX,
      });
    }
    if (size.words > MAX_WORDS) {
      violations.push({
        check: ID,
        law: LAW,
        problem: `${MAP} ${SECTION} is ${size.words} words, over the budget of ${MAX_WORDS}`,
        fix: FIX,
      });
    }

    return {
      summary:
        violations.length === 0
          ? `${SECTION} within budget (${size.lines}/${MAX_LINES} lines, ${size.words}/${MAX_WORDS} words)`
          : `${SECTION} over budget (${size.lines}/${MAX_LINES} lines, ${size.words}/${MAX_WORDS} words)`,
      violations,
    };
  },
};
