<template>
  <div class="nav-part fit column overflow-hidden">
    <q-toolbar class="toolbar">
      <div class="text-h6" style="padding-left:20px">Hexon</div>
      <q-space />
      <q-btn flat round dense icon="help_outline" size="xx-small" class="btn" />
    </q-toolbar>

    <q-scroll-area
      class="col"
      :thumb-style="{ width: '6px', borderRadius: '3px' }"
    >
      <nav-title text="操作"></nav-title>
      <q-list dense>
        <nav-item
          icon="local_airport"
          title="部署"
          color="primary"
          @on-click="deploy"
        ></nav-item>
        <nav-item
          icon="movie_filter"
          title="生成"
          color="primary"
          @on-click="generate"
        ></nav-item>
        <nav-item
          icon="toys"
          title="清理"
          color="red"
          @on-click="clean"
        ></nav-item>
        <nav-item
          icon="flight_takeoff"
          title="同步到GIT"
          color="primary"
          @on-click="gitSave"
        ></nav-item>
        <nav-item
          icon="flight_land"
          title="从GIT同步"
          color="red"
          @on-click="gitSync"
        ></nav-item>
      </q-list>
      <nav-title text="筛选"></nav-title>
      <q-list dense>
        <nav-item
          icon="archive"
          title="全部"
          color="green"
          :caption="totalCount"
          @on-click="setFilter({ type: 'all' })"
          :selected="filter.type === 'all'"
        ></nav-item>
        <nav-item
          icon="create"
          title="文章"
          color="primary"
          :caption="postCount"
          @on-click="setFilter({ type: 'post' })"
          :selected="filter.type === 'post'"
        ></nav-item>
        <nav-item
          icon="drafts"
          title="草稿"
          color="yellow-8"
          :caption="draftCount"
          @on-click="setFilter({ type: 'draft' })"
          :selected="filter.type === 'draft'"
        ></nav-item>
        <nav-item
          icon="insert_drive_file"
          title="页面"
          color="cyan"
          :caption="pageCount"
          @on-click="setFilter({ type: 'page' })"
          :selected="filter.type === 'page'"
        ></nav-item>
      </q-list>
      <nav-title text="分类"></nav-title>
      <!-- TODO 超长分类支持 -->
      <q-list dense>
        <category-item
          v-for="node in categoriesTreeNodes"
          :key="node._id"
          :node="node"
        ></category-item>
      </q-list>
      <nav-title text="标签云"></nav-title>
      <div class="tags">
        <tag-item
          v-for="tag in tagsList"
          :key="tag._id"
          :tag="tag"
          :selected="filter.type === 'tag' && filter.id === tag._id"
        ></tag-item>
      </div>
    </q-scroll-area>
    <div class="corner">
      <q-item clickable @click="onSettings">
        <q-item-section side>
          <q-avatar
            size="32px"
            color="primary"
            text-color="white"
            icon="person"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="title text-bold">{{
            $store.state.user.info.data.username
          }}</q-item-label>
          <q-item-label class="caption" caption>已登录</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="double_arrow" class="icon" />
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import NavTitle from "src/components/UI/NavTitle";
import NavItem from "src/components/UI/NavItem";
import TagItem from "src/components/TagItem";
import CategoryItem from "src/components/CategoryItem";
import Settings from "src/components/Panels/Settings";
import services from "src/services";
export default {
  name: "NavPart",
  components: {
    NavTitle,
    NavItem,
    TagItem,
    CategoryItem
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("ui", ["filter"]),
    ...mapGetters("hexo", [
      "categoriesTreeNodes",
      "tagsList",
      "postCount",
      "pageCount",
      "totalCount",
      "draftCount"
    ])
  },
  methods: {
    ...mapMutations("ui", ["setFilter"]),
    onSettings() {
      // TODO: 以后选项多了，这里要弹出菜单给常用选项，然后菜单里有去设置的选项
      this.$q.dialog({
        component: Settings,

        // optional if you want to have access to
        // Router, Vuex store, and so on, in your
        // custom component:
        parent: this // becomes child of this Vue node
        // ("this" points to your Vue component)
        // (prop was called "root" in < 1.1.0 and
        // still works, but recommending to switch
        // to the more appropriate "parent" name)
      });
    },
    async gitSave() {
      try {
        this.$q.loading.show();
        await services.hexo.gitSave();
        this.$notify({
          title: "git提交成功",
          type: "success",
          duration: 1000
        });
      } catch (err) {
        this.$notify({
          title: "git提交失败",
          type: "error",
          text: err instanceof NetworkError ? err.message : "unknown error",
          duration: 1000
        });
        if (!(err instanceof NetworkError)) throw err;
      } finally {
        this.$q.loading.hide();
      }
    },
    async gitSync() {
      try {
        this.$q.loading.show();
        await services.hexo.gitSync();
        this.$notify({
          title: "git同步成功",
          type: "success",
          duration: 1000
        });
      } catch (err) {
        this.$notify({
          title: "git同步失败",
          type: "error",
          text: err instanceof NetworkError ? err.message : "unknown error",
          duration: 1000
        });
        if (!(err instanceof NetworkError)) throw err;
      } finally {
        this.$q.loading.hide();
      }
    },
    async generate() {
      try {
        this.$q.loading.show();
        await services.hexo.generate();
        this.$notify({
          title: "生成成功",
          type: "success",
          duration: 1000
        });
      } catch (err) {
        this.$notify({
          title: "生成失败",
          type: "error",
          text: err instanceof NetworkError ? err.message : "unknown error",
          duration: 1000
        });
        if (!(err instanceof NetworkError)) throw err;
      } finally {
        this.$q.loading.hide();
      }
    },
    async deploy() {
      try {
        this.$q.loading.show();
        await services.hexo.deploy();
        this.$notify({
          title: "部署成功",
          type: "success",
          duration: 1000
        });
      } catch (err) {
        this.$notify({
          title: "部署失败",
          type: "error",
          text: err instanceof NetworkError ? err.message : "unknown error",
          duration: 1000
        });
        if (!(err instanceof NetworkError)) throw err;
      } finally {
        this.$q.loading.hide();
      }
    },
    async clean() {
      try {
        this.$q.loading.show();
        await services.hexo.clean();
        this.$notify({
          title: "清理成功",
          type: "success",
          duration: 1000
        });
      } catch (err) {
        this.$notify({
          title: "清理失败",
          type: "error",
          text: err instanceof NetworkError ? err.message : "unknown error",
          duration: 1000
        });
        if (!(err instanceof NetworkError)) throw err;
      } finally {
        this.$q.loading.hide();
      }
    }
  }
};
</script>
<style lang="scss">
.nav-part {
  .toolbar {
    color: $l-text-1;
    .btn {
      color: $l-text-2;
    }
  }
  .tags {
    margin-left: 28px;
    margin-right: 8px;
  }
  .corner {
    .title {
      color: $l-text-1;
    }
    .caption,
    .icon {
      color: $l-text-2;
    }
  }
}
.body--dark .nav-part {
  .toolbar {
    color: $d-text-1;
    .btn {
      color: $d-text-2;
    }
  }
  .corner {
    .title {
      color: $d-text-1;
    }
    .caption,
    .icon {
      color: $d-text-2;
    }
  }
}
</style>
