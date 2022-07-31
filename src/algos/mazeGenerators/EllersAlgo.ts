import { randNum, sleep } from "@/helpers/helper";
import { CellClass } from "@/types/pathFinders";
import { csv, turnAlternateCellsToWalls } from "./mazeHelpers";

interface setToCellsMapInterface {
  [key: string]: { [key: string]: boolean };
}

const ellersMaze = async (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (a: CellClass) => Promise<void>,
  clearWall: (a: CellClass) => Promise<void>
): Promise<void> => {
  let setToCellsMap: setToCellsMapInterface = {};

  turnAlternateCellsToWalls(matrix, startNode, endNode, makeWall);

  await sleep(1000);

  const colWallRemoveThreshold = 0.25;
  const rowWallRemoveThreshold = 0.1;

  let row = 0;

  while (row < matrix.length - 2) {
    for (let col = 0; col < matrix[0].length - 2; col += 2) {
      /* 
        check if the current cell and the cell 2 places right to it are not in the same 
        ellers set. And if they're not, randomly remove the wall between them
      */

      const currentCell = matrix[row][col];
      const nextCell = matrix[row][col + 2];

      if (currentCell.ellersSet !== nextCell.ellersSet) {
        if (Math.random() > colWallRemoveThreshold) {
          const setId = currentCell.ellersSet;
          await clearWall(matrix[row][col + 1]);

          // now the two cells are in the same set
          nextCell.ellersSet = setId;

          // add these two cells to map
          if (!setToCellsMap[setId]) {
            setToCellsMap[setId] = {};
          }

          setToCellsMap[setId][csv(currentCell.row, currentCell.col)] = true;
          setToCellsMap[setId][csv(nextCell.row, nextCell.col)] = true;
        }
      }
    }

    for (const [key, value] of Object.entries(setToCellsMap)) {
      let amount = 0;
      for (const str of Object.keys(value)) {
        const [row, col] = str.split(",").map(Number);
        // randomly change the set of the cell two steps below the current cell
        // and remove the vertical wall between them
        if (Math.random() > rowWallRemoveThreshold) {
          matrix[row + 2][col].ellersSet = key;
          await clearWall(matrix[row + 1][col]);
          amount++;
        }
      }

      // if no wall was removed, make sure to remove a wall
      if (amount === 0) {
        const allowedCols: number[] = [];

        for (let col = 0; col < matrix[0].length; col += 2) {
          allowedCols.push(col);
        }

        const randCol = allowedCols[randNum(0, allowedCols.length - 1)];

        matrix[row + 2][randCol].ellersSet = key;
        await clearWall(matrix[row + 1][randCol]);
      }
    }

    // reset the map as once we're done with a row, we never revisit it
    setToCellsMap = {};

    row += 2;
  }

  // remove all walls from the last row
  for (let col = 0; col < matrix[0].length; col++) {
    clearWall(matrix[matrix.length - 1][col]);
  }
};

export default ellersMaze;
