<script setup lang="ts">
import { computed, ref, toRefs, watch } from "vue"
import { createClassNames } from "~/utils/create-classnames"
import { useThemeVars } from "@/ui/theme"
import { HVerticalCenter } from "@/ui/vertical-center"
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
const bgColor = computed(() =>
  internalValue.value ? vars.value.colorPrimary : vars.value.textColorSecondary
)
const vars = useThemeVars()
</script>
<template>
  <HVerticalCenter>
    <label
      :class="classNames"
      class="inline-flex flex-col justify-center"
      style="height: 30px"
    >
      <TransitionGroup
        tag="div"
        name="toggle"
        class="cursor-pointer select-none rounded-full relative flex items-center h-5 w-10"
        :class="{
          'justify-end': internalValue,
          'justify-start': !internalValue,
        }"
        style="padding: 0 3px"
        :style="{
          backgroundColor: vars.backgroundColorTertiary,
        }"
      >
        <div
          key="dot"
          class="absolute rounded-full h-3.5 w-3.5"
          :class="{ 'opacity-50': !internalValue }"
          :style="{ backgroundColor: bgColor }"
        ></div>
      </TransitionGroup>
      <input v-model="internalValue" type="checkbox" class="absolute w-0 h-0" />
    </label>
  </HVerticalCenter>
</template>
<style>
.toggle-move {
  transition: all 0.2s ease;
}
</style>
