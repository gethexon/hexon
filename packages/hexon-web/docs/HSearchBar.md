# HSearchBar

## 基础

<div style="background-color:var(--color-background-base3);display:inline-block;width:300px">
<HSearchBar v-model="value"></HSearchBar>
</div>

<script setup>
import { ref } from 'vue'
import HSearchBar from '../src/components/HSearchBar.vue'
import HButton from '../src/components/HButton.vue'
const value = ref('')
</script>
