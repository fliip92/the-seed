// The pollen manifest — the SINGLE source of truth (LAW-3) for the Stage 3 portable boundary
// (founding ring 0026, plan 0005 scope item 1). It answers three questions the genome left open:
//
//   1. What is PORTABLE — the method, grafted into descendants and locally adaptable (the skills and
//      the machinery). A whole subtree: a new file inside is portable by construction.
//   2. What is SOVEREIGN to the mother — the frame (the genome). Carried into every descendant,
//      amended only her way (a law needs a Gardener-approved PR + ring, SEED.md §1).
//   3. What is LOCAL history — the map, the plans/rings/ledger/fitness a seed writes about ITSELF.
//      Never portable; each seed grows its own. Pollen ships TEMPLATES for these, not the mother's
//      instances (the templates land with the installer, plan 0005 scope item 3).
//
// Plus the two version LINES the ring fixed, never conflated: the genome version (the constitution's
// line, authoritative in SEED.md) and the pollen version (this portable distribution's line, semver).
//
// validate-pollen.ts checks this manifest is COMPLETE — every top-level repo entry is classified into
// exactly one tier, so the boundary stays total and honest as the seed grows — and that the version
// lines and the seed's lineage (pollen/lineage.json) are well-formed.
//
// This module lives in .seed/, which is PORTABLE, so a descendant carries the manifest and can define
// its OWN boundary and cut its OWN pollen: self-carrying (E-015).
import { readRepoFile } from './repo.ts';

export type Tier = 'sovereign' | 'portable' | 'local';
export type PortableKind = 'skill' | 'machinery' | 'template' | 'protocol';

// The genome version — the constitution's line. Authoritative in SEED.md's header ("genome vX.Y");
// re-stated here for the release tooling and CROSS-CHECKED against SEED.md by validate-pollen, so the
// two can never silently disagree (the E-011 two-places-unchecked shape, checked). Shape X.Y.
export const GENOME_VERSION = '0.1';

// The pollen version — this portable distribution's line, independent of the genome's. Semver
// (X.Y.Z). 0.0.0 = the boundary and the version line are established (this scope item) but no release
// is cut yet; the first graftable release is cut by the release tool (plan 0005 scope item 2).
export const POLLEN_VERSION = '0.0.0';

export interface PortableRoot {
  path: string; // a top-level repo entry (a directory subtree, or a file)
  kind: PortableKind;
}

// PORTABLE — the method. Whole subtrees.
export const PORTABLE: PortableRoot[] = [
  { path: '.seed', kind: 'machinery' }, // the checks, lib, self-tests, CI defs — the enforcement
  { path: 'skills', kind: 'skill' }, // the skill garden — the reusable capability
  // The installer's scaffolding templates (plan 0005 scope item 3, ring 0028) live inside .seed/ — as
  // strings in .seed/lib/graft.ts, a whole-subtree member of the portable root above (a new file inside
  // is portable by construction), so no new top-level entry is needed. A .ts data module keeps them
  // invisible to the mother's own .md-only validate-map/doc-drift, which a .md template would trip.
];

// SOVEREIGN — the frame. The genome; carried into every descendant, amended only the mother's way.
export const SOVEREIGN: string[] = ['SEED.md'];

// LOCAL — the history each seed grows itself; never portable. Enumerated by name (not "everything
// else") so the boundary stays TOTAL and HONEST: a new top-level entry belongs to exactly one tier,
// and an unclassified one FAILS the completeness check rather than defaulting silently to local.
export const LOCAL: string[] = [
  'AGENTS.md', // the map — host-specific; pollen ships an AGENTS.md TEMPLATE, not this instance
  'docs', // rings, plans, ledger, principles, fitness, assessments, postmortems, references, generated
  'pollen', // this seed's built distribution + its own lineage.json
  'README.md', // the seed's human front door
  'LICENSE',
  'package.json',
  '.github', // this seed's own CI instances
  '.gitignore',
  '.gitattributes',
];

/** Every top-level path the manifest classifies, with its tier — the single enumeration the
 *  completeness check compares the real tree against. */
export function classified(): Map<string, Tier> {
  const m = new Map<string, Tier>();
  for (const s of SOVEREIGN) m.set(s, 'sovereign');
  for (const p of PORTABLE) m.set(p.path, 'portable');
  for (const l of LOCAL) m.set(l, 'local');
  return m;
}

export interface BoundaryResult {
  unclassified: string[]; // top-level entries the manifest assigns to no tier — the completeness gap
  missing: string[]; // manifest paths absent from the tree — a boundary pointing at nothing
}

/**
 * Classify the actual top-level entries against the manifest. `topLevel` is the set of first path
 * segments present in the tree (derived from the file list the checks already walk). The boundary is
 * complete iff every real entry is classified AND every classified path is real.
 */
export function classifyBoundary(topLevel: Set<string>): BoundaryResult {
  const map = classified();
  const unclassified = [...topLevel].filter((e) => !map.has(e)).sort();
  const missing = [...map.keys()].filter((p) => !topLevel.has(p)).sort();
  return { unclassified, missing };
}

/** The tier a top-level entry is classified as, or undefined if the manifest omits it. */
export function tierOf(topLevelEntry: string): Tier | undefined {
  return classified().get(topLevelEntry);
}

/** Semver shape (X.Y.Z) — the pollen version line. */
export function isSemver(v: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(v);
}

/** Genome version shape (X.Y) — the constitution's line, as SEED.md states it ("genome vX.Y"). */
export function isGenomeVersion(v: string): boolean {
  return /^\d+\.\d+$/.test(v);
}

/** The genome version SEED.md declares in its header ("genome vX.Y"), or null if the line is absent —
 *  the single authoritative source the manifest's GENOME_VERSION is cross-checked against. */
export function readGenomeVersion(root: string): string | null {
  const m = readRepoFile('SEED.md', root).match(/genome v(\d+\.\d+)/);
  return m ? m[1] : null;
}
