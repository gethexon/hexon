<script setup lang="ts">
import { useThemeVars } from "@/ui/theme"
import HToolbar from "./HToolbar.vue"
const vars = useThemeVars()
</script>
<template>
  <HToolbar>
    <span
      class="text-xl"
      :style="{
        fontWeight: 600,
        letterSpacing: '0.05rem',
      }"
    >
      <slot>
        <span class="pl-8">Hexon</span>
      </slot>
    </span>
  </HToolbar>
</template>
