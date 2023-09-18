# Rolling hash

When hashing an ID you might not want it to stay the same **forever** so this library solves that by making it rolling.

The rolling occurs at a fixed date interval and in turn gives you a new fresh ID to use!

This rolling hash library is supposed to be able to work with all kinds of encryption libraries and still give a valid rolling ID.

## Usage

### Installing

Currently there is no NPM Package for this repo, so import it directly with npm and git like this.

`npm install BonnierNews/rolling-hash`

Or use another way you feel comfortable with.

The application uses as of currently Node 18.17.1.

### running

The code is super simple to use with a crypto Library.

Simply input the given hashFunction, toBase64Function and toHexFunction and retrieve a rolledHash

example:
```javascript
import rollingHash from "rolling-hash";
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

const rolledHash = await rollingHash("foobar", { hashFunction, toBase64Function, toHexFunction })

// use rolledHash as you want
```

## Disclaimer

How often the rolling hash changes are up to change, we can not guarantee that it will stay at the same interval forever.

We use the Date class to handle the hash, if this is modified in anyway we cannot guarantee that this will work a 100% of the time.
