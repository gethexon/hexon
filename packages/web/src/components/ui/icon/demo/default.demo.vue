<script setup lang="ts">
import { defineAsyncComponent } from "vue"
import { HIcon, HIconName } from ".."
const IconMap = defineAsyncComponent(() => import("./icon-map.vue"))
</script>
<template>
  <h2>基础</h2>
  <HIcon :name="HIconName.Search" />
  <HIcon :name="HIconName.Add" />
  <HIcon :name="HIconName.Edit" />
  <h2>可点击</h2>
  <HIcon :name="HIconName.Search" clickable />
  <HIcon :name="HIconName.Add" clickable />
  <HIcon :name="HIconName.Edit" clickable />
  <h2>其他</h2>
  Icon 使用了字体，其他样式使用 css 和 style 控制
  <h2>所有图标</h2>
  <IconMap></IconMap>
</template>
