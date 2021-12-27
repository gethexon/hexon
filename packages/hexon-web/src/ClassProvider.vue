<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { computed } from "vue"
import { HTheme } from "./themes"

const theme = useTheme<HTheme>()!
const textMain = computed(() => theme.value.color.foreground.main)
const textSub = computed(() => theme.value.color.foreground.sub)
const bgBase1 = computed(() => theme.value.color.background.base1)
const bgBase2 = computed(() => theme.value.color.background.base2)
const bgBase3 = computed(() => theme.value.color.background.base3)
</script>
<template><slot></slot></template>

<style lang="less">
.text-main {
  color: v-bind("textMain");
}
.text-sub {
  color: v-bind("textSub");
}
.bg-base-1 {
  background-color: v-bind("bgBase1");
}
.bg-base-2 {
  background-color: v-bind("bgBase2");
}
.bg-base-3 {
  background-color: v-bind("bgBase3");
}
</style>
