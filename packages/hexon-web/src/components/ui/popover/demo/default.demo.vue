<script setup lang="ts">
import { HPopover } from ".."
import { HButton } from "~/components/ui/button"
import { useTheme } from "@winwin/vue-global-theming"
import { HTheme } from "~/themes"

const theme = useTheme<HTheme>()!
</script>
<template>
  <h2>基础</h2>
  <HButton>
    点我
    <HPopover>
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </HPopover>
  </HButton>
  <h2>不同位置</h2>
  <HButton>
    top-left
    <HPopover position="top-left">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </HPopover>
  </HButton>
  <HButton>
    top
    <HPopover position="top">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </HPopover>
  </HButton>
  <HButton>
    top-right
    <HPopover position="top-right">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </HPopover>
  </HButton>
  <h2>Trigger</h2>
  <HButton>
    hover
    <HPopover position="top-left" trigger="hover">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </HPopover>
  </HButton>
  <HButton>
    click
    <HPopover position="top-left" trigger="click">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </HPopover>
  </HButton>
  <h2>自定义内容</h2>
  <HButton>
    RAW
    <HPopover position="top-left" trigger="click" raw>
      <div class="bg-red-500 p-5">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
    </HPopover>
  </HButton>
</template>
