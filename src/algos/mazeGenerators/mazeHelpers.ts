import { CellClass } from "@/types/pathFinders";

export const setAllCellsAsWall = (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (a: CellClass) => void
): void => {
  for (const row of matrix) {
    for (const col of row) {
      if (col !== startNode && col !== endNode) {
        makeWall(col);
      }
    }
  }
};

export const turnAlternateCellsToWalls = (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  makeWall: (cell: CellClass) => Promise<void>
): void => {
  for (let row = 0; row < matrix.length; row += 2) {
    for (let col = 0; col < matrix[0].length; col += 2) {
      for (const cell of matrix[row][col].addNeighbors(matrix, true)) {
        if (cell !== startNode && cell !== endNode) makeWall(cell);
      }
    }
  }
};

export const csv = (r: number, c: number): string => `${r},${c}`;

export const cellCsv = (cell: CellClass): string => csv(cell.row, cell.col);
