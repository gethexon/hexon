<script lang="ts" setup>
import { IRSaysListData } from "@/says/interface"
import { computed } from "vue"
import { sortSaysByTime } from "@/says/utils"
import RSaysCardItem from "@/says/RSaysCardItem.vue"
import { Waterfall } from "vue-waterfall-plugin-next"
import "vue-waterfall-plugin-next/dist/style.css"
import { useThemeVars } from "@/ui/theme"

const props = defineProps<{
  says: IRSaysListData[]
}>()
const emits = defineEmits<{
  (e: "on-click", payload: { source: string; type: "post" | "page" }): void
}>()
const says = computed(() => sortSaysByTime(props.says))

const vars = useThemeVars()
const styleVars = computed(() => {
  return {
    bgColor: vars.value.backgroundColorTransparent,
    hoverBgColor: vars.value.backgroundColorHover,
    activeBgColor: vars.value.backgroundColorActive,
    briefColor: vars.value.textColorSecondary
  }
})

const breakpoints = {
  1200: { rowPerView: 2 },
  800: { rowPerView: 1 },
  500: { rowPerView: 1 }
}
</script>

<template>
  <div class="px-2 py-2 ml-4 mr-4">
    <Waterfall :background-color="styleVars.bgColor"
               :breakpoints="breakpoints"
               :crossOrigin="false"
               :list="says"
    >
      <template #item="{ item, url, index }">
        <RSaysCardItem :index="index" :say="item" />
      </template>
    </Waterfall>
  </div>
</template>

<style lang="less" scoped>

</style>