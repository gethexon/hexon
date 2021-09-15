<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAccountProvider } from "./account/vue";

const router = useRouter();
useAccountProvider({
  baseURL: "http://localhost:5777",
  onTokenExpire: () => {
    router.push("/signin");
    console.log("token expired");
  },
});
</script>

<template>
  <router-view></router-view>
</template>

<style></style>
