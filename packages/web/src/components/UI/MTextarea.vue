<template>
  <div class="m-textarea" ref="parent" :class="{ error }">
    <textarea
      ref="el"
      class="full-width"
      @input="fitToContent"
      :placeholder="placeholder"
      v-model="innerValue"
      @keydown="e => $emit('keydown', e)"
      @blur="e => $emit('on-blur', e)"
    ></textarea>
  </div>
</template>
<script>
export default {
  name: "MTextarea",
  props: {
    value: {
      type: String,
      default: ""
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    error: {
      type: Boolean,
      default: false
    },
    placeholder: String
  },
  data() {
    return {
      innerValue: this.value
    };
  },
  watch: {
    value(v) {
      this.innerValue = v;
    },
    innerValue(v) {
      this.$emit("input", v);
    }
  },
  computed: {
    focused() {
      return this.$refs.el === document.activeElement;
    }
  },
  methods: {
    fitToContent() {
      if (!this.$refs.el || !this.$refs.parent) return;
      // from Quasar
      const el = this.$refs.el;
      const parentStyle = this.$refs.parent.style;

      // reset height of textarea to a small size to detect the real height
      // but keep the total control size the same
      parentStyle.marginBottom = el.scrollHeight - 1 + "px";
      el.style.height = "1px";

      el.style.height = el.scrollHeight + "px";
      parentStyle.marginBottom = "";
    },
    setValue(v) {
      this.innerValue = v;
    }
  },
  mounted() {
    this.fitToContent();
  }
};
</script>
<style lang="scss">
.m-textarea {
  & > textarea {
    color: $l-text-1;
    background-color: $light-3;
    border-radius: 6px;
    padding: 4px 12px;
    margin: 0;
    border: 1px solid transparent;
    outline: none;
    min-height: 100px;
    resize: none;
  }
  &.error > textarea {
    border-color: $negative;
  }
}
.body--dark .m-textarea textarea {
  background-color: $dark-3;
  color: $d-text-1;
}
</style>
