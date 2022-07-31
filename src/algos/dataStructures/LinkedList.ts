import { pointerColor1, pointerColor2, pointerColor3 } from "@/constants/dsAlgoConstants";
import { sleep } from "@/helpers/helper";
import { numStr } from "@/types/global";
import LinkedListNode, { llNodeNull } from "./LinkedListNode";

class LinkedList {
  start: llNodeNull;
  length: number;
  elements: numStr[];
  drawPointerOnNode: (
    index: number,
    color?: paper.Color,
    top?: boolean,
    add?: boolean,
    textString?: string
  ) => void;
  translatePointer: (
    fromIdx: number,
    toIdx: number,
    startPointer?: boolean
  ) => Promise<void>;
  rotateArrow: (index: number, angle?: number, animate?: boolean) => Promise<void>;
  toggleArrowVisibility: (index: number, show?: boolean) => void;
  animateLinkedListNodeDeletion: (indexToDelet: number) => void;

  constructor(
    drawPointerOnNode: (
      index: number,
      color?: paper.Color,
      top?: boolean,
      add?: boolean,
      textString?: string
    ) => void,
    translatePointer: (
      fromIdx: number,
      toIdx: number,
      startPointer?: boolean
    ) => Promise<void>,
    rotateArrow: (index: number, angle?: number, animate?: boolean) => Promise<void>,
    toggleArrowVisibility: (index: number, show?: boolean) => void,
    animateLinkedListNodeDeletion: (indexToDelet: number) => void
  ) {
    this.start = null;
    this.length = 0;
    this.elements = [];
    this.drawPointerOnNode = drawPointerOnNode;
    this.translatePointer = translatePointer;
    this.rotateArrow = rotateArrow;
    this.toggleArrowVisibility = toggleArrowVisibility;
    this.animateLinkedListNodeDeletion = animateLinkedListNodeDeletion;
  }

  traverse(): string {
    let ptr = this.start;
    let str = "";

    while (ptr !== null) {
      str += ptr.value + " -> ";
      ptr = ptr.next;
    }

    return str.slice(0, str.length - 3);
  }

  insert(value: numStr): LinkedList {
    this.length++;

    const newNode = new LinkedListNode(value);

    this.elements.push(value);

    if (!this.start) {
      newNode.index = 0;
      this.start = newNode;
      return this;
    }

    let ptr = this.start;

    while (ptr.next !== null) ptr = ptr.next;

    newNode.index = ptr.index + 1;
    ptr.next = newNode;

    return this;
  }

  async delete(value: numStr) {
    let ptr1 = this.start;
    let ptr2 = ptr1?.next;

    this.drawPointerOnNode(0, pointerColor1.paperColor, false, true, "ptr 1");
    this.drawPointerOnNode(1, pointerColor2.paperColor, false, true, "ptr 2");

    if (ptr1?.value === value) {
      this.start = this.start?.next as LinkedListNode;
      ptr1.next = null;

      const translateToIndex = ptr2 ? ptr2.index : -1;

      this.translatePointer(0, translateToIndex, true);

      this.animateLinkedListNodeDeletion(0);

      return this;
    }

    while (ptr2 && ptr1) {
      if (ptr2.value == value) {
        // found the node to delete
        ptr1.next = ptr2.next;
        ptr2.next = null;
        this.animateLinkedListNodeDeletion(ptr2.index);
        break;
      }

      if (ptr1) await this.translatePointer(ptr1.index, ptr1.index + 1);
      if (ptr2) await this.translatePointer(ptr2.index, ptr2.index + 1);

      ptr1 = ptr1.next;
      ptr2 = ptr2.next;
    }

    if (ptr1?.next) {
      ptr1 = ptr1.next;
      // decrease all the indices of all the nodes to the right of ptr2, including ptr2
      while (ptr1) {
        ptr1.index -= 1;
        ptr1 = ptr1.next;
      }
    }

    return this;
  }

  async reverse(): Promise<void> {
    let p1, p2, p3;

    p1 = this.start as LinkedListNode;
    p2 = p1.next as LinkedListNode;
    p3 = p2.next as LinkedListNode;

    const isListReversed = p1.index > p2.index;
    const nextNodeAdder = isListReversed ? -1 : 1;

    this.drawPointerOnNode(p1.index, pointerColor1.paperColor, false, true, "ptr 1");
    this.drawPointerOnNode(p2.index, pointerColor2.paperColor, false, true, "ptr 2");
    this.drawPointerOnNode(p3.index, pointerColor3.paperColor, false, true, "ptr 3");

    await sleep(1000);

    this.toggleArrowVisibility(p1.index, false);

    for (;;) {
      p2.next = p1;

      this.toggleArrowVisibility(p2.index, true);
      await this.rotateArrow(p2.index, 180, true);
      // this.toggleArrowVisibility(p1.index, true);

      if (p3) await this.translatePointer(p1.index, p1.index + nextNodeAdder);

      await this.translatePointer(p2.index, p2.index + nextNodeAdder);

      if (p3) await this.translatePointer(p3.index, p3.index + nextNodeAdder);

      if (!p2 || !p3) break;

      p1 = p2;
      p2 = p3;
      p3 = p3.next;
    }

    (this.start as LinkedListNode).next = null;
    this.start = p2;

    this.translatePointer(0, p2.index, true);
  }
}

export default LinkedList;
