import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import test from "node:test";

const repository = process.cwd();
const checkScript = join(repository, "scripts/check-static-home-assets.mjs");

function temporaryCopy() {
  const directory = mkdtempSync(join(tmpdir(), "static-home-check-"));
  cpSync(repository, directory, {
    recursive: true,
    filter(source) {
      const path = relative(repository, source);
      return !path.split("/").some((part) => [".git", ".next", "node_modules"].includes(part));
    },
  });
  return directory;
}

function check(directory) {
  return execFileSync(process.execPath, [checkScript], { cwd: directory, encoding: "utf8", stdio: "pipe" });
}

test("detects changed static homepage inputs without compiling CSS", () => {
  const directory = temporaryCopy();
  try {
    writeFileSync(join(directory, "src/app/globals.css"), `${readFileSync(join(directory, "src/app/globals.css"), "utf8")}\n/* stale test */\n`);
    assert.throws(() => check(directory), /Static homepage inputs changed/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("detects tampered committed static homepage output", () => {
  const directory = temporaryCopy();
  try {
    const manifest = readFileSync(join(directory, "src/generated/static-home-assets.ts"), "utf8");
    const cssPath = JSON.parse(manifest.match(/staticHomeCss = ("[^"]+")/)?.[1] ?? "");
    writeFileSync(join(directory, "public", cssPath.slice(1)), "tampered");
    assert.throws(() => check(directory), /css output hash is stale/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
