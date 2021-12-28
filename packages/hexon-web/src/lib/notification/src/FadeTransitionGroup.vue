<script setup lang="ts">
import anime from "animejs"
import { computed, getCurrentInstance } from "vue"

const props = withDefaults(defineProps<{ duration?: number }>(), {
  duration: 200,
})

function enter(el: Element, done: () => void) {
  anime({
    targets: el,
    opacity: 1,
    duration: props.duration,
    easing: "easeInOutSine",
    complete: done,
  })
}
function beforeEnter(el: Element) {
  anime.set(el, {
    opacity: 0,
  })
}
function leave(el: Element, done: () => void) {
  anime({
    targets: el,
    opacity: 0,
    duration: props.duration,
    easing: "easeInOutSine",
    complete: done,
  })
}
const instance = getCurrentInstance()!
const transition = computed(() => `all ${props.duration}ms`)
</script>

<template>
  <TransitionGroup
    @enter="enter"
    @before-enter="beforeEnter"
    @leave="leave"
    move-class="notification-fade-move"
    v-bind="instance.attrs"
  >
    <slot></slot>
  </TransitionGroup>
</template>
<style>
.notification-fade-move {
  transition: v-bind("transition");
}
</style>
