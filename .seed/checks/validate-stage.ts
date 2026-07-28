// Enforces that the growth stage, hand-maintained in SEVERAL places, AGREES across them (E-011,
// ring 0035; widened to a declared source set by E-025, ring 0054). The map's "- **Stage:** N"
// bullet is the reference; every other declared source is compared to it. Each is bumped by hand on
// a Gardener-approved stage transition — fitness.ts deliberately keeps that decision manual
// (SEED.md §4) — and nothing checked they agree, so a forgotten bump silently mislabels every
// fitness snapshot's stage, or tells the public front door's reader the wrong thing for ten days
// (the E-025 finding: README.md said "currently at Stage 2" while the repo had been at Stage 4 since
// 2026-07-17). This verifies the hand-bump; it does not mechanize the decision.
//
// Fires ONLY when the map states a stage and a declared source states a DIFFERENT one. It is
// deliberately silent when a source states none — run-all.ts is portable (ring 0026), so a grafted
// host carries this check plus the copied fitness.ts (with the mother's CURRENT_STAGE), and its map
// template tracks no genome stage: a descendant must not be bound by the mother's lifecycle. The
// seed itself states all three, so the invariant is live for the mother.
//
// SOURCES is an explicit list, and its completeness is the residual this check cannot close (the
// E-024 shape). A prose scan for "Stage N" would be worse than no check: this repository carries ~19
// correct PROVENANCE mentions ("the Stage 2 exit criterion", "the Stage 1 organ") that a scan cannot
// tell from a current-state claim. So each source declares ONE canonical form, and adding a place
// that states the stage means adding it here.
import { readRepoFile } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const LAW = "LAW-2 — legible and enforceable, or it doesn't exist";
const ID = 'seed/validate-stage';

interface StageSource {
  file: string;
  re: RegExp;   // one canonical form, so the reading stays legible (LAW-2)
  where: string; // how the failure names the place, for the agent reading it
}

// The reference: the map's Current state bullet.
const MAP: StageSource = {
  file: 'AGENTS.md',
  re: /^- \*\*Stage:\*\* (\d+)\b/m,
  where: 'the "- **Stage:**" bullet',
};

// Every other place the stage is hand-stated.
const SOURCES: StageSource[] = [
  { file: '.seed/checks/fitness.ts', re: /^const CURRENT_STAGE = (\d+)\b/m, where: 'CURRENT_STAGE' },
  // The public front door (ring 0004). Added by E-025 after it sat ten days at "Stage 2" while the
  // repo ran at Stage 4 — the stage's third hand-bumped place, outside a gate built for two.
  { file: 'README.md', re: /currently at \*\*Stage (\d+)\b/, where: 'the "currently at **Stage N**" sentence' },
];

function stageOf(source: StageSource, present: Set<string>): string | null {
  if (!present.has(source.file)) return null;
  return readRepoFile(source.file).match(source.re)?.[1] ?? null;
}

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const present = new Set(files);
    // Presence of the map is validate-anatomy's invariant; this check owns only AGREEMENT.
    const mapStage = stageOf(MAP, present);
    if (mapStage === null) {
      return { summary: `stage agreement not applicable (no canonical stage line in ${MAP.file})`, violations: [] };
    }

    const violations: Violation[] = [];
    const agreeing: string[] = [MAP.file];

    for (const source of SOURCES) {
      const stage = stageOf(source, present);
      if (stage === null) continue; // a host that does not state it here is not bound (ring 0035)
      if (stage === mapStage) {
        agreeing.push(source.file);
        continue;
      }
      violations.push({
        check: ID,
        law: LAW,
        problem: `growth stage disagrees: ${MAP.file} states stage ${mapStage} but ${source.file} states ${stage} (${source.where})`,
        fix: `a stage transition bumps every place by hand (SEED.md §4) — one was missed. Make ${source.where} in ${source.file} name stage ${mapStage}, or correct the map. A place that states the stage and is not listed in SOURCES is unchecked: add it there too.`,
      });
    }

    return {
      summary:
        violations.length === 0
          ? `stage agrees: ${agreeing.join(', ')} all state stage ${mapStage}`
          : `stage disagreement against ${MAP.file} (stage ${mapStage}) in ${violations.length} place(s)`,
      violations,
    };
  },
};
