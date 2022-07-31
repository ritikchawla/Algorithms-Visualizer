import { randNum } from "@/helpers/helper";
import { CellClass } from "@/types/pathFinders";

enum Direction {
  vertical,
  horizontal
}

const chooseOrientation = (
  width: number,
  height: number,
  horizontalBias: boolean,
  verticalBias: boolean
): Direction => {
  if (horizontalBias) {
    return Math.random() < 0.6 ? Direction.horizontal : Direction.vertical;
  } else if (verticalBias) {
    return Math.random() > 0.7 ? Direction.horizontal : Direction.vertical;
  }

  if (width > height) {
    return Direction.vertical;
  } else if (height > width) {
    return Direction.horizontal;
  }

  return Math.random() > 0.5 ? Direction.vertical : Direction.horizontal;
};

/**
 * @param matrix The grid matrix
 * @param startRow The first row where we can draw a horizontal wall
 * @param startCol The first column where we can draw a vertical wall
 * @param endRow The last row where we can draw a horizontal wall
 * @param endCol The lst column where we can draw a vertical wall
 * @param startNode The start node, so that we don't draw a wall over it
 * @param endNode The target node, so that we don't draw a wall over it
 * @param horizontalBias draw maze with a horizontal bias
 * @param verticalBias draw maze with a vertical bias
 * @param makeWall Callback function to display the maze
 */
const recursiveDivisionMaze = async (
  matrix: CellClass[][],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
  startNode: CellClass,
  endNode: CellClass,
  horizontalBias: boolean,
  verticalBias: boolean,
  makeWall: (cell: CellClass) => Promise<void>
): Promise<void> => {
  if (startRow >= endRow || startCol >= endCol) return;

  // whether we're drawing a horizontal wall or a vertical wall
  const isHorizontal =
    chooseOrientation(
      endCol - startCol,
      endRow - startRow,
      horizontalBias,
      verticalBias
    ) === Direction.horizontal;
  const isVertical = !isHorizontal;

  // get random row to fill with walls if horizontal
  let drawAtRow: number = startRow;
  const rowsArray: number[] = []; // draw walls on even rows/cols
  const rowsPassageArray: number[] = []; // make passages on odd rows/cols

  // get random column to fill with walls if vertical
  let drawAtCol: number = startCol;
  const colsArray: number[] = []; // draw walls on even rows/cols
  const colsPassageArray: number[] = []; // make passages on odd rows/cols

  for (let i = startRow; i <= endRow; ) {
    rowsPassageArray.push(i);
    i += 2;
    rowsArray.push(i - 1);
  }

  for (let i = startCol; i <= endCol; ) {
    colsPassageArray.push(i);
    i += 2;
    colsArray.push(i - 1);
  }

  if (isHorizontal) {
    drawAtRow = rowsArray[randNum(0, rowsArray.length - 2)];
  } else {
    drawAtCol = colsArray[randNum(0, colsArray.length - 2)];
  }

  // going left to right if horizontal, i.e. add to columns, and rows remain constant
  const colAdder = isHorizontal ? 1 : 0;

  // going top to down if vertical, i.e. add to rows and columns remain constant
  const rowAdder = isVertical ? 1 : 0;

  // this is the cell where a wall will not be drawn and this cell will connect two halves of the grid
  let pathCell: CellClass;

  if (isHorizontal) {
    // the path cell will be at matrix[drawAtRow][randomColumn]
    const c = colsPassageArray[randNum(0, colsPassageArray.length - 1)];
    pathCell = matrix[drawAtRow][c];
  } else {
    // the path cell will be at matrix[randomRow][drawAtCol]
    const r = rowsPassageArray[randNum(0, rowsPassageArray.length - 1)];
    pathCell = matrix[r][drawAtCol];
  }

  let row = drawAtRow;
  let col = drawAtCol;
  const length = isHorizontal ? endCol - startCol : endRow - startRow;

  for (let i = 0; i <= length; i++) {
    const cell = matrix[row][col];

    // don't draw a wall if it's a startNode, endNode or if any of its neighbors
    // is a pathCell
    if (cell !== startNode && cell !== endNode && cell !== pathCell) {
      await makeWall(cell);
    }

    row += rowAdder;
    col += colAdder;
  }

  if (isHorizontal) {
    // top area of the horizontal wall
    await recursiveDivisionMaze(
      matrix,
      startRow,
      startCol,
      drawAtRow - 1,
      endCol,
      startNode,
      endNode,
      horizontalBias,
      verticalBias,
      makeWall
    );

    // bottom area of the horizontal wall
    await recursiveDivisionMaze(
      matrix,
      drawAtRow + 1,
      startCol,
      endRow,
      endCol,
      startNode,
      endNode,
      horizontalBias,
      verticalBias,
      makeWall
    );
  } else {
    // left area of the vertical wall
    await recursiveDivisionMaze(
      matrix,
      startRow,
      startCol,
      endRow,
      drawAtCol - 1,
      startNode,
      endNode,
      horizontalBias,
      verticalBias,
      makeWall
    );

    // right area of the vertical wall
    await recursiveDivisionMaze(
      matrix,
      startRow,
      drawAtCol + 1,
      endRow,
      endCol,
      startNode,
      endNode,
      horizontalBias,
      verticalBias,
      makeWall
    );
  }
};

export default recursiveDivisionMaze;
