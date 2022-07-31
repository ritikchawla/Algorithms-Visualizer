<template>
  <div style="height: 100vh; overflow: hidden;">
    <AlgoNavBar
      :algorithmsList="ALL_SORTING_ALGORITHM_NAMES"
      :selectedAlgo="chosenSortingAlgorithm"
      @algorithmChanged="setNewAlgorithm"
      :buttonsList="navbarButtons"
      v-model:algoSpeed.sync="sortSpeed"
      v-model:arraySize.sync="ARRAY_SIZE"
    />

    <div class="array-sort-container">
      <div class="algorithm-info has-text-centered">
        <Tooltip :tooltipMessage="TOOLTIPS.VISUALIZING">
          <p class="has-text-weight-bold">Visualizing</p>
          <p>{{ chosenSortingAlgorithm }}</p>
        </Tooltip>

        <Tooltip :tooltipMessage="TOOLTIPS.SPEED">
          <p class="has-text-weight-bold">Algo Speed</p>
          <p>{{ sortSpeed }}</p>
        </Tooltip>

        <div>
          <Tooltip :tooltipMessage="TOOLTIPS.INITIAL_ELEMENT">
            <div class="is-flex">
              <div
                class="cell-info-div"
                :style="{ backgroundColor: arrayColors.base }"
              ></div>
              Initial Element
            </div>
          </Tooltip>

          <Tooltip :tooltipMessage="TOOLTIPS.SORTED_ELEMENT">
            <div class="is-flex" style="margin-top: 5px;">
              <div
                class="cell-info-div"
                :style="{ backgroundColor: arrayColors.sorted }"
              ></div>
              Sorted Element
            </div>
          </Tooltip>
        </div>

        <div>
          <Tooltip :tooltipMessage="TOOLTIPS.SWAPPING_ELEMENTS">
            <div class="is-flex">
              <div
                class="cell-info-div"
                :style="{ backgroundColor: arrayColors.swap }"
              ></div>
              Swap
            </div>
          </Tooltip>

          <Tooltip :tooltipMessage="TOOLTIPS.ITERATING_ELEMENTS">
            <div class="is-flex" style="margin-top: 5px;">
              <div
                class="cell-info-div"
                :style="{ backgroundColor: arrayColors.iterating }"
              ></div>
              Iterating
            </div>
          </Tooltip>
        </div>

        <div v-if="yellowBarLegend.show">
          <Tooltip
            :tooltipMessage="
              chosenSortingAlgorithm === allSortingAlgorithms.QUICK_SORT
                ? TOOLTIPS.PIVOT_ELEMENT
                : TOOLTIPS.MINIMUM_ELEMENT
            "
          >
            <div class="is-flex">
              <div
                class="cell-info-div"
                :style="{ backgroundColor: arrayColors.pivot }"
              ></div>
              {{ yellowBarLegend.text }}
            </div>
          </Tooltip>
        </div>
      </div>
      <p>
        {{
          chosenSortingAlgorithm === allSortingAlgorithms.QUICK_SORT
            ? "Current Pivot - " + array[quickSort.pivotIdx].number
            : ""
        }}
      </p>

      <!-- radio button for min-max heap -->
      <div
        class="control"
        v-if="chosenSortingAlgorithm === allSortingAlgorithms.HEAP_SORT"
      >
        <label class="radio">
          <input type="radio" name="min-max-heap" checked @change="setMinMaxHeap" />
          Use Max Heap
        </label>
        <label class="radio">
          <input type="radio" name="min-max-heap" @change="setMinMaxHeap" />
          Use Min Heap
        </label>
      </div>

      <div class="bar-container">
        <Bar
          v-for="(element, index) in array"
          :key="index"
          :arrayElement="element"
          :barWidth="arrayBarWidth"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// types
import { sortArrayElement } from "@/types/sortingAlgo";
import { ButtonsArray } from "@/types/global";

// algorithms
import bubbleSort from "@/algos/sorting/bubbleSort";
import quickSort from "@/algos/sorting/quickSort";
import insertionSort from "@/algos/sorting/insertionSort";
import selectionSort from "@/algos/sorting/selectionSort";
import mergeSort from "@/algos/sorting/mergeSort";
import radixSort from "@/algos/sorting/radixSort";
import bogoSort from "@/algos/sorting/bogoSort";
import { swap } from "@/algos/sorting/swap";

