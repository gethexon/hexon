<script lang="ts" setup>

import { computed, onMounted, ref } from "vue"
import { HInput, HInputRef } from "@/ui/input"
import { HButton } from "@/ui/button"
import { HCheckbox } from "@/ui/checkbox"
import HDateEditor from "@/editors/HDateEditor.vue"
import dayjs, { Dayjs } from "dayjs"
import { DATE_FORMAT } from "~/constants"
import { useThemeVars } from "@/ui/theme"
import { HTextarea } from "@/ui/textarea"
import { IRSaysListData } from "@/says/interface"
import RSaysLongEditModal from "@/modals/RSayLongEditModal.vue"
import { HIcon, HIconName } from "@/ui/icon"

const props = defineProps<{
  type: string
  say?: IRSaysListData
}>()
const emits = defineEmits<{
  (e: "on-cancel"): void
  (
    e: "on-create",
    value: {
      content?: string
      date: string | null
      images?: string
      server?: string
      id?: number
      video?: string
      videoLink?: string
      link?: string
    }
  ): void
}>()
const vars = useThemeVars()
const content = ref("")
const pubDate = ref<string | null>(null)
const date = computed(() => {
  const res = dayjs(pubDate.value)
  if (res.format("") === "Invalid Date") return null
  return res
})
const musicServer = ref("")
const netease = computed(() => musicServer.value === "netease")
const tencent = computed(() => musicServer.value === "tencent")
const musicId = ref("")
const videoType = ref("")
const player = computed(() => videoType.value === "player")
const bilibili = computed(() => videoType.value === "bilibili")
const videoLink = ref("")
const link = ref("")
const images = ref("")
const isOverflow = computed(()=>{
  let len=images.value?.split('\n').length
  return typeof len !== 'undefined' && len > 1;
})
const disabled = computed(() => !pubDate.value)
const width = "40px"

const init = () =>{
  if(props.say){
    content.value=props.say.content || ""
    pubDate.value=dayjs(props.say.date).format(DATE_FORMAT) || null
    musicServer.value=props.say.aplayer?.server || ""
    musicId.value=props.say.aplayer?.id.toString() || ""
    if(props.say.video?.player){
      videoType.value="player"
      videoLink.value=props.say.video.player
    }
    else if(props.say.video?.bilibili){
      videoType.value="bilibili"
      videoLink.value=props.say.video.bilibili
    }
    link.value=props.say.link || ""
    images.value=props.say.image?.join("\n") || ""
  }
}

const onCreate = () => {
  if (!pubDate.value) return
  emits("on-create", {
    content: content?.value,
    date: pubDate.value,
    images: images?.value,
    server: musicServer?.value,
    id: Number(musicId?.value),
    video: videoType?.value,
    videoLink: videoLink?.value,
    link: link?.value
  })
}

const updateDate = (date: Dayjs) => {
  pubDate.value = date?.format(DATE_FORMAT)
}

const onCancel = () => {
  emits("on-cancel")
}
const typeText = computed(() => {
  if (props.type === "add") return "记录"
  return "修改"
})
const contentInputRef = ref<HInputRef | null>(null)
onMounted(() => {
  init()
  contentInputRef.value?.focus()
})

const modalVisible = ref(false)
const onClose = () => {
  modalVisible.value = false
}
const longEditType=ref('')
const onLongEdit = (type: string) => {
  longEditType.value = type
  modalVisible.value = true
}
const onConfirmLongEdit=(value: {
  content?: string
  images?: string
})=>{
  console.log(value)
  if(value.content){
    content.value=value.content
  }
  if(value.images) {
    images.value = value.images
  }
}
</script>

