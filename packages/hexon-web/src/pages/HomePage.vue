<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useThemeController, useTheme } from "@winwin/vue-global-theming";
import { useAccount } from "@winwin/vue-simple-account";
import { GET_BLOG_DATA_ACTION } from "~/store/action-types";
import { HTheme } from "~/themes";
import { forceReloadWindow } from "~/utils";
import SplitView from "~/lib/splitview";
import HTitle from "~/components/HTitle.vue";
import HNavList from "~/components/HNavList.vue";
import { CATEGORIES_TREE } from "~/store/getter-types";
const store = useStore();
const account = useAccount();
const themeController = useThemeController();
const theme = useTheme<HTheme>()!;
const onSignOut = async () => {
  await account?.signout();
  forceReloadWindow();
};
const state = computed(() => store.state);
const loadBlogData = async () => {
  await store.dispatch(GET_BLOG_DATA_ACTION);
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
const categoriesTree = computed(() => store.getters[CATEGORIES_TREE]);
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
            :page="0"
            :post="0"
            :draft="0"
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
        <pre>{{ state }}</pre>
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
