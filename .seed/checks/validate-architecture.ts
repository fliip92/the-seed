// Enforces the architecture-doc format that the grill-the-gardener skill
// (skills/grill-the-gardener/SKILL.md) produces: the artifact of an architecture
// elicitation must fit on one page, state its rules as lintable rules each naming an
// enforcement, and make the human/agent ownership split explicit — the three exit
// conditions SEED.md §4 (Stage 2) and §5 (the grilling protocol) place on the interview.
// It is the principle-format discipline (SEED.md §2) applied to a whole-architecture
// statement. Ring 0015.
//
// Vacuous when docs/architecture/ holds only its README — like docs/principles/, the
// format is defined and enforced-when-present, binding the moment the skill produces a
// doc. Architecture docs live in docs/architecture/<slug>.md (non-numbered, one per
// target, indexed by the README) — they are per-target statements, not the sequential
// decision log that rings are.
import { readRepoFile, sectionBody, topLevelBullets } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const LAW = 'LAW-2 — legible and enforceable, or it doesn\'t exist';
const ID = 'seed/validate-architecture';
const DIR = 'docs/architecture';

// One page ≈ 500 words OR 80 non-blank lines. Two proxies, because the point of the skill is
// distillation (SEED.md §4a: the architecture must "fit on one page") and neither measure
// alone suffices: a word cap misses a tall ASCII diagram (the Shape section may hold one — a
// spaceless diagram is many lines but few "words"), and a line cap misses a dense prose blob.
// Both are admitted mechanical proxies; revisit if they prove too tight or loose (ring 0015).
const ONE_PAGE_WORDS = 500;
const ONE_PAGE_LINES = 80;

const REQUIRED_SECTIONS = ['## Shape', '## Rules', '## Ownership'] as const;

