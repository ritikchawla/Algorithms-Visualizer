import { sortedBarColor } from "@/constants/sortingAlgoConstants";
import { sleep } from "@/helpers/helper";
import { swap } from "./swap";

class QuickSort {
  iteratingOver: (idx1: number, idx2: number, color?: string) => Promise<void>;
  swapElements: (idx1: number, idx2: number, pivotIndex?: number) => Promise<void>;
  colorElement: (idx: number, color?: string) => void;
  setPivot: (idx: number) => void;

  constructor(
    iteratingOver: (idx1: number, idx2: number, color?: string) => Promise<void>,
    swapElements: (idx1: number, idx2: number, pivotIndex?: number) => Promise<void>,
    colorElement: (idx: number, color?: string) => void,
    setPivot: (idx: number) => void
  ) {
    this.iteratingOver = iteratingOver;
    this.swapElements = swapElements;
    this.colorElement = colorElement;
    this.setPivot = setPivot;
  }

  partition = async (list: number[], low: number, high: number) => {
    const pivot = list[low];
    let left = low + 1;
    let right = high;

    this.setPivot(low);

    while (left <= right) {
      while (list[left] <= pivot) left++;
      while (list[right] > pivot) right--;

      if (left < right) {
        swap(list, left, right);
        await this.swapElements(left, right, low);
      }
    }

    swap(list, low, right);
    await this.swapElements(low, right, low);

    await sleep(100);
    this.setPivot(right);

    await sleep(100);
    this.colorElement(right, sortedBarColor);

    return right;
  };

  quickSort = async (list: number[], low: number, high: number) => {
    if (low > high) return;

    const pIndex = await this.partition(list, low, high);

    // this.iteratingOver(0, low, baseBarColor);
    // this.iteratingOver(high, list.length - 1, baseBarColor);
    // await this.iteratingOver(low, high);

    await this.quickSort(list, low, pIndex - 1);
    await this.quickSort(list, pIndex + 1, high);

    return list;
  };
}

const quickSort = (
  list: number[],
  iteratingOver: (idx1: number, idx2: number) => Promise<void>,
  swapElements: (idx1: number, idx2: number, pivotIndex?: number) => Promise<void>,
  colorElement: (idx: number, color?: string) => void,
  setPivot: (idx: number) => void
): void => {
  const sorter = new QuickSort(iteratingOver, swapElements, colorElement, setPivot);

  sorter.quickSort(list, 0, list.length - 1);
};

export default quickSort;
