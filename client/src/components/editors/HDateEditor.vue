<script setup lang="ts">
import { Dayjs } from "dayjs"
import { computed } from "vue"
import { createClassNames } from "~/utils/create-classnames"
import { HDatePicker } from "@/ui/date-picker"
import { useThemeVars } from "@/ui/theme"
import { DATE_FORMAT } from "@shared/constants";

const props = defineProps<{
  date: Dayjs | null
}>()
const emits = defineEmits<{
  (e: "update:date", v: Dayjs | null): void
}>()
const { classNames } = createClassNames("h-date-editor")
const vars = useThemeVars()
const text = computed(() =>
  props.date ? props.date.format(DATE_FORMAT) : "未指定数据"
)
const onPickDate = (date: Dayjs | null) => {
  emits('update:date', date);
}
</script>
<template>
  <div :class="classNames" class="px-4">
    <div
      class="content px-4 rounded-2xl flex items-center text-sm cursor-pointer select-none"
    >
      <div>
        {{ text }}
      </div>
      <HDatePicker
        :date="props.date"
        @update:date="onPickDate"
      />
    </div>
  </div>
</template>
<style lang="less">
.h-date-editor {
  .content {
    height: 30px;
    background-color: v-bind("vars.backgroundColorPrimary");
    color: v-bind("vars.textColorPrimary");
  }
}
</style>
