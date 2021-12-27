<script setup lang="ts">
import { computed } from "@vue/reactivity"
import ClassProvider from "~/ClassProvider.vue"
import { Notifications } from "~/lib/notification"
import HNotificationItem from "@/HNotificationItem.vue"
import { transformType } from "~/utils"
import { DialogContainer } from "~/lib/dialog"
import HDialog from "~/components/others/HDialog.vue"

const styles = computed(() => {
  return {
    width: "100vw",
    height: "100vh",
  }
})
</script>

<template>
  <div :style="styles">
    <ClassProvider>
      <router-view></router-view>
      <Notifications>
        <template #default="slotsProps">
          <HNotificationItem
            :class="slotsProps.class"
            :type="transformType(slotsProps.item.type)"
            :title="slotsProps.item.title"
            :desc="slotsProps.item.desc"
            :clickable="slotsProps.item.clickable"
            :closeable="slotsProps.item.permanent"
            @on-close="slotsProps.onClose"
            @on-click="slotsProps.item.onClick"
          />
        </template>
      </Notifications>
      <DialogContainer>
        <template #default="slotProps">
          <HDialog :data="slotProps.data" />
        </template>
      </DialogContainer>
    </ClassProvider>
  </div>
</template>

<style lang="less">
@import "~/styles/index.less";
.demo-content > h1 {
  @apply my-6 text-2xl font-bold;
}
.demo-content > h2 {
  @apply my-4 text-lg font-bold;
}
</style>