<template>
  <div class="h-create-article-form w-120 select-none">
    <h2 class="mt-2 mb-8 text-xl font-bold text-center">{{ typeText }}此刻想法</h2>
    <form @submit.prevent="onCreate">
      <div
        class="grid gap-4 grid-rows-1"
        style="grid-template-columns: [labels] auto [controls] 1fr [button] 0.1fr"
      >
        <div
          :style="{ width }"
          class="label text-right"
          style="grid-column: labels"
        >
          内容
        </div>
        <div style="grid-column: controls" class="overflow-auto h-12">
          <HTextarea
            v-model:value="content"
            :error="''"
          />
        </div>
        <div style="grid-column: button">
          <HButton attr-type="button" round @click="onLongEdit('content')">
            <HIcon :name="HIconName.Add" />
          </HButton>
        </div>

      </div>

      <div
        class="grid gap-4 grid-rows-1 mt-2"
        style="grid-template-columns: [labels] auto [controls] 1fr"
      >
        <div
          :style="{ width }"
          class="label text-right"
          style="grid-column: labels"
        >
          时间
        </div>
        <div class="side h-full flex flex-col">
          <div>
            <HDateEditor :date="date" @update:date="updateDate" />
          </div>
        </div>
      </div>

      <div
        class="grid gap-4 grid-rows-1 mt-4"
        style="grid-template-columns: [labels] auto [controls] 1fr [button] 0.1fr"
      >
        <div
          :style="{ width }"
          class="label text-right"
          style="grid-column: labels"
        >
          图像
        </div>
        <div style="grid-column: controls" :class="isOverflow?'overflow-auto h-12':''">
          <HTextarea
            v-model:value="images"
            :error="''"
            placeholder="图像地址（换行隔开）"
          />
        </div>
        <div style="grid-column: button">
          <HButton attr-type="button" round @click="onLongEdit('images')">
            <HIcon :name="HIconName.Add" />
          </HButton>
        </div>
      </div>

      <div
        class="grid gap-4 grid-rows-1 mt-3"
        style="grid-template-columns: [labels] auto [controls] 1fr"
      >
        <div
          :style="{ width }"
          class="label text-right"
          style="grid-column: labels"
        >
          音乐
        </div>
        <div class="pl-2 flex justify-between" style="grid-column: controls">
          <div>
            <HCheckbox
              :checked="netease"
              class="mr-4"
              @update:checked="(v) => (v ? (musicServer = 'netease') : (musicServer = ''))"
            >
              网易云音乐
            </HCheckbox>
            <HCheckbox
              :checked="tencent"
              class="mr-4"
              @update:checked="
                  (v) => (v ? (musicServer = 'tencent') : (musicServer = ''))
                "
            >
              QQ音乐
            </HCheckbox>
          </div>
        </div>
        <div class="pl-2" style="grid-column: controls">
          <HInput
            v-model="musicId"
            :error="''"
            placeholder="歌曲id"
            type="primary"
          />
        </div>
      </div>

      <div
        class="grid gap-4 grid-rows-1"
        style="grid-template-columns: [labels] auto [controls] 1fr"
      >
        <div
          :style="{ width }"
          class="label text-right"
          style="grid-column: labels"
        >
          视频
        </div>
        <div class="pl-2 flex justify-between" style="grid-column: controls">
          <div>
            <HCheckbox
              :checked="player"
              class="mr-4"
              @update:checked="(v) => (v ? (videoType = 'player') : (videoType = ''))"
            >
              直链视频
            </HCheckbox>
            <HCheckbox
              :checked="bilibili"
              class="mr-4"
              @update:checked="
                  (v) => (v ? (videoType = 'bilibili') : (videoType = ''))
                "
            >
              哔哩哔哩
            </HCheckbox>
          </div>
        </div>
        <div class="pl-2" style="grid-column: controls">
          <HTextarea
            v-model:value="videoLink"
            :error="''"
            :placeholder="videoType==='bilibili'?'bv号':'视频直链'"
          />
        </div>
      </div>

      <div
        class="grid gap-4 grid-rows-1 mt-4"
        style="grid-template-columns: [labels] auto [controls] 1fr"
      >
        <div
          :style="{ width }"
          class="label text-right"
          style="grid-column: labels"
        >
          链接
        </div>
        <div class="pl-2" style="grid-column: controls">
          <HTextarea
            v-model:value="link"
            :error="''"
            placeholder="链接地址"
          />
        </div>
      </div>

      <div class="flex justify-end mt-6">
        <HButton
          attr-type="button"
          class="mr-2"
          inverted
          size="small"
          type="common"
          @click="onCancel"
        >
          取消
        </HButton>
        <HButton :disabled="disabled" attr-type="submit" size="small">
          确认
        </HButton>
      </div>
    </form>
  </div>
  <RSaysLongEditModal v-if="modalVisible" :close="onClose" @on-long-edit="onConfirmLongEdit"
                      :say="props.say" :type="longEditType" :visible="modalVisible"
                      class="overflow-auto"/>
</template>

<style lang="less" scoped>
.h-create-article-form {
  .label {
    line-height: 30px;
  }
}
</style>