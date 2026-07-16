// The lineage schema — the SINGLE definition (LAW-3) of what a seed records about its origin
// (SEED.md §7: seed version, parent, date planted). Shared by the feedback composer
// (.seed/checks/feedback.ts), which reads a target's lineage to address an upstream issue, and the
// pollen boundary check (.seed/checks/validate-pollen.ts), which validates the seed's own lineage is
// present and well-formed. One reader, one schema, so the two organs cannot silently drift on what a
// lineage IS — the exact two-places-unchecked shape ledger E-011 records, closed by construction.
//
// "Seed version" (SEED.md §7) is the POLLEN version the seed carries: a descendant is planted FROM a
// pollen release, so the number that answers "which seed do you carry" is the pollen line, not the
// genome's. The founding ring 0026 fixes this — genome version and pollen version are the two lines,
// never conflated; lineage's `seedVersion` is the pollen one, and `genomeVersion` optionally records
// the genome line alongside it. `planted` is a recorded fact, never a wall-clock read (ring 0020),
// so a given lineage reads back byte-identically.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Where a seed records its lineage (SEED.md §7 / pollen/README.md). */
export const LINEAGE_PATH = 'pollen/lineage.json';

export interface Lineage {
  parent?: string; // "owner/repo" of the mother seed; absent (or null) at the root of a lineage
  seedVersion?: string; // the POLLEN version this seed carries (SEED.md §7 "seed version")
  genomeVersion?: string; // the GENOME version this seed carries (the second, distinct line)
  planted?: string; // date planted, YYYY-MM-DD — a recorded value, never a wall-clock read (ring 0020)
  repo?: string; // this seed's own name, if it records one
}

/**
 * Read pollen/lineage.json under `root`, or null if absent. A present-but-malformed file throws a
 * legible error (callers convert it to a violation rather than crashing — the feedback /
 * validate-pollen contract). Non-string fields come back undefined, so a `parent: null` (the root
 * case) reads as no parent, exactly as feedback's rootless-seed branch expects.
 */
export function readLineage(root: string): Lineage | null {
  const path = join(root, LINEAGE_PATH);
  if (!existsSync(path)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    throw new Error(`${LINEAGE_PATH} is present but is not valid JSON — fix it or remove it (SEED.md §7 lineage: seed version, parent, date planted).`);
  }
  if (parsed === null || typeof parsed !== 'object') {
    throw new Error(`${LINEAGE_PATH} is present but is not a JSON object with { parent, seedVersion, planted }.`);
  }
  const o = parsed as Record<string, unknown>;
  const str = (k: string): string | undefined => (typeof o[k] === 'string' ? (o[k] as string) : undefined);
  return {
    parent: str('parent'),
    seedVersion: str('seedVersion'),
    genomeVersion: str('genomeVersion'),
    planted: str('planted'),
    repo: str('repo'),
  };
}
