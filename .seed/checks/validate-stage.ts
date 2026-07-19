// Enforces that the growth stage, hand-maintained in two places, AGREES between them (E-011,
// ring 0035): AGENTS.md's "- **Stage:** N" prose (the map's Current state) and CURRENT_STAGE in
// .seed/checks/fitness.ts (the number stamped into every fitness snapshot). Both are bumped by
// hand on a Gardener-approved stage transition — fitness.ts deliberately keeps that decision
// manual (SEED.md §4) — and nothing checked they agree, so a forgotten bump would silently
// mislabel every snapshot's stage. This verifies the hand-bump; it does not mechanize the decision.
//
// Fires ONLY when both numbers are stated and they DIFFER — the precise agreement E-011 prices.
// It is deliberately silent when the map states no stage: run-all.ts is portable (ring 0026), so a
// grafted host carries this check and the copied fitness.ts (with the mother's CURRENT_STAGE), but
// its map template tracks no genome stage — a descendant must not be bound by the mother's
// lifecycle. The seed itself always states both, so the invariant is live for the mother.
import { readRepoFile } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';

const LAW = "LAW-2 — legible and enforceable, or it doesn't exist";
const ID = 'seed/validate-stage';
const MAP = 'AGENTS.md';
const FITNESS = '.seed/checks/fitness.ts';

// One canonical form each, so the reading stays legible (LAW-2): the map states the stage as a
// "- **Stage:** N" bullet in its Current state, fitness.ts as `const CURRENT_STAGE = N`.
const MAP_STAGE_RE = /^- \*\*Stage:\*\* (\d+)\b/m;
const FITNESS_STAGE_RE = /^const CURRENT_STAGE = (\d+)\b/m;

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const present = new Set(files);
    // Presence of both files is validate-anatomy's invariant; this check owns only their AGREEMENT.
    if (!present.has(MAP) || !present.has(FITNESS)) {
      return { summary: `stage agreement not applicable (${MAP} or ${FITNESS} absent)`, violations: [] };
    }

    const mapStage = readRepoFile(MAP).match(MAP_STAGE_RE)?.[1] ?? null;
    const fitnessStage = readRepoFile(FITNESS).match(FITNESS_STAGE_RE)?.[1] ?? null;

    // Silent unless BOTH are stated: a host whose map tracks no genome stage is not subject to this
    // (ring 0035); the seed, which always states both, is.
    if (mapStage === null || fitnessStage === null) {
      return { summary: `stage agreement not applicable (no canonical stage line in ${MAP})`, violations: [] };
    }

    const violations: Violation[] = [];
    if (mapStage !== fitnessStage) {
      violations.push({
        check: ID,
        law: LAW,
        problem: `growth stage disagrees: ${MAP} states stage ${mapStage} but ${FITNESS} sets CURRENT_STAGE ${fitnessStage}`,
        fix: `a stage transition bumps both by hand (SEED.md §4) — one was missed. Make the "- **Stage:**" number in ${MAP} and CURRENT_STAGE in ${FITNESS} name the same stage.`,
      });
    }

    return {
      summary:
        violations.length === 0
          ? `stage agrees: ${MAP} and ${FITNESS} both state stage ${mapStage}`
          : `stage disagreement: ${MAP} ${mapStage} vs ${FITNESS} ${fitnessStage}`,
      violations,
    };
  },
};
