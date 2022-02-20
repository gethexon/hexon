<script setup lang="ts">
import { HButton } from "@/ui/button"
import dayjs from "dayjs"
import { ref } from "vue"
import { HDatePicker } from "../"
const date = ref(dayjs())
</script>
<template>
  {{ date?.toISOString() ?? "--" }}
  <HButton>
    点我
    <HDatePicker v-model:date="date" />
  </HButton>
</template>
