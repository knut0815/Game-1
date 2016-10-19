let idx = 0;

/**
 * @return {Number}
 */
export function getUniqueHash() {
  if (++idx >= Number.MAX_SAFE_INTEGER) {
    idx = 0;
  }
  return (idx);
}