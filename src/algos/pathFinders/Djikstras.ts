import { pathFindingAlgorithms } from "@/constants/pathFindersConstants";
import { CellClass } from "@/types/pathFinders";
import { getLowestScoreNode, heuristic } from "./helpers";

const dijkstarsAlgo = async (
  matrix: CellClass[][],
  startNode: CellClass,
  endNode: CellClass,
  highlightGrid: (a: CellClass[], b: CellClass[]) => Promise<any>,
  colorFinalPath: () => void
) => {
  const algo = pathFindingAlgorithms.DIJKSTRA;

  let unvisitedSet: CellClass[] = [startNode];
  startNode.djikstraScore = 0;

  while (unvisitedSet.length > 0) {
    const [index, currentNode] = getLowestScoreNode(unvisitedSet, algo);
    // const currentNode: CellClass = unvisitedSet.shift() as CellClass;

    unvisitedSet = unvisitedSet.slice(0, index).concat(unvisitedSet.slice(index + 1));

    if (currentNode.isVisited) continue;
    if (currentNode === endNode) break;

    for (const neighbor of currentNode.addNeighbors(matrix)) {
      if (neighbor.isVisited || neighbor.isWall) continue;

      const newScore =
        heuristic(startNode, neighbor, algo) + heuristic(neighbor, endNode, algo);

      if (newScore < neighbor.djikstraScore) {
        neighbor.previous = currentNode;
        neighbor.djikstraScore = newScore;
      }

      unvisitedSet.push(neighbor);
    }

    currentNode.isVisited = true;

    await highlightGrid(unvisitedSet, []);
  }

  colorFinalPath();
};

export default dijkstarsAlgo;
