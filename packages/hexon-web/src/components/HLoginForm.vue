<script setup lang="ts">
import { ref } from "vue";
import { Person24Filled, Key24Filled } from "@vicons/fluent";
import HImage from "./HImage.vue";
import logo from "../assets/logo.svg";
import HInput from "./HInput.vue";
import HIcon from "./HIcon.vue";
import HButton from "./HButton.vue";

const emits = defineEmits<{
  (
    e: "on-submit",
    payload: { username: string; password: string; e: Event }
  ): void;
  (e: "on-forget"): void;
  (e: "on-help"): void;
}>();
const username = ref("");
const password = ref("");
const onSubmit = (e: Event) => {
  emits("on-submit", { username: username.value, password: password.value, e });
  e.preventDefault();
};
const onForget = () => {
  emits("on-forget");
};
const onHelp = () => {
  emits("on-help");
};
</script>
<template>
  <form
    @submit="onSubmit"
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 230px;
    "
  >
    <HImage :src="logo" alt="" size="100px" />
    <div
      style="
        color: var(--color-foreground-2);
        font-size: 1.2rem;
        margin-top: 16px;
        user-select: none;
      "
    >
      登录到 Hexon
    </div>
    <HInput
      placeholder="用户名"
      v-model="username"
      style="width: 100%; margin-top: 16px"
      clearable
    >
      <template v-slot:prefix>
        <HIcon>
          <Person24Filled />
        </HIcon>
      </template>
    </HInput>
    <HInput
      placeholder="密码"
      v-model="password"
      style="width: 100%; margin-top: 16px"
      attr-type="password"
      clearable
    >
      <template v-slot:prefix>
        <HIcon>
          <Key24Filled />
        </HIcon>
      </template>
    </HInput>
    <HButton style="margin-top: 16px" block>登录</HButton>
    <div style="margin-top: 16px; display: flex; width: 100%">
      <HButton
        type="common"
        inverted
        style="flex: 1"
        @click="onForget"
        attr-type="button"
      >
        忘记密码
      </HButton>
      <HButton
        type="common"
        inverted
        style="flex: 1; margin-left: 10px"
        @click="onHelp"
        attr-type="button"
      >
        帮助
      </HButton>
    </div>
  </form>
</template>
