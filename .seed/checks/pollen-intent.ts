// Enforces that the pending release intents are COMPLETE (converted from ledger E-023): every commit
// since the last cut that touched the portable subtree declares its release intent in
// pollen/pending.md. Ring 0026 fixed the release model — a release is composed from DECLARED intent,
// and the next version is a pure function of the maximum declared impact — but nothing failed when a
// portable change declared nothing, which is the LAW-2 shape exactly: a rule that is legible and not
// enforceable. Three portable-machinery changes had landed since the v0.1.0 cut with no intent (and
// five more the entry had not yet counted), so pending.md — the artifact whose whole job is to be the
// truthful unreleased delta — under-declared it, and the byte-exact-gated pending-release notes
// inherited the omission. A cut freezes that into append-only history: the release would credit two
// decisions while shipping ten changes' worth of behavior, telling a descendant less than it is
// getting.
//
// WHAT IS PORTABLE is the pollen manifest's answer (.seed/lib/pollen.ts PORTABLE), not a second list
// here — the boundary has one definition (LAW-3), and a new file inside a portable root is portable by
// construction, so it is covered the day it lands.
//
// WHAT ACCOUNTS FOR A COMMIT is the decision record it cites: an intent declares `[ring NNNN]` or
// `[plan NNNN]`, and a commit is accounted for when pending.md declares one of the records its message
// names. That is the same citation grammar plan-traceability.ts already enforces on every commit
// (AGENTS.md § Protocols), so the two gates compose: traceability guarantees every commit names a
// decision record, and this gate guarantees a portable one's record is declared. One decision covering
// several commits needs one intent, which is correct — the intent describes the change, not the commit.
//
// A CI gate, not part of run-all.ts: it needs git history, and the content checks deliberately see only
// the working tree. Usage:
//
//   node .seed/checks/pollen-intent.ts
//
// It takes NO base ref, unlike its git-aware siblings (ring-append-only, release-append-only,
// plan-traceability), and that difference is deliberate: those gates judge a DIFF (what this push
// changed), while this one asserts a STATE (pending.md accounts for everything unreleased). The window
// is therefore fixed by the release history — the commit that added the newest pollen/releases/vX.Y.Z.md
// — not by the event's base. The property that buys: a green run is the precondition for a cut, so the
// cut cannot freeze an omission that CI has already passed on. When the window cannot be resolved (not a
// git repository, a shallow clone whose history omits the cut) the gate skips with a note rather than
// guessing — a descendant that grafted the machinery but not this seed's history must degrade, not fail.
import { REPO_ROOT, extractPlanRingRefs, formatViolation, git, gitRootStatus } from '../lib/repo.ts';
import type { Violation } from '../lib/repo.ts';
import { PORTABLE } from '../lib/pollen.ts';
import { PENDING_PATH, decisionLabel, latestReleased, readPending } from '../lib/release.ts';

const ID = 'seed/pollen-intent';
const LAW = "LAW-2 — legible and enforceable, or it doesn't exist";

const PORTABLE_PATHS = PORTABLE.map((p) => p.path);

const skip = (reason: string): never => {
  console.log(`${ID}: ${reason} — gate skipped here.`);
  process.exit(0);
};

const rootStatus = gitRootStatus(REPO_ROOT);
if (!rootStatus.ok) skip(rootStatus.note);

// The window: everything after the commit that CUT the latest release. Keyed on the release file's
// add-commit rather than its recorded date, because the boundary must be a point in history the
// commit walk can start from, and the date is a recorded fact that may not match when it landed.
const latest = latestReleased(REPO_ROOT);
let boundary: string | null = null;
if (latest !== '0.0.0') {
  const file = `pollen/releases/v${latest}.md`;
  const adds = (git(REPO_ROOT, ['log', '--diff-filter=A', '--format=%H', '--', file]) ?? '')
    .split('\n')
    .filter((l) => l !== '');
  if (adds.length === 0) {
    skip(
      `the commit that cut v${latest} (${file}) is not in this history — an uncommitted cut, or a shallow clone; the full-history run still applies it`,
    );
  }
  boundary = adds[adds.length - 1]; // the earliest add: when the release was first recorded
}

const range = boundary === null ? [] : [`${boundary}..HEAD`];
const walk = git(REPO_ROOT, ['log', '--no-merges', '--format=%H', ...range, '--', ...PORTABLE_PATHS]);
if (walk === null) skip('git could not walk the portable subtree history');
const commits = (walk as string).split('\n').filter((sha) => sha !== '');

// The declared set, read from the working tree (the same source validate-release gates): a change and
// its declaration land together, so the tree under test is the honest one to ask.
const { intents } = readPending(REPO_ROOT);
const declared = new Set(intents.map(decisionLabel));

const violations: Violation[] = [];
for (const sha of commits) {
  const message = git(REPO_ROOT, ['show', '-s', '--format=%B', sha]) ?? '';
  const refs = extractPlanRingRefs(message);
  if (refs.some((r) => declared.has(`${r.kind} ${r.num}`))) continue;

  const subject = message.split('\n')[0];
  const touched = (git(REPO_ROOT, ['show', '--name-only', '--format=', '--no-renames', sha, '--', ...PORTABLE_PATHS]) ?? '')
    .split('\n')
    .filter((f) => f !== '');
  const cited = refs.length === 0 ? 'no plan or ring' : [...new Set(refs.map((r) => `${r.kind} ${r.num}`))].join(', ');
  violations.push({
    check: ID,
    law: LAW,
    problem: `commit ${sha.slice(0, 12)} ("${subject}") changed the portable subtree (${touched.slice(0, 3).join(', ')}${touched.length > 3 ? `, +${touched.length - 3} more` : ''}) but ${PENDING_PATH} declares no intent for it — it cites ${cited}`,
    fix: `declare the change in ${PENDING_PATH}: "- Impact: <major|minor|patch> — [<plan|ring> NNNN](../docs/<record>) — <one-line summary>", citing a decision record this commit names. A release is composed from declared intent (ring 0026), so an undeclared portable change ships to descendants inside a version whose notes do not mention it — and a cut freezes that omission into append-only history. Declare it in the same commit that makes the change; if it already landed, declare it now, before the next cut.`,
  });
}

const window = boundary === null ? 'the whole history (no release cut yet)' : `v${latest} (${boundary.slice(0, 12)})`;
if (violations.length > 0) {
  console.log(`✗ ${ID} — ${violations.length} violation(s)`);
  for (const v of violations) console.log(formatViolation(v));
  process.exit(1);
}
console.log(
  commits.length === 0
    ? `✓ ${ID} — no portable-subtree commits since ${window}`
    : `✓ ${ID} — all ${commits.length} portable-subtree commit(s) since ${window} are declared in ${PENDING_PATH} (${intents.length} intent(s))`,
);
