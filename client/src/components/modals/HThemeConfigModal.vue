<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue"
import type { IYamlConfigResponse } from "@shared/types/api"
import HMonacoEditor from "@/editors/HMonacoEditor.vue"
import { HBaseModal } from "@/ui/modal"
import { HButton } from "@/ui/button"
import { useThemeVars } from "@/ui/theme"
import { api } from "~/api"
import notification from "~/plugins/notification"

type ConfigType = "theme" | "hexo"

const props = defineProps<{
  close: () => void
}>()

const vars = useThemeVars()
const activeType = ref<ConfigType>("theme")
const loading = ref(true)
const saving = ref(false)
const themeName = ref<string | false>(false)
const contents = reactive<Record<ConfigType, string>>({
  theme: "",
  hexo: "",
})

const activeContent = computed(() => contents[activeType.value])
const activeTitle = computed(() =>
  activeType.value === "theme" ? "主题配置" : "Hexo 配置"
)

function setActiveContent(value: string) {
  contents[activeType.value] = value
}

async function loadConfig(type: ConfigType): Promise<IYamlConfigResponse> {
  return type === "theme" ? api.getThemeConfig() : api.getHexoConfig()
}

async function saveConfig(type: ConfigType, raw: string) {
  return type === "theme" ? api.setThemeConfig(raw) : api.setHexoConfig(raw)
}

async function load() {
  loading.value = true
  try {
    const [themeConfig, hexoConfig] = await Promise.all([
      loadConfig("theme"),
      loadConfig("hexo"),
    ])
    contents.theme = themeConfig.raw
    contents.hexo = hexoConfig.raw
    themeName.value = themeConfig.theme ?? false
  } catch (err) {
    notification.notify({
      type: "error",
      title: "配置载入失败",
      desc: err instanceof Error ? err.message : String(err),
    })
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  try {
    const result = await saveConfig(activeType.value, activeContent.value)
    if (activeType.value === "theme") themeName.value = result.theme ?? false
    contents[activeType.value] = result.raw
    notification.notify({
      type: "success",
      title: `${activeTitle.value}已保存`,
    })
  } catch (err) {
    notification.notify({
      type: "error",
      title: `${activeTitle.value}保存失败`,
      desc: err instanceof Error ? err.message : String(err),
    })
  } finally {
    saving.value = false
  }
}

function selectType(type: ConfigType) {
  if (!saving.value) activeType.value = type
}

onMounted(load)
</script>
<template>
  <HBaseModal :persistent="saving" @on-close="props.close">
    <div
      class="theme-config-modal rounded-md flex flex-col"
      :style="{ backgroundColor: vars.backgroundColorPrimary }"
    >
      <div class="px-5 pt-4 flex-shrink-0">
        <div class="text-lg" :style="{ color: vars.textColorPrimary }">
          配置编辑
        </div>
        <div class="text-xs mt-1" :style="{ color: vars.textColorSecondary }">
          当前主题：{{
            themeName || "未知"
          }}。编辑器会保留原配置中的注释和格式。
        </div>
        <div
          class="tabs mt-4 flex"
          :style="{ borderColor: vars.backgroundColorHover }"
        >
          <button
            class="tab px-4 py-2 text-sm"
            :class="{ active: activeType === 'theme' }"
            :style="{
              color:
                activeType === 'theme'
                  ? vars.colorPrimary
                  : vars.textColorSecondary,
            }"
            @click="selectType('theme')"
          >
            主题配置
          </button>
          <button
            class="tab px-4 py-2 text-sm"
            :class="{ active: activeType === 'hexo' }"
            :style="{
              color:
                activeType === 'hexo'
                  ? vars.colorPrimary
                  : vars.textColorSecondary,
            }"
            @click="selectType('hexo')"
          >
            Hexo 配置
          </button>
        </div>
      </div>
      <div
        v-if="loading"
        class="config-loading flex-1 flex items-center justify-center"
        :style="{ color: vars.textColorSecondary }"
      >
        正在载入配置…
      </div>
      <div v-else class="editor-wrapper flex-1 min-h-0 px-5 py-3">
        <HMonacoEditor
          :id="activeType"
          language="yaml"
          :value="activeContent"
          @update:value="setActiveContent"
          @on-save="save"
        />
      </div>
      <div class="px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div class="text-xs" :style="{ color: vars.textColorSecondary }">
          {{ activeTitle }} · Ctrl/Cmd + S 保存
        </div>
        <HButton :disabled="loading || saving" @click="save">
          {{ saving ? "保存中…" : "保存" }}
        </HButton>
      </div>
    </div>
  </HBaseModal>
</template>
<style scoped lang="less">
.theme-config-modal {
  width: min(1000px, 92vw);
  height: min(760px, 88vh);
}

.tabs {
  border-bottom: 1px solid;
}

.tab {
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  outline: none;
}

.tab.active {
  border-bottom-color: v-bind("vars.colorPrimary");
}

.editor-wrapper,
.config-loading {
  min-height: 0;
}

.editor-wrapper :deep(.h-monaco-editor) {
  height: 100%;
}
</style>
