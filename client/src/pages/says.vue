<script lang="ts" setup>
import { useDispatcher } from "~/store/dispatcher"
import HomeNavView from "~/views/HomeNavView.vue"
import { useThemeVars } from "@/ui/theme"
import { useLocalStorage } from "@vueuse/core"
import { MainPart, SidePart, SideSplit } from "@winwin/vue-side-split"
import { HButton } from "@/ui/button"
import { useArticleListStore } from "~/store/articleList"
import SaysListView from "~/views/SaysListView.vue"
import { ref } from "vue"
import RSaysModal from "@/modals/RSaysModal.vue"
import { IRSaysListData } from "@/says/interface"
import dayjs from "dayjs"
import RSayDeleteConfirmModal from "@/modals/RSayDeleteConfirmModal.vue"

//#region hooks
const dispatcher = useDispatcher()
const articleListStore = useArticleListStore()
//#endregion

const sep = useLocalStorage("index-sep", { nav: 200, list: 320 })

const vars = useThemeVars()
vars.value.backgroundColorTertiary

const goHome = () => {
  dispatcher.goHome()
  articleListStore.setFilter({ type: "all" })
}

const editModalVisible = ref(false)
const deleteModalVisible = ref(false)
const say = ref<IRSaysListData>({
  date: dayjs()
})
const type = ref("")
const onAdd = () => {
  editModalVisible.value = true
  type.value = "add"
  say.value = {
    date: dayjs()
  }
}

const onEditModalClose = () => {
  editModalVisible.value = false
}

const onDeleteModalClose = () => {
  deleteModalVisible.value = false
}

const handleEdit = (payload: { say: IRSaysListData }) => {
  editModalVisible.value = true
  type.value = "edit"
  say.value = payload.say
}

const handleDelete = (payload: { say: IRSaysListData }) => {
  deleteModalVisible.value = true
  say.value = payload.say
}
</script>

<template>
  <SideSplit class="index-page w-full h-full">
    <SidePart v-model="sep.nav" :max="300" :min="150">
      <HomeNavView />
    </SidePart>
    <MainPart type="main">
      <div class="home-list-view flex flex-col w-full h-full">
        <div class="flex justify-between">
          <HButton class="mt-2 ml-4 w-25" size="small" @click="goHome">返回首页</HButton>
          <button
            class="mt-2 mr-8 w-30 rounded-full bg-green-500 text-sm text-white shadow-lg transition-all duration-300 hover:bg-green-600"
            @click.stop="onAdd">
            记录此刻想法
          </button>
        </div>
        <div class="overflow-auto flex-1 mt-2">
          <SaysListView @on-edit="handleEdit" @on-delete="handleDelete" />
        </div>
      </div>
      <RSaysModal v-if="editModalVisible" :close="onEditModalClose" :say="say" :type="type" :visible="editModalVisible"
                  class="overflow-y-auto" />
      <RSayDeleteConfirmModal v-if="deleteModalVisible" :close="onDeleteModalClose" :say="say"
                              :visible="deleteModalVisible" />
    </MainPart>
  </SideSplit>
</template>

<style lang="less" scoped>
.home-list-view {
  background-color: v-bind("vars.backgroundColorSecondary");
}

.home-viewer-view {
  background-color: v-bind("vars.backgroundColorPrimary");
}
</style>

<route>
{
name: "says",
}
</route>