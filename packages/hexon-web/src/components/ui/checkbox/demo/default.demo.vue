<script setup lang="ts">
import { ref } from "vue"
import { HCheckbox } from ".."
const checked = ref(false)
</script>
<template>
  <HCheckbox v-model:checked="checked">这是一个 checkbox</HCheckbox>
</template>
