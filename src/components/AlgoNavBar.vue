<template>
  <div class="nav-container">
    <div class="home">
      <SVG :name="svgNames.home" @click="sendUserHome" />
    </div>

    <div class="options-container">
      <div class="dropdown-container-container">
        <div
          class="dropdown-container"
          :style="algoDropdownVisible ? dropdownStyle : normalStyle"
        >
          <h1 class="is-size-4" @click="algoDropdownVisible = !algoDropdownVisible">
            Algorithms <SVG :name="svgNames.downArrow" />
          </h1>
          <Dropdown
            v-if="algoDropdownVisible"
            :dropdownItems="algorithmsList"
            :selectedAlgo="selectedAlgo"
            @selectionChanged="algorithmChanged"
          />
        </div>

        <div
          class="dropdown-container"
          :style="speedDropdownVisible ? dropdownStyle : normalStyle"
        >
          <h1 class="is-size-4" @click="speedDropdownVisible = !speedDropdownVisible">
            Speed <SVG :name="svgNames.downArrow" />
          </h1>
          <Dropdown v-if="speedDropdownVisible" :dropdownItems="null">
            <p>Speed: {{ algoSpeed / 1000 }}s</p>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              class="slider"
              :value="algoSpeed"
              @change="$emit('update:algoSpeed', parseInt($event.target.value))"
            />
          </Dropdown>
        </div>

        <div
          v-if="cellSize"
          class="dropdown-container"
          :style="cellSizeDropdownVisible ? dropdownStyle : normalStyle"
        >
          <h1
            class="is-size-4"
            @click="cellSizeDropdownVisible = !cellSizeDropdownVisible"
          >
            Cell Size <SVG :name="svgNames.downArrow" />
          </h1>
          <Dropdown v-if="cellSizeDropdownVisible" :dropdownItems="null">
            <p>Size: {{ cellSize }}</p>
            <input
              type="range"
              min="10"
              max="30"
              step="5"
              class="slider"
              :value="cellSize"
              @change="$emit('update:cellSize', parseInt($event.target.value))"
            />
          </Dropdown>
        </div>

        <div
          v-if="arraySize"
          class="dropdown-container"
          :style="arraySizeDropdownVisible ? dropdownStyle : normalStyle"
        >
          <h1
            class="is-size-4"
            @click="arraySizeDropdownVisible = !arraySizeDropdownVisible"
          >
            Array Elements <SVG :name="svgNames.downArrow" />
          </h1>
          <Dropdown v-if="arraySizeDropdownVisible" :dropdownItems="null">
            <p>Elements: {{ arraySize }}</p>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              class="slider"
              :value="arraySize"
              @change="$emit('update:arraySize', parseInt($event.target.value))"
            />
          </Dropdown>
        </div>

        <div
          class="dropdown-container"
          v-if="showMazeDropdown"
          :style="mazeDropdownVisible ? dropdownStyle : normalStyle"
        >
          <h1 class="is-size-4" @click="mazeDropdownVisible = !mazeDropdownVisible">
            Mazes <SVG :name="svgNames.downArrow" />
          </h1>
          <Dropdown
            v-if="mazeDropdownVisible"
            :dropdownItems="mazeGenAlgorithmsList"
            @selectionChanged="mazeGenerationAlgoSelected"
          >
          </Dropdown>
        </div>
      </div>

      <div class="action-buttons-container">
        <button
          v-for="btn in buttonsList"
          :key="btn.text"
          @click="btn.handler"
          :class="{ [btn.class]: true }"
          style="margin-right: 0.5rem"
        >
          {{ btn.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dropdown from "@/components/Dropdown.vue";
import SVG from "./Svg.vue";
import { svgNames } from "@/constants/globalConstants";

export default defineComponent({
  name: "AlgoNavBar",
  components: { Dropdown, SVG },
  props: {
    algorithmsList: {
      type: Array,
      required: true
    },
    buttonsList: {
      type: Array,
      required: true
    },
    selectedAlgo: {
      type: String,
      required: true
    },
    algoSpeed: {
      type: Number,
      required: false
    },
    cellSize: {
      type: Number,
      required: false
    },
    arraySize: {
      type: Number,
      required: false
    },
    showMazeDropdown: {
      type: Boolean,
      default: false
    },
    mazeGenAlgorithmsList: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      svgNames,
      algoDropdownVisible: false,
      speedDropdownVisible: false,
      mazeDropdownVisible: false,
      cellSizeDropdownVisible: false,
      arraySizeDropdownVisible: false,
      normalStyle: {
        color: "#ddd"
      },
      dropdownStyle: {
        color: "#34ace0"
      }
    };
  },
  methods: {
    algorithmChanged(value: string) {
      this.$emit("algorithmChanged", value);
      this.algoDropdownVisible = false;
    },
    mazeGenerationAlgoSelected(value: string) {
      this.$emit("mazeGenerationAlgoSelected", value);
      this.mazeDropdownVisible = false;
    },
    sendUserHome() {
      this.$router.push("/");

      setTimeout(() => {
        window.location.reload();
      }, 0);
    }
  }
});
</script>

<style scoped>
.nav-container {
  width: 100vw;
  background-color: #2c3e50;
  min-height: 7vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.home {
  width: 3%;
  text-align: center;
}

.home:hover {
  cursor: pointer;
  opacity: 0.8;
}

.options-container {
  width: 95%;
  height: 7vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.dropdown-container-container {
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
}

.dropdown-container {
  height: 100%;
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.dropdown-container:hover {
  cursor: pointer;
}

.action-buttons-container {
  min-width: 40%;
  display: flex;
  justify-content: center;
}
</style>
