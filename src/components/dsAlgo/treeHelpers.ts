import BinaryTree from "@/algos/dataStructures/BinaryTree";
import Heap from "@/algos/dataStructures/Heap";
import TreeNode from "@/algos/dataStructures/TreeNode";
import {
  ARROW_TRIANGLE_RADIUS,
  backgroundColor,
  headPointerColor,
  nodeStrokeColor,
  NODE_SIZE,
  pointerColor1,
  pointerColor2,
  TREE_ARROW_ANGLE,
  TREE_ARROW_LENGTH
} from "@/constants/dsAlgoConstants";
import { sleep } from "@/helpers/helper";
import {
  arrowName,
  binaryTreeNode,
  binaryTreeNodesObject,
  heapNode
} from "@/types/dsAlgo";
import {
  drawArrow,
  drawNode,
  highlightNode,
  translatePaperItem,
  tweenOpacity
} from "./globalHelpers";

export const drawBinaryTreeNode = (
  binaryTreeNodesList: binaryTreeNodesObject,
  heapNodesList: heapNode,
  parentNode: TreeNode | number,
  newNode: TreeNode | number,
  side: arrowName,
  depth: number,
  show = true
) => {
  let x = 0;
  let y = 0;

  // if parent node is a TreeNode then we're adding a Binary Tree Node,
  // else we're adding a heap node
  const isForTree = parentNode instanceof TreeNode;

  if (parentNode instanceof TreeNode) {
    // center of the new node is at the end of the tip of the arrow
    // of the parent node
    const { x: a, y: b } = binaryTreeNodesList[parentNode.uuid][
      side
    ].children[1].position;
    x = a;
    y = b;

    if (show) {
      // make parent's arrow visible
      binaryTreeNodesList[parentNode.uuid][side].visible = true;
      tweenOpacity(binaryTreeNodesList[parentNode.uuid][side], 0, 1, 300);
    }
  } else {
    // it's a heap node
    const { x: a, y: b } = heapNodesList[parentNode][side].children[1].position;
    x = a;
    y = b;

    if (show) {
      // make parent's arrow visible
      heapNodesList[parentNode][side].visible = true;
      tweenOpacity(heapNodesList[parentNode][side], 0, 1, 300);
    }
  }

  y += ARROW_TRIANGLE_RADIUS;

  if (side === "leftArrow") x -= NODE_SIZE;

  if (!(newNode instanceof TreeNode)) {
    newNode = new TreeNode(newNode, depth);
  }

  const drawnNode = drawNode(newNode, x, y);

  const { x: lx, y: ly } = drawnNode.rect.handleBounds.bottomLeft;
  const { x: rx, y: ry } = drawnNode.rect.handleBounds.bottomRight;

  const leftArrow = drawArrow(lx, ly, TREE_ARROW_LENGTH / depth);
  const rightArrow = drawArrow(rx, ry, TREE_ARROW_LENGTH / depth);

  if (isForTree) {
    binaryTreeNodesList[newNode.uuid] = {
      treeNode: newNode,
      node: drawnNode,
      leftArrow,
      rightArrow
    };
  } else {
    const pNodeIdx = parentNode as number;
    const childNodeNum = side === "leftArrow" ? 2 * pNodeIdx : 2 * pNodeIdx + 1;

    heapNodesList[childNodeNum] = {
      treeNode: newNode,
      node: drawnNode,
      leftArrow,
      rightArrow
    };
  }
  console.log({ depth });
  leftArrow.rotate(TREE_ARROW_ANGLE / (depth / 1.5), new paper.Point(lx, ly));
  rightArrow.rotate(-TREE_ARROW_ANGLE / (depth / 1.5), new paper.Point(rx, ry));

  // hide the arrows and only show them once a child is added
  leftArrow.visible = false;
  rightArrow.visible = false;

  if (!show) {
    drawnNode.rect.visible = false;
    drawnNode.text.visible = false;
  }

  return { binaryTreeNodesList, heapNodesList };
};

