<script setup lang="ts">
import anime from "animejs"

const props = withDefaults(defineProps<{ duration?: number }>(), {
  duration: 100,
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
</script>

<template>
  <TransitionGroup @enter="enter" @before-enter="beforeEnter" @leave="leave">
    <slot></slot>
  </TransitionGroup>
</template>
