"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
function promiseWrapper(firstHash, message, { hashFunction, toBase64Function, toHexFunction }) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedMessage = yield firstHash;
        const [first] = toBase64Function(hashedMessage);
        const salt = getRollingSalt(first);
        const rolledHash = yield hashFunction(message + salt);
        return toHexFunction(rolledHash);
    });
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
exports.default = rollingHash;
