import { sleep } from "@/helpers/helper";
import { CellClass } from "@/types/pathFinders";
import {
  cellCsv,
  csv,
  setAllCellsAsWall,
  turnAlternateCellsToWalls
} from "./mazeHelpers";

const primsMazeGenerator = async (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (a: CellClass) => Promise<void>,
  clearWall: (a: CellClass) => Promise<any>
) => {
  turnAlternateCellsToWalls(matrix, startNode, endNode, makeWall);

  await sleep(1000);

  const numberOfCells = Math.floor((matrix.length / 2) * (matrix[0].length / 2));

  let currentCell: CellClass = matrix[0][0];

  let frontierCells: CellClass[] = [];

  const partOfTheMaze: { [key: string]: string } = {};

  while (Object.keys(partOfTheMaze).length < numberOfCells) {
    // for (let i = 0; i < 3; i++) {
    currentCell.isVisited = true;

    partOfTheMaze[cellCsv(currentCell)] = "";

    const newFrontierCells = currentCell
      .addNeighbors(matrix, false, 2)
      .filter(c => !(cellCsv(c) in partOfTheMaze));

    // frontierCells.push(...newFrontierCells);
    frontierCells = newFrontierCells;

    if (frontierCells.length === 0) {
      const randKey = Object.keys(partOfTheMaze)[
        Math.floor(Math.random() * Object.keys(partOfTheMaze).length)
      ];

      const [row, col] = randKey.split(",").map(Number);

      currentCell = matrix[row][col];

      continue;
    }

    const neighbor: CellClass =
      frontierCells[Math.floor(Math.random() * frontierCells.length)];

    // console.log({
    //   currentCell: cellCsv(currentCell),
    //   neighbor: cellCsv(neighbor),
    //   frontierCells: frontierCells.map(cellCsv)
    // });

    // we need a neighbor that is part of a maze
    // while (!(csv(neighbor.row, neighbor.col) in partOfTheMaze)) {
    //   neighbor = frontierCells[Math.floor(Math.random() * frontierCells.length)];
    // }

    neighbor.isVisited = true;
    partOfTheMaze[cellCsv(neighbor)] = "";

    if (neighbor !== currentCell) {
      const wallRemoved: CellClass = currentCell.removeWalls(neighbor, matrix);

      currentCell = neighbor;

      await clearWall(wallRemoved);
    }
  }
};

export default primsMazeGenerator;
