# HMonacoEditor

## 基础

<div class="w-full h-80 border">
<HMonacoEditor :value="content" :id="source"/>
</div>

<script setup>
import { ref } from 'vue'
import HMonacoEditor from '../src/components/Editors/HMonacoEditor.vue'
import markdown from './hexo-example'
const content = ref(markdown.split('---')[2].trim())
const source = ref('12')
</script>
