import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import ArraySort from "@/views/ArraySort.vue";
import PathFinder from "@/views/PathFinder.vue";
import DataStructures from "@/views/DataStructures.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: App
    },
    {
      path: "/sorting-algos",
      name: "SortingAlgos",
      component: ArraySort
    },
    {
      path: "/path-finding-algos",
      name: "PathFindingAlgos",
      component: PathFinder
    },
    {
      path: "/common-ds-algo",
      name: "DSAlgo",
      component: DataStructures
    }
  ]
});
