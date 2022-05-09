<script setup lang="ts">
import { useThemeVars } from "~/components/ui/theme"
const vars = useThemeVars()
</script>
<template>
  <div
    :style="{
      backgroundColor: vars.backgroundColorPrimary,
    }"
    p8
  >
    <slot />
  </div>
</template>
