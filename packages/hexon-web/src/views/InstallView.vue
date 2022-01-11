<script setup lang="ts">
import type { IFormData } from "@/types"
import { useTheme } from "@winwin/vue-global-theming"
import { ref } from "vue"
import { install } from "~/api"
import { useDialog } from "~/lib/dialog"
import { HTheme } from "~/themes"
import { forceReloadWindow } from "~/utils"
import { HIcon } from "@/ui/icon"
import { HIconName } from "@/ui/icon/src/interface"
import HInstallForm from "@/forms/HInstallForm.vue"
const props = defineProps<{
  idx: number
  setCurrent(next: number): void
}>()
const installing = ref(false)
const dialog = useDialog()
const onSubmit = async (data: IFormData) => {
  const { password2, ...info } = data
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
    dialog.create({
      type: "error",
      title: "安装失败",
      content:
        "详情请查看服务端安装日志（PM2）。或者你可以在 Github Issue 或 QQ 群求助。",
      actions: [
        {
          type: "info",
          label: "Github",
          run: () => {
            window.open("https://github.com/gethexon/hexon/issues", "_blank")
          },
        },
        {
          type: "info",
          label: "QQ 群",
          run: () => {
            window.open("https://jq.qq.com/?_wv=1027&k=WMYcPUiW", "_blank")
          },
        },
      ],
    })
  }
}
const theme = useTheme<HTheme>()!
const onPrev = () => {
  props.setCurrent(props.idx - 1)
}
</script>
<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <HInstallForm @on-submit="onSubmit" @on-back="onPrev" />
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
