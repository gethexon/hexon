<template>
  <div>
    <nav-item
      icon="folder"
      :title="node.name"
      color="yellow-8"
      :caption="node.posts.length"
      :indent="indent"
      @on-click="setFilter({ type: 'category', id: node._id })"
      :selected="filter.type === 'category' && filter.id === node._id"
    ></nav-item>
    <category-item
      v-for="child in node._child"
      :key="child._id"
      :node="child"
      :indent="indent + 1"
    ></category-item>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NavItem from "src/components/UI/NavItem";
export default {
  name: "CategoryItem",
  props: {
    node: {
      type: Object
    },
    indent: {
      type: Number,
      default: 0
    }
  },
  components: {
    NavItem
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("ui", ["filter"])
  },
  methods: {
    ...mapMutations("ui", ["setFilter"])
  }
};
</script>
