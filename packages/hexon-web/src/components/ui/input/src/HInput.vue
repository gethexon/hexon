<script setup lang="ts">
import { computed, toRefs, InputHTMLAttributes } from "vue"
import { useTheme } from "@winwin/vue-global-theming"
import { HTheme } from "~/themes"
import { HIcon, HIconName } from "../../icon"

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    clearable?: boolean
    type?: "primary" | "secondary"
    error?: string
    attrType?: InputHTMLAttributes["type"]
  }>(),
  { placeholder: "", clearable: false, type: "primary" }
)
const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>()

const { modelValue, placeholder, clearable, type, attrType } = toRefs(props)
const showSuffix = computed(() => clearable.value && modelValue.value)

const requestChange = (value: string) => emit("update:modelValue", value)
const onInput = (e: Event) =>
  requestChange((e.target as HTMLInputElement)?.value)
const onClear = () => requestChange("")

const theme = useTheme<HTheme>()!
const styleVars = computed(() => {
  let color = theme.value.color.foreground.main
  let plshdColor = theme.value.color.foreground.sub
  let bgColor = theme.value.color.background.base1
  let outline = theme.value.color.foreground.transparent
  if (type.value === "secondary") {
    bgColor = theme.value.color.background.secondInput
  }
  if (props.error) {
    outline = theme.value.color.error.n
  }
  return { color, bgColor, plshdColor, outline }
})
</script>
<template>
  <label
    class="h-input text-sm h-8 border-none rounded-2xl px-3 py-0 overflow-hidden flex cursor-text items-center w-full"
    :style="{ outline: `1px solid ${styleVars.outline}` }"
  >
    <div class="prefix mr-1">
      <slot name="prefix"></slot>
    </div>
    <input
      class="border-none outline-none flex-1 rounded-none leading-full bg-transparent mx-1"
      :value="modelValue"
      :placeholder="placeholder"
      :type="attrType"
      @input="onInput"
    />
    <div class="suffix ml-1" v-if="showSuffix" @click="onClear">
      <HIcon :name="HIconName.Cancel" />
    </div>
  </label>
  <div
    class="h-input-hint"
    :style="{ color: theme.color.error.n }"
    v-if="error !== void 0"
  >
    {{ error }}&nbsp;
  </div>
</template>
<style scoped lang="less">
@import "~/styles/mixins.less";
.h-input {
  color: v-bind("styleVars.color");
  background-color: v-bind("styleVars.bgColor");
  .prefix,
  .suffix {
    @apply flex items-center h-full text-sm;
  }
  .suffix > * {
    @apply cursor-pointer;
  }

  input {
    &::placeholder {
      transform: translateY(-1px);
      @apply text-sm;
      color: v-bind("styleVars.plshdColor");
    }
  }
}
.h-input-hint {
  @apply pl-5 my-1 text-xs;
  .ellipsis(1);
}
</style>
