export const finalPathColor = "#f1c40f"; //"#1abc9c";
export const closedCellColor = "#fd79a8"; // "#ed4546"
export const openCellColor = "#55efc4";
export const defaultCellColor = "#dff9fb";
export const wallCellColor = "#2c3e50";
export const cellBorderColor = "#74b9ff";
export const secondaryCellBorderColor = "rgb(200, 200, 200)";

export const CELL_SIZE = 25;

export const pathFindingAlgorithms = Object.freeze({
  A_STAR: "A Star",
  DIJKSTRA: "Dijkstra's Algorithm",
  BREADTH_FIRST_SEARCH: "Breadth First Search",
  DEPTH_FIRST_SEARCH: "Depth First Search"
});

export const TOOLTIPS = Object.freeze({
  VISUALIZING: "The algorithm to visualize", //(click for more info)
  SPEED: "Speed of the animation in milliseconds",
  UNVISITED_NODE: "Nodes that have not been visited by the algorithm",
  WALL_NODE: "Nodes that are walls and cannot be passed through",
  OPEN_NODE: "Nodes that can still be expanded",
  CLOSED_NODE:
    "Nodes that are unfit for further expansion and have been marked as closed by the algorithm",
  FINAL_PATH: "Nodes that are part of the final path chosen by the algorithm"
});
