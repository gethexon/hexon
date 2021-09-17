<script setup lang="ts">
import { toRefs } from "@vue/reactivity";
import HVerticalCenter from "./HVerticalCenter.vue";

const props = withDefaults(
  defineProps<{ modelValue: string; placeholder?: string }>(),
  { placeholder: "" }
);
const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const { modelValue, placeholder } = toRefs(props);

const requestChange = (value: string) => emit("update:modelValue", value);
const onInput = (e: InputEvent) =>
  requestChange((e.target as HTMLInputElement)?.value);
</script>
<template>
  <label class="container">
    <div class="prefix">
      <HVerticalCenter style="line-height: 100%">
        <slot name="prefix"></slot>
      </HVerticalCenter>
    </div>
    <input :value="modelValue" @input="onInput" :placeholder="placeholder" />
  </label>
</template>
<style scoped lang="less">
.container {
  background-color: var(--color-white);
  height: 32px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: text;
  overflow: hidden;
  .prefix {
    margin-right: 4px;
    display: flex;
    align-items: center;
    height: 100%;
  }
  input {
    flex: 1;
    &::selection {
      background-color: var(--color-primary-l8);
    }
  }
}
input {
  line-height: 100%;
  border-radius: 0;
}
</style>
