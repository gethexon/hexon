<script setup lang="ts">
import { HButton } from ".."
import { HIcon, HIconName } from "../../icon"
</script>
<template>
  <h2>基础</h2>
  <HButton type="primary">primary</HButton>
  <HButton type="success">success</HButton>
  <HButton type="warning">warning</HButton>
  <HButton type="error">error</HButton>
  <HButton type="common">common</HButton>
  <h2>颜色反转</h2>
  <HButton type="primary" inverted>primary</HButton>
  <HButton type="success" inverted>success</HButton>
  <HButton type="warning" inverted>warning</HButton>
  <HButton type="error" inverted>error</HButton>
  <HButton type="common" inverted>common</HButton>
  <h2>圆的</h2>
  <HButton round>圆</HButton>
  <HButton round>的</HButton>
  <HButton round>就</HButton>
  <HButton round>很</HButton>
  <HButton round>好</HButton>
  <HButton round>玩</HButton>
  <h2>扩展的</h2>
  <HButton block>确定</HButton>
  <h2>使用图标</h2>
  <HButton round>
    <HIcon :name="HIconName.Search" />
  </HButton>
  <HButton round>
    <HIcon :name="HIconName.Add" />
  </HButton>
  <HButton round>
    <HIcon :name="HIconName.Edit" />
  </HButton>
  <HButton>
    <HIcon :name="HIconName.Search" />
  </HButton>
  <HButton>
    <HIcon :name="HIconName.Add" />
  </HButton>
  <HButton>
    <HIcon :name="HIconName.Edit" />
  </HButton>
</template>
