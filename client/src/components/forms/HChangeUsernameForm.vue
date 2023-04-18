<script setup lang="ts">
import { computed, ref } from "vue"
import { HButton } from "@/ui/button/"
import { HIcon, HIconName } from "@/ui/icon"
import { HInput } from "@/ui/input"

const emits = defineEmits<{
  (e: "change-username", username: string): void
}>()
const username = ref("")
const disabled = computed(() => !username.value)
const onChange = () => emits("change-username", username.value)
</script>
<template>
  <div class="flex">
    <HInput
      class="flex-1"
      placeholder="新使用者名稱"
      type="secondary"
      v-model="username"
    >
      <template #prefix>
        <HIcon :name="HIconName.Contact" />
      </template>
    </HInput>
    <HButton class="ml-2" :disabled="disabled" @click="onChange">保存</HButton>
  </div>
</template>
