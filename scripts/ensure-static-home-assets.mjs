import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Dependency bumps change package-lock.json, which is a deliberate hash input,
// so prebuild regenerates the static homepage instead of failing on every
// lockfile-only PR. The check script itself stays fail-closed.
const healable = /Static homepage (?:inputs changed|(?:css|html) output hash is stale|asset manifest is incomplete)/;
const scripts = dirname(fileURLToPath(import.meta.url));

function run(script, stdio) {
  return execFileSync(process.execPath, [join(scripts, script)], { encoding: "utf8", stdio });
}

try {
  process.stdout.write(run("check-static-home-assets.mjs", "pipe"));
} catch (error) {
  const stderr = String(error.stderr ?? "");
  if (!healable.test(stderr)) {
    process.stderr.write(stderr);
    process.exit(error.status ?? 1);
  }
  console.warn("Static homepage output is stale; running sync:static-home before the build");
  run("sync-static-home-assets.mjs", "inherit");
  run("check-static-home-assets.mjs", "inherit");
}
