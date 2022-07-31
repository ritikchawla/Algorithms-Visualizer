import { treeTraversalTypes } from "@/constants/dsAlgoConstants";
import { arrayToListRepr } from "@/helpers/helper";
import { arrowName } from "@/types/dsAlgo";
import TreeNode from "./TreeNode";

// 75,100,60,25,12,30

// 8,12,1,9,11,18

class BinaryTree {
  root: TreeNode | null;
  nodesInsertionOrder: number[];
  highlightNode: (uuid: string) => Promise<void>;
  drawBinaryTreeNode: (
    parentNode: TreeNode,
    newNode: TreeNode,
    side: arrowName,
    depth: number
  ) => void;
  putTextOnCanvas: (text: string) => void;
  swapNodes: (id1: string, id2: string) => Promise<void>;
  deleteNodeFromBinaryTree: (nodeToDeleteId: string, parentUuid: string) => Promise<void>;
  animateBinaryTreeInversion: (
    id1: string,
    id2: string,
    parentNodeId: string
  ) => Promise<void>;

  constructor(
    highlightNode: (uuid: string) => Promise<void>,
    drawBinaryTreeNode: (
      parentNode: TreeNode,
      newNode: TreeNode,
      side: arrowName,
      depth: number
    ) => void,
    putTextOnCanvas: (text: string) => void,
    swapNodes: (id1: string, id2: string) => Promise<void>,
    deleteNodeFromBinaryTree: (
      nodeToDeleteId: string,
      parentUuid: string
    ) => Promise<void>,
    animateBinaryTreeInversion: (
      id1: string,
      id2: string,
      parentNodeId: string
    ) => Promise<void>
  ) {
    this.root = null;
    this.nodesInsertionOrder = [];
    this.highlightNode = highlightNode;
    this.drawBinaryTreeNode = drawBinaryTreeNode;
    this.putTextOnCanvas = putTextOnCanvas;
    this.swapNodes = swapNodes;
    this.deleteNodeFromBinaryTree = deleteNodeFromBinaryTree;
    this.animateBinaryTreeInversion = animateBinaryTreeInversion;
  }

  search(value: number, currentNode = this.root): TreeNode | null {
    if (!currentNode) return null;

    if (currentNode.value == value) return currentNode;

    const nextNode =
      value < currentNode.value ? currentNode.leftChild : currentNode.rightChild;

    return this.search(value, nextNode);
  }

  findLargestLeftChild(node: TreeNode): TreeNode {
    // find the rightmost node of the left sub-tree
    let currentNode = node.leftChild;

    for (;;) {
      // node is leaf node
      if (!currentNode || !currentNode.rightChild) break;

      currentNode = currentNode.rightChild;
    }

    return currentNode || node;
  }

  findSmallestRightChild(node: TreeNode): TreeNode {
    // find the leftmost node of the right sub-tree
    let currentNode = node.rightChild;

    for (;;) {
      // node is leaf node
      if (!currentNode || !currentNode.leftChild) break;

      currentNode = currentNode.leftChild;
    }

    return currentNode || node;
  }

  async insert(value: number, currentNode = this.root, depth = 2): Promise<BinaryTree> {
    this.nodesInsertionOrder.push(value);

    if (!this.root) {
      this.root = new TreeNode(value, 1);
      return this;
    }

    if (!currentNode) return this;

    const nextNode =
      value >= currentNode.value ? currentNode.rightChild : currentNode.leftChild;

    if (!currentNode.leftChild && value < currentNode.value) {
      const newNode = new TreeNode(value, depth);
      currentNode.leftChild = newNode;
      newNode.parent = currentNode;
      await this.highlightNode(currentNode.uuid);
      this.drawBinaryTreeNode(currentNode, newNode, "leftArrow", depth);
    } else if (!currentNode.rightChild && value >= currentNode.value) {
      const newNode = new TreeNode(value, depth);
      currentNode.rightChild = newNode;
      newNode.parent = currentNode;

      await this.highlightNode(currentNode.uuid);
      this.drawBinaryTreeNode(currentNode, newNode, "rightArrow", depth);
    } else {
      await this.highlightNode(currentNode.uuid);
      this.insert(value, nextNode, depth + 1);
    }
    return this;
  }

