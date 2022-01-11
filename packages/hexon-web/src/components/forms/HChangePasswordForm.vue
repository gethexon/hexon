<script setup lang="ts">
import { computed, ref } from "vue"
import { HButton } from "@/ui/button/"
import { HIcon, HIconName } from "@/ui/icon"
import { HInput } from "@/ui/input"
import { IChangePasswordFormPayload } from "./interface"
import HPopover from "../ui/popover/src/HPopover.vue"

const emits = defineEmits<{
  (e: "change-password", payload: IChangePasswordFormPayload): void
}>()
const oldPassword = ref("")
const newPassword = ref("")
const verifyPassword = ref("")
const isSame = computed(() => newPassword.value === verifyPassword.value)
const error = computed(() => {
  if (!verifyPassword.value) return ""
  return !isSame.value ? "两次密码不同" : ""
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
      placeholder="旧密码"
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
      placeholder="新密码"
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
      placeholder="重复新密码"
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
        更改密码
      </HButton>
      <HButton inverted>
        忘记密码
        <HPopover position="bottom-left">
          <div class="text-xs max-w-sm">
            将 hexon/packages/server/data/common.db 中 userinfo.password 改为
            d033e22ae348aeb5660fc2140aec35850c4da997 即可将密码重置为 admin
          </div>
        </HPopover>
      </HButton>
    </div>
  </div>
</template>
