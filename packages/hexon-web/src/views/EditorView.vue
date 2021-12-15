<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { useDetailStore } from "~/store/detail"
import { IArticleIdentifier, Page, Post } from "~/types"
import ErroredView from "./ErroredView.vue"
import HHeaderEditor from "~/components/Editors/HHeaderEditor.vue"
import HMonacoEditor from "~/components/Editors/HMonacoEditor.vue"
import { useTheme } from "@winwin/vue-global-theming"
import { HTheme } from "~/themes"
import HEditorToolbar from "~/components/HEditorToolbar.vue"
import { HButton } from "~/components/ui/button"
import { HEditorToolbarActionPayload } from "~/components/types"
import router from "~/router"
import { parseHfm } from "~/utils/hfm"
import { parse, stringify } from "hexo-front-matter"
import { useNotification } from "~/lib/notification"

const route = useRoute()
const detailStore = useDetailStore()

onMounted(() => {
  const { type, source } = route.params
  detailStore.editArticle({ source, type } as IArticleIdentifier)
})

const data = computed(() => {
  const { _content, title = detailStore.article?.title } = parseHfm(
    detailStore.tmp
  )
  return { _content, title }
})

const header = computed(() => data.value.title)
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
const theme = useTheme<HTheme>()!
const styleVars = computed(() => ({
  bgColor: theme.value.color.background.base3,
}))
const onHome = () => {
  router.push("/")
}
const notification = useNotification()
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
</script>
<template>
  <ErroredView v-if="detailStore.errored">
    <HButton type="error" inverted @click="onHome">
      出错了，单机回到主页
    </HButton>
  </ErroredView>
  <div class="flex h-full w-full" v-else>
    <div class="flex-1 min-w-0 flex flex-col h-full">
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
    <div class="side w-72 h-full"></div>
  </div>
</template>
<style lang="less">
.side {
  background-color: v-bind("styleVars.bgColor");
}
</style>
