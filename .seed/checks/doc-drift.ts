// The doc-gardener's instrument (skills/doc-gardener/SKILL.md). Detects doc↔code drift —
// SEED.md §3's "stale references": current-state documentation that names repo paths which
// no longer exist. It reports `drift_count` (the SEED.md §6 fitness metric it is the source
// of) and, unlike the checks in run-all.ts, it is ADVISORY: drift is a trend the gardening
// cadence digests continuously (LAW-8, ring 0007), not a gate — so this always exits 0
// (barring an internal error). Findings are triaged by the gardening pass: mechanical ones
// land within ring 0007's automerge classes; the rest are priced or escalated.
//
// Run:  npm run garden           (human report)
//       node .seed/checks/doc-drift.ts --json   (machine output for CI fitness, plan 0002
//                                                 scope item 4)
//
// Extensible by design: DRIFT_CLASSES is a registry. v0 ships one class
// (stale-path-reference); new classes plug in without touching the runner. A class that
// proves to be always-wrong-and-mechanically-fixable can be promoted to a hard invariant in
// run-all.ts via a ring — the advisory/gate split is recorded in ring 0011.
import { listRepoFiles, inlineCodeSpans, formatViolation } from '../lib/repo.ts';
import type { Violation } from '../lib/repo.ts';

const LAW = "LAW-2 — legible and enforceable, or it doesn't exist";

export interface Drift extends Violation {
  file: string;
  line: number;
}

interface DriftClass {
  id: string;
  detect(scan: string[], present: Set<string>): Drift[];
}

// The current-state doc surface: documentation whose job is to describe the repository as
// it is now, so a path it names must resolve. Excluded are append-only / point-in-time
// records, where a reference is legitimate history, not drift, and rewriting it would fight
// the very append-only discipline the gates protect (the traceability gate's grandfathering
// principle):
//   - SEED.md            the genome — amended only by Gardener PR + ring (ring 0007 keeps it
//                        out of the gardener's automerge remit) and it carries generic path
//                        *templates* (docs/rings/NNNN-slug.md), not concrete references;
//   - docs/rings/**      the append-only decision log (its own gate enforces this);
//   - docs/plans/completed/**   finished plans, kept forever as record;
//   - docs/plans/active/NNNN-*.md   plan bodies carry dated progress/decision logs
//                        (their index README stays in scope);
//   - docs/plans/entropy-ledger.md  carries the Paid log.
function isScanned(file: string): boolean {
  if (!file.endsWith('.md')) return false;
  if (file === 'SEED.md') return false;
  if (file.startsWith('docs/rings/')) return false;
  if (file.startsWith('docs/plans/completed/')) return false;
  if (file === 'docs/plans/entropy-ledger.md') return false;
  if (/^docs\/plans\/active\/\d{4}-.*\.md$/.test(file)) return false;
  return true;
}

// A backtick word is a *concrete repo-path claim* — and thus checkable for staleness —
// only when it (a) begins with an existing top-level entry of this repository, (b) has a
// path separator, and (c) ends in a machinery/knowledge file extension. Template
// placeholders (`<name>`, `NNNN`) and glob patterns (`history/*.json`, `rings/[0-9].md`,
// `000?-x.md`, `{a,b}.json`) are patterns, not claims, and are skipped — real repo paths
// never contain these metacharacters, so skipping them keeps the false-positive rate at
// zero on live docs while never suppressing a genuine reference.
const PATH_EXT = /\.(?:md|ts|json|ya?ml)$/;
const PLACEHOLDER = /[<>*?[\]{}]|N{3,}/;

function pathClaims(code: string, topLevel: Set<string>): string[] {
  const claims: string[] = [];
  for (const word of code.split(/\s+/)) {
    const token = word
      .replace(/^\.\//, '')      // a leading ./ is the same repo-relative path
      .replace(/[:#].*$/, '');   // strip a trailing :line or #fragment (E-006: anchors unchecked)
    if (!token.includes('/')) continue;
    if (PLACEHOLDER.test(token)) continue;
    if (!PATH_EXT.test(token)) continue;
    if (!topLevel.has(token.split('/')[0])) continue;
    claims.push(token);
  }
  return claims;
}

const stalePathReference: DriftClass = {
  id: 'stale-path-reference',
  detect(scan, present): Drift[] {
    const topLevel = new Set([...present].map((f) => f.split('/')[0]));
    const drifts: Drift[] = [];
    for (const file of scan) {
      for (const { n, code } of inlineCodeSpans(file)) {
        for (const token of pathClaims(code, topLevel)) {
          if (present.has(token)) continue;
          drifts.push({
            file,
            line: n,
            check: `doc-drift/${this.id}`,
            law: LAW,
            problem: `${file}:${n} references \`${token}\`, which does not exist`,
            fix: `update the reference to the file's current path, or remove it; if ${token} should exist, create it. A stale reference is sensed entropy (SEED.md §3) — digest it on the gardening pass within ring 0007's automerge classes, or price it into the ledger.`,
          });
        }
      }
    }
    return drifts;
  },
};

const DRIFT_CLASSES: DriftClass[] = [stalePathReference];

export function scanDrift(files: string[]): Drift[] {
  const present = new Set(files);
  const scan = files.filter(isScanned);
  return DRIFT_CLASSES.flatMap((c) => c.detect(scan, present)).sort(
    (a, b) => a.file.localeCompare(b.file) || a.line - b.line,
  );
}

function main(): void {
  const json = process.argv.includes('--json');
  const files = listRepoFiles();
  const drifts = scanDrift(files);

  if (json) {
    console.log(JSON.stringify({ drift_count: drifts.length, findings: drifts }));
    return;
  }

  console.log(
    'doc-gardener — drift scan (advisory; feeds the drift_count fitness metric, SEED.md §6)\n',
  );
  if (drifts.length === 0) {
    console.log('✓ no doc↔code drift detected — every path named in current-state docs resolves');
    console.log('\ndrift_count 0');
    return;
  }
  for (const d of drifts) console.log(formatViolation(d));
  console.log(
    `\ndrift_count ${drifts.length} — not a gate: digest each within ring 0007's automerge ` +
      `classes on the gardening pass, or price it into the ledger (LAW-8). Nothing ambiguous ` +
      `survives contact (SEED.md §0).`,
  );
}

// Advisory: report and exit 0 even with findings. A genuine crash (a thrown error) still
// exits non-zero so CI notices a broken instrument.
main();
