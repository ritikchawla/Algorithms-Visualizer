import { pivotBarColor, sortedBarColor } from "@/constants/sortingAlgoConstants";
import { sleep } from "@/helpers/helper";
import { swap } from "./swap";

const selectionSort = async (
  list: number[],
  speed: number,
  iteratingOver: (idx1: number, idx2: number, color?: string) => Promise<void>,
  swapElements: (idx1: number, idx2: number, dontColorIndex?: number) => Promise<void>,
  colorElement: (idx: number, color?: string) => void
) => {
  for (let i = 0; i < list.length; i++) {
    let min = Infinity;
    let idx = 0;

    await iteratingOver(i, list.length - 1);

    for (let j = i; j < list.length; j++) {
      if (list[j] < min) {
        idx = j;
        min = list[j];
      }
    }

    colorElement(idx, pivotBarColor);

    await sleep(speed);

    swap(list, i, idx);
    await swapElements(i, idx, idx);

    // now element at index i is sorted
    colorElement(i, sortedBarColor);
  }
};

export default selectionSort;
