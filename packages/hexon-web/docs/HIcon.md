# HIcon

## 基础

<HIcon :name="HIconName.Search"/>
<HIcon :name="HIconName.Add"/>
<HIcon :name="HIconName.Edit"/>

## 可点击

<HIcon :name="HIconName.Search" clickable/>
<HIcon :name="HIconName.Add" clickable/>
<HIcon :name="HIconName.Edit" clickable/>

## 其他

Icon 使用了字体，其他样式使用 css 和 style 控制

<script setup>
import HIcon from '../src/components/HIcon.vue'
import { HIconName } from '../src/components/HIconName'
</script>
