// Gates the ENVELOPE of the seed's inferential control (ring 0030; E-013) — the deterministic half of
// a probabilistic instrument. A verdict (docs/judgments/NNNN-slug.md) is an LLM-as-judge's score of an
// artifact against a stated rubric; the SCORE itself is probabilistic and is NEVER gated here (ring
// 0011's advisory posture — hard-gating a probabilistic number would pretend it is deterministic, the
// exact error E-013 warns against). What IS gated is everything deterministic ABOUT the verdict, so the
// judgment is legible, its inputs are pinned, and it cannot silently rot:
//
//   1. WELL-FORMED (LAW-2) — a numbered filename + matching title, a known rubric+version, a Model and a
//      Date (recorded facts, ring 0020), and a Score in the rubric's range with a real Rationale. An
//      unfilled skeleton (a `<placeholder>` left in Model/Score/Rationale) is caught — a verdict is a
//      real judgment or it does not exist.
//   2. PINS RESOLVE (LAW-2) — the Artifact it judged and any in-repo Source it names EXIST, and each
//      carries a content pin. A verdict pinning a file that is gone judges nothing.
//   3. FRESH (LAW-6) — the pinned artifact hash equals the artifact's CURRENT content (same for an
//      in-repo source). A STALE verdict — the thing it judged changed after it was judged — FAILS: a
//      probabilistic verdict silently trusted after its subject moved is trust taken on faith. Freshness
//      is deterministic, so gating it does not pretend the judgment is.
//
// COVERAGE (which artifacts carry a verdict) is reported ADVISORILY, not gated: requiring a verdict on
// every reference would couple run-all to a host model act (the judgment is a compose-not-commit host
// act, ring 0021), and the drift-signal posture (ring 0011) is the honest one for v0. The model
// (.seed/lib/judge.ts) is the single source of truth this check reads (LAW-3); the CLI that assembles a
// judgment (.seed/checks/judge.ts) is side-effecting and lives OUT of run-all.
//
// Vacuous while docs/judgments/ holds only its README (the validate-references / validate-assessments
// pattern): the format binds the moment the first verdict lands.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from '../lib/repo.ts';
import type { Check, CheckResult, Violation } from '../lib/repo.ts';
import {
  JUDGMENTS_DIR,
  RUBRICS,
  SCORE_MAX,
  SCORE_MIN,
  readVerdicts,
  rubricFor,
  staleness,
  type Verdict,
} from '../lib/judge.ts';

const LAW2 = "LAW-2 — legible and enforceable, or it doesn't exist";
const LAW6 = 'LAW-6 — every capability ships with its own verification';
const ID = 'seed/validate-judgments';

const REFERENCES_DIR = 'docs/references';
const PLACEHOLDER_RE = /^<[\s\S]*>$/; // a `<…>` value left unfilled from the verdict skeleton

