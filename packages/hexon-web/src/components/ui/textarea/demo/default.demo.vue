<script setup lang="ts">
import { ref } from "vue"
import { useThemeVars } from "../../theme"
import HTextarea from "../src/HTextarea.vue"

const value = ref("")
const vars = useThemeVars()
</script>
<template>
  <div :style="{ backgroundColor: vars.backgroundColorTertiary }" class="p-4">
    <HTextarea v-model:value="value" />
  </div>
</template>
