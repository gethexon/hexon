# HNavItem

## 基础

<div style="background-color:var(--color-background-c3);display:inline-block;width:200px">
<HNavItem :text="d.text" :icon="d.icon" :indent="d.indent" :color="d.color" :sub="d.sub" v-for="d in data"></HNavItem>
</div>

<script setup>
import { ref } from 'vue'
import { useTheme } from "@winwin/vue-global-theming";
import HNavItem from '../src/components/HNavItem.vue'
import { HIconName } from '../src/components/HIconName'
const t = useTheme()
const data = ref([
  {
    text: "不同颜色和图标",
    icon: HIconName.Search,
    color: t.value.color.primary.n,
    sub: 4
  },
  {
    text: "不同颜色和图标",
    icon: HIconName.CheckMark,
    color: t.value.color.success.n,
    sub: 21
  },
  {
    text: "无缩进",
    icon: HIconName.Folder,
    color: t.value.color.folder,
    sub: 14
  },
  {
    text: "有缩进",
    icon: HIconName.Folder,
    indent: 1,
    color: t.value.color.folder,
    sub: 2
  },
])
</script>
