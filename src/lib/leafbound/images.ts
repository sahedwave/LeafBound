export const LEAF_COUNT = 18;

export function defaultLeafSrc(index: number) {
  return `/leaves/${String(index + 1).padStart(2, "0")}.jpg`;
}

export const DEFAULT_LEAVES = Array.from({ length: LEAF_COUNT }, (_, i) => defaultLeafSrc(i));
