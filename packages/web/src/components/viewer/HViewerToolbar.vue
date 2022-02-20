<script setup lang="ts">
import { useDetailStore } from "~/store/detail"
import { HViewerToolbarActionPayload } from "@/types"
import { HButton } from "@/ui/button"
import { HIcon, HIconName } from "@/ui/icon"
import HToolbar from "@/HToolbar.vue"
const emits = defineEmits<{
  (e: "on-action", payload: HViewerToolbarActionPayload): void
}>()
const detailStore = useDetailStore()
</script>
<template>
  <HToolbar>
    <div class="flex-1"></div>
    <HButton
      class="mr-2"
      type="primary"
      round
      inverted
      @click="emits('on-action', { type: 'edit' })"
    >
      <HIcon :name="HIconName.Edit" />
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
      v-if="detailStore.isDraft"
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
