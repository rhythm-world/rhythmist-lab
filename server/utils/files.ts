import { Buffer } from 'node:buffer';

export function toBase64(x: undefined | null | ArrayBuffer | Buffer) {
  if (x == null)
    return '';
  if (x instanceof ArrayBuffer)
    return Buffer.from(x).toString('base64');
  if (x instanceof Buffer)
    return x.toString('base64');
  throw new Error(`Unknown type: ${Object.getPrototypeOf(x)?.constructor?.name}`);
}
