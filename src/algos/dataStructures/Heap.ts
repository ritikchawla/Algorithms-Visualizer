import { sleep } from "@/helpers/helper";
import { paperJsNode } from "@/types/dsAlgo";
import { swap } from "../sorting/swap";
import { llNodeNull } from "./LinkedListNode";
import TreeNode from "./TreeNode";

class Heap {
  heap: (number | TreeNode)[];
  list: (number | TreeNode)[];
  maxHeap: boolean;
  nodeInsertionOrder: number[];
  swapElements: (idx1: number, idx2: number) => Promise<void>;
  colorElement: (idx: number, color?: string) => Promise<void>;
  drawNode?: (node: llNodeNull | TreeNode, x: number, y: number) => paperJsNode;

  constructor(
    list: number[],
    maxHeap: boolean,
    swapElements: (idx1: number, idx2: number) => Promise<void>,
    colorElement: (idx: number, color?: string) => Promise<void>,
    drawNode?: (node: llNodeNull | TreeNode, x: number, y: number) => paperJsNode
  ) {
    this.list = list;
    this.heap = [];
    this.maxHeap = maxHeap;
    this.nodeInsertionOrder = [];
    this.swapElements = swapElements;
    this.colorElement = colorElement;
    this.drawNode = drawNode;
  }

  getLeftChild = (index: number): number => 2 * index;

  getRightChild = (index: number): number => 2 * index + 1;

  getBothChildren = (index: number): number[] => [
    this.getLeftChild(index),
    this.getRightChild(index)
  ];

  getParent = (index: number): number => Math.floor(index / 2);

  bubbleUp = async (index: number): Promise<void> => {
    for (;;) {
      const parentIdx = this.getParent(index);
      if (parentIdx < 1) break;

      if (this.maxHeap) {
        // generating a max-heap
        if (this.heap[parentIdx] > this.heap[index]) break;
      } else {
        if (this.heap[parentIdx] < this.heap[index]) break;
      }

      swap(this.heap, parentIdx, index);
      await this.swapElements(parentIdx - 1, index - 1);

      index = parentIdx;
    }
  };

  deleteFromHeap = async (heapEnd: number, heapSort = false): Promise<void> => {
    /*  
      1. Swap the root with the last leaf
      2. Bubble down to find the correct place for the new root
    */

    swap(this.heap, 1, heapEnd);
    await this.swapElements(0, heapEnd - 1);

    // await this.colorElement(heapEnd - 1, "#345");

    if (!heapSort) await sleep(2000);

    let index = 1;

    // decrease the heap end as we've deleted one element
    heapEnd--;

    for (;;) {
      // max-heap

      const [leftChildIdx, rightChildIdx] = this.getBothChildren(index);

      if (leftChildIdx >= heapEnd && rightChildIdx >= heapEnd) break;

      let childToTest;

      if (!this.heap[leftChildIdx]) {
        childToTest = rightChildIdx;
      } else if (!this.heap[rightChildIdx]) {
        childToTest = leftChildIdx;
      } else {
        const condition = this.maxHeap
          ? this.heap[leftChildIdx] > this.heap[rightChildIdx]
          : this.heap[leftChildIdx] < this.heap[rightChildIdx];

        childToTest = condition ? leftChildIdx : rightChildIdx;
      }

      if (this.maxHeap) {
        if (this.heap[childToTest] <= this.heap[index]) break;
      } else {
        if (this.heap[childToTest] >= this.heap[index]) break;
      }

      swap(this.heap, index, childToTest);
      await this.swapElements(index - 1, childToTest - 1);

      index = childToTest;
    }

    /*  
      animation of deletion from heap relies on the length of heap, so we pop the 
      last element from the array if we're not visualizing heap sort
    */
    if (!heapSort) this.heap.pop();
  };

  insert = async (value: number): Promise<Heap> => {
    if (this.heap.length === 0) this.heap = [0];

    this.nodeInsertionOrder.push(value);

    this.heap.push(value);

    await this.bubbleUp(this.heap.length - 1);

    return this;
  };

  heapify = async (): Promise<(number | TreeNode)[]> => {
    this.heap = [0, this.list[0]];

    for (let i = 1; i < this.list.length; i++) {
      this.heap.push(this.list[i]);

      await this.bubbleUp(i);
    }

    // as we're indexing the heap from 1 onwards
    await this.bubbleUp(this.list.length);

    return this.heap;
  };
}

export default Heap;
