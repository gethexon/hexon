# HViewerHeader

<HViewerHeader :title="title" :raw="raw"></HViewerHeader>

<script setup>
import { computed } from 'vue'
import HViewerHeader from '../src/components/HViewerHeader.vue'
import raw from './hexo-example'
const title = computed(()=>'Hello World')
</script>
