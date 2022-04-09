<script setup lang="ts">
import { onMounted } from "vue"
import { RouterView } from "vue-router"
onMounted(() => {
  console.log("unauthorized layout used")
})
</script>
<template>
  <RouterView />
</template>
