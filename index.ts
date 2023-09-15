interface Options<T> {
  hashFunction: (string: string) => Promise<T>;
  toBase64Function: (hash: T) => string;
  toHexFunction: (hash: T) => string;
}

const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function getRollingSalt(saltKey: string): string {
  const date = new Date();
  // Find the offset (0-63) (this will always be the same for a user email)
  const dateOffset = BASE64.indexOf(saltKey);

  const rollingDate = new Date(date.setDate(date.getDate() - dateOffset));

  return `${rollingDate.getFullYear()}${Math.floor(rollingDate.getMonth() / 2)}`;
}

async function rollingHash<T>(message: string, { hashFunction, toBase64Function, toHexFunction }: Options<T>) {
  const hashedMessage = await hashFunction(message);

  const [first] = toBase64Function(hashedMessage);

  const salt = getRollingSalt(first);

  const rolledHash = await hashFunction(message + salt);

  return toHexFunction(rolledHash);
}


export default rollingHash;