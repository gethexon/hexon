<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { ref } from "vue"
import { HTheme } from "~/themes"
import { HInput } from ".."
import { HIcon, HIconName } from "../../icon"
const value = ref("")
const theme = useTheme<HTheme>()!
const base3 = `background-color: ${theme.value.color.background.base3}`
const base2 = `background-color: ${theme.value.color.background.base2}`
</script>
<template>
  <h2>基础</h2>

  <div class="h-input-container" :style="base3">
    <HInput v-model="value" placeholder="type something"> </HInput>
  </div>

  <h2>带前缀</h2>

  <div class="h-input-container" :style="base3">
    <HInput v-model="value" placeholder="type something">
      <template v-slot:prefix>
        <HIcon :name="HIconName.Search" />
      </template>
    </HInput>
  </div>

  <h2>可清空</h2>

  <div class="h-input-container" :style="base3">
    <HInput v-model="value" placeholder="type something" clearable> </HInput>
  </div>

  <h2>类型</h2>

  <h3>Primary</h3>

  <div class="h-input-container" :style="base3">
    <HInput
      v-model="value"
      placeholder="type something"
      type="primary"
      clearable
    >
    </HInput>
  </div>

  <h3>Secondary</h3>

  <div class="h-input-container" :style="base2">
    <HInput
      v-model="value"
      placeholder="type something"
      type="secondary"
      clearable
    >
    </HInput>
  </div>
</template>

<style scope>
.h-input-container {
  margin: 5px 0;
  padding: 20px;
}
</style>
