<script setup lang="ts">
import { computed, toRefs } from "@vue/reactivity";
import { Icon } from "@vicons/utils";

const props = withDefaults(
  defineProps<{ size?: string | number; clickable: boolean }>(),
  {
    size: "1em",
    clickable: false,
  }
);
const { size, clickable } = toRefs(props);
const classes = computed(() => {
  return { clickable: clickable.value };
});
</script>
<template>
  <Icon class="h-icon" :size="size" :class="classes"><slot></slot></Icon>
</template>
<style scoped lang="less">
.h-icon.clickable {
  cursor: pointer;
}
</style>
