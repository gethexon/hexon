---
sidebarDepth: 1
---

# HButton

## 类型

`type?: "primary" | "success" | "warning" | "error" = "primary"`

<NSpace>
  <HButton type="primary">primary</HButton>
  <HButton type="success">success</HButton>
  <HButton type="warning">warning</HButton>
  <HButton type="error">error</HButton>
</NSpace>

## 颜色反转

`inverted?: boolean = false`

<NSpace>
  <HButton type="primary" inverted>primary</HButton>
  <HButton type="success" inverted>success</HButton>
  <HButton type="warning" inverted>warning</HButton>
  <HButton type="error" inverted>error</HButton>
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

使用 [HIcon](?path=/docs/hicon--基础) 或者 [xicons](https://www.xicons.org/#/) 的 [Icon](https://github.com/07akioni/xicons#usage)。

<NSpace>
  <HButton round>
    <HIcon>
      <Search24Filled />
    </HIcon>
  </HButton>
  <HButton round>
    <HIcon>
      <Add24Filled />
    </HIcon>
  </HButton>
  <HButton round>
    <HIcon>
      <Edit24Filled />
    </HIcon>
  </HButton>
  <HButton>
    <HIcon>
      <Search24Filled />
    </HIcon>
  </HButton>
  <HButton>
    <HIcon>
      <Add24Filled />
    </HIcon>
  </HButton>
  <HButton>
    <HIcon>
      <Edit24Filled />
    </HIcon>
  </HButton>
</NSpace>

<script setup>
import { NSpace } from 'naive-ui' 
import { Search24Filled, Add24Filled, Edit24Filled } from "@vicons/fluent";
import  HButton from '../src/components/HButton.vue'
import  HIcon from '../src/components/HIcon.vue'
</script>
