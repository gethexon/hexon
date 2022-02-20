<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { computed } from "vue"
import { useDispatcher } from "~/store/dispatcher"
import { HTheme } from "~/themes"
import HLoginForm from "@/forms/HLoginForm.vue"
const dispatcher = useDispatcher()
const footer = computed(() => {
  return `©️ 2019 ~ ${new Date().getFullYear()} winwin_2011`
})
const onSignIn = (payload: { username: string; password: string }) =>
  dispatcher.signIn(payload)
const theme = useTheme<HTheme>()!
</script>
<template>
  <div
    class="w-full h-full flex flex-col items-center select-none"
    :style="{
      backgroundColor: theme.color.background.base3,
      paddingTop: '20vh',
    }"
  >
    <HLoginForm @on-submit="onSignIn" style="flex: 1" />
    <div
      class="leading-8 text-xs"
      :style="{ color: theme.color.foreground.main }"
    >
      {{ footer }}
    </div>
  </div>
</template>
