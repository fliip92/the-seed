// Enforces the pollen boundary (founding ring 0026, plan 0005 scope item 1) on three fronts:
//
//   1. COMPLETENESS (LAW-3) — the pollen manifest (.seed/lib/pollen.ts) classifies every top-level
//      repo entry into exactly one tier (portable / sovereign / local). A new top-level entry the
//      manifest omits fails: the Stage 3 boundary is an invariant enforced centrally, and it must
//      stay TOTAL and honest as the seed grows. A manifest path with nothing behind it fails too.
//   2. VERSION LINES (LAW-2) — the pollen version is semver, and the manifest's copy of the genome
//      version matches what SEED.md declares. The two lines are separate fields, never conflated;
//      the genome copy is cross-checked so it cannot silently drift from its source (the E-011 shape).
//   3. LINEAGE (LAW-2, SEED.md §7) — the seed records its lineage in pollen/lineage.json, and its
//      fields (seed version = the pollen version, parent, date planted) are present and well-formed.
//
// A run-all.ts gate, not an advisory: it is a pure function of the working tree (no git, no clock),
// and an incomplete boundary or a malformed lineage is a correctness defect, not a trend (the
// validate-generated shape). The lineage reader is shared with the feedback composer (lib/lineage.ts),
// so the organ that VALIDATES a lineage and the organ that READS one to flow feedback upstream cannot
// drift on what a lineage is (LAW-3).
import { REPO_ROOT } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';
import {
  GENOME_VERSION,
  POLLEN_VERSION,
  classified,
  classifyBoundary,
  isGenomeVersion,
  isSemver,
  readGenomeVersion,
} from '../lib/pollen.ts';
import { LINEAGE_PATH, readLineage, type Lineage } from '../lib/lineage.ts';

const LAW2 = "LAW-2 — legible and enforceable, or it doesn't exist";
const LAW3 = 'LAW-3 — invariants over implementations';
const ID = 'seed/validate-pollen';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const OWNER_REPO_RE = /^\S+\/\S+$/;

/** The lineage field checks (SEED.md §7): the two required fields present and well-formed, the
 *  optional ones well-formed when present, and both version fields agreeing with the manifest — so
 *  the seed's recorded lineage cannot drift from the pollen line it actually carries. */
