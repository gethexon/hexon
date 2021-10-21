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
<style scope lang="less">
@import "~/styles/index.less";
.container {
  padding-left: 40px !important;
  p {
    @apply py-3;
  }
  h1,
  h2,
  h3 {
    .header-anchor {
      color: var(--c-brand);
    }
  }
  h1 {
    @apply text-4xl font-bold mb-3 pt-8;
  }
  h2 {
    @apply text-2xl font-bold border-b my-3;
  }
  h3 {
    @apply text-xl font-bold border-b my-3;
  }
}
</style>
