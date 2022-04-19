<script setup lang="ts">
import { ref } from "vue"
import { HButton } from "@/ui/button"
import { HSlider } from ".."
const value = ref(0)
const hour = ref(0)
const minute = ref(0)
const pad = (n: number) => `0${n}`.slice(-2)
</script>
<template>
  <h2>基础</h2>
  <HButton size="small" round @click="value += 1">+</HButton>
  <HButton size="small" round @click="value -= 1">-</HButton>
  <HSlider :min="0" :max="23" v-model:value="value" />
  <HSlider :min="0" :max="23" v-model:value="value" />
  <h2>看看几点了</h2>
  <HSlider :min="0" :max="23" v-model:value="hour" />
  <HSlider :min="0" :max="59" v-model:value="minute" />
  {{ `${pad(hour)}:${pad(minute)}` }}
</template>
