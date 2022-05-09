<script setup lang="ts">
import { ref } from "vue"
import { HCheckbox } from ".."
import DemoPad from "~/components/DemoPad.vue"
const checked = ref(false)
</script>
<template>
  <DemoPad>
    <HCheckbox v-model:checked="checked">这是一个 checkbox</HCheckbox>
  </DemoPad>
</template>
