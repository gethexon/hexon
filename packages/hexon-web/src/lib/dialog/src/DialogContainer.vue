<script setup lang="ts">
import FadeTransitionGroup from "@/transitions/FadeScaleTransitionGroup.vue"
import ClassProvider from "~/ClassProvider.vue"
import { useDialog } from "."
const { dialogs } = useDialog()
</script>
<template>
  <Teleport to="body">
    <ClassProvider>
      <FadeTransitionGroup>
        <div v-for="item in dialogs" :key="item.id">
          <slot :data="item"></slot>
        </div>
      </FadeTransitionGroup>
    </ClassProvider>
  </Teleport>
</template>