// constants
import {
  baseBarColor,
  iteratingBarColor,
  MAX_ARRAY_BAR_HEIGHT,
  pivotBarColor,
  sortedBarColor,
  sortingAlgorithms as allSortingAlgorithms,
  swapBarColor,
  TOOLTIPS
} from "@/constants/sortingAlgoConstants";

// components
import AlgoNavBar from "@/components/AlgoNavBar.vue";
import Bar from "@/components/sorting/Bar.vue";
import heapSort from "@/algos/sorting/heapSort";
import Tooltip from "@/components/Tooltip.vue";

export default defineComponent({
  name: "ArraySort",
  components: { Bar, AlgoNavBar, Tooltip },

  setup() {
    // non-reactive properties
    const ALL_SORTING_ALGORITHM_NAMES = Object.values(allSortingAlgorithms);
    const MAX_HEIGHT = MAX_ARRAY_BAR_HEIGHT;

    return {
      ALL_SORTING_ALGORITHM_NAMES,
      MAX_HEIGHT,
      allSortingAlgorithms,
      TOOLTIPS
    };
  },

  data() {
    return {
      ARRAY_SIZE: 40,
      arrayBarWidth: 20,
      array: [] as sortArrayElement[],
      sortSpeed: 500,
      currentlySorting: false,
      stopSorting: false,
      chosenSortingAlgorithm: allSortingAlgorithms.MERGE_SORT as string,
      navbarButtons: [
        {
          text: "Sort Array",
          class: "button is-success",
          handler: this.sortArray
        },
        {
          text: "Generate Random Array",
          class: "button is-info",
          handler: this.generateRandomArray
        }
      ] as ButtonsArray[],

      quickSort: {
        pivotIdx: 0
      },

      heapSort: {
        useMaxHeap: true
      }
    };
  },

  methods: {
    setMinMaxHeap() {
      this.heapSort.useMaxHeap = !this.heapSort.useMaxHeap;
    },

    setNewAlgorithm(newAlgo: string) {
      this.chosenSortingAlgorithm = newAlgo;
    },

    sortArray() {
      if (this.currentlySorting) return;

      switch (this.chosenSortingAlgorithm) {
        case allSortingAlgorithms.BUBBLE_SORT:
          bubbleSort(
            this.array.map(e => e.number),
            this.swapElements,
            this.colorElement
          );
          break;

        case allSortingAlgorithms.SELECTION_SORT:
          selectionSort(
            this.array.map(e => e.number),
            this.sortSpeed,
            this.iteratingOverElements,
            this.swapElements,
            this.colorElement
          );
          break;

        case allSortingAlgorithms.INSERTION_SORT:
          insertionSort(
            this.array.map(e => e.number),
            this.getArrayElement,
            this.setArrayElement,
            this.iteratingOverElements
          );
          break;

        case allSortingAlgorithms.QUICK_SORT:
          quickSort(
            this.array.map(e => e.number),
            this.iteratingOverElements,
            this.swapElements,
            this.colorElement,
            this.setPivot
          );
          break;

        case allSortingAlgorithms.MERGE_SORT:
          mergeSort(
            this.array.map(e => e.number),
            this.iteratingOverElements,
            this.swapElements,
            this.colorElement,
            this.getArrayElement,
            this.setArrayElement
          );
          break;

        case allSortingAlgorithms.HEAP_SORT:
          heapSort(
            this.array.map(e => e.number),
            this.heapSort.useMaxHeap,
            this.swapElements,
            this.colorElement,
            this.iteratingOverElements
          );
          break;

        case allSortingAlgorithms.RADIX_SORT:
          radixSort(
            this.array.map(e => e.number.toString()),
            this.setArrayElement,
            this.colorElement,
            this.iteratingOverElements
          );
          break;

        case allSortingAlgorithms.BOGO_SORT:
          bogoSort(
            this.array.map(e => e.number),
            this.setArray,
            this.iteratingOverElements
          );
          break;

        default:
          console.log(this.chosenSortingAlgorithm, "not implemented yet");
          break;
      }
    },

    setPivot(index: number) {
      this.colorElement(this.quickSort.pivotIdx, baseBarColor);
      this.quickSort.pivotIdx = index;
      this.colorElement(index, pivotBarColor);
    },

    getArrayElement(index: number): sortArrayElement {
      return this.array[index];
    },

    setArray(newArray: number[], maxElement: number): Promise<void> {
      return new Promise(resolve =>
        setTimeout(() => {
          this.array = newArray.map(e => ({
            number: e,
            barColor: baseBarColor,
            barHeight: Math.floor(this.MAX_HEIGHT * (e / maxElement))
          }));

          resolve();
        }, this.sortSpeed + 100)
      );
    },

    setArrayElement(
      index: number,
      index2?: number,
      element?: sortArrayElement
    ): Promise<void> {
      return new Promise(r =>
        setTimeout(() => {
          if (!element && index2) {
            this.array[index] = this.array[index2];
          } else if (element) {
            this.array[index] = element;
          }
          r();
        }, this.sortSpeed)
      );
    },

    /**
     * Will be called from the sorting function to animate the element swaps
     */
    swapElements(index1: number, index2: number, dontColorIdx = -1): Promise<void> {
      if (dontColorIdx !== index1 && this.array[index1].barColor !== sortedBarColor)
        this.array[index1].barColor = swapBarColor;

      if (dontColorIdx !== index2 && this.array[index2].barColor !== sortedBarColor)
        this.array[index2].barColor = swapBarColor;

      swap(this.array, index1, index2);

      return new Promise(r =>
        setTimeout(() => {
          if (dontColorIdx !== index1 && this.array[index1].barColor !== sortedBarColor)
            this.array[index1].barColor = baseBarColor;

          if (dontColorIdx !== index2 && this.array[index2].barColor !== sortedBarColor)
            this.array[index2].barColor = baseBarColor;

          r();
        }, this.sortSpeed)
      );
    },

    /**
     * Sets the color of a bar
     */
    colorElement(index: number, color: string = sortedBarColor): Promise<void> {
      // if (!this.array[index])
      // console.log("undefined = ", this.array[index], index, this.array.length, color);

      if (this.array[index].barColor !== sortedBarColor)
        this.array[index].barColor = color;

      return new Promise(r => r());
    },

    /**
     * Visualize the itertion over elements between index1 and index2 (both inclusive)
     */
    iteratingOverElements(
      index1: number,
      index2: number,
      color: string = iteratingBarColor
    ): Promise<void> {
      let i = index1;
      const interval = 10;

      const int = setInterval(() => {
        if (i === index2) clearInterval(int);

        if (this.array[i].barColor !== sortedBarColor) {
          this.array[i].barColor = color;
        }
        i++;
      }, interval);

      return new Promise(r => setTimeout(r, Math.abs(index2 - index1) * interval));
    },

    generateRandomArray() {
      let max = -Infinity;

      const tempArr: sortArrayElement[] = [];
      let i = 0;

      for (; i < this.ARRAY_SIZE; ) {
        const val = Math.floor(Math.random() * 900) + 50;

        const element = { number: val, barColor: baseBarColor, barHeight: val };

        if (!tempArr.includes(element)) {
          if (val > max) max = val;
          tempArr.push(element);
          i++;
        }
      }

      // map the element's height in a range between 0px and MAX_HEIGHT px
      this.array = tempArr.map(e => ({
        ...e,
        barHeight: Math.floor(this.MAX_HEIGHT * (e.number / max))
      }));
    }
  },

  computed: {
    arrayColors() {
      return {
        base: baseBarColor,
        swap: swapBarColor,
        sorted: sortedBarColor,
        iterating: iteratingBarColor,
        pivot: pivotBarColor
      };
    },

    yellowBarLegend(): { show: boolean; text?: string } {
      switch (this.chosenSortingAlgorithm) {
        case allSortingAlgorithms.QUICK_SORT:
          return { show: true, text: "Pivot" };

        case allSortingAlgorithms.SELECTION_SORT:
          return { show: true, text: "Min Element" };

        default:
          break;
      }

      return { show: false };
    }
  },

  watch: {
    ARRAY_SIZE(newArraySize) {
      if (newArraySize * this.arrayBarWidth > window.innerWidth * 0.85) {
        this.arrayBarWidth /= 2;
      }

      this.generateRandomArray();
    }
  },

  mounted() {
    this.generateRandomArray();
  },

  created() {
    this.generateRandomArray();
  }
});
</script>

<style scoped>
.array-sort-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  min-height: 93vh;
}

.bar-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin: 2rem auto;
}

.action-container {
  display: flex;
  width: 70%;
  justify-content: space-around;
  align-items: center;
}
</style>

<style>
/* .radio {
  display: flex;
  align-items: center;
} */

.radio:hover {
  color: inherit !important;
}
</style>
