<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { createClassNames } from "~/utils/create-classnames"
import { HIcon, HIconName } from "@/ui/icon"
const props = defineProps<{
  checked: boolean
}>()
const emits = defineEmits<{
  (e: "update:checked", value: boolean): void
}>()

const internalValue = ref(props.checked)
watch(
  () => props.checked,
  (value) => {
    internalValue.value = value
  }
)
watch(
  () => internalValue.value,
  (value) => {
    emits("update:checked", value)
  }
)
const icon = computed(() =>
  internalValue.value ? HIconName.CheckboxComposite : HIconName.Checkbox
)
const { classNames } = createClassNames("h-checkbox")
</script>
<template>
  <label
    :class="classNames"
    class="cursor-pointer select-none"
    style="line-height: 30px"
  >
    <input type="checkbox" class="absolute w-0 h-0" v-model="internalValue" />
    <HIcon :name="icon" class="mr-2" />
    <slot></slot>
  </label>
</template>
<style></style>
