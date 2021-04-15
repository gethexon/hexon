<template>
  <div style="display:inline-block;" class="drop-handler">
    {{ text }}
    <q-icon name="keyboard_arrow_down" />
    <q-menu
      anchor="top middle"
      self="top middle"
      transition-hide="fade"
      transition-show="fade"
      content-style="border-radius:2px"
    >
      <slot />
    </q-menu>
  </div>
</template>

<script>
export default {
  name: "LinkDrop",
  props: ["text"],
  data() {
    return {};
  }
};
</script>
<style lang="scss">
.drop-handler {
  display: inline-block;
  line-height: 34px;
  font-size: x-small;
  &:hover {
    cursor: pointer;
  }
}
</style>
