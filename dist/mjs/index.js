const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function getRollingSalt(saltKey) {
    const date = new Date();
    // Find the offset (0-63) (this will be the same for any identical saltKey)
    const dateOffset = BASE64.indexOf(saltKey);
    const rollingDate = new Date(date.setDate(date.getDate() - dateOffset));
    return `${rollingDate.getFullYear()}${Math.floor(rollingDate.getMonth() / 2)}`;
}
async function promiseWrapper(message, { hashFunction, toBase64Function, toHexFunction }) {
    const hashedMessage = await hashFunction(message);
    const [first] = toBase64Function(hashedMessage);
    const salt = getRollingSalt(first);
    const rolledHash = await hashFunction(message + salt);
    return toHexFunction(rolledHash);
}
function rollingHash(message, { hashFunction, toBase64Function, toHexFunction }) {
    // to make this either an async operation or a sync operation we check if the given function is async
    if (hashFunction.constructor.name === "AsyncFunction") {
        return promiseWrapper(message, { hashFunction, toBase64Function, toHexFunction });
    }
    const hashedMessage = hashFunction(message);
    const [first] = toBase64Function(hashedMessage);
    const salt = getRollingSalt(first);
    const rolledHash = hashFunction(message + salt);
    return toHexFunction(rolledHash);
}
export default rollingHash;
