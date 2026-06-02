type MaybePromise<T> = T | Promise<T>;

interface Options<T> {
  hashFunction: (message: string) => MaybePromise<T>;
  toBase64Function: (hash: T) => string;
  toHexFunction: (hash: T) => string;
}

const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function getRollingSalt(saltKey: string): string {
  const date = new Date();
  // Find the offset (0-63) (this will be the same for any identical saltKey)
  const dateOffset = BASE64.indexOf(saltKey);

  const rollingDate = new Date(date.setDate(date.getDate() - dateOffset));

  return `${rollingDate.getFullYear()}${Math.floor(rollingDate.getMonth() / 2)}`;
}

function isPromise<T>(value: MaybePromise<T>): value is Promise<T> {
  return value != null && typeof (value as Promise<T>).then === "function";
}

function andThen<A, B>(value: MaybePromise<A>, fn: (value: A) => MaybePromise<B>): MaybePromise<B> {
  return isPromise(value) ? value.then(fn) : fn(value);
}

function rollingHash<T>(message: string, { hashFunction, toBase64Function, toHexFunction }: Options<T>): MaybePromise<string> {
  return andThen(hashFunction(message), (hashedMessage) => {
    const [first] = toBase64Function(hashedMessage);
    const salt = getRollingSalt(first);

    return andThen(hashFunction(message + salt), toHexFunction);
  });
}

export default rollingHash;
