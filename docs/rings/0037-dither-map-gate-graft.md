# Ring 0037 — dither's map gate (graft item 1): the Seed's engine copied verbatim + a thin host-owned runner; dead links gated repo-wide, reachability measured; the committed-tree scope; the 6 pre-existing links fixed; not ring 0028's pure-additive beachhead

- Date: 2026-07-19
- Stage: 4 — Pollination
- Raised-by: seed
- Question: [Plan 0007](../plans/active/0007-dither-graft.md) graft item 1 — the map reachability +
  dead-link gate — is the first mutation of a real external host (dither), authorized in
  [ring 0034](0034-dither-graft-approved.md) and released from its pause by the Gardener. Its
  seed-side half ([E-016](../plans/entropy-ledger.md), `map_reachability` resolves a host's
  `CLAUDE.md`) was already paid. The build questions the plan left to design time: **how** does the
  gate get into dither (install mechanism), **what** does it gate versus merely measure, **which**
  file set does it read, and **how** is dither's pre-existing state handled — a read-only pass found
  the Seed's gate-as-it-runs flags **6 gate-class links** on dither today (5 dead links in a frozen
  feasibility spike, 1 directory link in `docs/architecture.md`), all legitimate under dither's own
  conventions?
- Decision: Built and landed in dither (commit `da6bb24`, pushed to `main`). The design:
  - **Install mechanism — the Seed's engine copied verbatim + one host-owned runner.** dither carries
    `.seed/lib/repo.ts` and `.seed/checks/validate-map.ts` **byte-identical** to the Seed (the
    ring [0028](0028-installer-uninstall.md) portable tier: copied, not forked, so it upgrades by
    re-copy), plus the single file of host judgment,
    [`.seed/checks/map-gate.ts`](https://github.com/fliip92/dither/blob/main/.seed/checks/map-gate.ts) —
    the runner. `.seed/package.json` (`{"type":"module"}`) scopes ESM to `.seed/` so dither's root
    package semantics are untouched. This is a **surgical** graft of one organ, not the full-seed
    beachhead: dither is a well-tended host with its own `CLAUDE.md`, ADRs, and CI, so the graft
    adapts to those surfaces (SEED.md §4 *method, not dogma*), it does not lay down a fresh seed's
    map/plan scaffold.
  - **Gate versus measure — the [ring 0011](0011-drift-advisory.md) split, host-tuned.** The runner
    **gates** (fails CI) on broken or unfollowable links — dead links, directory links, and link
    forms the parser cannot follow — swept **repo-wide** over the committed tree; a link that
    resolves to nothing is a navigation lie wherever it lives. It **measures and only reports**
    `map_reachability` (≤3 hops from `CLAUDE.md`). dither reads **1.4%** today; that low number is the
    real finding, and raising it (a canonical map) is deliberate later Metabolize work — not a CI
    threshold. The Seed's own `validate-map` fuses the two (it fails on unreachable files too) only
    because the Seed is at 100%; a host at 1.4% must not be gated on reachability, or the first graft
    would red-fail its CI — the opposite of *no behavior changes yet*.
  - **File set — the committed tree (`git ls-files`), not the on-disk walk.** The [E-012](../plans/entropy-ledger.md)
    insight applied to a host: dither has gitignored generated docs (`graphify-out/`, build output)
    that the on-disk walk would drag into the gate. Listing the committed repository keeps the gate
    over what dither actually ships. (Distinct from the Seed's own `run-all` gates, which walk the
    working tree to catch uncommitted files — the Seed has no generated-doc noise; dither does.)
  - **The 6 pre-existing links — fixed, per the Gardener's build-time choice.** The plan assumed a
    *seeded* dead link fails an otherwise-clean tree; dither's tree was not clean. Offered
    reachable-set-scoping (gate only the map's reachable set — lands green untouched) versus
    fix-the-6-then-gate-everywhere, the Gardener chose the latter: add
    [`docs/adr/README.md`](https://github.com/fliip92/dither/blob/main/docs/adr/README.md) (an ADR
    index) and repoint `docs/architecture.md` to it; repoint the 5 spike links to the **preserved
    `spike/local-brain` branch** on GitHub (external links, which the parser skips — a minimal,
    frozen-record-preserving fix; all 5 targets verified present on `origin/spike/local-brain`). The
    repo-wide gate then lands green.
  - **Not ring 0028's pure-additive beachhead.** Ring 0028's installer only *creates* new paths and
    refuses to clobber, so uninstall removes exactly that set. Grafting an organ into an **existing**
    host is not that shape: item 1 **modifies existing files** — `ci.yml` (the gate must wire
    somewhere; irreducible) and, per the choice above, six pre-existing broken links. Reversibility
    is therefore *revert the graft commit → byte-identical*, not *remove created paths only*. The
    `.seed/` machinery is cleanly removable; the wiring and link fixes are edits. This extends ring
    0028 for the real-host case ring 0028 did not cover.
- Alternatives considered:
  - **Run the gate via an npx'd pollen package** (no vendoring). Rejected — the Seed publishes no npm
    package, and propagation is re-metabolization, not `npm update`
    ([ring 0026](0026-pollen-boundary-versioning-lineage.md)/[E-015](../plans/entropy-ledger.md)); it
    would also add a network dependency to dither's CI.
  - **Re-implement the gate as a bespoke dither-native script.** Rejected — two divergent copies of
    one algorithm (LAW-7); the graft installs the Seed's *proven, self-tested* organ, not a rewrite,
    and it would discard the E-016 work.
  - **Gate reachability too** (as the Seed does). Rejected — 1.4% would red-fail dither's CI on ~361
    unreachable files; item 1 is *no behavior changes yet*, and raising reachability is later work.
  - **Reachable-set-scoped dead-link gate** (the Scout recommendation — gate only the 5 map-reachable
    docs, leaving the frozen spike and the ADR-directory convention untouched, green with no edits).
    Not chosen — the Gardener preferred whole-repo dead-link coverage with the 6 fixed. Retained as
    the fallback shape if a future host's broken links are *not* trivially fixable.
  - **Backtick or SHA-pin the 5 spike links** instead of branch URLs. Rejected for now — branch URLs
    are the minimal diff that keeps the frozen record navigable; the spike doc's own prose already
    frames the code as living on `spike/local-brain`.
- Enforcement: CI gate (LAW-6). dither's [`.github/workflows/ci.yml`](https://github.com/fliip92/dither/blob/main/.github/workflows/ci.yml)
  runs `node .seed/checks/map-gate.ts` as a fast, install-free step (git + node only). Verified this
  session against dither: **green** on the fixed tree (`broken links: 0`, `map_reachability` 1.3%
  reported); **teeth** — a seeded dead link in the reachable `CLAUDE.md` fails with exit 1 and a
  law-named violation, reverted clean; **no interference** — `.seed/` sits outside dither's pnpm
  workspace globs (`apps/*`, `packages/*`) and is imported by nothing, so `pnpm lint/typecheck/test`
  do not see it. Landed in dither `da6bb24` (pushed to `main`); hosted CI is the standing enforcement.
  The vendored engine is pinned to the Seed's by being copied verbatim (byte-identical, this session).
- Revisit-when: a future host carries broken links that are **not** trivially fixable (forcing the
  scope decision — reachable-set vs a declared-exclusions list — the reachable-set alternative
  returns); the `spike/local-brain` branch is deleted (the 5 external links break, uncaught because
  the gate skips external links — a frozen-doc fragility accepted here); graft items 2–4 add further
  `.seed/` checks into dither (the verbatim-engine + host-runner + `git ls-files` pattern set here
  extends, and the vendored engine may need a re-copy to stay pinned to the Seed); or a host needs the
  ring 0028 pure-additive beachhead rather than this surgical into-an-existing-host graft.
