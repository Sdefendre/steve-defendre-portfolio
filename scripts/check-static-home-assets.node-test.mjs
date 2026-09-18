import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, relative } from "node:path";
import test from "node:test";

const repository = process.cwd();
const checkScript = join(repository, "scripts/check-static-home-assets.mjs");
const ensureScript = join(repository, "scripts/ensure-static-home-assets.mjs");
const fixtureEnvironment = { ...process.env, NODE_ENV: "production" };
for (const key of ["NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL", "__NEXT_PROCESSED_ENV"]) delete fixtureEnvironment[key];


function temporaryCopy() {
  const directory = mkdtempSync(join(tmpdir(), "static-home-check-"));
  cpSync(repository, directory, {
    recursive: true,
    filter(source) {
      const path = relative(repository, source);
      return !path.split("/").some((part) => [".git", ".next", "node_modules"].includes(part) || part === ".env" || part.startsWith(".env."));
    },
  });
  // The sync step compiles CSS, so the copy borrows the real dependencies.
  symlinkSync(join(repository, "node_modules"), join(directory, "node_modules"));
  // Normalize the baseline without copying real dotenv files or depending on
  // the caller's canonical environment. Usually this is already fresh.
  try {
    run(ensureScript, directory);
    return directory;
  } catch (error) {
    rmSync(directory, { recursive: true, force: true });
    throw error;
  }
}

function run(script, directory, environment = fixtureEnvironment) {
  return execFileSync(process.execPath, [join(directory, "scripts", basename(script))], {
    cwd: directory, env: environment, encoding: "utf8", stdio: "pipe",
  });
}

function check(directory) {
  return run(checkScript, directory);
}

