<script setup lang="ts">
import { useDialog } from "."
import ClassProvider from "~/ClassProvider.vue"
import FadeTransitionGroup from "./FadeTransitionGroup.vue"
const { dialogs } = useDialog()
</script>
<template>
  <Teleport to="body">
    <ClassProvider>
      <FadeTransitionGroup>
        <div v-for="item in dialogs" :key="item.id">
          <slot :data="item"> </slot>
        </div>
      </FadeTransitionGroup>
    </ClassProvider>
  </Teleport>
</template>
