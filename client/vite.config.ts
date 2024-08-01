import path from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import visualizer from "rollup-plugin-visualizer"
import Unocss from "unocss/vite"
import presetUno from "@unocss/preset-uno"
import presetAttributify from "@unocss/preset-attributify"
import transformerDirective from "@unocss/transformer-directives"
import Pages from "vite-plugin-pages"
import Layouts from "vite-plugin-vue-layouts"
import compression from "vite-plugin-compression"
import unused from "./find-unused-file-plugin"
const projectRootDir = path.resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4000,
    proxy: {
      "/proxy": {
        target: "http://localhost:5777",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ""),
      },
      "/api": {
        target: "http://localhost:5777",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/bilibili": {
        target: "https://api.bilibili.com/x/web-interface",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bilibili/, ""),
      },
    },
  },
  plugins: [
    vue(),
    Unocss({
      presets: [presetUno(), presetAttributify()],
      transformers: [transformerDirective()],
    }),
    unused(),
    Pages(),
    Layouts(),
    compression({ algorithm: "brotliCompress", ext: ".br" }),
  ],
  resolve: {
    alias: [
      {
        find: "~",
        replacement: path.resolve(projectRootDir, "src"),
      },
      {
        find: "@",
        replacement: path.resolve(projectRootDir, "src/components"),
      },
    ],
  },
  build: {
    rollupOptions: {
      plugins: [visualizer()],
    },
  },
})
