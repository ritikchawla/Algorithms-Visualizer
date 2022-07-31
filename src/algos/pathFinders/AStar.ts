import { pathFindingAlgorithms } from "@/constants/pathFindersConstants";
import { CellClass } from "@/types/pathFinders";
import { getLowestScoreNode, heuristic } from "./helpers";

const aStarAlgo = async (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  highlightGrid: (a: CellClass[], b: CellClass[]) => Promise<any>,
  colorFinalPath: () => void
): Promise<any> => {
  const algo = pathFindingAlgorithms.A_STAR;

  let openSet: CellClass[] = [startNode];
  const closedSet: CellClass[] = [];

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known
  startNode.gScore = 0;

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how short a path from start to finish can be if it goes through n.
  startNode.fScore = startNode.gScore + heuristic(startNode, endNode, algo);

  while (openSet.length > 0) {
    const [index, currentNode] = getLowestScoreNode(openSet, algo);

    if (currentNode === endNode) {
      break;
    }

    openSet = openSet.slice(0, index).concat(openSet.slice(index + 1));
    closedSet.push(currentNode);

    for (const neighbor of currentNode.addNeighbors(matrix)) {
      if (closedSet.includes(neighbor) || neighbor.isWall) continue;

      const tempG: number = neighbor.gScore + heuristic(currentNode, neighbor, algo);

      if (!openSet.includes(neighbor)) {
        neighbor.gScore = tempG;
        openSet.push(neighbor);
      } else if (tempG > neighbor.fScore) {
        continue;
      }

      neighbor.previous = currentNode;
      neighbor.gScore = tempG;

      if (neighbor.hScore === 0) {
        neighbor.hScore = heuristic(neighbor, endNode, algo);
      }

      neighbor.fScore = neighbor.gScore + neighbor.hScore;

      // call the callback here
      await highlightGrid(openSet, closedSet);
    }
  }

  colorFinalPath();
};

export default aStarAlgo;
