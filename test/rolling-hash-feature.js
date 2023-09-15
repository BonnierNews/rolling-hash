import rollingHash from "../dist/mjs/index.js";
import { it, describe, beforeEach, before } from "mocha";
import assert from "assert";
import crypto from "node:crypto";
import cryptoJs from "crypto-js";
import { Buffer } from "buffer";

// Needs to be defined for tests to run smoothly
let customDate;
class MockDate extends Date {
  constructor(arg) {
    super(arg || customDate);
  }
}

describe("Rolling hash with node:crypto", () => {
  beforeEach(() => {
    customDate = "2022-01-01T00:00:00.000Z";
    // eslint-disable-next-line no-undef
    global.Date = MockDate;
  });

  async function hashFunction(str) {
    const arrayBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));

    return Array.from(new Uint8Array(arrayBuffer));
  }

  function toBase64Function(hash) {
    return Buffer.from(hash).toString("base64");
  }

  function toHexFunction(hash) {
    return hash.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  it("Validate rolling hash is hex encoded", async () => {
    const ppid = await rollingHash("foo-bar", { hashFunction, toBase64Function, toHexFunction });

    assert.match(ppid, /[0-9A-Fa-f]{64}/g, "The encrypted id is not hex encoded");
  });

  it("Validate a different hash after two months", async () => {
    const ppid1 = await rollingHash("foo-bar", { hashFunction, toBase64Function, toHexFunction });

    // Change the salt for the rolling hash!
    customDate = "2022-03-01T00:00:00.000Z";

    const ppid2 = await rollingHash("foo-bar", { hashFunction, toBase64Function, toHexFunction });

    assert.notStrictEqual(ppid1, ppid2, `The encrypted id should not be the same after two months.\n${ppid1} !== ${ppid2}`);
  });

  it("Validate a different hash after a year", async () => {
    const ppid1 = await rollingHash("foo-bar", { hashFunction, toBase64Function, toHexFunction });

    // Change the salt for the rolling hash!
    customDate = "2023-01-01T00:00:00.000Z";

    const ppid2 = await rollingHash("foo-bar", { hashFunction, toBase64Function, toHexFunction });

    assert.notStrictEqual(ppid1, ppid2, `The encrypted id should not be the same the same month but a different year.\n${ppid1} !== ${ppid2}`);
  });
});

describe("Rolling hash with CryptoJs", () => {
  beforeEach(() => {
    customDate = "2022-01-01T00:00:00.000Z";
    // eslint-disable-next-line no-undef
    global.Date = MockDate;
  });

  function hashFunction(str) {
    return cryptoJs.SHA256(str);
  }

  function toBase64Function(hash) {
    return hash.toString(cryptoJs.enc.Base64);
  }

  function toHexFunction(hash) {
    return hash.toString(cryptoJs.enc.Hex);
  }

  it("Validating rolling hash is hex encoded", async () => {
    const ppid = await rollingHash("foo-bar", { hashFunction, toBase64Function, toHexFunction });

    assert.match(ppid, /[0-9A-Fa-f]{6}/g, "The encrypted id is not hex encoded");
  });

  it("Validate a different hash after two months", async () => {
    const ppid1 = await rollingHash("foo-bar", { hashFunction, toBase64Function, toHexFunction });

    // Change the salt for the rolling hash!
    customDate = "2022-03-01T00:00:00.000Z";

    const ppid2 = await rollingHash("foo-bar", { hashFunction, toBase64Function, toHexFunction });

    assert.notStrictEqual(ppid1, ppid2, `The encrypted id should not be the same after two months.\n${ppid1} !== ${ppid2}`);
  });

  it("Validate a different hash after a year", async () => {
    const ppid1 = await rollingHash("foo-bar", { hashFunction, toBase64Function, toHexFunction });

    // Change the salt for the rolling hash!
    customDate = "2023-01-01T00:00:00.000Z";

    const ppid2 = await rollingHash("foo-bar", { hashFunction, toBase64Function, toHexFunction });

    assert.notStrictEqual(ppid1, ppid2, `The encrypted id should not be the same the same month but a different year.\n${ppid1} !== ${ppid2}`);
  });
});

describe("Rolling hash for crypto-js and node:crypto at the same time", () => {
  before(() => {
    customDate = "2022-01-01T00:00:00.000Z";
    // eslint-disable-next-line no-undef
    global.Date = MockDate;
  });

  async function nodehashFunction(str) {
    const arrayBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));

    return Array.from(new Uint8Array(arrayBuffer));
  }

  function nodetoBase64Function(hash) {
    return Buffer.from(hash).toString("base64");
  }

  function nodetoHexFunction(hash) {
    return hash.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function cryptoJshashFunction(str) {
    return cryptoJs.SHA256(str);
  }

  function cryptoJstoBase64Function(hash) {
    return hash.toString(cryptoJs.enc.Base64);
  }

  function cryptoJstoHexFunction(hash) {
    return hash.toString(cryptoJs.enc.Hex);
  }

  it("we should get the same value from both rolling hash functions", async () => {
    const ppid1 = await rollingHash("foobar", { hashFunction: nodehashFunction, toBase64Function: nodetoBase64Function, toHexFunction: nodetoHexFunction });
    const ppid2 = await rollingHash("foobar", { hashFunction: cryptoJshashFunction, toBase64Function: cryptoJstoBase64Function, toHexFunction: cryptoJstoHexFunction });

    assert.equal(ppid1, ppid2);
  });
});
