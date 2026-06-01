import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, it, before } from "mocha";
import assert from "node:assert";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(__dirname, "fixtures/consumer.ts");
// Emit alongside the source so relative imports (e.g. "../../dist/mjs/...")
// resolve identically for the compiled output and the original TS.
const outDir = path.join(__dirname, "fixtures");

const TARGETS = {
  es5: ts.ScriptTarget.ES5,
  es6: ts.ScriptTarget.ES2015,
  es2017: ts.ScriptTarget.ES2017,
  esnext: ts.ScriptTarget.ESNext,
};

const source = fs.readFileSync(sourcePath, "utf8");

for (const [ label, target ] of Object.entries(TARGETS)) {
  describe(`Consumer transpiled by tsc target=${label}`, () => {
    let mod;

    before(async () => {
      const out = ts.transpileModule(source, {
        compilerOptions: {
          target,
          module: ts.ModuleKind.ES2022,
          esModuleInterop: true,
          downlevelIteration: true,
        },
      });
      const file = path.join(outDir, `consumer-${label}.mjs`);
      fs.writeFileSync(file, out.outputText);
      mod = await import(pathToFileURL(file).href);
    });

    // Pins the premise of the regression: down-leveling targets MUST
    // produce a plain Function. If a future tsc preserves async syntax
    // for these targets, this fixture stops reproducing the bug and we
    // want to know loudly.
    it("hashFunction is a Function for es5/es6, AsyncFunction otherwise", () => {
      const expected = label === "es5" || label === "es6" ? "Function" : "AsyncFunction";
      assert.strictEqual(
        mod.hashFunction.constructor.name,
        expected,
        `target=${label}: expected ${expected}, got ${mod.hashFunction.constructor.name}`
      );
    });

    it("returns a 64-char hex digest", async () => {
      const result = await mod.ppid("foo-bar");
      assert.match(result, /^[0-9a-f]{64}$/);
    });
  });
}

describe("Cross-target equivalence", () => {
  it("every transpilation target produces the same hash for the same input", async () => {
    const results = [];
    for (const label of Object.keys(TARGETS)) {
      const file = path.join(outDir, `consumer-${label}.mjs`);
      const mod = await import(pathToFileURL(file).href);
      results.push([ label, await mod.ppid("foo-bar") ]);
    }
    const [ , reference ] = results[0];
    for (const [ label, h ] of results) {
      assert.strictEqual(h, reference, `target=${label} drifted: ${h} !== ${reference}`);
    }
  });
});
