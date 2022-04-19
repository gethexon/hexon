# HNavSetting

## 基础

<div style="background-color:var(--color-background-base3);display:inline-block;width:200px">
<HNavSetting></HNavSetting>
</div>

## 用户名

<div style="background-color:var(--color-background-base3);display:inline-block;width:200px">
<HNavSetting name="小王"></HNavSetting>
</div>

## 使用 icon

<div style="background-color:var(--color-background-base3);display:inline-block;width:200px">
<HNavSetting name="小王" icon></HNavSetting>
</div>

## 模态窗

<div style="background-color:var(--color-background-base3);display:inline-block;width:200px">
<HNavSetting name="小王" icon @click="onClick">
<HModal :show="show">
<div style="height:100px; width:200px; background: white;" class="flex items-center justify-center">
<HButton @click="onClose">
关闭
</HButton>
</div>
</HModal>
</HNavSetting>
</div>

<script setup>
import { ref } from 'vue'
import HNavSetting from '../src/components/HNavSetting.vue'
import HButton from '../src/components/HButton.vue'
import HModal from '../src/components/HModal.vue'
const show = ref(false)
const onClick = () => { show.value = true }
const onClose = () => { show.value = false }
</script>
