<script setup lang="ts">
import { toRefs } from "vue"
import { HButton } from "@/ui/button"
import { HIconName } from "@/ui/icon"
import { HIcon } from "@/ui/icon"
import { HInput } from "@/ui/input"
import HToolbar from "./HToolbar.vue"

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
      placeholder="搜尋"
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
