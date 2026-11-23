type MaybePromise<T> = T | Promise<T>;
interface Options<T> {
    hashFunction: (message: string) => MaybePromise<T>;
    toBase64Function: (hash: T) => string;
    toHexFunction: (hash: T) => string;
}
declare function rollingHash<T>(message: string, { hashFunction, toBase64Function, toHexFunction }: Options<T>): MaybePromise<string>;
export default rollingHash;
