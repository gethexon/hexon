<script setup lang="ts">
import { computed } from "@vue/reactivity"
import ClassProvider from "~/ClassProvider.vue"
import { Notification } from "~/lib/notification"
import HNotificationItem from "~/components/HNotificationItem.vue"
import { transformType } from "~/utils"
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
      <Notification>
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
      </Notification>
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
