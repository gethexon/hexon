<script setup lang="ts">
import { ref } from "vue"
import { HToggle } from ".."
import DemoPad from "~/components/DemoPad.vue"
const active = ref(false)
</script>
<template>
  <DemoPad>
    <HToggle v-model:active="active"></HToggle>
  </DemoPad>
</template>
