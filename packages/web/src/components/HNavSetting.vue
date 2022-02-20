<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { computed, toRefs } from "vue"
import { HTheme } from "~/themes"
import { HIconName } from "@/ui/icon"
import { HIcon } from "@/ui/icon"
import HToolbar from "./HToolbar.vue"

const props = withDefaults(
  defineProps<{
    name?: string
    icon?: boolean
  }>(),
  { name: "", icon: false }
)
const { name } = toRefs(props)
const first = computed(() => {
  return name.value?.[0]
})
const theme = useTheme<HTheme>()!
</script>
<template>
  <HToolbar class="h-nav-setting text-main px-4 cursor-pointer">
    <div
      class="avatar w-8 h-8 rounded-full text-xl flex items-center justify-center"
      :style="{
        background: theme.color.primary.n,
        color: theme.color.foreground.min,
      }"
    >
      <span v-if="!icon && first">{{ first }}</span>
      <HIcon v-else :name="HIconName.Contact" />
    </div>
    <div class="flex-1 flex flex-col ml-2">
      <div class="name text-sm font-bold">
        {{ name || "未命名用户" }}
      </div>
      <div class="text-xs text-sub">已登录</div>
    </div>
    <HIcon :name="HIconName.Settings" />
    <slot></slot>
  </HToolbar>
</template>
<style lang="less" scoped>
@import "~/styles/mixins.less";
.h-nav-setting {
  transition: background-color 0.2s;
  .name {
    .ellipsis(1);
  }
  &:hover {
    background-color: v-bind("theme.color.background.hover");
  }
  &:active {
    background-color: v-bind("theme.color.background.active");
  }
}
</style>
