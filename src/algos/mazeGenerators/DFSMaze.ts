import { sleep } from "@/helpers/helper";
import { CellClass } from "@/types/pathFinders";
import { turnAlternateCellsToWalls } from "./mazeHelpers";

const DepthFirstSearchMaze = async (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (cell: CellClass) => Promise<void>,
  clearWall: (cell: CellClass) => Promise<void>
): Promise<void> => {
  turnAlternateCellsToWalls(matrix, startNode, endNode, makeWall);

  await sleep(1000);

  const openSet: CellClass[] = [];
  let currentCell: CellClass = matrix[0][0];

  for (;;) {
    currentCell.isVisited = true;

    const allNeighbors: CellClass[] = currentCell.addNeighbors(matrix, false, 2);

    if (!currentCell.hasUnvisitedNeighbors()) {
      if (openSet.length > 0) {
        currentCell = openSet.pop() as CellClass;
        continue;
      } else {
        break;
      }
    }

    let neighbor: CellClass =
      allNeighbors[Math.floor(Math.random() * allNeighbors.length)];

    // at this point we can be sure that the cell has atleast one unvisited neighbor
    // so we can run an infinite loop
    while (neighbor.isVisited) {
      neighbor = allNeighbors[Math.floor(Math.random() * allNeighbors.length)];
    }

    neighbor.isVisited = true;
    openSet.push(neighbor);

    const wallRemoved: CellClass = currentCell.removeWalls(neighbor, matrix);

    currentCell = neighbor;

    await clearWall(wallRemoved);
  }
};

export default DepthFirstSearchMaze;
