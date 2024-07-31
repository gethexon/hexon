<script lang="ts" setup>
import APlayer from "APlayer"
import "aPlayer/dist/APlayer.min.css"
import { nextTick, onMounted, ref } from "vue"
import { metingAPI } from "~/api/says"
import { IRMusicItem } from "@/says/interface"

const props = defineProps<{
  server: string
  type: string
  id: number
}>()

const playerRef = ref()
let ap: APlayer
const audioList = ref<IRMusicItem[]>([])

const init = async () => {
  const res = await metingAPI(props.server, props.type, props.id)
  const audio: IRMusicItem = {
    artist: res.data[0].artist,
    name: res.data[0].name,
    url: res.data[0].url,
    cover: res.data[0].pic,
    lrc: res.data[0].lrc
  }
  audioList.value.push(audio)
  ap = new APlayer({
    container: playerRef.value,
    audio: audioList.value
  })
}

onMounted(() => {
  nextTick(() => {
    init()
  })
})
</script>

<template>
  <div ref="playerRef"></div>
</template>

<style lang="less" scoped>

</style>