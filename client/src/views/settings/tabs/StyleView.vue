<script setup lang="ts">
import { ref, watch } from "vue"
import { useSettingsStore } from "~/store/settings"
import notification from "~/plugins/notification"
import { HButton } from "@/ui/button/"
import { HInput } from "@/ui/input"
import {
  darkTheme,
  lightTheme,
  useThemeController,
  useThemeVars,
} from "@/ui/theme"
import { HDivider } from "@/ui/divider"
import { HToggle } from "@/ui/toggle"

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
      title: "樣式已儲存",
    })
  })
}

const vars = useThemeVars()
const tc = useThemeController()
const setDark = (isDark: boolean) => {
  if (isDark) tc.setTheme(darkTheme)
  else tc.setTheme(lightTheme)
}
const DEV = import.meta.env.DEV
</script>
<template>
  <div class="">
    <div class="text-lg mb-2" :style="{ color: vars.textColorPrimary }">
      編輯器
    </div>
    <div class="mb-2" :style="{ color: vars.textColorSecondary }">字體</div>
    <HInput
      class="w-full font-mono"
      type="secondary"
      v-model="fontFamily"
    ></HInput>
    <template v-if="DEV">
      <div class="text-lg my-2" :style="{ color: vars.textColorPrimary }">
        顏色
      </div>
      <div class="mb-2" :style="{ color: vars.textColorSecondary }">
        黑暗模式
      </div>
      <div>
        <HToggle :active="vars.isDark" @update:active="(v) => setDark(v)" />
      </div>
    </template>
    <HButton class="mt-8" @click="save">儲存</HButton>
  </div>
</template>
