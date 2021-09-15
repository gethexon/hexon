<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useAccountAccess, useAccountService } from "../account";
const service = useAccountService();
const access = useAccountAccess();
const router = useRouter();
const onSignOut = async () => {
  await service?.signout();
  router.push("/signin");
};
const onInfo = async () => {
  const res = await access?.get("/posts");
  text.value = res?.data;
};
const text = ref("");
</script>
<template>
  <h1>HomePage</h1>
  <button @click="onSignOut">signout</button>
  <button @click="onInfo">posts</button>
  <pre>{{ text }}</pre>
</template>