/** Draw the root of a binary tree and/or a heap */
export const drawTreeRoot = (
  canvas: HTMLCanvasElement | undefined,
  binaryTreeNodesList: binaryTreeNodesObject,
  heapNodesList: heapNode,
  myBinaryTree: BinaryTree,
  myHeap: Heap,
  root: TreeNode | null,
  isTree = true,
  isHeap = false
) => {
  if (!canvas) return { binaryTreeNodesList, heapNodesList };

  const x = canvas.width / 2.5;
  const y = 50;

  const drawnNode = drawNode(root, x, y);

  const rootArrow = drawArrow(
    drawnNode.rect.handleBounds.topRight.x + 10,
    drawnNode.rect.handleBounds.topRight.y + NODE_SIZE / 2,
    40,
    headPointerColor.paperColor,
    "ROOT"
  );

  // if a root actually exists, draw it's arrows and value
  if (myBinaryTree.root || myHeap?.heap?.length > 0) {
    const { x: lx, y: ly } = drawnNode.rect.handleBounds.bottomLeft;
    const { x: rx, y: ry } = drawnNode.rect.handleBounds.bottomRight;

    const leftArrow = drawArrow(lx, ly, TREE_ARROW_LENGTH);
    const rightArrow = drawArrow(rx, ry, TREE_ARROW_LENGTH);

    leftArrow.rotate(TREE_ARROW_ANGLE, new paper.Point(lx, ly));
    rightArrow.rotate(-TREE_ARROW_ANGLE, new paper.Point(rx, ry));

    leftArrow.visible = false;
    rightArrow.visible = false;

    if (isTree) {
      binaryTreeNodesList[(myBinaryTree.root as TreeNode).uuid] = {
        treeNode: root,
        node: drawnNode,
        leftArrow,
        rightArrow
      };
    } else if (isHeap) {
      heapNodesList[1] = {
        treeNode: root,
        node: drawnNode,
        leftArrow,
        rightArrow
      };
    }
  }

  /*
    arrow is drawn with head pointing downwards. Bring the head to the center
    of the node and rotate the whole thing about its head
  */
  rootArrow.rotate(90, new paper.Point(rootArrow.position.x, rootArrow.position.y));

  // now the arrow is at the bottom of the node
  rootArrow.position.y = drawnNode.rect.handleBounds.center.y;
  rootArrow.position.x =
    drawnNode.rect.handleBounds.center.x + 30 + rootArrow.handleBounds.width / 2;

  rootArrow.children[2].rotate(90);

  return { binaryTreeNodesList, heapNodesList };
};

/**
 * Delete the paper object associated with a tree node
 * @param childNode Tree Node to be deleted
 * @param parentNode parent of childNode
 * @param arrowToDelete whether to delete the parent's right or left arrow
 * @param animationSpeed animationSpeed
 */
export const animateTreeNodeDeletion = async (
  childNode: binaryTreeNode,
  parentNode: binaryTreeNode,
  arrowToDelete: arrowName,
  animationSpeed: number
): Promise<void> => {
  /*  
    1. Delete the child node which will always be a leaf node
    2. Delete it's parent's arrow
  */

  // color the child node white to indicate it's going to be deleted
  childNode.node.rect.fillColor = nodeStrokeColor;
  childNode.node.text.strokeColor = backgroundColor.paperColor;
  childNode.node.text.bringToFront();

  await sleep(1500);

  const childGroup = new paper.Group([childNode.node.rect, childNode.node.text]);

  tweenOpacity(childGroup, 1, 0, animationSpeed);

  // parentNode won't exist if a root node is being deleted
  if (parentNode) {
    tweenOpacity(parentNode[arrowToDelete], 1, 0, animationSpeed);
  }

  return new Promise(r => setTimeout(r, animationSpeed));
};

export const groupAllNodes = (
  binaryTreeNodes: binaryTreeNodesObject,
  uuid: string,
  array: paper.Group[],
  colorNode = true,
  color?: string | paper.Color
): paper.Group => {
  const node = binaryTreeNodes[uuid];

  if (colorNode) highlightNode(node.node, 100, color, false);

  array[0].addChildren([node.node.rect, node.node.text, node.leftArrow, node.rightArrow]);

  if (node.treeNode) {
    if (node.treeNode.leftChild)
      groupAllNodes(
        binaryTreeNodes,
        node.treeNode.leftChild.uuid,
        array,
        colorNode,
        color
      );

    if (node.treeNode.rightChild)
      groupAllNodes(
        binaryTreeNodes,
        node.treeNode?.rightChild?.uuid,
        array,
        colorNode,
        color
      );
  }

  return array[0];
};

