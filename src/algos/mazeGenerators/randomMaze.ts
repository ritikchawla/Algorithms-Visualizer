import { CellClass } from "@/types/pathFinders";

const randomMaze = async (
  startNode: CellClass,
  endNode: CellClass,
  matrix: CellClass[][],
  makeWall: (cell: CellClass) => Promise<any>
) => {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      const cell = matrix[row][col];

      if (cell === startNode || cell === endNode) continue;

      if (Math.random() < 0.3) {
        await makeWall(cell);
      }
    }
  }
};

export default randomMaze;
