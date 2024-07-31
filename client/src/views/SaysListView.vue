<script lang="ts" setup>
import RSaysCardList from "@/says/RSaysCardList.vue"
import { useMainStore } from "~/store/main"
import { onMounted } from "vue"

const mainStore = useMainStore()
onMounted(async () => {
  await mainStore.getSaysData()
})
</script>

<template>
  <RSaysCardList
    :says="mainStore.saysList"
  />
</template>

<style lang="less" scoped>

</style>