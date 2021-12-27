<script setup lang="ts">
import { useDialog } from "."
import ClassProvider from "~/ClassProvider.vue"
const { dialogs } = useDialog()
</script>
<template>
  <Teleport to="body">
    <ClassProvider>
      <slot v-for="item in dialogs" :key="item.id" :data="item"> </slot>
    </ClassProvider>
  </Teleport>
</template>
