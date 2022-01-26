<script setup lang="ts">
import { onClickOutside } from "@vueuse/core"
import { StyleValue, computed, ref, Ref } from "vue"
import { createClassNames } from "~/utils/create-classnames"
import { useOnParentScroll } from "~/utils/scroll"
import { HBadge } from "@/ui/badge"
import { HDivider } from "@/ui/divider"
import { HIcon, HIconName } from "@/ui/icon"
import { useThemeVars } from "@/ui/theme"
import { IHArticleListData, IHArticleMenuActionType } from "./interface"
import FadeTransition from "../transitions/FadeTransition.vue"
import { HButton } from "@/ui/button"
import { useDispatcher } from "~/store/dispatcher"
import { Dayjs } from "dayjs"
import { DATE_FORMAT } from "~/constants"
import { isDraft, isPage } from "~/utils/article"

const dispatcher = useDispatcher()
const props = defineProps<{
  position: {
    x: number
    y: number
  }
  show: boolean
  article: IHArticleListData | null
}>()
const emtis = defineEmits<{
  (e: "update:show", v: boolean): void
}>()
const containerRef: Ref<HTMLElement | null> = ref(null)
const anchorRef: Ref<HTMLElement | null> = ref(null)
onClickOutside(containerRef, () => {
  emtis("update:show", false)
})
useOnParentScroll(anchorRef, () => {
  emtis("update:show", false)
})
const vars = useThemeVars()
const containerStyle = computed<StyleValue>(() => ({
  top: `${props.position.y}px`,
  left: `${props.position.x}px`,
  backgroundColor: vars.value.backgroundColorPrimary,
}))
const { classNames } = createClassNames("h-article-menu")
const onAction = (type: IHArticleMenuActionType) => {
  emtis("update:show", false)
  switch (type) {
    case "edit":
      dispatcher.editArticle({
        type: props.article!.type,
        source: props.article!.source,
      })
      break
    case "delete":
      dispatcher.deleteArticle({
        type: props.article!.type,
        source: props.article!.source,
      })
      break
    case "publish":
      dispatcher.publishArticle(props.article!.source)
      break
    default:
      break
  }
}
const dateToString = (date: Dayjs | null) => {
  return date ? date.format(DATE_FORMAT) : ""
}
</script>
<template>
  <div class="hidden" ref="anchorRef"></div>
  <Teleport to="body">
    <FadeTransition>
      <div
        ref="containerRef"
        class="w-60 fixed rounded-md shadow p-2"
        :class="classNames"
        :style="containerStyle"
        v-if="show && props.article"
        @contextmenu.prevent
      >
        <div class="flex justify-start">
          <HButton
            class="mr-1"
            inverted
            size="small"
            round
            @click="onAction('edit')"
          >
            <HIcon :name="HIconName.Edit" />
          </HButton>
          <HButton
            class="mr-1"
            type="error"
            inverted
            size="small"
            round
            @click="onAction('delete')"
          >
            <HIcon :name="HIconName.Delete" />
          </HButton>
          <HButton
            class="mr-1"
            type="success"
            inverted
            size="small"
            round
            v-if="article!.isDraft"
            @click="onAction('publish')"
          >
            <HIcon :name="HIconName.Upload" />
          </HButton>
        </div>
        <HDivider class="mt-1 mb-2" />
        <div
          class="title mt-2 mb-4 px-1"
          :style="{ color: vars.textColorPrimary }"
        >
          <HIcon
            class="mr-2"
            :name="HIconName.Page"
            :style="{ color: vars.colorPage }"
            v-if="article!.type==='page'"
          />
          <HIcon
            class="mr-2"
            :name="HIconName.Read"
            :style="{ color: vars.colorDraft }"
            v-if="article!.isDraft"
          />
          <span class="font-bold">
            {{ article!.title }}
          </span>
        </div>
        <div class="mb-2">
          <div class="text-sm">
            {{`发布于 ${dateToString(article!.date)}`}}
          </div>
          <div class="text-sm">
            {{`更新于 ${dateToString(article!.updated)}`}}
          </div>
        </div>
        <template v-if="article!.categories?.length">
          <HDivider class="my-2" />
          <div class="text-sm">
            <template v-for="(item, idx) in article!.categories">
              <HIcon class="mb-0.5" :name="HIconName.ChevronRight" v-if="idx" />
              <HBadge class="mb-0.5" rounded>
                {{ item }}
              </HBadge>
            </template>
          </div>
        </template>
        <template v-if="article!.tags?.length">
          <HDivider class="my-2" />
          <div class="text-sm">
            <HBadge class="mr-1" v-for="tag in article!.tags">
              {{ tag }}
            </HBadge>
          </div>
        </template>
      </div>
    </FadeTransition>
  </Teleport>
</template>
<style lang="less"></style>
