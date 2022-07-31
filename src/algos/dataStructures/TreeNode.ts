import { randomId } from "@/helpers/helper";

class TreeNode {
  value: number;
  leftChild: TreeNode | null;
  rightChild: TreeNode | null;
  parent: TreeNode | null;
  uuid: string;
  depth: number;

  constructor(value: number, depth: number) {
    this.value = value;
    this.leftChild = null;
    this.rightChild = null;
    this.parent = null;
    this.depth = depth;
    this.uuid = randomId();
  }

  isLeaf() {
    return !this.leftChild && !this.rightChild;
  }

  isRoot() {
    return !this.parent;
  }

  repr(): string {
    return this.value.toString();
  }
}

export default TreeNode;
