import rollingHash from "../../dist/mjs/index.js";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";

async function hashFunction(str: string): Promise<number[]> {
  const ab = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(ab));
}

function toBase64Function(hash: number[]): string {
  return Buffer.from(hash).toString("base64");
}

function toHexFunction(hash: number[]): string {
  return hash.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function ppid(message: string): Promise<string> {
  return rollingHash(message, { hashFunction, toBase64Function, toHexFunction }) as Promise<string>;
}

export { hashFunction };
