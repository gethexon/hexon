<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { createClassNames } from "~/utils/create-classnames"
import { HIcon, HIconName } from "@/ui/icon"
import { HVerticalCenter } from "@/ui/vertical-center"
import { useTheme } from "@/ui/theme"
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
const theme = useTheme("unknown")
</script>
<template>
  <label
    :class="classNames"
    class="cursor-pointer select-none inline-block"
    style="height: 30px; line-height: 30px"
  >
    <input type="checkbox" class="absolute w-0 h-0" v-model="internalValue" />
    <HVerticalCenter class="mr-2">
      <div
        class="h-5 w-5 rounded flex items-center justify-center pb-0.5"
        :style="{
          backgroundColor: theme.backgroundColorTertiary,
        }"
      >
        <div
          class="w-2 h-4 transform -rotate-45 -translate-x-1.5"
          :class="{ 'opacity-0': !internalValue }"
          style="transition: opacity 0.1s ease-in-out"
        >
          <div
            class="w-1 h-2 absolute bottom-0 rounded"
            :style="{
              backgroundColor: theme.colorPrimary,
            }"
          ></div>
          <div
            class="w-4 h-1 absolute bottom-0 rounded"
            :style="{
              backgroundColor: theme.colorPrimary,
            }"
          ></div>
        </div>
      </div>
    </HVerticalCenter>
    <slot></slot>
  </label>
</template>
<style></style>
