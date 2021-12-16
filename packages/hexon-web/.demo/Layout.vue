<script setup lang="ts">
import { computed } from "vue"
import { RouterView, useRoute, useRouter } from "vue-router"
import HNavItem from "@/HNavItem.vue"
import { HIconName } from "@/ui/icon/src/interface"
import HNavTitle from "@/HNavTitle.vue"
import { getNameFromPath, modules } from "./utils"

const links = Object.entries(modules).map(([path]) => ({
  to: `/${encodeURIComponent(path)}`,
  text: getNameFromPath(path),
}))
const route = useRoute()
const router = useRouter()
const go = (path: string) => {
  router.push(path)
}
const name = computed(() => route.meta.name)
</script>
<template>
  <div class="h-full flex">
    <div class="min-h-0 h-full overflow-auto pr-8">
      <div class="py-0 pl-4 pr-2">
        <HNavTitle>Hexon UI Demo</HNavTitle>
        <HNavItem
          @click="go(link.to)"
          :icon="HIconName.Folder"
          :text="link.text"
          v-for="link in links"
          :key="link.text"
          :uppercase="false"
        />
      </div>
    </div>
    <div class="flex-1 h-full overflow-auto">
      <div class="flex flex-col max-w-screen-md mx-auto px-8 pb-16">
        <div class="demo-content">
          <h1 class="text-2xl my-8" v-if="name">{{ name }}</h1>
        </div>
        <div class="flex-1 min-h-0 w-full demo-content">
          <RouterView></RouterView>
        </div>
      </div>
    </div>
  </div>
</template>
