<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { computed, onMounted, ref } from "vue"
import { AsyncQueue } from "~/lib/async-queue"
import { HTheme } from "~/themes"
import { HIcon } from "@/ui/icon"
import { HIconName } from "@/ui/icon/src/interface"
const props = defineProps<{
  next: () => void
}>()
const theme = useTheme<HTheme>()!
const styleVars = computed(() => {
  return {
    bgColor: theme.value.color.primary.n,
    color: theme.value.color.white,
  }
})
const animate = new AsyncQueue()
animate.sleep(2.25)
"Hexo".split("").map((v, idx) => {
  if (idx > 0) animate.sleep(0.075)
  animate.exec(() => {
    hexoText.value += v
  })
})
animate.sleep(1.5)
" online".split("").map((v, idx) => {
  if (idx > 0) animate.sleep(0.075)
  animate.exec(() => {
    onlineText.value += v
  })
})
animate.sleep(1.5)
animate.interval(
  () => {
    onlineText.value = onlineText.value.slice(0, onlineText.value.length - 1)
  },
  0.05,
  7
)
animate.interval(
  () => {
    hexoText.value = hexoText.value.slice(0, hexoText.value.length - 1)
  },
  0.05,
  4
)
animate.sleep(0.075)
"Hexon".split("").map((v, idx) => {
  if (idx > 0) animate.sleep(0.075)
  animate.exec(() => {
    hexoText.value += v
  })
})
"line".split("").map((v, idx) => {
  if (idx > 0) animate.sleep(0.075)
  animate.exec(() => {
    lineText.value += v
  })
})
animate.sleep(1.5)
animate.interval(
  () => {
    lineText.value = lineText.value.slice(0, lineText.value.length - 1)
  },
  0.25,
  4
)
animate.sleep(1.5)
animate.exec(() => {
  hexoText.value += "."
})
animate.sleep(1.5)
animate.exec(() => {
  opacity.value = 1
})

const hexoText = ref("")
const onlineText = ref("")
const lineText = ref("")
onMounted(() => {
  animate.start()
})
const opacity = ref(0)
</script>
<template>
  <div
    class="install-welcome w-full h-full flex flex-col items-center justify-center select-none"
  >
    <h1 class="text-6xl relative font-light">
      {{ hexoText }}
      <span>{{ onlineText }}</span>
      <span>{{ lineText }}</span>
      {{ "\u200b" }}
    </h1>
    <button
      class="mt-11 transition-opacity"
      :style="`opacity: ${opacity}`"
      @click="props.next"
    >
      现在开始
      <HIcon :name="HIconName.ChevronRight" />
    </button>
  </div>
</template>
<style lang="less" scoped>
.install-welcome {
  background-color: v-bind("styleVars.bgColor");
  color: v-bind("styleVars.color");
  h1::after {
    content: "";
    background-color: v-bind("styleVars.color");
    @apply absolute h-full w-1 mr-2;
    animation: bling 0.75s ease-in-out infinite;
  }
}

@keyframes bling {
  0%,
  100% {
    @apply opacity-0;
  }
  50% {
    @apply opacity-100;
  }
}
</style>
