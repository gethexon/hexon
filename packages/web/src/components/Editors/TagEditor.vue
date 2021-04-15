<template>
  <q-expansion-item class="tag-editor" @show="onShow" v-model="expand" dense>
    <template v-slot:header>
      <q-item-section v-if="!expand">
        <q-item-label caption>
          标签
        </q-item-label>
        <q-item-label>
          <span v-if="tags.length < 1">无</span>
          <q-badge v-for="tag in tags" :key="tag" rounded class="q-mr-xs">{{
            tag
          }}</q-badge>
        </q-item-label>
      </q-item-section>
      <q-item-section v-else>
        <q-item-label> <q-icon name="sell" /> 标签 </q-item-label>
      </q-item-section>
    </template>
    <q-list dense style="padding:1px 0">
      <q-item style="padding-top:4px;margin-top:0">
        <q-item-section>
          <q-item-label>
            <q-badge
              v-for="tag in allTags"
              :key="tag"
              rounded
              class="q-mr-xs q-mb-xs cursor-pointer"
              :class="{ unselected: !tags.includes(tag) }"
              @click="toggle(tag)"
            >
              {{ tag }}
            </q-badge>
          </q-item-label>
          <m-input
            v-model="newTag"
            ref="input"
            @keydown.enter="onEnter"
            placeholder="新标签"
            class="q-mt-sm"
          >
            <template v-slot:append>
              <q-icon
                name="subdirectory_arrow_left"
                class="q-ml-sm cursor-pointer"
                @click="add"
              />
            </template>
          </m-input>
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script>
import { sortString } from "src/utils/common";
import MInput from "../UI/MInput";
export default {
  name: "TagEditor",
  props: {
    post: Object,
    getObj: Function,
    localUpdate: Function,
    existTags: Array
  },
  components: {
    MInput
  },
  data() {
    return {
      newTag: "",
      expand: false
    };
  },
  methods: {
    onEnter() {
      if (!this.$refs.input.composition) this.add();
      else this.$refs.input.focus();
    },
    toggle(tag) {
      if (this.tags.includes(tag)) {
        this.tags = this.tags.filter(t => t !== tag);
      } else {
        this.tags = [tag].concat(this.tags);
      }
      this.$refs.input.focus();
    },
    add() {
      if (this.newTag && !this.tags.includes(this.newTag)) {
        this.tags = [this.newTag].concat(this.tags);
      }
      this.newTag = "";
      this.$refs.input.focus();
    },
    onShow() {
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    }
  },
  computed: {
    tags: {
      get() {
        return (this.post.tags || []).map(t => t).sort(sortString);
      },
      set(v) {
        let obj = this.getObj();
        obj.tags = v;
        this.localUpdate(obj);
      }
    },
    allTags() {
      const allTags = [];
      this.tags.forEach(t => allTags.push(t));
      (this.existTags || [])
        .filter(t => !allTags.includes(t))
        .forEach(t => allTags.push(t));
      return allTags.sort(sortString);
    }
  }
};
</script>
<style lang="scss">
.tag-editor {
  .q-badge.unselected {
    background-color: $light-3;
    color: $l-text-1;
  }
}
.body--dark .tag-editor {
  .q-badge.unselected {
    background-color: $dark-3;
    color: $d-text-1;
  }
}
</style>
