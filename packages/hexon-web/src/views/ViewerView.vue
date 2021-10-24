<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useDetailStore } from "~/store/detail";
import HViewerToolbar from "~/components/HViewerToolbar.vue";
import HViewerContent from "~/components/HViewerContent.vue";

const route = useRoute();
const detailStore = useDetailStore();
watch(
  () => [route.params.type, route.params.source],
  () => {
    const { type, source } = route.params;
    if (!type || !source) return;
    detailStore.getArticle({ source, type } as {
      type: "post" | "page";
      source: string;
    });
  },
  { immediate: true }
);
const content = computed(() => detailStore.article?.content || "");
</script>
<template>
  <div class="w-full h-full flex flex-col">
    <HViewerToolbar />
    <div class="overflow-auto flex-1">
      <HViewerContent :content="content" />
    </div>
  </div>
</template>
