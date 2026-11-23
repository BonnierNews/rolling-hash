const assert = require("assert");
const cryptoJs = require("crypto-js");
const { default: rollingHash } = require("../dist/cjs/index.js");

// Exercises the CommonJS artifact (the one `main` points at and `require()` loads),
// which the import-based suite never touches.
function hashFunction(str) {
  return cryptoJs.SHA256(str);
}

function toBase64Function(hash) {
  return hash.toString(cryptoJs.enc.Base64);
}

function toHexFunction(hash) {
  return hash.toString(cryptoJs.enc.Hex);
}

describe("CommonJS build via require()", () => {
  it("a synchronous hashFunction returns a string synchronously", () => {
    const result = rollingHash("foo-bar", { hashFunction, toBase64Function, toHexFunction });

    assert.strictEqual(typeof result, "string", "sync input should return a string, not a Promise");
    assert.match(result, /[0-9A-Fa-f]{6}/, "The encrypted id is not hex encoded");
  });

  it("a promise-returning hashFunction returns a Promise", async () => {
    const asyncHashFunction = (str) => Promise.resolve(cryptoJs.SHA256(str));

    const result = rollingHash("foo-bar", { hashFunction: asyncHashFunction, toBase64Function, toHexFunction });

    assert.strictEqual(typeof result.then, "function", "async input should return a Promise");
    assert.match(await result, /[0-9A-Fa-f]{6}/, "The encrypted id is not hex encoded");
  });
});
