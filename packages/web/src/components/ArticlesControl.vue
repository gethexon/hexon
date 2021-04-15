<template>
  <div class="options row" style="padding:0 24px">
    <link-drop :text="sortType(sort.key, sort.ascend)">
      <q-list dense style="font-size:smaller">
        <q-item
          clickable
          v-close-popup
          @click="setSort(item.key, item.ascend)"
          v-for="item in sortTypesList"
          :key="item.key + item.ascend"
        >
          <q-item-section>
            <q-item-label>
              {{ sortType(item.key, item.ascend) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </link-drop>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import LinkDrop from "src/components/UI/LinkDrop";
export default {
  name: "ArticlesControl",
  components: {
    LinkDrop
  },
  data() {
    return {
      sortTypes: {
        date: { true: "最早创建的文章", false: "最新创建的文章" },
        updated: { true: "最早修改的文章", false: "最新修改的文章" },
        title: { true: "按名称 A-Z", false: "按名称 Z-A" }
      }
    };
  },
  computed: {
    ...mapState("ui", {
      filter: state => state.filter,
      sort: state => state.sort
    }),
    sortTypesList() {
      return Object.keys(this.sortTypes)
        .map(key => {
          return [true, false].map(ascend => {
            return { key, ascend };
          });
        })
        .reduce((a, b) => a.concat(b), []);
    }
  },
  methods: {
    ...mapMutations("ui", {
      setSort: (commit, key, ascend) => {
        commit("setSort", { key, ascend });
      }
    }),
    sortType(key, ascend) {
      return this.sortTypes[key][ascend];
    }
  }
};
</script>

<style></style>
