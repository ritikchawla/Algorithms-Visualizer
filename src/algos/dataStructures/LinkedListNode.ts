import { numStr } from "@/types/global";

export type llNodeNull = LinkedListNode | null;

class LinkedListNode {
  value: numStr;
  next: llNodeNull;
  previous: llNodeNull;
  index: number;

  constructor(value: numStr) {
    this.value = value;
    this.next = null;
    this.previous = null;
    this.index = -1;
  }

  /**
   * Representation of a Node
   */
  repr(): string {
    // const next = this.next ? this.next.value : "Null";

    // return `Value - ${this.value} \nNext - ${next}`;
    return this.value.toString();
  }
}

export default LinkedListNode;
