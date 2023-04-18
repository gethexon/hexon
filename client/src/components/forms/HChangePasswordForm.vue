<script setup lang="ts">
import { computed, ref } from "vue"
import { HButton } from "@/ui/button/"
import { HIcon, HIconName } from "@/ui/icon"
import { HInput } from "@/ui/input"
import { HPopover } from "@/ui/popover"
import { IChangePasswordFormPayload } from "./interface"

const emits = defineEmits<{
  (e: "change-password", payload: IChangePasswordFormPayload): void
}>()
const oldPassword = ref("")
const newPassword = ref("")
const verifyPassword = ref("")
const isSame = computed(() => newPassword.value === verifyPassword.value)
const error = computed(() => {
  if (!verifyPassword.value) return ""
  return !isSame.value ? "兩個密碼不同" : ""
})
const disabled = computed(
  () =>
    !!error.value ||
    !oldPassword.value ||
    !newPassword.value ||
    !verifyPassword.value
)
const onChange = () =>
  emits("change-password", {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
  })
</script>
<template>
  <div>
    <HInput
      attr-type="password"
      placeholder="舊密碼"
      type="secondary"
      v-model="oldPassword"
      error=""
    >
      <template #prefix>
        <HIcon :name="HIconName.Lock" />
      </template>
    </HInput>
    <HInput
      attr-type="password"
      placeholder="新密碼"
      type="secondary"
      v-model="newPassword"
      :error="error"
    >
      <template #prefix>
        <HIcon :name="HIconName.Lock" />
      </template>
    </HInput>
    <HInput
      attr-type="password"
      placeholder="確認新密碼"
      type="secondary"
      v-model="verifyPassword"
      :error="error"
    >
      <template #prefix>
        <HIcon :name="HIconName.Lock" />
      </template>
    </HInput>
    <div class="mt-2">
      <HButton class="mr-2" :disabled="disabled" @click="onChange">
        更改密碼
      </HButton>
      <HButton inverted>
        忘記密碼
        <HPopover position="bottom-left">
          <div class="text-xs max-w-sm">
            執行
            <span class="font-mono">`pnpm resetpwd`</span>
            重置密碼
          </div>
        </HPopover>
      </HButton>
    </div>
  </div>
</template>