export const check: Check = {
  id: ID,
  run(files: string[]): CheckResult {
    const violations: Violation[] = [];
    const bad = (law: string, problem: string, fix: string): void => void violations.push({ check: ID, law, problem, fix });
    const present = new Set(files);

    // A direct .md child of docs/judgments/ that is not the README but does NOT match NNNN-slug.md is a
    // misfiled verdict — caught here rather than silently ignored by readVerdicts' numbered filter.
    for (const f of files) {
      if (!f.startsWith(`${JUDGMENTS_DIR}/`) || f === `${JUDGMENTS_DIR}/README.md` || !f.endsWith('.md')) continue;
      if (f.slice(JUDGMENTS_DIR.length + 1).includes('/')) continue; // a rubric/corpus staged deeper is not a verdict
      const base = f.slice(JUDGMENTS_DIR.length + 1);
      if (!/^\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(base)) {
        bad(
          LAW2,
          `${f} does not match the verdict filename format NNNN-slug.md`,
          'name a verdict NNNN-slug.md (numbered like rings), e.g. 0001-faithfulness-harness-engineering.md — the format is in docs/judgments/README.md.',
        );
      }
    }

    const verdicts = readVerdicts(REPO_ROOT);

    // Duplicate numbers — two verdicts claiming the same NNNN is genuine ambiguity (gaps are allowed:
    // judgments are records that accumulate as artifacts are judged, not an append-only decision log
    // whose density is load-bearing, so they are not sequence-checked the way rings are).
    const byNumber = new Map<string, Verdict[]>();
    for (const v of verdicts) (byNumber.get(v.number) ?? byNumber.set(v.number, []).get(v.number)!).push(v);
    for (const [num, vs] of byNumber) {
      if (vs.length > 1) {
        bad(LAW2, `duplicate judgment number ${num}: ${vs.map((v) => v.file).join(', ')}`, `renumber one — each verdict has a unique NNNN (the next free is ${String(Math.max(...verdicts.map((v) => Number(v.number))) + 1).padStart(4, '0')}).`);
      }
    }

    for (const v of verdicts) {
      const where = v.file;

      // 1. well-formed — title, rubric, model, date, score, rationale.
      if (v.titleNumber === null) {
        bad(LAW2, `${where} first line is not a valid verdict title`, 'start the file with `# Judgment NNNN — <what was judged>` (docs/judgments/README.md).');
      } else if (v.titleNumber !== v.number) {
        bad(LAW2, `${where} title number ${v.titleNumber} does not match filename number ${v.number}`, 'make the `# Judgment NNNN` title match the filename number — a mislabeled verdict is a retrieval hazard.');
      }

      if (v.rubricName === null || v.rubricVersion === null) {
        bad(LAW2, `${where} has no valid Rubric line`, `record "- Rubric: <name> v<version>", e.g. "- Rubric: faithfulness v1" — a verdict pins WHICH rubric judged it (ring 0030). Known: ${RUBRICS.map((r) => `${r.name} v${r.version}`).join(', ')}.`);
      } else if (rubricFor(v.rubricName, v.rubricVersion) === undefined) {
        bad(LAW2, `${where} names an unknown rubric or version: ${v.rubricName} v${v.rubricVersion}`, `point it at a rubric in the registry (.seed/lib/judge.ts): ${RUBRICS.map((r) => `${r.name} v${r.version}`).join(', ')}. A new rubric is a new registry entry (ring 0030).`);
      }

      if (v.model === null || v.model.trim() === '' || PLACEHOLDER_RE.test(v.model.trim())) {
        bad(LAW2, `${where} names no judging model`, 'record "- Model: <the model id that judged>" — a verdict names its judge (LAW-9: a judgment is reproducible enough to trend only if it says who judged, against what, when). Fill the skeleton\'s placeholder.');
      }
      if (v.date === null) {
        bad(LAW2, `${where} has no valid YYYY-MM-DD Date`, 'record "- Date: YYYY-MM-DD" — the judgment date is a recorded fact (ring 0020); the dated verdicts are the trend record (LAW-9).');
      }

      if (v.score === null || v.scoreMax === null) {
        bad(LAW2, `${where} has no valid Score`, `record "- Score: <n> / ${SCORE_MAX}" with an integer n — an unfilled skeleton placeholder is not a score. The scale is ${SCORE_MIN}–${SCORE_MAX} (the rubric).`);
      } else {
        if (v.scoreMax !== SCORE_MAX) bad(LAW2, `${where} Score is out of "/ ${v.scoreMax}" — the scale is / ${SCORE_MAX}`, `record the score as "<n> / ${SCORE_MAX}" (the rubric's scale, .seed/lib/judge.ts).`);
        if (v.score < SCORE_MIN || v.score > SCORE_MAX) bad(LAW2, `${where} Score ${v.score} is outside the ${SCORE_MIN}–${SCORE_MAX} scale`, `score within ${SCORE_MIN}–${SCORE_MAX} (the rubric). The score is trended, never a gate (ring 0011) — but it must be on the scale.`);
      }

      if (v.rationale === '' || PLACEHOLDER_RE.test(v.rationale)) {
        bad(LAW2, `${where} has no Rationale (or left the skeleton placeholder)`, 'write a "## Rationale" section justifying the score against the rubric, citing the claims that earned or lost points. The rationale IS the inferential verdict — the one thing the machinery cannot compute (E-013); a bare number is not a judgment.');
      }

      // 2. pins resolve — the Artifact it judged, and any in-repo Source, exist and are pinned.
      if (v.artifactPath === null) {
        bad(LAW2, `${where} has no Artifact link`, 'record "- Artifact: [path](rel) — content sha256:… " naming and pinning the artifact judged (docs/judgments/README.md).');
      } else if (!present.has(v.artifactPath)) {
        bad(LAW2, `${where} pins an artifact that does not exist: ${v.artifactPath}`, 'point the Artifact link at a file that exists — a verdict pinning a vanished file judges nothing. Re-run `npm run judge prepare` for the current artifact.');
      } else if (v.artifactPin === null) {
        bad(LAW2, `${where} names an artifact but pins no content hash`, 'add the artifact\'s content pin ("— content sha256:…") — the pin is what makes staleness detectable (ring 0030). `npm run judge prepare` computes it.');
      }

      // Source: required (v0's faithfulness judges against a source). Either an in-repo pinned file, or
      // an honest "external" declaration (the ring-0024 boundary: an external corpus is not mirrored, so
      // it cannot be pinned).
      const hasSourceField = v.sourcePath !== null || v.sourceExternal;
      if (!hasSourceField) {
        bad(LAW2, `${where} has no Source line`, 'record "- Source: [path](rel) — content sha256:…" for an in-repo source, or "- Source: external — …" when it is not mirrored (ring 0024). A faithfulness verdict names what it judged against.');
      } else if (v.sourcePath !== null) {
        if (!present.has(v.sourcePath)) {
          bad(LAW2, `${where} pins a source that does not exist: ${v.sourcePath}`, 'point the Source link at a file that exists, or declare the source "external" if it is not in-repo (ring 0024).');
        } else if (v.sourcePin === null) {
          bad(LAW2, `${where} names an in-repo source but pins no content hash`, 'add the source\'s content pin ("— content sha256:…") so a source edit is caught as staleness (ring 0030).');
        }
      }

      // 3. fresh — the deterministic teeth. A verdict whose pinned artifact/source hash no longer matches
      // the current content is STALE: what it judged has moved, so the verdict must be re-earned.
      const stale = staleness(v, REPO_ROOT);
      if (stale.stale) {
        bad(
          LAW6,
          `${where} is STALE — ${stale.reason}`,
          're-judge the artifact and update the verdict (`npm run judge prepare` recomputes the pins), or restore the artifact. A verdict trusted after its subject changed is trust taken on faith (LAW-6); staleness is the deterministic tooth of a probabilistic control (ring 0030).',
        );
      }
    }

    // Coverage — advisory (ring 0011): how many distilled references carry a fresh faithfulness verdict.
    const references = files.filter(
      (f) => f.startsWith(`${REFERENCES_DIR}/`) && f !== `${REFERENCES_DIR}/README.md` && f.endsWith('.md') && !f.slice(REFERENCES_DIR.length + 1).includes('/'),
    );
    const freshFaithful = new Set(
      verdicts
        .filter((v) => v.rubricName === 'faithfulness' && v.artifactPath !== null && !staleness(v, REPO_ROOT).stale && (v.artifactPath ? existsSync(join(REPO_ROOT, v.artifactPath)) : false))
        .map((v) => v.artifactPath),
    );
    const judgedRefs = references.filter((r) => freshFaithful.has(r)).length;
    const coverage = references.length === 0 ? '' : `; ${judgedRefs}/${references.length} reference(s) carry a fresh faithfulness verdict`;

    return {
      summary: `${verdicts.length} verdict(s) valid${coverage}`,
      violations,
    };
  },
};
