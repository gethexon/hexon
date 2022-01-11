<script setup lang="ts">
import anime from "animejs"
import { TranslateTransitionDirection } from "./interface"

const props = withDefaults(
  defineProps<{
    direction: TranslateTransitionDirection
    duration?: number
  }>(),
  {
    duration: 100,
  }
)

const map: {
  [key in TranslateTransitionDirection]: {
    beforeEnter: any
    leave: any
  }
} = {
  up: {
    beforeEnter: {
      translateY: 30,
    },
    leave: {
      translateY: -30,
    },
  },
  down: {
    beforeEnter: {
      translateY: -30,
    },
    leave: {
      translateY: 30,
    },
  },
  left: {
    beforeEnter: {
      translateX: 30,
    },
    leave: {
      translateX: -30,
    },
  },
  right: {
    beforeEnter: {
      translateX: -30,
    },
    leave: {
      translateX: 30,
    },
  },
}

function enter(el: Element, done: () => void) {
  anime({
    targets: el,
    opacity: 1,
    translateY: 0,
    translateX: 0,
    duration: props.duration,
    easing: "easeInOutSine",
    complete: done,
  })
}
function beforeEnter(el: Element) {
  anime.set(el, {
    opacity: 0,
    ...map[props.direction].beforeEnter,
  })
}
function leave(el: Element, done: () => void) {
  anime({
    targets: el,
    opacity: 0,
    duration: props.duration,
    easing: "easeInOutSine",
    complete: done,
    ...map[props.direction].leave,
  })
}
</script>

<template>
  <TransitionGroup @enter="enter" @before-enter="beforeEnter" @leave="leave">
    <slot></slot>
  </TransitionGroup>
</template>
