<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { HInput } from "@/ui/input"
import { HIcon, HIconName } from "@/ui/icon"
import { HBadge } from "@/ui/badge"
import { uniq } from "lodash-es"
import { useThemeVars } from "../ui/theme"
const props = defineProps<{
  availableTags: string[]
  tags: string[]
}>()
const emits = defineEmits<{
  (e: "update:tags", tags: string[]): void
}>()
const vars = useThemeVars()
const newTag = ref("")

const tags = ref<string[]>(props.tags)
watch(
  () => props.tags,
  (ts) => {
    tags.value = ts
  }
)
watch(
  () => tags.value,
  (ts) => {
    emits("update:tags", ts)
  }
)
const allTags = computed(() => {
  return uniq(tags.value.concat(props.availableTags)).sort()
})
const selected = (tag: string) => tags.value.includes(tag)
const color = (tag: string) =>
  selected(tag) ? undefined : vars.value.textColorPrimary
const backgroundColor = (tag: string) =>
  selected(tag) ? undefined : vars.value.backgroundColorPrimary
const onClick = (tag: string) => {
  if (selected(tag)) {
    tags.value = tags.value.filter((t) => t !== tag)
  } else {
    tags.value.push(tag)
  }
}
const onAddTag = () => {
  if (!newTag.value) return
  tags.value.push(newTag.value)
  tags.value = uniq(tags.value)
  newTag.value = ""
}
</script>
<template>
  <div class="px-3">
    <div class="select-none text-sm">
      <HIcon :name="HIconName.Tag" class="mr-2" />
      <span>标签</span>
    </div>
    <div class="mt-1" v-if="allTags.length">
      <HBadge
        v-for="tag in allTags"
        :color="color(tag)"
        :bg-color="backgroundColor(tag)"
        rounded
        clickable
        @click="onClick(tag)"
      >
        {{ tag }}
      </HBadge>
      &nbsp;
    </div>
    <HInput
      class="mt-2"
      v-model="newTag"
      placeholder="新标签"
      @keydown.enter="onAddTag"
    >
      <template #suffix>
        <HIcon :name="HIconName.Add" clickable @click="onAddTag" />
      </template>
    </HInput>
  </div>
</template>
