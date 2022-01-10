<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { useAccount } from "@winwin/vue-simple-account"
import { computed } from "vue"
import { useRouter } from "vue-router"
import { HTheme } from "~/themes"
import HLoginForm from "@/forms/HLoginForm.vue"
import { useNotification } from "~/lib/notification"
const router = useRouter()
const account = useAccount()
const notification = useNotification()
const footer = computed(() => {
  return `©️ 2019 ~ ${new Date().getFullYear()} winwin_2011`
})
const onSignIn = async ({
  username,
  password,
}: {
  username: string
  password: string
}) => {
  try {
    await account.signin(username, password)
    router.push("/home")
  } catch (e) {
    notification.notify({
      title: "登陆失败",
      type: "error",
    })
  }
}
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
