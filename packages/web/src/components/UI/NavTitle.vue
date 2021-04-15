<template>
  <q-item class="nav-title">
    <q-item-section>
      <q-item-label class="ellipsis">{{ text }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "NavTitle",
  props: {
    text: String
  }
};
</script>
<style lang="scss">
.nav-title {
  margin: 2px 8px 2px 16px;
  padding: 0 8px 0 16px;
  border-radius: 6px;
  color: $l-text-1;
  font-weight: bolder;
}
.body--dark .nav-title {
  color: $d-text-1;
}
</style>
