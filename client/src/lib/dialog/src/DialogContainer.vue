<script setup lang="ts">
import FadeTransitionGroup from "@/transitions/FadeScaleTransitionGroup.vue"
import { useDialog } from "./lib"
const { dialogs } = useDialog()
const teleport = document.createElement("div")
teleport.id = "dialog-container"
document.body.appendChild(teleport)
</script>
<template>
  <Teleport to="#dialog-container">
    <FadeTransitionGroup>
      <div v-for="item in dialogs" :key="item.id">
        <slot :data="item"></slot>
      </div>
    </FadeTransitionGroup>
  </Teleport>
</template>
