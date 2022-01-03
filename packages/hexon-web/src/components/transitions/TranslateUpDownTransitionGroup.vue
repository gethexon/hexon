<script setup lang="ts">
import anime from "animejs"
import { computed } from "vue"

const props = withDefaults(defineProps<{ duration?: number; up: boolean }>(), {
  duration: 100,
})

const one = computed(() => (props.up ? 1 : -1))

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
    translateY: 30 * one.value,
  })
}
function leave(el: Element, done: () => void) {
  anime({
    targets: el,
    opacity: 0,
    duration: props.duration,
    easing: "easeInOutSine",
    complete: done,
    translateY: -30 * one.value,
  })
}
</script>

<template>
  <TransitionGroup @enter="enter" @before-enter="beforeEnter" @leave="leave">
    <slot></slot>
  </TransitionGroup>
</template>
