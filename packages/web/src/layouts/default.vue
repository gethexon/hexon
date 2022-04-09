<script setup lang="ts">
import { onMounted } from "vue"
import { RouterView } from "vue-router"
onMounted(() => {
  console.log("default layout used")
})
</script>
<template>
  <RouterView />
</template>
