# HHeaderEditor

## 基础

<div class="border">
<HHeaderEditor :value="value" @update:value="onUpdate"></HHeaderEditor>
</div>

<script setup>
import { ref } from 'vue'
import HHeaderEditor from '../src/components/Editors/HHeaderEditor.vue'
const value = ref('Hello World')
const onUpdate = (v) => {
  value.value = v
}
</script>
