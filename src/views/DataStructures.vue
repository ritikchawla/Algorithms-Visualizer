<template>
  <div>
    <AlgoNavBar
      :algorithmsList="allMainDsAlgos"
      :buttonsList="[]"
      :selectedAlgo="selectedMainDsAlgo.name"
      @algorithmChanged="algorithmChanged"
      v-model:algoSpeed.sync="animationSpeed"
    />
    <div class="algo-container">
      <div class="left-panel">
        <div>
          <div style="margin: 1rem 0; text-align: center">
            <h1 class="is-size-3">{{ selectedMainDsAlgo.name }} Algorithms</h1>

            <!-- <p style="font-size: 0.7rem">
              Right Click on Algorithm name to get more info
            </p> -->
          </div>

          <div
            v-if="isHeapSelected"
            class="is-flex"
            style="justify-content: center; margin-bottom: 1rem"
          >
            <label class="radio radio-label">
              <input
                type="radio"
                name="min-max-heap"
                checked
                @change="changeTypeOfHeap('Maximum')"
              />
              Max Heap
            </label>
            <label class="radio radio-label">
              <input
                type="radio"
                name="min-max-heap"
                @change="changeTypeOfHeap('Minimum')"
              />
              Min Heap
            </label>
          </div>
        </div>

        <div style="border-top: 1px solid #4eb380; border-bottom: 1px solid #4eb380;">
          <div
            class="left-panel-algos"
            v-for="(algo, index) in navbarButtons[selectedMainDsAlgo.name]"
            :key="index"
            @click="algo.handler"
            @contextmenu="e => getMoreInfoAboutAlgorithm(e, algo.name)"
          >
            {{
              algo.name === "delete_from_heap"
                ? `Take out ${typeOfHeap} element`
                : algo.name
            }}
          </div>
        </div>

        <div style="margin-top: 3rem">
          <p style="margin-left: 10%">Add New Node</p>
          <div class="is-flex" style="align-items: center; justify-content: space-evenly">
            <input
              type="text"
              v-model="addNewNodeValue"
              @keydown="$event.key === 'Enter' ? addNode() : ''"
            />
            <button class="button is-success is-small" @click="addNode">
              <span class="is-size-4"><SVG :name="svgNames.plus"/></span>
            </button>
          </div>
        </div>

        <div v-if="!isHeapSelected" style="margin-top: 1rem">
          <p style="margin-left: 10%">Delete Node</p>
          <div class="is-flex" style="align-items: center; justify-content: space-evenly">
            <input
              type="text"
              v-model="deleteNodeValue"
              @keydown="$event.key === 'Enter' ? deleteNode() : ''"
            />
            <button class="button is-danger is-small" @click="deleteNode">
              <span class="is-size-4"><SVG :name="svgNames.delete"/></span>
            </button>
          </div>
        </div>

        <div v-if="isTreeSelected" style="margin-top: 1rem">
          <p style="margin-left: 10%">Search Node</p>
          <div class="is-flex" style="align-items: center; justify-content: space-evenly">
            <input
              type="text"
              v-model="searchNodeValue"
              @keydown="$event.key === 'Enter' ? searchNode() : ''"
            />
            <button class="button is-info is-small" @click="searchNode">
              <span class="is-size-4"><SVG :name="svgNames.search"/></span>
            </button>
          </div>
        </div>

        <div class="legend">
          <h1 class="is-size-4" style="align-self: center">
            Legend
          </h1>
          <div class="is-flex" style="margin-top: 5px;">
            <div
              class="cell-info-div"
              :style="{ backgroundColor: nodeHoverColor.hex }"
            ></div>
            On this node
          </div>

          <div class="is-flex" style="margin-top: 5px;">
            <div
              class="cell-info-div"
              :style="{ backgroundColor: pointerColor1.hex }"
            ></div>
            Comparing Nodes
          </div>

          <div class="is-flex" style="margin-top: 5px;">
            <div
              class="cell-info-div"
              :style="{ backgroundColor: pointerColor2.hex }"
            ></div>
            Swapping Nodes
          </div>
        </div>
      </div>
      <div class="canvas-container">
        <canvas id="canvas"></canvas>
        <div v-if="treeTraversalOutput.show" class="traversal-output">
          {{ treeTraversalOutput.output }}
        </div>
      </div>
    </div>
    <Modal
      v-if="showAlgoDescriptionModal"
      :modalTitle="'ksdf'"
      :modalInfo="'skjfoir'"
      @closeModal="showAlgoDescriptionModal = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import paper from "paper";

