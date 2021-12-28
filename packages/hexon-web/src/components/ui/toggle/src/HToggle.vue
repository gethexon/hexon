<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { computed, ref, toRefs, watch } from "vue"
import { HTheme } from "~/themes"
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
const toggle = () => {
  internalValue.value = !internalValue.value
}
const classes = computed(() =>
  internalValue.value ? "justify-end" : "justify-start"
)
const theme = useTheme<HTheme>()!
const bgColor = computed(() =>
  active.value ? theme.value.color.primary.n : theme.value.color.foreground.main
)
</script>
<template>
  <div class="inline-flex flex-col justify-center" style="height: 30px">
    <TransitionGroup
      tag="div"
      name="toggle"
      @click="toggle"
      class="cursor-pointer select-none rounded-full relative flex items-center"
      :class="{ 'justify-end': internalValue, 'justify-start': !internalValue }"
      style="height: 1em; width: 2em; border: 1px solid; padding-left: 1px"
      :style="{ borderColor: bgColor }"
    >
      <div
        key="dot"
        class="absolute rounded-full"
        :class="{ 'opacity-50': !active }"
        style="height: 0.8em; width: 0.8em; margin: 0 0.1em"
        :style="{ backgroundColor: bgColor }"
      ></div>
    </TransitionGroup>
  </div>
</template>
<style>
.toggle-move {
  transition: all 0.2s ease;
}
</style>
