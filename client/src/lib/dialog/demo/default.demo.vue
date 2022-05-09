<script setup lang="ts">
import { ref } from "vue"
import { HButton } from "@/ui/button"
import { HInput } from "@/ui/input"
import HToggle from "@/ui/toggle/src/HToggle.vue"
import { useDialog } from ".."
import DemoPad from "~/components/DemoPad.vue"

const dialog = useDialog()
const fire = () => {
  dialog.create({
    type: "info",
    title: title.value,
    content: content.value,
    persistent: persistent.value,
    actions: [
      {
        type: "info",
        label: "显示信息",
        run: (item) => {
          alert(JSON.stringify(item))
        },
      },
      {
        type: "error",
        label: "删除",
        run: () => {
          alert("删除")
        },
      },
      {
        type: "success",
        label: "成功",
        run: () => {
          alert("成功")
        },
      },
      {
        type: "info",
        label: "关闭",
        run: (item) => {
          item.close()
        },
      },
    ],
  })
}
const title = ref("你确认要删除么")
const content = ref("此操作不可撤销")
const persistent = ref(false)
</script>
<template>
  <DemoPad>
    title
    <HInput type="secondary" v-model="title" />
    content
    <HInput type="secondary" v-model="content" />
    persistent
    <HToggle v-model:active="persistent" />
    <HButton @click="fire">fire</HButton>
  </DemoPad>
</template>
