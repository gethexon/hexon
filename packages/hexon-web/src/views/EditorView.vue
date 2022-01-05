<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { stringify } from "hexo-front-matter"
import { useDetailStore } from "~/store/detail"
import { useDispatcher } from "~/store/dispatcher"
import { parseHfm, updateStringByObj } from "~/utils/hfm"
import { categories2Array2d, useAsyncComponentWithLoading } from "~/utils"
import { PostOrPage } from "~/interface"
import { HButton } from "@/ui/button"
import { HLoading } from "@/ui/loading"
import { useThemeVars } from "@/ui/theme"
import HHeaderEditor from "@/Editors/HHeaderEditor.vue"
import HTagEditor from "@/Editors/HTagEditor.vue"
import HToolbar from "@/HToolbar.vue"
import HEditorToolbar from "@/HEditorToolbar.vue"
import { HEditorToolbarActionPayload } from "@/types"
import ErroredView from "./ErroredView.vue"
import { useMainStore } from "~/store/main"
import HCategoriesEditor from "~/components/Editors/HCategoriesEditor.vue"

const [HMonacoEditor, monacoLoading] = useAsyncComponentWithLoading(
  () => import("@/Editors/HMonacoEditor.vue")
)

//#region hooks
const route = useRoute()
const router = useRouter()
const dispatcher = useDispatcher()
const detailStore = useDetailStore()
const mainStore = useMainStore()
//#endregion

//#region handlers
const onHome = () => {
  router.push("/")
}
const onAction = (payload: HEditorToolbarActionPayload) => {
  const type = route.params.type as PostOrPage
  const source = route.params.source as string
  switch (payload.type) {
    case "back":
      dispatcher.viewArticle({ type, source })
      break
    case "save":
      dispatcher.saveArticle(internal_raw.value)
      break
    case "delete":
      dispatcher.deleteArticle({ type, source })
      break
    default:
      break
  }
}
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
onBeforeUnmount(() => {
  dispatcher.clearArticle()
})
watch(
  () => route.fullPath,
  () => {
    if (route.name !== "edit") return
    load()
    dispatcher.loadBlogData()
  },
  {
    immediate: true,
  }
)
const raw = computed(() => detailStore.article?.raw ?? "")
const internal_raw = ref(raw.value)
watch(raw, (v) => (internal_raw.value = v))
const data = computed(() => parseHfm(internal_raw.value))
const title = computed(() => data.value.title)
const content = computed(() => data.value._content)
const tags = computed(() => data.value.tags)
const categories = computed(() => data.value.categories)
const availableTags = computed(() => mainStore.tagNamesList)
const availableCats = computed(() => mainStore.catNamesList)
//#endregion

//#region update

const updateFromObj = (obj: any) => {
  internal_raw.value = updateStringByObj(internal_raw.value, obj)
}
const updateTitle = (title: string = "") => {
  updateFromObj({ title })
}
const updateContent = (_content: string = "") => {
  updateFromObj({ _content })
}
const updateTags = (tags: string[] = []) => {
  updateFromObj({ tags })
}
const updateCategories = (categories: string[] = []) => {
  console.log("update categories:", categories)
  updateFromObj({ categories })
}
//#endregion

//#region style
const vars = useThemeVars()
//#endregion
</script>
<template>
  <HLoading :loading="detailStore.loading">
    <ErroredView v-if="detailStore.error">
      <div>
        <HButton inverted @click="onHome">回主页</HButton>
        <HButton class="ml-2" @click="load">重试</HButton>
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
      <div class="side bg-base-3 w-72 h-full flex flex-col">
        <HToolbar>
          <div
            class="px-5 text-xl"
            :style="{ color: vars.textColorPrimary }"
            style="letter-spacing: 0.05rem; font-weight: 600"
          >
            Frontmatters
          </div>
        </HToolbar>
        <div class="flex-1 h-0 overflow-auto">
          <HTagEditor
            :available-tags="availableTags"
            :tags="tags"
            @update:tags="updateTags"
          />
          <HCategoriesEditor
            :availableCats="availableCats"
            :categories="categories"
            @update:categories="updateCategories"
            class="mt-2"
          />
        </div>
      </div>
    </div>
  </HLoading>
</template>
