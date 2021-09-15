<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAccountService } from "../account";
const router = useRouter();
const service = useAccountService();

const onSignIn = async () => {
  await service?.signin("admin", "admin");
  router.push("/home");
};
</script>
<template>
  <h1>SignInPage</h1>
  <button @click="onSignIn">SignIn</button>
</template>