function checkLineage(lineage: Lineage): Violation[] {
  const v: Violation[] = [];
  const bad = (problem: string, fix: string): void => void v.push({ check: ID, law: LAW2, problem, fix });

  // seed version — the POLLEN version this seed carries (SEED.md §7 "seed version").
  const sv = lineage.seedVersion;
  if (sv === undefined) {
    bad(
      `${LINEAGE_PATH} is missing seedVersion`,
      `record seedVersion — the pollen version this seed carries (SEED.md §7 "seed version"), currently "${POLLEN_VERSION}".`,
    );
  } else if (!isSemver(sv)) {
    bad(`${LINEAGE_PATH} seedVersion "${sv}" is not semver (X.Y.Z)`, `the pollen line is semver — set seedVersion to a major.minor.patch version (ring 0026).`);
  } else if (sv !== POLLEN_VERSION) {
    bad(
      `${LINEAGE_PATH} seedVersion "${sv}" disagrees with the manifest's pollen version "${POLLEN_VERSION}"`,
      `the seed's own lineage records the pollen version it carries — set seedVersion to "${POLLEN_VERSION}" (.seed/lib/pollen.ts), or bump POLLEN_VERSION if a release was cut.`,
    );
  }

  // date planted — a recorded fact (ring 0020), YYYY-MM-DD.
  const planted = lineage.planted;
  if (planted === undefined) {
    bad(`${LINEAGE_PATH} is missing planted`, `record planted — the date this seed was planted (SEED.md §7), as YYYY-MM-DD.`);
  } else if (!DATE_RE.test(planted)) {
    bad(`${LINEAGE_PATH} planted "${planted}" is not a YYYY-MM-DD date`, `write planted as YYYY-MM-DD — a recorded fact, never a wall-clock read (ring 0020).`);
  }

  // parent — "owner/repo" of the mother seed; null/absent/empty at the root of a lineage.
  const parent = lineage.parent;
  if (parent !== undefined && parent.trim() !== '' && !OWNER_REPO_RE.test(parent.trim())) {
    bad(
      `${LINEAGE_PATH} parent "${parent}" is not an "owner/repo"`,
      `record parent as the mother seed's "owner/repo" — or null at the root of a lineage (the mother is the root; a descendant names its parent, SEED.md §7).`,
    );
  }

  // genome version — the second line; optional in lineage, but well-formed and agreeing when present.
  const gv = lineage.genomeVersion;
  if (gv !== undefined) {
    if (!isGenomeVersion(gv)) {
      bad(`${LINEAGE_PATH} genomeVersion "${gv}" is not a genome version (X.Y)`, `the genome line is X.Y — set genomeVersion to match SEED.md's "genome vX.Y", or remove it (it is optional).`);
    } else if (gv !== GENOME_VERSION) {
      bad(
        `${LINEAGE_PATH} genomeVersion "${gv}" disagrees with the manifest's genome version "${GENOME_VERSION}"`,
        `the two version lines are never conflated, but the recorded genome line must match the manifest — set genomeVersion to "${GENOME_VERSION}" or remove it.`,
      );
    }
  }
  return v;
}

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const violations: Violation[] = [];

    // 1. boundary completeness (LAW-3): every top-level entry classified, every classified path real.
    const topLevel = new Set(files.map((f) => f.split('/')[0]));
    const { unclassified, missing } = classifyBoundary(topLevel);
    for (const entry of unclassified) {
      violations.push({
        check: ID,
        law: LAW3,
        problem: `top-level entry \`${entry}\` is classified by no pollen tier`,
        fix: `classify \`${entry}\` in the pollen manifest (.seed/lib/pollen.ts) as portable (the method — grafted into descendants, locally adaptable), sovereign (the genome — the mother's frame), or local (this seed's own history — never portable). The Stage 3 boundary must stay total: every top-level entry has exactly one tier (LAW-3).`,
      });
    }
    for (const path of missing) {
      violations.push({
        check: ID,
        law: LAW3,
        problem: `the pollen manifest classifies \`${path}\`, but it is absent from the tree`,
        fix: `remove \`${path}\` from .seed/lib/pollen.ts (PORTABLE / SOVEREIGN / LOCAL), or restore the path — a boundary that points at nothing is not a legible invariant (LAW-3).`,
      });
    }

    // 2. the two version lines (LAW-2): pollen is semver; the manifest's genome copy matches SEED.md.
    if (!isSemver(POLLEN_VERSION)) {
      violations.push({
        check: ID,
        law: LAW2,
        problem: `the pollen version "${POLLEN_VERSION}" is not semver (X.Y.Z)`,
        fix: `set POLLEN_VERSION in .seed/lib/pollen.ts to a major.minor.patch version — the pollen line is semver (ring 0026).`,
      });
    }
    const genomeInSeed = readGenomeVersion(REPO_ROOT);
    if (genomeInSeed === null) {
      violations.push({
        check: ID,
        law: LAW2,
        problem: `SEED.md declares no genome version ("genome vX.Y")`,
        fix: `restore the "genome vX.Y" line in SEED.md's header — it is the authoritative genome version the manifest is checked against (LAW-2).`,
      });
    } else if (genomeInSeed !== GENOME_VERSION) {
      violations.push({
        check: ID,
        law: LAW2,
        problem: `the manifest's genome version "${GENOME_VERSION}" does not match SEED.md's declared genome version "${genomeInSeed}"`,
        fix: `update GENOME_VERSION in .seed/lib/pollen.ts to "${genomeInSeed}" — the two version lines are never conflated, but the manifest's copy of the genome line must track its source, SEED.md (the E-011 shape).`,
      });
    }

    // 3. lineage (LAW-2, SEED.md §7): present and well-formed.
    let lineage: Lineage | null = null;
    let readOk = true;
    try {
      lineage = readLineage(REPO_ROOT);
    } catch (err) {
      readOk = false;
      violations.push({
        check: ID,
        law: LAW2,
        problem: `${LINEAGE_PATH} is malformed: ${err instanceof Error ? err.message : String(err)}`,
        fix: `make ${LINEAGE_PATH} valid JSON recording the SEED.md §7 lineage (seedVersion, parent, planted).`,
      });
    }
    if (readOk) {
      if (lineage === null) {
        violations.push({
          check: ID,
          law: LAW2,
          problem: `the seed records no lineage (${LINEAGE_PATH} is absent)`,
          fix: `create ${LINEAGE_PATH} recording this seed's lineage (SEED.md §7): seedVersion "${POLLEN_VERSION}" (the pollen version), parent null (the mother is the root of its lineage), planted (YYYY-MM-DD). Every seed records its lineage.`,
        });
      } else {
        violations.push(...checkLineage(lineage));
      }
    }

    return {
      summary: `pollen boundary complete (${classified().size} top-level entries classified), pollen ${POLLEN_VERSION} / genome ${GENOME_VERSION}, lineage well-formed`,
      violations,
    };
  },
};
