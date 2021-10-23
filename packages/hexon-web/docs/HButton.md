# HButton

## 类型

`type?: "primary" | "success" | "warning" | "error" | "common" = "primary"`

<NSpace>
<HButton type="primary">primary</HButton>
<HButton type="success">success</HButton>
<HButton type="warning">warning</HButton>
<HButton type="error">error</HButton>
<HButton type="common">common</HButton>
</NSpace>

## 颜色反转

`inverted?: boolean = false`

<NSpace>
<HButton type="primary" inverted>primary</HButton>
<HButton type="success" inverted>success</HButton>
<HButton type="warning" inverted>warning</HButton>
<HButton type="error" inverted>error</HButton>
<HButton type="common" inverted>common</HButton>
</NSpace>

## 圆的

`round?: boolean = false`

<NSpace>
<HButton round>圆</HButton>
<HButton round>的</HButton>
<HButton round>就</HButton>
<HButton round>很</HButton>
<HButton round>好</HButton>
<HButton round>玩</HButton>
</NSpace>

## 扩展的

`block?: boolean = false`

<HButton block>确定</HButton>

## 图标

使用 [HIcon](/HIcon.html)

<NSpace>
<HButton round>
<HIcon :name="HIconName.Search"/>
</HButton>
<HButton round>
<HIcon :name="HIconName.Add"/>
</HButton>
<HButton round>
<HIcon :name="HIconName.Edit"/>
</HButton>
<HButton>
<HIcon :name="HIconName.Search"/>
</HButton>
<HButton>
<HIcon :name="HIconName.Add"/>
</HButton>
<HButton>
<HIcon :name="HIconName.Edit"/>
</HButton>
</NSpace>

<script setup>
import { NSpace } from 'naive-ui' 
import HButton from '../src/components/HButton.vue'
import HIcon from '../src/components/HIcon.vue'
import { HIconName } from '../src/components/HIconName'
</script>
