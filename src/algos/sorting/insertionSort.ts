import { sortedBarColor } from "@/constants/sortingAlgoConstants";
import { sortArrayElement } from "@/types/sortingAlgo";

const insertionSort = async (
  list: number[],
  getArrayElement: (idx: number) => sortArrayElement,
  setArrayElement: (
    idx1: number,
    idx2: number,
    element?: sortArrayElement
  ) => Promise<void>,
  iteratingOverElements: (index1: number, index2: number, color?: string) => Promise<void>
): Promise<void> => {
  /*
    1. First element is sorted
    2. Iterate through the unsorted array, then 
  */
  let sortedSublist = 1;
  await iteratingOverElements(0, list.length - 1);

  while (sortedSublist < list.length) {
    await iteratingOverElements(0, sortedSublist, sortedBarColor);
    const element = list[sortedSublist];
    const tempElement = getArrayElement(sortedSublist);

    let j = sortedSublist - 1;

    while (j >= 0 && list[j] > element) {
      const jElement = getArrayElement(j);
      setArrayElement(j, -1, { number: element, barHeight: 0, barColor: "" });

      // shift greater elements to the right
      list[j + 1] = list[j];
      await setArrayElement(j + 1, -1, jElement);

      j--;
    }

    list[j + 1] = element;
    await setArrayElement(j + 1, -1, tempElement);

    sortedSublist++;
  }
};

export default insertionSort;
