<script setup lang="ts">
import { HIconName } from "./HIconName";
import HIcon from "./HIcon.vue";
const all = Object.entries(HIconName).map(([key, value]) => ({
  key,
  value: value as HIconName,
}));
</script>
<template>
  <tr v-for="item in all" :key="item.key">
    <td>
      <HIcon :name="item.value"></HIcon>
    </td>
    <td>{{ item.key }}</td>
  </tr>
</template>
