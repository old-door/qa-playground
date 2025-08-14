/**
 * A comparator function type for comparing two values.
 */
export type Comparator<T = string> = (a: T, b: T) => number

/**
 * Creates a comparator based on a key extraction function.
 * @param keyExtractor A function that extracts a comparable key from an object.
 * @returns A comparator function that compares based on the extracted key.
 * Compare results:
 * ```
 * keyA < keyB = -1 
 * keyA > keyB = 1
 * keyA === keyB = 0
 * ```
 */
export function comparing<T, K>(keyExtractor: (item: T) => K): Comparator<T> {
  return (a: T, b: T): number => {
    const keyA = keyExtractor(a)
    const keyB = keyExtractor(b)
    if (keyA < keyB) return -1
    if (keyA > keyB) return 1
    return 0
  }
}