<script setup lang="ts">
import { ref } from "vue"
import HLoading from "../src/HLoading.vue"
import HButton from "../../button/src/HButton.vue"

const loading = ref(false)
</script>
<template>
  <HButton @click="loading = !loading">toggle loading</HButton>
  <div
    style="
      height: 300px;
      width: 300px;
      background-color: antiquewhite;
      position: relative;
    "
  >
    <HLoading :loading="loading">content</HLoading>
  </div>
</template>
