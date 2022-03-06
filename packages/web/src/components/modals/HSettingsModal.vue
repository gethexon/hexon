<script setup lang="ts">
import { SettingsView } from "~/views/settings"
import ClassProvider from "~/ClassProvider.vue"
import { HBaseModal } from "@/ui/modal"
const props = defineProps<{
  close: () => void
}>()
</script>
<template>
  <HBaseModal @on-close="props.close">
    <ClassProvider>
      <!-- FIXME 妥善处理 Teleport 和 Provider 们 -->
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
    </ClassProvider>
  </HBaseModal>
</template>
