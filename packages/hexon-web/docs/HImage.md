---
sidebarDepth: 1
---

# HImage

## 不同大小

<HImage :src="logo" size="100px"></HImage>
<HImage :src="logo" size="200px"></HImage>
<HImage :src="logo" size="300px"></HImage>

<script setup>
import HImage from '../src/components/HImage.vue'
import logo from "../src/assets/logo.svg";
</script>
