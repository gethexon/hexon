<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useSettingsStore } from "~/store/settings"
import notification from "~/plugins/notification"
import { HButton } from "@/ui/button/"
import { HInput } from "@/ui/input"

const settingsStore = useSettingsStore()
const fontFamily = ref(settingsStore.settings.ui.editor.fontFamily)
watch(
  () => settingsStore.settings.ui.editor.fontFamily,
  (v) => {
    fontFamily.value = v
  }
)
const save = () => {
  settingsStore.settings.ui.editor.fontFamily = fontFamily.value
  settingsStore.save().then(() => {
    notification.notify({
      type: "success",
      title: "设置已保存",
    })
  })
}
</script>
<template>
  <div class="">
    <div class="mb-2 text-sub">编辑器字体</div>
    <HInput
      class="w-full font-mono"
      type="secondary"
      v-model="fontFamily"
    ></HInput>
    <HButton class="mt-8" @click="save">保存</HButton>
  </div>
</template>
