<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useThemeController, useTheme } from "@winwin/vue-global-theming";
import { useAccount } from "@winwin/vue-simple-account";
import { HTheme } from "~/themes";
import { forceReloadWindow } from "~/utils";
import SplitView from "~/lib/splitview";
import HTitle from "~/components/HTitle.vue";
import HNavList from "~/components/HNavList.vue";
import { useMainStore } from "~/store/main";
import { useArticleListStore } from "~/store/articleList";
import { HNavListActionPayload } from "~/components/types";

const mainStore = useMainStore();
const articleListStore = useArticleListStore();
const account = useAccount();
const themeController = useThemeController();
const theme = useTheme<HTheme>()!;
const onSignOut = async () => {
  await account?.signout();
  forceReloadWindow();
};
const loadBlogData = async () => {
  mainStore.getBlogData();
};
onMounted(() => loadBlogData());
const changeToPurple = () => {
  themeController?.changeTheme("purple");
};
const changeToDefault = () => {
  themeController?.changeTheme("default");
};
const style = computed(() => ({
  backgroundColor: theme?.value.color.primary.n,
}));
const sep11 = ref(200);
const sep22 = ref(300);
const config = {
  sep1: {
    min: 150,
    max: 300,
  },
  sep2: {
    min: 200,
    max: 500,
  },
};

const categoriesTree = computed(() => mainStore.categoriesTree);
const filter = computed(() => articleListStore.articleFilter);
const articles = computed(() => filter.value(mainStore.articles));
const onFilterAll = () => articleListStore.setFilter({ type: "all" });
const onFilterPost = () => articleListStore.setFilter({ type: "post" });
const onFilterPage = () => articleListStore.setFilter({ type: "page" });
const onFilterDraft = () => articleListStore.setFilter({ type: "draft" });
const onFilterCategory = (slug: string) =>
  articleListStore.setFilter({ type: "category", slug });
const onFilterTag = (slug: string) =>
  articleListStore.setFilter({ type: "tag", slug });
const onNavListAction = (payload: HNavListActionPayload) => {
  switch (payload.type) {
    case "all":
      onFilterAll();
      break;
    case "post":
      onFilterPost();
      break;
    case "page":
      onFilterPage();
      break;
    case "draft":
      onFilterDraft();
      break;
    case "category":
      onFilterCategory(payload.slug);
      break;
    default:
      break;
  }
};
const draftsCount = computed(() => mainStore.draftsList.length);
const postsCount = computed(() => mainStore.publishedPostsList.length);
const pagesCount = computed(() => mainStore.pagesList.length);
</script>
<template>
  <SplitView
    v-model:sep1at="sep11"
    v-model:sep2at="sep22"
    :sep1="config.sep1"
    :sep2="config.sep2"
    style="width: 100%; height: 100%"
  >
    <template v-slot:first>
      <div
        class="w-full h-full flex flex-col"
        :style="{ backgroundColor: theme.color.background.c3 }"
      >
        <HTitle />
        <div style="flex: 1 0 0; overflow-y: auto">
          <!-- 这层 div 用来滚动 -->
          <HNavList
            :categories="categoriesTree"
            :page="pagesCount"
            :post="postsCount"
            :draft="draftsCount"
            @on-action="onNavListAction"
          />
        </div>
        TODO
      </div>
    </template>
    <template v-slot:second>
      <div style="overflow: auto; width: 100%; height: 100%">TODO</div>
    </template>
    <template v-slot:third>
      <div style="overflow: auto; width: 100%; height: 100%">
        <button @click="changeToDefault">change default</button>
        <button @click="changeToPurple">change purple</button>
        <button @click="onSignOut">signout</button>
        <button @click="loadBlogData">get blog data</button>
        <pre>{{ articles }}</pre>
        <pre :style="style">
    {{ theme }}
  </pre
        >
      </div>
    </template>
  </SplitView>
</template>
<style scoped>
h1 {
  color: var(--color-primary);
}
</style>
