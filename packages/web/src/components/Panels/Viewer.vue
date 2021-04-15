<template>
  <div class="viewpost fit">
    <article-404 v-if="!post"></article-404>
    <template v-else>
      <div class="main fit column">
        <q-toolbar>
          <q-space />
          <q-btn
            v-if="!post.__page && !post.published"
            size="x-small"
            class="q-ml-sm"
            icon="publish"
            :ripple="false"
            color="positive"
            flat
            round
            @click="onPublish"
          />
          <q-btn
            size="x-small"
            class="q-ml-sm"
            icon="edit"
            color="primary"
            :ripple="false"
            flat
            round
            @click="onEdit"
          />
          <q-btn
            size="x-small"
            class="q-ml-sm"
            icon="delete"
            color="negative"
            :ripple="false"
            flat
            round
            @click="onDelete"
          />
          <q-btn
            size="x-small"
            class="q-ml-sm"
            icon="code"
            :ripple="false"
            flat
            round
          />
          <q-btn
            size="x-small"
            class="q-ml-sm"
            icon="more_horiz"
            :ripple="false"
            flat
            round
          />
        </q-toolbar>
        <q-scroll-area
          class="col content"
          :thumb-style="{ height: '6px', width: '6px', borderRadius: '3px' }"
        >
          <div class="q-px-xl " style="padding-bottom:50px" @dblclick="onEdit">
            <div class="container overflow-hidden">
              <div class="header">
                <div class="title">
                  {{ post.title || "未命名" }}
                  <q-icon
                    name="drafts"
                    v-if="!post.__page && !post.published"
                    color="yellow-8"
                    size="large"
                  />
                  <q-icon
                    name="insert_drive_file"
                    v-if="post.__page"
                    color="cyan"
                    size="large"
                  />
                </div>
                <div class="fm" v-if="fm">
                  <pre class="overflow-auto">{{ fm }}</pre>
                </div>
                <div class="info">
                  <span class="date">
                    <q-icon
                      name="date_range"
                      class="icon"
                      style="transform:translateY(-1px)"
                    />
                    <span>{{ date }}</span>
                  </span>
                  <span class="date">
                    <q-icon
                      name="update"
                      class="icon"
                      style="transform:translateY(-1px)"
                    />
                    <span>{{ updated }}</span>
                  </span>
                  <span
                    class="categories"
                    v-if="
                      !post.__page &&
                        category2d.length > 0 &&
                        category2d[0].length > 0
                    "
                  >
                    <q-icon name="folder" class="icon" />
                    <span
                      v-for="categories in category2d"
                      :key="'s' + categories.map(c => c._id).join('')"
                      class="category"
                    >
                      <template v-for="(category, idx) in categories">
                        <span :key="'t' + category._id">{{
                          category.name
                        }}</span>
                        <q-icon
                          name="chevron_right"
                          style="margin:0 -2px"
                          :key="'i' + category._id"
                          v-if="idx < categories.length - 1"
                        />
                      </template>
                    </span>
                  </span>
                  <span
                    class="tags"
                    v-if="
                      !post.__page &&
                        post.tags &&
                        post.tags.length &&
                        post.tags.length > 0
                    "
                  >
                    <q-icon name="sell" class="icon" />
                    <span v-for="tag in post.tags" :key="tag" class="tag">{{
                      tags[tag].data.name
                    }}</span>
                  </span>
                </div>
              </div>
            </div>
            <!-- TODO 添加目录 -->
            <q-markdown
              :src="post._content"
              class="container"
              no-heading-anchor-links
              toc
              @data="onToc"
            ></q-markdown>
          </div>
        </q-scroll-area>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import yaml from "js-yaml";
import { date } from "quasar";
import Article404 from "src/components/Article404";
import { DATE_FORMAT } from "src/utils/constants";

export default {
  name: "Viewer",
  data() {
    return {
      toc: []
    };
  },
  components: {
    Article404
  },
  computed: {
    ...mapState("hexo", {
      posts: state => state.posts.data,
      pages: state => state.pages.data,
      tags: state => state.tags.data,
      categories: state => state.categories.data
    }),
    dark() {
      return this.$q.dark.isActive;
    },
    fm() {
      const res = yaml.dump(this.post.fm.fm);
      return res.toString() === "{}\n" ? "" : res;
    },
    post() {
      if (this.$route.params.type === "post") {
        const res = this.posts[this.$route.params.id];
        return res ? res.data : null;
      }
      if (this.$route.params.type === "page") {
        const res = this.pages[this.$route.params.id];
        return res ? res.data : null;
      }
      return null;
    },
    date() {
      return date.formatDate(this.post.date, DATE_FORMAT);
    },
    updated() {
      return date.formatDate(this.post.updated, DATE_FORMAT);
    },
    category2d() {
      if (!this.post.categories) return [[]];
      return this.post.categories.map(ca =>
        ca.map(c => this.categories[c].data)
      );
    }
  },
  methods: {
    onToc(toc) {
      this.toc = toc;
    },
    onEdit() {
      this.$router.push({ name: "edit", params: this.$route.params });
    },
    onDelete() {
      this.$q
        .dialog({
          title: "你确认要删除么",
          message: "此操作不可撤销",
          cancel: true,
          ok: {
            label: "删除",
            color: "negative",
            rounded: true,
            size: "x-small"
          },
          cancel: {
            rounded: true,
            size: "x-small",
            flat: true
          },
          focus: "cancel"
        })
        .onOk(() => {
          this.$store.dispatch("hexo/deletePostOrPage", {
            id: this.$route.params.id,
            page: this.$route.params.type === "page",
            onsuccess: () => {
              this.$router.push("/");
            }
          });
        });
    },
    onPublish() {
      this.$q
        .dialog({
          title: "你确认要发布么",
          message: "如需撤销，需要手动操作文件",
          cancel: true,
          ok: {
            label: "发布",
            color: "primary",
            rounded: true,
            size: "x-small"
          },
          cancel: {
            rounded: true,
            size: "x-small",
            flat: true
          },
          focus: "cancel"
        })
        .onOk(() => {
          this.$store.dispatch("hexo/publishPost", {
            id: this.$route.params.id,
            onsuccess: res => {
              this.$router.push({
                name: "view",
                params: {
                  id: res._id,
                  type: "post"
                }
              });
            }
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.content,
.content * {
  user-select: text;
}
.container {
  margin: 0 auto;
  max-width: 768px;
}
.header {
  margin-bottom: 20px;
}
.title {
  font-size: xx-large;
  font-weight: bold;
}
.info {
  margin: 10px 0;
  color: $l-text-2;
  font-weight: 500;
  align-items: center;
  .icon {
    margin-right: 4px;
  }
  .date,
  .tags,
  .categories {
    margin-right: 8px;
  }
  .tags,
  .categories {
    display: inline-block;
  }
  .tags .tag::after,
  .categories .category::after {
    content: ", ";
  }
  .tags .tag:last-of-type::after,
  .categories .category:last-of-type::after {
    content: "";
  }
}
.fm {
  color: $l-text-2;
  pre {
    margin: 0;
  }
}
.viewpost .main {
  color: $grey-9;
}
.body--dark {
  .info {
    color: $d-text-2;
  }
  .viewpost .main {
    color: $grey-3;
  }
  .fm {
    color: $d-text-2;
  }
}
</style>
