<script setup lang="ts">
import { useRouter } from "vue-router";
import { useDetailStore } from "~/store/detail";
import HViewerToolbar from "~/components/HViewerToolbar.vue";

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
</script>
<template>
  <div class="w-full h-full flex flex-col">
    <HViewerToolbar />
    {{ detailStore.article?._content }}
  </div>
</template>
