<template>
  <div class="dropdown" ref="dropdownList">
    <div v-if="dropdownItems">
      <div
        v-for="(item, i) in dropdownItems"
        :key="i"
        :class="{ 'dropdown-item': true, selected: item === selectedAlgo }"
        @click="emitAndHide(item)"
      >
        {{ item }}
      </div>
    </div>
    <div v-else>
      <div class="dropdown-slot">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Dropdown",
  props: {
    dropdownItems: {},
    selectedAlgo: {
      type: String
    }
  },
  methods: {
    emitAndHide(item: string) {
      this.$emit("selectionChanged", item);
    }
  }
});
</script>

<style scoped>
.dropdown {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  position: absolute;
  top: 120%;
  left: 0;
  min-width: 100%;
  background-color: #32475b;
  border-radius: 5px;
  z-index: 300;
  animation: grow 200ms linear;
}

@keyframes grow {
  0% {
    transform: translateY(-50%);
    opacity: 0;
    pointer-events: none;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }
}

.dropdown-item,
.dropdown-slot {
  height: 100%;
  width: 100%;
  padding: 0.5rem 1rem;
  color: #4eb380;
  font-size: 1.1rem;
  border-radius: 5px;
}

.dropdown-item:hover {
  background-color: #4eb380;
  color: #32475b;
}

.selected {
  background-color: #4eb380;
  color: #32475b;
}
</style>
