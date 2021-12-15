<script setup lang="ts">
import { computed, defineAsyncComponent, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { parse, stringify } from "hexo-front-matter"
import { useTheme } from "@winwin/vue-global-theming"
import { useDetailStore } from "~/store/detail"
import { IArticleIdentifier } from "~/types"
import { HTheme } from "~/themes"
import { parseHfm } from "~/utils/hfm"
import { useNotification } from "~/lib/notification"
import { noop } from "~/utils"
import { HButton } from "@/ui/button"
import HHeaderEditor from "@/Editors/HHeaderEditor.vue"
import HEditorToolbar from "@/HEditorToolbar.vue"
import { HEditorToolbarActionPayload } from "@/types"
import ErroredView from "./ErroredView.vue"
const HMonacoEditor = defineAsyncComponent(
  () => import("@/Editors/HMonacoEditor.vue")
)

//#region hooks
const route = useRoute()
const router = useRouter()
const detailStore = useDetailStore()
const notification = useNotification()
//#endregion

//#region actions
watch(
  () => [route.params.type, route.params.source],
  async ([type, source]) => {
    if (route.name !== "edit") {
      if (route.name !== "view") detailStore.clearArticle()
      return
    }
    await detailStore
      .editArticle({ source, type } as IArticleIdentifier)
      .catch(noop)
  },
  { immediate: true }
)
//#endregion

//#region data
const data = computed(() => {
  const { _content, title = detailStore.article?.title } = parseHfm(
    detailStore.tmp
  )
  return { _content, title }
})
const header = computed(() => (data.value.title as string | undefined) ?? "")
const getUpdatedFromObj = (obj: any) =>
  stringify({ ...parse(detailStore.tmp), ...obj })
const onHeader = (title: string) => {
  detailStore.updateArticle(getUpdatedFromObj({ title }))
}
const content = computed(() => data.value._content)
const onContent = (_content: string) => {
  detailStore.updateArticle(getUpdatedFromObj({ _content }))
}
const identifier = computed(() => detailStore.identifier)
//#endregion

//#region style
const theme = useTheme<HTheme>()!
//#endregion

//#region handlers
const onHome = () => {
  router.push("/")
}
const onAction = (payload: HEditorToolbarActionPayload) => {
  switch (payload.type) {
    case "back":
      router.push({
        name: "view",
        params: {
          source: route.params.source,
          type: route.params.type,
        },
      })
      break
    case "save":
      detailStore.saveArticle().then(() => {
        notification.notify({
          title: "保存成功",
          type: "success",
        })
      })
      break
    default:
      break
  }
}
//#endregion
</script>
<template>
  <ErroredView v-if="detailStore.errored">
    <HButton type="error" inverted @click="onHome">
      出错了，单机回到主页
    </HButton>
  </ErroredView>
  <div class="flex h-full w-full" v-else>
    <div class="main bg-base1 flex-1 min-w-0 flex flex-col h-full">
      <HEditorToolbar @on-action="onAction" />
      <div class="flex flex-col flex-1 w-full min-h-0 max-w-2xl mx-auto">
        <HHeaderEditor :value="header" @update:value="onHeader" />
        <HMonacoEditor
          class="flex-1 w-full"
          :id="identifier"
          :value="content"
          @update:value="onContent"
        />
      </div>
    </div>
    <div class="side bg-base3 w-72 h-full"></div>
  </div>
</template>
