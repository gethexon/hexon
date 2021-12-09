<script setup lang="ts">
import { ref } from "vue"
import { useTheme } from "@winwin/vue-global-theming"
import HInput from "@/HInput.vue"
import HIcon from "@/HIcon.vue"
import { HIconName } from "../HIconName"
import { HTheme } from "~/themes"
import HButton from "../HButton.vue"
import logo from "~/assets/logo-invert.svg"
import { randomString } from "~/utils"
import { IFormData } from "../types"
const formData = ref<IFormData>({
  username: "",
  password: "",
  password2: "",
  secret: randomString(),
  expiresIn: "1",
  refreshableIn: "7",
})
const emits = defineEmits<{
  (e: "on-back"): void
  (e: "on-submit", value: IFormData): void
}>()
const validate = (): boolean => {
  return true
}
const onSubmit = () => {
  if (validate()) emits("on-submit", formData.value)
}
const theme = useTheme<HTheme>()!
</script>
<template>
  <form
    @submit.prevent="onSubmit"
    class="h-install-form flex flex-col select-none"
  >
    <div class="flex mb-6">
      <div
        class="text-3xl font-light flex-1"
        :style="{ color: theme.color.white }"
      >
        欢迎使用 Hexon
      </div>
      <img :src="logo" alt="logo" class="h-12 inline-block" />
    </div>
    <div class="inputs flex">
      <div class="mr-6 w-64">
        <HInput
          placeholder="用户名"
          v-model="formData.username"
          class="my-3"
          clearable
        >
          <template v-slot:prefix>
            <HIcon :name="HIconName.Contact" />
          </template>
        </HInput>
        <HInput
          placeholder="密码"
          v-model="formData.password"
          attrType="password"
          class="my-3"
          clearable
        >
          <template v-slot:prefix>
            <HIcon :name="HIconName.Lock" />
          </template>
        </HInput>
        <HInput
          placeholder="重复输入密码"
          v-model="formData.password2"
          attrType="password"
          class="my-3"
          clearable
        >
          <template v-slot:prefix>
            <HIcon :name="HIconName.Lock" />
          </template>
        </HInput>
      </div>
      <div class="w-64">
        <HInput
          placeholder="密钥"
          v-model="formData.secret"
          class="my-3"
          clearable
        >
          <template v-slot:prefix>
            <HIcon :name="HIconName.PasswordKeyHide" />
          </template>
        </HInput>
        <HInput
          placeholder="过期时间"
          v-model="formData.expiresIn"
          class="my-3"
          attrType="number"
          clearable
        >
          <template v-slot:prefix>
            <HIcon :name="HIconName.SetHistoryStatus" />
          </template>
        </HInput>
        <HInput
          placeholder="过期时间"
          v-model="formData.refreshableIn"
          class="my-3"
          attrType="number"
          clearable
        >
          <template v-slot:prefix>
            <HIcon :name="HIconName.SetHistoryStatus2" />
          </template>
        </HInput>
      </div>
    </div>
    <div class="flex">
      <HButton
        class="mt-4 mr-4"
        round
        @click="emits('on-back')"
        attrType="button"
      >
        <HIcon :name="HIconName.ChevronLeft" />
      </HButton>
      <HButton class="mt-4 flex-1" attrType="submit">
        开始安装
        <HIcon :name="HIconName.ChevronRight" />
      </HButton>
      <HButton class="mt-4 ml-4" round attrType="button">
        <HIcon :name="HIconName.Help" />
      </HButton>
    </div>
  </form>
</template>
<style lang="less" scoped>
.h-install-form {
  .inputs > div {
  }
}
</style>
