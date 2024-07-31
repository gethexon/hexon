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

const modalVisible = ref(false)

const onAdd = () => {
  modalVisible.value = true
}

const onClose = () => {
  modalVisible.value = false
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
          <SaysListView />
        </div>
      </div>
      <RSaysModal v-if="modalVisible" :close="onClose" :visible="modalVisible" class="overflow-auto" type="add" />
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