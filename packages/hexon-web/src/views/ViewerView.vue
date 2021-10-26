<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDetailStore } from "~/store/detail";
import HViewerToolbar from "~/components/HViewerToolbar.vue";
import HViewerContent from "~/components/HViewerContent.vue";

const route = useRoute();
const router = useRouter();
const detailStore = useDetailStore();
watch(
  () => [route.params.type, route.params.source],
  async () => {
    const { type, source } = route.params;
    if (
      route.name === "view" // 仅控制 view 路由
    ) {
      // FIXME: 解决闪屏的问题
      await detailStore.clearArticle();
      await detailStore.getArticle({ source, type } as {
        type: "post" | "page";
        source: string;
      });
    }
  },
  { immediate: true }
);
router.beforeEach(async (to, from) => {
  // 这里只写跳出 view 路由的逻辑，同路由跳转写到 watch 中
  if (
    to.name === "edit" &&
    to.params.source === from.params.source &&
    to.params.type === from.params.type
  ) {
    // same article view -> edit
    return;
  } else if (to.name === "view") {
    // view -> view
    // 只有在组件加载后 guard 内容才会在路由变化后执行
    // 立即执行需要写在 watch 中
    return;
  } else {
    // others
    detailStore.clearArticle();
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
