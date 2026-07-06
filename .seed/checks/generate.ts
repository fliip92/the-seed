// Regenerates every artifact in the generation manifest (.seed/lib/generated.ts) into
// docs/generated/. This is the ONE command the docs/generated/ discipline points at: a
// generated artifact is never hand-edited (SEED.md §2) — the fix goes into the source or the
// generator, then `npm run generate` rewrites the artifact, and validate-generated proves the
// committed file matches. Run: `npm run generate` (or: node .seed/checks/generate.ts). Ring 0020.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from '../lib/repo.ts';
import { MANIFEST } from '../lib/generated.ts';

for (const entry of MANIFEST) {
  writeFileSync(join(REPO_ROOT, entry.artifact), entry.generate(REPO_ROOT));
  console.log(`✓ generated ${entry.artifact} from ${entry.sources.join(', ')}`);
}

console.log(
  `\n${MANIFEST.length} artifact(s) generated. Commit the result — never hand-edit them` +
    ` (docs/generated/README.md); \`npm run check\` proves each matches its source.`,
);
