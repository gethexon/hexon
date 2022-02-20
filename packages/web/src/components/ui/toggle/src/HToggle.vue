<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { computed, ref, toRefs, watch } from "vue"
import { HTheme } from "~/themes"
import { createClassNames } from "~/utils/create-classnames"
const props = defineProps<{
  active: boolean
}>()
const emits = defineEmits<{
  (e: "update:active", value: boolean): void
}>()
const { active } = toRefs(props)
const internalValue = ref(props.active)
watch(
  () => active.value,
  (value) => {
    internalValue.value = value
  }
)
watch(
  () => internalValue.value,
  (value) => {
    emits("update:active", value)
  }
)
const { classNames } = createClassNames("h-toggle")
const theme = useTheme<HTheme>()!
const bgColor = computed(() =>
  active.value ? theme.value.color.primary.n : theme.value.color.foreground.main
)
</script>
<template>
  <label
    :class="classNames"
    class="inline-flex flex-col justify-center"
    style="height: 30px"
  >
    <TransitionGroup
      tag="div"
      name="toggle"
      class="cursor-pointer select-none rounded-full relative flex items-center h-5 w-10"
      :class="{ 'justify-end': internalValue, 'justify-start': !internalValue }"
      style="padding: 0 3px"
      :style="{
        backgroundColor: theme.color.background.base3,
      }"
    >
      <div
        key="dot"
        class="absolute rounded-full h-3.5 w-3.5"
        :class="{ 'opacity-50': !active }"
        :style="{ backgroundColor: bgColor }"
      ></div>
    </TransitionGroup>
    <input v-model="internalValue" type="checkbox" class="absolute w-0 h-0" />
  </label>
</template>
<style>
.toggle-move {
  transition: all 0.2s ease;
}
</style>
