# HInput

## 基础

<div class="h-input-container" style="background-color: var(--color-background-c3);">
<HInput v-model="value" placeholder="type something">
</HInput>
</div>

## 带前缀

<div class="h-input-container" style="background-color: var(--color-background-c3);">
<HInput v-model="value" placeholder="type something">
<template v-slot:prefix>
<HIcon :name="HIconName.Search"/>
</template>
</HInput>
</div>

## 可清空

<div class="h-input-container" style="background-color: var(--color-background-c3);">
<HInput v-model="value" placeholder="type something" clearable>
</HInput>
</div>

## 类型

### Primary

<div class="h-input-container" style="background-color: var(--color-background-c9);">
<HInput v-model="value" placeholder="type something" type="primary" clearable>
</HInput>
</div>
<div class="h-input-container" style="background-color: var(--color-background-c3);">
<HInput v-model="value" placeholder="type something" type="primary" clearable>
</HInput>
</div>

### Secondary

<div class="h-input-container" style="background-color: var(--color-background-c2);">
<HInput v-model="value" placeholder="type something" type="secondary" clearable>
</HInput>
</div>

<script setup>
import { ref } from 'vue'
import HInput from '../src/components/HInput.vue'
import HIcon from '../src/components/HIcon.vue'
import { HIconName } from '../src/components/HIconName'
const value = ref('')
</script>
<style scope>
.h-input-container{
  margin: 5px 0;
  padding:20px;
}
</style>
