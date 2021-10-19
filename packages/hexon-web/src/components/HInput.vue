<script setup lang="ts">
import { computed, toRefs } from "vue";
import HIcon from "./HIcon.vue";
import { HIconName } from "./HIconName";
import { InputHTMLAttributes } from "@vue/runtime-dom";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    clearable?: boolean;
    type?: "primary" | "secondary";
    attrType?: InputHTMLAttributes["type"];
  }>(),
  { placeholder: "", clearable: false, type: "primary" }
);
const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const { modelValue, placeholder, clearable, type, attrType } = toRefs(props);
const showSuffix = computed(() => clearable.value && modelValue.value);

const requestChange = (value: string) => emit("update:modelValue", value);
const onInput: any = (e: InputEvent) =>
  requestChange((e.target as HTMLInputElement)?.value);
const onClear = () => requestChange("");

const classes = computed(() => {
  return { [type.value]: true };
});
</script>
<template>
  <label
    class="
      h-input
      text-sm
      h-8
      border-none
      outline-none
      rounded-2xl
      px-3
      py-0
      overflow-hidden
      flex
      cursor-text
      items-center
      w-full
    "
    :class="classes"
  >
    <div class="prefix mr-1">
      <slot name="prefix"></slot>
    </div>
    <input
      class="
        border-none
        outline-none
        flex-1
        rounded-none
        leading-full
        bg-transparent
      "
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
      :type="attrType"
    />
    <div class="suffix ml-1" v-if="showSuffix" @click="onClear">
      <HIcon :name="HIconName.Cancel" />
    </div>
  </label>
</template>
<style scoped lang="less">
.h-input {
  color: var(--color-foreground-2);

  &.primary {
    background-color: var(--color-background-1);
  }
  &.secondary {
    background-color: var(--color-background-3);
  }
  .prefix,
  .suffix {
    @apply flex items-center h-full text-sm;
  }
  .suffix > * {
    @apply cursor-pointer;
  }

  input {
    &::selection {
      background-color: var(--color-primary-l8);
    }
  }
}
</style>
