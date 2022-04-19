<script setup lang="ts">
import { onMounted } from "vue"
import { RouterView } from "vue-router"
import { useSettingsStore } from "~/store/settings"
const settings = useSettingsStore()
onMounted(() => {
  settings.load()
  console.log("default layout used")
})
</script>
<template>
  <RouterView />
</template>
