import { Buffer } from 'node:buffer';

export function toBase64(x: undefined | null | ArrayBuffer | Buffer | Uint8Array) {
  if (x == null)
    return '';
  if (Buffer.isBuffer(x))
    return x.toString('base64');
  if (x instanceof ArrayBuffer || x instanceof Uint8Array)
    return Buffer.from(x).toString('base64');
  throw new Error(`Unknown type: ${Object.getPrototypeOf(x)?.constructor?.name}`);
}
