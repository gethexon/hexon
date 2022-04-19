<script setup lang="ts">
import { computed, toRefs } from "vue"
import { HIconName } from "@/ui/icon"
import { HIcon } from "@/ui/icon"
import HToolbar from "./HToolbar.vue"
import { useThemeVars } from "./ui/theme"

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
const vars = useThemeVars()
</script>
<template>
  <HToolbar class="h-nav-setting px-4 cursor-pointer">
    <div
      class="avatar w-8 h-8 rounded-full text-xl flex items-center justify-center"
      :style="{
        background: vars.colorPrimary,
      }"
    >
      <span v-if="!icon && first" :style="{ color: vars.textColorWhite }">
        {{ first }}
      </span>
      <HIcon v-else :name="HIconName.Contact" />
    </div>
    <div class="flex-1 flex flex-col ml-2">
      <div class="name text-sm font-bold">
        {{ name || "未命名用户" }}
      </div>
      <div class="status text-xs">已登录</div>
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
  .status {
    color: v-bind("vars.textColorSecondary");
  }
  &:hover {
    background-color: v-bind("vars.backgroundColorHover");
  }
  &:active {
    background-color: v-bind("vars.backgroundColorActive");
  }
}
</style>
