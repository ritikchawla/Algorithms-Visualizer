import { pathFindingAlgorithms } from "@/constants/pathFindersConstants";
import { CellClass } from "@/types/pathFinders";

export const getLowestScoreNode = (
  array: CellClass[],
  algo: string
): [number, CellClass] => {
  let minNode: CellClass = array[0];
  let index = 0;

  if (algo === pathFindingAlgorithms.DIJKSTRA) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].djikstraScore < minNode.djikstraScore) {
        minNode = array[i];
        index = i;
      }
    }
  } else if (algo === pathFindingAlgorithms.A_STAR) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].fScore < minNode.fScore) {
        minNode = array[i];
        index = i;
      }
    }
  }

  return [index, minNode];
};

export const heuristic = (start: CellClass, end: CellClass, algo: string): number => {
  if (algo === pathFindingAlgorithms.A_STAR) {
    return Math.sqrt(Math.pow(start.row - end.row, 2) + Math.pow(start.col - end.col, 2));
  } else if (algo === pathFindingAlgorithms.DIJKSTRA) {
    return start.row !== end.row ? start.row - end.row : start.col - end.col;
  }

  return 0;
};
