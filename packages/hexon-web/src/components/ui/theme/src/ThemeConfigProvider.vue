<script setup lang="ts">
import { toRefs } from "vue"
import { GlobalOverrides, provideThemeOverrides } from "."
const props = defineProps<{
  overrides: GlobalOverrides
}>()
const { overrides: overridesRef } = toRefs(props)
provideThemeOverrides({ overridesRef })
</script>
<template><slot></slot></template>
