<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useTheme } from "@winwin/vue-global-theming";
import { HTheme } from "./themes";
const styles = computed(() => {
  return {
    width: "100vw",
    height: "100vh",
  };
});
const theme = useTheme<HTheme>()!;
const textMain = computed(() => theme.value.color.foreground.main);
const textSub = computed(() => theme.value.color.foreground.sub);
</script>

<template>
  <div :style="styles">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
@import "./styles/index.less";
.text-main {
  color: v-bind("textMain");
}
.text-sub {
  color: v-bind("textSub");
}
</style>
