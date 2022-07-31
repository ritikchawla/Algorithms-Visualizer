<template>
  <div
    style="position: relative; cursor: default; z-index: 1;"
    @mouseover="mouseOverHandler"
    @mouseleave="mouseLeaveHandler"
  >
    <div
      v-if="showTooltip"
      class="tooltip-container"
      :style="tooltipStyles"
      ref="tooltipContainer"
    >
      {{ tooltipMessage }}
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Tooltip",
  props: {
    tooltipMessage: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showTooltip: false
    };
  },

  methods: {
    mouseOverHandler() {
      this.showTooltip = true;
    },

    mouseLeaveHandler() {
      const tooltipContainer = this.$refs.tooltipContainer as HTMLDivElement;
      tooltipContainer.style.transform = "scale(0, 0)";

      setTimeout(() => {
        this.showTooltip = false;
      }, 250);
    }
  },

  computed: {
    tooltipStyles() {
      const minWidth: number = this.tooltipMessage.length >= 65 ? 400 : 200;
      const left: number = Math.floor(minWidth - 100) * 0.5;

      return {
        minWidth: `${minWidth}%`,
        left: `-${left}%`
      };
    }
  }
});
</script>

<style scoped>
.tooltip-container {
  position: absolute;
  bottom: 100%;
  background-color: #222f3e;
  padding: 0.5rem 0.2rem;
  border-radius: 5px;
  color: white;
  transition: transform 200ms linear;
  animation: grow 200ms linear;
  z-index: 100;
}

@keyframes grow {
  0% {
    transform: scale(0, 0);
  }

  100% {
    transform: scale(1, 1);
  }
}
</style>
