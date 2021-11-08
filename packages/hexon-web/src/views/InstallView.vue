<script setup lang="ts">
import { useTheme } from "@winwin/vue-global-theming";
import { ref } from "vue";
import { install } from "~/api";
import HInstallForm from "~/components/forms/HInstallForm.vue";
import { IFormData } from "~/components/types";
import { HTheme } from "~/themes";
import { forceReloadWindow } from "~/utils";
import HIcon from "~/components/HIcon.vue";
import { HIconName } from "~/components/HIconName";
const props = defineProps<{
  prev: () => void;
}>();
const installing = ref(false);
const onSubmit = async (data: IFormData) => {
  const { password2, ...info } = data;
  installing.value = true;
  try {
    await install(info);
    forceReloadWindow();
  } catch (err) {
    installing.value = false;
    throw err;
  }
};
const theme = useTheme<HTheme>()!;
</script>
<template>
  <div class="w-full h-full relative flex flex-col items-center justify-center">
    <HInstallForm @on-submit="onSubmit" @on-back="prev" />
    <div
      class="
        absolute
        top-0
        left-0
        bottom-0
        right-0
        transition-opacity
        z-10
        flex
        items-center
        justify-center
        text-4xl
      "
      :style="{
        backgroundColor: theme.color.primary.n,
        opacity: installing ? 0.9 : 0,
        pointerEvents: installing ? '' : 'none',
      }"
    >
      <HIcon class="rotating" :name="HIconName.Refresh" />
    </div>
  </div>
</template>
<style lang="less" scopr>
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
