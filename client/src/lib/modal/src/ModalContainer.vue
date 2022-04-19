<script setup lang="ts">
import FadeScaleTransitionGroupVue from "@/transitions/FadeScaleTransitionGroup.vue"
import { useModal } from "."
const { modals } = useModal()
const teleport = document.createElement("div")
teleport.id = "modal-container"
document.body.appendChild(teleport)
</script>
<template>
  <Teleport to="#modal-container">
    <FadeScaleTransitionGroupVue>
      <Component
        v-for="item in modals"
        :key="item.id"
        :is="item.component"
        @click.stop
        :close="item.close"
      ></Component>
    </FadeScaleTransitionGroupVue>
  </Teleport>
</template>