// The enforcement-mechanism vocabulary the ring format requires (validate-rings.ts): an
// enforcement clause naming none of these is a wish, not an enforceable rule (LAW-2). Bare
// `structural` is omitted deliberately — `structural test` is the mechanism; `structural` on
// its own is common architecture prose ("structural layers") and would wave a rule through.
const MECHANISM_RE = /(lint|structural test|CI gate|doc-only)/i;

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const violations: Violation[] = [];
    const docs = files
      .filter((f) => f.startsWith(DIR + '/') && f !== `${DIR}/README.md` && f.endsWith('.md'))
      .sort();

    for (const file of docs) {
      const content = readRepoFile(file);
      const lines = content.split('\n');

      const title = lines.find((l) => l.trim() !== '') ?? '';
      if (!/^# Architecture — .+/.test(title)) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} first line is not a valid architecture title: ${JSON.stringify(title)}`,
          fix: 'start the file with `# Architecture — <target name>` (em dash) — format in docs/architecture/README.md.',
        });
      }

      for (const heading of REQUIRED_SECTIONS) {
        if (sectionBody(lines, heading) === null) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} is missing required section: ${heading}`,
            fix: `add a \`${heading}\` section — an architecture doc needs Shape (the one-page picture), Rules (each naming an enforcement), and Ownership (the human/agent split). Format in docs/architecture/README.md.`,
          });
        }
      }

      // The one-page budget (SEED.md §4a), measured two ways so neither dense prose nor a
      // tall diagram slips a multi-page doc through. The whole point of the elicitation is a
      // distilled architecture, so an over-long doc has not finished the interview.
      const words = content.trim().split(/\s+/).filter(Boolean).length;
      if (words > ONE_PAGE_WORDS) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} is ${words} words, over the one-page word budget of ${ONE_PAGE_WORDS}`,
          fix: `distill it to ≤ ${ONE_PAGE_WORDS} words — an architecture that does not fit on one page has not been elicited yet (SEED.md §4). Push detail into the named enforcements, not the prose.`,
        });
      }
      const nonBlankLines = lines.filter((l) => l.trim() !== '').length;
      if (nonBlankLines > ONE_PAGE_LINES) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} is ${nonBlankLines} non-blank lines, over the one-page line budget of ${ONE_PAGE_LINES}`,
          fix: `distill it to ≤ ${ONE_PAGE_LINES} non-blank lines — a diagram or list this long is more than one page (SEED.md §4). Keep the Shape diagram small; push detail into the named enforcements.`,
        });
      }

      // Rules: at least one, each naming an enforcement mechanism (the principle-format
      // discipline). A rules section with no enforceable rules is doc-only enforcement in
      // costume (LAW-2).
      const rulesBody = sectionBody(lines, '## Rules');
      if (rulesBody !== null) {
        const rules = topLevelBullets(rulesBody);
        if (rules.length === 0) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} ## Rules names no rules`,
            fix: 'state at least one architectural rule as a `- <rule> — Enforcement: <mechanism>` bullet. An architecture with no lintable rules is not expressible as invariants (SEED.md §4b).',
          });
        }
        for (const rule of rules) {
          const firstLine = rule.split('\n')[0];
          // The mechanism must sit in the rule's own `Enforcement:` clause, not merely
          // somewhere in the sentence — otherwise prose like "must be lintable" or "structural
          // layers" waves through a rule that names no actual enforcement. Scoping to the
          // clause mirrors validate-rings.ts, which greps only the `- Enforcement:` field.
          const enf = rule.match(/Enforcement:\s*([\s\S]*)$/i);
          if (!enf) {
            violations.push({
              check: ID,
              law: LAW,
              problem: `${file} rule does not name an enforcement: ${JSON.stringify(firstLine)}`,
              fix: 'append `— Enforcement: <lint | structural test | CI gate | doc-only (justify why not mechanical)>` to the rule. A rule CI cannot verify is not enforceable, so it does not exist (LAW-2).',
            });
          } else if (!MECHANISM_RE.test(enf[1])) {
            violations.push({
              check: ID,
              law: LAW,
              problem: `${file} rule's enforcement names no mechanism: ${JSON.stringify(firstLine)}`,
              fix: 'state a mechanism after `Enforcement:` — one of lint | structural test | CI gate | doc-only (doc-only must justify why not mechanical). A rule CI cannot verify does not exist (LAW-2).',
            });
          }
        }
      }

      // Ownership must be an explicit split: the human side and the agent side named on
      // SEPARATE top-level bullets (SEED.md §4c, §5). Scanning the whole section for the two
      // keywords is too weak — 'seed'/'agent' are ubiquitous domain words, so a one-sided
      // bullet ("Human: … not the seed's concern") would satisfy both. Requiring two distinct
      // bullets is the same per-bullet rigor the Rules check uses.
      const ownershipBody = sectionBody(lines, '## Ownership');
      if (ownershipBody !== null) {
        const bullets = topLevelBullets(ownershipBody);
        const isHuman = (b: string): boolean => /\b(human|gardener)s?\b/i.test(b);
        const isAgent = (b: string): boolean => /\b(agent|seed)s?\b/i.test(b);
        const humanIdx = bullets.findIndex(isHuman);
        const agentIdx = bullets.findIndex((b, i) => i !== humanIdx && isAgent(b));
        if (humanIdx === -1 || agentIdx === -1) {
          const anyHuman = bullets.some(isHuman);
          const anyAgent = bullets.some(isAgent);
          const missing =
            !anyHuman && !anyAgent
              ? 'the human/Gardener side and the agent/Seed side'
              : !anyHuman
                ? 'the human/Gardener side'
                : !anyAgent
                  ? 'the agent/Seed side'
                  : 'both sides on separate bullets (a single bullet mentioning both is not a split)';
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} ## Ownership does not name ${missing}`,
            fix: 'name both sides on separate bullets — e.g. `- Human (Gardener): intent, priorities, taste, gate approvals.` and `- Agent (Seed): everything else.` The ownership split must be explicit (SEED.md §4c); an unsplit architecture leaves the handoff ambiguous.',
          });
        }
      }
    }

    return { summary: `${docs.length} architecture doc(s) valid`, violations };
  },
};
