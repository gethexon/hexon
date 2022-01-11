<script setup lang="ts">
import type { ISlideViewItem } from "../src/interface"
import { defineComponent, h, markRaw, ref } from "vue"
import HSlideView from "../src/HSlideView.vue"
const model: ISlideViewItem[] = new Array(5).fill(0).map((i, idx) => {
  const key = `Tab${idx}`
  return {
    key,
    component: markRaw(
      defineComponent({
        props: {
          idx: Number,
          setCurrent: Function,
        },
        render() {
          return h("div", [
            key,
            h(
              "div",
              model.map((item, idx) => [
                h(
                  "button",
                  {
                    style: {
                      padding: "0 10px",
                    },
                    onClick: () => this.setCurrent(idx),
                  },
                  `Go to Index${idx}`
                ),
              ])
            ),
          ])
        },
      })
    ),
  }
})
const current = ref(0)
const onChange = (key: number) => {
  current.value = key
}
const Changer = defineComponent({
  render() {
    return model.map((item, idx) =>
      h(
        "button",
        {
          style: {
            padding: "5px 10px",
          },
          onClick: () => onChange(idx),
        },
        idx
      )
    )
  },
})
</script>
<template>
  <h2>基础</h2>
  <Changer />
  <div class="w-96 h-32 relative">
    <HSlideView class="bg-gray-100" :model="model" v-model:current="current" />
  </div>
  <h2>自定义内容</h2>
  <Changer />
  <div class="w-96 h-56 relative">
    <HSlideView class="bg-gray-100" :model="model" v-model:current="current">
      <template #default="slotProps">
        <div class="p-8">
          <div class="text-3xl">{{ slotProps.idx }}</div>
          <Component
            :idx="slotProps.idx"
            :is="slotProps.component"
            :setCurrent="slotProps.setCurrent"
          />
        </div>
      </template>
    </HSlideView>
  </div>
  <h2>横向</h2>
  <Changer />
  <div class="w-96 h-32 relative">
    <HSlideView
      class="bg-gray-100"
      :model="model"
      v-model:current="current"
      horizontal
    />
  </div>
  <h2>反向</h2>
  <Changer />
  <div class="w-96 h-32 relative">
    <HSlideView
      class="bg-gray-100"
      :model="model"
      v-model:current="current"
      horizontal
      reverted
    />
  </div>
</template>
