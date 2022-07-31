import LinkedList from "@/algos/dataStructures/LinkedList";
import { llNodeNull } from "@/algos/dataStructures/LinkedListNode";
import {
  ARROW_LENGTH,
  ARROW_NODE_MARGIN,
  backgroundColor,
  headPointerColor,
  nodeDeleteColor,
  NODE_SIZE,
  pointerColor1
} from "@/constants/dsAlgoConstants";
import {
  linkedListNodesList,
  typeLinkedListStartPointer,
  paperJsNode
} from "@/types/dsAlgo";
import {
  drawArrow,
  drawNode,
  removePaperJsNode,
  translatePaperItem,
  tweenOpacity
} from "./globalHelpers";

type pointersReturnType = {
  linkedListNodes: linkedListNodesList[];
  nullNode: paperJsNode;
  linkedListStartPointer: typeLinkedListStartPointer | undefined;
};

/**
 * @param index index of the node on which to draw the pointer
 * @param color color of the pointer
 * @param top whether to put draw pointer on top of the node or at the bottom
 * @param add whether to add the new pointer's paper object to the node's list of pointers
 * @param textString text to show above or below the pointer
 */
export const drawPointerOnNode = (
  linkedListNodes: linkedListNodesList[],
  nullNode: paperJsNode,
  index: number,
  linkedListStartPointer?: typeLinkedListStartPointer,
  color?: paper.Color,
  top = false,
  add = true,
  textString?: string
): pointersReturnType => {
  if (!color) color = pointerColor1.paperColor;

  const linkedListNodeObject: linkedListNodesList = linkedListNodes[index];

  const node = linkedListNodeObject ? linkedListNodeObject.node : nullNode;

  const getValuesFrom = top
    ? node.rect.handleBounds.topRight
    : node.rect.handleBounds.bottomRight;

  const { x, y } = getValuesFrom;

  const arrow = drawArrow(x, y, 30, color, textString);

  arrow.position.x -= NODE_SIZE / 2;

  if (!top) {
    arrow.position.y += ARROW_NODE_MARGIN; //+ this.linkedListNodes[index].pointers.length * ARROW_LENGTH;
    arrow.rotate(180);
  } else {
    arrow.position.y -= arrow.handleBounds.height + ARROW_NODE_MARGIN;
  }

  // only add the pointer to the pointers list if the node is not a null node

  if (node !== nullNode) {
    if (!linkedListNodes[index].pointers) {
      linkedListNodes[index].pointers = [];
    }

    // we won't be adding the start pointer to a node's pointers list
    if (add) {
      linkedListNodes[index].pointers.push(arrow);
    } else {
      // it's a start pointer
      linkedListStartPointer = {
        pointer: arrow,
        index
      };
    }
  }

  return { linkedListStartPointer, linkedListNodes, nullNode };
};

/**
 * @param fromIdx Pointer of the node to be translated
 * @param toIdx Translate pointer to which node
 * @param startPointer If it's a start pointer, draw it on the top
 *
 * if toIdx is within bound of the array, the pointer is translated to the
 * corresponding node, else it's translated to the NULL node
 */
export const translatePointer = async (
  linkedListNodes: linkedListNodesList[],
  nullNode: paperJsNode,
  linkedListStartPointer: typeLinkedListStartPointer,
  fromIdx: number,
  toIdx: number,
  animationSpeed: number,
  startPointer = false
): Promise<pointersReturnType> => {
  let pointer: paper.Group;

  // console.log({
  //   fromIdx,
  //   number: linkedListNodes[fromIdx].node.text.content,
  //   pointers: linkedListNodes[fromIdx].pointers
  // });

  if (!startPointer) {
    pointer = linkedListNodes[fromIdx].pointers[0];
  } else {
    pointer = linkedListStartPointer.pointer;
  }

  const { x: fromX, y: fromY } = pointer.position;

  let toX: number;
  const withinBounds = toIdx < linkedListNodes.length && toIdx !== -1;

  if (!withinBounds) {
    toX = nullNode.rect.handleBounds.center.x;
  } else {
    toX = linkedListNodes[toIdx].node.rect.handleBounds.center.x;
  }

  const toY = pointer.position.y;

  await translatePaperItem(
    pointer,
    { x: fromX, y: fromY },
    { x: toX, y: toY },
    animationSpeed,
    true,
    100
  );

  if (withinBounds) {
    linkedListNodes[fromIdx].pointers.shift();
    linkedListNodes[toIdx].pointers.push(pointer);
  }

  return new Promise(r => r({ linkedListNodes, nullNode, linkedListStartPointer }));
};

