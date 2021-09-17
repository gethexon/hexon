<template>
  <span
    :style="{
      display: 'inline-flex',
      alignItems: 'center',
    }"
  >
    {{ "\u200b" }}<slot></slot>
  </span>
</template>