// components
import AlgoNavBar from "@/components/AlgoNavBar.vue";
import SVG from "@/components/Svg.vue";

// canvas helpers
import {
  highlightNode,
  putTextOnCanvas,
  removePaperJsNode
} from "@/components/dsAlgo/globalHelpers";
import {
  animateLinkedListNodeDeletion,
  drawLinkedList,
  drawPointerOnNode,
  translatePointer
} from "@/components/dsAlgo/linkedListHelper";
import {
  animateBinaryTreeInversion,
  animateTreeNodeDeletion,
  drawBinaryTreeNode,
  drawTreeRoot
} from "@/components/dsAlgo/treeHelpers";
import { swapHeapNodes } from "@/components/dsAlgo/heapHelpers";

// constants
import {
  allDsAlgosObject,
  backgroundColor,
  headPointerColor,
  nodeHoverColor,
  pointerColor1,
  pointerColor2,
  pointerColor3,
  selectedDsAlgoObjectType,
  treeTraversalTypes
} from "@/constants/dsAlgoConstants";

// dataStructures
import LinkedList from "@/algos/dataStructures/LinkedList";
import { llNodeNull } from "@/algos/dataStructures/LinkedListNode";
import BinaryTree from "@/algos/dataStructures/BinaryTree";
import TreeNode from "@/algos/dataStructures/TreeNode";
import Heap from "@/algos/dataStructures/Heap";

// types
import { svgNames } from "@/constants/globalConstants";
import { numStr } from "@/types/global";
import {
  heapNode,
  linkedListNodesList,
  typeLinkedListStartPointer,
  paperJsNode,
  arrowName,
  binaryTreeNodesObject
} from "@/types/dsAlgo";
import Modal from "@/components/Modal.vue";