const treeInversionOneChild = async (
  binaryTreeNodesList: binaryTreeNodesObject,
  nodeId: string,
  parentNodeId: string,
  nodeToTranslate: "right" | "left",
  animationSpeed: number
) => {
  const arrowName: arrowName = nodeToTranslate === "right" ? "leftArrow" : "rightArrow";
  const oppArrowName: arrowName = arrowName === "rightArrow" ? "leftArrow" : "rightArrow";

  const xAdder = nodeToTranslate === "left" ? NODE_SIZE / 2 : -(NODE_SIZE / 2);

  const parent = binaryTreeNodesList[parentNodeId];

  const array = [new paper.Group()];
  const group = groupAllNodes(
    binaryTreeNodesList,
    nodeId,
    array,
    <boolean>parent.treeNode?.isRoot(),
    pointerColor1.paperColor
  );

  // move group to the position of this arrow
  const { x } = parent[arrowName].children[1].position;

  // hide the arrow that the node was originally attached to
  tweenOpacity(parent[oppArrowName], 1, 0, animationSpeed);

  // show the opposite arrow
  parent[arrowName].visible = true;
  tweenOpacity(parent[arrowName], 0, 1, animationSpeed);

  translatePaperItem(
    group,
    { x: group.position.x, y: group.position.y },
    { x: x + xAdder, y: group.position.y },
    animationSpeed,
    true,
    100
  );

  return new Promise(resolve => setTimeout(resolve, animationSpeed * 2));
};

export const animateBinaryTreeInversion = async (
  binaryTreeNodesList: binaryTreeNodesObject,
  id1: string,
  id2: string,
  parentNodeId: string,
  animationSpeed: number
): Promise<binaryTreeNodesObject> => {
  // sure that this exists
  const isParentRoot = <boolean>binaryTreeNodesList[parentNodeId].treeNode?.isRoot();

  if (!id1 || !id2) {
    // no right node in the binaryTreeNodesList, but left and right nodes
    // are swapped in the binary tree so binary tree does have a right node

    const side = !id1 ? "left" : "right";
    const nodeId = !id1 ? id2 : id1;

    await treeInversionOneChild(
      binaryTreeNodesList,
      nodeId,
      parentNodeId,
      side,
      animationSpeed
    );

    return binaryTreeNodesList;
  }

  let array = [new paper.Group()];

  const groupLeft = groupAllNodes(
    binaryTreeNodesList,
    id1,
    array,
    isParentRoot,
    pointerColor2.paperColor
  );

  array = [new paper.Group()];
  const groupRight = groupAllNodes(
    binaryTreeNodesList,
    id2,
    array,
    isParentRoot,
    pointerColor1.paperColor
  );

  const { x: leftChildX, y: leftChildY } = binaryTreeNodesList[id1].node.rect.position;
  const { x: rightChildX, y: rightChildY } = binaryTreeNodesList[id2].node.rect.position;

  // 1. Hide right child
  tweenOpacity(groupRight, 1, 0, animationSpeed * 2);

  // 2. Translate left child to the position of right child
  await translatePaperItem(
    groupLeft,
    { x: leftChildX, y: leftChildY },
    { x: rightChildX, y: rightChildY },
    animationSpeed,
    true,
    100
  );

  // 3. Show right child
  tweenOpacity(groupRight, 0, 1, animationSpeed * 2);

  // 4. Translate right child to position of left child
  await translatePaperItem(
    groupRight,
    { x: rightChildX, y: rightChildY },
    { x: leftChildX, y: leftChildY },
    animationSpeed,
    true,
    100
  );

  return new Promise(resolve =>
    setTimeout(() => resolve(binaryTreeNodesList), animationSpeed * 2)
  );
};
