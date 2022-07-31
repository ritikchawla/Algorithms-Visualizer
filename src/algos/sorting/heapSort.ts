import { sortedBarColor } from "@/constants/sortingAlgoConstants";
import Heap from "../dataStructures/Heap";

class HeapSort extends Heap {
  constructor(
    list: number[],
    maxHeap: boolean,
    swapElements: (idx1: number, idx2: number) => Promise<void>,
    colorElement: (idx: number, color?: string) => Promise<void>
  ) {
    super(list, maxHeap, swapElements, colorElement);
  }

  heapSort = async () => {
    await this.heapify();

    for (let i = 1; i < this.heap.length; i++) {
      await this.deleteFromHeap(this.heap.length - i, true);
    }
  };
}

const heapSort = async (
  list: number[],
  maxHeap: boolean,
  swapElements: (idx1: number, idx2: number) => Promise<void>,
  colorElement: (idx: number, color?: string) => Promise<void>,
  iteratingOver: (idx1: number, idx2: number, color?: string) => Promise<void>
): Promise<void> => {
  const heap = new HeapSort(list, maxHeap, swapElements, colorElement);
  await heap.heapSort();

  iteratingOver(0, list.length - 1, sortedBarColor);
};

export default heapSort;
