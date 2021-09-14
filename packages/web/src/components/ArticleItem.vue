<template>
  <q-item
    clickable
    :class="{ selected }"
    @click="onClick"
    @dblclick="onDBClick"
    style="padding: 10px 16px;border-radius:6px"
    class="article-item q-mx-sm q-my-xs"
  >
    <q-item-section>
      <q-item-label class="title text-bold">
        <q-icon
          name="drafts"
          color="yellow-9"
          v-if="!article.__page && !article.published"
        />
        <q-icon name="insert_drive_file" color="cyan" v-if="article.__page" />
        {{ article.title || "未命名" }}
      </q-item-label>
      <q-item-label caption lines="3" class="brief"
        >{{ article._content.slice(0, 100) }}
      </q-item-label>
      <q-item-label v-if="article.tags && article.tags.length > 0">
        <q-badge
          class="tag q-mr-xs"
          :label="tag.name"
          v-for="tag in article.tags"
          :key="tag"
        />
      </q-item-label>
      <q-item-label class="text-blue q-pt-xs" style="font-size:xx-small">
        {{ readable(new Date().valueOf() - article.date) }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { mapState } from "vuex";
function readable(diff) {
  let remaining = diff / 1000;
  const year = Math.floor(remaining / 365 / 86400);
  remaining -= year * 365 * 86400;
  if (year > 0) return `${year}年前`;
  const month = Math.floor(remaining / 30 / 86400);
  remaining -= month * 30 * 86400;
  if (month > 0) return `${month}个月前`;
  const day = Math.floor(remaining / 86400);
  remaining -= day * 86400;
  if (day > 0) return `${day}天前`;
  const hour = Math.floor(remaining / 3600);
  remaining -= hour * 3600;
  if (hour > 0) return `${hour}小时前`;
  const minute = Math.floor(remaining / 60);
  remaining -= minute * 60;
  if (minute > 0) return `${minute}分钟前`;
  remaining = Math.floor(remaining);
  if (remaining > 10) return `${remaining}秒前`;
  return "刚刚";
}
export default {
  name: "ArticleListItem",
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("hexo", {
      tags: state => state.tags.data,
      categories: state => state.categories.data
    }),
    selected() {
      if (this.article._id !== this.$route.params.id) return false;
      if (this.$route.path.includes("page") && this.article.__page === true)
        return true;
      if (this.$route.path.includes("post") && !this.article.__page === true)
        return true;
      return false;
    }
  },
  methods: {
    readable: readable,
    onClick() {
      const type = !this.article.__page ? "post" : "page";
      // 没有layout的情况就不会有__post=true,所以改用__page判断
      const id = this.article._id;
      if (this.$route.params.id === id && this.$route.params.type === type)
        this.$router.push("/");
      else this.$router.push({ name: "view", params: { id, type } });
    },
    onDBClick() {
      const type = !this.article.__page ? "post" : "page";
      const id = this.article._id;
      this.$router.push({ name: "edit", params: { id, type } });
    }
  }
};
</script>
<style lang="scss">
.article-item {
  .title {
    color: $l-text-1;
  }
  &.selected {
    background-color: $light-1;
  }
  .brief {
    color: $l-text-3;
  }
  .tag {
    color: $l-text-3;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.body--dark .article-item {
  .title {
    color: $d-text-1;
  }
  &.selected {
    background-color: $dark-3;
  }
  .brief {
    color: $d-text-3;
  }
  .tag {
    color: $d-text-3;
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
