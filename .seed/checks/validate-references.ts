// Enforces the distilled-reference format the intake skill produces (skills/intake/SKILL.md,
// plan 0004 scope item 3). A reference is external knowledge metabolized into the seed under
// grounded-or-ask (docs/principles/grounded-or-ask.md): every claim is cited to a source, and
// the seed's own inference is separated out as a **Seed reading:**, never smuggled in as the
// source's words. This check is what makes that discipline legible and enforceable rather than
// prose (LAW-2). It binds every docs/references/<subject>.md to three structural invariants that
// hold for ANY source:
//   (1) PROVENANCE — a **Source:** line carrying a retrieval date, and, when the source is a
//       repository GitHub can pin, a commit pin (ring 0024's pin-not-mirror). "An undated
//       distillation rots silently" (docs/references/README.md).
//   (2) PER-CLAIM CITATION — every claim (a top-level bullet under a `## ` section) cites a
//       source: its GROUNDED head — the text before any **Seed reading:** sub-bullet — carries at
//       least one link. An uncited claim is exactly the fabrication grounded-or-ask forbids. The
//       seed's own inference (**Seed reading:**) is exempt: it is marked as inference, not
//       attributed to the source.
//   (3) THE GROUNDED/INFERENCE SPLIT — the **Seed reading:** convention is present, so the
//       separation the whole discipline turns on is structurally in the document.
// Its TEETH bind only where the cited corpus is SAVED IN-REPO — the one v0 case a span is
// machine-verifiable against its source (ring 0024: pin, don't mirror; a fetched or saved corpus
// is phase 2, deferred with fetching). For a reference whose **Source:** links an in-repo file
// that exists (the self-hosting case — intake pointed at the seed's own docs):
//   (4) QUOTE-MATCH — every double-quoted span in a grounded claim must appear verbatim in the
//       cited source. A quote nowhere in the source is fabricated or misattributed.
//   (5) COMPLETENESS — every entry of the in-repo corpus (each distinct link target it carries) is
//       either cited by the reference or discarded in it WITH a stated reason. No source entry is
//       silently dropped — the parallel-worktrees / feedback anti-drop guard over intake's closed
//       outcome vocabulary (ring 0024): classified (`reference`) or `discard`-with-reason, never a
//       silent truncation.
// For an externally-pinned corpus — harness-engineering.md, whose 29 sources are all external —
// the teeth are vacuous (there is no saved corpus to enumerate or quote-check), so provenance +
// per-claim citation + the split carry the structural weight, and the faithfulness residual stays
// doc-only: grounded-or-ask's compose-not-commit + Gardener ratification (E-013). This check must
// pass on the landed harness-engineering.md, its first real subject (the assessment-0001 pattern).
//
// Vacuous while docs/references/ holds only its README (the docs/architecture / docs/assessments
// pattern): the format is defined and enforced-when-present, binding the moment the first
// reference lands. References are flat files named for their subject (docs/references/README.md),
// so this scans only the DIRECT .md children of the organ — a corpus staged in a subdirectory
// under it is not itself a reference. References are named, not numbered, so there is no sequence
// check.
import { readRepoFile, extractLocalLinks, visibleMarkdownLines, topLevelBullets } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const LAW = 'LAW-2 — legible and enforceable, or it doesn\'t exist';
const ID = 'seed/validate-references';
const DIR = 'docs/references';
const FILENAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

// The Source bullet's label, tolerant of the `**Source:**` bold-emphasis the scout uses: a
// top-level bullet whose text, stripped of leading `- `, `*`, and space, begins with "Source".
const SOURCE_LABEL_RE = /^-\s*\**\s*Source\b/i;
// A retrieval date somewhere in the Source line — an undated distillation rots silently.
const DATE_RE = /\b\d{4}-\d{2}-\d{2}\b/;
// A repo GitHub can pin: a github.com link in the Source line makes a commit pin required.
const GITHUB_RE = /github\.com/i;
// A commit pin: the word "commit" plus a 7–40 hex SHA (the backtick delimiters around `a28cc8e`
// are non-word chars, so \b anchors it; provenance is read from RAW lines, not code-blanked ones,
// precisely so the backticked SHA survives). Dates carry no 7-run of hex, so they never false-match.
const COMMIT_WORD_RE = /\bcommit\b/i;
const SHA_RE = /\b[0-9a-f]{7,40}\b/i;
// The grounded/inference split convention — the marker that separates the seed's own inference
// from a source's claim.
const SEED_READING_RE = /\*\*Seed reading:?\*\*/;
// An inline markdown link (used to test a grounded head carries a citation).
const LINK_RE = /\[[^\]]*\]\([^)]*\)/;
// A double-quoted span in a grounded claim — the unit quote-match verifies against the source.
const QUOTE_RE = /"([^"\n]{1,300})"/g;
// A `discard` outcome (ring 0024's closed vocabulary): a bullet naming the word.
const DISCARD_RE = /\bdiscard(ed|s)?\b/i;

