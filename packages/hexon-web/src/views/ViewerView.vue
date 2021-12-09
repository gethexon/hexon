<script setup lang="ts">
import { computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useDetailStore } from "~/store/detail"
import HViewerToolbar from "~/components/HViewerToolbar.vue"
import HViewerContent from "~/components/HViewerContent.vue"
import HViewerHeader from "~/components/HViewerHeader.vue"
import { HViewerToolbarActionPayload } from "~/components/types"
import { noop } from "~/utils"
import { IArticleIdentifier } from "~/types"
import ErroredView from "./ErroredView.vue"

const route = useRoute()
const router = useRouter()
const detailStore = useDetailStore()
watch(
  () => (route.params.type as string) + (route.params.source as string),
  async () => {
    // 跳转其他路由的时候交给 beforeEach guard 这里只处理 view 内跳转
    if (route.name !== "view") return
    const { type, source } = route.params
    await detailStore
      .viewArticle({ source, type } as IArticleIdentifier)
      .catch(noop)
  },
  { immediate: true }
)
const content = computed(() => detailStore.article?.content || "")
const title = computed(() => detailStore.article?.title || "")
const raw = computed(() => detailStore.article?.raw || "")
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
