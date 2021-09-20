<script setup lang="ts">
import { computed, toRefs } from "@vue/reactivity";
import { ButtonHTMLAttributes } from "@vue/runtime-dom";

const props = withDefaults(
  defineProps<{
    type?: "primary" | "secondary" | "warning" | "error" | "common";
    inverted?: boolean;
    round?: boolean;
    block?: boolean;
    attrType?: ButtonHTMLAttributes["type"];
  }>(),
  {
    type: "primary",
    inverted: false,
    round: false,
    block: false,
  }
);
const { type, inverted, round, block, attrType } = toRefs(props);
const classes = computed(() => {
  return {
    [`${type.value}`]: true,
    inverted: inverted.value,
    round: round.value,
    block: block.value,
  };
});
</script>

<template>
  <button :class="classes" :type="attrType">
    <slot></slot>
  </button>
</template>

<style scoped lang="less">
button {
  font-size: smaller;
  height: 32px;
  border: none;
  outline: none;
  border-radius: 16px;
  padding: 0 16px;
  transition: color 0.2s, background-color 0.2s;
  white-space: nowrap;

  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  overflow: hidden;
  &.block {
    display: flex;
    width: 100%;
  }
  &.round {
    width: 32px;
  }
  &.primary {
    background-color: var(--color-primary-n);
    color: var(--color-foreground-9);
    &:hover {
      background-color: var(--color-primary-l2);
    }
    &:active {
      background-color: var(--color-primary-l4);
    }
    &.inverted {
      color: var(--color-primary-n);
      background-color: transparent;
      &:hover {
        background-color: var(--color-primary-a9);
      }
      &:active {
        background-color: var(--color-primary-a8);
      }
    }
  }
  &.success {
    background-color: var(--color-success-n);
    color: var(--color-foreground-9);
    &:hover {
      background-color: var(--color-success-l2);
    }
    &:active {
      background-color: var(--color-success-l4);
    }
    &.inverted {
      color: var(--color-success-n);
      background-color: transparent;
      &:hover {
        background-color: var(--color-success-a9);
      }
      &:active {
        background-color: var(--color-success-a8);
      }
    }
  }
  &.warning {
    background-color: var(--color-warning-n);
    color: var(--color-foreground-9);
    &:hover {
      background-color: var(--color-warning-l2);
    }
    &:active {
      background-color: var(--color-warning-l4);
    }
    &.inverted {
      color: var(--color-warning-n);
      background-color: transparent;
      &:hover {
        background-color: var(--color-warning-a9);
      }
      &:active {
        background-color: var(--color-warning-a8);
      }
    }
  }
  &.error {
    background-color: var(--color-error-n);
    color: var(--color-foreground-9);
    &:hover {
      background-color: var(--color-error-l2);
    }
    &:active {
      background-color: var(--color-error-l4);
    }
    &.inverted {
      color: var(--color-error-n);
      background-color: transparent;
      &:hover {
        background-color: var(--color-error-a9);
      }
      &:active {
        background-color: var(--color-error-a8);
      }
    }
  }
  &.common {
    background-color: var(--color-common-n);
    color: var(--color-foreground-9);
    &:hover {
      background-color: var(--color-common-l2);
    }
    &:active {
      background-color: var(--color-common-l4);
    }
    &.inverted {
      color: var(--color-common-n);
      background-color: transparent;
      &:hover {
        background-color: var(--color-common-a9);
      }
      &:active {
        background-color: var(--color-common-a8);
      }
    }
  }
}
</style>
