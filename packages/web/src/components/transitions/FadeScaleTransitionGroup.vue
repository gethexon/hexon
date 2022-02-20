<script setup lang="ts">
import anime from "animejs"

const props = withDefaults(defineProps<{ duration?: number }>(), {
  duration: 100,
})

async function enter(el: Element, done: () => void) {
  const a1 = anime({
    targets: el,
    opacity: 1,
    duration: props.duration,
    easing: "easeInOutSine",
  }).finished
  const child = el.children[0].children[0]!
  const a2 = anime({
    targets: child,
    scale: 1,
    duration: props.duration,
    easing: "easeInOutSine",
  }).finished
  Promise.all([a1, a2]).then(done)
}
function beforeEnter(el: Element) {
  anime.set(el, {
    opacity: 0,
  })
  const child = el.children[0].children[0]!
  anime.set(child, {
    scale: 0.95,
  })
}
function leave(el: Element, done: () => void) {
  const a1 = anime({
    targets: el,
    opacity: 0,
    duration: props.duration,
    easing: "easeInOutSine",
  }).finished
  const child = el.children[0].children[0]!
  const a2 = anime({
    targets: child,
    scale: 0.95,
    duration: props.duration,
    easing: "easeInOutSine",
  }).finished
  Promise.all([a1, a2]).then(done)
}
</script>

<template>
  <TransitionGroup @enter="enter" @before-enter="beforeEnter" @leave="leave">
    <slot></slot>
  </TransitionGroup>
</template>
