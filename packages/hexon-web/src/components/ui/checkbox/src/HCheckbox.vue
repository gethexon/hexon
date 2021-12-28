<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { HIcon, HIconName } from "../../icon"
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
const toggle = () => {
  internalValue.value = !internalValue.value
}
</script>
<template>
  <label
    @click="toggle"
    class="cursor-pointer select-none"
    style="line-height: 30px"
  >
    <HIcon :name="icon" class="mr-2" />
    <slot></slot>
  </label>
</template>
