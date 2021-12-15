<script setup lang="ts">
import HToolbar from "./HToolbar.vue"
import { HButton } from "./ui/button"
import { HIcon } from "./ui/icon"
import { HIconName } from "./ui/icon"
import { HEditorToolbarActionPayload } from "./types"
const emits = defineEmits<{
  (e: "on-action", payload: HEditorToolbarActionPayload): void
}>()
</script>
<template>
  <HToolbar class="px-2">
    <HButton type="primary" round @click="emits('on-action', { type: 'back' })">
      <HIcon :name="HIconName.ChevronLeft" />
    </HButton>
    <div class="flex-1"></div>
    <HButton
      class="mr-2"
      type="primary"
      round
      inverted
      @click="emits('on-action', { type: 'save' })"
    >
      <HIcon :name="HIconName.Save" />
    </HButton>
    <HButton
      class="mr-2"
      type="error"
      round
      inverted
      @click="emits('on-action', { type: 'delete' })"
    >
      <HIcon :name="HIconName.Delete" />
    </HButton>
    <HButton
      class="mr-2"
      type="success"
      round
      inverted
      @click="emits('on-action', { type: 'publish' })"
    >
      <HIcon :name="HIconName.Upload" />
    </HButton>
    <HButton
      class="mr-2"
      type="common"
      round
      inverted
      @click="emits('on-action', { type: 'code' })"
    >
      <HIcon :name="HIconName.Code" />
    </HButton>
    <HButton class="mr-2" type="common" round inverted>
      <HIcon :name="HIconName.GlobalNavButton" />
    </HButton>
  </HToolbar>
</template>
