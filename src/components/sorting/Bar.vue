<template>
  <div
    class="array-bar"
    :style="{
      width: `${barWidth}px`,
      height: `${arrayElement.barHeight}px`,
      backgroundColor: arrayElement.barColor,
      fontSize: '0.75rem'
    }"
  >
    {{ barWidth >= 20 ? arrayElement.number : "" }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Bar",
  props: {
    arrayElement: {
      type: Object,
      required: true
    },
    barWidth: {
      type: Number,
      required: true
    }
  }
});
</script>

<style scoped>
.array-bar {
  text-align: center;
  color: white;
  margin: 0 0.1rem;
  pointer-events: none;
}
</style>