interface SourceBullet {
  raw: string;    // the Source bullet's raw text (wrapped lines folded in)
  start: number;  // 0-based first line
  end: number;    // 0-based line just past it (exclusive)
}

/** The Source bullet in the preamble (before the first `## ` section), raw text + line range,
 *  or null when absent. Wrapped continuation lines fold in up to the next top-level bullet,
 *  `## ` heading, or EOF — the fieldRanges discipline the sibling validators use. */
function findSourceBullet(lines: string[], firstSection: number): SourceBullet | null {
  for (let i = 0; i < firstSection; i++) {
    if (!SOURCE_LABEL_RE.test(lines[i])) continue;
    let j = i + 1;
    while (j < firstSection && !/^- \S/.test(lines[j]) && !/^## /.test(lines[j])) j++;
    return { raw: lines.slice(i, j).join('\n'), start: i, end: j };
  }
  return null;
}

/** The claim bullets of every `## ` section — top-level bullets grouped per section so no
 *  section's trailing prose folds into a prior section's last bullet. Nested `**Seed reading:**`
 *  sub-bullets fold into their parent claim (they are inference, checked separately). */
function claimBullets(lines: string[], firstSection: number): string[] {
  const claims: string[] = [];
  let i = firstSection;
  while (i < lines.length) {
    if (/^## /.test(lines[i])) {
      let j = i + 1;
      while (j < lines.length && !/^## /.test(lines[j])) j++;
      claims.push(...topLevelBullets(lines.slice(i + 1, j)));
      i = j;
    } else {
      i++;
    }
  }
  return claims;
}

/** The grounded head of a claim: everything before its first **Seed reading:** sub-bullet, so a
 *  citation must be the claim's OWN (not smuggled from the inference), and quote-match never
 *  inspects a Seed reading's quotes (those are the seed's words, not the source's). */
const groundedHead = (bullet: string): string => bullet.split(/\*\*Seed reading:?/)[0];

/** Every distinct link target in a file: local targets normalized repo-relative (via
 *  extractLocalLinks) and external URLs kept verbatim — so a corpus entry and its citation in the
 *  reference compare equal whether it is a repo path or a URL. */
function linkTargets(repoRelFile: string): Set<string> {
  const targets = new Set<string>();
  for (const l of extractLocalLinks(repoRelFile)) targets.add(l.target);
  for (const { text } of visibleMarkdownLines(repoRelFile)) {
    for (const m of text.matchAll(/\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      targets.add(m[1]);
    }
  }
  return targets;
}

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const violations: Violation[] = [];
    const present = new Set(files);
    const docs = files
      .filter(
        (f) =>
          f.startsWith(DIR + '/') &&
          f !== `${DIR}/README.md` &&
          f.endsWith('.md') &&
          f.slice(DIR.length + 1).indexOf('/') === -1, // direct children only
      )
      .sort();

    for (const file of docs) {
      const base = file.slice(DIR.length + 1);
      if (!FILENAME_RE.test(base)) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} does not match the reference filename format <subject>.md`,
          fix: 'name a reference in lowercase-kebab for its subject, e.g. harness-engineering.md — a reference is cited by subject; format in docs/references/README.md.',
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
          problem: `${file} first line is not a valid reference title: ${JSON.stringify(title)}`,
          fix: 'start the file with `# <subject>` — one H1 naming what is distilled. Format in docs/references/README.md.',
        });
      }

      const firstSection = ((): number => {
        const idx = lines.findIndex((l) => /^## /.test(l));
        return idx === -1 ? lines.length : idx;
      })();

      // (1) Provenance — the Source line. Its retrieval date places the distillation on a trend
      // (LAW-9); the commit pin (for a pinnable repo) is how a network-free reference stays
      // verifiable without mirroring the corpus (ring 0024).
      const source = findSourceBullet(lines, firstSection);
      if (!source) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} has no Source line (provenance)`,
          fix: 'add a top-level `- **Source:** …` bullet stating where the knowledge came from, with a retrieval date and — for a repo GitHub can pin — a commit. An undated distillation rots silently (docs/references/README.md); pin, don\'t mirror (ring 0024).',
        });
      } else {
        if (!DATE_RE.test(source.raw)) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} Source line carries no retrieval date`,
            fix: 'add the date the source was retrieved as YYYY-MM-DD in the Source line — an undated distillation rots silently (docs/references/README.md); a reading is a dated point on a trend (LAW-9).',
          });
        }
        if (GITHUB_RE.test(source.raw) && !(COMMIT_WORD_RE.test(source.raw) && SHA_RE.test(source.raw))) {
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} Source is a pinnable repo (github.com) but carries no commit pin`,
            fix: 'pin the source to the commit it was read at — e.g. `pinned at commit `a1b2c3d``. intake is network-free and does not mirror the corpus, so the commit is what keeps a claim verifiable (ring 0024, pin-not-mirror).',
          });
        }
      }

      // (3) The grounded/inference split — the **Seed reading:** convention must be present, so
      // the separation the discipline turns on is structurally in the document, not merely
      // promised. (A reference metabolizes the field INTO the seed's own frame, so it draws at
      // least one seed-connection and marks it as inference.)
      if (!SEED_READING_RE.test(content)) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} has no **Seed reading:** marker — the grounded/inference split is not structurally present`,
          fix: 'mark the seed\'s own inference connecting a source to the seed as a nested `- **Seed reading:** …` sub-bullet, separated from the source\'s own claim (grounded-or-ask). A distillation that draws no separated seed-connection has not metabolized anything.',
        });
      }

      // (2) Per-claim citation — every claim bullet's grounded head carries a link. Mirrors
      // validate-assessments' per-finding product check and validate-architecture's per-rule
      // enforcement check: the load-bearing per-item discipline.
      const claims = claimBullets(lines, firstSection);
      for (const claim of claims) {
        const head = groundedHead(claim);
        if (!LINK_RE.test(head)) {
          const firstLine = claim.split('\n')[0];
          violations.push({
            check: ID,
            law: LAW,
            problem: `${file} claim cites no source: ${JSON.stringify(firstLine)}`,
            fix: 'cite the source this claim came from as a `[text](link)` in the claim itself. Every distilled claim is cited or it is inference — and inference is marked `**Seed reading:**`, never stated as the source\'s words (grounded-or-ask).',
          });
        }
      }

      // Teeth — only where the cited corpus is an already-committed in-repo file. The Source
      // bullet's local link(s) to files that EXIST are that corpus (ring 0024: the one v0 case a
      // span is machine-verifiable against its source). For an external corpus this set is empty
      // and both teeth are vacuous — as they are for harness-engineering.md.
      const corpusFiles = source
        ? extractLocalLinks(file)
            .filter((l) => l.line - 1 >= source.start && l.line - 1 < source.end && present.has(l.target))
            .map((l) => l.target)
        : [];

      if (corpusFiles.length > 0) {
        const corpusText = corpusFiles.map((c) => readRepoFile(c)).join('\n');

        // (4) Quote-match: every double-quoted span in a grounded claim appears verbatim in the
        // cited source. A quote nowhere in the corpus is fabricated or misattributed — the
        // fabrication surface the in-repo case can actually close.
        for (const claim of claims) {
          for (const m of groundedHead(claim).matchAll(QUOTE_RE)) {
            if (!corpusText.includes(m[1])) {
              violations.push({
                check: ID,
                law: LAW,
                problem: `${file} quotes a span not found in the cited in-repo source: ${JSON.stringify(m[1])}`,
                fix: `make the quote verbatim from the source (${corpusFiles.join(', ')}), or drop the quotation marks if it is a paraphrase. A quoted span the source does not contain is a fabricated quote (grounded-or-ask).`,
              });
            }
          }
        }

        // (5) Completeness: every corpus entry is cited or discarded-with-reason — no silent
        // truncation (the anti-drop guard, ring 0024's closed outcome vocabulary). Entries are
        // the distinct link targets the corpus carries; the reference "accounts for" one by
        // citing it (classified `reference`) or naming it in a `discard` bullet with a reason.
        const refTargets = linkTargets(file);
        const corpusEntries = new Set<string>();
        for (const c of corpusFiles) for (const t of linkTargets(c)) corpusEntries.add(t);
        for (const entry of corpusEntries) {
          if (!refTargets.has(entry)) {
            violations.push({
              check: ID,
              law: LAW,
              problem: `${file} silently drops a source entry (completeness): ${entry}`,
              fix: 'account for every entry of an in-repo corpus — cite it (classified `reference`) or `discard` it with a stated reason. No source entry is silently dropped (ring 0024\'s closed outcome vocabulary; the parallel-worktrees / feedback anti-drop guard).',
            });
          }
        }
        // A `discard` with no reason is a silent drop wearing a label — the stated-reason rule is
        // the anti-drop guard's teeth (ring 0024).
        for (const claim of claims) {
          if (!DISCARD_RE.test(claim)) continue;
          const reason = claim.replace(/\[[^\]]*\]\([^)]*\)/g, '').replace(DISCARD_RE, '').replace(/[^A-Za-z0-9]+/g, ' ').trim();
          if (reason.length < 8) {
            violations.push({
              check: ID,
              law: LAW,
              problem: `${file} discards a source entry with no stated reason: ${JSON.stringify(claim.split('\n')[0])}`,
              fix: 'state WHY an entry was discarded — out of scope, redundant, low-value. A discard with no reason is a silent drop wearing a label (ring 0024); the stated reason is itself the record.',
            });
          }
        }
      }
    }

    return { summary: `${docs.length} reference(s) valid`, violations };
  },
};
