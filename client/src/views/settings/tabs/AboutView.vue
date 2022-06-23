<script setup lang="ts">
import logo from "~/assets/logo.svg"
import pkgJson from "~/../../package.json"
const version = pkgJson.version
</script>
<template>
  <div class="absolute">
    <div flex items-center>
      <img h20 :src="logo" />
      <div flex flex-col>
        <div>
          <span text-5xl>Hexon</span>
          <span ml-2>
            {{ `v${version}` }}
          </span>
        </div>
        <span text-sm op50>Made by winwin2011 with love.</span>
      </div>
    </div>
  </div>
</template>
