import path from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Unocss from "unocss/vite"
import presetUno from "@unocss/preset-uno"
import presetAttributify from "@unocss/preset-attributify"
import transformerDirective from "@unocss/transformer-directives"
const projectRootDir = path.resolve(__dirname, "..")

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  server: { port: 4000 },
  plugins: [
    vue(),
    Unocss({
      presets: [presetUno(), presetAttributify()],
      transformers: [transformerDirective()],
    }),
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
})
