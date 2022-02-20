<script setup lang="ts">
import { HBaseModal } from "@/ui/modal"
import { SettingsView } from "~/views/settings"
const props = defineProps<{
  close: () => void
}>()
</script>
<template>
  <HBaseModal @on-close="props.close">
    <div
      style="
        width: 960px;
        max-width: calc(100vw - 100px) !important;
        height: 640px;
        max-height: calc(100vh - 100px) !important;
      "
    >
      <SettingsView />
    </div>
  </HBaseModal>
</template>
