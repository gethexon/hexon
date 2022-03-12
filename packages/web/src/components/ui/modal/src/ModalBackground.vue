<script setup lang="ts">
import { useThemeVars } from "../../theme"

const vars = useThemeVars()
</script>
<template>
  <div
    :style="{ backgroundColor: vars.backgroundColorPrimary }"
    class="p-2 rounded-md"
  >
    <slot></slot>
  </div>
</template>