export default defineComponent({
  components: { AlgoNavBar, SVG, Modal },

  setup() {
    const allMainDsAlgos = Object.values(allDsAlgosObject).map(v => v.name);

    const nullNode: paperJsNode = {} as paperJsNode;
    const canvas = ref<HTMLCanvasElement>();
    const canvasText = ref<paper.PointText>();

    // for linked lists
    const linkedListNodes: linkedListNodesList[] = [];

    const linkedListStartPointer = {} as typeLinkedListStartPointer;
    let myLinkedList: LinkedList = {} as LinkedList;

    // for trees
    const binaryTreeNodesList: binaryTreeNodesObject = {};

    const myBinaryTree: BinaryTree = {} as BinaryTree;

    // for heaps
    const heapNodesList: heapNode = {} as heapNode;

    const myHeap: Heap = {} as Heap;

    return {
      allDsAlgosObject,
      allMainDsAlgos,

      // linked list
      linkedListNodes,
      linkedListStartPointer,
      myLinkedList,
      // trees
      binaryTreeNodesList,
      myBinaryTree,
      // heaps
      heapNodesList,
      myHeap,

      nullNode,
      svgNames,
      canvas,
      canvasText,

      // colors
      headPointerColor,
      nodeHoverColor,
      pointerColor1,
      pointerColor2,
      pointerColor3
    };
  },

  data() {
    return {
      selectedMainDsAlgo: allDsAlgosObject.LINKED_LIST as selectedDsAlgoObjectType,
      addNewNodeValue: 0 as numStr,
      deleteNodeValue: 0 as numStr,
      searchNodeValue: 0 as numStr,
      animationSpeed: 500,
      typeOfHeap: "Maximum" as "Minimum" | "Maximum",
      showAlgoDescriptionModal: false,
      treeTraversalOutput: {
        show: false,
        output: ""
      },
      navbarButtons: {
        [allDsAlgosObject.LINKED_LIST.name]: [
          {
            name: allDsAlgosObject.LINKED_LIST.algos.REVERSING_LINKED_LIST.name,
            handler: this.reverseLinkedList
          }
        ],
        [allDsAlgosObject.BINARY_TREES.name]: [
          {
            name: allDsAlgosObject.BINARY_TREES.algos.INORDER_TRAVERSAL.name,
            handler: () => this.traverseBinaryTree("inorder")
          },
          {
            name: allDsAlgosObject.BINARY_TREES.algos.PREORDER_TRAVERSAL.name,
            handler: () => this.traverseBinaryTree("preorder")
          },
          {
            name: allDsAlgosObject.BINARY_TREES.algos.POSTORDER_TRAVERSAL.name,
            handler: () => this.traverseBinaryTree("postorder")
          },
          {
            name: allDsAlgosObject.BINARY_TREES.algos.INVERSION_OF_BINARY_TREE.name,
            handler: this.invertBinaryTree
          }
        ],
        [allDsAlgosObject.HEAP.name]: [
          {
            name: allDsAlgosObject.HEAP.algos.DELETE_FROM_HEAP.name,
            handler: () => this.deleteFromHeap()
          }
        ]
      }
    };
  },

  methods: {
    getMoreInfoAboutAlgorithm(event: Event, algo: string) {
      event.preventDefault();
      this.showAlgoDescriptionModal = true;
      console.log("getting more info about", algo);
    },

    algorithmChanged(value: string) {
      this.treeTraversalOutput.show = false;

      switch (value) {
        case allDsAlgosObject.LINKED_LIST.name:
          this.selectedMainDsAlgo = allDsAlgosObject.LINKED_LIST;
          break;

        case allDsAlgosObject.BINARY_TREES.name:
          this.selectedMainDsAlgo = allDsAlgosObject.BINARY_TREES;
          break;

        case allDsAlgosObject.HEAP.name:
          this.selectedMainDsAlgo = allDsAlgosObject.HEAP;
          break;

        default:
          break;
      }
    },

    addNode() {
      switch (this.selectedMainDsAlgo.name) {
        case allDsAlgosObject.LINKED_LIST.name:
          this.addNodeToLinkedList();
          break;

        case allDsAlgosObject.BINARY_TREES.name:
          this.addNodeToBinaryTree();
          break;

        case allDsAlgosObject.HEAP.name:
          this.addNodeToHeap();
          break;

        default:
          break;
      }
    },

    deleteNode() {
      switch (this.selectedMainDsAlgo.name) {
        case allDsAlgosObject.BINARY_TREES.name:
          this.myBinaryTree.deleteNode(Number(this.deleteNodeValue));
          break;

        case allDsAlgosObject.LINKED_LIST.name:
          this.deleteAllLinkedListNodePointers();
          this.myLinkedList.delete(this.deleteNodeValue);
          break;

        default:
          break;
      }
    },

    // ================================= GLOBAL DRAWING STUFF ========================
    clearCanvas() {
      // remove all linked list related stuff
      if (this.linkedListStartPointer.pointer instanceof paper.Group) {
        this.linkedListStartPointer.pointer.remove();
      }

      this.linkedListStartPointer = {} as { pointer: paper.Group; index: number };

      if (this.nullNode instanceof paper.Path) {
        this.nullNode.remove();
      }

      for (const obj of this.linkedListNodes) {
        removePaperJsNode(obj.node, { arrowNext: obj.arrowNext });

        for (const ptr of obj.pointers) {
          ptr.remove();
        }
      }

      this.linkedListNodes = [];

      // remove binary tree related stuff
      for (const obj of Object.values(this.binaryTreeNodesList)) {
        removePaperJsNode(obj.node, { r: obj.rightArrow, l: obj.leftArrow });
      }

      this.binaryTreeNodesList = {};

      // remove heap related stuff
      for (const obj of Object.values(this.heapNodesList)) {
        removePaperJsNode(obj.node, { r: obj.rightArrow, l: obj.leftArrow });
      }

      this.heapNodesList = {};

      if (!this.canvas) return;

      const rect = new paper.Path.Rectangle(
        new paper.Point(0, 0),
        new paper.Size(this.canvas.width, this.canvas.height)
      );
      rect.fillColor = backgroundColor.paperColor;
    },

    // ================== LINKED LISTS START ==========================

    createNewLinkedList() {
      this.myLinkedList = new LinkedList(
        this.drawPointerOnNode,
        this.translatePointer,
        this.rotateArrow,
        this.toggleArrowVisibility,
        this.animateLinkedListNodeDeletion
      );

      this.drawLinkedList(this.myLinkedList.start);
    },

    drawPointerOnNode(
      index: number,
      color?: paper.Color,
      top?: boolean,
      add?: boolean,
      textString?: string
    ) {
      const { linkedListStartPointer, linkedListNodes, nullNode } = drawPointerOnNode(
        this.linkedListNodes,
        this.nullNode,
        index,
        this.linkedListStartPointer,
        color,
        top,
        add,
        textString
      );

      if (linkedListStartPointer) this.linkedListStartPointer = linkedListStartPointer;

      this.linkedListNodes = linkedListNodes;
      this.nullNode = nullNode;
    },

    async translatePointer(
      fromIdx: number,
      toIdx: number,
      startPointer?: boolean | undefined
    ) {
      const {
        linkedListNodes,
        nullNode,
        linkedListStartPointer
      } = await translatePointer(
        this.linkedListNodes,
        this.nullNode,
        this.linkedListStartPointer,
        fromIdx,
        toIdx,
        this.animationSpeed,
        startPointer
      );

      if (linkedListStartPointer) this.linkedListStartPointer = linkedListStartPointer;
      this.linkedListNodes = linkedListNodes;
      this.nullNode = nullNode;
    },

    addNodeToLinkedList(array: numStr[] = []) {
      this.clearCanvas();

      if (
        typeof this.addNewNodeValue === "string" &&
        this.addNewNodeValue.includes(",")
      ) {
        array = this.addNewNodeValue.split(",").map(Number);
      } else {
        array = [this.addNewNodeValue];
      }

      array.forEach(element => {
        this.myLinkedList.insert(element);
        this.clearCanvas();

        this.drawLinkedList(this.myLinkedList.start);
      });
    },

    deleteAllLinkedListNodePointers() {
      // delete all previous pointers
      for (const node of this.linkedListNodes) {
        for (const ptr of node.pointers) {
          ptr.remove();
        }
        node.pointers = [];
      }
    },

    async reverseLinkedList() {
      if (this.myLinkedList.length < 2) return;
      this.deleteAllLinkedListNodePointers();

      const llElements = this.myLinkedList.elements;
      this.myLinkedList.elements = [];
      this.myLinkedList.start = null;

      this.addNodeToLinkedList(llElements);

      this.myLinkedList.reverse();
    },

    toggleArrowVisibility(index: number, show?: boolean) {
      if (show === undefined) {
        this.linkedListNodes[index].arrowNext.visible = !this.linkedListNodes[index]
          .arrowNext.visible;
      } else this.linkedListNodes[index].arrowNext.visible = show;
    },

    rotateArrow(index: number, angle = 180, animate = true): Promise<void> {
      if (index >= this.linkedListNodes.length) return new Promise(r => r());

      let dTheta = 1;
      const node = this.linkedListNodes[index];
      const arrow = node.arrowNext;
      let i = 0;

      if (animate) {
        const time = this.animationSpeed / 50;

        const interval = setInterval(() => {
          if (i >= angle) clearInterval(interval);

          arrow.rotate(dTheta, node.node.rect.handleBounds.center);

          i++;
        }, time);

        return new Promise(r => setTimeout(r, time * 2 * angle));
      } else {
        arrow.rotate(angle);
      }
      return new Promise(r => r());
    },

    async animateLinkedListNodeDeletion(indexToDelete: number): Promise<void> {
      const {
        linkedListNodes,
        linkedListStartPointer,
        nullNode
      } = await animateLinkedListNodeDeletion(
        this.linkedListNodes,
        this.nullNode,
        indexToDelete,
        this.animationSpeed
      );

      this.linkedListNodes = linkedListNodes;
      this.nullNode = nullNode;

      if (linkedListStartPointer) this.linkedListStartPointer = linkedListStartPointer;
    },

    drawLinkedList(startPtr: llNodeNull) {
      const { linkedListNodes, linkedListStartPointer, nullNode } = drawLinkedList(
        startPtr,
        this.myLinkedList,
        this.linkedListNodes,
        this.nullNode
      );

      this.linkedListNodes = linkedListNodes;
      this.nullNode = nullNode;

      if (linkedListStartPointer) this.linkedListStartPointer = linkedListStartPointer;
    },

    // ============================== TREES START ================================
    searchNode() {
      console.log("searching", this.searchNodeValue);
    },

    traverseBinaryTree(traversalType: treeTraversalTypes) {
      const list: number[] = [];
      this.treeTraversalOutput.show = true;
      this.myBinaryTree.treeTraversal(list, traversalType);
    },

    createNewBinaryTree() {
      this.myBinaryTree = new BinaryTree(
        this.highlightNode,
        this.drawBinaryTreeNode,
        (text: string) => {
          this.treeTraversalOutput.output = text;
        },
        this.swapTreeNodes,
        this.deleteNodeFromBinaryTree,
        this.animateBinaryTreeInversion
      );
      this.drawBinaryTreeRoot(this.myBinaryTree.root);
    },

    async addNodeToBinaryTree() {
      if (this.addNewNodeValue.toString().includes(",")) {
        let nodesToBeInserted = this.addNewNodeValue.toString().split(",");

        if (!this.myBinaryTree.root) {
          this.clearCanvas();
          await this.myBinaryTree.insert(Number(nodesToBeInserted[0]));
          this.drawBinaryTreeRoot(this.myBinaryTree.root);
          nodesToBeInserted = nodesToBeInserted.slice(1);
        }

        for (const value of nodesToBeInserted) {
          await this.myBinaryTree.insert(Number(value));
        }
      } else {
        await this.myBinaryTree.insert(Number(this.addNewNodeValue));
      }

      if (!this.myBinaryTree.root?.leftChild && !this.myBinaryTree.root?.rightChild) {
        this.clearCanvas();
        this.drawBinaryTreeRoot(this.myBinaryTree.root);
      }
    },

    async deleteNodeFromBinaryTree(nodeToDeleteId: string, parentUuid: string) {
      let side: arrowName;

      const parent = this.binaryTreeNodesList[parentUuid];
      const child = this.binaryTreeNodesList[nodeToDeleteId];

      if (parent.treeNode?.leftChild === child.treeNode) side = "leftArrow";
      else side = "rightArrow";

      await animateTreeNodeDeletion(child, parent, side, this.animationSpeed);

      // delete the node from the binaryTreeNodesList
      delete this.binaryTreeNodesList[nodeToDeleteId];

      // if root is deleted create a new tree
      if (Object.keys(this.binaryTreeNodesList).length === 0) {
        this.createNewBinaryTree();
      }
    },

    async highlightNode(
      uuid: string | number,
      color?: string | paper.Color
    ): Promise<void> {
      let node: paperJsNode;

      if (typeof uuid === "string") {
        // binary tree is stored as an object
        node = this.binaryTreeNodesList[uuid].node;
      } else {
        // heap is stored as an array
        node = this.heapNodesList[uuid].node;
      }

      await highlightNode(node, this.animationSpeed, color);
    },

    checkNodeHit() {
      for (const object of Object.values(this.binaryTreeNodesList)) {
        for (const object2 of Object.values(this.binaryTreeNodesList)) {
          if (object.node.rect.intersects(object2.node.rect)) console.log("intersect");
        }
      }
    },

    drawBinaryTreeNode(
      parentNode: TreeNode | number,
      newNode: TreeNode | number,
      side: arrowName,
      depth: number
    ) {
      const { binaryTreeNodesList, heapNodesList } = drawBinaryTreeNode(
        this.binaryTreeNodesList,
        this.heapNodesList,
        parentNode,
        newNode,
        side,
        depth
      );

      this.binaryTreeNodesList = binaryTreeNodesList;
      this.heapNodesList = heapNodesList;
    },

    /**
     * Draws the root node for a heap or a binary tree
     */
    drawBinaryTreeRoot(root: TreeNode | null, isTree = true, isHeap = false) {
      const { binaryTreeNodesList, heapNodesList } = drawTreeRoot(
        this.canvas,
        this.binaryTreeNodesList,
        this.heapNodesList,
        this.myBinaryTree,
        this.myHeap,
        root,
        isTree,
        isHeap
      );

      this.binaryTreeNodesList = binaryTreeNodesList;
      this.heapNodesList = heapNodesList;
    },

    async swapTreeNodes(id1: string, id2: string): Promise<void> {
      await swapHeapNodes(
        this.binaryTreeNodesList[id1],
        this.binaryTreeNodesList[id2],
        this.animationSpeed,
        false
      );
    },

    async animateBinaryTreeInversion(
      id1: string,
      id2: string,
      parentNodeId: string
    ): Promise<void> {
      this.binaryTreeNodesList = await animateBinaryTreeInversion(
        this.binaryTreeNodesList,
        id1,
        id2,
        parentNodeId,
        this.animationSpeed
      );
    },

    invertBinaryTree() {
      this.treeTraversalOutput.show = false;
      this.myBinaryTree.invertBinaryTree();
    },

    // ============================== HEAPS START =================================
    changeTypeOfHeap(minMax: "Minimum" | "Maximum") {
      this.typeOfHeap = minMax;
      this.clearCanvas();
      this.createNewHeap();
    },

    async swapHeapNodes(i: number, j: number): Promise<void> {
      i++; // heap index starts from 1, but we send the swap index by decrementing by 1
      j++; // heap index starts from 1, but we send the swap index by decrementing by 1

      console.log("swap heap nodes", {
        i,
        j,
        atI: this.heapNodesList[i],
        atJ: this.heapNodesList[j]
      });

      await swapHeapNodes(
        this.heapNodesList[i],
        this.heapNodesList[j],
        this.animationSpeed
      );
    },

    async drawHeapRoot(value: number) {
      await this.myHeap.insert(value);

      this.clearCanvas();
      this.drawBinaryTreeRoot(new TreeNode(value, 1), false, true);
    },

    async addNodeToHeap() {
      const rootExists = this.heapNodesList[1];

      // adding multiple heap nodes at once
      if (this.addNewNodeValue.toString().includes(",")) {
        let nodesToBeAdded = this.addNewNodeValue
          .toString()
          .split(",")
          .map(Number);

        if (!rootExists) {
          await this.drawHeapRoot(nodesToBeAdded[0]);
        }

        nodesToBeAdded = nodesToBeAdded.slice(1);

        for (let idx = 0; idx < nodesToBeAdded.length; idx++) {
          const value = nodesToBeAdded[idx];

          const end = Object.keys(this.heapNodesList).length + 1;

          const parentNodeIndex = Math.floor(end / 2);

          const side = this.heapNodesList[parentNodeIndex * 2]
            ? "rightArrow"
            : "leftArrow";

          const depth =
            (this.heapNodesList[parentNodeIndex].treeNode as TreeNode).depth + 1;

          this.drawBinaryTreeNode(parentNodeIndex, value, side, depth);

          await this.myHeap.insert(value);
        }
      } else {
        const value = Number(this.addNewNodeValue);

        if (!rootExists) {
          await this.drawHeapRoot(value);
          return;
        }

        const end = Object.keys(this.heapNodesList).length + 1;
        const parentNodeIndex = Math.floor(end / 2);
        const side = this.heapNodesList[parentNodeIndex * 2] ? "rightArrow" : "leftArrow";

        const depth =
          (this.heapNodesList[parentNodeIndex].treeNode as TreeNode).depth + 1;

        this.drawBinaryTreeNode(parentNodeIndex, value, side, depth);

        await this.myHeap.insert(value);
      }
    },

    async deleteFromHeap() {
      if (!this.myHeap || this.myHeap.heap.length < 1) return;

      await this.myHeap.deleteFromHeap(this.myHeap.heap.length - 1);

      const nodes = Object.values(this.heapNodesList);

      const child = this.heapNodesList[nodes.length];
      const parentIdx = Math.floor(nodes.length / 2);
      const parent = this.heapNodesList[parentIdx];

      const side: arrowName =
        this.heapNodesList[parentIdx * 2] === child ? "leftArrow" : "rightArrow";

      await animateTreeNodeDeletion(child, parent, side, this.animationSpeed);

      delete this.heapNodesList[nodes.length];

      // if root is deleted, create a new heap
      if (Object.keys(this.heapNodesList).length === 0) {
        this.createNewHeap();
      }
    },

    createNewHeap() {
      this.myHeap = new Heap(
        [],
        this.typeOfHeap === "Maximum",
        this.swapHeapNodes,
        this.highlightNode
      );

      this.drawBinaryTreeRoot(null, false, true);
    },

    async runOnMount(newSelectionValue: selectedDsAlgoObjectType | undefined) {
      if (!newSelectionValue) newSelectionValue = this.selectedMainDsAlgo;

      this.clearCanvas();

      this.myHeap = {} as Heap;
      this.myBinaryTree = {} as BinaryTree;
      this.myLinkedList = {} as LinkedList;

      switch (newSelectionValue.name) {
        case this.allDsAlgosObject.LINKED_LIST.name:
          this.createNewLinkedList();
          this.addNewNodeValue = "1,2,3,4,5,6";
          this.addNodeToLinkedList();
          break;

        case this.allDsAlgosObject.BINARY_TREES.name:
          this.createNewBinaryTree();
          // this.addNewNodeValue = "50";
          // await this.addNodeToBinaryTree();
          // this.addNewNodeValue = "25,75,15,30,60";
          // this.addNodeToBinaryTree();
          break;

        case this.allDsAlgosObject.HEAP.name:
          this.createNewHeap();
          // this.addNewNodeValue = "50,25";
          // await this.addNodeToHeap();
          // this.addNewNodeValue = "25";
          // this.addNodeToHeap();
          break;

        default:
          break;
      }
    }
  },

  watch: {
    selectedMainDsAlgo(newSelection: selectedDsAlgoObjectType) {
      this.runOnMount(newSelection);
    }
  },

  computed: {
    isLinkedListSelected(): boolean {
      return this.selectedMainDsAlgo.name === this.allDsAlgosObject.LINKED_LIST.name;
    },
    isTreeSelected(): boolean {
      return this.selectedMainDsAlgo.name === this.allDsAlgosObject.BINARY_TREES.name;
    },
    isHeapSelected(): boolean {
      return this.selectedMainDsAlgo.name === this.allDsAlgosObject.HEAP.name;
    }
  },

  mounted() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    this.canvas = canvas;

    canvas.height = window.innerHeight * 0.93;
    canvas.width = window.innerWidth * 0.8;

    paper.setup(canvas);

    const rect = new paper.Path.Rectangle(
      new paper.Point(0, 0),
      new paper.Size(canvas.width, canvas.height)
    );
    rect.fillColor = backgroundColor.paperColor;

    this.runOnMount(undefined);
  },

  created() {
    paper.install(window);
  }
});
</script>

<style scoped>
.traversal-output {
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 1.3rem;
  padding: 0.15rem;
  word-wrap: break-word;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: #2c3e50;
  color: #4eb380;
  height: 5rem;
  min-width: 100%;
}

.canvas-container {
  position: relative;
}

#canvas {
  height: 93vh !important;
  width: 80vw;
}

.algo-container {
  display: flex;
  align-items: center;
  height: 93vh;
  width: 100vw;
}

.algo-container .left-panel {
  height: 100%;
  width: 20vw;
  background-color: #02203c;
  overflow: auto;
  padding-bottom: 3rem;
}

.left-panel-algos {
  padding: 1rem;
  width: 100%;
  border-top: 1px solid #4eb380;
  border-bottom: 1px solid #4eb380;
  text-transform: uppercase;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.left-panel-algos:hover {
  background-color: #4eb380;
  color: #02203c;
  cursor: pointer;
}

input {
  background-color: transparent;
  color: #4eb380;
  font-size: 1.1rem;
  padding: 0.5rem;
  border: 2px solid white;
  border-radius: 5px;
  outline: none;
  width: 60%;
}

.legend {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-top: 2rem;
  padding-left: 1rem;
}

.radio-label {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
