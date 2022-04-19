<script setup lang="ts">
import { HIcon, HIconName } from ".."
const all = Object.entries(HIconName).map(([key, value]) => ({
  key,
  value: value as HIconName,
}))
</script>
<template>
  <tr v-for="item in all" :key="item.key">
    <td>
      <HIcon :name="item.value"></HIcon>
    </td>
    <td>{{ item.key }}</td>
  </tr>
</template>
