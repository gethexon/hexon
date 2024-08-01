<script lang="ts" setup>
import RSaysCardList from "@/says/RSaysCardList.vue"
import { useMainStore } from "~/store/main"
import { onMounted } from "vue"
import { IRSaysListData } from "@/says/interface"

const mainStore = useMainStore()
onMounted(async () => {
  await mainStore.getSaysData()
})
const emits = defineEmits<{
  (e: "on-edit", payload: { say: IRSaysListData }): void
  (e: "on-delete", payload: { say: IRSaysListData }): void
}>()
const handleEdit = (payload: { say: IRSaysListData }) => {
  emits("on-edit", payload)
}
const handleDelete = (payload: { say: IRSaysListData }) => {
  emits("on-delete", payload)
}
</script>

<template>
  <RSaysCardList
    :says="mainStore.saysList"
    @on-edit="handleEdit"
    @on-delete="handleDelete"
  />
</template>

<style lang="less" scoped>

</style>