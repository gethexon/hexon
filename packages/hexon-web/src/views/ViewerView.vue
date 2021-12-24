<script setup lang="ts">
import { computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useDetailStore } from "~/store/detail"
import notification from "~/notification"
import HViewerToolbar from "@/HViewerToolbar.vue"
import HViewerContent from "@/HViewerContent.vue"
import HViewerHeader from "@/HViewerHeader.vue"
import { HViewerToolbarActionPayload } from "@/types"
import ErroredView from "./ErroredView.vue"
import { HButton } from "~/components/ui/button"
import HLoading from "~/components/ui/loading/src/HLoading.vue"

//#region hooks
const route = useRoute()
const router = useRouter()
const detailStore = useDetailStore()
//#endregion

//#region data
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
    if (route.name !== "view") return
    load()
  },
  {
    immediate: true,
  }
)
//#endregion

//#region data
const content = computed(() => detailStore.article?.content || "")
const title = computed(() => detailStore.article?.title || "")
const raw = computed(() => detailStore.article?.raw || "")
//#endregion

//#region handlers
const onAction = (payload: HViewerToolbarActionPayload) => {
  switch (payload.type) {
    case "code":
      break
    case "edit":
      router.push({
        name: "edit",
        params: {
          source: route.params.source,
          type: route.params.type,
        },
      })
      break
    case "delete":
      break
    case "publish":
      break
    default:
      break
  }
}
//#endregion
</script>
<template>
  <HLoading :loading="detailStore.loading">
    <ErroredView v-if="detailStore.error">
      <HButton @click="load"> 重试 </HButton>
    </ErroredView>
    <div class="w-full h-full flex flex-col" v-else>
      <HViewerToolbar @on-action="onAction" />
      <div class="overflow-auto flex-1">
        <HViewerHeader :title="title" :raw="raw" />
        <HViewerContent :content="content" />
      </div>
    </div>
  </HLoading>
</template>
