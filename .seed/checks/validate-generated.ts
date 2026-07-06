// Enforces the docs/generated/ discipline (converting ledger E-001): artifacts there are
// PRODUCED BY SCRIPTS, NEVER BY HAND (SEED.md §2). "Hand-editing a generated artifact is a
// lint error — the fix always goes into the generator, then regenerate." Until now that rule
// was doc-only, which violates LAW-2; this is the lint.
//
// For every entry in the generation manifest (.seed/lib/generated.ts) it re-runs the pure
// generator from the current working tree and fails if the committed artifact differs — so a
// hand-edit is caught, AND a SOURCE that changed without a regeneration is caught (the
// committed briefing no longer equals what its sources produce). It also fails on any file in
// docs/generated/ that no manifest entry claims, and on a generator that cannot run (e.g. a
// source it reads is gone — surfaced as a legible violation, not a crash; the generator reads
// its own sources, so a missing source is caught there rather than in a second, redundant
// existence check). The generator being a pure function of repo files is what makes this
// checkable here in run-all.ts (no git, no clock) — and being a hard gate, not an advisory
// number, is right: a stale generated artifact is a correctness defect (LAW-2), not a trend.
//
// The map's index README (docs/generated/README.md) is the hand-authored index, exempt — like
// every other organ's README. Ring 0020.
import { REPO_ROOT, readRepoFile } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';
import { MANIFEST } from '../lib/generated.ts';

const LAW = 'LAW-2 — legible and enforceable, or it doesn\'t exist';
const ID = 'seed/validate-generated';
const DIR = 'docs/generated';

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const violations: Violation[] = [];
    const present = new Set(files);
    const registered = new Set(MANIFEST.map((m) => m.artifact));

    // No stray hand-authored (or orphaned) files in docs/generated/: every file there except
    // the index README must be a registered generated artifact. An unregistered file is either
    // a hand-authored file smuggled into a generated-only directory or a generator output whose
    // manifest entry was deleted — both defeat the discipline.
    for (const file of files) {
      if (file.startsWith(DIR + '/') && file !== `${DIR}/README.md` && !registered.has(file)) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${file} is not a registered generated artifact`,
          fix: `register it in the generation manifest (.seed/lib/generated.ts) with its sources and regeneration command, or remove it — docs/generated/ holds only regenerated-only artifacts (docs/generated/README.md). Hand-authored files do not belong here.`,
        });
      }
    }

    for (const entry of MANIFEST) {
      if (!present.has(entry.artifact)) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `registered generated artifact is missing: ${entry.artifact}`,
          fix: `run \`${entry.command}\` to produce it, then commit the result. A manifest entry with no artifact is a claim with nothing behind it (LAW-2).`,
        });
        continue;
      }

      // Re-derive the artifact from its sources and compare byte-for-byte. A mismatch means
      // either the file was hand-edited or a source changed without regenerating — both are the
      // same failure: the committed artifact no longer equals what the generator produces.
      let regenerated: string;
      try {
        regenerated = entry.generate(REPO_ROOT);
      } catch (err) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `could not regenerate ${entry.artifact}: ${err instanceof Error ? err.message : String(err)}`,
          fix: `the generator's source anchors may have moved — fix .seed/lib/generated.ts (or the source it reads) so \`${entry.command}\` produces the artifact again.`,
        });
        continue;
      }

      if (readRepoFile(entry.artifact) !== regenerated) {
        violations.push({
          check: ID,
          law: LAW,
          problem: `${entry.artifact} does not match its regeneration from ${entry.sources.join(', ')}`,
          fix: `it was hand-edited, or a source changed without regenerating — run \`${entry.command}\` and commit the result. A generated artifact is never edited by hand (docs/generated/README.md); the fix goes into the source or the generator.`,
        });
      }
    }

    return { summary: `${MANIFEST.length} generated artifact(s) match their sources`, violations };
  },
};
