import path from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import visualizer from "rollup-plugin-visualizer"
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
    },
  },
  plugins: [
    vue(),
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
