<script setup>
import { computed } from "vue";
import DefaultTheme from "vitepress/theme";
import { useThemeController } from "@winwin/vue-global-theming";
const { Layout } = DefaultTheme;
const theme = useThemeController();
const styles = computed(() => {
  return {
    ...theme?.styles.value,
  };
});
</script>
<template>
  <div :style="styles">
    <Layout />
  </div>
</template>
