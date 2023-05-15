<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue"
import { PostOrPage } from "~/interface"
import { useDetailStore } from "~/store/detail"
import { useDispatcher } from "~/store/dispatcher"
import { parseArticleData } from "~/utils/article"
import HViewerContent from "~/components/viewer/HViewerContent.vue"
import HViewerHeader from "~/components/viewer/HViewerHeader.vue"
import HViewerToolbar from "~/components/viewer/HViewerToolbar.vue"
import { HViewerToolbarActionPayload } from "@/types"
import { HButton } from "@/ui/button"
import { HLoading } from "@/ui/loading"
import ErroredView from "~/views/ErroredView.vue"

//#region hooks
const dispatcher = useDispatcher()
const detailStore = useDetailStore()
const props = defineProps<{
  type: PostOrPage
  source: string
}>()
//#endregion

//#region data
function load() {
  const { type, source } = props
  if (type === "post" || type === "page") {
    dispatcher.getArticle({ type, source })
  } else {
    dispatcher.goHome()
  }
}
watch(
  () => [props.type, props.source],
  () => {
    load()
  },
  {
    deep: true,
    immediate: true,
  }
)
onBeforeUnmount(() => {
  dispatcher.clearArticle()
})
//#endregion

//#region data
const content = computed(() => detailStore.article?.content || "")
const article = computed(() => parseArticleData(detailStore.article))
//#endregion

//#region handlers
const onAction = (payload: HViewerToolbarActionPayload) => {
  const { type, source } = props
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
      dispatcher.publishArticle(source)
      break
    default:
      break
  }
}
//#endregion
</script>
<template>
  <HLoading :loading="detailStore.isLoading">
    <ErroredView v-if="detailStore.error">
      <HButton @click="load">重試</HButton>
    </ErroredView>
    <div class="w-full h-full flex flex-col" v-else>
      <HViewerToolbar @on-action="onAction" />
      <div class="overflow-auto flex-1">
        <HViewerHeader :article="article" />
        <HViewerContent :content="content" />
      </div>
    </div>
  </HLoading>
</template>
<route>
{
  name: "view",
}
</route>
