<script setup lang="ts">
import { computed, ref, toRefs, watch } from "vue"
import { HIcon, HIconName } from "../../icon"
const props = defineProps<{
  checked: boolean
}>()
const emits = defineEmits<{
  (e: "update:checked", value: boolean): void
}>()
const { checked } = toRefs(props)
const invernalValue = ref(false)
watch(
  () => checked.value,
  (value) => {
    invernalValue.value = value
  }
)
watch(
  () => invernalValue.value,
  (value) => {
    emits("update:checked", value)
  }
)
const icon = computed(() =>
  invernalValue.value ? HIconName.CheckboxComposite : HIconName.Checkbox
)
const toggle = () => {
  invernalValue.value = !invernalValue.value
}
</script>
<template>
  <label @click="toggle" class="cursor-pointer select-none">
    <HIcon :name="icon" class="mr-2" /><slot></slot>
  </label>
</template>
