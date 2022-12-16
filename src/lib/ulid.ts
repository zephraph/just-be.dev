import { z } from 'zod'

const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford's Base32
const ENCODING_LEN = ENCODING.length;
const TIME_MAX = Math.pow(2, 48) - 1;
const TIME_LEN = 10;
const RANDOM_LEN = 16;

export const ulidSchema = z.string().regex(/^[0-9A-HJ-NP-TV-Z]{26}$/)
export const timeSchema = z.number().int().min(0).max(TIME_MAX);

function randomNumber() {
  const buffer = new Uint8Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] / 0xff;
}

function encodeTime(time: number) {
  if (time > TIME_MAX) {
    throw new Error(`Time must be less than ${TIME_MAX}`);
  }
  let str = "";
  for (let i = 0; i < TIME_LEN; i++) {
    str = ENCODING[time % ENCODING_LEN] + str;
    time = Math.floor(time / ENCODING_LEN);
  }
  return str;
}

/** Used to read the timestamp from a ULID */
export function decodeTime(ulid: string) {
  if (ulidSchema.safeParse(ulid).success === false) {
    throw new Error(`Invalid ULID: ${ulid}`);
  }
  let time = 0;
  for (let i = 0; i < TIME_LEN; i++) {
    time = time * ENCODING_LEN + ENCODING.indexOf(ulid.charAt(i));
  }
  return time;
}

/** Generates the 16 character (80-bit) randomized postfix of the ULID */
function encodeRandom() {
  let str = "";
  for (let len = RANDOM_LEN; len > 0; len--) {
    let rand = Math.floor(randomNumber() * ENCODING_LEN);
    if (rand === ENCODING_LEN) {
      rand = ENCODING_LEN - 1;
    }
    str = ENCODING.charAt(rand) + str;
  }
  return str
}



/**
 * A 26 character (128-bit) Universally Unique Lexicographically Sortable Identifier
 * 
 * ```
 *  01AN4Z07BY   79KA1307SR9X4MV3
 * |----------| |----------------|
 *  Timestamp       Randomness
 *    48bits          80bits
 * ```
 */
export function ulid(time: number) {
  if (timeSchema.safeParse(time).success === false) {
    throw new Error(`Time must be an integer between 0 and ${TIME_MAX}`);
  }
  return encodeTime(time) + encodeRandom();
}

// in-source test suites
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest
  test('encode and decode time should be reversible', () => {
    const halfTime = Math.floor(TIME_MAX / 2);
    expect(decodeTime(encodeTime(1) + '79KA1307SR9X4MV3')).toBe(1);
    expect(decodeTime(encodeTime(TIME_MAX - 1) + '79KA1307SR9X4MV3')).toBe(TIME_MAX - 1);
    expect(decodeTime(encodeTime(halfTime) + '79KA1307SR9X4MV3')).toBe(halfTime);
  })

}
