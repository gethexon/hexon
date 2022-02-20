<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { HTheme } from "~/themes"
import HToolbar from "./HToolbar.vue"
const theme = useTheme<HTheme>()!
</script>
<template>
  <HToolbar>
    <span
      class="text-xl pl-8"
      :style="{
        color: theme.color.foreground.main,
        fontWeight: 600,
        letterSpacing: '0.05rem',
      }"
    >
      Hexon
    </span>
  </HToolbar>
</template>
