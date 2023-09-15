interface Options<T> {
    hashFunction: (string: string) => Promise<T>;
    toBase64Function: (hash: T) => string;
    toHexFunction: (hash: T) => string;
}
declare function rollingHash<T>(message: string, { hashFunction, toBase64Function, toHexFunction }: Options<T>): Promise<string>;
export default rollingHash;
