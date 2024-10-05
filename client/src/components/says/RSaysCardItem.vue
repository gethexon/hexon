<script lang="ts" setup>

import { IRSaysListData } from "@/says/interface"
import { computed, ref } from "vue"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import { useThemeVars } from "@/ui/theme"
import { LazyImg } from "vue-waterfall-plugin-next"
import RSaysAPlayer from "@/says/RSaysAPlayer.vue"
import RSaysBilibiliPlayer from "@/says/RSaysBilibiliPlayer.vue"
import RSaysModal from "@/modals/RSaysModal.vue"

dayjs.extend(customParseFormat)

const props = defineProps<{
  say: IRSaysListData
  index: number
}>()
const emits = defineEmits<{
  (e: "on-edit", payload: { say: IRSaysListData }): void
  (e: "on-delete", payload: { say: IRSaysListData }): void
}>()
const formatedDate = computed(() => {
  return dayjs(props.say.date, "YYYY-MM-DD H:mm").fromNow()
})
const vars = useThemeVars()
const styleVars = computed(() => {
  return {
    bgColor: vars.value.backgroundColorTransparent,
    hoverBgColor: vars.value.backgroundColorHover,
    activeBgColor: vars.value.backgroundColorActive,
    briefColor: vars.value.textColorSecondary
  }
})

const modalVisible = ref(false)
const onClose = () => {
  modalVisible.value = false
}

const handleEdit = (say: IRSaysListData) => {
  emits("on-edit", { say })
}

const handleDelete = (say: IRSaysListData) => {
  emits("on-delete", { say })
}
</script>

<template>
  <div
    class="h-article-item rounded-lg shadow-md overflow-auto transition-all duration-300 ease-linear hover:shadow-lg group">
    <div class="px-4 pt-2 pb-4 border-t border-t-gray-800">
      <div style="white-space: pre-wrap;" class="pb-4 pt-2 text-gray-50 group-hover:text-yellow-300 ml-1">
        {{ say.content }}
      </div>
      <div v-if="say.aplayer||say.image||say.video" class="pb-2">
        <LazyImg v-for="url in say.image" v-if="say.image" :key="url" :url="url"
                 class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105 mb-2" />
        <RSaysAPlayer v-if="say.aplayer" :id="say.aplayer.id" :server="say.aplayer.server" type="song" />
        <div v-if="say.video">
          <video v-if="say.video.player" :src="say.video.player" controls controlslist="nodownload" />
          <RSaysBilibiliPlayer v-if="say.video.bilibili" :bvid="say.video.bilibili" />
        </div>
      </div>
      <div class="pt-3 flex justify-between items-center border-t border-t-gray-600 border-opacity-50">
        <div class="text-gray-50 ml-1 text-sm">
          <div :style="{ color: vars.colorPrimary }" class="flex items-center">
            {{ formatedDate }}
            <div v-if="say.link" class="ml-4">
              <button
                class="px-3 h-7 rounded-full bg-gray-500 text-sm text-white shadow-lg transition-all duration-300 hover:bg-gray-600">
                <a :href="say.link" target="_blank">
                  链接
                </a>
              </button>
            </div>
          </div>
        </div>
        <div>
          <button
            class="px-3 h-7 rounded-full bg-blue-500 text-sm text-white shadow-lg transition-all duration-300 hover:bg-blue-600"
            @click.stop="handleEdit(say)">
            修改
          </button>
          <button
            class="px-3 ml-4 h-7 rounded-full bg-red-500 text-sm text-white shadow-lg transition-all duration-300 hover:bg-red-600"
            @click.stop="handleDelete(say)">
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
  <RSaysModal v-if="modalVisible" :close="onClose" :say="props.say" :visible="modalVisible" class="overflow-auto"
              type="add" />
</template>

<style lang="less" scoped>
@import "~/styles/mixins.less";

.h-article-item {
  transition: all 0.2s;
  background-color: v-bind("styleVars.activeBgColor");

  &:hover {
    background-color: v-bind("styleVars.hoverBgColor");
    cursor: pointer;
  }

  &:active {
    background-color: v-bind("styleVars.activeBgColor");
    cursor: pointer;
  }

  .title {
    .ellipsis(1);
  }

  .brief {
    color: v-bind("styleVars.briefColor");
    .ellipsis(3);
  }

  .date {
    .ellipsis(1);
  }
}
</style>