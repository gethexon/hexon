<script setup lang="ts">
import dayjs, { Dayjs } from "dayjs"
import { computed, ref, watch } from "vue"
import { HButtonType } from "@/ui/button"
import { HButton } from "@/ui/button"
import { HDivider } from "@/ui/divider"
import { HIconName } from "@/ui/icon"
import { HIcon } from "@/ui/icon"
import { HPopover } from "@/ui/popover"
import { useThemeVars } from "@/ui/theme"
import { getDataByDate } from "./utils"
import HSlider from "../../slider/src/HSlider.vue"
const props = defineProps<{
  date: Dayjs | null
}>()
const emits = defineEmits<{
  (e: "update:date", v: Dayjs | null): void
}>()
const vars = useThemeVars()
const internal = ref(props.date)
watch(
  () => props.date,
  (v) => {
    internal.value = v
  },
  { deep: true }
)
const data = computed(() => getDataByDate(internal.value ?? dayjs()))
const getType = (current: boolean): HButtonType => {
  return current ? "primary" : "common"
}
const onSelect = (day: Dayjs) => {
  internal.value = day
}
const title = computed(
  () => internal.value?.format("YYYY年M月") ?? "----年--月"
)
const onPreMonth = () => {
  if (!internal.value) return
  internal.value = internal.value.subtract(1, "month")
}
const onPreYear = () => {
  if (!internal.value) return
  internal.value = internal.value.subtract(1, "year")
}
const onNextMonth = () => {
  if (!internal.value) return
  internal.value = internal.value.add(1, "month")
}
const onNextYear = () => {
  if (!internal.value) return
  internal.value = internal.value.add(1, "year")
}
const show = ref(false)
const onClear = () => {
  internal.value = null
}
const onNow = () => {
  internal.value = dayjs()
}
const onFinish = () => {
  show.value = false
  emits("update:date", internal.value)
}
watch(
  () => show.value,
  (v) => {
    internal.value = props.date
  }
)
const hour = computed<number>({
  get() {
    return (internal.value?.hour() ?? 0) - 0
  },
  set(v) {
    if (!internal.value) return
    internal.value = internal.value.set("hour", v)
  },
})
const minute = computed<number>({
  get() {
    return (internal.value?.minute() ?? 0) - 0
  },
  set(v) {
    if (!internal.value) return
    internal.value = internal.value.set("minute", v)
  },
})
</script>
<template>
  <HPopover position="bottom-right" raw v-model:show="show">
    <div
      class="shadow rounded-md p-2"
      :style="{ backgroundColor: vars.backgroundColorPrimary }"
    >
      <div class="grid grid-cols-7 grid-rows-2 -mx-0.5">
        <HButton type="common" size="small" round inverted @click="onPreYear">
          <HIcon :name="HIconName.Rewind" />
        </HButton>
        <HButton type="common" size="small" round inverted @click="onPreMonth">
          <HIcon :name="HIconName.ChevronLeft" />
        </HButton>
        <div
          class="text-sm flex items-center justify-center font-bold"
          style="grid-column: 3/6"
        >
          {{ title }}
        </div>
        <HButton type="common" size="small" round inverted @click="onNextMonth">
          <HIcon :name="HIconName.ChevronRight" />
        </HButton>
        <HButton type="common" size="small" round inverted @click="onNextYear">
          <HIcon :name="HIconName.FastForward" />
        </HButton>
        <div class="text-sm flex items-center justify-center">一</div>
        <div class="text-sm flex items-center justify-center">二</div>
        <div class="text-sm flex items-center justify-center">三</div>
        <div class="text-sm flex items-center justify-center">四</div>
        <div class="text-sm flex items-center justify-center">五</div>
        <div class="text-sm flex items-center justify-center">六</div>
        <div class="text-sm flex items-center justify-center">日</div>
      </div>
      <HDivider class="my-2" />
      <div class="grid grid-cols-7 grid-rows-6">
        <template v-for="(item, idx) in data">
          <HButton
            class="m-0.5"
            :type="getType(item.current)"
            size="small"
            :inverted="!item.selected"
            round
            @click="onSelect(item.date)"
          >
            {{ item.text }}
          </HButton>
        </template>
      </div>
      <HDivider class="my-2" />
      <HSlider style="height: 20px" :min="0" :max="23" v-model:value="hour">
        {{ `${hour} 时` }}
      </HSlider>
      <HSlider style="height: 20px" :min="0" :max="59" v-model:value="minute">
        {{ `${minute} 分` }}
      </HSlider>
      <HDivider class="my-2" />
      <div class="flex justify-end">
        <HButton size="small" type="error" inverted @click="onClear">
          清空
        </HButton>
        <HButton class="mx-2" size="small" @click="onNow">此刻</HButton>
        <HButton size="small" @click="onFinish">完成</HButton>
      </div>
    </div>
  </HPopover>
</template>
