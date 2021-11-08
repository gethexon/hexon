<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useAccount } from "@winwin/vue-simple-account";
import HLoginForm from "~/components/forms/HLoginForm.vue";
import { useTheme } from "@winwin/vue-global-theming";
import { HTheme } from "~/themes";
const router = useRouter();
const account = useAccount();
const footer = computed(() => {
  return `©️ 2019 ~ ${new Date().getFullYear()} winwin_2011`;
});
const onSignIn = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    await account?.signin(username, password);
    router.push("/home");
  } catch (e) {
    // TODO 登录失败弹窗
    console.log("fail to signin");
  }
};
const theme = useTheme<HTheme>()!;
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
