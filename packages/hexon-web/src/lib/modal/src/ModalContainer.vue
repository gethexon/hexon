<script setup lang="ts">
import FadeScaleTransitionGroupVue from "@/transitions/FadeScaleTransitionGroup.vue"
import { useModal } from "."
const { modals } = useModal()
</script>
<template>
  <Teleport to="body">
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
