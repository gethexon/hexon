<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "@winwin/vue-global-theming";
import { HTheme } from "~/themes";
import Stepper from "~/lib/stepper/Stepper.vue";
import InstallWelcomeView from "~/views/InstallWelcomeView.vue";
import InstallView from "~/views/InstallView.vue";
const theme = useTheme<HTheme>()!;
const styleVars = computed(() => {
  return {
    bgColor: theme.value.color.primary.n,
    color: theme.value.color.white,
  };
});
</script>
<template>
  <Stepper class="install-page w-full h-full">
    <template #default="slotsProps">
      <InstallWelcomeView :next="slotsProps?.next" />
      <InstallView :prev="slotsProps?.prev" />
    </template>
  </Stepper>
</template>
<style lang="less" scoped>
.install-page {
  background-color: v-bind("styleVars.bgColor");
  color: v-bind("styleVars.color");
}
</style>
