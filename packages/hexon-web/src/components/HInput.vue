<script setup lang="ts">
import { computed, toRefs } from "@vue/reactivity";
import { Dismiss16Filled } from "@vicons/fluent";
import HVerticalCenter from "./HVerticalCenter.vue";
import HIcon from "./HIcon.vue";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    clearable?: boolean;
  }>(),
  { placeholder: "", clearable: false }
);
const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const { modelValue, placeholder, clearable } = toRefs(props);
const showSuffix = computed(() => clearable.value && modelValue.value);

const requestChange = (value: string) => emit("update:modelValue", value);
const onInput = (e: InputEvent) =>
  requestChange((e.target as HTMLInputElement)?.value);
const onClear = () => requestChange("");
</script>
<template>
  <label class="container">
    <div class="prefix">
      <HVerticalCenter style="line-height: 100%">
        <slot name="prefix"></slot>
      </HVerticalCenter>
    </div>
    <input :value="modelValue" @input="onInput" :placeholder="placeholder" />
    <div class="suffix" v-if="showSuffix" @click="onClear">
      <HIcon>
        <Dismiss16Filled />
      </HIcon>
    </div>
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
  .prefix,
  .suffix {
    display: flex;
    align-items: center;
    height: 100%;
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
