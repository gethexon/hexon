<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { bilibiliVideoInfoAPI } from "~/api/says"

const props = defineProps<{
  bvid: string
}>()

const video = ref<string>()

const base = "//player.bilibili.com/player.html?"

const init = async () => {
  const res = await bilibiliVideoInfoAPI(props.bvid)
  const aid = res.data.data.aid
  const cid = res.data.data.cid
  video.value = base + "aid=" + aid + "&bvid=" + props.bvid + "&cid=" + cid + "&page=1&high_quality=1&danmaku=0&autoplay=0"
}

onMounted(() => {
  init()
})
</script>

<template>
  <iframe :src="video" allowfullscreen="allowfullscreen" frameborder="0" height="250" sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts" scrolling="no"
          width="100%"></iframe>
</template>

<style lang="less" scoped>

</style>