  async deleteNode(value: number) {
    let nodeToDelete = this.search(value);

    for (;;) {
      if (!nodeToDelete) return null;

      // the largestLeftChild will be larger than all numbers to the left of the nodeToDelete
      // and will be smaller than all the numbers to the right of the nodeToDelete
      let childToReplaceWith: TreeNode = nodeToDelete;

      if (nodeToDelete.leftChild) {
        const largestLeftChild = this.findLargestLeftChild(nodeToDelete);
        childToReplaceWith = largestLeftChild;
      } else if (nodeToDelete.rightChild) {
        const smallestRightChild = this.findSmallestRightChild(nodeToDelete);
        childToReplaceWith = smallestRightChild;
      }

      // swap the nodeToDelete with the largestLeftChild, then delete the largestLeftChild
      // will be easy as it's a leaf node
      const temp = nodeToDelete.value;
      nodeToDelete.value = childToReplaceWith.value;
      childToReplaceWith.value = temp;

      await this.swapNodes(nodeToDelete.uuid, childToReplaceWith.uuid);

      // keep swapping until the node to delete is a leaf node
      // helps with the animation
      if (!childToReplaceWith.isLeaf()) {
        nodeToDelete = childToReplaceWith;
        continue;
      }

      // the node to delete is a leaf node now, so just delete it
      const parent: TreeNode = childToReplaceWith.isRoot()
        ? childToReplaceWith
        : <TreeNode>childToReplaceWith.parent;

      await this.deleteNodeFromBinaryTree(childToReplaceWith.uuid, parent.uuid);

      // break the connection between the largestLeftChild and it's parentNode
      if (childToReplaceWith.parent?.leftChild === childToReplaceWith) {
        // if the replaced child has a left or right subtree
        if (childToReplaceWith.leftChild) {
          childToReplaceWith.parent.leftChild = childToReplaceWith.leftChild;
        } else if (childToReplaceWith.rightChild) {
          childToReplaceWith.parent.leftChild = childToReplaceWith.rightChild;
        } else {
          childToReplaceWith.parent.leftChild = null;
        }
      }

      if (childToReplaceWith.parent?.rightChild === childToReplaceWith) {
        // if the replaced child has a left or right subtree
        if (childToReplaceWith.leftChild) {
          childToReplaceWith.parent.rightChild = childToReplaceWith.leftChild;
        } else if (childToReplaceWith.rightChild) {
          childToReplaceWith.parent.rightChild = childToReplaceWith.rightChild;
        } else {
          childToReplaceWith.parent.rightChild = null;
        }
      }

      break;
    }
  }

  async treeTraversal(
    array: number[],
    traversalType: treeTraversalTypes = "inorder",
    currentNode = this.root
  ) {
    if (!currentNode) return;

    if (traversalType === "preorder") {
      array.push(currentNode.value);
      await this.highlightNode(currentNode.uuid);
      this.putTextOnCanvas(arrayToListRepr(array));
    }

    if (currentNode.leftChild) {
      await this.treeTraversal(array, traversalType, currentNode.leftChild);
    }

    if (traversalType === "inorder") {
      array.push(currentNode.value);
      await this.highlightNode(currentNode.uuid);
      this.putTextOnCanvas(arrayToListRepr(array));
    }

    if (currentNode.rightChild) {
      await this.treeTraversal(array, traversalType, currentNode.rightChild);
    }

    if (traversalType === "postorder") {
      array.push(currentNode.value);
      await this.highlightNode(currentNode.uuid);
      this.putTextOnCanvas(arrayToListRepr(array));
    }

    return array;
  }

  async invertBinaryTree(currentNode = this.root) {
    if (!currentNode || (!currentNode.leftChild && !currentNode.rightChild)) return;

    // if (currentNode.leftChild && !currentNode.rightChild) {
    //   this.insert(currentNode.leftChild.value, currentNode, currentNode.depth + 1);
    // }

    // if (currentNode.rightChild && !currentNode.leftChild) {
    //   this.insert(currentNode.rightChild.value, currentNode, currentNode.depth + 1);
    // }

    // swap nodes
    const temp = currentNode.leftChild;
    currentNode.leftChild = currentNode.rightChild;
    currentNode.rightChild = temp;

    await this.animateBinaryTreeInversion(
      <string>currentNode.leftChild?.uuid,
      <string>currentNode.rightChild?.uuid,
      currentNode.uuid
    );

    await this.invertBinaryTree(currentNode.leftChild);
    await this.invertBinaryTree(currentNode.rightChild);
  }
}

export default BinaryTree;
