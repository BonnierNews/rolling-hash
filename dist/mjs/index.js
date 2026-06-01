const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
// There is no reliable static way to know whether `hashFunction` is async:
// `constructor.name` / `Symbol.toStringTag` are erased when bundlers downlevel
// `async function` to generators (esbuild/tsc target=es5|es6), leaving a plain
// `Function` that still returns a Promise. The return value is the only ground
// truth, so we dispatch on whether the result is thenable.
function isThenable(value) {
    return value != null && typeof value.then === "function";
}
function getRollingSalt(saltKey) {
    const date = new Date();
    // Find the offset (0-63) (this will be the same for any identical saltKey)
    const dateOffset = BASE64.indexOf(saltKey);
    const rollingDate = new Date(date.setDate(date.getDate() - dateOffset));
    return `${rollingDate.getFullYear()}${Math.floor(rollingDate.getMonth() / 2)}`;
}
// Takes the already-started first hash *and* the raw message: the first hash is
// awaited (not recomputed) to derive the salt, then the message is hashed again
// with that salt for the final digest.
async function promiseWrapper(firstHash, message, { hashFunction, toBase64Function, toHexFunction }) {
    const hashedMessage = await firstHash;
    const [first] = toBase64Function(hashedMessage);
    const salt = getRollingSalt(first);
    const rolledHash = await hashFunction(message + salt);
    return toHexFunction(rolledHash);
}
function rollingHash(message, options) {
    const { hashFunction, toBase64Function, toHexFunction } = options;
    const hashedMessage = hashFunction(message);
    if (isThenable(hashedMessage)) {
        return promiseWrapper(hashedMessage, message, options);
    }
    const [first] = toBase64Function(hashedMessage);
    const salt = getRollingSalt(first);
    // Cast required: the union return type means TS can't infer that a function
    // sync on the first call is also sync on the second.
    const rolledHash = hashFunction(message + salt);
    return toHexFunction(rolledHash);
}
export default rollingHash;
