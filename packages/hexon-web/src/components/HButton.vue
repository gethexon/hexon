<script setup lang="ts">
import { computed, toRefs } from "@vue/reactivity";
import HVerticalCenter from "./HVerticalCenter.vue";

const props = withDefaults(
  defineProps<{
    type?: "primary" | "secondary";
    inverted?: boolean;
    round?: boolean;
    block?: boolean;
  }>(),
  {
    type: "primary",
    inverted: false,
    round: false,
    block: false,
  }
);
const { type, inverted, round, block } = toRefs(props);
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
  <button :class="classes">
    <HVerticalCenter>
      <slot></slot>
    </HVerticalCenter>
  </button>
</template>

<style scoped lang="less">
button {
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
      background-color: var(--color-background-1);
      &:hover {
        background-color: var(--color-primary-l9);
      }
      &:active {
        background-color: var(--color-primary-l8);
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
      background-color: var(--color-background-1);
      &:hover {
        background-color: var(--color-success-l9);
      }
      &:active {
        background-color: var(--color-success-l8);
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
      background-color: var(--color-background-1);
      &:hover {
        background-color: var(--color-warning-l9);
      }
      &:active {
        background-color: var(--color-warning-l8);
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
      background-color: var(--color-background-1);
      &:hover {
        background-color: var(--color-error-l9);
      }
      &:active {
        background-color: var(--color-error-l8);
      }
    }
  }
}
</style>