export const drawLinkedList = (
  startPtr: llNodeNull,
  myLinkedList: LinkedList,
  linkedListNodes: linkedListNodesList[],
  nullNode: paperJsNode
): pointersReturnType => {
  let ptr = startPtr;
  let x = 100;
  const y = 300;

  let drawnNode: paperJsNode;

  do {
    drawnNode = drawNode(ptr, x, y);

    x += drawnNode.rect.handleBounds.width + ARROW_LENGTH + 20;

    const { x: x2, y: y2 } = drawnNode.rect.handleBounds.bottomRight;

    const arrow: paper.Group = drawArrow(x2 + 5, y2, ARROW_LENGTH);
    arrow.rotate(-90, new paper.Point(x2 + 5, y2));
    arrow.position.y -= NODE_SIZE / 2;

    // don't show any arrows to next node if linked list is empty
    if (myLinkedList.length === 0) arrow.visible = false;

    linkedListNodes.push({
      node: drawnNode,
      arrowNext: arrow,
      pointers: []
    });

    if (ptr) ptr = ptr.next;
  } while (ptr !== null);

  // draw a NULL node
  if (myLinkedList.length > 0) nullNode = drawNode(null, x, y);

  // draw the start pointer
  const value = drawPointerOnNode(
    linkedListNodes,
    nullNode,
    0,
    undefined,
    headPointerColor.paperColor,
    true,
    false,
    "START"
  );

  const linkedListStartPointer = value.linkedListStartPointer;
  linkedListNodes = value.linkedListNodes;
  nullNode = value.nullNode;

  // testing curves
  // const handleOut = new paper.Point(100, 200);

  // const firstPoint = new paper.Point(100, 50);
  // const firstSegment = new paper.Segment(firstPoint, undefined, handleOut);

  // const secondPoint = new paper.Point(500, 50);
  // const secondSegment = new paper.Segment(secondPoint, undefined, undefined);

  // const path = new paper.Path([firstSegment, secondSegment]);
  // path.strokeColor = new paper.Color("white");
  // path.strokeWidth = 3;

  return { linkedListNodes, linkedListStartPointer, nullNode };
};

export const animateLinkedListNodeDeletion = async (
  linkedListNodes: linkedListNodesList[],
  nullNode: paperJsNode,
  indexToDelete: number,
  animationSpeed: number
): Promise<pointersReturnType> => {
  /*
    1. Take the pointer of the node previous to this node, then
    point it to the next node
    2. Delete the current node's pointer
  */

  const previousNode = linkedListNodes[indexToDelete - 1];

  const nodeToDelete = linkedListNodes[indexToDelete];

  let nextNode: linkedListNodesList | paperJsNode = linkedListNodes[indexToDelete + 1];
  nextNode = nextNode ? nextNode : nullNode;

  // edge cases, start node deleted
  if (!previousNode) {
    nodeToDelete.arrowNext.visible = false;
    nodeToDelete.node.rect.fillColor = nodeDeleteColor.paperColor;
    nodeToDelete.node.text.fillColor = backgroundColor.paperColor;
    nodeToDelete.node.text.bringToFront();

    setTimeout(() => {
      linkedListNodes = linkedListNodes.filter(node => node !== nodeToDelete);

      removePaperJsNode(nodeToDelete.node, {
        arrowNext: nodeToDelete.arrowNext
      });
    }, animationSpeed);

    return { linkedListNodes, nullNode, linkedListStartPointer: undefined };
  }

  // edge case, end node deleted

  // middle node deleted
  /*
   1. Hide previous node's arrow
   2. Delete arrow of current node
   3. Delete the current node
   4. Translate all the right nodes to the left
   5. Visibilize previous node's arrow
  */

  tweenOpacity(previousNode.arrowNext, 1, 0, animationSpeed);
  tweenOpacity(nodeToDelete.arrowNext, 1, 0, animationSpeed);

  const deltedNodeX =
    nodeToDelete.node.rect.position.x +
    nodeToDelete.arrowNext.handleBounds.width +
    2 * NODE_SIZE +
    2 * ARROW_NODE_MARGIN;

  return new Promise(resolve =>
    setTimeout(() => {
      linkedListNodes = linkedListNodes.filter(node => {
        console.log("filtertin");
        return node !== nodeToDelete;
      });

      // put the pointers of the deleted node in the arrow of pointers of the
      // node after that node so that we can remove these pointers from the
      // canvas
      linkedListNodes[indexToDelete].pointers.push(...nodeToDelete.pointers);

      console.log({
        nodeToDelete: nodeToDelete.node.text.content,
        idx: linkedListNodes[indexToDelete].node.text.content
      });

      const group = new paper.Group([nodeToDelete.node.rect, nodeToDelete.node.text]);

      group
        .tween({ opacity: 1 }, { opacity: 0 }, { duration: animationSpeed })
        .then(() => {
          removePaperJsNode(nodeToDelete.node, {
            arrowNext: nodeToDelete.arrowNext,
            pointer: nodeToDelete.pointers[0]
          });

          const list = linkedListNodes.slice(indexToDelete);
          const newGroup = new paper.Group();

          let i = 0;
          for (const obj of list) {
            newGroup.insertChild(i, obj.node.rect);
            newGroup.insertChild(i + 1, obj.node.text);
            newGroup.insertChild(i + 2, obj.arrowNext);
            i += 2;
          }

          newGroup.insertChild(i, nullNode.rect);
          newGroup.insertChild(i + 1, nullNode.text);

          newGroup
            .tween(
              { position: { x: newGroup.position.x, y: newGroup.position.y } },
              {
                position: {
                  x: deltedNodeX,
                  y: newGroup.position.y
                }
              },
              { duration: animationSpeed }
            )
            .then(() => {
              tweenOpacity(previousNode.arrowNext, 0, 1, animationSpeed);
              return resolve({
                linkedListNodes,
                nullNode,
                linkedListStartPointer: undefined
              });
            });
        });
    }, animationSpeed)
  );
};
