// Enforces the pure release invariants (founding ring 0026's model; build ring 0027) — the half of
// the release mechanism that is a pure function of the working tree, so it gates in run-all (the
// validate-generated shape). Four fronts:
//
//   1. PENDING INTENTS (LAW-2) — every intent in pollen/pending.md is well-formed (the declared
//      grammar, ring 0026) and names an EXISTING ring. A malformed or dangling intent cannot compose a
//      release, so it is caught here rather than surfacing as a bad version bump later.
//   2. RELEASE FILES (LAW-2) — every pollen/releases/vX.Y.Z.md records a valid impact class, a
//      YYYY-MM-DD date (a recorded fact, ring 0020), at least one composing ring, and each composing
//      ring exists. The release history is the changelog; a malformed entry poisons it.
//   3. THE VERSION LINE TRACKS HISTORY (LAW-3) — POLLEN_VERSION (.seed/lib/pollen.ts) equals the
//      latest released version, or 0.0.0 when nothing is released. The manifest's pollen version is the
//      single source (ring 0026); it cannot silently diverge from the history it summarizes. The
//      releases are also strictly increasing (no two the same version).
//   4. THE MIGRATION TOOTH (LAW-2, ring 0026) — a MAJOR release is breaking and cannot be adopted as a
//      pure additive graft, so it MUST carry a migration that exists; a minor/patch carries none. This
//      is the structural half of the tooth; cut-release enforces the same at cut time.
//
// The byte-exactness of the pending-release NOTES (docs/generated/pending-release.md) is validate-
// generated's job (they are a registered generated artifact); this check owns the release DATA the
// notes are computed from. The git-aware APPEND-ONLY property of the history is release-append-only.ts
// (a CI gate, like ring-append-only) — this check sees only the working tree.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';
import { POLLEN_VERSION } from '../lib/pollen.ts';
import {
  PENDING_PATH,
  latestReleased,
  readPending,
  readReleases,
  ringFileFor,
} from '../lib/release.ts';

const LAW2 = "LAW-2 — legible and enforceable, or it doesn't exist";
const LAW3 = 'LAW-3 — invariants over implementations';
const ID = 'seed/validate-release';

export const check: Check = {
  id: ID,
  run(_files: string[]): CheckResult {
    const violations: Violation[] = [];
    const bad = (law: string, problem: string, fix: string): void => void violations.push({ check: ID, law, problem, fix });

    // 1. pending intents — well-formed, and each names an existing ring.
    const pending = readPending(REPO_ROOT);
    for (const err of pending.errors) {
      bad(
        LAW2,
        `${PENDING_PATH}: ${err}`,
        `write the intent as "- Impact: <major|minor|patch> — [ring NNNN](../docs/rings/NNNN-slug.md) — <summary>" — the impact is declared and checked, not free text (ring 0026).`,
      );
    }
    for (const intent of pending.intents) {
      if (ringFileFor(intent.ring, REPO_ROOT) === null) {
        bad(
          LAW2,
          `${PENDING_PATH}: intent references ring ${intent.ring}, which does not exist`,
          `a release's notes enumerate the rings that composed it (ring 0026: the decision log is the changelog) — point the intent at an existing ring in docs/rings/, or cut that ring first.`,
        );
      }
    }

    // 2. release files — valid impact, date, and composing rings that exist.
    const releases = readReleases(REPO_ROOT);
    for (const r of releases) {
      if (r.impact === null) bad(LAW2, `${r.file} declares no valid impact class`, `record "- Impact: major|minor|patch" — a release's impact is its semver bump driver (ring 0026).`);
      if (r.date === null) bad(LAW2, `${r.file} has no valid YYYY-MM-DD Date`, `record "- Date: YYYY-MM-DD" — the release date is a recorded fact (ring 0020).`);
      if (r.rings.length === 0) bad(LAW2, `${r.file} composes no rings`, `record "- Composed: [ring NNNN](…)" — a release enumerates the rings behind it (ring 0026: the decision log is the changelog).`);
      for (const ring of r.rings) {
        if (ringFileFor(ring, REPO_ROOT) === null) {
          bad(LAW2, `${r.file} composes ring ${ring}, which does not exist`, `point it at an existing ring in docs/rings/, or restore the ring — a release's changelog cannot dangle (ring 0026).`);
        }
      }
      // 4. the migration tooth — a major must carry an existing migration; minor/patch carries none.
      if (r.impact === 'major') {
        if (r.migration === null) {
          bad(LAW2, `${r.file} is a MAJOR release but carries no migration`, `a breaking release cannot be adopted as a pure additive graft — it must carry a migration (ring 0026). Record "- Migration: [migration](../migrations/<from>-to-<to>.md)" and add that file.`);
        } else if (!existsSync(join(REPO_ROOT, r.migration))) {
          bad(LAW2, `${r.file} names a migration that does not exist: ${r.migration}`, `create ${r.migration}, or fix the Migration link — a major's migration must exist (ring 0026).`);
        }
      }
    }

    // 3. the version line tracks history (LAW-3): POLLEN_VERSION == the latest released version.
    const latest = latestReleased(REPO_ROOT);
    if (POLLEN_VERSION !== latest) {
      bad(
        LAW3,
        `POLLEN_VERSION is "${POLLEN_VERSION}" but the latest release is "${latest}"`,
        `the pollen version is the single source and tracks the history (ring 0026) — set POLLEN_VERSION in .seed/lib/pollen.ts to "${latest}", or cut/repair the release that should carry "${POLLEN_VERSION}". Before the first release both are 0.0.0.`,
      );
    }

    const pendingNote = pending.intents.length === 0 ? 'no pending intents' : `${pending.intents.length} pending intent(s)`;
    return {
      summary: `release model valid — ${releases.length} release(s), pollen ${POLLEN_VERSION} tracks the history, ${pendingNote}`,
      violations,
    };
  },
};
