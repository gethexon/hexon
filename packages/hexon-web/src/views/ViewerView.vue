<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue"
import { useRoute } from "vue-router"
import { useDetailStore } from "~/store/detail"
import { HButton } from "@/ui/button"
import { HLoading } from "@/ui/loading"
import HViewerToolbar from "@/HViewerToolbar.vue"
import HViewerContent from "@/HViewerContent.vue"
import HViewerHeader from "@/HViewerHeader.vue"
import { HViewerToolbarActionPayload } from "@/types"
import ErroredView from "./ErroredView.vue"
import { useDispatcher } from "~/store/dispatcher"
import { PostOrPage } from "~/interface"

//#region hooks
const route = useRoute()
const dispatcher = useDispatcher()
const detailStore = useDetailStore()
//#endregion

//#region data
function load() {
  const type = route.params.type as string
  const source = route.params.source as string
  if (type === "post" || type === "page") {
    dispatcher.getArticle({ type, source })
  } else {
    dispatcher.goHome()
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
onBeforeUnmount(() => {
  dispatcher.clearArticle()
})
//#endregion

//#region data
const content = computed(() => detailStore.article?.content || "")
const title = computed(() => detailStore.article?.title || "")
const raw = computed(() => detailStore.article?.raw || "")
//#endregion

//#region handlers
const onAction = (payload: HViewerToolbarActionPayload) => {
  const type = route.params.type as PostOrPage
  const source = route.params.source as string
  switch (payload.type) {
    case "code":
      break
    case "edit":
      dispatcher.editArticle({ type, source })
      break
    case "delete":
      dispatcher.deleteArticle({ type, source })
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
      <HButton @click="load">重试</HButton>
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
