<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { HIcon, HIconName } from "@/ui/icon"
import { HBadge } from "@/ui/badge"
import { HInput } from "@/ui/input"
import { useThemeVars } from "@/ui/theme"
import { uniq } from "lodash-es"
const props = defineProps<{
  availableCats: string[]
  categories: string[]
}>()
const emits = defineEmits<{
  (e: "update:categories", v: string[]): void
}>()
const newCat = ref("")
const categories = ref<string[]>(props.categories)
const allCategories = computed(() => {
  return uniq(categories.value.concat(props.availableCats)).sort()
})
watch(
  () => props.categories,
  (v) => {
    categories.value = v
  },
  {
    deep: true,
  }
)
watch(
  () => categories.value,
  (v) => {
    emits("update:categories", v)
  },
  {
    deep: true,
  }
)
// setTimeout(() => {
//   categories.value.push("1")
// }, 1000)
const onNewCat = () => {
  if (newCat.value) {
    // categories.value = [newCat.value]
    categories.value.push(newCat.value)
    newCat.value = ""
  }
}
const onAddCat = (cat: string) => {
  categories.value.push(cat)
}
const onRemoveCat = (idx: number) => {
  categories.value.splice(idx, 1)
}
const vars = useThemeVars()
</script>
<template>
  <div class="px-4">
    <div class="mb-2 text-xs">
      <template v-for="(item, idx) in categories">
        <HIcon class="mb-0.5" :name="HIconName.ChevronRight" v-if="idx" />
        <HBadge class="mb-0.5" rounded clickable @click="onRemoveCat(idx)">
          {{ item }}
          <HIcon :name="HIconName.Cancel" />
        </HBadge>
      </template>
    </div>
    <div class="mb-2 text-xs">
      <HBadge
        class="mr-1 mb-0.5"
        rounded
        clickable
        :color="vars.textColorPrimary"
        :bg-color="vars.backgroundColorPrimary"
        v-for="cat in allCategories"
        @click="onAddCat(cat)"
      >
        {{ cat }}
        <HIcon :name="HIconName.Add" />
      </HBadge>
    </div>
    <HInput
      class="mt-2"
      v-model="newCat"
      placeholder="新分类"
      @keydown.enter="onNewCat"
    >
      <template #suffix>
        <HIcon :name="HIconName.Add" clickable @click="onNewCat" />
      </template>
    </HInput>
  </div>
</template>
