<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming"
import { ref } from "vue"
import { install } from "~/api"
import { HTheme } from "~/themes"
import { forceReloadWindow } from "~/utils"
import { IFormData } from "@/types"
import { HIcon } from "@/ui/icon"
import { HIconName } from "@/ui/icon/src/interface"
import HInstallForm from "@/forms/HInstallForm.vue"
const props = defineProps<{
  prev: () => void
}>()
const installing = ref(false)
const onSubmit = async (data: IFormData) => {
  const { password2, ...info } = data
  // TODO 表单验证
  installing.value = true
  try {
    await install({
      username: info.username,
      password: info.password,
      secret: info.secret,
      // FIXME 如何让 HInput 同时支持 string 和 number
      expiresIn: info.expiresIn as unknown as number,
      refreshableIn: info.refreshableIn as unknown as number,
    })
    forceReloadWindow()
  } catch (err) {
    installing.value = false
    // TODO 安装失败后的提示
    throw err
  }
}
const theme = useTheme<HTheme>()!
</script>
<template>
  <div class="w-full h-full relative flex flex-col items-center justify-center">
    <HInstallForm @on-submit="onSubmit" @on-back="prev" />
    <div
      class="absolute top-0 left-0 bottom-0 right-0 transition-opacity z-10 flex items-center justify-center text-4xl"
      :style="{
        backgroundColor: theme.color.primary.n,
        opacity: installing ? 0.9 : 0,
        ...(!installing && {
          pointerEvents: 'none',
        }),
      }"
    >
      <HIcon class="rotating" :name="HIconName.Refresh" />
    </div>
  </div>
</template>
<style lang="less" scope>
.rotating {
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
