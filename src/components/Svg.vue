<template>
  <span>
    <svg
      v-if="name === svgNames.home"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="#4eb380"
      class="bi bi-house-fill"
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
      />
      <path
        fill-rule="evenodd"
        d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
      />
    </svg>

    <svg
      v-if="name === svgNames.downArrow"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-caret-down-fill"
      viewBox="0 0 16 16"
    >
      <path
        d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
      />
    </svg>

    <svg
      v-if="name === svgNames.checkbox"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="green"
      class="bi bi-check-lg"
      viewBox="0 0 16 16"
    >
      <path
        d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"
      />
    </svg>

    <svg
      v-if="name === svgNames.plus"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-plus-lg"
      viewBox="0 0 16 16"
    >
      <path
        d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"
      />
    </svg>

    <svg
      v-if="name === svgNames.delete"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-trash-fill"
      viewBox="0 0 16 16"
    >
      <path
        d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"
      />
    </svg>

    <svg
      v-if="name === svgNames.search"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-search"
      viewBox="0 0 16 16"
    >
      <path
        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
      />
    </svg>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { svgNames } from "@/constants/globalConstants";

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true
    }
  },

  setup() {
    return { svgNames };
  }
});
</script>

<style scoped></style>
