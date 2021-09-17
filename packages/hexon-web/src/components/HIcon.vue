<script setup lang="ts">
import { toRefs } from "@vue/reactivity";
import { Icon } from "@vicons/utils";

const props = withDefaults(defineProps<{ size?: string | number }>(), {
  size: 18,
});
const { size } = toRefs(props);
</script>
<template>
  <Icon :size="size"><slot></slot></Icon>
</template>
