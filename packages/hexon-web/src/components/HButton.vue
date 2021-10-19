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
  <button
    class="
      h-button
      text-xs
      h-8
      border-none
      outline-none
      rounded-2xl
      px-3
      py-0
      inline-flex
      items-center
      justify-center
      overflow-hidden
      cursor-pointer
      select-none
    "
    :class="classes"
    :type="attrType"
  >
    <slot></slot>
  </button>
</template>

<style scoped lang="less">
.h-button {
  transition: color 0.2s ease, background-color 0.2s ease;
  &.block {
    @apply flex w-full;
  }
  &.round {
    @apply w-8;
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
      @apply bg-transparent;
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
      @apply bg-transparent;
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
      @apply bg-transparent;
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
      @apply bg-transparent;
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
      @apply bg-transparent;
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
