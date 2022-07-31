import paperCore from "paper/dist/paper-core";

export type allDsAlgosObjectType = {
  [dsName: string]: {
    name: string;
    algos: {
      [algoName: string]: {
        name: string;
        moreInfo: string;
      };
    };
  };
};

export type selectedDsAlgoObjectType = {
  name: string;
  algos: {
    [algoName: string]: {
      name: string;
      moreInfo: string;
    };
  };
};

export const allDsAlgosObject: allDsAlgosObjectType = Object.freeze({
  LINKED_LIST: {
    name: "Linked Lists",
    algos: {
      REVERSING_LINKED_LIST: {
        name: "Reverse the Linked List",
        moreInfo: ""
      }
    }
  },
  BINARY_TREES: {
    name: "Binary Trees",
    algos: {
      INORDER_TRAVERSAL: {
        name: "Inorder Traversal",
        moreInfo: ""
      },
      PREORDER_TRAVERSAL: {
        name: "Preorder Traversal",
        moreInfo: ""
      },
      POSTORDER_TRAVERSAL: {
        name: "Postorder Traversal",
        moreInfo: ""
      },
      INVERSION_OF_BINARY_TREE: {
        name: "Invert Binary Tree",
        moreInfo: ""
      }
    }
  },
  HEAP: {
    name: "Heaps",
    algos: {
      DELETE_FROM_HEAP: {
        name: "delete_from_heap",
        moreInfo: ""
      }
    }
  }
});

export type treeTraversalTypes = "inorder" | "preorder" | "postorder";

export const NODE_SIZE = 35;
export const ARROW_LENGTH = 40;
export const ARROW_NODE_MARGIN = 10;
export const ARROW_TRIANGLE_RADIUS = 7;

export const TREE_ARROW_ANGLE = 75;
export const TREE_ARROW_LENGTH = 175;

export const transparent = new paperCore.Color(1, 1, 1, 0);

export const nodeStrokeColor = new paperCore.Color("#fff");
export const textStrokeColor = new paperCore.Color("#fff");
export const backgroundColor = {
  hex: "#130f40",
  paperColor: new paperCore.Color("#111")
};
export const nodeHoverColor = {
  hex: "#3498db",
  paperColor: new paperCore.Color("#3498db")
};
export const nodeDeleteColor = {
  hex: "#fff",
  paperColor: new paperCore.Color("#fff")
};
export const headPointerColor = {
  hex: "#8e44ad",
  paperColor: new paperCore.Color("#8e44ad")
};
export const pointerColor1 = {
  hex: "#e74c3c",
  paperColor: new paperCore.Color("#e74c3c")
};
export const pointerColor2 = {
  hex: "#27ae60",
  paperColor: new paperCore.Color("#27ae60")
};
export const pointerColor3 = {
  hex: "#f1c40f",
  paperColor: new paperCore.Color("#f1c40f")
};
