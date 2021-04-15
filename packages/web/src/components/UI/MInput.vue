<template>
  <div class="m-input row items-center" :class="{ error }">
    <slot name="prepend" />
    <q-input
      class="col"
      ref="input"
      v-model="innerValue"
      :type="type"
      :mask="mask"
      :placeholder="placeholder"
      :disable="disable"
      @compositionstart.native="composition = true"
      @compositionend.native="composition = false"
      @keydown="e => $emit('keydown', e)"
      @blur="e => $emit('blur', e)"
      @focus="e => $emit('focus', e)"
      borderless
      dense
      stack-label
    />
    <q-icon
      name="close"
      class="q-ml-sm cursor-pointer"
      @click="onClear"
      v-if="!disable && clearable"
    />
    <slot name="append" />
  </div>
</template>

<script>
export default {
  name: "MInput",
  props: {
    value: String,
    placeholder: String,
    type: String,
    mask: String,
    disable: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerValue: this.value,
      composition: false
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
  methods: {
    onClear() {
      this.innerValue = "";
      this.focus();
    },
    focus() {
      this.$refs.input.focus();
    }
  }
};
</script>
<style lang="scss">
.m-input {
  background-color: $light-1;
  border: 1px solid transparent;
  border-radius: 15px;
  padding: 0 10px;
  &.error {
    border-color: $negative;
  }
  input {
    color: $l-text-1;
    font-size: small;
  }
  .q-field--dense .q-field__control,
  .q-field--dense .q-field__marginal {
    height: 30px;
  }
}
.body--dark .m-input {
  background-color: $grey-9;
  input {
    color: $d-text-1;
  }
}
</style>
