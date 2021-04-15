<template>
  <q-item
    class="nav-item"
    clickable
    :class="{ selected }"
    @click="e => $emit('on-click', e)"
    style="min-height: 28px"
  >
    <q-item-section side style="padding-right: 8px">
      <q-icon
        :color="color"
        :name="icon"
        size="18px"
        :style="`margin-left:${indent * 16}px`"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label class="ellipsis">
        <span>{{ title }}</span>
        <div
          class="caption"
          style="font-size:smaller;display:inline-block;margin-left:4px"
        >
          {{ caption }}
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "NavPartItem",
  props: {
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    caption: {
      type: Number,
      required: false
    },
    indent: {
      type: Number,
      default: 0
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss">
.nav-item {
  margin: 2px 8px 2px 16px;
  padding: 0 8px 0 16px;
  border-radius: 6px;
  color: $l-text-1;
  &.selected {
    background-color: $grey-4;
  }
  .caption {
    font-size: smaller;
    color: $l-text-2;
    &::before {
      content: " ";
    }
  }
}
.body--dark .nav-item {
  color: $d-text-1;
  &.selected {
    background-color: $grey-9;
  }
  .caption {
    color: $d-text-2;
  }
}
</style>
