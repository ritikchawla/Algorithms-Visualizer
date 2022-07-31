/**
 * @param milliseconds sleep for this amount of milliseconds
 */
export const sleep = (milliseconds: number): Promise<void> =>
  new Promise(r => setTimeout(r, milliseconds));

/**
 * get number between Min and Max, both inclusive
 */
export const randNum = (min: number, max: number): number =>
  min + Math.floor(Math.random() * (max - min + 1));

/**
 * Get a random id
 */
export const randomId = (): string =>
  Math.random()
    .toString(36)
    .substr(2);

/**
 * @param array an array, [1,2,3]
 * @returns 1 --> 2 --> 3
 */
export const arrayToListRepr = (array: (number | string)[]): string =>
  array.join(" --> ");
