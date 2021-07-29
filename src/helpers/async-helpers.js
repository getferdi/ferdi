/* eslint-disable import/prefer-default-export */

export function sleep(ms = 0) {
  return new Promise((r) => setTimeout(r, ms));
}
