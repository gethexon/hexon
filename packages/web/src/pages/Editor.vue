<template>
  <q-page class="editor overflow-hidden" :style-fn="styleFn">
    <div v-if="!post" class="fit column">
      <q-toolbar>
        <q-btn
          size="x-small"
          color="primary"
          label="返回"
          :ripple="false"
          rounded
          @click="$router.push('/')"
        />
      </q-toolbar>
      <article-404 class="col"></article-404>
    </div>
    <template v-else>
      <!-- TODO: 侧栏改用layout -->
      <q-splitter
        class="fit"
        v-model="splitter"
        unit="px"
        reverse
        separator-class="separator"
      >
        <template v-slot:before>
          <div class="main fit column">
            <q-toolbar>
              <q-btn
                size="x-small"
                color="primary"
                label="返回"
                :ripple="false"
                rounded
                @click="onBack"
              />
              <!-- TODO: 帮助按钮markdown的编辑工具栏 -->
              <q-space />
              <q-badge
                color="grey"
                label="未保存"
                class="q-ml-sm"
                rounded
                v-if="unsaved"
              />
              <q-badge
                label="保存中..."
                class="q-ml-sm"
                rounded
                v-if="saving"
              />
              <q-btn
                v-if="!postinfo.__page && !postinfo.published"
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
                icon="save"
                color="primary"
                :ripple="false"
                @click="onSave"
                flat
                round
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
            <div
              class="col column"
              style="width:100%;max-width:768px;margin:0 auto"
            >
              <input
                class="title"
                type="text"
                v-model="title"
                placeholder="请输入标题"
              />
              <div class="col relative-position columns">
                <monaco-editor
                  class="fit"
                  v-model="content"
                  style="flex: 1 0 0;"
                ></monaco-editor>
                <q-inner-loading :showing="asyncload.monaco.loading">
                  <q-spinner-tail size="25px" color="primary" />
                  <div class="loading-text">正在载入编辑器...</div>
                </q-inner-loading>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:after>
          <div class="side fit column">
            <q-scroll-area
              class="col"
              :thumb-style="{ width: '6px', borderRadius: '3px' }"
            >
              <div class="column">
                <q-toolbar>
                  <div class="text-h6" style="padding-left:12px">
                    Frontmatters
                  </div>
                </q-toolbar>
                <q-list class="m-form">
                  <date-editor
                    :post="post"
                    :getObj="() => getObj()"
                    :localUpdate="e => localUpdate(e)"
                  ></date-editor>
                  <updated-editor
                    :post="post"
                    :getObj="() => getObj()"
                    :localUpdate="e => localUpdate(e)"
                  ></updated-editor>
                  <tag-editor
                    :post="post"
                    :getObj="() => getObj()"
                    :localUpdate="e => localUpdate(e)"
                    :existTags="tagsList.map(t => t.name)"
                  ></tag-editor>
                  <category-editor
                    :post="post"
                    :getObj="() => getObj()"
                    :localUpdate="e => localUpdate(e)"
                    :existCategories="categoriesList.map(t => t.name)"
                  ></category-editor>
                  <q-expansion-item v-model="layoutExpand" dense>
                    <template v-slot:header>
                      <q-item-section v-if="!layoutExpand">
                        <q-item-label caption>Layout</q-item-label>
                        <q-item-label>
                          {{ layout || "hexo-default" }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section v-else>
                        <q-item-label
                          ><q-icon name="view_sidebar" /> Layout</q-item-label
                        >
                      </q-item-section>
                    </template>
                    <q-list dense style="padding:1px 0">
                      <q-item style="padding-top:0;margin-top:0">
                        <q-item-section>
                          <m-input
                            class="q-mt-xs"
                            v-model="layout"
                            placeholder="hexo-default"
                          ></m-input
                        ></q-item-section> </q-item
                    ></q-list>
                  </q-expansion-item>
                  <fm-editor
                    :post="post"
                    :getObj="() => getObj()"
                    :localUpdate="e => localUpdate(e)"
                  ></fm-editor>
                </q-list>
              </div>
            </q-scroll-area>
          </div>
        </template>
      </q-splitter>
    </template>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Article404 from "../components/Article404";
import DateEditor from "../components/Editors/DateEditor";
import UpdatedEditor from "../components/Editors/UpdatedEditor";
import TagEditor from "../components/Editors/TagEditor";
import CategoryEditor from "../components/Editors/CategoryEditor";
import FmEditor from "../components/Editors/FmEditor";
import MInput from "../components/UI/MInput";
import asyncload from "src/services/asyncload";

export default {
  name: "Editor",
  data() {
    return {
      splitter: 300,
      layoutExpand: false,
      asyncload: asyncload.state
    };
  },
  components: {
    Article404,
    DateEditor,
    UpdatedEditor,
    TagEditor,
    CategoryEditor,
    FmEditor,
    MonacoEditor: asyncload.load(
      () => import("../components/Editors/MonacoEditor"),
      "monaco"
    ),
    MInput
  },
  computed: {
    content: {
      get() {
        return this.post._content;
      },
      set(v) {
        const obj = this.getObj();
        obj._content = v;
        this.localUpdate(obj);
      }
    },
    title: {
      get() {
        return this.post.title;
      },
      set(v) {
        const obj = this.getObj();
        obj.title = v;
        this.localUpdate(obj);
      }
    },
    layout: {
      get() {
        return this.post.layout;
      },
      set(v) {
        const obj = this.getObj();
        obj.layout = v;
        this.localUpdate(obj);
      }
    },
    ...mapState("hexo", {
      posts: state => state.posts.data,
      pages: state => state.pages.data
    }),
    ...mapGetters("hexo", [
      "modifiedPost",
      "modifiedPage",
      "tagsList",
      "categoriesList"
    ]),
    unsaved() {
      return JSON.stringify(this.modify) !== "{}";
    },
    saving() {
      return JSON.stringify(this.saved) !== "{}";
    },
    modify() {
      if (this.$route.params.type === "post")
        return this.$store.state.hexo.posts.data[this.$route.params.id].modify;
      if (this.$route.params.type === "page")
        return this.$store.state.hexo.pages.data[this.$route.params.id].modify;
      return {};
    },
    saved() {
      if (this.$route.params.type === "post")
        return this.$store.state.hexo.posts.data[this.$route.params.id].saved;
      if (this.$route.params.type === "page")
        return this.$store.state.hexo.pages.data[this.$route.params.id].saved;
      return {};
    },
    post() {
      if (this.$route.params.type === "post") {
        return this.modifiedPost(this.$route.params.id);
      }
      if (this.$route.params.type === "page")
        return this.modifiedPage(this.$route.params.id);
      return null;
    },
    postinfo() {
      if (this.$route.params.type === "post") {
        const res = this.posts[this.$route.params.id];
        return res ? res.data : null;
      }
      if (this.$route.params.type === "page") {
        const res = this.pages[this.$route.params.id];
        return res ? res.data : null;
      }
      return null;
    }
  },
  methods: {
    localUpdate(obj) {
      this.$store.commit(
        "hexo/localUpdate" +
          (this.$route.params.type === "post" ? "Post" : "Page"),
        {
          id: this.$route.params.id,
          obj
        }
      );
    },
    // 获取一个包含已更改数据的文章对象
    getObj() {
      return JSON.parse(JSON.stringify(this.modify));
    },
    styleFn(offset, height) {
      return {
        height: height + "px"
      };
    },
    onBack() {
      // TODO: 检查是否需要保存
      if (JSON.stringify(this.modify) !== "{}") alert("未保存");
      else this.$router.push({ name: "view", params: this.$route.params });
    },
    onSave(hide) {
      this.$store.dispatch("hexo/updatePostOrPage", {
        id: this.$route.params.id,
        page: this.$route.params.type === "page",
        hide
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
                name: "edit",
                params: {
                  id: res._id,
                  type: "post"
                }
              });
            }
          });
        });
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
    }
  }
};
</script>
<style lang="scss">
.editor {
  color: $l-text-1;
  input.title {
    border: none;
    outline: none;
    padding: 16px 10px;
    font-size: x-large;
    font-weight: bold;
    color: $l-text-1;
    background: none;
  }
  .main {
    background-color: $light-3;
  }
  .separator {
    background-color: $light-3;
  }
  .side {
    background-color: $light-1;
  }
  .m-input {
    background-color: $light-3;
  }
}
.body--dark .editor {
  color: $d-text-1;
  input.title {
    color: $d-text-1;
  }
  .main {
    background-color: $dark-3;
  }
  .separator {
    background-color: $dark-3;
  }
  .side {
    background-color: $dark-1;
    .q-list--dark,
    .q-item--dark {
      color: $d-text-1;
    }
  }
  .m-input {
    background-color: $dark-3;
  }
}
</style>
