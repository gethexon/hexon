<script setup lang="ts">
import HToolbar from "./HToolbar.vue";
import HInput from "./HInput.vue";
import HButton from "./HButton.vue";
import HIcon from "./HIcon.vue";
import { HIconName } from "./HIconName";
import { toRefs } from "vue-demi";

const props = defineProps<{
  modelValue: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "on-add"): void;
}>();
const { modelValue } = toRefs(props);
const onInput: any = (value: string) => emits("update:modelValue", value);
</script>
<template>
  <HToolbar class="px-6">
    <div class="flex-1"></div>
    <HInput
      :modelValue="modelValue"
      @update:model-value="onInput"
      type="secondary"
      placeholder="搜索"
      clearable
    >
    </HInput>
    <!-- <HButton class="ml-2" round><HIcon :name="HIconName.Search" /></HButton> -->
    <HButton class="ml-2" round @click="emits('on-add')">
      <HIcon :name="HIconName.Add" />
    </HButton>
  </HToolbar>
</template>
