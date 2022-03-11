<script setup lang="ts">
import { useThemeVars } from "@/ui/theme"
import HToolbar from "./HToolbar.vue"
const vars = useThemeVars()
</script>
<template>
  <HToolbar>
    <span
      class="text-xl pl-8"
      :style="{
        fontWeight: 600,
        letterSpacing: '0.05rem',
      }"
    >
      Hexon
    </span>
  </HToolbar>
</template>
