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
function getRollingSalt(saltKey) {
    const date = new Date();
    // Find the offset (0-63) (this will always be the same for a user email)
    const dateOffset = BASE64.indexOf(saltKey);
    const rollingDate = new Date(date.setDate(date.getDate() - dateOffset));
    return `${rollingDate.getFullYear()}${Math.floor(rollingDate.getMonth() / 2)}`;
}
function rollingHash(message, { hashFunction, toBase64Function, toHexFunction }) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedMessage = yield hashFunction(message);
        const [first] = toBase64Function(hashedMessage);
        const salt = getRollingSalt(first);
        const rolledHash = yield hashFunction(message + salt);
        return toHexFunction(rolledHash);
    });
}
exports.default = rollingHash;
