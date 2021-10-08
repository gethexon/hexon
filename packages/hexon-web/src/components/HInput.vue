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
  <label class="container" :class="classes">
    <div class="prefix">
      <slot name="prefix"></slot>
    </div>
    <input
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
      :type="attrType"
    />
    <div class="suffix" v-if="showSuffix" @click="onClear">
      <HIcon :name="HIconName.Cancel" />
    </div>
  </label>
</template>
<style scoped lang="less">
.container {
  height: 32px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: text;
  overflow: hidden;
  color: var(--color-foreground-2);
  font-size: smaller;

  &.primary {
    background-color: var(--color-background-1);
  }
  &.secondary {
    background-color: var(--color-background-3);
  }
  .prefix,
  .suffix {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: larger;
  }
  .prefix {
    margin-right: 4px;
  }
  .suffix {
    margin-left: 4px;
    & span {
      cursor: pointer;
    }
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
