<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useDetailStore } from "~/store/detail";
import HViewerToolbar from "~/components/HViewerToolbar.vue";
import HViewerContent from "~/components/HViewerContent.vue";

const router = useRouter();
const detailStore = useDetailStore();
router.beforeEach((to) => {
  if (to.name === "view") {
    const { type, source } = to.params;
    detailStore.getArticle({ source, type } as {
      type: "post" | "page";
      source: string;
    });
  }
});
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
