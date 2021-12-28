<script setup lang="ts">
import { ref } from "vue"
import { HModal } from ".."
import { HButton } from "../../button"
const show = ref(false)
const show2 = ref(false)
</script>
<template>
  <HButton @click="show = true">show</HButton>
  <HModal v-model:show="show">
    <template #default="slotProps">
      <div class="px-20 py-10 rounded bg-base-1">
        <HButton @click="slotProps.hide">hide</HButton>
      </div>
    </template>
  </HModal>
  <HButton @click="show2 = true">show persistent</HButton>
  <HModal v-model:show="show2" persistent>
    <template #default="slotProps">
      <div class="px-20 py-10 rounded bg-base-1">
        <HButton @click="slotProps.hide">hide</HButton>
      </div>
    </template>
  </HModal>
</template>
