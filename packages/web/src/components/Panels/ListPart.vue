<template>
  <div class="list-part fit column">
    <q-toolbar class="toolbar" style="padding: 0 24px">
      <m-input
        class="col"
        :placeholder="`${showSearchResult ? '支持正则表达式' : '搜索'}`"
        @focus="showSearchResult = true"
        @blur="showSearchResult = false"
        v-model="query"
        @keydown.native.enter="onSearch"
      >
        <template v-slot:prepend>
          <q-icon name="search" class="q-mr-sm" />
        </template>
        <template v-slot:append v-if="showSearchResult">
          <q-icon name="subdirectory_arrow_left" class="q-mr-sm" />
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
    <template v-if="showSearchResult">
      <q-icon
        name="search"
        class="search-icon absolute"
        style="bottom:30px;right:30px"
        size="200px"
      />
      <articles-list
        class="col"
        :articles="searchResultArticles"
      ></articles-list>
    </template>
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
import services from "src/services";
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
      showSearchResult: false,
      searchResult: [],
      query: ""
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
    searchResultArticles() {
      const articles = this.posts.concat(this.pages);
      return articles.filter(article =>
        this.searchResult.includes(article._id)
      );
    },
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
    },
    async onSearch() {
      this.searchResult = await services.hexo.search(this.query);
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
  .search-icon {
    color: $light-1;
  }
}
.body--dark .list-part {
  .toolbar {
    color: $d-text-1;
  }
  .options {
    color: $d-text-2;
  }
  .search-icon {
    color: $dark-1;
  }
}
</style>
