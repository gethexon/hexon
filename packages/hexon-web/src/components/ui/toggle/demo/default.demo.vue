<script setup lang="ts">
import { ref } from "vue"
import { HToggle } from ".."
const active = ref(false)
</script>
<template>
  <HToggle v-model:active="active"></HToggle>
</template>
