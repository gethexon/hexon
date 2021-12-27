<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { DialogActionType, IDialog } from "~/lib/dialog"
import { HTheme } from "~/themes"
import HButton from "../ui/button/src/HButton.vue"
const props = defineProps<{ data: IDialog }>()
function transformType(type: DialogActionType) {
  switch (type) {
    case "info":
      return "primary"

    default:
      return type
  }
}
const theme = useTheme<HTheme>()!
const closeOutside = () => {
  if (props.data.persistent) return
  props.data.close()
}
</script>
<template>
  <div
    style="
      background-color: #00000088;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    "
    @click="closeOutside"
  >
    <div class="rounded-md bg-base-1 w-96" @click.prevent.stop>
      <h2 class="p-4 text-xl font-bold text-main">{{ data.title }}</h2>
      <div class="pb-4 px-4 text-sm text-sub">{{ data.content }}</div>
      <div class="p-2 flex justify-end">
        <HButton
          class="ml-2"
          v-for="item in data.actions"
          :type="transformType(item.type)"
          :key="item.label"
          size="small"
          @click="item.run"
          >{{ item.label }}</HButton
        >
      </div>
    </div>
  </div>
</template>
