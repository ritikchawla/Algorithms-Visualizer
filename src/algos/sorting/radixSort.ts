import {
  baseBarColor,
  iteratingBarColor,
  MAX_ARRAY_BAR_HEIGHT,
  sortedBarColor
} from "@/constants/sortingAlgoConstants";
import { sortArrayElement } from "@/types/sortingAlgo";

type bucketType = { [key: string]: string[] };

const getNewBucket = (): bucketType => {
  const b: bucketType = {};

  for (let i = 0; i < 10; i++) b[i.toString()] = [];

  return b;
};

const radixSort = async (
  list: string[],
  setArrayElement: (
    idx1: number,
    idx2?: number,
    element?: sortArrayElement
  ) => Promise<void>,
  colorElement: (index: number, color?: string) => Promise<void>,
  iteratingOverElements: (index1: number, index2: number, color?: string) => Promise<void>
) => {
  let maxElement = -Infinity;

  for (const element of list) {
    const ele = Number(element);
    if (ele > maxElement) maxElement = ele;
  }

  const noPasses = maxElement.toString().length;

  // make every string the same length
  for (let i = 0; i < list.length; i++) {
    const numZerosToAdd = noPasses - list[i].length;

    let newStr = "";

    for (let s = 0; s < numZerosToAdd; s++) newStr += "0";

    list[i] = newStr + list[i];
  }

  const bucket = getNewBucket();

  for (let pass = 1; pass <= noPasses; pass++) {
    const index: number = noPasses - pass;

    for (let i = 0; i < list.length; i++) {
      bucket[list[i][index]].push(list[i]);
    }

    let listIndex = 0;

    for (const key of Object.keys(bucket).sort((a, b) => Number(a) - Number(b))) {
      for (const element of bucket[key.toString()]) {
        list[listIndex] = element;

        await colorElement(listIndex, iteratingBarColor);

        await setArrayElement(listIndex, undefined, {
          number: Number(element),
          barColor: baseBarColor,
          barHeight: Math.floor(
            MAX_ARRAY_BAR_HEIGHT * (Number(element) / Number(maxElement))
          )
        });

        await colorElement(listIndex, baseBarColor);

        listIndex++;
      }
      bucket[key] = [];
    }
  }

  iteratingOverElements(0, list.length - 1, sortedBarColor);
};

export default radixSort;
