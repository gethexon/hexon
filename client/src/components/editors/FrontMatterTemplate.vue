<script setup lang="ts">
import { IFrontmatterTemplateItem } from "@server/server/types/api"
import { computed, onMounted, ref } from "vue"
import { listFrontmatterTemplate, setFrontmatterTemplate } from "~/api/template"
import { HButton } from "@/ui/button"
import { useThemeVars } from "@/ui/theme"
import { HVerticalCenter } from "@/ui/vertical-center"
import { HLoading } from "@/ui/loading"
import { HIcon, HIconName } from "@/ui/icon"
import HTitle from "@/HTitle.vue"
import { HModal } from "@/ui/modal"
import FrontMatterTemplateEdit from "./FrontMatterTemplateEdit.vue"
import { useNotification } from "~/lib/notification"
import { useDialog } from "~/lib/dialog"
const emits = defineEmits<{
  (e: "set-template", v: string): void
}>()
const notification = useNotification()
const dialog = useDialog()
const templates = ref<IFrontmatterTemplateItem[]>([])
const loading = ref(false)
const load = () => {
  loading.value = true
  listFrontmatterTemplate()
    .then(({ items }) => {
      templates.value = items
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(() => load())
const vars = useThemeVars()
const editing = ref(false)
const idx = ref(-1)
const onFinish = (v: string) => {
  editing.value = false
  templates.value[idx.value] = { data: v }
  save()
}
const save = () => {
  setFrontmatterTemplate(templates.value)
    .then(() => {
      notification.notify({
        type: "success",
        title: "保存預設成功",
      })
    })
    .catch((err) => {
      notification.notify({
        type: "error",
        title: "保存預設失敗",
        desc: err,
        actions: [
          {
            label: "重試",
            run: save,
          },
        ],
      })
    })
}
const value = computed(() => templates.value[idx.value])
const onEdit = (index: number) => {
  idx.value = index
  editing.value = true
}
const onCancel = () => {
  editing.value = false
  idx.value = -1
}
const onDelete = (idx: number) => {
  dialog.create({
    type: "error",
    title: "确认删除么？",
    actions: [
      {
        label: "删除",
        type: "error",
        run() {
          templates.value.splice(idx, 1)
          save()
        },
      },
    ],
  })
}
const onAdd = () => {
  templates.value.push({ data: "key: value" })
  onEdit(templates.value.length - 1)
}
</script>
<template>
  <div
    :style="{ backgroundColor: vars.backgroundColorPrimary }"
    class="py-2 px-4 rounded-md modal-panel flex flex-col"
  >
    <HTitle class="justify-center">
      使用 frontmatter 预设
      <HVerticalCenter>
        <HButton @click="load" size="small">刷新</HButton>
      </HVerticalCenter>
    </HTitle>
    <div class="mt-2 flex-1 overflow-auto relative">
      <HLoading :loading="loading">
        <div class="mb-2 flex items-center" v-for="(item, idx) in templates">
          <div
            class="item rounded-md p-2 mr-2 select-none cursor-pointer flex-1"
            @click="emits('set-template', item.data)"
          >
            <pre>{{ item.data }}</pre>
          </div>
          <HButton round inverted>
            <HIcon :name="HIconName.Edit" @click="onEdit(idx)" />
          </HButton>
          <HButton type="error" round inverted @click="onDelete(idx)">
            <HIcon :name="HIconName.Delete" />
          </HButton>
        </div>
      </HLoading>
      <HModal v-model:show="editing" persistent>
        <FrontMatterTemplateEdit
          :value="value"
          @finish="onFinish"
          @cancel="onCancel"
        />
      </HModal>
    </div>
    <div class="py-2">
      <HButton size="small" @click="onAdd">添加</HButton>
      <HButton class="ml-2" size="small" @click="save">保存</HButton>
    </div>
  </div>
</template>
<style lang="less" scoped>
.item {
  background-color: v-bind("vars.backgroundColorSelected");
  &:hover {
    background-color: v-bind("vars.backgroundColorHover");
  }
}
</style>
