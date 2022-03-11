<script setup lang="ts">
import { ref } from "vue"
import anime from "animejs"
import { DialogActionType, IDialog } from "~/lib/dialog"
import { HButtonType } from "@/ui/button/src/interface"
import HButton from "@/ui/button/src/HButton.vue"
import { useThemeVars } from "@/ui/theme"
import { HBaseModal } from "@/ui/modal"
const props = defineProps<{ data: IDialog }>()
function transformType(type: DialogActionType): HButtonType {
  switch (type) {
    case "info":
      return "primary"
    default:
      return type
  }
}
const onClose = () => props.data.close()
const vars = useThemeVars()
</script>
<template>
  <HBaseModal @on-close="onClose">
    <div
      class="rounded-md w-96"
      :style="{ backgroundColor: vars.backgroundColorTertiary }"
    >
      <h2 class="p-4 text-xl font-bold">{{ data.title }}</h2>
      <div
        class="pb-4 px-4 text-sm"
        :style="{ color: vars.textColorSecondary }"
      >
        {{ data.content }}
      </div>
      <div class="p-2 flex justify-end">
        <HButton
          class="ml-2"
          v-for="item in data.actions"
          :type="transformType(item.type)"
          :key="item.label"
          size="small"
          @click="item.run"
        >
          {{ item.label }}
        </HButton>
      </div>
    </div>
  </HBaseModal>
</template>
