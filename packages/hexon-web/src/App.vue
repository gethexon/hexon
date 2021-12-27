<script setup lang="ts">
import { computed } from "@vue/reactivity"
import { Notification } from "./lib/notification"
import ClassProvider from "./ClassProvider.vue"
import { useDark } from "@vueuse/core"
import { useThemeController } from "@winwin/vue-global-theming"
import { watch } from "vue"
import HNotificationItem from "@/HNotificationItem.vue"
import { transformType } from "./utils"
import { useRoute } from "vue-router"
import { DialogContainer } from "./lib/dialog"
import HDialog from "@/others/HDialog.vue"

const route = useRoute()
const styles = computed(() => {
  return {
    width: "100vw",
    height: "100vh",
  }
})
const isDarkRef = useDark()
const controller = useThemeController()!
watch(
  () => isDarkRef.value,
  (isDark) => {
    if (isDark) controller.changeTheme("dark")
    else controller.changeTheme("default")
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <div :style="styles">
    <ClassProvider>
      <router-view></router-view>
      <Notification>
        <template #default="slotsProps">
          <HNotificationItem
            :type="transformType(slotsProps.item.type)"
            :title="slotsProps.item.title"
            :desc="slotsProps.item.desc"
            :clickable="slotsProps.item.clickable"
            :closeable="slotsProps.item.permanent"
            @on-close="slotsProps.onClose"
            @on-click="slotsProps.item.onClick"
          />
        </template>
      </Notification>
      <DialogContainer>
        <template #default="slotProps">
          <HDialog :data="slotProps.data" />
        </template>
      </DialogContainer>
    </ClassProvider>
  </div>
</template>

<style lang="less">
@import "./styles/index.less";
</style>
