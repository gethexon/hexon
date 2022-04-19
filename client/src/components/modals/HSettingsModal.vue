<script setup lang="ts">
import { SettingsView } from "~/views/settings"
import { HBaseModal } from "@/ui/modal"
const props = defineProps<{
  close: () => void
}>()
</script>
<template>
  <HBaseModal @on-close="props.close">
    <!-- FIXME 妥善处理 Teleport 和 Provider 们 -->
    <div class="modal-panel">
      <SettingsView />
    </div>
  </HBaseModal>
</template>
