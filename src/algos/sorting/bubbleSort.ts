import { swap } from "./swap";

const bubbleSort = async (
  list: number[],
  animateSwap: (a: number, b: number) => Promise<void>,
  elementSorted: (index: number) => void
) => {
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length - 1; j++) {
      if (list[j] > list[j + 1]) {
        swap(list, j, j + 1);
        await animateSwap(j, j + 1);
      }
    }
    elementSorted(list.length - 1 - i);
  }
};

export default bubbleSort;
