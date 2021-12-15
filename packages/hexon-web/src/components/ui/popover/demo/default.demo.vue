<script setup lang="ts">
import { reactive, ref } from "vue"
import { HPopover } from ".."
import { HButton } from "~/components/ui/button"

const show = ref(false)
const position = reactive({
  topLeft: false,
  top: false,
  topRight: false,
})
</script>
<template>
  <HButton @click="show = true">
    点我
    <HPopover :show="show" @on-hide="show = false">
      <div class="border-2 border-black border-solid bg-white">
        这是一个提示
      </div>
    </HPopover>
  </HButton>
  <h2>不同位置</h2>
  <HButton @click="position.topLeft = true">
    top-left
    <HPopover
      :show="position.topLeft"
      @on-hide="position.topLeft = false"
      position="top-left"
    >
      <div class="border-2 border-black border-solid bg-white">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
    </HPopover>
  </HButton>
  <HButton @click="position.top = true">
    top
    <HPopover
      :show="position.top"
      @on-hide="position.top = false"
      position="top-left"
    >
      <div class="border-2 border-black border-solid bg-white">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
    </HPopover>
  </HButton>
  <HButton @click="position.topRight = true">
    top-right
    <HPopover
      :show="position.topRight"
      @on-hide="position.topRight = false"
      position="top-left"
    >
      <div class="border-2 border-black border-solid bg-white">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
    </HPopover>
  </HButton>
</template>
