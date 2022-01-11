<script setup lang="ts">
import { defineComponent, h, ref } from "vue"
import HSlideView from "../src/HSlideView.vue"
import { ISlideViewItem } from "../src/interface"
const model: ISlideViewItem[] = new Array(5).fill(0).map((i, idx) => {
  const key = `Tab${idx}`
  return {
    key,
    component: defineComponent({
      render() {
        return h("div", key)
      },
    }),
  }
})
const current = ref("Tab0")
const onChange = (key: string) => {
  current.value = key
}
const Changer = defineComponent({
  render() {
    return model.map((item) =>
      h(
        "button",
        {
          style: {
            padding: "5px 10px",
          },
          onClick: () => onChange(item.key),
        },
        item.key
      )
    )
  },
})
</script>
<template>
  <h2>基础</h2>
  <Changer />
  <div class="w-96 h-96 relative">
    <HSlideView class="bg-gray-100" :model="model" :current="current" />
  </div>
  <h2>自定义内容</h2>
  <Changer />
  <div class="w-96 h-96 relative">
    <HSlideView class="bg-gray-100" :model="model" :current="current">
      <template #default="slotProps">
        <div class="p-8">
          <div class="text-3xl">{{ slotProps.key }}</div>
          <Component :is="slotProps.component" />
        </div>
      </template>
    </HSlideView>
  </div>
</template>
