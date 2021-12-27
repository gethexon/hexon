<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { stringify } from "hexo-front-matter"
import { useNotification } from "~/lib/notification"
import { useMainStore } from "~/store/main"
import { useDetailStore } from "~/store/detail"
import { parseHfm } from "~/utils/hfm"
import { HButton } from "@/ui/button"
import { HLoading } from "@/ui/loading"
import HHeaderEditor from "@/Editors/HHeaderEditor.vue"
import HEditorToolbar from "@/HEditorToolbar.vue"
import { HEditorToolbarActionPayload } from "@/types"
import ErroredView from "./ErroredView.vue"
import { useAsyncComponentWithLoading } from "~/utils"

const [HMonacoEditor, monacoLoading] = useAsyncComponentWithLoading(
  () => import("@/Editors/HMonacoEditor.vue")
)

//#region hooks
const route = useRoute()
const router = useRouter()
const notification = useNotification()
const mainStore = useMainStore()
const detailStore = useDetailStore()
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
      detailStore.saveArticle(internal_raw.value).then(
        () => {
          notification.notify({
            title: "保存成功",
            type: "success",
          })
          loadBlogData(true)
          load()
        },
        (err) => {
          notification.notify({
            title: "文章保存失败",
            desc: (err as Error).message,
            type: "error",
            duration: 5000,
          })
        }
      )
      break
    default:
      break
  }
}
//#endregion

//#region data
function loadBlogData(refresh: boolean = false) {
  mainStore.getBlogData().catch((err) => {
    notification.notify({
      title: `博客数据${refresh ? "刷新" : "载入"}失败`,
      desc: (err as Error).message,
      type: "error",
      permanent: true,
      // TODO 支持 action
    })
  })
}
function load() {
  const type = route.params.type as string
  const source = route.params.source as string
  if (type === "post" || type === "page") {
    detailStore.getArticle(type, source).catch((err) => {
      if (err?.response?.status === 404) {
        router.push("/")
      } else {
        notification.notify({
          title: "文章载入失败",
          desc: (err as Error).message,
          type: "error",
          duration: 5000,
        })
      }
    })
  }
}
watch(
  () => route.fullPath,
  () => {
    if (route.name !== "edit") return
    load()
    loadBlogData()
  },
  {
    immediate: true,
  }
)
const raw = computed(() => detailStore.article?.raw ?? "")
const internal_raw = ref("")
watch(
  () => raw.value,
  (v) => (internal_raw.value = v),
  {
    immediate: true,
  }
)
const data = computed(() => {
  const { _content, title = detailStore.article?.title } = parseHfm(
    internal_raw.value
  )
  return { _content, title }
})
const title = computed(() => (data.value.title as string | undefined) ?? "")
const content = computed(() => data.value._content)
//#endregion

//#region update
const updateFromObj = (obj: any) => {
  internal_raw.value = stringify({ ...parseHfm(internal_raw.value), ...obj })
}
const updateTitle = (title: string = "") => {
  updateFromObj({ title })
}
const updateContent = (_content: string = "") => {
  updateFromObj({ _content })
}
//#endregion
</script>
<template>
  <HLoading :loading="detailStore.loading">
    <ErroredView v-if="detailStore.error">
      <div>
        <HButton inverted @click="onHome"> 回主页 </HButton>
        <HButton class="ml-2" @click="load"> 重试 </HButton>
      </div>
    </ErroredView>
    <div class="flex h-full w-full" v-else>
      <div class="main bg-base-1 flex-1 min-w-0 flex flex-col h-full">
        <HEditorToolbar @on-action="onAction" />
        <div class="flex flex-col flex-1 w-full min-h-0 max-w-2xl mx-auto">
          <HHeaderEditor :value="title" @update:value="updateTitle" />
          <div class="flex-1 w-full relative">
            <HLoading :loading="monacoLoading" overlay>
              <HMonacoEditor
                class="h-full w-full"
                id="default"
                :value="content"
                @update:value="updateContent"
              />
            </HLoading>
          </div>
        </div>
      </div>
      <div class="side bg-base-3 w-72 h-full"></div>
    </div>
  </HLoading>
</template>
