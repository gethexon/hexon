# HNavList

## 基础

<div style="background-color:var(--color-background-c3);display:inline-block;width:200px">
<HNavList :categories="categories" :page="0" :post="0" :draft="0"></HNavList>
</div>

<script setup>
import { ref } from 'vue'
import HNavList from '../src/components/HNavList.vue'
const categories = ref([
  {
    name: "CA",
    key: "CA",
    posts: [1,2],
    children: [
      { name: "CA1", key: "CA1", posts: [1,2] },
      { name: "CA2", key: "CA2", posts: [1,2] },
    ],
  },
])
</script>
