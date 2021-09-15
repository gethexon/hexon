<script setup lang="ts">
import account from "./account";
import { useAccountProvider } from "./lib/account";

useAccountProvider(account);
</script>

<template>
  <router-view></router-view>
</template>

<style></style>