function readManifest(directory) {
  const manifest = readFileSync(join(directory, "src/generated/static-home-assets.ts"), "utf8");
  return JSON.parse(manifest.match(/staticHomeOutputManifest = (.+) as const;/)?.[1] ?? "");
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

test("prebuild heals a stale lockfile input hash by re-syncing before re-checking", () => {
  const directory = temporaryCopy();
  try {
    const lockfile = join(directory, "package-lock.json");
    writeFileSync(lockfile, `${readFileSync(lockfile, "utf8")}\n`);
    const staleManifest = readManifest(directory);
    assert.throws(() => check(directory), /Static homepage inputs changed/);

    assert.doesNotThrow(() => run(ensureScript, directory));

    assert.notEqual(readManifest(directory).inputSha256, staleManifest.inputSha256);
    assert.doesNotThrow(() => check(directory));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("keeps hidden navigation and below-fold project images out of the eager preload set", () => {
  const manifest = readFileSync(
    join(repository, "src/generated/static-home-assets.ts"),
    "utf8",
  );
  const htmlPath = JSON.parse(
    manifest.match(/staticHomeHtml = ("[^"]+")/)?.[1] ?? "",
  );
  const html = readFileSync(join(repository, "public", htmlPath.slice(1)), "utf8");

  assert.doesNotMatch(
    html,
    /<link rel="preload" as="image"[^>]+headshot\.jpg[^>]+w=48/,
  );
  assert.doesNotMatch(
    html,
    /<link rel="preload" as="image"[^>]+project-previews/,
  );
  assert.match(
    html,
    /<img[^>]+alt="Steve Defendre"[^>]+loading="lazy"[^>]+fetchPriority="low"/,
  );
  assert.match(
    html,
    /<img[^>]+alt="Preview of the Defendre Solutions project"[^>]+loading="lazy"/,
  );
});

function readHtml(directory) {
  return readFileSync(join(directory, "public", readManifest(directory).html.path), "utf8");
}

for (const mutation of [
  {
    path: "src/components/ExternalLink.tsx",
    before: "opens in a new tab",
    after: "opens in a separate browser tab",
    assertHtml(html) { assert.match(html, /opens in a separate browser tab/); },
  },
  {
    path: "src/utils/url.ts",
    before: "if (!href) return false;",
    after: 'if (!href || href.includes("braidsbyrose.com")) return false;',
    assertHtml(html) { assert.doesNotMatch(html, /href="https:\/\/braidsbyrose.com\/?"/); },
  },
]) {
  test(`prebuild regenerates rendered behavior after changing ${mutation.path}`, () => {
    const directory = temporaryCopy();
    try {
      const originalHtml = readHtml(directory);
      if (mutation.path.endsWith("url.ts")) assert.match(originalHtml, /href="https:\/\/braidsbyrose.com\/?"/);
      const path = join(directory, mutation.path);
      writeFileSync(path, readFileSync(path, "utf8").replace(mutation.before, mutation.after));
      assert.throws(() => check(directory), /Static homepage inputs changed/);
      run(ensureScript, directory);
      const html = readHtml(directory);
      assert.notEqual(html, originalHtml);
      mutation.assertHtml(html);
      assert.doesNotMatch(html, /<script[^>]+_next\//);
      check(directory);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}

test("prebuild follows changes in newly introduced transitive renderer dependencies", () => {
  const directory = temporaryCopy();
  try {
    const component = join(directory, "src/components/ExternalLink.tsx");
    const dependency = join(directory, "src/utils/disclosure.ts");
    writeFileSync(dependency, 'export const disclosure = "original test disclosure";');
    writeFileSync(component, 'import { disclosure } from "../utils/disclosure";\n' +
      readFileSync(component, "utf8").replace('const newTabDisclosure = "opens in a new tab";', 'const newTabDisclosure = disclosure;'));
    run(ensureScript, directory);
    assert.match(readHtml(directory), /original test disclosure/);
    writeFileSync(dependency, 'export const disclosure = "updated test disclosure";');
    assert.throws(() => check(directory), /Static homepage inputs changed/);
    run(ensureScript, directory);
    assert.match(readHtml(directory), /updated test disclosure/);
    assert.doesNotMatch(readHtml(directory), /original test disclosure/);
    check(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("prebuild regenerates canonical and social URLs when the resolved environment changes", () => {
  const directory = temporaryCopy();
  const cleanEnvironment = { ...fixtureEnvironment };
  const scenarios = [
    [{ NEXT_PUBLIC_SITE_URL: " https://custom.example/path?q=1#hash ", VERCEL_PROJECT_PRODUCTION_URL: "production.example", VERCEL_URL: "preview.example" }, "https://custom.example/"],
    [{ NEXT_PUBLIC_SITE_URL: " ", VERCEL_PROJECT_PRODUCTION_URL: " //production.example/path ", VERCEL_URL: "preview.example" }, "https://production.example/"],
    [{ NEXT_PUBLIC_SITE_URL: "http:/example.com", VERCEL_PROJECT_PRODUCTION_URL: "safe-production.example", VERCEL_URL: "preview.example" }, "https://safe-production.example/"],
    [{ NEXT_PUBLIC_SITE_URL: "https://[::1", VERCEL_PROJECT_PRODUCTION_URL: "ftp://production.example", VERCEL_URL: "preview.example/path" }, "https://preview.example/"],
    [{ NEXT_PUBLIC_SITE_URL: "https://user:secret@example.com", VERCEL_URL: "://bad" }, "https://steve-defendre-portfolio.vercel.app/"],
  ];
  try {
    for (const [overrides, canonical] of scenarios) {
      const environment = { ...cleanEnvironment, ...overrides };
      assert.throws(() => run(checkScript, directory, environment), /Static homepage inputs changed/);
      const previous = readManifest(directory);
      run(ensureScript, directory, environment);
      const current = readManifest(directory);
      for (const kind of ["css", "html"]) {
        if (previous[kind].path !== current[kind].path) {
          assert.equal(existsSync(join(directory, "public", previous[kind].path)), false, "retire superseded output after successful publication");
        }
      }
      const html = readHtml(directory);
      assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`));
      assert.ok(html.includes(`<meta property="og:url" content="${canonical}"`));
      for (const attribute of ['property="og:image"', 'name="twitter:image"']) {
        assert.ok(html.includes(`<meta ${attribute} content="${canonical}project-previews/defendre-solutions.jpg"`));
      }
      run(checkScript, directory, environment);
    }
    const environment = { ...cleanEnvironment, NEXT_PUBLIC_SITE_URL: "https://stable.example", VERCEL_URL: "preview-one.example" };
    run(ensureScript, directory, environment);
    const manifest = readManifest(directory);
    run(ensureScript, directory, { ...environment, NEXT_PUBLIC_SITE_URL: " stable.example/path ", VERCEL_URL: "preview-two.example" });
    assert.deepEqual(readManifest(directory), manifest, "equivalent resolved origins must remain fresh");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});


test("prebuild reads production dotenv canonical changes just like Next", () => {
  const directory = temporaryCopy();
  const environment = { ...fixtureEnvironment };
  try {
    for (const host of ["dotenv-one.example", "dotenv-two.example"]) {
      writeFileSync(join(directory, ".env.production"), `NEXT_PUBLIC_SITE_URL=https://${host}\n`);
      assert.throws(() => run(checkScript, directory, environment), /Static homepage inputs changed/);
      run(ensureScript, directory, environment);
      assert.ok(readHtml(directory).includes(`<link rel="canonical" href="https://${host}/"`));
      run(checkScript, directory, environment);
    }
    run(ensureScript, directory, { ...environment, NEXT_PUBLIC_SITE_URL: "https://shell.example" });
    assert.ok(readHtml(directory).includes('<link rel="canonical" href="https://shell.example/"'));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

for (const failure of [
  {
    name: "compilation",
    path: "src/components/ExternalLink.tsx",
    change(source) { return `import "./missing-render-fixture";\n${source}`; },
    error: /Could not resolve/,
  },
  {
    name: "rendering",
    path: "src/components/ExternalLink.tsx",
    change(source) { return source.replace('const textLabel =', 'throw new Error("intentional renderer failure");\n  const textLabel ='); },
    error: /intentional renderer failure/,
  },
  {
    name: "runtime validation",
    path: "scripts/render-static-home.tsx",
    change(source) { return source.replace('/_vercel/insights/script.js', '/unexpected-runtime.js'); },
    error: /exactly one Insights script/,
  },
]) {
  test(`preserves the usable manifest and assets when ${failure.name} fails`, () => {
    const directory = temporaryCopy();
    try {
      const manifestPath = join(directory, "src/generated/static-home-assets.ts");
      const manifest = readFileSync(manifestPath, "utf8");
      const outputs = readManifest(directory);
      const htmlPath = join(directory, "public", outputs.html.path);
      const cssPath = join(directory, "public", outputs.css.path);
      const originalHtml = readFileSync(htmlPath);
      const originalCss = readFileSync(cssPath);
      const path = join(directory, failure.path);
      writeFileSync(path, failure.change(readFileSync(path, "utf8")));

      const renderTemporary = mkdtempSync(join(directory, "render-temp-"));
      assert.throws(() => run(ensureScript, directory, { ...fixtureEnvironment, TMPDIR: renderTemporary }), failure.error);
      assert.deepEqual(readdirSync(renderTemporary), [], "remove temporary renderer output on failure");
      assert.equal(readFileSync(manifestPath, "utf8"), manifest);
      assert.deepEqual(readFileSync(htmlPath), originalHtml);
      assert.deepEqual(readFileSync(cssPath), originalCss);
      run("check-static-home-runtime.mjs", directory);
      assert.deepEqual(readdirSync(join(directory, "src/generated")).filter((file) => file.startsWith(".static-home-stage-")), []);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}
