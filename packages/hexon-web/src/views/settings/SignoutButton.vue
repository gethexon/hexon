<script setup lang="ts">
import { HIcon, HIconName } from "@/ui/icon"
import { useThemeVars } from "@/ui/theme"
import HToolbar from "@/HToolbar.vue"
import { useAccount } from "@winwin/vue-simple-account"
import { forceReloadWindow } from "~/utils"
const vars = useThemeVars()
const account = useAccount()
const signOut = async () => {
  await account.signout()
  forceReloadWindow()
}
</script>
<template>
  <HToolbar class="signout-button cursor-pointer px-5" @click="signOut">
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
