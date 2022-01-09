<script setup lang="ts">
import { ref, watch } from "vue"
import HTextarea from "../ui/textarea/src/HTextarea.vue"
import yaml from "js-yaml"
import { useThemeVars } from "../ui/theme"
import { debouncedWatch, throttledWatch } from "@vueuse/core"
const props = defineProps<{
  fm: {
    [key: string]: unknown
  }
}>()
const emtis = defineEmits<{
  (
    e: "update:fm",
    fm: {
      [key: string]: unknown
    }
  ): void
}>()
const internal = ref("")
watch(
  () => props.fm,
  (v) => {
    try {
      // Trick {} => ' {}' to {} => ''
      const str = yaml.dump(v, {})
      internal.value = str.trim() === "{}" ? "" : str
      error.value = ""
    } catch (err) {
      error.value = (err as Error).message
    }
  },
  {
    deep: true,
  }
)
debouncedWatch(
  () => internal.value,
  (v) => {
    try {
      const obj = yaml.load(internal.value)
      yaml.dump(obj)
      const o: {
        [key: string]: unknown
      } = {}
      if (typeof obj === "string") throw new Error("must be key-value pairs")
      for (const key in obj as { [key: string]: unknown }) {
        o[key] = (obj as { [key: string]: unknown })[key]
      }
      error.value = ""
      emtis("update:fm", o)
    } catch (err) {
      error.value = (err as Error).message
    }
  },
  {
    debounce: 1000,
  }
)
const error = ref("")
const vars = useThemeVars()
</script>

<template>
  <div class="px-4">
    <HTextarea
      :style="`font-family: 'Courier New', Courier, monospace`"
      v-model:value="internal"
      :error="!!error"
      placeholder="key: value"
    />
    <div class="text-sm" :style="{ color: vars.colorError }">{{ error }}</div>
  </div>
</template>
