<script setup lang="ts">
import HToolbar from "~/components/HToolbar.vue"
import { useThemeVars } from "~/components/ui/theme"
import { HIcon, HIconName } from "@/ui/icon"
const vars = useThemeVars()
</script>
<template>
  <HToolbar class="signout-button cursor-pointer px-5">
    <span class="text-sm font-bold">退出登录</span>
    <div class="flex-1"></div>
    <HIcon :name="HIconName.PowerButton" />
  </HToolbar>
</template>
<style lang="less">
.signout-button {
  transition: background-color 0.2s;
  background-color: v-bind("vars.colorPrimary");
  color: v-bind("vars.colorWhite");
  &:hover {
    background-color: v-bind("vars.colorPrimaryHover");
  }
  &:active {
    background-color: v-bind("vars.colorPrimaryActive");
  }
}
</style>
