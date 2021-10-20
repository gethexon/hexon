# HBadge

## 基础

<HBadge>1</HBadge>
<HBadge>2</HBadge>
<HBadge>3</HBadge>
<HBadge>HBadge</HBadge>
<HBadge>HBadge</HBadge>
<HBadge>HBadge</HBadge>

## 可点击

<HBadge clickable>HBadge</HBadge>
<HBadge clickable>HBadge</HBadge>
<HBadge clickable>HBadge</HBadge>

## 和图标一起

<HBadge clickable><HIcon :name="HIconName.Search"/> 搜索</HBadge>
<HBadge clickable><HIcon :name="HIconName.Add"/> 添加</HBadge>
<HBadge clickable><HIcon :name="HIconName.Edit"/> 编辑</HBadge>
<HBadge clickable><HIcon :name="HIconName.Tag"/> 标签</HBadge>

<HBadge clickable><HIcon :name="HIconName.Search"/></HBadge>
<HBadge clickable><HIcon :name="HIconName.Add"/></HBadge>
<HBadge clickable><HIcon :name="HIconName.Edit"/></HBadge>
<HBadge clickable><HIcon :name="HIconName.Tag"/></HBadge>

## 不同颜色

<HBadge :bgColor="t.color.error.n" clickable><HIcon :name="HIconName.Delete"/> 删除</HBadge>
<HBadge :bgColor="t.color.warning.n" clickable><HIcon :name="HIconName.Warning"/> 警告</HBadge>
<HBadge :bgColor="t.color.success.n" clickable><HIcon :name="HIconName.Accept"/> 确定</HBadge>

<script setup>
import HIcon from '../src/components/HIcon.vue'
import { HIconName } from '../src/components/HIconName'
import HBadge from '../src/components/HBadge.vue'
import { useTheme } from '@winwin/vue-global-theming'
const t = useTheme()
</script>
