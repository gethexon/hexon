<script setup lang="ts">
import { toRefs } from "vue";
import { useThemeController } from "../lib/theme";

const props = withDefaults(defineProps<{ show?: boolean }>(), { show: false });
const { show } = toRefs(props);
const theme = useThemeController();
const styles = theme?.styles;
</script>
<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-if="show"
        style="
          background-color: #00000088;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        "
        :style="styles"
      >
        <slot />
      </div>
    </transition>
  </teleport>
</template>
<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
