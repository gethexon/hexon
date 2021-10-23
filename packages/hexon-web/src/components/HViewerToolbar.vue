<script setup lang="ts">
import HToolbar from "./HToolbar.vue";
import HButton from "./HButton.vue";
import HIcon from "./HIcon.vue";
import { HIconName } from "./HIconName";
import { HViewerToolbarActionPayload } from "./types";
const emits = defineEmits<{
  (e: "on-action", payload: HViewerToolbarActionPayload): void;
}>();
</script>
<template>
  <HToolbar>
    <div class="flex w-full">
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
    </div>
  </HToolbar>
</template>
