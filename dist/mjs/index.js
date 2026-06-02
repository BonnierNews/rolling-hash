const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function getRollingSalt(saltKey) {
    const date = new Date();
    // Find the offset (0-63) (this will be the same for any identical saltKey)
    const dateOffset = BASE64.indexOf(saltKey);
    const rollingDate = new Date(date.setDate(date.getDate() - dateOffset));
    return `${rollingDate.getFullYear()}${Math.floor(rollingDate.getMonth() / 2)}`;
}
function isPromise(value) {
    return value != null && typeof value.then === "function";
}
function andThen(value, fn) {
    return isPromise(value) ? value.then(fn) : fn(value);
}
function rollingHash(message, { hashFunction, toBase64Function, toHexFunction }) {
    return andThen(hashFunction(message), (hashedMessage) => {
        const [first] = toBase64Function(hashedMessage);
        const salt = getRollingSalt(first);
        return andThen(hashFunction(message + salt), toHexFunction);
    });
}
export default rollingHash;
