<template>
  <q-expansion-item
    clickable
    class="category-editor"
    @show="onShow"
    v-model="expand"
    dense
  >
    <!-- TODO 多分类支持，需要编辑原文件 -->
    <template v-slot:header>
      <q-item-section v-if="!expand">
        <q-item-label caption>
          分类
        </q-item-label>
        <q-item-label>
          <span v-if="categories[0].length < 1">无</span>
          <template v-for="(cat, idx) in categories[0]" v-else>
            <q-icon
              name="keyboard_arrow_right"
              v-if="idx > 0"
              :key="'i' + cat"
            />
            <q-badge :key="cat" rounded class="cursor-pointer"
              >{{ cat }}
            </q-badge>
          </template>
        </q-item-label>
      </q-item-section>
      <q-item-section v-else>
        <q-item-label><q-icon name="folder" /> 分类</q-item-label>
      </q-item-section>
    </template>
    <q-list dense style="padding:1px 0">
      <q-item style="padding-top:4px;margin-top:0">
        <q-item-section>
          <q-item-label>
            <span v-if="categories[0].length < 1">无</span>
            <template v-for="(cat, idx) in categories[0]" v-else>
              <q-icon
                name="keyboard_arrow_right"
                v-if="idx > 0"
                :key="'i' + cat"
              />
              <q-badge
                :key="cat"
                rounded
                class="q-mb-xs cursor-pointer"
                @click="remove(idx)"
                >{{ cat }}<q-icon name="close" />
              </q-badge>
            </template>
          </q-item-label>
          <q-item-label
            v-if="allCategories.length > 0"
            class="candidates q-mt-md"
          >
            <q-badge
              v-for="cat in allCategories"
              :key="cat"
              rounded
              class="q-mr-xs q-mb-xs cursor-pointer"
              @click="add(cat)"
              ><q-icon name="add" />{{ cat }}
            </q-badge>
          </q-item-label>
          <m-input
            v-model="newCategory"
            ref="input"
            @keydown.enter="addNew"
            placeholder="新分类"
            class="q-mt-sm"
          >
            <template v-slot:append>
              <q-icon
                name="subdirectory_arrow_left"
                class="q-ml-sm cursor-pointer"
                @click="addNew"
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
  name: "CategoryEditor",
  props: {
    post: Object,
    getObj: Function,
    localUpdate: Function,
    existCategories: Array
  },
  components: {
    MInput
  },
  data() {
    return {
      newCategory: "",
      expand: false
    };
  },
  computed: {
    categories: {
      get() {
        return this.post.categories || [[]];
      },
      set(v) {
        let obj = this.getObj();
        obj.categories = v;
        this.localUpdate(obj);
      }
    },
    allCategories() {
      const allCategories = [];
      this.categories.forEach(cs => {
        cs.forEach(c => {
          if (!allCategories.includes(c)) allCategories.push(c);
        });
      });
      (this.existCategories || [])
        .filter(c => !allCategories.includes(c))
        .forEach(c => allCategories.push(c));
      return allCategories.sort(sortString);
    }
  },
  methods: {
    onEnter() {
      if (!this.$refs.input.composition) this.addNew();
    },
    clone() {
      return this.categories.map(cs => cs.map(c => c));
    },
    addNew() {
      if (this.newCategory) {
        this.add(this.newCategory);
        this.newCategory = "";
      } else {
        this.$refs.input.focus();
      }
    },
    add(cat) {
      const categories = this.clone();
      categories[0].push(cat);
      this.categories = categories;
      this.$refs.input.focus();
    },
    remove(idx) {
      const categories = this.clone();
      categories[0] = categories[0].slice(0, idx);
      this.categories = categories;
      this.$refs.input.focus();
    },
    onShow() {
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    }
  }
};
</script>
<style lang="scss">
.category-editor {
  .candidates {
    margin-top: 8px;
  }
  .candidates .q-badge {
    background-color: $light-3;
    color: $l-text-1;
  }
}
.body--dark .category-editor {
  .candidates .q-badge {
    background-color: $dark-3;
    color: $d-text-1;
  }
}
</style>
