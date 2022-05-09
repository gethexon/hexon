<script setup lang="ts"></script>
<template>
  <div class="h-nav-title text-sm select-none font-bold leading-12 px-4">
    <slot></slot>
  </div>
</template>
<style lang="less" scoped>
@import "~/styles/mixins.less";
.h-nav-title {
  .ellipsis(1);
}
</style>
