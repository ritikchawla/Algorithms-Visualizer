<template>
  <div class="container">
    <h1 class="title">Algorithm Visualizer</h1>
    <div class="is-flex cards-container">
      <ImageCard
        v-for="card in imageCards"
        :imageSrc="card.imageSrc"
        :name="card.name"
        :routePath="card.routePath"
        :description="card.description"
        :key="card.routePath"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import ImageCard from "./ImageCard.vue";

export default defineComponent({
  components: { ImageCard },
  name: "Navigation",
  data() {
    return {
      imageCards: [
        // get gifs of the algos working and use them as image sources
        {
          name: "Sorting",
          imageSrc: "/images/sorting.gif",
          routePath: "/sorting-algos",
          description: "Visualization of some sorting Algorithms"
        },
        {
          name: "Path Finders and Maze Generators",
          imageSrc: "/images/pathfinding.gif",
          routePath: "/path-finding-algos",
          description: "Visualization of Path Finding and Maze Generating Algorithms"
        },
        {
          name: "Data Structures' Algorithms",
          imageSrc: "/images/DsSS.png",
          routePath: "/common-ds-algo",
          description: "Visualization of Algorithms related to Data Structures"
        }
      ]
    };
  }
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.title {
  color: rgb(200, 200, 200);
  text-align: center;
  justify-self: flex-start;
}

.cards-container {
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>
