import TreeNode from "@/algos/dataStructures/TreeNode";
import { pointerColor1, pointerColor2, transparent } from "@/constants/dsAlgoConstants";
import { sleep } from "@/helpers/helper";
import { binaryTreeNode } from "@/types/dsAlgo";

export const swapHeapNodes = async (
  node1: binaryTreeNode,
  node2: binaryTreeNode,
  animationSpeed: number,
  heap = true
): Promise<void> => {
  /*
    1. Highlight nodes to be swapped
    2. Swap nodes in heap array
    3. Swap the values of node's text for displaying as the state is not reactive
  */

  node1.node.rect.fillColor = pointerColor1.paperColor;
  node1.node.text.bringToFront();

  node2.node.rect.fillColor = pointerColor1.paperColor;
  node2.node.text.bringToFront();

  await sleep(500);

  node1.node.rect.fillColor = pointerColor2.paperColor;
  node1.node.text.bringToFront();

  node2.node.rect.fillColor = pointerColor2.paperColor;
  node2.node.text.bringToFront();

  return new Promise(resolve =>
    setTimeout(() => {
      if (heap) {
        const temp = node1.treeNode?.value as number;
        (node1.treeNode as TreeNode).value = node2.treeNode?.value as number;
        (node2.treeNode as TreeNode).value = temp;

        node1.node.text.content = (node1.treeNode as TreeNode).value.toString();
        node2.node.text.content = (node2.treeNode as TreeNode).value.toString();
      } else {
        node1.node.text.content = (node1.treeNode as TreeNode).value.toString();
        node2.node.text.content = (node2.treeNode as TreeNode).value.toString();
      }

      node1.node.rect.fillColor = transparent;
      node1.node.text.bringToFront();

      node2.node.rect.fillColor = transparent;
      node2.node.text.bringToFront();

      resolve();
    }, animationSpeed)
  );
};
