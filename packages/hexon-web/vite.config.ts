import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const projectRootDir = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 4000 },
  plugins: [vue()],
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
});
