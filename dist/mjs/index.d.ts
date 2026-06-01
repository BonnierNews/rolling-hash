interface Options<T> {
    hashFunction: (message: string) => Promise<T> | T;
    toBase64Function: (hash: T) => string;
    toHexFunction: (hash: T) => string;
}
declare function rollingHash<T>(message: string, options: Options<T>): Promise<string> | string;
export default rollingHash;
