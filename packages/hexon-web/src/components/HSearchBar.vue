<script setup lang="ts">
import HToolbar from "./HToolbar.vue"
import { HInput } from "./ui/input"
import { HButton } from "./ui/button"
import { HIcon } from "./ui/icon"
import { HIconName } from "./ui/icon"
import { toRefs } from "vue"

const props = defineProps<{
  modelValue: string
}>()
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "on-add"): void
}>()
const { modelValue } = toRefs(props)
const onInput: any = (value: string) => emits("update:modelValue", value)
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
      <template v-slot:prefix>
        <HIcon :name="HIconName.Search" />
      </template>
    </HInput>
    <!-- <HButton class="ml-2" round><HIcon :name="HIconName.Search" /></HButton> -->
    <HButton class="ml-2" round @click="emits('on-add')">
      <HIcon :name="HIconName.Add" />
    </HButton>
  </HToolbar>
</template>
