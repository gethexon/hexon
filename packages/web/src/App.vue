<script setup lang="ts">
import { useDark } from "@vueuse/core"
import { onMounted, watch } from "vue"
import { useThemeController } from "@/ui/theme"
import HDialog from "@/others/HDialog.vue"
import HNotificationItem from "@/others/HNotificationItem.vue"
import HLoading from "@/ui/loading/src/HLoading.vue"
import { lightTheme, darkTheme } from "@/ui/theme"
import { DialogContainer } from "./lib/dialog"
import { useLoading } from "./lib/loading"
import { Notifications } from "./lib/notification"
import { useDispatcher } from "./store/dispatcher"
import { ModalContainer } from "./lib/modal"

const dispatcher = useDispatcher()
const loading = useLoading()
const isDarkRef = useDark()
const controller = useThemeController()!
watch(
  () => isDarkRef.value,
  (isDark) => {
    if (isDark) controller.setTheme(darkTheme)
    else controller.setTheme(lightTheme)
  },
  {
    immediate: true,
  }
)
onMounted(() => {
  dispatcher.init()
})
</script>

<template>
  <div style="width: 100vw; height: 100vh" @contextmenu.prevent>
    <HLoading :loading="loading.loading.value" overlay>
      <router-view></router-view>
      <ModalContainer />
      <DialogContainer>
        <template #default="slotProps">
          <HDialog :data="slotProps.data" />
        </template>
      </DialogContainer>
      <Notifications>
        <template #default="slotProps">
          <HNotificationItem :data="slotProps.item" />
        </template>
      </Notifications>
    </HLoading>
  </div>
</template>

<style lang="less">
@import "./styles/index.less";
</style>
