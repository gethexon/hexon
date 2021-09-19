<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAccount } from "../lib/account";
const router = useRouter();
const account = useAccount();
const onSignIn = async () => {
  await account?.signin("admin", "admin");
  router.push("/home");
};
</script>
<template>
  <h1>SignInPage</h1>
  <button @click="onSignIn">SignIn</button>
</template>
