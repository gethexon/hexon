<script setup lang="ts">
import { computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useDetailStore } from "~/store/detail"
import { noop } from "~/utils"
import { IArticleIdentifier } from "~/types"
import HViewerToolbar from "@/HViewerToolbar.vue"
import HViewerContent from "@/HViewerContent.vue"
import HViewerHeader from "@/HViewerHeader.vue"
import { HViewerToolbarActionPayload } from "@/types"
import ErroredView from "./ErroredView.vue"

//#region hooks
const route = useRoute()
const router = useRouter()
const detailStore = useDetailStore()
//#endregion

//#region actions
watch(
  () => [route.params.type, route.params.source],
  async ([type, source]) => {
    if (route.name !== "view") {
      if (route.name !== "edit") detailStore.clearArticle()
      return
    }
    await detailStore
      .viewArticle({ source, type } as IArticleIdentifier)
      .catch(noop)
  },
  { immediate: true }
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
  <ErroredView v-if="detailStore.errored" />
  <div class="w-full h-full flex flex-col" v-else>
    <HViewerToolbar @on-action="onAction" />
    <div class="overflow-auto flex-1">
      <HViewerHeader :title="title" :raw="raw" />
      <HViewerContent :content="content" />
    </div>
  </div>
</template>
