<script setup lang="ts">
import { defineAsyncComponent, nextTick, ref, watch } from "vue"
import { HTextarea } from "@/ui/textarea"
import { HButton } from "@/ui/button"
import yaml from "js-yaml"
import { useThemeVars } from "@/ui/theme"
import { debouncedWatch } from "@vueuse/core"
import { cloneDeep } from "lodash-es"
import { useModal } from "~/lib/modal"
import FrontMatterTemplateModal from "~/components/editors/FrontMatterTemplate.vue"
import HModal from "../ui/modal/src/HModal.vue"
import FrontMatterTemplateEdit from "./FrontMatterTemplateEdit.vue"
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
const modal = useModal()
const internal = ref("")
watch(
  () => cloneDeep(props.fm),
  (v) => {
    try {
      // Trick {} => ' {}' to {} => ''
      const str = yaml.dump(v, {})
      internal.value = str.trim() === "{}" ? "" : str
      nextTick(() => {
        error.value = ""
      })
    } catch (err) {
      nextTick(() => {
        error.value = (err as Error).message
      })
    }
  },
  {
    immediate: true,
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
const showTemplateModal = ref(false)
const onTemplate = () => {
  showTemplateModal.value = true
}
const onSetTemplate = (v: string) => {
  showTemplateModal.value = false
  internal.value += v
}
</script>

<template>
  <div class="px-4">
    <HTextarea
      :style="`font-family: 'Courier New', Courier, monospace`"
      v-model:value="internal"
      :error="!!error"
      placeholder="key: value"
    />
    <div class="text-sm mb-2" :style="{ color: vars.colorError }">
      {{ error }}
    </div>
    <HButton @click="onTemplate">使用模板</HButton>
    <HModal v-model:show="showTemplateModal">
      <FrontMatterTemplateModal @set-template="(v) => onSetTemplate(v)" />
    </HModal>
  </div>
</template>
