<script setup lang="ts"></script>
<template>
  <div class="h-nav-title text-sm select-none font-bold leading-11 px-4">
    <slot></slot>
  </div>
</template>
<style lang="less" scoped>
@import "~/styles/mixins.less";
.h-nav-title {
  color: var(--color-foreground-2);
  .ellipsis(1);
}
</style>
