<script setup lang="ts">
import { computed } from "vue"
import { useDispatcher } from "~/store/dispatcher"
import HLoginForm from "@/forms/HLoginForm.vue"
import { useThemeVars } from "~/components/ui/theme"
const dispatcher = useDispatcher()
const footer = computed(() => {
  return `©️ 2019 ~ ${new Date().getFullYear()} winwin_2011`
})
const onSignIn = (payload: { username: string; password: string }) =>
  dispatcher.signIn(payload)
const vars = useThemeVars()
</script>
<template>
  <div
    class="w-full h-full flex flex-col items-center select-none"
    :style="{
      backgroundColor: vars.backgroundColorTertiary,
      paddingTop: '20vh',
    }"
  >
    <HLoginForm @on-submit="onSignIn" style="flex: 1" />
    <div class="leading-8 text-xs" :style="{ color: vars.textColorSecondary }">
      {{ footer }}
    </div>
  </div>
</template>
