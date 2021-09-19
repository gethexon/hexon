<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAccount } from "../lib/account";
import HLoginForm from "../components/HLoginForm.vue";
import { computed } from "@vue/reactivity";
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
</script>
<template>
  <div
    style="
      background-color: var(--color-background-3);
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 20vh;
      user-select: none;
    "
  >
    <HLoginForm @on-submit="onSignIn" style="flex: 1" />
    <div style="line-height: 32px">{{ footer }}</div>
  </div>
</template>
