<script setup lang="ts">
import { HBadge } from "../"
import { HIcon, HIconName } from "@/ui/icon"
import { useThemeVars } from "../../theme"
const vars = useThemeVars()
</script>
<template>
  <h2>基础</h2>

  <HBadge>1</HBadge>
  <HBadge>2</HBadge>
  <HBadge>3</HBadge>
  <HBadge>HBadge</HBadge>
  <HBadge>HBadge</HBadge>
  <HBadge>HBadge</HBadge>

  <h2>可点击</h2>

  <HBadge clickable>HBadge</HBadge>
  <HBadge clickable>HBadge</HBadge>
  <HBadge clickable>HBadge</HBadge>

  <h2>和图标一起</h2>

  <HBadge clickable>
    <HIcon :name="HIconName.Search" />
    搜索
  </HBadge>
  <HBadge clickable>
    <HIcon :name="HIconName.Add" />
    添加
  </HBadge>
  <HBadge clickable>
    <HIcon :name="HIconName.Edit" />
    编辑
  </HBadge>
  <HBadge clickable>
    <HIcon :name="HIconName.Tag" />
    标签
  </HBadge>

  <HBadge clickable><HIcon :name="HIconName.Search" /></HBadge>
  <HBadge clickable><HIcon :name="HIconName.Add" /></HBadge>
  <HBadge clickable><HIcon :name="HIconName.Edit" /></HBadge>
  <HBadge clickable><HIcon :name="HIconName.Tag" /></HBadge>

  <h2>不同颜色</h2>

  <HBadge :bgColor="vars.colorError" clickable>
    <HIcon :name="HIconName.Delete" />
    删除
  </HBadge>
  <HBadge :bgColor="vars.colorWarning" clickable>
    <HIcon :name="HIconName.Warning" />
    警告
  </HBadge>
  <HBadge :bgColor="vars.colorSuccess" clickable>
    <HIcon :name="HIconName.Accept" />
    确定
  </HBadge>

  <h2>圆角</h2>

  <HBadge rounded>1</HBadge>
  <HBadge rounded>2</HBadge>
  <HBadge rounded>3</HBadge>
  <HBadge rounded>HBadge</HBadge>
  <HBadge rounded clickable><HIcon :name="HIconName.Search" /></HBadge>
</template>
<style>
.h-badge {
  @apply mr-1;
}
</style>
