# Architecture — dither

- One-liner: A pnpm monorepo where a thin stateless Gateway holds zero droid state — knowledge, personality, and history live on-device and travel only as the Ed25519-signed `.droid` cartridge.

## Shape

Three surfaces over three shared packages. **Workshop** (static Vite + R3F) mints droids; **Phone** (Expo, on-device SQLite) runs chat + droid life; **Gateway** (Hono on Cloudflare Workers + D1) proxies the model, ingests telemetry, and signs mints — holding **zero droid state** (ADR-0001). Packages: `droid-file` (cartridge schema, pack/unpack, seal), `traits` (Trait Vector → Persona Card → Matrix Identity), `matrix` (deterministic engine + shared WGSL). Direction: apps depend on packages, never the reverse; `traits` and `theme` are the dependency-free foundation, `droid-file` and `matrix` build on `traits` (and `matrix-playground` on `matrix` + `traits`); the Gateway shares only `droid-file`/`traits`. The signed cartridge is the sole portable form — its Sealed Section is never re-serialized after mint (ADR-0003/0007). Rationale in nine ADRs; vocabulary in `CONTEXT-MAP.md`. The seed grafts an *enforcement* layer over this legible base; it does not restate the product design (method, not dogma).

## Rules

- Root `CLAUDE.md` is the canonical agent map; every knowledge artifact is reachable ≤3 hops from it, no dead links — Enforcement: CI gate (reachability + dead-link), built at Graft; `map_reachability` is taught dither's filename (pays E-016).
- Referenced `CONTEXT.md` files resolve, but coverage is lazy — a context earns one only when needed (not all six) — Enforcement: lint (the dead-link gate); coverage itself is doc-only by decision (ring 0033).
- ADRs (`docs/adr/`) are the authoritative in-repo decision record; a commit enacting a decision cites its ADR — Enforcement: CI gate (commit→ADR traceability), built at Graft.
- Every norm CI enforces is stated as a principle naming its enforcer (`ci.yml` runs lint + typecheck + test) — Enforcement: CI gate (enforcement_ratio over stated principles).
- App→package direction and package independence hold as written (`traits`/`theme` foundational; `droid-file` and `matrix` build on `traits`; `matrix-playground` on `matrix` + `traits`; the Gateway shares only `droid-file`/`traits`) — Enforcement: CI gate (the import-boundary structural test), built at Metabolize (plan 0009 / E-001, ring 0041). The graph as first elicited here was drifted — it read `traits` and `matrix` building on `droid-file` (from `architecture.md`'s build-order note); E-001's pre-flight caught the inversion and corrected the target to the code (fix docs to code) before enforcing it.
- Unpriced entropy (the deferred list, risk register, spikes) gets a rate and a conversion path — Enforcement: doc-only until the ledger is seeded at Graft, then ledger_trend.

## Ownership

- Human (Gardener, also dither's owner): intent, priorities, taste; the canonical-map choice; ADRs-over-Issues; the lazy-context convention; approval of the Propose step before any graft (LAW-1).
- Agent (Seed): the read-only Scout (done) and this elicitation; then the map + reachability/dead-link lint, the commit→ADR gate, the `ci.yml` principles, and the seeded ledger once Propose is approved — all the judgments above do not reserve.
