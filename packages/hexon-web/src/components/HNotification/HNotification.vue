<script setup lang="ts">
import { computed } from "vue-demi"
import { useNotification } from "~/lib/notification"
import { INotificationType } from "~/lib/notification/types"
import HNotificationItem from "./HNotificationItem.vue"
const props = withDefaults(
  defineProps<{
    zIndex?: number
    type?: "absolute" | "fixed"
  }>(),
  { type: "fixed" }
)
const notification = useNotification()
const transformType = (type: INotificationType) => {
  if (type === "info") return "primary"
  return type
}
const list = computed(() =>
  notification.notificationList.value.filter((item) => item.show)
)
const position = computed(() => notification.position.value)
const close = (id: string) => notification.close(id)
</script>
<template>
  <div
    class="h-notification flex"
    :class="[type, position]"
    :style="{ zIndex: zIndex }"
  >
    <transition-group name="list-complete">
      <HNotificationItem
        class="list-complete-item"
        v-for="item in list"
        :key="item.id"
        :type="transformType(item.type)"
        :title="item.title"
        :desc="item.desc"
        :clickable="item.clickable"
        :closeable="item.permanent"
        @on-close="close(item.id)"
        @on-click="item.onClick"
      />
    </transition-group>
  </div>
</template>
<style lang="less" scoped>
.top-left {
  top: 8px;
  left: 8px;
  @apply flex-col-reverse items-start justify-end;
  & > * {
    @apply mb-2;
  }
}
.top {
  top: 8px;
  left: 8px;
  right: 8px;
  @apply flex-col-reverse items-center justify-end;
  & > * {
    @apply mb-2;
  }
}
.top-right {
  top: 8px;
  right: 8px;
  @apply flex-col-reverse items-end justify-end;
  & > * {
    @apply mb-2;
  }
}
.bottom-left {
  bottom: 8px;
  left: 8px;
  @apply flex-col items-start justify-end;

  & > * {
    @apply mt-2;
  }
}
.bottom {
  bottom: 8px;
  left: 8px;
  right: 8px;
  @apply flex-col items-center justify-end;

  & > * {
    @apply mt-2;
  }
}
.bottom-right {
  bottom: 8px;
  right: 8px;
  @apply flex-col items-end justify-end;

  & > * {
    @apply mt-2;
  }
}
</style>
<style>
.list-complete-item {
  transition: all 0.5s ease;
}

.list-complete-enter-from,
.list-complete-leave-to {
  opacity: 0;
}
</style>
