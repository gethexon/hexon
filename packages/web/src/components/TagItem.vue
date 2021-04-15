<template>
  <q-chip
    square
    clickable
    class="chip-tag"
    :class="{ selected }"
    :ripple="false"
    size="xx-small"
    @click="setFilter({ type: 'tag', id: tag._id })"
  >
    <q-avatar class="a q-mr-xs">{{ tag.posts.length }}</q-avatar>

    {{ tag.name }}
  </q-chip>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "TagItem",
  props: {
    tag: {
      type: Object
    },
    selected: {
      type: Boolean,
      default: false
    }
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
<style lang="scss">
.chip-tag {
  color: $grey-8;
  background-color: rgba(0, 0, 0, 0.1);
  .a {
    color: $grey-9;
    background-color: $grey-5;
  }
  &.selected {
    color: $grey-3;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
.body--dark .chip-tag {
  color: $grey-4;
  background-color: rgba(255, 255, 255, 0.1);
  .a {
    color: $grey-1;
    background-color: $grey-9;
  }
  &.selected {
    color: $grey-9;
    background-color: rgba(255, 255, 255, 0.8);
  }
}
</style>
