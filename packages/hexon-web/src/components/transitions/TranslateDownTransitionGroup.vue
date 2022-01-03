<script setup lang="ts">
import anime from "animejs"

const props = withDefaults(defineProps<{ duration?: number }>(), {
  duration: 500,
})

function enter(el: Element, done: () => void) {
  anime({
    targets: el,
    opacity: 1,
    translateY: 0,
    duration: props.duration,
    easing: "easeInOutSine",
    complete: done,
  })
}
function beforeEnter(el: Element) {
  anime.set(el, {
    opacity: 0,
    translateY: -30,
  })
}
function leave(el: Element, done: () => void) {
  anime({
    targets: el,
    opacity: 0,
    duration: props.duration,
    easing: "easeInOutSine",
    complete: done,
    translateY: 30,
  })
}
</script>

<template>
  <TransitionGroup @enter="enter" @before-enter="beforeEnter" @leave="leave">
    <slot></slot>
  </TransitionGroup>
</template>
