<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import dayjs, { Dayjs } from "dayjs"
import { PostOrPage } from "~/interface"
import { useDetailStore } from "~/store/detail"
import { useDispatcher } from "~/store/dispatcher"
import { useMainStore } from "~/store/main"
import { noop, useAsyncComponentWithLoading } from "~/utils"
import { parseHfm, updateStringByObj } from "~/utils/hfm"
import HDateEditor from "~/components/editors/HDateEditor.vue"
import { HEditorToolbarActionPayload } from "@/types"
import { HButton } from "@/ui/button"
import { HIcon, HIconName } from "@/ui/icon"
import { HLoading } from "@/ui/loading"
import { useThemeVars } from "@/ui/theme"
import HEditorToolbar from "@/HEditorToolbar.vue"
import HToolbar from "@/HToolbar.vue"
import HCategoriesEditor from "@/editors/HCategoriesEditor.vue"
import HHeaderEditor from "@/editors/HHeaderEditor.vue"
import HLayoutEditor from "@/editors/HLayoutEditor.vue"
import HTagEditor from "@/editors/HTagEditor.vue"
import HNavTitle from "@/ui/nav-list/src/HNavTitle.vue"
import ErroredView from "./ErroredView.vue"

const [HMonacoEditor, monacoLoading] = useAsyncComponentWithLoading(
  () => import("@/editors/HMonacoEditor.vue")
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
      dispatcher.saveArticle(internal_raw.value).then(setUnchanged, noop)
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
const content = computed(() => data.value._content)
const title = computed(() => data.value.title)
const layout = computed(() => data.value.layout)
const tags = computed(() => data.value.tags)
const categories = computed(() => data.value.categories)
const date = computed(() => {
  const res = dayjs(data.value.date)
  if (res.format("") === "Invalid Date") return null
  return res
})
const updated = computed(() => {
  const res = dayjs(data.value.updated)
  if (res.format("") === "Invalid Date") return null
  return res
})
const availableTags = computed(() => mainStore.tagNamesList)
const availableCats = computed(() => mainStore.catNamesList)
//#endregion

//#region update
const changed = ref(false)
const setChanged = () => (changed.value = true)
const setUnchanged = () => (changed.value = false)
const updateFromObj = (obj: any) => {
  internal_raw.value = updateStringByObj(internal_raw.value, obj)
  setChanged()
}
const updateTitle = (title: string = "") => {
  updateFromObj({ title })
}
const updateContent = (_content: string) => {
  updateFromObj({ _content })
}
const updateTags = (tags: string[] = []) => {
  updateFromObj({ tags })
}
const updateCategories = (categories: string[] = []) => {
  updateFromObj({ categories })
}
const updateLayout = (layout: string = "") => {
  updateFromObj({ layout })
}
const updateDate = (date: Dayjs | null) => {
  updateFromObj({ date: date?.format("YYYY-MM-DD hh:mm:ss") })
}
const updateUpdated = (updated: Dayjs | null) => {
  updateFromObj({ updated: updated?.format("YYYY-MM-DD hh:mm:ss") })
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
    <div class="flex h-full w-full overflow-hidden" v-else>
      <div class="main bg-base-1 flex-1 min-w-0 flex flex-col h-full">
        <HEditorToolbar
          :saving="detailStore.saving"
          :changed="changed"
          @on-action="onAction"
        />
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
        <div class="flex-1 h-0 overflow-auto pt-2 pb-4">
          <HNavTitle>
            <HIcon :name="HIconName.Globe" class="mr-1" />
            发布于
          </HNavTitle>
          <HDateEditor :date="date" @update:date="updateDate" />
          <HNavTitle class="mt-2">
            <HIcon :name="HIconName.DevUpdate" class="mr-1" />
            更新于
          </HNavTitle>
          <HDateEditor :date="updated" @update:date="updateUpdated" />
          <HNavTitle class="mt-2">
            <HIcon :name="HIconName.Tag" class="mr-1" />
            标签
          </HNavTitle>
          <HTagEditor
            :available-tags="availableTags"
            :tags="tags"
            @update:tags="updateTags"
          />
          <HNavTitle class="mt-2">
            <HIcon :name="HIconName.Folder" class="mr-2" />
            分类
          </HNavTitle>
          <HCategoriesEditor
            :availableCats="availableCats"
            :categories="categories"
            @update:categories="updateCategories"
          />
          <HNavTitle class="mt-2">
            <HIcon :name="HIconName.Type" class="mr-2" />
            Layout
          </HNavTitle>
          <HLayoutEditor :layout="layout" @update:layout="updateLayout" />
        </div>
      </div>
    </div>
  </HLoading>
</template>
