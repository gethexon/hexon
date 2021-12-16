<script setup lang="ts">
import { computed } from "vue-demi"
import { useNotification } from "."
const props = withDefaults(
  defineProps<{
    zIndex?: number
    type?: "absolute" | "fixed"
  }>(),
  { type: "fixed" }
)
const notification = useNotification()
const list = computed(() =>
  notification.notificationList.value.filter((item) => item.show)
)
const position = computed(() => notification.position.value)
const close = (id: string) => notification.close(id)
</script>
<template>
  <transition-group
    tag="div"
    class="h-notification flex"
    :class="[type, position]"
    :style="{ zIndex: zIndex }"
    name="notification"
  >
    <div v-for="item in list" :key="item.id">
      <slot
        :item="item"
        :onClose="() => close(item.id)"
        :class="'notification-item'"
      ></slot>
    </div>
  </transition-group>
</template>
<style lang="less" scoped>
.top-left {
  top: 8px;
  left: 8px;
  @apply flex-col-reverse items-start justify-end mb-2;
}
.top {
  top: 8px;
  left: 8px;
  right: 8px;
  @apply flex-col-reverse items-center justify-end mb-2;
}
.top-right {
  top: 8px;
  right: 8px;
  @apply flex-col-reverse items-end justify-end mb-2;
}
.bottom-left {
  bottom: 8px;
  left: 8px;
  @apply flex-col items-start justify-end mt-2;
}
.bottom {
  bottom: 8px;
  left: 8px;
  right: 8px;
  @apply flex-col items-center justify-end mt-2;
}
.bottom-right {
  bottom: 8px;
  right: 8px;
  @apply flex-col items-end justify-end mt-2;
}
</style>
<style>
.notification-move {
  transition: all 0.2s ease;
}
.notification-enter-active,
.notification-leave-active {
  transition: all 0.2s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
}
</style>
