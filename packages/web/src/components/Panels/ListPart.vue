<template>
  <div class="list-part fit column">
    <q-toolbar class="toolbar" style="padding: 0 24px">
      <m-input
        class="col"
        placeholder="搜索"
        clearable
        @focus="showSearchResult = true"
        @blur="showSearchResult = false"
      >
        <template v-slot:prepend>
          <q-icon name="search" class="q-mr-sm" />
        </template>
      </m-input>
      <q-btn
        color="primary"
        icon="add"
        round
        :ripple="false"
        size="x-small"
        class="q-ml-sm bg-whtie"
        @click="onNewArticle"
        v-if="!showSearchResult"
      />
    </q-toolbar>
    <template v-if="showSearchResult"> </template>
    <template v-else>
      <articles-control></articles-control>
      <articles-list class="col" :articles="articles"></articles-list>
    </template>
  </div>
</template>

<script>
import MInput from "src/components/UI/MInput";
import ArticlesControl from "src/components/ArticlesControl";
import ArticlesList from "src/components/ArticlesList";
import NewArticle from "src/components/Panels/NewArticle";
import { mapState } from "vuex";
import { array2dToArray1d, sortString } from "src/utils/common";
function obj2list(obj) {
  return Object.keys(obj).map(key => obj[key].data);
}
export default {
  name: "ListPart",
  components: {
    MInput,
    ArticlesList,
    ArticlesControl
  },
  data() {
    return {
      showSearchResult: false
    };
  },
  computed: {
    ...mapState("hexo", {
      posts: state => obj2list(state.posts.data),
      pages: state => obj2list(state.pages.data)
    }),
    ...mapState("ui", {
      filter: state => state.filter,
      sort: state => state.sort
    }),
    articles() {
      const articles = this.posts.concat(this.pages);
      let result = [];
      switch (this.filter.type) {
        case "all":
          result = articles;
          break;
        case "post":
          result = this.posts;
          break;
        case "page":
          result = this.pages;
          break;
        case "draft":
          result = this.posts.filter(p => !p.published);
          break;
        case "tag":
          result = this.posts.filter(p => p.tags.includes(this.filter.id));
          break;
        case "category":
          result = this.posts.filter(p =>
            array2dToArray1d(p.categories).includes(this.filter.id)
          );
          break;
      }
      result.sort((a, b) => {
        switch (this.sort.key) {
          case "date":
            return (this.sort.ascend ? 1 : -1) * (a.date - b.date);
          case "updated":
            return (this.sort.ascend ? 1 : -1) * (a.updated - b.updated);
          case "title":
            return (this.sort.ascend ? 1 : -1) * sortString(a.title, b.title);
        }
        return 1;
      });
      return result;
    }
  },
  methods: {
    onNewArticle() {
      this.$q.dialog({
        component: NewArticle,
        parent: this
      });
    }
  }
};
</script>
<style lang="scss">
.list-part {
  .toolbar {
    color: $l-text-1;
  }
  .options {
    color: $l-text-2;
  }
}
.body--dark .list-part {
  .toolbar {
    color: $d-text-1;
  }
  .options {
    color: $d-text-2;
  }
}
</style>
