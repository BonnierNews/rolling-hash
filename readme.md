# Rolling hash

When hashing an ID you might not want it to stay the same **forever** so this library solves that by making it rolling.

The rolling occurs at a fixed date interval and in turn gives you a new fresh ID to use!

This rolling hash library is supposed to be able to work with all kinds of encryption libraries and still give a valid rolling ID.

## Usage

### Installing

`npm install @bonniernews/rolling-hash`

### running

The code is simple to use with any crypto Library.

Simply input the given hashFunction, toBase64Function and toHexFunction and retrieve a rolledHash.

example with an async crypto library:

```javascript
import rollingHash from "@bonniernews/rolling-hash";
import crypto from "node:crypto";

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

const rolledHash = await rollingHash("foobar", { hashFunction, toBase64Function, toHexFunction });

// use rolledHash as you want
```

example with a sync crypto library:

```javascript
import rollingHash from "@bonniernews/rolling-hash";
import cryptoJs from "crypto-js";

function hashFunction(str) {
  return cryptoJs.SHA256(str);
}

function toBase64Function(hash) {
  return hash.toString(cryptoJs.enc.Base64);
}

function toHexFunction(hash) {
  return hash.toString(cryptoJs.enc.Hex);
}

const rolledHash = rollingHash("foobar", { hashFunction, toBase64Function, toHexFunction });

// use rolledHash as you want
```

if using commonJS:

```javascript
const { default: rollingHash } = require("@bonniernews/rolling-hash");
```

## Disclaimer

The interval at which the rolling of the hash is performed may change.

We use the Date class to handle the hash, if this is modified in anyway we cannot guarantee that this will work a 100% of the time.
