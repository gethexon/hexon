<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import * as monaco from "monaco-editor";
import { editorOptions } from "./monaco";
import "./workers";
import { useMonacoTheme } from "./theme";
const props = defineProps<{
  value: string;
  id: string;
}>();
const dom = ref<HTMLElement>();
let instance: monaco.editor.IStandaloneCodeEditor;
function resetModal() {
  const modal = monaco.editor.createModel(props.value, "markdown");
  instance.setModel(modal);
}
onMounted(() => {
  instance = monaco.editor.create(dom.value!, editorOptions);
  resetModal();
});
onBeforeUnmount(() => {
  instance.dispose();
});
watch(
  () => props.id,
  () => {
    resetModal();
  }
);
useMonacoTheme();
</script>
<template>
  <div class="h-monaco-editor w-full h-full">
    <div class="instance w-full h-full" ref="dom"></div>
  </div>
</template>
