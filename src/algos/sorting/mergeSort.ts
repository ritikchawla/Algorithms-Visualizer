import { sortedBarColor } from "@/constants/sortingAlgoConstants";
import { sortArrayElement } from "@/types/sortingAlgo";
import { swap } from "./swap";

class MergeSort {
  iteratingOver: (idx1: number, idx2: number, color?: string) => Promise<void>;
  swapElements: (idx1: number, idx2: number, pivotIndex?: number) => Promise<void>;
  colorElement: (idx: number, color?: string) => void;
  getArrayElement: (idx: number) => sortArrayElement;
  setArrayElement: (
    idx1: number,
    idx2: number,
    element?: sortArrayElement
  ) => Promise<void>;

  constructor(
    iteratingOver: (idx1: number, idx2: number, color?: string) => Promise<void>,
    swapElements: (idx1: number, idx2: number, pivotIndex?: number) => Promise<void>,
    colorElement: (idx: number, color?: string) => void,
    getArrayElement: (idx: number) => sortArrayElement,
    setArrayElement: (
      idx1: number,
      idx2: number,
      element?: sortArrayElement
    ) => Promise<void>
  ) {
    this.iteratingOver = iteratingOver;
    this.swapElements = swapElements;
    this.colorElement = colorElement;
    this.getArrayElement = getArrayElement;
    this.setArrayElement = setArrayElement;
  }

  mergeInPlace = async (list: number[], low: number, mid: number, high: number) => {
    // considering list[low : mid] <=> X[] and list[mid + 1 : high] <=> Y[]

    /*  
      1. Traverse through both arrays
      2. If the element of the first array is smaller than that of the second one, do nothing. Increment first 
      3. If the element of the first array is larger than that of second one, swap the two, then put the element in the second array at it's correct position using some insertion sort like algo. Increment first.
    */

    for (let i = low; i <= mid; i++) {
      // compare the current element of X[] with the first element of Y[]
      if (list[i] > list[mid + 1]) {
        swap(list, i, mid + 1);
        await this.swapElements(i, mid + 1);

        const first = list[mid + 1];
        const tempElement = this.getArrayElement(mid + 1);

        // move Y[0] to its correct position to maintain the sorted
        // order of Y[]. Y[1…n-1] is already sorted
        let k: number;
        for (k = mid + 2; k <= high && list[k] < first; k++) {
          const kElement = this.getArrayElement(k);
          this.setArrayElement(k, -1, { number: first, barHeight: 0, barColor: "" });

          list[k - 1] = list[k];
          await this.setArrayElement(k - 1, 0, kElement);
        }

        list[k - 1] = first;
        await this.setArrayElement(k - 1, -1, tempElement);
      }
    }
  };

  mergeSort = async (list: number[], low: number, high: number) => {
    if (low >= high) return;

    const middle = Math.floor((high + low) / 2);

    await this.mergeSort(list, low, middle);
    await this.mergeSort(list, middle + 1, high);

    await this.mergeInPlace(list, low, middle, high);
  };
}

const mergeSortCaller = async (
  list: number[],
  iteratingOver: (idx1: number, idx2: number, color?: string) => Promise<void>,
  swapElements: (idx1: number, idx2: number, pivotIndex?: number) => Promise<void>,
  colorElement: (idx: number, color?: string) => void,
  getArrayElement: (idx: number) => sortArrayElement,
  setArrayElement: (
    idx1: number,
    idx2: number,
    element?: sortArrayElement
  ) => Promise<void>
): Promise<void> => {
  const sorter = new MergeSort(
    iteratingOver,
    swapElements,
    colorElement,
    getArrayElement,
    setArrayElement
  );

  await sorter.mergeSort(list, 0, list.length - 1);

  iteratingOver(0, list.length - 1, sortedBarColor);
};

export default mergeSortCaller;
